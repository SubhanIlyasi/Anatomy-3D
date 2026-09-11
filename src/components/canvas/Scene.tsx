'use client';

import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Environment } from '@react-three/drei';
import {
  EffectComposer,
  SSAO,
  Bloom,
  Vignette,
  ToneMapping,
  ChromaticAberration,
} from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import { Vector2 } from 'three';
import * as THREE from 'three';
import { ModelLoader } from './ModelLoader';
import { CanvasLoader } from '../ui/CanvasLoader';
import { useAnatomyStore } from '../../store/useAnatomyStore';

interface SceneProps {
  modelUrl?: string | null;
}

/* ── Camera Manager ──────────────────────────────────── */
const CameraManager: React.FC = () => {
  const controlsRef = useRef<CameraControls>(null);
  const cameraTarget = useAnatomyStore((s) => s.cameraTarget);
  const selectedPartId = useAnatomyStore((s) => s.selectedPartId);

  useEffect(() => {
    if (!controlsRef.current) return;
    if (cameraTarget) {
      const [tx, ty, tz] = cameraTarget;
      controlsRef.current.setLookAt(tx + 0.15, ty + 0.1, tz + 1.2, tx, ty, tz, true);
    } else {
      controlsRef.current.setLookAt(0, 0.1, 4.5, 0, 0, 0, true);
    }
  }, [cameraTarget, selectedPartId]);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minDistance={0.4}
      maxDistance={9.0}
      minPolarAngle={Math.PI * 0.02}
      maxPolarAngle={Math.PI * 0.98}
      smoothTime={0.35}
      dollySpeed={0.8}
    />
  );
};

/* ── Examination Pedestal ────────────────────────────── */
const ExaminationPedestal: React.FC = () => (
  <group position={[0, -1.93, 0]}>
    {/* Outer glow ring */}
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.52, 1.56, 128]} />
      <meshBasicMaterial color="#00d4ff" opacity={0.18} transparent side={THREE.DoubleSide} />
    </mesh>
    {/* Mid ring */}
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.0, 1.03, 128]} />
      <meshBasicMaterial color="#0099cc" opacity={0.12} transparent side={THREE.DoubleSide} />
    </mesh>
    {/* Inner disc – dark polished surface */}
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[1.0, 128]} />
      <meshStandardMaterial
        color="#03080f"
        roughness={0.08}
        metalness={0.92}
        envMapIntensity={1.2}
      />
    </mesh>
    {/* Subtle floor plane for contact shadow */}
    <mesh rotation={[-Math.PI / 2, 0, -0.001]} position={[0, -0.001, 0]}>
      <planeGeometry args={[18, 18]} />
      <meshStandardMaterial color="#010810" roughness={1.0} metalness={0.0} />
    </mesh>
  </group>
);

/* ── Post-processing Effects ─────────────────────────── */
const Effects: React.FC = () => (
  <EffectComposer multisampling={8}>
    {/* Ambient Occlusion — adds real depth between muscles/bones */}
    <SSAO
      blendFunction={BlendFunction.MULTIPLY}
      samples={32}
      radius={0.08}
      intensity={18}
      luminanceInfluence={0.6}
      color={new THREE.Color('#000000')}
    />
    {/* Bloom — makes emissive highlights glow beautifully */}
    <Bloom
      intensity={0.55}
      luminanceThreshold={0.72}
      luminanceSmoothing={0.08}
      mipmapBlur
    />
    {/* Chromatic Aberration — ultra-subtle, adds photographic realism */}
    <ChromaticAberration
      blendFunction={BlendFunction.NORMAL}
      offset={new Vector2(0.0004, 0.0004)}
    />
    {/* Vignette — darkens edges like a camera lens */}
    <Vignette eskil={false} offset={0.18} darkness={0.62} />
    {/* ACES Filmic tonemapping */}
    <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
  </EffectComposer>
);

/* ── Main Scene ──────────────────────────────────────── */
export const Scene: React.FC<SceneProps> = ({ modelUrl = '/models/body.glb' }) => {
  const selectPart = useAnatomyStore((s) => s.selectPart);

  return (
    <div className="w-full h-full relative select-none" style={{ background: '#010810' }}>
      <Canvas
        shadows="soft"
        camera={{ position: [0, 0.1, 4.5], fov: 40 }}
        gl={{
          antialias: false, // MSAA handled by EffectComposer multisampling
          powerPreference: 'high-performance',
          alpha: false,
        }}
        onPointerMissed={() => selectPart(null)}
      >
        {/* Deep space fog for atmosphere */}
        <fog attach="fog" args={['#010810', 8, 26]} />

        {/* Custom Poly Haven Studio HDRI — 1K, realistic studio reflections */}
        <Environment files="/hdri/studio.hdr" environmentIntensity={0.55} background={false} />

        {/* ── Lighting ── */}
        {/* 1. Soft ambient base — prevents pitch black shadows */}
        <ambientLight intensity={0.22} color="#e8f4ff" />

        {/* 2. Primary surgical overhead — warm white, main illumination */}
        <directionalLight
          position={[2, 8, 3]}
          intensity={3.2}
          color="#fff8f0"
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-bias={-0.00005}
          shadow-normalBias={0.02}
          shadow-camera-near={0.5}
          shadow-camera-far={20}
          shadow-camera-left={-3}
          shadow-camera-right={3}
          shadow-camera-top={5}
          shadow-camera-bottom={-3}
        />

        {/* 3. Cool clinical fill — left side, clinical blue-white */}
        <directionalLight
          position={[-4, 3, 2]}
          intensity={1.4}
          color="#cce8ff"
        />

        {/* 4. Sharp posterior rim — defines body silhouette */}
        <directionalLight
          position={[0, 3, -5]}
          intensity={2.1}
          color="#00c8ff"
        />

        {/* 5. Sub-surface warm bounce from below */}
        <directionalLight
          position={[0, -6, 1]}
          intensity={0.35}
          color="#ff9966"
        />

        {/* 6. Right side accent */}
        <directionalLight
          position={[5, 1, 0]}
          intensity={0.7}
          color="#88ccff"
        />

        {/* Examination Dais */}
        <ExaminationPedestal />

        {/* Camera Controls */}
        <CameraManager />

        {/* 3D Anatomy Model */}
        <Suspense fallback={<CanvasLoader />}>
          <ModelLoader modelUrl={modelUrl} />
        </Suspense>

        {/* Post-Processing */}
        <Effects />
      </Canvas>
    </div>
  );
};
