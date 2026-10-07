import { Environment, Float, Lightformer, MeshDistortMaterial } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
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
    g.position.y = -window.scrollY * 0.0025;
  });
  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh>
          <icosahedronGeometry args={[1.55, 48]} />
          <MeshDistortMaterial
            color={scenePalette.ember}
            emissive={scenePalette.emberDeep}
            emissiveIntensity={0.25}
            roughness={0.18}
            metalness={0.85}
            distort={0.38}
            speed={1.6}
          />
        </mesh>
      </Float>
      <Orbit radius={2.6} tilt={0.5} speed={0.25} />
      <Orbit radius={3.2} tilt={-0.9} speed={-0.16} />
    </group>
  );
}

function Orbit({ radius, tilt, speed }: { radius: number; tilt: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, raw) => {
    if (ref.current) ref.current.rotation.z += Math.min(raw, 0.05) * speed;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2 + tilt, tilt * 0.4, 0]}>
      <torusGeometry args={[radius, 0.006, 8, 200]} />
      <meshBasicMaterial color={scenePalette.bone} transparent opacity={0.35} />
    </mesh>
  );
}

/** Slow-drifting dust field for depth. */
function Dust({ count = 900 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 8;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(p) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      arr[i * 3 + 2] = Math.min(r * Math.cos(p), 2);
    }
    return arr;
  }, [count]);
  useFrame((_, raw) => {
    if (ref.current) ref.current.rotation.y += Math.min(raw, 0.05) * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color={scenePalette.bone} transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

export default function HeroScene() {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 6.5], fov: 40 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 5, 3]} intensity={2.2} color={scenePalette.bone} />
      <pointLight position={[-4, -2, 2]} intensity={30} color={scenePalette.ember} />
      <Core />
      <Dust />
      <Environment resolution={256}>
        <Lightformer intensity={3} position={[0, 5, -2]} scale={[10, 2, 1]} color={scenePalette.bone} />
        <Lightformer intensity={2} position={[-5, 0, 0]} rotation-y={Math.PI / 2} scale={[8, 1, 1]} color={scenePalette.ember} />
        <Lightformer intensity={1.5} position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[6, 1, 1]} />
      </Environment>
    </Canvas>
  );
}
