"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Edges, PerformanceMonitor, Float } from "@react-three/drei";
import { Suspense, useState } from "react";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { Vector2 } from "three";
import { useReducedMotion } from "framer-motion";

function Core() {
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial color="#8BE9FD" emissive="#22D3EE" emissiveIntensity={0.6} metalness={0.3} roughness={0.2} />
        <Edges threshold={15} color="#6366F1" />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  const reduce = useReducedMotion();
  const [effects, setEffects] = useState(true);

  if (reduce) {
    return (
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-6 py-16">
        <div className="h-[420px] rounded-xl border border-white/10 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,.15),transparent_60%)]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="glass relative h-[560px] overflow-hidden">
        <Canvas dpr={[1, 1.75]} camera={{ position: [0, 1.6, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <PerformanceMonitor onDecline={() => setEffects(false)} />
            <ambientLight intensity={0.3} />
            <pointLight position={[3, 3, 2]} intensity={2} color="#22D3EE" />
            <pointLight position={[-3, -2, 1]} intensity={1.4} color="#6366F1" />
            <Core />
            <Grid
              args={[20, 20]}
              position={[0, -1.2, 0]}
              fadeDistance={25}
              cellSize={0.6}
              cellThickness={0.6}
              sectionThickness={1}
              cellColor="#1B2735"
              sectionColor="#233046"
              infiniteGrid
            />
            <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.4} maxPolarAngle={Math.PI / 2.4} />
            {effects && (
              <EffectComposer multisampling={0}>
                <Bloom intensity={0.25} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
                <ChromaticAberration offset={new Vector2(0.0006, 0.0006)} radialModulation={false} modulationOffset={0} />
              </EffectComposer>
            )}
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
