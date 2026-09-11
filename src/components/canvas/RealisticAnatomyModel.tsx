'use client';

import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { useAnatomyStore } from '../../store/useAnatomyStore';
import { classifyStructure, getDetailedAnatomyRecord } from '../../data/anatomyParser';

interface RealisticAnatomyModelProps {
  url?: string;
}

/**
 * Creates a rich MeshPhysicalMaterial for muscle tissue.
 * Simulates the fibrous, moist, slightly specular quality of real muscle.
 */
function createMuscleMaterial(variation: number): THREE.MeshPhysicalMaterial {
  // Warm dark arterial red — anatomical specimen quality
  const hues: [number, number, number][] = [
    [0.62, 0.16, 0.17],  // deep carmine  #9e2829
    [0.55, 0.14, 0.15],  // dark red       #8c2326
    [0.70, 0.18, 0.17],  // ruby           #b32d2b
  ];
  const [r, g, b] = hues[variation % 3];
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(r, g, b),
    roughness: 0.62,          // muscle is moist but fibrous — medium rough
    metalness: 0.0,
    // Subsurface scattering (physical approximation)
    sheen: 0.38,
    sheenRoughness: 0.72,
    sheenColor: new THREE.Color(0.85, 0.25, 0.18), // warm red sheen
    // Slight specular from moisture on fascial surface
    specularIntensity: 0.28,
    specularColor: new THREE.Color(0.9, 0.7, 0.6),
    envMapIntensity: 0.45,
    emissive: new THREE.Color(0, 0, 0),
    emissiveIntensity: 0,
  });
}

/**
 * Creates a premium bone material.
 * Cortical bone: hard, slightly glossy, ivory-white with warm undertones.
 */
function createBoneMaterial(variation: number): THREE.MeshPhysicalMaterial {
  const colors = ['#dfd6c4', '#d8d0be', '#e4dccf'];
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(colors[variation % 3]),
    roughness: 0.38,           // cortical bone is relatively smooth
    metalness: 0.0,
    specularIntensity: 0.55,   // bone has a harder specular highlight
    specularColor: new THREE.Color(1, 0.96, 0.88),
    envMapIntensity: 0.82,
    clearcoat: 0.12,           // subtle periosteum sheen
    clearcoatRoughness: 0.6,
    emissive: new THREE.Color(0, 0, 0),
    emissiveIntensity: 0,
  });
}

/**
 * Creates a cartilage material.
 * Translucent blue-white with glassy sheen.
 */
function createCartilageMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#c8dfe8'),
    roughness: 0.18,
    metalness: 0.0,
    specularIntensity: 0.9,
    specularColor: new THREE.Color(0.95, 0.98, 1.0),
    envMapIntensity: 1.0,
    clearcoat: 0.85,
    clearcoatRoughness: 0.12,
    transmission: 0.08,       // very slight translucency
    thickness: 0.2,
    emissive: new THREE.Color(0, 0, 0),
    emissiveIntensity: 0,
  });
}

export const RealisticAnatomyModel: React.FC<RealisticAnatomyModelProps> = ({
  url = '/models/body.glb',
}) => {
  const gltf = useGLTF(url, '/draco/gltf/');

  const selectedPartId  = useAnatomyStore((s) => s.selectedPartId);
  const isolatedPartId  = useAnatomyStore((s) => s.isolatedPartId);
  const dissectedPartIds = useAnatomyStore((s) => s.dissectedPartIds);
  const muscleOpacity   = useAnatomyStore((s) => s.muscleOpacity);
  const systemVisibility = useAnatomyStore((s) => s.systemVisibility);
  const renderMode      = useAnatomyStore((s) => s.renderMode);
  const explodedView    = useAnatomyStore((s) => s.explodedView);

  const selectPart = useAnatomyStore((s) => s.selectPart);
  const hoverPart  = useAnatomyStore((s) => s.hoverPart);

  const groupRef = useRef<THREE.Group>(null);
  const meshesMapRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const hoveredMeshRef = useRef<THREE.Mesh | null>(null);

  /* ── Build scene with premium materials ── */
  const clonedScene = useMemo(() => {
    if (!gltf?.scene) return null;
    const cloned = gltf.scene.clone(true);

    // Normalize scale
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scaleFactor = 3.8 / (size.y || 1);
    cloned.scale.set(scaleFactor, scaleFactor, scaleFactor);
    cloned.position.set(-center.x * scaleFactor, -center.y * scaleFactor, -center.z * scaleFactor);

    meshesMapRef.current.clear();

    cloned.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      if (mesh.geometry) {
        mesh.geometry = mesh.geometry.clone();
        mesh.geometry.computeVertexNormals();
      }

      // Laterality from geometry centroid
      mesh.geometry.computeBoundingBox();
      const bbox = mesh.geometry.boundingBox!;
      const cx = (bbox.min.x + bbox.max.x) / 2;
      mesh.userData.side = cx < -0.015 ? 'Right' : cx > 0.015 ? 'Left' : '';

      // Classify
      const { system, subType } = classifyStructure(mesh.name, mesh.userData?.type);
      mesh.userData.system = system;
      mesh.userData.subType = subType;
      mesh.userData.initialPosition = mesh.position.clone();
      mesh.userData.record = getDetailedAnatomyRecord(mesh.name, mesh.userData);

      // Name-based variation for subtle colour diversity
      const variation = [...mesh.name].reduce((s, c) => s + c.charCodeAt(0), 0) % 3;

      let mat: THREE.MeshPhysicalMaterial;
      if (subType === 'muscle') {
        mat = createMuscleMaterial(variation);
      } else if (subType === 'cartilage') {
        mat = createCartilageMaterial();
      } else {
        mat = createBoneMaterial(variation);
      }

      mesh.material = mat;
      mesh.userData.baseMaterial = mat;
      mesh.userData.baseColor = (mat as THREE.MeshPhysicalMaterial).color.clone();

      meshesMapRef.current.set(mesh.name, mesh);
    });

    return cloned;
  }, [gltf]);

  /* ── Resolve camera target for search/shortcut selections ── */
  useEffect(() => {
    if (!selectedPartId) return;
    const mesh = meshesMapRef.current.get(selectedPartId);
    if (!mesh) return;
    const box = new THREE.Box3().setFromObject(mesh);
    const c = new THREE.Vector3();
    box.getCenter(c);
    selectPart(selectedPartId, [c.x, c.y, c.z], mesh.userData);
  }, [selectedPartId, clonedScene, selectPart]);

  /* ── Synchronize visibility / opacity / render mode ── */
  useEffect(() => {
    if (!clonedScene) return;

    meshesMapRef.current.forEach((mesh, name) => {
      const subType  = mesh.userData.subType as string;
      const isMuscular = subType === 'muscle' || mesh.userData.system === 'muscular';
      const isDissected = dissectedPartIds.includes(name);
      const isSelected  = selectedPartId === name;
      const isDimmed    = isolatedPartId !== null && isolatedPartId !== name;

      // Visibility
      let visible = systemVisibility[mesh.userData.system as keyof typeof systemVisibility] !== false;
      if (isDissected) visible = false;
      if (isMuscular && muscleOpacity <= 0.02) visible = false;
      mesh.visible = visible;

      // Raycast disable when muscles are transparent (let bones through)
      mesh.raycast = isMuscular && muscleOpacity < 0.25
        ? () => {}
        : THREE.Mesh.prototype.raycast;

      if (!visible) return;

      const mat = mesh.material as THREE.MeshPhysicalMaterial;
      if (!mat) return;

      // Base opacity
      let opacity = 1.0;
      if (isMuscular) opacity = muscleOpacity;
      if (renderMode === 'xray') opacity = Math.min(opacity, 0.18);
      if (isDimmed) opacity = 0.04;

      mat.wireframe = renderMode === 'wireframe';
      mat.opacity = opacity;
      mat.transparent = opacity < 0.98;
      mat.depthWrite  = !mat.transparent;

      // Highlight state
      if (isSelected) {
        // Strong cyan-white selection glow
        mat.emissive.set('#00e5ff');
        mat.emissiveIntensity = 1.1;
        mat.opacity = 1.0;
        mat.transparent = false;
      } else if (mesh !== hoveredMeshRef.current) {
        mat.emissive.set('#000000');
        mat.emissiveIntensity = 0;
        // Restore base color
        mat.color.copy(mesh.userData.baseColor);
      }

      // Exploded view
      const initPos = mesh.userData.initialPosition as THREE.Vector3;
      if (explodedView) {
        const dir = initPos.clone().normalize();
        mesh.position.copy(initPos).add(dir.multiplyScalar(0.28));
      } else {
        mesh.position.copy(initPos);
      }
    });
  }, [
    clonedScene, systemVisibility, muscleOpacity, dissectedPartIds,
    renderMode, selectedPartId, isolatedPartId, explodedView,
  ]);

  /* ── Hover: direct Three.js enlightenment, zero React re-render ── */
  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;
    if (!mesh?.name || !mesh.visible) return;

    const isMuscular = mesh.userData.subType === 'muscle' || mesh.userData.system === 'muscular';
    if (isMuscular && muscleOpacity <= 0.02) return;

    if (hoveredMeshRef.current && hoveredMeshRef.current !== mesh) {
      const prev = hoveredMeshRef.current;
      if (prev.name !== selectedPartId) {
        const prevMat = prev.material as THREE.MeshPhysicalMaterial;
        if (prevMat) {
          prevMat.emissive.set('#000000');
          prevMat.emissiveIntensity = 0;
          prevMat.color.copy(prev.userData.baseColor);
        }
      }
    }

    hoveredMeshRef.current = mesh;

    if (mesh.name !== selectedPartId) {
      const mat = mesh.material as THREE.MeshPhysicalMaterial;
      if (mat) {
        if (isMuscular) {
          // Warm amber hover for muscle
          mat.emissive.set('#ff8800');
          mat.emissiveIntensity = 0.55;
        } else {
          // Cool cyan hover for bone
          mat.emissive.set('#00ccff');
          mat.emissiveIntensity = 0.6;
        }
      }
    }

    document.body.style.cursor = 'pointer';
    hoverPart(mesh.name, mesh.userData);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (hoveredMeshRef.current) {
      const mesh = hoveredMeshRef.current;
      if (mesh.name !== selectedPartId) {
        const mat = mesh.material as THREE.MeshPhysicalMaterial;
        if (mat) {
          mat.emissive.set('#000000');
          mat.emissiveIntensity = 0;
          mat.color.copy(mesh.userData.baseColor);
        }
      }
      hoveredMeshRef.current = null;
    }
    document.body.style.cursor = 'default';
    hoverPart(null);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;
    if (!mesh?.name || !mesh.visible) return;

    const isMuscular = mesh.userData.subType === 'muscle' || mesh.userData.system === 'muscular';
    if (isMuscular && muscleOpacity <= 0.02) return;

    const box = new THREE.Box3().setFromObject(mesh);
    const c = new THREE.Vector3();
    box.getCenter(c);
    selectPart(mesh.name, [c.x, c.y, c.z], mesh.userData);
  };

  if (!clonedScene) return null;

  return (
    <group ref={groupRef}>
      <primitive
        object={clonedScene}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />
    </group>
  );
};
