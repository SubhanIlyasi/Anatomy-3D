'use client';

import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Environment, ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { ModelLoader } from './ModelLoader';
import { CanvasLoader } from '../ui/CanvasLoader';
import { useAnatomyStore } from '../../store/useAnatomyStore';

interface SceneProps {
  modelUrl?: string | null;
}

/**
 * CameraManager
 * Synchronizes the Zustand cameraTarget with Drei's CameraControls for smooth transitions.
 */
const CameraManager: React.FC = () => {
  const controlsRef = useRef<CameraControls>(null);
  const cameraTarget = useAnatomyStore((state) => state.cameraTarget);
  const selectedPartId = useAnatomyStore((state) => state.selectedPartId);

  useEffect(() => {
    if (!controlsRef.current) return;

    if (cameraTarget) {
      const [tx, ty, tz] = cameraTarget;
      // Focus smoothly on the selected anatomical part with close observation distance
      controlsRef.current.setLookAt(
        tx + 0.15,
        ty + 0.1,
        tz + 1.2,
        tx,
        ty,
        tz,
        true // smooth animation
      );
    } else {
      // Return to full body posture
      controlsRef.current.setLookAt(
        0,
        0.2,
        4.6,
        0,
        0,
        0,
        true
      );
    }
  }, [cameraTarget, selectedPartId]);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minDistance={0.5}
      maxDistance={9.0}
      minPolarAngle={Math.PI * 0.05}
      maxPolarAngle={Math.PI * 0.95}
      smoothTime={0.4}
      dollySpeed={0.8}
    />
  );
};

/**
 * ExaminationPedestal
 * Medical-grade holographic examination dais with grounded rings and subtle orientation markings.
 */
const ExaminationPedestal: React.FC = () => {
  return (
    <group position={[0, -1.93, 0]}>
      {/* Outer Cyan Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.45, 1.48, 64]} />
        <meshBasicMaterial color="#00f0ff" opacity={0.35} transparent side={THREE.DoubleSide} />
      </mesh>
      {/* Mid Blue Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.95, 0.97, 64]} />
        <meshBasicMaterial color="#38bdf8" opacity={0.2} transparent side={THREE.DoubleSide} />
      </mesh>
      {/* Inner Examination Disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.93, 64]} />
        <meshStandardMaterial
          color="#040d1a"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};

/**
 * Scene
 * Main responsive 3D WebGL Canvas with Medical Studio Lighting and PBR Reflections
 */
export const Scene: React.FC<SceneProps> = ({ modelUrl = '/models/body.glb' }) => {
  const selectPart = useAnatomyStore((state) => state.selectPart);

  // Deselect when clicking on empty canvas space
  const handlePointerMissed = () => {
    selectPart(null);
  };

  return (
    <div className="w-full h-full relative select-none bg-radial-gradient">
      <Canvas
        frameloop="always"
        shadows
        camera={{ position: [0, 0.2, 4.6], fov: 42 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          powerPreference: 'high-performance',
        }}
        onPointerMissed={handlePointerMissed}
      >
        {/* Subtle Ambient Fog */}
        <fog attach="fog" args={['#020617', 7, 24]} />

        {/* Photorealistic Studio HDR Reflections */}
        {/* <Environment preset="studio" environmentIntensity={0.85} /> */}

        {/* Ambient Medical Fill */}
        <ambientLight intensity={0.7} color="#f0f9ff" />

        {/* Primary Surgical Overhead Key Light */}
        <directionalLight
          position={[4, 7, 4]}
          intensity={2.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />

        {/* Secondary Lateral Fill Light (cool clinical blue) */}
        <directionalLight
          position={[-5, 2.5, 3]}
          intensity={1.1}
          color="#38bdf8"
        />

        {/* Posterior Silhouette Rim Light (sharp cyan contouring) */}
        <directionalLight
          position={[0, 4, -4.5]}
          intensity={1.6}
          color="#00f0ff"
        />

        {/* Subtle Warm Ground Bounce */}
        <directionalLight
          position={[0, -5, 2]}
          intensity={0.45}
          color="#fed7aa"
        />

        {/* Examination Dais / Holographic Floor */}
        <ExaminationPedestal />

        {/* Camera Tracking & Smooth Zoom */}
        <CameraManager />

        {/* High-Detail 3D Anatomy Model */}
        <Suspense fallback={<CanvasLoader />}>
          <ModelLoader modelUrl={modelUrl} />
        </Suspense>

        {/* Realistic Floor Contact Shadows */}
        {/* <ContactShadows
          position={[0, -1.92, 0]}
          opacity={0.65}
          scale={6}
          blur={1.8}
          far={3.5}
          color="#020617"
        /> */}

        {/* Holographic Medical Lab Ambience */}
        {/* <Sparkles
          count={25}
          scale={6}
          size={1.5}
          speed={0.25}
          opacity={0.2}
          color="#38bdf8"
        /> */}
      </Canvas>
    </div>
  );
};
