'use client';

import React from 'react';
import { Bone, Eye, EyeOff, Flame, RotateCcw, Scissors } from 'lucide-react';
import { useAnatomyStore } from '../../store/useAnatomyStore';

export const SystemToolbar: React.FC = () => {
  const visibility = useAnatomyStore((state) => state.systemVisibility);
  const opacity = useAnatomyStore((state) => state.muscleOpacity);
  const dissected = useAnatomyStore((state) => state.dissectedPartIds);
  const toggleSystem = useAnatomyStore((state) => state.toggleSystem);
  const setMuscleOpacity = useAnatomyStore((state) => state.setMuscleOpacity);
  const restore = useAnatomyStore((state) => state.restoreDissections);
  const selectPart = useAnatomyStore((state) => state.selectPart);

  const layers = [
    { id: 'muscular' as const, name: 'Muscle layer', note: 'Reveal fibers & attachments', icon: Flame, hue: 'rose' },
    { id: 'skeletal' as const, name: 'Skeletal layer', note: 'Framework & articulations', icon: Bone, hue: 'cyan' },
  ];

  return <aside className="atlas-surface desktop-only absolute bottom-7 left-7 z-20 w-72 rounded-2xl p-4 pointer-events-auto">
    <div className="mb-4 flex items-center justify-between"><div><p className="atlas-label">Specimen layers</p><p className="mt-1 text-sm font-semibold text-slate-100">Explore by tissue</p></div><span className="rounded-full bg-white/[.05] px-2 py-1 font-mono text-[10px] text-slate-400">826 MESHES</span></div>
    <div className="space-y-2">
      {layers.map(({ id, name, note, icon: Icon, hue }) => <button key={id} onClick={() => toggleSystem(id)} className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition ${visibility[id] ? (hue === 'rose' ? 'border-rose-300/25 bg-rose-300/[.07]' : 'border-cyan-300/25 bg-cyan-300/[.07]') : 'border-white/[.06] bg-black/10 opacity-55'}`}>
        <span className={`grid h-8 w-8 place-items-center rounded-lg ${hue === 'rose' ? 'bg-rose-400/15 text-rose-300' : 'bg-cyan-300/15 text-cyan-200'}`}><Icon size={16} /></span>
        <span className="flex-1"><span className="block text-xs font-semibold text-slate-200">{name}</span><span className="block pt-0.5 text-[10px] text-slate-500">{note}</span></span>
        {visibility[id] ? <Eye size={15} className="text-slate-300" /> : <EyeOff size={15} className="text-slate-500" />}
      </button>)}
    </div>
    <div className="mt-4 border-t border-white/[.08] pt-3">
      <div className="mb-2 flex justify-between"><span className="text-[11px] font-medium text-slate-300">Muscle transparency</span><span className="font-mono text-[11px] text-rose-300">{Math.round(opacity * 100)}%</span></div>
      <input aria-label="Muscle transparency" type="range" min="0" max="1" step="0.02" value={opacity} onChange={(e) => setMuscleOpacity(Number(e.target.value))} className="h-1.5 w-full cursor-pointer accent-rose-400" />
    </div>
    <div className="mt-4 flex gap-2 border-t border-white/[.08] pt-3">
      <button onClick={() => selectPart('Frontal bone', [0, 1.4, 0])} className="rounded-lg bg-white/[.055] px-2.5 py-1.5 text-[10px] font-medium text-slate-300 hover:bg-white/[.1]">Cranium</button>
      <button onClick={() => selectPart('Biceps brachii', [0.45, 0.5, 0])} className="rounded-lg bg-white/[.055] px-2.5 py-1.5 text-[10px] font-medium text-slate-300 hover:bg-white/[.1]">Upper limb</button>
      {dissected.length > 0 && <button onClick={restore} className="ml-auto flex items-center gap-1 rounded-lg bg-amber-300/10 px-2 py-1.5 text-[10px] font-medium text-amber-200"><RotateCcw size={12} /> Restore</button>}
    </div>
    {dissected.length > 0 && <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-200/80"><Scissors size={11} /> {dissected.length} structure{dissected.length !== 1 ? 's' : ''} removed</div>}
  </aside>;
};
