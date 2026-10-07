import { Environment, Float, Lightformer, MeshDistortMaterial } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { scenePalette } from "./palette";

/** Molten core that tilts toward the pointer. */
function Core() {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    const g = group.current;
    if (!g) return;
    const k = 1 - Math.exp(-4 * dt);
    g.rotation.y += (pointer.x * 0.6 - g.rotation.y) * k;
    g.rotation.x += (-pointer.y * 0.4 - g.rotation.x) * k;
  });
  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh>
          <icosahedronGeometry args={[1.35, 48]} />
          <MeshDistortMaterial
            color={scenePalette.ember}
            emissive={scenePalette.emberDeep}
            emissiveIntensity={0.15}
            roughness={0.12}
            metalness={0.25}
            clearcoat={1}
            distort={0.32}
            speed={1.6}
          />
        </mesh>
      </Float>
      <Orbit radius={2.05} tilt={0.5} speed={0.25} color={scenePalette.cyan} thickness={0.035} />
      <Satellite />
    </group>
  );
}

/** Small cyan rounded cube circling the core. */
function Satellite() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.5;
    if (!ref.current) return;
    ref.current.position.set(Math.cos(t) * 2.1, Math.sin(t * 1.3) * 0.6 - 0.4, Math.sin(t) * 1.2);
    ref.current.rotation.set(t, t * 0.7, 0);
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.45, 0.45, 0.45]} />
      <meshPhysicalMaterial color={scenePalette.cyan} roughness={0.2} clearcoat={1} />
    </mesh>
  );
}

function Orbit({ radius, tilt, speed, color, thickness = 0.006 }: { radius: number; tilt: number; speed: number; color: string; thickness?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, raw) => {
    if (ref.current) ref.current.rotation.z += Math.min(raw, 0.05) * speed;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2 + tilt, tilt * 0.4, 0]}>
      <torusGeometry args={[radius, thickness, 16, 200]} />
      <meshPhysicalMaterial color={color} roughness={0.25} clearcoat={1} transparent opacity={0.9} />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 7], fov: 40 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 5, 3]} intensity={2.2} color={scenePalette.bone} />
      <pointLight position={[-4, -2, 2]} intensity={12} color={scenePalette.cyan} />
      <Core />
      <Environment resolution={256}>
        <Lightformer intensity={3} position={[0, 5, -2]} scale={[10, 2, 1]} color={scenePalette.bone} />
        <Lightformer intensity={2} position={[-5, 0, 0]} rotation-y={Math.PI / 2} scale={[8, 1, 1]} color={scenePalette.ember} />
        <Lightformer intensity={1.5} position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[6, 1, 1]} />
      </Environment>
    </Canvas>
  );
}
