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

export const RealisticAnatomyModel: React.FC<RealisticAnatomyModelProps> = ({
  url = '/models/body.glb',
}) => {
  // Load the 826-mesh Z-Anatomy model with local Draco decoder
  const gltf = useGLTF(url, '/draco/gltf/');

  // Zustand Selectors
  const selectedPartId = useAnatomyStore((state) => state.selectedPartId);
  const isolatedPartId = useAnatomyStore((state) => state.isolatedPartId);
  const dissectedPartIds = useAnatomyStore((state) => state.dissectedPartIds);
  const muscleOpacity = useAnatomyStore((state) => state.muscleOpacity);
  const systemVisibility = useAnatomyStore((state) => state.systemVisibility);
  const renderMode = useAnatomyStore((state) => state.renderMode);
  const explodedView = useAnatomyStore((state) => state.explodedView);

  const selectPart = useAnatomyStore((state) => state.selectPart);
  const hoverPart = useAnatomyStore((state) => state.hoverPart);

  const groupRef = useRef<THREE.Group>(null);
  const meshesMapRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const hoveredMeshRef = useRef<THREE.Mesh | null>(null);

  // Traverse the glTF scene graph, compute smooth normals, and initialize organic PBR materials
  const clonedScene = useMemo(() => {
    if (!gltf || !gltf.scene) return null;
    const cloned = gltf.scene.clone(true);

    // Compute bounding box to normalize human scale and posture
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Scale to a natural 3.8-unit height centered at (0, 0, 0)
    const targetHeight = 3.8;
    const scaleFactor = targetHeight / (size.y || 1);
    cloned.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Offset center
    cloned.position.set(
      -center.x * scaleFactor,
      -center.y * scaleFactor,
      -center.z * scaleFactor
    );

    meshesMapRef.current.clear();

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Smooth normals for organic biological contours (eliminates low-poly faceting)
        if (mesh.geometry) {
          mesh.geometry.computeVertexNormals();
        }

        // Determine physical anatomical laterality (Right vs Left) from 3D space
        mesh.geometry.computeBoundingBox();
        const bbox = mesh.geometry.boundingBox;
        let side: 'Right' | 'Left' | '' = '';
        if (bbox) {
          const geomCenter = new THREE.Vector3();
          bbox.getCenter(geomCenter);
          if (geomCenter.x < -0.015) {
            side = 'Right';
          } else if (geomCenter.x > 0.015) {
            side = 'Left';
          }
        }
        mesh.userData.side = side;

        const { system, subType } = classifyStructure(mesh.name, mesh.userData?.type);
        mesh.userData.system = system;
        mesh.userData.subType = subType;
        mesh.userData.initialPosition = mesh.position.clone();

        // Enrich with full clinical and physiological details
        mesh.userData.record = getDetailedAnatomyRecord(mesh.name, mesh.userData);

        // Assign realistic medical PBR materials
        let baseColor = '#ded6cb'; // warm osteoid ivory bone
        let roughness = 0.52;
        let metalness = 0.0;

        if (subType === 'muscle') {
          baseColor = '#822020'; // deep striated anatomical crimson
          roughness = 0.44;
          metalness = 0.0;
        } else if (subType === 'cartilage') {
          baseColor = '#bfd5dc';
          roughness = 0.28;
          metalness = 0.0;
        }

        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(baseColor),
          roughness,
          metalness,
          emissive: new THREE.Color('#000000'),
          emissiveIntensity: 0,
        });

        mesh.material = material;
        mesh.userData.baseMaterial = material;
        mesh.userData.baseColor = new THREE.Color(baseColor);

        meshesMapRef.current.set(mesh.name, mesh);
      }
    });

    return cloned;
  }, [gltf]);

  // Synchronize dynamic visibility, opacity slider, dissection, and render modes
  useEffect(() => {
    if (!clonedScene) return;

    meshesMapRef.current.forEach((mesh, name) => {
      const subType = mesh.userData.subType as 'bone' | 'muscle' | 'cartilage';
      const isDissected = dissectedPartIds.includes(name);
      const isSelected = selectedPartId === name;
      const isIsolated = isolatedPartId === name;
      const isDimmed = isolatedPartId !== null && !isIsolated;

      const isMuscular = subType === 'muscle' || mesh.userData.system === 'muscular';

      // Layer visibility
      let visible = true;
      if (isMuscular && !systemVisibility.muscular) visible = false;
      if (subType === 'bone' && !systemVisibility.skeletal) visible = false;
      if (isDissected) visible = false;

      // 0% Opacity Fix: Completely hide muscular system meshes when opacity is near zero
      if (isMuscular && muscleOpacity <= 0.02) {
        visible = false;
      }

      mesh.visible = visible;

      // When muscles are very faint (< 0.25) or hidden, disable raycast to allow clicking bones directly
      if (isMuscular) {
        mesh.raycast = muscleOpacity < 0.25 ? () => {} : THREE.Mesh.prototype.raycast;
      } else {
        mesh.raycast = THREE.Mesh.prototype.raycast;
      }


      if (!visible) return;

      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!mat) return;

      // Muscle Opacity Slider
      let targetOpacity = 1.0;
      if (subType === 'muscle') {
        targetOpacity = muscleOpacity;
      }

      // X-Ray Mode
      if (renderMode === 'xray') {
        targetOpacity = Math.min(targetOpacity, 0.22);
        mat.wireframe = false;
      } else if (renderMode === 'wireframe') {
        mat.wireframe = true;
      } else {
        mat.wireframe = false;
      }

      // Isolation mode
      if (isDimmed) {
        targetOpacity = 0.05;
      }

      mat.opacity = targetOpacity;
      mat.transparent = targetOpacity < 0.98 || isDimmed;
      mat.depthWrite = !mat.transparent;

      // Selected highlight state
      if (isSelected) {
        mat.emissive.set('#00f0ff');
        mat.emissiveIntensity = 0.9;
        mat.opacity = 1.0;
        mat.transparent = false;
      } else if (mesh !== hoveredMeshRef.current) {
        mat.emissive.set('#000000');
        mat.emissiveIntensity = 0;
      }

      // Exploded View offset
      if (explodedView) {
        const initPos = mesh.userData.initialPosition as THREE.Vector3;
        const dir = initPos.clone().normalize();
        mesh.position.copy(initPos).add(dir.multiplyScalar(0.25));
      } else {
        const initPos = mesh.userData.initialPosition as THREE.Vector3;
        mesh.position.copy(initPos);
      }
    });
  }, [
    clonedScene,
    systemVisibility,
    muscleOpacity,
    dissectedPartIds,
    renderMode,
    selectedPartId,
    isolatedPartId,
    explodedView,
  ]);

  // High-performance direct Three.js Hover & Enlightenment (0ms lag, no full re-render)
  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;
    if (!mesh || !mesh.name || !mesh.visible) return;

    const isMuscular = mesh.userData.subType === 'muscle' || mesh.userData.system === 'muscular';

    // Do not hover invisible or near-zero opacity muscular structures
    if (isMuscular && muscleOpacity <= 0.02) return;

    if (mesh === hoveredMeshRef.current) return;

    // Un-highlight previously hovered mesh
    if (hoveredMeshRef.current && hoveredMeshRef.current.name !== selectedPartId) {
      const prevMat = hoveredMeshRef.current.material as THREE.MeshStandardMaterial;
      if (prevMat) {
        prevMat.emissive.set('#000000');
        prevMat.emissiveIntensity = 0;
      }
    }

    // Highlight newly hovered mesh
    const mat = mesh.material as THREE.MeshStandardMaterial;
    if (mat) {
      mat.emissive.set(isMuscular ? '#f59e0b' : '#00f0ff');
      mat.emissiveIntensity = 0.85;
    }

    hoveredMeshRef.current = mesh;
    document.body.style.cursor = 'pointer';
    hoverPart(mesh.name, mesh.userData);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (hoveredMeshRef.current) {
      if (hoveredMeshRef.current.name !== selectedPartId) {
        const mat = hoveredMeshRef.current.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.emissive.set('#000000');
          mat.emissiveIntensity = 0;
        }
      }
      hoveredMeshRef.current = null;
    }
    document.body.style.cursor = 'auto';
    hoverPart(null);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;
    if (!mesh || !mesh.name || !mesh.visible) return;
    const isMuscular = mesh.userData.subType === 'muscle' || mesh.userData.system === 'muscular';
    if (isMuscular && muscleOpacity <= 0.02) return;


    // Compute world bounding box center for camera focus
    mesh.geometry.computeBoundingBox();
    const box = new THREE.Box3().setFromObject(mesh);
    const center = new THREE.Vector3();
    box.getCenter(center);

    selectPart(mesh.name, [center.x, center.y, center.z], mesh.userData);
  };

  if (!clonedScene) return null;

  return (
    <primitive
      ref={groupRef}
      object={clonedScene}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  );
};
