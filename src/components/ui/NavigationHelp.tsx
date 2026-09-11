'use client';

import React, { useState } from 'react';
import { HelpCircle, MousePointer, Move, ZoomIn } from 'lucide-react';

export const NavigationHelp: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 pointer-events-auto">
      {isExpanded ? (
        <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl shadow-medical-panel backdrop-blur-md text-[11px] text-slate-300 space-y-1.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-slate-400 font-mono text-[10px]">
            <span>VIEWPORT CONTROLS</span>
            <button
              onClick={() => setIsExpanded(false)}
              className="hover:text-slate-100 font-bold"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <MousePointer className="w-3.5 h-3.5 text-cyan-400" />
            <span><strong className="text-slate-100">Left Click:</strong> Rotate / Orbit</span>
          </div>
          <div className="flex items-center space-x-2">
            <Move className="w-3.5 h-3.5 text-cyan-400" />
            <span><strong className="text-slate-100">Right Click:</strong> Pan Camera</span>
          </div>
          <div className="flex items-center space-x-2">
            <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
            <span><strong className="text-slate-100">Scroll:</strong> Zoom (Distance Limited)</span>
          </div>
          <div className="pt-1 text-[10px] text-cyan-400/80 font-mono">
            Click a structure to focus & inspect
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 text-xs backdrop-blur-md transition-all"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Controls</span>
        </button>
      )}
    </div>
  );
};
