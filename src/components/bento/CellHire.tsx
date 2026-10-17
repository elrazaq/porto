"use client";

import React from "react";
import { FaChessKing, FaBriefcase } from "react-icons/fa6";
import { ArrowUpRight } from "lucide-react";

interface CellHireProps {
  onClick?: (e?: React.MouseEvent) => void;
}

export function CellHire({ onClick }: CellHireProps = {}) {
  return (
    <div
      onClick={(e) => onClick?.(e)}
      className="group relative w-full h-full p-4 sm:p-5 flex flex-col justify-between overflow-hidden cursor-pointer select-none text-[#0a3028]"
    >
      {/* Default State: King Icon + "HIRE ME" + English Royalty Philosophy */}
      <div className="relative z-10 flex flex-col justify-between h-full transition-opacity duration-200 group-hover:opacity-0">
        <div className="flex items-center justify-between w-full border-b border-[#0a3028]/15 pb-1">
          <span className="text-[10px] font-bold tracking-widest uppercase font-chess text-[#0a3028]/80 flex items-center gap-1.5">
            <FaBriefcase className="w-3 h-3 text-[#0a3028]" />
            PARTNERSHIP
          </span>
          <FaChessKing className="h-3.5 w-3.5 text-[#0a3028]/70" />
        </div>

        <div className="my-auto flex flex-col items-center justify-center text-center py-1">
          <div className="transition-transform duration-300 group-hover:scale-105">
            <FaChessKing className="w-12 h-12 sm:w-14 sm:h-14 text-[#0a3028] mb-1.5" />
          </div>
          <h3 className="text-base sm:text-lg lg:text-xl font-black text-[#0a3028] font-chess tracking-wider uppercase">
            Hire Me
          </h3>
          <p className="text-[10.5px] sm:text-[11px] font-semibold text-[#0a3028]/85 mt-1 font-chess leading-snug px-2">
            &ldquo;The client is king, and so am I. Kings collaborate with kings.&rdquo;
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] font-chess tracking-wider pt-1.5 border-t border-[#0a3028]/15 text-[#0a3028]/70">
          <span>MUTUAL RESPECT</span>
          <span>&bull;</span>
          <span>TOP TIER IMPACT</span>
        </div>
      </div>

      {/* Hover State: "Hire Me" Button (100% Solid Flat Overlay, zero ghosting) */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a3028] opacity-0 transition-opacity duration-200 group-hover:opacity-100 p-4 text-center">
        <p className="text-[10px] tracking-widest font-chess uppercase text-mint-300/80 mb-2 font-bold">
          READY TO COLLABORATE?
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(e);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-mint-300 bg-mint-400/20 px-5 py-2.5 text-xs font-bold text-mint-200 font-chess tracking-wider transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <FaChessKing className="h-4 w-4 text-mint-300" />
          <span>Hire Me</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-mint-300" />
        </button>
        <span className="text-[9px] text-mint-200/60 font-chess mt-2">
          Click to start your project proposal
        </span>
      </div>
    </div>
  );
}
