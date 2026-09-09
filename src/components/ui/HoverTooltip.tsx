'use client';

import React from 'react';
import { useAnatomyStore } from '../../store/useAnatomyStore';
import { formatAnatomyName, deriveLatinName, classifyStructure } from '../../data/anatomyParser';

export const HoverTooltip: React.FC = () => {
  const hoveredPartId = useAnatomyStore((state) => state.hoveredPartId);
  const hoveredPartData = useAnatomyStore((state) => state.hoveredPartData);

  if (!hoveredPartId) return null;

  // Prefer enriched record data from Zustand, fallback to parser
  const fallbackFormat = formatAnatomyName(hoveredPartId);
  const cleanName = hoveredPartData?.commonName || fallbackFormat.cleanName;
  const latinName = hoveredPartData?.scientificName || deriveLatinName(fallbackFormat.baseName, fallbackFormat.side);
  const system = hoveredPartData?.system || classifyStructure(hoveredPartId).system;
  const category = hoveredPartData?.subsystem || hoveredPartData?.category;
  const isMuscle = system === 'muscular';

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-150 max-w-[90vw]">
      <div className="flex items-center space-x-3 px-4 py-2 bg-slate-950/95 border border-cyan-500/40 rounded-full shadow-medical-glow backdrop-blur-xl">
        <span
          className={`w-2 h-2 rounded-full animate-ping ${
            isMuscle ? 'bg-rose-500' : 'bg-cyan-400'
          }`}
        />
        <div className="flex items-baseline space-x-2">
          <span className="text-xs font-bold text-slate-100">{cleanName}</span>
          <span className="text-[11px] italic font-serif text-cyan-400">({latinName})</span>
        </div>
        {category && (
          <span className="hidden sm:inline text-[10px] text-slate-400 font-mono">
            • {category}
          </span>
        )}
        <span
          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
            isMuscle
              ? 'bg-rose-950/40 text-rose-300 border-rose-800/60'
              : 'bg-cyan-950/40 text-cyan-300 border-cyan-800/60'
          }`}
        >
          {system}
        </span>
      </div>
    </div>
  );
};
