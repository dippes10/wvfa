"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Mesh } from "three";

function Ball() {
  const ref = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.45;
    ref.current.rotation.x += delta * 0.12;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.25} floatIntensity={1.2}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#f6efdc" flatShading roughness={0.4} metalness={0.15} />
      </mesh>
    </Float>
  );
}

export function HeroBall() {
  return (
    <Canvas camera={{ position: [0, 0, 3.4], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[2, 3, 2]} intensity={1.3} />
      <directionalLight position={[-2, -1, -2]} intensity={0.4} color="#d4af37" />
      <Ball />
    </Canvas>
  );
}
