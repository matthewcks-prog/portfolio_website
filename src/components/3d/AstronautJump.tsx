"use client";

import React, { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Type for the GLTF result
type GLTFResult = {
  scene: THREE.Group;
  nodes: Record<string, THREE.Object3D>;
  materials: Record<string, THREE.Material>;
};

// Configuration constants - easily tunable
const FLOAT_CONFIG = {
  floatAmplitudeY: 0.25, // Vertical floating distance (increased for bigger container)
  floatAmplitudeX: 0.15, // Horizontal floating distance (increased for bigger container)
  floatAmplitudeZ: 0.1, // Depth floating distance (increased for bigger container)
  floatSpeedY: 0.7, // Vertical float speed
  floatSpeedX: 0.5, // Horizontal float speed
  floatSpeedZ: 0.4, // Depth float speed
  rotationSpeed: 0.3, // Subtle rotation speed
  scale: 0.55, // Size of the astronaut model (bigger for desktop)
  basePositionY: 0.35, // Adjusted position to keep astronaut centered
};

// Mobile-specific float config with reduced amplitudes
const FLOAT_CONFIG_MOBILE = {
  floatAmplitudeY: 0.12, // Much smaller vertical float for mobile container
  floatAmplitudeX: 0.08, // Much smaller horizontal float for mobile container
  floatAmplitudeZ: 0.06, // Much smaller depth float for mobile container
  floatSpeedY: 0.7,
  floatSpeedX: 0.5,
  floatSpeedZ: 0.4,
  rotationSpeed: 0.3,
  scale: 0.38, // Smaller scale for mobile to fit in 200x250px container
  basePositionY: 0.45, // Centered in smaller container
};

// Physics constants for ripple interaction
const PHYSICS_CONFIG = {
  rippleRadius: 300, // Influence radius in pixels
  forceStrength: 0.015, // How strong the push is (reduced for astronaut)
  damping: 0.88, // Velocity damping
  springBack: 0.03, // How fast astronaut returns to base position
  maxDisplacement: 0.6, // Maximum displacement to keep astronaut in frame
};

// Responsive physics config for smaller screens
const getPhysicsConfig = () => {
  if (typeof window === "undefined") return PHYSICS_CONFIG;

  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

  if (isMobile) {
    return {
      ...PHYSICS_CONFIG,
      rippleRadius: 200,
      forceStrength: 0.01,
      maxDisplacement: 0.4,
    };
  }

  if (isTablet) {
    return {
      ...PHYSICS_CONFIG,
      rippleRadius: 250,
      forceStrength: 0.012,
      maxDisplacement: 0.5,
    };
  }

  return PHYSICS_CONFIG;
};

interface AstronautModelProps {
  mousePos: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement>;
}

function AstronautModel({ mousePos, containerRef }: AstronautModelProps) {
  const astronautRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/astronaut.glb");
  const timeRef = useRef(0);
  const velocityRef = useRef({ x: 0, y: 0 });
  const displacementRef = useRef({ x: 0, y: 0 });

  // Get the appropriate config based on screen size
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const floatConfig = isMobile ? FLOAT_CONFIG_MOBILE : FLOAT_CONFIG;

  useFrame((state, delta) => {
    if (!astronautRef.current) return;

    timeRef.current += delta;

    // Create realistic floating motion using multiple sine waves at different speeds
    const floatY = Math.sin(timeRef.current * floatConfig.floatSpeedY) * floatConfig.floatAmplitudeY;
    const floatX = Math.sin(timeRef.current * floatConfig.floatSpeedX) * floatConfig.floatAmplitudeX;
    const floatZ = Math.cos(timeRef.current * floatConfig.floatSpeedZ) * floatConfig.floatAmplitudeZ;

    // Physics-based displacement from ripple effect
    if (containerRef.current) {
      const config = getPhysicsConfig();
      const rect = containerRef.current.getBoundingClientRect();
      const astronautCenterX = rect.left + rect.width / 2;
      const astronautCenterY = rect.top + rect.height / 2;

      // Calculate distance from mouse to astronaut center
      const dx = astronautCenterX - mousePos.x;
      const dy = astronautCenterY - mousePos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Apply ripple force if within radius
      if (distance < config.rippleRadius && distance > 0) {
        const force = (1 - distance / config.rippleRadius) * config.forceStrength;
        const angle = Math.atan2(dy, dx);

        // Push astronaut away from cursor
        velocityRef.current.x += Math.cos(angle) * force;
        velocityRef.current.y += Math.sin(angle) * force;
      }

      // Spring force to return to base position (0, 0)
      velocityRef.current.x += -displacementRef.current.x * config.springBack;
      velocityRef.current.y += -displacementRef.current.y * config.springBack;

      // Apply damping
      velocityRef.current.x *= config.damping;
      velocityRef.current.y *= config.damping;

      // Update displacement
      displacementRef.current.x += velocityRef.current.x;
      displacementRef.current.y += velocityRef.current.y;

      // Clamp displacement to keep astronaut fully in frame
      const maxDisp = config.maxDisplacement;
      displacementRef.current.x = Math.max(-maxDisp, Math.min(maxDisp, displacementRef.current.x));
      displacementRef.current.y = Math.max(-maxDisp, Math.min(maxDisp, displacementRef.current.y));
    }

    // Apply position with multi-axis floating + physics displacement
    astronautRef.current.position.set(
      floatX + displacementRef.current.x,
      floatConfig.basePositionY + floatY + displacementRef.current.y,
      floatZ
    );

    // Add subtle rotation for more realistic space floating
    astronautRef.current.rotation.y = Math.sin(timeRef.current * floatConfig.rotationSpeed) * 0.2;
    astronautRef.current.rotation.x = Math.cos(timeRef.current * floatConfig.rotationSpeed * 0.7) * 0.1;
    astronautRef.current.rotation.z = Math.sin(timeRef.current * floatConfig.rotationSpeed * 0.5) * 0.15;

    // Apply scale
    astronautRef.current.scale.set(floatConfig.scale, floatConfig.scale, floatConfig.scale);
  });

  return (
    <group ref={astronautRef}>
      <primitive object={scene} />
    </group>
  );
}

export default function AstronautJump() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  // Track mouse position
  useEffect(() => {
    let isMounted = true; // Safety flag to prevent state updates after unmount

    const handleMouseMove = (e: MouseEvent) => {
      if (isMounted) {
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0 && isMounted) {
        const touch = e.touches[0];
        setMousePos({ x: touch.clientX, y: touch.clientY });
      }
    };

    const handleTouchEnd = () => {
      if (isMounted) {
        setMousePos({ x: -1000, y: -1000 }); // Reset position when touch ends
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      isMounted = false; // Prevent state updates after unmount
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute bottom-0 pointer-events-none z-50"
      style={{
        right: "clamp(10px, 3vw, 100px)", // Responsive right positioning
        width: "clamp(200px, 28vw, 550px)", // Slightly bigger mobile width (180 to 200px)
        height: "clamp(250px, 38vh, 650px)", // Slightly bigger mobile height (220 to 250px)
        overflow: "hidden", // Clip anything that goes out of bounds
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 5], // Camera looking straight at astronaut from front
          fov: 50, // Narrower field of view for better framing
          near: 0.1,
          far: 1000,
        }}
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: true,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting setup for visibility */}
          <ambientLight intensity={2.0} />
          <directionalLight position={[2, 3, 5]} intensity={3.0} color="#ffffff" />
          <directionalLight position={[-2, 2, -3]} intensity={2.0} color="#e0e8ff" />
          <pointLight position={[3, 1, 2]} intensity={1.5} color="#ffffff" />

          <AstronautModel mousePos={mousePos} containerRef={containerRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload the model
useGLTF.preload("/models/astronaut.glb");
