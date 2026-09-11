'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, Box, ChevronRight, RotateCcw, Search, X } from 'lucide-react';
import { ANATOMY_CATALOGUE } from '../../data/anatomyCatalogue';
import { useAnatomyStore } from '../../store/useAnatomyStore';
import { RenderMode } from '../../types/anatomy';

export const HeaderHUD: React.FC = () => {
  const renderMode = useAnatomyStore((state) => state.renderMode);
  const explodedView = useAnatomyStore((state) => state.explodedView);
  const selectedPartId = useAnatomyStore((state) => state.selectedPartId);
  const selectPart = useAnatomyStore((state) => state.selectPart);
  const setRenderMode = useAnatomyStore((state) => state.setRenderMode);
  const toggleExplodedView = useAnatomyStore((state) => state.toggleExplodedView);
  const resetView = useAnatomyStore((state) => state.resetView);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return ANATOMY_CATALOGUE.filter(({ cleanName, latinName, id }) =>
      `${cleanName} ${latinName} ${id}`.toLowerCase().includes(term)
    ).slice(0, 7);
  }, [query]);

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <header className="absolute inset-x-0 top-0 z-30 flex items-start justify-between p-4 md:p-6 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-cyan-300 text-slate-950 grid place-items-center shadow-[0_0_35px_rgba(98,212,232,.26)]">
          <Activity size={21} strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <div className="flex items-center gap-2"><h1 className="font-semibold tracking-tight text-slate-100">Anatomy Atlas</h1><span className="atlas-label rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-cyan-200">Studio</span></div>
          <p className="mt-1 text-[11px] text-slate-400">Interactive skeletal & muscular analysis</p>
        </div>
      </div>

      <div ref={ref} className="pointer-events-auto relative mt-0.5 hidden w-[min(34vw,400px)] md:block">
        <Search className="absolute left-3.5 top-3 text-cyan-200/80" size={16} />
        <input value={query} onFocus={() => setOpen(true)} onChange={(e) => { setQuery(e.target.value); setOpen(true); }} placeholder="Find a muscle, bone, or Latin name" className="atlas-surface h-10 w-full rounded-xl pl-10 pr-9 text-xs text-slate-100 outline-none transition focus:border-cyan-300/50" />
        {query && <button onClick={() => { setQuery(''); setOpen(false); }} className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-200"><X size={16} /></button>}
        {open && results.length > 0 && <div className="atlas-surface absolute mt-2 w-full overflow-hidden rounded-xl p-1">
          {results.map((item) => <button key={item.id} onClick={() => { selectPart(item.id); setQuery(''); setOpen(false); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-white/[.06]">
            <span className={`h-2 w-2 rounded-full ${item.system === 'muscular' ? 'bg-rose-400' : 'bg-cyan-300'}`} />
            <span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium text-slate-100">{item.cleanName}</span><span className="block truncate font-serif text-[11px] italic text-slate-400">{item.latinName}</span></span><ChevronRight size={14} className="text-slate-500" />
          </button>)}
        </div>}
      </div>

      <div className="pointer-events-auto flex items-center gap-2">
        <div className="atlas-surface desktop-only flex rounded-xl p-1">
          {(['standard', 'xray', 'wireframe'] as RenderMode[]).map((mode) => <button key={mode} onClick={() => setRenderMode(mode)} className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition ${renderMode === mode ? 'bg-cyan-300 text-slate-950' : 'text-slate-400 hover:text-slate-100'}`}>{mode}</button>)}
        </div>
        <button onClick={toggleExplodedView} className={`atlas-surface flex h-10 items-center gap-2 rounded-xl px-3 text-xs font-medium ${explodedView ? 'border-amber-300/50 text-amber-200' : 'text-slate-300'}`} title="Toggle exploded view"><Box size={15} /><span className="desktop-only">Explode</span></button>
        <button onClick={resetView} className="atlas-surface grid h-10 w-10 place-items-center rounded-xl text-slate-400 hover:text-cyan-200" title="Reset analysis"><RotateCcw size={16} /></button>
      </div>
      {selectedPartId && <div className="absolute left-1/2 top-[74px] hidden -translate-x-1/2 rounded-full border border-white/10 bg-slate-950/65 px-3 py-1 text-[10px] font-mono text-slate-300 backdrop-blur md:block">ANALYZING · {selectedPartId}</div>}
    </header>
  );
};
