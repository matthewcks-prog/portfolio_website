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
const WAVE_DECAY = 4.5; // Increased for shorter trail
const BASE_STRENGTH = 0.08;
const MOBILE_MULTIPLIER = 0.5;
const RIPPLE_RADIUS = 0.18; // Reduced from 0.28 to make it smaller
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
    uResolution: { value: new THREE.Vector2(1, 1) },
    // Ripple color uniforms (defaults match CSS fallbacks)
    rippleBase: { value: new THREE.Color("#FCFBF9") },
    rippleBlue1: { value: new THREE.Color("#E7F8FF") },
    rippleBlue2: { value: new THREE.Color("#E5EDFF") },
    ripplePeriwinkle1: { value: new THREE.Color("#E6E9FC") },
    ripplePeriwinkle2: { value: new THREE.Color("#E4E3F7") },
    rippleBlush: { value: new THREE.Color("#F9EAEA") },
    rippleRose: { value: new THREE.Color("#F3E6EC") },
    ripplePeach: { value: new THREE.Color("#F5ECF0") },
    rippleAccent: { value: new THREE.Color("#D7DEFD") },
    rippleMauve: { value: new THREE.Color("#EEE1EB") },
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
    uniform vec2 uResolution;
    // Ripple palette uniforms from CSS variables
    uniform vec3 rippleBase;
    uniform vec3 rippleBlue1;
    uniform vec3 rippleBlue2;
    uniform vec3 ripplePeriwinkle1;
    uniform vec3 ripplePeriwinkle2;
    uniform vec3 rippleBlush;
    uniform vec3 rippleRose;
    uniform vec3 ripplePeach;
    uniform vec3 rippleAccent;
    uniform vec3 rippleMauve;
    varying vec2 vUv;

    void main() {
      // Screen-space UV for consistent full-viewport mapping
      vec2 uv = gl_FragCoord.xy / uResolution;
      
      // Early exit if mouse is off-screen (prevents persistent ripple)
      if (uMouse.x < 0.0 || uMouse.x > 1.0 || uMouse.y < 0.0 || uMouse.y > 1.0) {
        discard;
      }
      
      // Create subtle irregular distortion
      vec2 toMouse = uv - uMouse;
      float angle = atan(toMouse.y, toMouse.x);
      
      // Reduced noise layers for subtle irregularity
      float noise1 = sin(angle * 3.0 + uTime * 0.6) * 0.12;
      float noise2 = sin(angle * 6.0 - uTime * 0.4) * 0.08;
      float noise3 = cos(angle * 4.0 + uTime * 0.5) * 0.1;
      
      // Combine noise layers for gentle irregular shape
      float irregularFactor = 1.0 + noise1 + noise2 + noise3;
      
      // Apply irregular distortion to distance calculation
      float dist = distance(uv, uMouse) * irregularFactor;
      
      // Only show ripples within radius of cursor (accounting for distortion)
      if (dist > uRadius * 1.3) {
        discard;
      }
      
      // Irregular smooth gradient trail effect
      // Distorted falloff creates non-circular, organic shapes
      float falloff = 1.0 - smoothstep(0.0, uRadius * 1.3, dist);
      float smoothFalloff = falloff * falloff * falloff; // Cubic for ultra-smooth edges
      
      // Create trailing effect - intensity decreases from center
      float trailingEffect = exp(-${WAVE_DECAY.toFixed(1)} * dist);
      
      // Simple intensity based on distorted distance
      float baseIntensity = trailingEffect * smoothFalloff;
      
      // Reduced intensity boost for less flashy appearance
      float intensity = clamp(pow(baseIntensity, 0.9) * 2.0, 0.0, 1.0);
      
      // Create dynamic gradient based on position and intensity
      // Use UV coordinates to add spatial variation
      float spatialVariation = sin(uv.x * 3.14159 + uTime * 0.25) * 0.5 + 0.5;
      
      // Subtle color layers with reduced mixing
      vec3 color = mix(rippleBase, rippleBlue1, intensity * 0.5);
      color = mix(color, rippleBlue2, intensity * 0.6);
      
      // Layer 2: Add periwinkles (medium intensity)
      color = mix(color, ripplePeriwinkle1, intensity * 0.5);
      color = mix(color, ripplePeriwinkle2, intensity * 0.55);
      
      // Layer 3: Add warm tones based on spatial variation (high intensity) - reduced
      if (spatialVariation > 0.6) {
        color = mix(color, rippleBlush, intensity * intensity * 0.4);
        color = mix(color, rippleRose, intensity * intensity * 0.3);
      } else if (spatialVariation > 0.3) {
        color = mix(color, ripplePeach, intensity * intensity * 0.35);
        color = mix(color, rippleMauve, intensity * intensity * 0.25);
      } else {
        color = mix(color, rippleAccent, intensity * intensity * 0.4);
      }
      
      // Reduced saturation boost for less flashy colors
      vec3 gray = vec3(dot(color, vec3(0.299, 0.587, 0.114)));
      color = mix(gray, color, 1.2); // Reduced from 1.5 for subtler colors
      
      // Softer outer edge, stronger core
      float alpha = smoothstep(0.12, 0.9, intensity) * falloff;
      
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
  const { size } = useThree();
  const targetMouseRef = useRef(new THREE.Vector2(-10, -10)); // Target position (actual cursor)
  const currentMouseRef = useRef(new THREE.Vector2(-10, -10)); // Smoothed position (what we render)

  // Read CSS variables and push into shader uniforms so the palette stays in sync
  useEffect(() => {
    if (!materialRef.current || typeof window === "undefined") return;

    const css = getComputedStyle(document.documentElement);

    const setUniformColor = (uniformName: string, cssVar: string, fallback: string) => {
      const value = (css.getPropertyValue(cssVar) || fallback).trim();
      const color = new THREE.Color(value || fallback);
      (materialRef.current!.uniforms as any)[uniformName].value.copy(color);
    };

    setUniformColor("rippleBase", "--ripple-base", "#FCFBF9");
    setUniformColor("rippleBlue1", "--ripple-blue-1", "#E7F8FF");
    setUniformColor("rippleBlue2", "--ripple-blue-2", "#E5EDFF");
    setUniformColor("ripplePeriwinkle1", "--ripple-periwinkle-1", "#E6E9FC");
    setUniformColor("ripplePeriwinkle2", "--ripple-periwinkle-2", "#E4E3F7");
    setUniformColor("rippleBlush", "--ripple-blush", "#F9EAEA");
    setUniformColor("rippleRose", "--ripple-rose", "#F3E6EC");
    setUniformColor("ripplePeach", "--ripple-peach", "#F5ECF0");
    setUniformColor("rippleAccent", "--ripple-accent", "#D7DEFD");
    setUniformColor("rippleMauve", "--ripple-mauve", "#EEE1EB");
  }, []);

  // Keep resolution uniform in sync with canvas size
  useEffect(() => {
    if (!materialRef.current) return;
    // Use actual pixel dimensions for accurate coordinate mapping
    // This ensures touch coordinates map correctly on mobile devices
    materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
  }, [size.width, size.height]);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;

      // Get target mouse position from global ref
      const globalMouseRef = (window as any).__rippleMouseRef;
      if (globalMouseRef) {
        targetMouseRef.current.copy(globalMouseRef.current);
      }

      // Smooth interpolation (lerp) between current and target position
      // Lower value = smoother/slower follow, higher = more responsive
      const lerpFactor = 0.12; // Adjust for smoothness (0.05 = very smooth, 0.2 = more responsive)
      currentMouseRef.current.x += (targetMouseRef.current.x - currentMouseRef.current.x) * lerpFactor;
      currentMouseRef.current.y += (targetMouseRef.current.y - currentMouseRef.current.y) * lerpFactor;

      // Update shader uniform with smoothed position
      materialRef.current.uniforms.uMouse.value.copy(currentMouseRef.current);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]} renderOrder={999}>
      <planeGeometry args={[50, 50, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        {...RippleMaterialShader}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
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
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isActive, setIsActive] = useState(true);

  // Mobile detection (always call hooks first)
  const isTouch = typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;
  const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 768;
  const isMobile = isTouch || isSmallScreen;

  // Don't render ripple effect on mobile devices
  if (isMobile) {
    return null;
  }

  // Track mouse globally to allow clicks to pass through
  useEffect(() => {
    if (typeof window === "undefined") return;

    const INACTIVITY_TIMEOUT = 3000; // 3 seconds
    let isMounted = true; // Safety flag to prevent state updates after unmount

    const resetInactivityTimer = () => {
      // Clear existing timer
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      // Show ripple if it was hidden (only if component is still mounted)
      if (isMounted) {
        setIsActive(true);
      }

      // Set new timer to hide ripple after 3 seconds
      inactivityTimerRef.current = setTimeout(() => {
        if (!isMounted) return; // Don't update state if unmounted

        setIsActive(false);
        // Move mouse off-screen when inactive
        const mouseRef = (window as any).__rippleMouseRef;
        if (mouseRef) {
          mouseRef.current.copy(OFF_SCREEN_POSITION);
        }
      }, INACTIVITY_TIMEOUT);
    };

    const updateMousePosition = (clientX: number, clientY: number) => {
      // Reset inactivity timer on any mouse movement
      resetInactivityTimer();

      // Normalize coordinates to 0-1 range
      // Use window dimensions to ensure consistency across devices
      const x = Math.max(0, Math.min(1, clientX / window.innerWidth));
      const y = Math.max(0, Math.min(1, 1.0 - clientY / window.innerHeight)); // Flip Y for WebGL coords

      const mouseRef = (window as any).__rippleMouseRef;
      if (mouseRef) {
        mouseRef.current.set(x, y);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateMousePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        // Use clientX/clientY which is relative to the viewport
        // This works better on mobile devices
        updateMousePosition(touch.clientX, touch.clientY);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateMousePosition(touch.clientX, touch.clientY);
      }
    };

    const handleMouseLeave = () => {
      const mouseRef = (window as any).__rippleMouseRef;
      if (mouseRef) {
        mouseRef.current.copy(OFF_SCREEN_POSITION);
      }
    };

    const handleTouchEnd = () => {
      const mouseRef = (window as any).__rippleMouseRef;
      if (mouseRef) {
        mouseRef.current.copy(OFF_SCREEN_POSITION);
      }
    };

    // Mouse events
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    // Touch events (passive for better scroll performance)
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    // Start initial timer
    resetInactivityTimer();

    return () => {
      isMounted = false; // Prevent any state updates after unmount

      // Clear inactivity timer on cleanup
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
    // IMPORTANT: Empty dependency array to prevent infinite loops
    // This effect should only run once on mount
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
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999, // Very high z-index to appear above all content
        pointerEvents: "none", // Allow clicks to pass through
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: false, // Disable for performance
          alpha: true,
          powerPreference: "high-performance",
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1} // Cap DPR for performance
        style={{ pointerEvents: "none", width: "100%", height: "100%" }}
      >
        <RippleScene strength={effectiveStrength} />
      </Canvas>
    </div>
  );
}
