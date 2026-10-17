import React from "react";
import { Quote } from "lucide-react";

export function CellQuote() {
  return (
    <div className="relative w-full h-full p-4 sm:p-5 flex flex-col justify-between select-none overflow-hidden cursor-default text-[#0a3028]">
      {/* Top Header */}
      <div className="flex items-center justify-between w-full border-b border-[#0a3028]/20 pb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#0a3028]/80 font-chess">
          MOTIVATION
        </span>
        <Quote className="h-3.5 w-3.5 text-[#0a3028]/60" />
      </div>

      {/* Center Quote */}
      <div className="my-auto py-1">
        <blockquote className="text-xs sm:text-sm lg:text-[13px] font-semibold italic leading-relaxed font-chess tracking-wide">
          &ldquo;Every grandmaster was once a pawn. Master the fundamentals, and make every move count.&rdquo;
        </blockquote>
      </div>

      {/* Bottom Sign-off */}
      <div className="flex items-center justify-between text-[10px] font-chess tracking-wider pt-1.5 border-t border-[#0a3028]/20 text-[#0a3028]/70">
        <span>PERSISTENCE</span>
        <span>•</span>
        <span>STRATEGY</span>
      </div>
    </div>
  );
}
