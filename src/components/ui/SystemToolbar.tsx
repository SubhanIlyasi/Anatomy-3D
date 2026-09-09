'use client';

import React from 'react';
import {
  Eye,
  EyeOff,
  Bone,
  Flame,
  Layers,
  Sliders,
  RotateCcw,
  Scissors,
  CheckCircle2,
} from 'lucide-react';
import { useAnatomyStore } from '../../store/useAnatomyStore';
import { AnatomicalSystem } from '../../types/anatomy';

export const SystemToolbar: React.FC = () => {
  const systemVisibility = useAnatomyStore((state) => state.systemVisibility);
  const muscleOpacity = useAnatomyStore((state) => state.muscleOpacity);
  const dissectedPartIds = useAnatomyStore((state) => state.dissectedPartIds);

  const toggleSystem = useAnatomyStore((state) => state.toggleSystem);
  const setSystemVisibility = useAnatomyStore((state) => state.setSystemVisibility);
  const setMuscleOpacity = useAnatomyStore((state) => state.setMuscleOpacity);
  const restoreDissections = useAnatomyStore((state) => state.restoreDissections);
  const selectPart = useAnatomyStore((state) => state.selectPart);

  const isBonesVisible = systemVisibility.skeletal ?? true;
  const isMusclesVisible = systemVisibility.muscular ?? true;

  return (
    <aside className="absolute left-6 top-24 z-20 w-72 bg-slate-950/90 border border-slate-800/80 rounded-2xl shadow-medical-panel backdrop-blur-2xl p-4 pointer-events-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Anatomical Systems
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
            826 MESHES
          </span>
        </div>
      </div>

      {/* Primary Anatomical Layers */}
      <div className="space-y-2">
        {/* Muscular System */}
        <div
          onClick={() => toggleSystem('muscular')}
          className={`group flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
            isMusclesVisible
              ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50'
              : 'bg-slate-900/40 border-slate-850 opacity-60'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-100">Muscular System</div>
              <div className="text-[10px] text-slate-400 font-mono">390+ Striated Muscles</div>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSystem('muscular');
            }}
            className={`p-1.5 rounded-lg border transition-colors ${
              isMusclesVisible
                ? 'text-rose-400 border-rose-500/40 bg-rose-500/10'
                : 'text-slate-500 border-slate-800 bg-slate-900/40'
            }`}
          >
            {isMusclesVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Skeletal System */}
        <div
          onClick={() => toggleSystem('skeletal')}
          className={`group flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
            isBonesVisible
              ? 'bg-cyan-950/20 border-cyan-500/30 hover:border-cyan-500/50'
              : 'bg-slate-900/40 border-slate-850 opacity-60'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Bone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-100">Skeletal System</div>
              <div className="text-[10px] text-slate-400 font-mono">335+ Osteoid Bones</div>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSystem('skeletal');
            }}
            className={`p-1.5 rounded-lg border transition-colors ${
              isBonesVisible
                ? 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10'
                : 'text-slate-500 border-slate-800 bg-slate-900/40'
            }`}
          >
            {isBonesVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Muscle Opacity / Dissection Depth Slider */}
      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-slate-300 font-medium">
            <Sliders className="w-3.5 h-3.5 text-rose-400" />
            <span>Muscle Layer Opacity</span>
          </div>
          <span className="font-mono text-cyan-400 font-semibold text-xs">
            {Math.round(muscleOpacity * 100)}%
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.02"
          value={muscleOpacity}
          onChange={(e) => setMuscleOpacity(parseFloat(e.target.value))}
          className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer transition-all"
        />

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>Skeleton (0%)</span>
          <span>Translucent</span>
          <span>Full (100%)</span>
        </div>
      </div>

      {/* Dissection Status & Peel Recovery */}
      {dissectedPartIds.length > 0 && (
        <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <Scissors className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-xs font-semibold text-amber-300">
                {dissectedPartIds.length} Layer{dissectedPartIds.length > 1 ? 's' : ''} Dissected
              </div>
              <div className="text-[10px] text-slate-400">Underlying structures exposed</div>
            </div>
          </div>
          <button
            onClick={restoreDissections}
            className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-[11px] font-semibold transition-colors flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restore</span>
          </button>
        </div>
      )}

      {/* Anatomical Region Focus Shortcuts */}
      <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
          Regional Focus Presets
        </span>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <button
            onClick={() => selectPart('Frontal bone', [0, 1.4, 0])}
            className="py-1.5 px-2.5 rounded-lg bg-slate-900/70 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-left transition-all font-medium"
          >
            Cranium & Face
          </button>
          <button
            onClick={() => selectPart('Sternum', [0, 0.7, 0])}
            className="py-1.5 px-2.5 rounded-lg bg-slate-900/70 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-left transition-all font-medium"
          >
            Thorax & Ribs
          </button>
          <button
            onClick={() => selectPart('Biceps brachii', [0.45, 0.5, 0])}
            className="py-1.5 px-2.5 rounded-lg bg-slate-900/70 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-left transition-all font-medium"
          >
            Upper Limb
          </button>
          <button
            onClick={() => selectPart('Gluteus maximus muscle', [0, -0.4, 0])}
            className="py-1.5 px-2.5 rounded-lg bg-slate-900/70 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-left transition-all font-medium"
          >
            Pelvis & Thigh
          </button>
        </div>
      </div>
    </aside>
  );
};
