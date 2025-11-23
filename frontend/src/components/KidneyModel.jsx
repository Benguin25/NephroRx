import React, { useMemo } from "react";
import * as THREE from "three";

export default function KidneyModel({ mesh }) {
  const geometry = useMemo(() => {
    if (!mesh) return null;

    const geom = new THREE.BufferGeometry();
    const vertices = new Float32Array(mesh.vertices);
    const indices = new Uint32Array(mesh.faces);

    geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geom.setIndex(new THREE.BufferAttribute(indices, 1));

    geom.computeVertexNormals();

    geom.center();

    return geom;
  }, [mesh]);

  if (!geometry) return null;

  return (
    <mesh geometry={geometry} scale={0.05}>
      <meshPhysicalMaterial
        color="#FA2A55"
        roughness={0.2}
        metalness={0.1}
        clearcoat={1.0}
        transparent
        opacity={0.9}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
