import React from "react";

export function CellArRahman() {
  return (
    <div className="relative w-full h-full p-4 sm:p-5 flex flex-col justify-between select-none overflow-hidden text-center cursor-default">
      {/* Top Header: Surah Reference */}
      <div className="flex items-center justify-between w-full border-b border-mint-400/20 pb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-mint-300 font-chess">
          SURAH AR-RAHMAN
        </span>
        <span className="text-[10px] font-mono text-mint-400 bg-mint-400/10 px-1.5 py-0.2 rounded border border-mint-400/20">
          55:13
        </span>
      </div>

      {/* Center: The Famous Arabic Verse in Classical Islamic Amiri Calligraphy */}
      <div className="my-auto py-1 flex flex-col items-center justify-center">
        <p
          dir="rtl"
          className="text-xl sm:text-2xl lg:text-[26px] font-normal text-white leading-relaxed font-islamic drop-shadow-xs"
        >
          فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ
        </p>
      </div>

      {/* Bottom: English Meaning */}
      <div className="pt-1.5 border-t border-mint-400/20 flex flex-col items-center">
        <p className="text-[11px] sm:text-xs text-mint-100/90 font-medium italic font-islamic leading-tight">
          &ldquo;Which of the favors of your Lord will you deny?&rdquo;
        </p>
      </div>
    </div>
  );
}
