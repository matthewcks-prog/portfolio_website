"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import React, { useMemo, useRef } from "react";

// === Astronaut model ===
function Astronaut({ scrollProgress }: { scrollProgress: number }) {
  const { scene } = useGLTF("/models/astronaut.glb");
  const ref = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (!ref.current) return;

    const time = state.clock.elapsedTime;

    // Orbit around Earth in 3D space - closer orbit for better visibility
    const orbitRadius = 2.8; // Reduced from 3.5 to bring astronaut closer
    const orbitSpeed = 0.25; // Slightly faster for more visible motion

    // Calculate position using spherical coordinates for 3D orbit
    const theta = time * orbitSpeed; // Horizontal rotation
    const phi = Math.sin(time * 0.15) * 0.5 + Math.PI / 2; // Increased vertical range

    // Convert spherical to cartesian coordinates
    ref.current.position.x = orbitRadius * Math.sin(phi) * Math.cos(theta);
    ref.current.position.y = orbitRadius * Math.cos(phi);
    ref.current.position.z = orbitRadius * Math.sin(phi) * Math.sin(theta);

    // Add random floating motion on top of orbit (reduced for smoother visibility)
    ref.current.position.x += Math.sin(time * 0.7) * 0.08;
    ref.current.position.y += Math.sin(time * 0.5) * 0.06;
    ref.current.position.z += Math.cos(time * 0.6) * 0.07;

    // Rotate astronaut itself (tumbling in space)
    ref.current.rotation.x += delta * 0.08;
    ref.current.rotation.y += delta * 0.12;
    ref.current.rotation.z += delta * 0.05;

    // Fade out astronaut as we scroll and zoom away
    ref.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          (mesh.material as THREE.MeshStandardMaterial).opacity = 1 - scrollProgress;
          (mesh.material as THREE.MeshStandardMaterial).transparent = true;
        }
      }
    });
  });

  return <primitive ref={ref} object={scene} scale={0.025} />; // Slightly larger scale
}

// === Earth (surface + clouds + atmosphere) ===
function Earth() {
  const [colorMap, normalMap, cloudsMap] = useTexture([
    "/textures/earth_daymap.jpg",
    "/textures/earth_normal.jpg",
    "/textures/earth_clouds.png",
  ]);

  const earthRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    // slow planetary rotation
    earthRef.current.rotation.y += delta * 0.03;
    cloudsRef.current.rotation.y += delta * 0.02;
  });

  return (
    <>
      {/* Earth surface */}
      <mesh ref={earthRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial map={colorMap} normalMap={normalMap} metalness={0} roughness={1} />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudsRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2.03, 64, 64]} />
        <meshStandardMaterial map={cloudsMap} transparent opacity={0.45} depthWrite={false} side={THREE.FrontSide} />
      </mesh>
    </>
  );
}

// === Starfield with warp effect ===
function Stars({ scrollProgress }: { scrollProgress: number }) {
  const starRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.PointsMaterial>(null!);

  // generate stars in a cylinder/tube shape for warp effect
  const { positions, speeds } = useMemo(() => {
    const starCount = 800; // Reduced from 2000 for less visual noise
    const posArr = new Float32Array(starCount * 3);
    const speedArr = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      // Random position in a cylinder
      const radius = Math.random() * 40 + 5;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = (Math.random() - 0.5) * 100; // spread along z-axis

      posArr[i * 3 + 0] = x;
      posArr[i * 3 + 1] = y;
      posArr[i * 3 + 2] = z;

      speedArr[i] = Math.random() * 0.5 + 0.5;
    }
    return { positions: posArr, speeds: speedArr };
  }, []);

  useFrame((_, delta) => {
    if (!starRef.current) return;

    const posAttr = starRef.current.geometry.attributes.position;

    // Warp speed effect based on scroll - reduced intensity
    const warpSpeed = scrollProgress * 10; // Reduced from 15

    for (let i = 0; i < posAttr.count; i++) {
      let z = posAttr.getZ(i);

      // Move stars toward camera with warp effect
      z += (warpSpeed + 0.3) * speeds[i] * delta * 60; // Reduced base speed

      // Reset stars that pass the camera
      if (z > 20) {
        z = -80;
      }

      posAttr.setZ(i, z);
    }

    posAttr.needsUpdate = true;

    // Increase star size during warp - reduced max size
    if (materialRef.current) {
      materialRef.current.size = THREE.MathUtils.lerp(0.03, 0.5, scrollProgress); // Reduced from 0.05-0.8
    }
  });

  return (
    <points ref={starRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial ref={materialRef} size={0.05} sizeAttenuation color="#ffffff" />
    </points>
  );
}

// === CameraRig: scroll-based camera movement with warp zoom ===
function CameraRig({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();

  useFrame(() => {
    // Zoom camera forward during scroll for warp effect - targeting center of Earth
    camera.position.z = THREE.MathUtils.lerp(6, -5, scrollProgress);
    camera.position.x = THREE.MathUtils.lerp(0, 0, scrollProgress);
    camera.position.y = THREE.MathUtils.lerp(0.5, 0, scrollProgress); // Move to center (y=0)
    camera.lookAt(0, 0, 0); // Always look at Earth's center
  });

  return null;
}

// === Main scene content ===
function SceneContent({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      {/* lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color={"#ffffff"} />

      {/* background stars with warp effect */}
      <Stars scrollProgress={scrollProgress} />

      {/* hero objects */}
      <Earth />
      <Astronaut scrollProgress={scrollProgress} />

      {/* scroll-driven camera with warp zoom */}
      <CameraRig scrollProgress={scrollProgress} />

      {/* optional orbit controls for debugging */}
      <OrbitControls enableZoom={false} />
    </>
  );
}

// === Wrapped hero section ===
export default function SpaceHero() {
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = window.innerHeight * 1.5; // Warp completes after 1.5 screen heights
      const progress = Math.min(scrolled / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "80vh",
        background: "radial-gradient(ellipse at 20% 20%, rgba(40,40,60,0.6) 0%, rgba(0,0,0,1) 60%)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        <Canvas gl={{ antialias: true }} camera={{ position: [0, 0.5, 6], fov: 45 }}>
          {/* space is black by default */}
          <color attach="background" args={["#000000"]} />
          <SceneContent scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* Your marketing copy / CTA sits above the canvas */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "480px",
          padding: "2rem",
          lineHeight: 1.4,
          fontFamily: "-apple-system, BlinkMacSystemFont, Inter, Roboto, sans-serif",
          opacity: 1 - scrollProgress, // Fade out text during warp
          transform: `scale(${1 - scrollProgress * 0.3})`, // Shrink during warp
          transition: "opacity 0.3s, transform 0.3s",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 600,
            marginBottom: "1rem",
            color: "white",
          }}
        >
          Explore my projects
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "rgba(255,255,255,0.8)",
            marginBottom: "1rem",
          }}
        >
          Scroll to jump through hyperspace and view my projects!
        </p>

        <button
          style={{
            background: "linear-gradient(90deg,#4efcff 0%,#4e7bff 100%)",
            color: "#000",
            border: "0",
            borderRadius: "999px",
            padding: "0.75rem 1rem",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          Start Your Journey
        </button>
      </div>
    </section>
  );
}

// Preload astronaut model so it pops in faster
useGLTF.preload("/models/astronaut.glb");
