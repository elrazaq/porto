"use client";

import React, { useState, useRef } from "react";
import { Maximize2, ExternalLink, Minimize2, Tv, Volume2, Moon } from "lucide-react";
import { TvMasjidApp } from "@/components/tv/TvMasjidApp";

export function MasjidTvDemo() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasDismissedNotice, setHasDismissedNotice] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const handleOpenNewTab = () => {
    window.open("/tv-masjid", "_blank");
  };

  return (
    <>
      {/* Normal Embedded Viewport inside Portfolio Sandbox */}
      <div
        ref={containerRef}
        className="w-full h-full flex flex-col bg-[#020b08] relative overflow-hidden select-none"
      >
        {/* Sub-toolbar inside sandbox */}
        <div className="bg-[#051c14] border-b border-emerald-500/25 px-3 py-1.5 flex items-center justify-between text-xs text-slate-200 z-10 shrink-0 gap-2 shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-mono text-[10.5px] text-emerald-400 font-extrabold uppercase tracking-wider truncate flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-amber-400" />
              <span>MASJID AL-USWAH • ANDROID TV 16:9 JETPACK COMPOSE SIGNAGE</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-950/80 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-emerald-300 rounded text-[10px] font-mono font-bold tracking-wider transition-all cursor-pointer shadow-xs whitespace-nowrap"
              title="Expand to Fullscreen Smart TV Viewport"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Fullscreen 16:9 TV</span>
            </button>

            <button
              type="button"
              onClick={handleOpenNewTab}
              className="p-1 hover:bg-emerald-900/40 text-emerald-300 hover:text-white rounded transition-colors cursor-pointer shrink-0"
              title="Buka di tab browser baru (Standalone Fullscreen TV)"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Embedded Android TV App Component */}
        <div className="flex-1 w-full h-full relative overflow-hidden bg-[#020b08]">
          <TvMasjidApp />

          {/* Dark Semi-Transparent Fullscreen Prompt Overlay */}
          {!hasDismissedNotice && (
            <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-[6px] flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-in fade-in duration-300">
              <div className="max-w-md w-full bg-[#031c14] border-2 border-emerald-400/60 rounded-2xl p-5 sm:p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col items-center space-y-3.5 relative z-10">
                {/* Icon TV with glowing ring */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-800 flex items-center justify-center shadow-lg shadow-emerald-500/30 border border-emerald-300/40">
                  <Tv className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300 animate-pulse" />
                </div>

                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[9.5px] sm:text-[10.5px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase tracking-wider">
                    RASIO LAYAR NATIVE 16:9
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white tracking-wide uppercase">
                    Gunakan Mode Fullscreen
                  </h3>
                  <p className="text-[11px] sm:text-xs text-emerald-200/85 leading-relaxed font-sans">
                    Aplikasi Android TV Masjid Al-Uswah dirancang khusus untuk layar TV resolusi 16:9. Gunakan mode fullscreen agar jam digital, countdown sholat, dan warta masjid tampil proporsional &amp; nyaman dibaca.
                  </p>
                </div>

                {/* Buttons */}
                <div className="w-full flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Mode Fullscreen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHasDismissedNotice(true)}
                    className="w-full sm:w-auto py-2.5 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white font-mono text-xs uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    Pratinjau Mini
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Overlay Mode */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col w-screen h-screen">
          {/* Top Control Bar */}
          <div className="bg-[#051c14] border-b border-emerald-500/30 px-4 py-2 flex items-center justify-between text-xs text-white shadow-md">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 rounded font-mono text-[10px] uppercase font-bold">
                FULLSCREEN ANDROID TV (16:9 NATIVE)
              </span>
              <span className="text-white font-bold text-xs flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-amber-400" />
                Masjid Al-Uswah &bull; Kotlin &amp; Jetpack Compose for TV Architecture
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenNewTab}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 rounded font-mono text-xs transition-colors cursor-pointer border border-emerald-500/30 font-bold"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open Standalone Tab</span>
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded font-mono text-xs transition-colors cursor-pointer shadow-sm shadow-amber-500/30"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Fullscreen (Esc)</span>
              </button>
            </div>
          </div>

          {/* Fullscreen TV Canvas */}
          <div className="flex-1 w-full h-full overflow-hidden bg-black">
            <TvMasjidApp />
          </div>
        </div>
      )}
    </>
  );
}
