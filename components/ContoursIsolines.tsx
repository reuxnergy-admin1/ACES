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
uniform vec2  u_rippleCenter;
uniform float u_rippleT;
uniform float u_rippleActive;

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
  // Click ripple ring
  if (u_rippleActive > 0.5) {
    float r = distance(uv, u_rippleCenter);
    float r0 = u_rippleT * 0.35; // expanding radius over time
    float thickness = 0.008;
    float ring = 1.0 - smoothstep(0.0, thickness, abs(r - r0));
    float fade = smoothstep(0.8, 0.0, u_rippleT);
    a = max(a, ring * 0.12 * fade);
  }
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
  u_dotFeather:  { value: props.dotFeatherUV ?? 0.006 },
  u_rippleCenter:{ value: new THREE.Vector2(-1, -1) },
  u_rippleT:     { value: 0 },
  u_rippleActive:{ value: 0 },
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
    const isReduced = window.matchMedia?.('(prefers-reduced-motion)').matches;

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
      if (!isReduced) {
        const u = material.uniforms;
        const rectW = size.width;
        const rectH = size.height;
        (u.u_rippleCenter.value as THREE.Vector2).set(
          last.current.x / rectW,
          1 - last.current.y / rectH
        );
        u.u_rippleActive.value = 1;
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
  }, [props.showDotContinuously, size.width, size.height, material.uniforms]);

  // Track magnetic hover target
  const magnetRef = useRef<{active:boolean; cx:number; cy:number}>({active:false, cx:0, cy:0});
  useEffect(() => {
    const isReduced = window.matchMedia?.('(prefers-reduced-motion)').matches;
    if (isReduced) return;
    const onOverMove = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const hit = t?.closest?.('a,button,[role="button"]');
      if (hit) {
        const r = (hit as HTMLElement).getBoundingClientRect();
        magnetRef.current = { active:true, cx: r.left + r.width/2, cy: r.top + r.height/2 };
      } else {
        magnetRef.current.active = false;
      }
    };
    window.addEventListener('pointermove', onOverMove, { passive: true });
    return () => window.removeEventListener('pointermove', onOverMove);
  }, []);

  useFrame(({ clock, size, gl }) => {
    const dpr = gl.getPixelRatio();
    const tsec = clock.getElapsedTime();
    material.uniforms.u_time.value = tsec;
    material.uniforms.u_resolution.value.set(size.width * dpr, size.height * dpr);
    // Smooth mouse easing
    const u = material.uniforms.u_mouse.value as THREE.Vector2;
    const lastX = last.current.x ?? size.width / 2;
    const lastY = last.current.y ?? size.height / 2;
    let targetX = lastX;
    let targetY = lastY;
    if (magnetRef.current.active) {
      // Nudge pointer toward center of hovered interactive element (max 12px)
      const vx = magnetRef.current.cx - lastX;
      const vy = magnetRef.current.cy - lastY;
      const len = Math.hypot(vx, vy) || 1;
      const maxOffset = 12; // px
      const k = Math.min(maxOffset, len) / len;
      targetX = lastX + vx * k * 0.5; // half-strength toward center
      targetY = lastY + vy * k * 0.5;
    }
    const targetUV = visibleDot ? new THREE.Vector2(
      targetX / size.width,
      1 - targetY / size.height
    ) : new THREE.Vector2(-1, -1);
    u.lerp(targetUV, 0.12);

    // Ripple time update and auto-deactivate
    type RippleUniforms = {
      u_rippleActive: { value: number };
      u_rippleT: { value: number };
    };
    const uRip = material.uniforms as RippleUniforms;
    if (uRip.u_rippleActive.value > 0.5) {
      // Estimate elapsed since activation using u_time and encoded start in u_rippleT when activated
      // We store absolute time in u_rippleT as negative to indicate start; if small implementation, just accumulate
      uRip.u_rippleT.value += 1/60; // approximate; sufficient for visual
      if (uRip.u_rippleT.value > 1.0) {
        uRip.u_rippleActive.value = 0;
        uRip.u_rippleT.value = 0;
      }
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
    <Canvas gl={{ antialias: true, alpha: true }} dpr={[1,2]}
            className="w-full h-full pointer-events-none">
      <FullscreenQuad {...props} />
    </Canvas>
  );
}
