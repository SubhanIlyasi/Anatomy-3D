'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { HeaderHUD } from '../components/ui/HeaderHUD';
import { SystemToolbar } from '../components/ui/SystemToolbar';
import { InfoPanel } from '../components/ui/InfoPanel';
import { HoverTooltip } from '../components/ui/HoverTooltip';
import { NavigationHelp } from '../components/ui/NavigationHelp';

// Dynamically import 3D Scene with SSR disabled for clean WebGL mounting
const Scene = dynamic(
  () => import('../components/canvas/Scene').then((mod) => mod.Scene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#070b12] text-cyan-400 font-mono">
        <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-4" />
        <span className="text-xs uppercase tracking-widest text-slate-400">
          Mounting WebGL Pipeline...
        </span>
      </div>
    ),
  }
);

export default function AnatomyPage() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#070b12]">
      {/* HUD Header Bar (Brand, Search, View Controls) */}
      <HeaderHUD />

      {/* Floating Anatomical Layer Filters (Left Sidebar) */}
      <SystemToolbar />

      {/* 3D WebGL Canvas Layer */}
      <div className="w-full h-full">
        <Scene modelUrl="/models/body.glb" />
      </div>

      {/* Hover State Raycast Tooltip */}
      <HoverTooltip />

      {/* Navigation Shortcut Guide */}
      <NavigationHelp />

      {/* Detailed Anatomical & Clinical Inspector Panel (Right Drawer) */}
      <InfoPanel />
    </main>
  );
}
