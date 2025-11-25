'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffect, useMemo, useRef } from 'react';

declare global {
  interface Window {
    __bg?: {
      lastX?: number;
      lastY?: number;
      uMouseX?: number;
      uMouseY?: number;
      mode?: string;
      allowGL?: boolean;
      canUseGL?: boolean;
    };
    __BG_DEBUG_ONCE?: number;
  }
}

type Props = Readonly<{
  density: number;
  lineWidth: number;
  intensity: number;
  sigma: number;
  lineOpacity?: number;
  dotRadiusUV?: number;
  dotFeatherUV?: number;
  showDotContinuously?: boolean;
}>;

const VERT = `
precision highp float;
void main() { gl_Position = vec4(position, 1.0); }
`;

const FRAG = `
precision highp float;
#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

uniform vec2  u_resolution;
uniform float u_time;
uniform vec2  u_mouse;        // in [0,1] with origin at bottom-left
uniform float u_density;      // contour density (lines per unit)
uniform float u_width;        // line half-width in [0,0.5]
uniform float u_intensity;    // mouse bump intensity
uniform float u_sigma;        // mouse bump sigma (in field space)
uniform float u_lineOpacity;  // alpha for contour lines
uniform float u_dotR;         // dot radius in UV units
uniform float u_dotFeather;   // feather in UV units
uniform vec2  u_rippleCenter; // [0,1]
uniform float u_rippleT;      // [0..1]
uniform float u_rippleActive; // 0/1

float gauss(vec2 a, vec2 c, float s) {
  float r = distance(a, c);
  return exp(- (r*r) / (2.0 * s * s));
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p  = (uv - 0.5) * vec2(aspect, 1.0);

  float t = u_time * 0.08;
  vec2 drift = 0.03 * vec2(sin(t * 0.15), cos(t * 0.11));
  vec2 pd = p + drift;

  vec2 dir = normalize(vec2(0.85, 0.53));
  float base = dot(pd, dir);
  float curve = 0.012 * sin((pd.x*1.7 - pd.y*1.3) + t*0.6);
  float n = 0.45 * sin(pd.x * 1.21 + t * 0.22) + 0.45 * sin(pd.y * 1.34 - t * 0.18);
  float field = base + curve + 0.020 * n;

  // Cursor-driven bump
  if (u_mouse.x >= 0.0) {
    vec2 mp = (u_mouse - 0.5) * vec2(aspect, 1.0);
  float bump = gauss(p, mp, u_sigma);
  field += u_intensity * (-0.25 * bump);
  }

  float v = fract(field * u_density);
#if defined(GL_OES_standard_derivatives) || __VERSION__ >= 300
  float aa = fwidth(v) * 0.9;
#else
  float aa = 0.001;
#endif
  float band = min(v, 1.0 - v);
  float line = smoothstep(u_width + aa, u_width - aa, band);
  line *= (0.97 + 0.03 * sin(t * 2.1));
  float a = line * u_lineOpacity;

  // Cursor dot (in pixel space for perfect roundness)
  if (u_mouse.x >= 0.0) {
    vec2 mpx = u_mouse * u_resolution;
    float dpx = distance(gl_FragCoord.xy, mpx);
    float m = min(u_resolution.x, u_resolution.y);
    float radiusPx = u_dotR * m;
    float featherPx = u_dotFeather * m;
    float dotA = (u_dotFeather <= 1e-5)
      ? (1.0 - step(radiusPx, dpx))
      : smoothstep(radiusPx, radiusPx - featherPx, dpx);
    a = max(a, dotA);
  }

  // Click ripple rings
  if (u_rippleActive > 0.5) {
    vec2 centerPx = u_rippleCenter * u_resolution;
    float dpx = distance(gl_FragCoord.xy, centerPx);
    float baseR = u_rippleT * 280.0;
    float fade = smoothstep(1.0, 0.0, u_rippleT);
    float ringA = 0.0;
    for (int i = 0; i < 3; i++) {
      float offset = float(i) * 22.0;
      float thickness = 2.5;
      float rr = baseR + offset;
      float ring = 1.0 - smoothstep(0.0, thickness, abs(dpx - rr));
      ringA = max(ringA, ring * (0.21 - 0.045 * float(i)));
    }
    a = max(a, ringA * fade);
  }

  gl_FragColor = vec4(vec3(a > 0.0 ? 1.0 : 0.0), a);
}
`;

function FullscreenQuad(props: Props) {
  const { size, gl } = useThree();
  const last = useRef({ x: size.width / 2, y: size.height / 2 });
  const { scene } = useThree();

  // Fullscreen triangle positions
  const positions = useMemo(() => new Float32Array([
    -1, -1, 0,
     3, -1, 0,
    -1,  3, 0
  ]), []);

  const uniforms = useMemo(() => ({
    u_resolution:  { value: new THREE.Vector2(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio()) },
    u_time:        { value: 0 },
    u_mouse:       { value: new THREE.Vector2(-1, -1) },
    u_density:     { value: props.density },
    u_width:       { value: props.lineWidth },
    u_intensity:   { value: props.intensity },
    u_sigma:       { value: props.sigma },
    u_lineOpacity: { value: props.lineOpacity ?? 0.10 },
    u_dotR:        { value: 0 },
    u_dotFeather:  { value: 0 },
    u_rippleCenter:{ value: new THREE.Vector2(-1, -1) },
    u_rippleT:     { value: 0 },
    u_rippleActive:{ value: 0 },
  }), [size.width, size.height, gl, props.density, props.lineWidth, props.intensity, props.sigma, props.lineOpacity]);

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    uniforms
  }), [uniforms]);

  // Pointer handling - only for contour line bump, no ripple effects
  useEffect(() => {
    const updateLast = (x: number, y: number) => {
      last.current.x = x;
      last.current.y = y;
    };

    const onPointerMove = (e: PointerEvent) => {
      updateLast(e.clientX, e.clientY);
      if (process.env.NODE_ENV !== 'production' && window.__BG_DEBUG_ONCE !== 1) {
        // eslint-disable-next-line no-console
        console.log('[BG] pointermove');
        window.__BG_DEBUG_ONCE = 1;
      }
    };
    const onMouseMove = (e: MouseEvent) => updateLast(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        const t = e.touches[0];
        updateLast(t.clientX, t.clientY);
      }
    };

    const opts: AddEventListenerOptions = { passive: true, capture: true };
    window.addEventListener('pointermove', onPointerMove, opts);
    window.addEventListener('mousemove', onMouseMove, opts);
    window.addEventListener('touchmove', onTouchMove, opts);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);


  useFrame(({ clock, size, gl }) => {
    const dpr = gl.getPixelRatio();
    const tsec = clock.getElapsedTime();
    material.uniforms.u_time.value = tsec;
    material.uniforms.u_resolution.value.set(size.width * dpr, size.height * dpr);
    // Smooth mouse easing - direct tracking without magnet offset
    const u = material.uniforms.u_mouse.value as THREE.Vector2;
    const lastX = last.current.x ?? size.width / 2;
    const lastY = last.current.y ?? size.height / 2;
    const targetUV = new THREE.Vector2(
      lastX / size.width,
      1 - lastY / size.height
    );
    u.lerp(targetUV, 0.12);

    // Debug publish
    if (typeof window !== 'undefined') {
      window.__bg = window.__bg || {};
      window.__bg.lastX = last.current.x;
      window.__bg.lastY = last.current.y;
      window.__bg.uMouseX = u.x;
      window.__bg.uMouseY = u.y;
    }
  });

  // Track last pointer position cheaply
  // already handled in the other effect

  // Imperative mesh creation to avoid JSX material/geometry typing/attach issues
  useEffect(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    scene.add(mesh);
    return () => {
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
    };
  }, [scene, material, positions]);

  return null;
}

export default function ContoursIsolines(props: Props) {
  return (
    <Canvas gl={{ antialias: true, alpha: true }} dpr={[1, 2]} className="w-full h-full pointer-events-none">
      <FullscreenQuad {...props} />
    </Canvas>
  );
}
