"use client";

import React, { useState } from "react";
import { Maximize2, Minimize2, ShieldCheck, Laptop, Smartphone } from "lucide-react";
import { AbsensiPegawaiApp } from "@/components/absensi/AbsensiPegawaiApp";

interface AbsensiPegawaiDemoProps {
  deviceMode?: "desktop" | "mobile";
  onSwitchMode?: (mode: "desktop" | "mobile") => void;
}

export function AbsensiPegawaiDemo({
  deviceMode = "desktop",
  onSwitchMode,
}: AbsensiPegawaiDemoProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return (
    <>
      {/* Normal Embedded Viewport inside Portfolio Sandbox */}
      <div className="w-full h-full flex flex-col bg-slate-50 relative overflow-hidden select-none">
        {/* Sub-toolbar inside sandbox (Light Mode Enterprise) */}
        <div className="bg-white border-b border-slate-200 px-3 py-1.5 flex items-center justify-between text-xs text-slate-800 z-10 shrink-0 gap-2 shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />
            <span className="font-mono text-[10.5px] text-blue-700 font-extrabold uppercase tracking-wider truncate flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>PRESENSIKU ENTERPRISE &bull; SISTEM PRESENSI TERINTEGRASI</span>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 border border-slate-200 rounded text-[10px] font-mono font-bold tracking-wider transition-all cursor-pointer shadow-2xs whitespace-nowrap"
              title="Expand to Fullscreen Viewport"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Fullscreen</span>
            </button>
          </div>
        </div>

        {/* Embedded App Component */}
        <div className="flex-1 w-full h-full relative overflow-hidden bg-slate-50">
          <AbsensiPegawaiApp deviceMode={deviceMode} onSwitchMode={onSwitchMode} />
        </div>
      </div>

      {/* Fullscreen Overlay Mode */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-slate-50 flex flex-col w-screen h-screen">
          {/* Top Control Bar */}
          <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-900 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-mono text-[10px] uppercase font-bold">
                FULLSCREEN SANDBOX
              </span>
              <span className="text-slate-900 font-bold text-xs flex items-center gap-1.5 font-mono">
                PresensiKu Enterprise &bull; Kotlin Android &amp; Next.js Web Admin
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold rounded font-mono text-xs transition-colors cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Fullscreen (Esc)</span>
              </button>
            </div>
          </div>

          {/* Fullscreen App */}
          <div className="flex-1 w-full h-full overflow-hidden bg-slate-50">
            <AbsensiPegawaiApp deviceMode={deviceMode} onSwitchMode={onSwitchMode} />
          </div>
        </div>
      )}
    </>
  );
}
