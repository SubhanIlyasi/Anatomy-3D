'use client';

import React from 'react';
import { Html, useProgress } from '@react-three/drei';
import { Activity } from 'lucide-react';

export const CanvasLoader: React.FC = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/90 border border-cyan-500/30 backdrop-blur-xl shadow-2xl text-cyan-400 min-w-[260px] animate-pulse-glow">
        <div className="relative mb-4">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 flex items-center justify-center">
            <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
        </div>

        <span className="text-xs font-mono tracking-widest text-slate-400 uppercase mb-1">
          Initializing Bio-Render
        </span>
        <span className="text-xl font-bold font-mono text-cyan-300">
          {progress.toFixed(0)}%
        </span>

        {/* Medical ECG-style Progress Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 mt-3 overflow-hidden border border-cyan-500/20">
          <div
            className="bg-gradient-to-r from-cyan-500 to-sky-400 h-full transition-all duration-300 shadow-[0_0_10px_#00f0ff]"
            style={{ width: `${Math.max(progress, 5)}%` }}
          />
        </div>
      </div>
    </Html>
  );
};
