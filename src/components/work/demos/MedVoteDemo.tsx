"use client";

import React, { useState } from "react";
import { Maximize2, Minimize2, ShieldCheck } from "lucide-react";
import { MedVoteApp } from "@/components/medvote/MedVoteApp";

interface MedVoteDemoProps {
  deviceMode?: "desktop" | "mobile";
}

export function MedVoteDemo({ deviceMode = "desktop" }: MedVoteDemoProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return (
    <>
      {/* Normal Embedded Viewport inside Portfolio Sandbox */}
      <div className="w-full h-full flex flex-col bg-[#0b1120] relative overflow-hidden select-none">
        {/* Sub-toolbar inside sandbox */}
        <div className="bg-[#0f172a] border-b border-slate-800 px-3 py-1.5 flex items-center justify-between text-xs text-slate-200 z-10 shrink-0 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-mono text-[10.5px] text-emerald-400 font-extrabold uppercase tracking-wider truncate flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>MEDVOTE DAPP &bull; BLOCKCHAIN E-VOTING KOMITE MEDIK RSUD</span>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 border border-slate-700 rounded text-[10px] font-mono font-bold tracking-wider transition-all cursor-pointer whitespace-nowrap"
              title="Expand to Fullscreen Viewport"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Fullscreen</span>
            </button>
          </div>
        </div>

        {/* Embedded DApp Component */}
        <div className="flex-1 w-full h-full relative overflow-hidden bg-[#0b1120]">
          <MedVoteApp deviceMode={deviceMode} />
        </div>
      </div>

      {/* Fullscreen Overlay Mode */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-[#0b1120] flex flex-col w-screen h-screen">
          {/* Top Control Bar */}
          <div className="bg-[#0f172a] border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded font-mono text-[10px] uppercase font-bold">
                FULLSCREEN WEB3 DAPP
              </span>
              <span className="text-slate-200 font-bold text-xs flex items-center gap-1.5 font-mono">
                MedVote DApp &bull; Solidity 0.8.20 &amp; Polygon Amoy Testnet
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded font-mono text-xs transition-colors cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Fullscreen</span>
              </button>
            </div>
          </div>

          <div className="flex-1 w-full overflow-hidden">
            <MedVoteApp deviceMode="desktop" />
          </div>
        </div>
      )}
    </>
  );
}
