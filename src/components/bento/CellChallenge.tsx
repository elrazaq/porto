"use client";

import React from "react";
import { Swords, ArrowUpRight } from "lucide-react";

interface CellChallengeProps {
  onClick?: (e?: React.MouseEvent) => void;
}

export function CellChallenge({ onClick }: CellChallengeProps = {}) {
  return (
    <div
      onClick={(e) => onClick?.(e)}
      className="group relative w-full h-full cursor-pointer select-none overflow-hidden"
    >
      {/* 
        Default State: 
        Completely plain and disguised matching the rest of the dark aesthetic blocks (Grid 01 & 12).
        No text, no icons, completely discreet until hovered.
      */}
      <div className="w-full h-full bg-[#202826] transition-colors duration-200" />

      {/* 
        Hover State: 
        "Or Challenge Me" revealed smoothly on hover.
      */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#082a23] opacity-0 transition-opacity duration-200 group-hover:opacity-100 p-4 text-center">
        <p className="text-[10px] tracking-widest font-chess uppercase text-emerald-300/80 mb-2 font-bold">
          READY FOR A DUEL?
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(e);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-400 bg-emerald-500/20 px-5 py-2.5 text-xs font-bold text-emerald-200 font-chess tracking-wider transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.25)]"
        >
          <Swords className="h-4 w-4 text-emerald-300" />
          <span>Or Challenge Me</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-emerald-300" />
        </button>
        <span className="text-[9px] text-emerald-200/60 font-chess mt-2">
          Play vs My AI Bot &bull; Desktop Exclusive
        </span>
      </div>
    </div>
  );
}
