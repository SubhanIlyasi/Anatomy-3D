'use client';

import React, { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { useAnatomyStore } from '../../store/useAnatomyStore';
import { AnatomicalSystem, RenderMode } from '../../types/anatomy';

interface AnatomyMeshProps {
  id: string;
  system: AnatomicalSystem;
  name: string;
  geometry: THREE.BufferGeometry;
  defaultColor?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
  explodedOffset?: [number, number, number];
}

export const AnatomyMesh: React.FC<AnatomyMeshProps> = ({
  id,
  system,
  geometry,
  defaultColor = '#94a3b8',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  explodedOffset = [0, 0, 0],
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Zustand Store Selectors
  const selectedPartId = useAnatomyStore((state) => state.selectedPartId);
  const hoveredPartId = useAnatomyStore((state) => state.hoveredPartId);
  const isolatedPartId = useAnatomyStore((state) => state.isolatedPartId);
  const systemVisibility = useAnatomyStore((state) => state.systemVisibility);
  const renderMode = useAnatomyStore((state) => state.renderMode);
  const explodedView = useAnatomyStore((state) => state.explodedView);

  const selectPart = useAnatomyStore((state) => state.selectPart);
  const hoverPart = useAnatomyStore((state) => state.hoverPart);

  // Status checks
  const isSelected = selectedPartId === id;
  const isHovered = hoveredPartId === id;
  const isVisible = systemVisibility[system] ?? true;
  const isIsolated = isolatedPartId === id;
  const isDimmed = isolatedPartId !== null && !isIsolated;

  // Compute calculated position accounting for exploded view
  const currentPosition = useMemo<[number, number, number]>(() => {
    if (!explodedView) return position;
    return [
      position[0] + explodedOffset[0],
      position[1] + explodedOffset[1],
      position[2] + explodedOffset[2],
    ];
  }, [position, explodedOffset, explodedView]);

  // Dynamic visual material properties
  const materialProps = useMemo(() => {
    const baseColor = new THREE.Color(defaultColor);
    let emissiveColor = new THREE.Color('#000000');
    let emissiveIntensity = 0;
    let opacity = 1.0;
    let roughness = 0.45;
    let metalness = 0.15;
    let wireframe = false;

    if (renderMode === 'wireframe') {
      wireframe = true;
    } else if (renderMode === 'xray') {
      opacity = 0.28;
      roughness = 0.1;
      metalness = 0.8;
    }

    if (isHovered) {
      emissiveColor = new THREE.Color('#00f0ff');
      emissiveIntensity = 0.75;
      baseColor.offsetHSL(0, 0.1, 0.1);
    }

    if (isSelected) {
      emissiveColor = new THREE.Color('#38bdf8');
      emissiveIntensity = 0.95;
      opacity = 1.0;
    }

    if (isDimmed) {
      opacity = 0.08;
      roughness = 0.9;
    }

    return {
      color: baseColor,
      emissive: emissiveColor,
      emissiveIntensity,
      roughness,
      metalness,
      transparent: opacity < 1.0 || isDimmed || renderMode === 'xray',
      opacity,
      wireframe,
    };
  }, [defaultColor, isHovered, isSelected, isDimmed, renderMode]);

  // Pointer event handlers with event propagation stopping
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    hoverPart(id);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
    hoverPart(null);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (meshRef.current) {
      // Calculate global bounding box center for camera focus
      meshRef.current.geometry.computeBoundingBox();
      const box = new THREE.Box3().setFromObject(meshRef.current);
      const center = new THREE.Vector3();
      box.getCenter(center);
      selectPart(id, [center.x, center.y, center.z]);
    } else {
      selectPart(id);
    }
  };

  if (!isVisible && !isIsolated) return null;

  return (
    <mesh
      ref={meshRef}
      name={id}
      geometry={geometry}
      position={currentPosition}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <meshStandardMaterial
        color={materialProps.color}
        emissive={materialProps.emissive}
        emissiveIntensity={materialProps.emissiveIntensity}
        roughness={materialProps.roughness}
        metalness={materialProps.metalness}
        transparent={materialProps.transparent}
        opacity={materialProps.opacity}
        wireframe={materialProps.wireframe}
        depthWrite={!materialProps.transparent}
      />
    </mesh>
  );
};
