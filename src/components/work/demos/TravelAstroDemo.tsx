"use client";

import React, { useState, useRef } from "react";
import { Maximize2, ExternalLink, Minimize2, Compass } from "lucide-react";

export function TravelAstroDemo() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const handleOpenNewTab = () => {
    window.open("/projects/travel-astro/index.html", "_blank");
  };

  return (
    <>
      {/* Normal Embedded Viewport */}
      <div
        ref={containerRef}
        className="w-full h-full flex flex-col bg-slate-950 relative overflow-hidden select-none"
      >
        {/* Sub-toolbar inside sandbox */}
        <div className="bg-slate-900 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between text-xs text-slate-300 z-10 shrink-0 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shrink-0" />
            <span className="font-mono text-[10.5px] text-sky-300 font-bold uppercase tracking-wider truncate flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>NUSANTARA ODYSSEY &bull; ASTRO + TAILWIND</span>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-600/20 hover:bg-blue-600 text-sky-300 hover:text-white border border-blue-500/40 rounded text-[10.5px] font-mono font-semibold tracking-wider transition-all cursor-pointer shadow-xs whitespace-nowrap active:scale-95"
              title="Expand to Fullscreen Viewport"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Fullscreen</span>
            </button>

            <button
              type="button"
              onClick={handleOpenNewTab}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-sky-400 rounded transition-colors cursor-pointer shrink-0"
              title="Open website in standalone new browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Embedded Iframe Container */}
        <div className="flex-1 w-full h-full relative overflow-hidden bg-slate-950">
          <iframe
            src="/projects/travel-astro/index.html"
            title="Nusantara Odyssey Travel Platform"
            className="w-full h-full border-0 absolute inset-0"
            loading="eager"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>

      {/* Fullscreen Overlay Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
          {/* Header Controls */}
          <div className="bg-slate-950 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-300 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
              <span className="font-mono text-xs text-white font-bold tracking-wider">
                NUSANTARA ODYSSEY — FULLSCREEN LIVE VIEWPORT
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono bg-blue-600/20 border border-blue-500/40 text-sky-300 px-2 py-0.5 rounded">
                ASTRO + TAILWIND ZERO-JS
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenNewTab}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-sky-400 rounded border border-slate-800 text-xs font-mono transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Tab</span>
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-1 px-3 py-1 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 rounded text-xs font-mono font-semibold transition-colors cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Fullscreen</span>
              </button>
            </div>
          </div>

          {/* Fullscreen Iframe */}
          <div className="flex-1 w-full h-full relative overflow-hidden bg-slate-950">
            <iframe
              src="/projects/travel-astro/index.html"
              title="Nusantara Odyssey Travel Fullscreen"
              className="w-full h-full border-0 absolute inset-0"
              loading="eager"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </div>
      )}
    </>
  );
}
