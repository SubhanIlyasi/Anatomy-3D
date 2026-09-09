'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Layers,
  Activity,
  X,
  Flame,
  Bone,
} from 'lucide-react';
import { useAnatomyStore } from '../../store/useAnatomyStore';
import { ANATOMY_CATALOGUE } from '../../data/anatomyCatalogue';
import { RenderMode } from '../../types/anatomy';

export const HeaderHUD: React.FC = () => {
  const renderMode = useAnatomyStore((state) => state.renderMode);
  const explodedView = useAnatomyStore((state) => state.explodedView);
  const selectPart = useAnatomyStore((state) => state.selectPart);
  const setRenderMode = useAnatomyStore((state) => state.setRenderMode);
  const toggleExplodedView = useAnatomyStore((state) => state.toggleExplodedView);
  const resetView = useAnatomyStore((state) => state.resetView);

  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Search across all 826 anatomical structures by English, Latin, and ID
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ANATOMY_CATALOGUE.filter((item) => {
      return (
        item.cleanName.toLowerCase().includes(q) ||
        item.latinName.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    }).slice(0, 10);
  }, [query]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearching(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="absolute top-0 left-0 right-0 z-30 pointer-events-none px-6 py-4 flex items-center justify-between">
      {/* Brand & System Title */}
      <div className="flex items-center space-x-3 pointer-events-auto">
        <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-cyan-500/40 flex items-center justify-center shadow-medical-glow backdrop-blur-md">
          <Activity className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-100 tracking-tight flex items-center space-x-2">
            <span>BioDigital Atlas</span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              3D Clinical Pro
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 font-mono">
            826 Structures • Terminologia Anatomica
          </p>
        </div>
      </div>

      {/* Center Search Input */}
      <div ref={searchRef} className="relative w-80 md:w-96 pointer-events-auto">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-cyan-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search 826 muscles, bones, nerves, Latin..."
            value={query}
            onFocus={() => setIsSearching(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsSearching(true);
            }}
            className="w-full pl-10 pr-9 py-2 bg-slate-900/80 hover:bg-slate-900/95 focus:bg-slate-950 border border-slate-700/60 focus:border-cyan-500/80 rounded-xl text-xs text-slate-100 placeholder-slate-400 backdrop-blur-md shadow-lg outline-none transition-all"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setIsSearching(false);
              }}
              className="absolute right-3 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Autocomplete Dropdown */}
        {isSearching && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 max-h-72 overflow-y-auto bg-slate-950/95 border border-cyan-500/30 rounded-xl shadow-2xl backdrop-blur-xl divide-y divide-slate-800/60 z-50">
            {searchResults.map((item) => {
              const isMuscle = item.subType === 'muscle' || item.system === 'muscular';

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    selectPart(item.id);
                    setIsSearching(false);
                    setQuery('');
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-cyan-950/30 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-2 overflow-hidden pr-2">
                    {isMuscle ? (
                      <Flame className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    ) : (
                      <Bone className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    )}
                    <div className="truncate">
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 block truncate">
                        {item.cleanName}
                      </span>
                      <span className="text-[10px] font-serif italic text-cyan-400/80 block truncate">
                        {item.latinName}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded border flex-shrink-0 ${
                      isMuscle
                        ? 'bg-rose-950/40 text-rose-300 border-rose-800/50'
                        : 'bg-cyan-950/40 text-cyan-300 border-cyan-800/50'
                    }`}
                  >
                    {item.system}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Quick Tool Controls */}
      <div className="flex items-center space-x-2 pointer-events-auto">
        {/* Render Mode Switcher */}
        <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-xl p-1 shadow-md backdrop-blur-md">
          {(['standard', 'xray', 'wireframe'] as RenderMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setRenderMode(mode)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium uppercase tracking-wider transition-all ${
                renderMode === mode
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Exploded View Toggle */}
        <button
          onClick={toggleExplodedView}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all backdrop-blur-md shadow-md ${
            explodedView
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-500/20 shadow-lg'
              : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-slate-100'
          }`}
          title="Exploded Anatomical View"
        >
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Exploded</span>
        </button>

        {/* Reset Camera */}
        <button
          onClick={resetView}
          className="p-2 bg-slate-900/80 hover:bg-slate-800/90 text-slate-400 hover:text-cyan-300 border border-slate-800 rounded-xl transition-all shadow-md backdrop-blur-md"
          title="Reset Camera Orientation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
