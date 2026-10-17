"use client";

import React, { useState, useRef } from "react";
import { Maximize2, ExternalLink, Minimize2, Flame } from "lucide-react";
import { RestaurantPosApp } from "@/components/pos/RestaurantPosApp";

export function RestaurantPosDemo() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const handleOpenNewTab = () => {
    window.open("/pos", "_blank");
  };

  return (
    <>
      {/* Normal Embedded Viewport inside Portfolio Sandbox */}
      <div
        ref={containerRef}
        className="w-full h-full flex flex-col bg-slate-50 relative overflow-hidden select-none"
      >
        {/* Sub-toolbar inside sandbox (Clean Light + Dominant Red Accent) */}
        <div className="bg-white border-b border-slate-200 px-3 py-1.5 flex items-center justify-between text-xs text-slate-700 z-10 shrink-0 gap-2 shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0" />
            <span className="font-mono text-[10.5px] text-red-600 font-extrabold uppercase tracking-wider truncate">
              LAVA CHEESE BATU 9 • CLOUD POS
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 hover:bg-red-600 hover:text-white border border-slate-200 text-slate-700 rounded text-[10px] font-mono font-bold tracking-wider transition-all cursor-pointer shadow-xs whitespace-nowrap"
              title="Expand POS to Fullscreen Tablet Viewport"
            >
              <Maximize2 className="w-3 h-3 text-red-600 group-hover:text-white" />
              <span>Fullscreen</span>
            </button>

            <button
              type="button"
              onClick={handleOpenNewTab}
              className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded transition-colors cursor-pointer shrink-0"
              title="Buka di tab browser baru (Standalone POS)"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Embedded POS Component */}
        <div className="flex-1 w-full h-full relative overflow-hidden bg-slate-50">
          <RestaurantPosApp />
        </div>
      </div>

      {/* Fullscreen Overlay Mode */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-slate-50 flex flex-col w-screen h-screen">
          {/* Top Control Bar */}
          <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-900 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded font-mono text-[10px] uppercase font-bold">
                FULLSCREEN TABLET POS VIEWPORT
              </span>
              <span className="text-slate-900 font-bold text-xs flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-red-600" />
                Lava Cheese Batu 9 • Next.js &amp; Zustand Architecture
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenNewTab}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-mono text-xs transition-colors cursor-pointer border border-slate-200 font-bold"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open in Tab</span>
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded font-mono text-xs transition-colors cursor-pointer shadow-sm shadow-red-600/30"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Fullscreen (Esc)</span>
              </button>
            </div>
          </div>

          {/* Fullscreen POS Application */}
          <div className="flex-1 w-full h-full overflow-hidden bg-slate-50">
            <RestaurantPosApp />
          </div>
        </div>
      )}
    </>
  );
}
