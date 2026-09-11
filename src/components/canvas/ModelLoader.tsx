'use client';

import React from 'react';
import { RealisticAnatomyModel } from './RealisticAnatomyModel';
import { ProceduralAnatomy } from './ProceduralAnatomy';

interface ModelLoaderProps {
  modelUrl?: string | null;
}

interface ModelErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface ModelErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ModelErrorBoundary extends React.Component<ModelErrorBoundaryProps, ModelErrorBoundaryState> {
  constructor(props: ModelErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ModelErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('ModelLoader caught an error loading 3D GLB model. Falling back to ProceduralAnatomy:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
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
    return (
      <ModelErrorBoundary fallback={<ProceduralAnatomy />}>
        <RealisticAnatomyModel url={modelUrl} />
      </ModelErrorBoundary>
    );
  }

  // Fallback to procedural anatomy if explicitly null
  return <ProceduralAnatomy />;
};
