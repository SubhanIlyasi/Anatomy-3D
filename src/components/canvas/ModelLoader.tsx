'use client';

import React from 'react';
import { RealisticAnatomyModel } from './RealisticAnatomyModel';
import { ProceduralAnatomy } from './ProceduralAnatomy';

interface ModelLoaderProps {
  modelUrl?: string | null;
}

/**
 * ModelLoader Component
 * Renders the high-fidelity 826-mesh Z-Anatomy 3D model with realistic PBR shading,
 * layer dissection tools, and continuous muscle opacity adjustments.
 */
export const ModelLoader: React.FC<ModelLoaderProps> = ({
  modelUrl = '/models/body.glb',
}) => {
  if (modelUrl) {
    return <RealisticAnatomyModel url={modelUrl} />;
  }

  // Fallback to procedural anatomy if explicitly null
  return <ProceduralAnatomy />;
};
