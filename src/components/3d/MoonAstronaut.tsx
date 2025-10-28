"use client";

import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Astronaut jumping in lower right with moon gravity effect
function JumpingAstronaut({ scrollProgress }: { scrollProgress: number }) {
  const astronautRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/astronaut.glb");
  const timeRef = useRef(0);
  const velocityRef = useRef(0);
  const positionYRef = useRef(0);
  const isGroundedRef = useRef(true);

  // Clone the scene to avoid conflicts and make materials fully opaque
  const clonedScene = React.useMemo(() => {
    const cloned = scene.clone();

    // Make astronaut fully visible (white, no transparency)
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          // Clone material to avoid affecting other instances
          const oldMaterial = mesh.material as THREE.MeshStandardMaterial;
          const newMaterial = oldMaterial.clone();
          newMaterial.transparent = false;
          newMaterial.opacity = 1.0;

          // Type guard for materials with color property
          if ("color" in newMaterial) {
            newMaterial.color.setHex(0xffffff); // Pure white
          }
          if ("emissive" in newMaterial) {
            newMaterial.emissive.setHex(0x111111); // Slight glow
          }

          newMaterial.needsUpdate = true;
          mesh.material = newMaterial;
        }
      }
    });

    return cloned;
  }, [scene]);

  useFrame((state, delta) => {
    if (!astronautRef.current) return;

    timeRef.current += delta;

    // Moon gravity simulation (1/6th of Earth's gravity)
    const moonGravity = -1.62; // m/s² (much slower fall than Earth)
    const groundLevel = -1.5;
    const jumpForce = 3.5; // Initial jump velocity

    // Apply gravity
    velocityRef.current += moonGravity * delta;

    // Update position based on velocity
    positionYRef.current += velocityRef.current * delta;

    // Ground collision and bounce
    if (positionYRef.current <= groundLevel) {
      positionYRef.current = groundLevel;
      velocityRef.current = 0;
      isGroundedRef.current = true;

      // Automatic jump every ~2 seconds (slow moon bounce)
      if (timeRef.current % 2.5 < delta) {
        velocityRef.current = jumpForce;
        isGroundedRef.current = false;
      }
    } else {
      isGroundedRef.current = false;
    }

    // Position in lower right area - PERFECTLY VERTICAL (no X or Z movement)
    astronautRef.current.position.x = 2.0;
    astronautRef.current.position.y = positionYRef.current;
    astronautRef.current.position.z = 0;

    // Rotate to face forward (standing upright, facing camera) - 2D jumping effect
    // No rotation on X or Z to keep it perfectly upright and straight
    astronautRef.current.rotation.x = 0;
    astronautRef.current.rotation.y = 0; // Face directly toward camera
    astronautRef.current.rotation.z = 0;

    // Make astronaut bigger (1.2x) with slight squash and stretch effect based on velocity
    const squash = 1 - Math.abs(velocityRef.current) * 0.02;
    const baseScale = 1.2; // 1.2 times bigger
    astronautRef.current.scale.set(baseScale, baseScale * Math.max(0.9, squash), baseScale);

    // Scroll-based fade out
    if (scrollProgress > 0) {
      astronautRef.current.position.x += scrollProgress * delta * 3;
      astronautRef.current.position.y += scrollProgress * delta * 2;
    }
  });

  return (
    <group ref={astronautRef}>
      {/* Rotate the model 180 degrees more to face forward (show face toward camera) */}
      <group rotation={[0, 0, 0]}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

export default function MoonAstronaut() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById("about");
      if (!aboutSection) return;

      const aboutRect = aboutSection.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, 1 - aboutRect.bottom / window.innerHeight));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-0 right-0 w-[300px] h-[400px] md:w-[350px] md:h-[450px] pointer-events-none z-20 overflow-visible"
      style={{
        opacity: scrollProgress > 0.8 ? 0 : 1 - scrollProgress * 0.5,
        transition: "opacity 0.3s",
        transform: `translateX(${scrollProgress * 200}px) translateY(${scrollProgress * 150}px)`,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: true,
        }}
        style={{ overflow: "visible" }}
      >
        <Suspense fallback={null}>
          {/* Bright lighting for full visibility - no filters */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={2.0} color="#ffffff" />
          <directionalLight position={[-5, 5, 5]} intensity={1.5} color="#ffffff" />
          <pointLight position={[0, 5, 3]} intensity={1.0} color="#ffffff" />

          <JumpingAstronaut scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
