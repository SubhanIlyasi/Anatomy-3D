'use client';

import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { ThreeEvent, useThree, useFrame } from '@react-three/fiber';
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

  // Force active WebGL continuous animation loop
  useFrame(() => {});

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

  const { invalidate } = useThree();

  const groupRef = useRef<THREE.Group>(null);
  const meshesMapRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const hoveredMeshRef = useRef<THREE.Mesh | null>(null);

  // Initialize the canonical glTF scene once (compute normals, medical PBR materials, bounds)
  const modelScene = useMemo(() => {
    if (!gltf || !gltf.scene) return null;
    const scene = gltf.scene;

    if (!scene.userData.initialized) {
      scene.userData.initialized = true;

      // Compute bounding box to normalize human scale and posture
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      // Scale to a natural 3.8-unit height centered at (0, 0, 0)
      const targetHeight = 3.8;
      const scaleFactor = targetHeight / (size.y || 1);
      scene.scale.set(scaleFactor, scaleFactor, scaleFactor);

      // Offset center
      scene.position.set(
        -center.x * scaleFactor,
        -center.y * scaleFactor,
        -center.z * scaleFactor
      );

      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          // Smooth normals for organic biological contours (eliminates low-poly faceting)
          if (mesh.geometry) {
            mesh.geometry.computeVertexNormals();
            mesh.geometry.computeBoundingBox();
          }

          // Determine physical anatomical laterality (Right vs Left) from 3D space
          const bbox = mesh.geometry?.boundingBox;
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

          const isMuscle = subType === 'muscle' || system === 'muscular';
          const isSkeletal = subType === 'bone' || subType === 'cartilage' || system === 'skeletal';

          // Explicit renderOrder: Skeleton (0) renders first, Muscles (1) blend on top
          mesh.renderOrder = isSkeletal ? 0 : 1;

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
            transparent: isMuscle,
            opacity: 1.0,
            depthWrite: !isMuscle,
          });

          mesh.material = material;
          mesh.userData.baseMaterial = material;
          mesh.userData.baseColor = new THREE.Color(baseColor);
        }
      });
    }

    // Always keep meshesMapRef strictly in sync with the scene
    meshesMapRef.current.clear();
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshesMapRef.current.set(child.name, child as THREE.Mesh);
      }
    });

    return scene;
  }, [gltf]);

  // Synchronize dynamic visibility, opacity slider, dissection, and render modes
  useEffect(() => {
    if (!modelScene) return;

    if (typeof window !== 'undefined') {
      (window as any).__meshesMap = meshesMapRef.current;
    }

    modelScene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      const name = mesh.name;

      const subType = mesh.userData.subType as 'bone' | 'muscle' | 'cartilage';
      const isDissected = dissectedPartIds.includes(name);
      const isSelected = selectedPartId === name;
      const isIsolated = isolatedPartId === name;
      const isDimmed = isolatedPartId !== null && !isIsolated;

      const isMuscular = subType === 'muscle' || mesh.userData.system === 'muscular';
      const isSkeletal = subType === 'bone' || subType === 'cartilage' || mesh.userData.system === 'skeletal';

      // Layer visibility
      let visible = true;
      if (isMuscular && !systemVisibility.muscular) visible = false;
      if (isSkeletal && !systemVisibility.skeletal) visible = false;
      if (isDissected) visible = false;

      // When opacity is near zero, completely hide muscular meshes
      if (isMuscular && muscleOpacity <= 0.005) {
        visible = false;
      }

      mesh.visible = visible;

      // Allow direct click-through to underlying skeletal structures when muscles are faint
      if (!visible || (isMuscular && muscleOpacity < 0.15)) {
        mesh.raycast = () => {};
      } else {
        mesh.raycast = THREE.Mesh.prototype.raycast;
      }

      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!mat) return;

      if (!visible) {
        mat.opacity = 0;
        return;
      }

      // Smooth continuous muscle opacity
      let targetOpacity = 1.0;
      if (isMuscular) {
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

      // For muscles: when completely solid (100%), enable depthWrite for fast occlusion.
      // When transparent (< 99%), depthWrite = false so the skeleton underneath is clearly visible.
      if (isMuscular) {
        const isSolid = targetOpacity >= 0.99 && !isDimmed;
        mat.transparent = !isSolid;
        mat.depthWrite = isSolid;
      } else {
        mat.transparent = targetOpacity < 0.98 || isDimmed;
        mat.depthWrite = !mat.transparent;
      }

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
      const initPos = mesh.userData.initialPosition as THREE.Vector3;
      if (initPos) {
        if (explodedView) {
          const dir = initPos.clone().normalize();
          mesh.position.copy(initPos).add(dir.multiplyScalar(0.25));
        } else {
          mesh.position.copy(initPos);
        }
      }
    });

    invalidate();
  }, [
    modelScene,
    systemVisibility,
    muscleOpacity,
    dissectedPartIds,
    renderMode,
    selectedPartId,
    isolatedPartId,
    explodedView,
    invalidate,
  ]);

  // High-performance direct Three.js Hover & Enlightenment (0ms lag, no full re-render)
  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;
    if (!mesh || !mesh.name || !mesh.visible) return;

    const isMuscular = mesh.userData.subType === 'muscle' || mesh.userData.system === 'muscular';
    const isSkeletal = mesh.userData.subType === 'bone' || mesh.userData.subType === 'cartilage' || mesh.userData.system === 'skeletal';

    // Do not hover invisible structures, disabled layers, or faint muscles (< 0.15)
    if (isMuscular && (!systemVisibility.muscular || muscleOpacity < 0.15)) return;
    if (isSkeletal && !systemVisibility.skeletal) return;

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
    invalidate();
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
    invalidate();
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;
    if (!mesh || !mesh.name || !mesh.visible) return;
    const isMuscular = mesh.userData.subType === 'muscle' || mesh.userData.system === 'muscular';
    const isSkeletal = mesh.userData.subType === 'bone' || mesh.userData.subType === 'cartilage' || mesh.userData.system === 'skeletal';
    if (isMuscular && (!systemVisibility.muscular || muscleOpacity < 0.15)) return;
    if (isSkeletal && !systemVisibility.skeletal) return;


    // Compute world bounding box center for camera focus
    mesh.geometry.computeBoundingBox();
    const box = new THREE.Box3().setFromObject(mesh);
    const center = new THREE.Vector3();
    box.getCenter(center);

    selectPart(mesh.name, [center.x, center.y, center.z], mesh.userData);
  };

  if (!modelScene) return null;

  return (
    <primitive
      ref={groupRef}
      object={modelScene}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  );
};

// Warm cache with Draco decoder
useGLTF.preload('/models/body.glb', '/draco/gltf/');
