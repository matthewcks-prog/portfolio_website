"use client";

import React, { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// Astronaut component
function Astronaut({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const astronautRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/astronaut.glb");

  // Tune materials for better lighting
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.metalness = 0.1;
          mat.roughness = 0.4;
          mat.color = new THREE.Color(0xeeeeee);
        }
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (!astronautRef.current) return;

    const scroll = scrollProgress.current;

    // Lerp position.z from -5 (far) to 0 (center)
    const targetZ = THREE.MathUtils.lerp(-5, 0, scroll);
    astronautRef.current.position.z = THREE.MathUtils.lerp(astronautRef.current.position.z, targetZ, 0.1);

    // Tilt forward based on scroll (0 -> 0.4 radians)
    const targetRotX = scroll * 0.4;
    astronautRef.current.rotation.x = THREE.MathUtils.lerp(astronautRef.current.rotation.x, targetRotX, 0.1);

    // Slow idle spin around Y
    astronautRef.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={astronautRef} position={[0, 0, -5]} scale={2}>
      <primitive object={scene} />
    </group>
  );
}

// Planet component (behind astronaut)
function Planet() {
  const planetRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={planetRef} position={[4, -1, -8]}>
      {/* Main planet sphere */}
      <mesh>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial color="#1a3a5c" emissive="#0a1a3a" emissiveIntensity={0.5} roughness={0.8} metalness={0.2} />
      </mesh>
      {/* Atmospheric glow rim */}
      <mesh scale={1.1}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.15} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

// Main canvas component
export default function AstronautCanvas() {
  const scrollProgress = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0) {
        const raw = window.scrollY / scrollable;
        scrollProgress.current = Math.max(0, Math.min(1, raw));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Dark space background */}
        <color attach="background" args={["#000008"]} />

        {/* Lights */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-5, 3, 2]} intensity={1.2} color="#22d3ee" />
        <pointLight position={[3, -3, -2]} intensity={0.7} color="#a78bfa" />

        {/* Starfield */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />

        {/* Planet behind astronaut */}
        <Suspense fallback={null}>
          <Planet />
        </Suspense>

        {/* Astronaut */}
        <Suspense fallback={null}>
          <Astronaut scrollProgress={scrollProgress} />
        </Suspense>

        {/* Post-processing effects */}
        <EffectComposer>
          <Bloom intensity={1.2} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

// Preload the astronaut model
useGLTF.preload("/astronaut.glb");
