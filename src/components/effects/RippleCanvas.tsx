"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * WebGL Mouse Ripple Post-Processing Effect
 *
 * Tuning parameters:
 * - WAVE_FREQUENCY: Controls ripple ring density (default: 30.0)
 * - WAVE_SPEED: Animation speed (default: 3.0)
 * - WAVE_DECAY: How quickly ripples fade with distance (default: 2.2)
 * - BASE_STRENGTH: Displacement intensity on desktop (default: 0.12)
 * - MOBILE_MULTIPLIER: Strength reducer for touch devices (default: 0.5)
 */

// Tuning constants
const WAVE_FREQUENCY = 25.0;
const WAVE_SPEED = 4.0;
const WAVE_DECAY = 8.0; // Higher = more localized around cursor
const BASE_STRENGTH = 0.08;
const MOBILE_MULTIPLIER = 0.5;
const RIPPLE_RADIUS = 0.25; // Size of the ripple area (in normalized coords)
const OFF_SCREEN_POSITION = new THREE.Vector2(-10, -10);

interface RippleCanvasProps {
  strength?: number;
}

/**
 * Custom ripple displacement shader
 * Distorts the rendered scene based on mouse position using a radial wave field
 */
const RippleShader = {
  uniforms: {
    tDiffuse: { value: null },
    uMouse: { value: new THREE.Vector2(-10, -10) },
    uTime: { value: 0.0 },
    uStrength: { value: BASE_STRENGTH },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 uMouse;
    uniform float uTime;
    uniform float uStrength;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      
      // Calculate distance from mouse (add epsilon to avoid division by zero)
      float d = distance(uv, uMouse) + 1e-6;
      
      // Create ripple wave that decays with distance
      float wave = sin(${WAVE_FREQUENCY.toFixed(1)} * d - uTime * ${WAVE_SPEED.toFixed(1)}) * exp(-${WAVE_DECAY.toFixed(1)} * d);
      
      // Direction vector from mouse to current pixel
      vec2 dir = normalize(uv - uMouse);
      
      // Displace UV coordinates
      vec2 offset = dir * wave * uStrength;
      
      // Sample texture with displaced coordinates
      gl_FragColor = texture2D(tDiffuse, uv + offset);
    }
  `,
};

/**
 * Ripple effect material shader
 * Draws colored ripple rings only around the mouse cursor
 */
const RippleMaterialShader = {
  uniforms: {
    uMouse: { value: new THREE.Vector2(-10, -10) },
    uTime: { value: 0.0 },
    uRadius: { value: RIPPLE_RADIUS },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec2 uMouse;
    uniform float uTime;
    uniform float uRadius;
    varying vec2 vUv;

    void main() {
      float dist = distance(vUv, uMouse);
      
      // Only show ripples within radius of cursor
      if (dist > uRadius) {
        discard;
      }
      
      // Create multiple ripple rings
      float ripple1 = sin(${WAVE_FREQUENCY.toFixed(1)} * dist - uTime * ${WAVE_SPEED.toFixed(1)});
      float ripple2 = sin(${(WAVE_FREQUENCY * 1.3).toFixed(1)} * dist - uTime * ${(WAVE_SPEED * 1.2).toFixed(1)} + 1.0);
      float combined = (ripple1 + ripple2 * 0.5) / 1.5;
      
      // Fade out with distance from cursor
      float falloff = 1.0 - smoothstep(0.0, uRadius, dist);
      
      // Create wave intensity
      float wave = combined * exp(-${WAVE_DECAY.toFixed(1)} * dist) * falloff;
      float intensity = max(0.0, wave);
      
      // Cyan to white gradient based on intensity
      vec3 color1 = vec3(0.13, 0.83, 0.93); // Cyan #22d3ee
      vec3 color2 = vec3(0.38, 0.4, 0.95);  // Indigo #6366f1
      vec3 color3 = vec3(0.8, 0.9, 1.0);    // Light blue-white
      
      vec3 color = mix(color1, color2, intensity * 0.5);
      color = mix(color, color3, intensity * intensity);
      
      // Apply intensity with soft edges
      float alpha = intensity * falloff * 0.4;
      
      gl_FragColor = vec4(color, alpha);
    }
  `,
};

/**
 * Ripple plane that shows only around cursor
 */
function RipplePlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;

      // Get mouse from global ref
      const mouseRef = (window as any).__rippleMouseRef;
      if (mouseRef) {
        materialRef.current.uniforms.uMouse.value.copy(mouseRef.current);
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <planeGeometry args={[20, 20, 64, 64]} />
      <shaderMaterial ref={materialRef} {...RippleMaterialShader} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

/**
 * Scene component that sets up post-processing pipeline
 */
function RippleScene({ strength }: { strength: number }) {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<EffectComposer | null>(null);
  const ripplePassRef = useRef<ShaderPass | null>(null);
  const mouseRef = useRef(new THREE.Vector2(-10, -10));
  const timeRef = useRef(0);

  // Initialize post-processing pipeline
  useEffect(() => {
    // Create composer
    const composer = new EffectComposer(gl);
    composerRef.current = composer;

    // Add render pass (renders the scene)
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Add ripple shader pass
    const ripplePass = new ShaderPass(RippleShader);
    ripplePass.uniforms.uStrength.value = strength;
    ripplePassRef.current = ripplePass;
    composer.addPass(ripplePass);

    // Set size
    composer.setSize(size.width, size.height);

    // Cleanup
    return () => {
      composer.dispose();
      if (ripplePass.material) {
        ripplePass.material.dispose();
      }
    };
  }, [gl, scene, camera, size.width, size.height, strength]);

  // Update composer size on resize
  useEffect(() => {
    if (composerRef.current) {
      composerRef.current.setSize(size.width, size.height);
    }
  }, [size.width, size.height]);

  // Animation loop
  useFrame((state, delta) => {
    if (!composerRef.current || !ripplePassRef.current) return;

    // Update time uniform
    timeRef.current += delta;
    ripplePassRef.current.uniforms.uTime.value = timeRef.current;

    // Update mouse uniform
    ripplePassRef.current.uniforms.uMouse.value.copy(mouseRef.current);

    // Render through composer
    composerRef.current.render();
  }, 1); // Priority 1 to render after other updates

  // Expose mouse ref for external updates
  useEffect(() => {
    (window as any).__rippleMouseRef = mouseRef;
    return () => {
      delete (window as any).__rippleMouseRef;
    };
  }, []);

  return (
    <>
      <RipplePlane />
    </>
  );
}

/**
 * Full-screen WebGL canvas with mouse ripple post-processing effect
 */
export default function RippleCanvas({ strength }: RippleCanvasProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect touch device
  useEffect(() => {
    const isTouch = typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;
    setIsMobile(isTouch);
  }, []);

  // Track mouse globally to allow clicks to pass through
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = 1.0 - e.clientY / window.innerHeight; // Flip Y for WebGL coords

      const mouseRef = (window as any).__rippleMouseRef;
      if (mouseRef) {
        mouseRef.current.set(x, y);
      }
    };

    const handleMouseLeave = () => {
      const mouseRef = (window as any).__rippleMouseRef;
      if (mouseRef) {
        mouseRef.current.copy(OFF_SCREEN_POSITION);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Calculate effective strength
  const effectiveStrength = strength ?? (isMobile ? BASE_STRENGTH * MOBILE_MULTIPLIER : BASE_STRENGTH);

  // Don't render if user prefers reduced motion
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none", // Allow clicks to pass through
      }}
    >
      <Canvas
        gl={{
          antialias: false, // Disable for performance
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1} // Cap DPR for performance
        style={{ pointerEvents: "none", width: "100%", height: "100%" }}
      >
        <RippleScene strength={effectiveStrength} />
      </Canvas>
    </div>
  );
}
