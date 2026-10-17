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
      <div className="w-full h-full flex flex-col bg-slate-50 relative overflow-hidden select-none">
        {/* Sub-toolbar inside sandbox (Light Mode + Bright Sky Blue) */}
        <div className="bg-white border-b border-sky-200 px-3 py-1.5 flex items-center justify-between text-xs text-slate-800 z-10 shrink-0 gap-2 shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse shrink-0" />
            <span className="font-mono text-[10.5px] text-sky-600 font-extrabold uppercase tracking-wider truncate flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
              <span>MEDVOTE DAPP &bull; BLOCKCHAIN E-VOTING KOMITE MEDIK RSUD</span>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-sky-50 hover:bg-sky-500 hover:text-white text-sky-700 border border-sky-200 rounded text-[10px] font-mono font-bold tracking-wider transition-all cursor-pointer whitespace-nowrap shadow-2xs"
              title="Expand to Fullscreen Viewport"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Fullscreen</span>
            </button>
          </div>
        </div>

        {/* Embedded DApp Component (relative + overflow-hidden keeps modals strictly inside WorkView) */}
        <div className="flex-1 w-full h-full relative overflow-hidden bg-slate-50">
          <MedVoteApp deviceMode={deviceMode} />
        </div>
      </div>

      {/* Fullscreen Overlay Mode */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-slate-50 flex flex-col w-screen h-screen">
          {/* Top Control Bar */}
          <div className="bg-white border-b border-sky-200 px-4 py-2 flex items-center justify-between text-xs text-slate-900 shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded font-mono text-[10px] uppercase font-bold">
                FULLSCREEN WEB3 DAPP
              </span>
              <span className="text-slate-800 font-bold text-xs flex items-center gap-1.5 font-mono">
                MedVote DApp &bull; Solidity 0.8.20 &amp; Polygon Amoy Testnet
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold rounded font-mono text-xs transition-colors cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Fullscreen</span>
              </button>
            </div>
          </div>

          <div className="flex-1 w-full relative overflow-hidden">
            <MedVoteApp deviceMode="desktop" />
          </div>
        </div>
      )}
    </>
  );
}
