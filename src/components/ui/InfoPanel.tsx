'use client';

import React, { useState } from 'react';
import {
  X,
  Target,
  Maximize2,
  Minimize2,
  Scissors,
  AlertTriangle,
  Stethoscope,
  Info,
  ChevronRight,
  Flame,
  Bone,
  Zap,
  ExternalLink,
} from 'lucide-react';
import { useAnatomyStore } from '../../store/useAnatomyStore';

export const InfoPanel: React.FC = () => {
  const selectedPartId = useAnatomyStore((state) => state.selectedPartId);
  const isolatedPartId = useAnatomyStore((state) => state.isolatedPartId);
  const isSidebarOpen = useAnatomyStore((state) => state.isSidebarOpen);

  const selectPart = useAnatomyStore((state) => state.selectPart);
  const setIsolatedPart = useAnatomyStore((state) => state.setIsolatedPart);
  const dissectPart = useAnatomyStore((state) => state.dissectPart);
  const setSidebarOpen = useAnatomyStore((state) => state.setSidebarOpen);
  const getSelectedPartData = useAnatomyStore((state) => state.getSelectedPartData);

  const [activeTab, setActiveTab] = useState<'overview' | 'clinical' | 'neurovascular'>('overview');

  const partData = getSelectedPartData();
  const isIsolated = selectedPartId !== null && isolatedPartId === selectedPartId;
  const isMuscle = partData?.system === 'muscular';

  if (!isSidebarOpen) {
    return (
      <button
        onClick={() => setSidebarOpen(true)}
        className="absolute right-6 top-24 z-20 p-3 bg-slate-950/80 hover:bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-medical-panel backdrop-blur-xl text-cyan-400 hover:text-cyan-300 transition-all pointer-events-auto group"
        title="Open Medical Inspector"
      >
        <Info className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  return (
    <aside className="absolute right-6 top-24 bottom-8 z-20 w-84 md:w-96 bg-slate-950/92 border border-slate-800/80 rounded-2xl shadow-medical-panel backdrop-blur-2xl flex flex-col pointer-events-auto overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Panel Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-start justify-between bg-slate-900/50">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span
              className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border flex items-center space-x-1 ${
                isMuscle
                  ? 'border-rose-500/40 bg-rose-500/15 text-rose-400'
                  : 'border-cyan-500/40 bg-cyan-500/15 text-cyan-400'
              }`}
            >
              {isMuscle ? <Flame className="w-3 h-3 mr-1" /> : <Bone className="w-3 h-3 mr-1" />}
              {partData ? partData.system.toUpperCase() : 'ANATOMY ATLAS'}
            </span>
            {partData?.subsystem && (
              <span className="text-[10px] font-mono text-slate-400">
                • {partData.subsystem}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight leading-snug">
            {partData ? partData.commonName : 'Clinical Inspector'}
          </h2>
          {partData && (
            <p className="text-xs italic font-serif text-cyan-400/90 mt-0.5">
              {partData.scientificName}
            </p>
          )}
        </div>

        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      {partData ? (
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {/* Action Toolbar */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => selectPart(partData.id, partData.coordinates)}
              className="flex items-center justify-center space-x-1 py-2 px-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all shadow-sm"
              title="Center Camera on Structure"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Center</span>
            </button>

            <button
              onClick={() => setIsolatedPart(partData.id)}
              className={`flex items-center justify-center space-x-1 py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all ${
                isIsolated
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                  : 'bg-slate-900/80 hover:bg-slate-850 border-slate-700/60 text-slate-300'
              }`}
              title="Dim All Other Structures"
            >
              {isIsolated ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Show All</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Isolate</span>
                </>
              )}
            </button>

            <button
              onClick={() => dissectPart(partData.id)}
              className="flex items-center justify-center space-x-1 py-2 px-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all shadow-sm"
              title="Peel/Hide this layer to reveal structures beneath"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Dissect</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 mr-4 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Overview & Actions
            </button>
            <button
              onClick={() => setActiveTab('clinical')}
              className={`pb-2 mr-4 border-b-2 transition-colors ${
                activeTab === 'clinical'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Clinical Pathology
            </button>
            <button
              onClick={() => setActiveTab('neurovascular')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'neurovascular'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Nerve / Perfusion
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-3.5">
              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Anatomical Description
                </h4>
                <div className="text-xs leading-relaxed text-slate-300 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60 max-h-48 overflow-y-auto custom-scrollbar whitespace-pre-line">
                  {partData.description}
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Physiological Function & Actions
                </h4>
                <p className="text-xs leading-relaxed text-slate-300 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                  {partData.actions || partData.primaryFunction}
                </p>
              </div>

              {/* Wikipedia External Medical Link */}
              {partData.wikiLink && (
                <div>
                  <a
                    href={partData.wikiLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center justify-between transition-colors group"
                  >
                    <span>Read Medical Encyclopedia Entry</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Clinical Significance */}
          {activeTab === 'clinical' && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4" />
                <span>Clinical & Pathological Pearls</span>
              </div>
              <ul className="space-y-2">
                {partData.clinicalSignificance.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-xs leading-relaxed text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex items-start space-x-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tab 3: Neurovascular */}
          {activeTab === 'neurovascular' && (
            <div className="space-y-3.5">
              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Innervation</span>
                </h4>
                <p className="text-xs leading-relaxed text-slate-300 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                  {partData.innervation || 'Innervated via regional somatic/autonomic nerve branches.'}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Arterial Perfusion & Venous Drainage</span>
                </h4>
                <p className="text-xs leading-relaxed text-slate-300 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                  {partData.bloodSupply || 'Supplied via regional systemic arterial branches.'}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-cyan-sm">
            <Stethoscope className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-100">Atlas Inspector Ready</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[240px] leading-relaxed">
              Hover over and click any of the 826 bones or muscles to view Terminologia Anatomica, functions, and clinical pearls.
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="w-full pt-4 border-t border-slate-800/80 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-2">
              Featured Major Structures
            </span>
            {[
              { id: 'Frontal bone', label: 'Frontal Bone (Cranium)' },
              { id: 'Zygomaticus major muscle', label: 'Zygomaticus Major Muscle' },
              { id: 'Deltoid muscle.002', label: 'Deltoid Muscle' },
              { id: 'Biceps brachii', label: 'Biceps Brachii' },
              { id: 'Gluteus maximus muscle', label: 'Gluteus Maximus Muscle' },
            ].map((quick) => (
              <button
                key={quick.id}
                onClick={() => selectPart(quick.id)}
                className="w-full py-2 px-3 rounded-xl bg-slate-900/60 hover:bg-cyan-950/30 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 flex items-center justify-between transition-all"
              >
                <span>{quick.label}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>Z-ANATOMY / TERMINOLOGIA ANATOMICA</span>
        <span className="text-cyan-400">ONLINE</span>
      </div>
    </aside>
  );
};
