"use client";

import React, { useRef, Suspense } from "react";
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
  floatAmplitudeY: 0.3, // Vertical floating distance (reduced to stay in frame)
  floatAmplitudeX: 0.15, // Horizontal floating distance (reduced to stay in frame)
  floatAmplitudeZ: 0.1, // Depth floating distance (reduced to stay in frame)
  floatSpeedY: 0.7, // Vertical float speed
  floatSpeedX: 0.5, // Horizontal float speed
  floatSpeedZ: 0.4, // Depth float speed
  rotationSpeed: 0.3, // Subtle rotation speed
  scale: 0.5, // Size of the astronaut model (smaller to ensure full visibility)
  basePositionY: 0, // Center position
};

function AstronautModel() {
  const astronautRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/astronaut.glb");
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (!astronautRef.current) return;

    timeRef.current += delta;

    // Create realistic floating motion using multiple sine waves at different speeds
    const floatY = Math.sin(timeRef.current * FLOAT_CONFIG.floatSpeedY) * FLOAT_CONFIG.floatAmplitudeY;
    const floatX = Math.sin(timeRef.current * FLOAT_CONFIG.floatSpeedX) * FLOAT_CONFIG.floatAmplitudeX;
    const floatZ = Math.cos(timeRef.current * FLOAT_CONFIG.floatSpeedZ) * FLOAT_CONFIG.floatAmplitudeZ;

    // Apply position with multi-axis floating
    astronautRef.current.position.set(floatX, FLOAT_CONFIG.basePositionY + floatY, floatZ);

    // Add subtle rotation for more realistic space floating
    astronautRef.current.rotation.y = Math.sin(timeRef.current * FLOAT_CONFIG.rotationSpeed) * 0.2;
    astronautRef.current.rotation.x = Math.cos(timeRef.current * FLOAT_CONFIG.rotationSpeed * 0.7) * 0.1;
    astronautRef.current.rotation.z = Math.sin(timeRef.current * FLOAT_CONFIG.rotationSpeed * 0.5) * 0.15;

    // Apply scale
    astronautRef.current.scale.set(FLOAT_CONFIG.scale, FLOAT_CONFIG.scale, FLOAT_CONFIG.scale);
  });

  return (
    <group ref={astronautRef}>
      <primitive object={scene} />
    </group>
  );
}

export default function AstronautJump() {
  return (
    <div
      className="absolute bottom-0 pointer-events-none z-50 hidden lg:block"
      style={{
        right: "80px", // Positioned from right edge
        width: "400px", // Bigger frame
        height: "500px", // Bigger frame
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

          <AstronautModel />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload the model
useGLTF.preload("/models/astronaut.glb");
