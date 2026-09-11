'use client';

import React, { useState } from 'react';
import { Crosshair, ExternalLink, Maximize2, Scissors, X } from 'lucide-react';
import { useAnatomyStore } from '../../store/useAnatomyStore';

export const InfoPanel: React.FC = () => {
  const [tab, setTab] = useState<'profile' | 'clinical' | 'supply'>('profile');
  const selected = useAnatomyStore((state) => state.selectedPartId);
  const isolated = useAnatomyStore((state) => state.isolatedPartId);
  const isOpen = useAnatomyStore((state) => state.isSidebarOpen);
  const data = useAnatomyStore((state) => state.getSelectedPartData)();
  const select = useAnatomyStore((state) => state.selectPart);
  const isolate = useAnatomyStore((state) => state.setIsolatedPart);
  const dissect = useAnatomyStore((state) => state.dissectPart);
  const setOpen = useAnatomyStore((state) => state.setSidebarOpen);

  if (!isOpen) return <button onClick={() => setOpen(true)} className="atlas-surface absolute right-5 top-24 z-20 grid h-10 w-10 place-items-center rounded-xl text-cyan-200" title="Open analysis panel"><Crosshair size={17} /></button>;

  return <aside className="atlas-surface absolute bottom-4 right-4 z-20 flex max-h-[220px] w-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl pointer-events-auto md:bottom-auto md:right-7 md:top-[5.5rem] md:max-h-[calc(100vh-7rem)] md:w-[355px]">
    <div className="flex items-start justify-between border-b border-white/[.08] p-5">
      <div className="min-w-0"><p className="atlas-label">{data ? `${data.system} / ${data.category || 'structure'}` : 'Structure analysis'}</p><h2 className="mt-1 truncate text-lg font-semibold tracking-tight text-slate-100">{data?.commonName || 'Select a structure'}</h2>{data && <p className="mt-0.5 truncate font-serif text-xs italic text-cyan-200/80">{data.scientificName}</p>}</div>
      <button onClick={() => setOpen(false)} className="ml-3 rounded-lg p-1.5 text-slate-500 hover:bg-white/[.06] hover:text-slate-200"><X size={16} /></button>
    </div>
    {data ? <>
      <div className="grid grid-cols-3 gap-2 border-b border-white/[.08] p-3">
        <button onClick={() => select(data.id, data.coordinates)} className="flex flex-col items-center gap-1 rounded-xl bg-cyan-300/[.08] px-2 py-2 text-[10px] font-semibold text-cyan-100 hover:bg-cyan-300/[.15]"><Crosshair size={15} /> Focus</button>
        <button onClick={() => isolate(data.id)} className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-semibold ${isolated === selected ? 'bg-amber-300/15 text-amber-100' : 'bg-white/[.05] text-slate-300 hover:bg-white/[.09]'}`}><Maximize2 size={15} /> {isolated === selected ? 'Restore' : 'Isolate'}</button>
        <button onClick={() => dissect(data.id)} className="flex flex-col items-center gap-1 rounded-xl bg-rose-400/[.09] px-2 py-2 text-[10px] font-semibold text-rose-100 hover:bg-rose-400/[.16]"><Scissors size={15} /> Dissect</button>
      </div>
      <div className="flex gap-4 border-b border-white/[.08] px-5 pt-3">{([['profile', 'Profile'], ['clinical', 'Clinical'], ['supply', 'Neurovascular']] as const).map(([key, label]) => <button key={key} onClick={() => setTab(key)} className={`border-b-2 pb-2.5 text-[11px] font-semibold transition ${tab === key ? 'border-cyan-200 text-cyan-100' : 'border-transparent text-slate-500 hover:text-slate-200'}`}>{label}</button>)}</div>
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-5">
        {tab === 'profile' && <div className="space-y-4"><Section title="Anatomical overview">{data.description}</Section><Section title="Function & movement">{data.actions || data.primaryFunction}</Section>{data.wikiLink && <a href={data.wikiLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-cyan-300/20 bg-cyan-300/[.06] px-3 py-2.5 text-xs font-medium text-cyan-100 hover:bg-cyan-300/[.1]">Reference entry <ExternalLink size={14} /></a>}</div>}
        {tab === 'clinical' && <div className="space-y-3"><p className="atlas-label">Clinical considerations</p>{data.clinicalSignificance.map((item, index) => <div key={index} className="rounded-xl border border-white/[.07] bg-black/10 p-3 text-xs leading-relaxed text-slate-300"><span className="mr-2 text-cyan-300">0{index + 1}</span>{item}</div>)}</div>}
        {tab === 'supply' && <div className="space-y-4"><Section title="Innervation">{data.innervation || 'Regional somatic or autonomic pathways.'}</Section><Section title="Arterial supply & venous return">{data.bloodSupply || 'Regional systemic arterial branches and companion venous drainage.'}</Section></div>}
      </div>
    </> : <div className="flex flex-1 flex-col justify-center p-7"><div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-cyan-300/[.1] text-cyan-200"><Crosshair size={21} /></div><h3 className="text-sm font-semibold text-slate-100">Anatomy, in context.</h3><p className="mt-2 max-w-[245px] text-xs leading-relaxed text-slate-400">Click a muscle or bone to inspect its terminology, movement, clinical relevance, and blood or nerve supply.</p></div>}
  </aside>;
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => <section><p className="atlas-label mb-2">{title}</p><p className="rounded-xl border border-white/[.07] bg-black/10 p-3 text-xs leading-relaxed text-slate-300">{children}</p></section>;
