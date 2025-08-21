'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';

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
uniform vec2  u_mouse;
uniform float u_density;
uniform float u_width;
uniform float u_intensity;
uniform float u_sigma;
uniform float u_lineOpacity;
uniform float u_dotR;
uniform float u_dotFeather;

float gauss(vec2 uv, vec2 c, float s){
  float r = distance(uv,c); return exp(- (r*r) / (2.0*s*s));
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p  = (uv - 0.5) * vec2(u_resolution.x/u_resolution.y, 1.0);

  float t = u_time * 0.08;
  // Subtle directional drift
  vec2 drift = 0.03 * vec2(sin(t * 0.15), cos(t * 0.11));
  vec2 pd = p + drift;

  // Graceful directional contours: diagonal base + mild curvature
  vec2 dir = normalize(vec2(0.85, 0.53));
  float base = dot(pd, dir);
  float curve = 0.015 * sin((pd.x*1.7 - pd.y*1.3) + t*0.6);

  // Subtle curl-like modulation from scalar noise derivatives
  float n = 0.5 * sin(pd.x * 1.21 + t * 0.22) + 0.5 * sin(pd.y * 1.34 - t * 0.18);
#if defined(GL_OES_standard_derivatives) || __VERSION__ >= 300
  float curl = dFdx(n) - dFdy(n);
#else
  float curl = 0.0;
#endif
  float field = base + curve + 0.025 * curl;

  if (u_mouse.x >= 0.0) {
    vec2 mp = (u_mouse - 0.5) * vec2(u_resolution.x/u_resolution.y, 1.0);
    float bump = gauss(p*0.9, mp, u_sigma);
    field += u_intensity * (-0.35 * bump);
  }

  float v = fract(field * u_density);
  
#if defined(GL_OES_standard_derivatives) || __VERSION__ >= 300
  float aa = fwidth(v) * 0.9;
#else
  float aa = 0.001;
#endif
  float band = min(v, 1.0 - v);
  float line = smoothstep(u_width+aa, u_width, band);
  line *= (0.96 + 0.04 * sin(t * 2.1));

  float dotA = 0.0;
  if (u_mouse.x >= 0.0) {
    // Compute distance in pixel space to keep the dot perfectly circular
    vec2 mpx = u_mouse * u_resolution;
    float dpx = distance(gl_FragCoord.xy, mpx);
    float radiusPx = u_dotR * min(u_resolution.x, u_resolution.y);
    float featherPx = u_dotFeather * min(u_resolution.x, u_resolution.y);
    if (u_dotFeather <= 1e-5) {
      dotA = 1.0 - step(radiusPx, dpx);
    } else {
      dotA = smoothstep(radiusPx, radiusPx - featherPx, dpx);
    }
  }

  float a = max(line * u_lineOpacity, dotA);
  gl_FragColor = vec4(vec3(a > 0.0 ? 1.0 : 0.0), a);
}
`;

function FullscreenQuad(props: Props) {
  const { size, gl } = useThree();
  const [visibleDot, setVisibleDot] = useState(false);
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
    u_dotR:        { value: props.dotRadiusUV ?? 0.010 },
    u_dotFeather:  { value: props.dotFeatherUV ?? 0.006 }
  }), [size, gl, props]);

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    uniforms
  }), [uniforms]);

  // Pointer handling (fine vs. coarse)
  useEffect(() => {
    const coarse = window.matchMedia?.('(pointer: coarse)').matches;
    const showDot = props.showDotContinuously || !coarse;
    let hideTO: ReturnType<typeof setTimeout> | undefined;

    const onMove = (e: PointerEvent) => {
      last.current.x = e.clientX;
      last.current.y = e.clientY;
      if (!showDot) {
        setVisibleDot(true);
        if (hideTO) clearTimeout(hideTO);
        hideTO = setTimeout(() => setVisibleDot(false), 1200);
      } else setVisibleDot(true);
    };
    const onDown = (e: PointerEvent) => {
      last.current.x = e.clientX;
      last.current.y = e.clientY;
      if (!showDot) {
        setVisibleDot(true);
        if (hideTO) clearTimeout(hideTO);
        hideTO = setTimeout(() => setVisibleDot(false), 1200);
      }
    };
    const onLeave = () => { if (showDot) setVisibleDot(false); };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [props.showDotContinuously]);

  useFrame(({ clock, size, gl }) => {
    const dpr = gl.getPixelRatio();
  material.uniforms.u_time.value = clock.getElapsedTime();
  material.uniforms.u_resolution.value.set(size.width * dpr, size.height * dpr);
    // Smooth mouse easing
    const u = material.uniforms.u_mouse.value as THREE.Vector2;
    const lastX = last.current.x ?? size.width / 2;
    const lastY = last.current.y ?? size.height / 2;
    u.lerp(visibleDot ? new THREE.Vector2(
      lastX / size.width,
      1 - lastY / size.height
    ) : new THREE.Vector2(-1, -1), 0.12);
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
    <Canvas gl={{ antialias: true, alpha: true }} dpr={[1,2]}
            className="w-full h-full pointer-events-none">
      <FullscreenQuad {...props} />
    </Canvas>
  );
}
