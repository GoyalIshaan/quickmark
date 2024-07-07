import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, OrbitControls, Stats } from "@react-three/drei";
import * as THREE from "three";

const DebugSphere: React.FC<{
  position: [number, number, number];
  color: string;
}> = ({ position, color }) => (
  <mesh position={position}>
    <sphereGeometry args={[0.1, 32, 32]} />
    <meshBasicMaterial color={color} />
  </mesh>
);

const Globe: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  const globeRadius = 5;
  const continentRadius = globeRadius + 0.01; // Very slightly above the globe surface

  // Simplified continent (just a few points to make a triangle)
  const simplifiedContinent = [
    [0, 0],
    [30, 30],
    [60, 0],
  ];

  const vertices = simplifiedContinent.flatMap(([lon, lat]) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -continentRadius * Math.sin(phi) * Math.cos(theta);
    const y = continentRadius * Math.cos(phi);
    const z = continentRadius * Math.sin(phi) * Math.sin(theta);
    return [x, y, z];
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );

  return (
    <group ref={groupRef}>
      <Sphere args={[globeRadius, 64, 64]}>
        <meshBasicMaterial color="blue" wireframe />
      </Sphere>
      <mesh geometry={geometry} renderOrder={1}>
        <meshBasicMaterial
          color="red"
          side={THREE.DoubleSide}
          depthTest={false}
        />
      </mesh>
      {vertices.map(
        (_, index) =>
          index % 3 === 0 && (
            <DebugSphere
              key={index}
              position={[
                vertices[index],
                vertices[index + 1],
                vertices[index + 2],
              ]}
              color="green"
            />
          )
      )}
      {/* Add a debug sphere at the center for reference */}
      <DebugSphere position={[0, 0, 0]} color="yellow" />
    </group>
  );
};

const DebugGlobe: React.FC = () => {
  return (
    <div style={{ width: "100%", height: "500px", background: "#000" }}>
      <Canvas camera={{ position: [0, 0, 20], fov: 45 }}>
        <ambientLight intensity={1} />
        <Globe />
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        <Stats />
        <axesHelper args={[10]} />
      </Canvas>
    </div>
  );
};

export default DebugGlobe;
