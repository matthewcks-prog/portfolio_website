"use client";

import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Astronaut jumping in lower right
function JumpingAstronaut({ scrollProgress }: { scrollProgress: number }) {
  const astronautRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/astronaut.glb");
  const timeRef = useRef(0);

  // Clone the scene to avoid conflicts
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  useFrame((state, delta) => {
    if (!astronautRef.current) return;

    timeRef.current += delta;

    // Jumping animation (simple sine wave)
    const jumpHeight = Math.abs(Math.sin(timeRef.current * 1.5)) * 1.2;

    // Position in lower right area
    astronautRef.current.position.x = 2.0;
    astronautRef.current.position.y = -1.5 + jumpHeight;
    astronautRef.current.position.z = 0;

    // Gentle rotation while jumping
    astronautRef.current.rotation.y = Math.sin(timeRef.current * 0.5) * 0.2;

    // Scroll-based fade out
    if (scrollProgress > 0) {
      astronautRef.current.position.x += scrollProgress * delta * 3;
      astronautRef.current.position.y += scrollProgress * delta * 2;
    }
  });

  return (
    <group ref={astronautRef} scale={1.0}>
      <primitive object={clonedScene} />
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
      className="fixed bottom-0 right-0 w-[400px] h-[500px] md:w-[500px] md:h-[600px] pointer-events-none z-20"
      style={{
        opacity: scrollProgress > 0.8 ? 0 : 1 - scrollProgress * 0.5,
        transition: "opacity 0.3s",
        transform: `translateX(${scrollProgress * 200}px) translateY(${scrollProgress * 150}px)`,
      }}
    >
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <pointLight position={[-3, 2, 2]} intensity={0.6} color="#ffffff" />

          <JumpingAstronaut scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
