"use client";

import React, { useState, useRef } from "react";
import { Maximize2, ExternalLink, Minimize2, Coffee } from "lucide-react";

export function CoffeeShopDemo() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const handleOpenNewTab = () => {
    window.open("/projects/coffee-shop/index.html", "_blank");
  };

  return (
    <>
      {/* Normal Embedded Viewport */}
      <div
        ref={containerRef}
        className="w-full h-full flex flex-col bg-[#faf7f2] relative overflow-hidden select-none"
      >
        {/* Sub-toolbar inside sandbox */}
        <div className="bg-[#f4ede4] border-b border-[#dfd4c6] px-2.5 py-1.5 flex items-center justify-between text-xs text-[#5e4b3d] z-10 shrink-0 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#b87030] animate-pulse shrink-0" />
            <span className="font-mono text-[10.5px] text-[#2c1e15] font-bold uppercase tracking-wider truncate">
              SAMAN SPECIALTY ROASTERS
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#ffffff] hover:bg-[#b87030] hover:text-white border border-[#c4b5a3] text-[#754316] rounded text-[10px] font-mono font-semibold tracking-wider transition-all cursor-pointer shadow-sm whitespace-nowrap"
              title="Expand to Fullscreen Viewport"
            >
              <Maximize2 className="w-3 h-3 text-[#b87030]" />
              <span>Fullscreen</span>
            </button>

            <button
              type="button"
              onClick={handleOpenNewTab}
              className="p-1 hover:bg-[#e7dcd0] text-[#754316] hover:text-[#2c1e15] rounded transition-colors cursor-pointer shrink-0"
              title="Open website in standalone new browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Embedded Iframe Container */}
        <div className="flex-1 w-full h-full relative overflow-hidden bg-[#faf7f2]">
          <iframe
            src="/projects/coffee-shop/index.html"
            title="Saman Specialty Coffee Roasters"
            className="w-full h-full border-0"
            allow="fullscreen"
          />
        </div>
      </div>

      {/* Fullscreen Overlay Mode */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-[#faf7f2] flex flex-col w-screen h-screen">
          {/* Top Control Bar */}
          <div className="bg-[#ffffff] border-b border-[#dfd4c6] px-4 py-2.5 flex items-center justify-between text-xs text-[#2c1e15] shadow-md">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-[#f4ede4] text-[#854410] border border-[#c4b5a3] rounded font-mono text-[10px] uppercase font-bold">
                FULLSCREEN DESKTOP VIEWPORT
              </span>
              <span className="text-[#1c140e] font-semibold text-xs">
                SAMAN Specialty Coffee Roasters &bull; Pure HTML5 &amp; CSS3
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenNewTab}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f4ede4] hover:bg-[#e7dcd0] text-[#5e4b3d] rounded font-mono text-xs transition-colors cursor-pointer border border-[#c4b5a3]"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open in Tab</span>
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#965318] hover:bg-[#783e0e] text-white font-bold rounded font-mono text-xs transition-colors cursor-pointer shadow-sm"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Fullscreen (Esc)</span>
              </button>
            </div>
          </div>

          {/* Fullscreen Iframe */}
          <div className="flex-1 w-full h-full bg-[#faf7f2]">
            <iframe
              src="/projects/coffee-shop/index.html"
              title="Saman Specialty Coffee Roasters - Fullscreen"
              className="w-full h-full border-0"
              allow="fullscreen"
            />
          </div>
        </div>
      )}
    </>
  );
}
