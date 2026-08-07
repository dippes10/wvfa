"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Mesh } from "three";

function Ball({ spin }: { spin: number }) {
  const ref = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * spin;
    ref.current.rotation.x += delta * spin * 0.4;
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.9}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#ffffff" flatShading roughness={0.45} />
      </mesh>
    </Float>
  );
}

export function PlayerScene({ celebrate = false }: { celebrate?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 3.2], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
      <ambientLight intensity={0.75} />
      <directionalLight position={[2, 3, 2]} intensity={1.2} />
      <directionalLight position={[-2, -1, -2]} intensity={0.3} color="#7ce0a0" />
      <Ball spin={celebrate ? 3 : 0.6} />
    </Canvas>
  );
}
