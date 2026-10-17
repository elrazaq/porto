"use client";

import React from "react";
import { FaChessRook } from "react-icons/fa6";
import { ArrowUpRight } from "lucide-react";

interface CellContactProps {
  onClick?: (e?: React.MouseEvent) => void;
}

export function CellContact({ onClick }: CellContactProps = {}) {
  return (
    <div
      onClick={(e) => onClick?.(e)}
      className="group relative w-full h-full p-4 sm:p-5 flex flex-col justify-between overflow-hidden cursor-pointer select-none"
    >
      {/* Default State: Ikon Benteng + "GET IN TOUCH" */}
      <div className="relative z-10 flex flex-col justify-between h-full transition-opacity duration-200 group-hover:opacity-0">
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] font-bold tracking-widest uppercase text-mint-300 font-chess">
            CONNECT
          </span>
          <FaChessRook className="h-3.5 w-3.5 text-mint-400" />
        </div>

        <div className="my-auto flex flex-col items-center justify-center text-center py-1">
          <FaChessRook className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-mint-300 drop-shadow-xs mb-1.5" />
          <h3 className="text-base sm:text-lg lg:text-xl font-black text-white font-chess tracking-wider uppercase">
            Get In Touch
          </h3>
          <p className="text-[10px] text-mint-200/80 mt-0.5 font-chess">
            Open for Projects &amp; Hire
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] font-chess tracking-wider pt-1.5 border-t border-mint-400/20 text-mint-300/80">
          <span>AVAILABLE</span>
          <span>•</span>
          <span>LET&apos;S TALK</span>
        </div>
      </div>

      {/* Hover State: Tombol "Contact Info" Solid 100% tanpa bayangan teks */}
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0f4e45] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(e);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-mint-300 bg-mint-400/20 px-5 py-2.5 text-xs font-bold text-mint-200 font-chess tracking-wider transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <FaChessRook className="h-4 w-4 text-mint-300" />
          <span>Contact Info</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-mint-300" />
        </button>
      </div>
    </div>
  );
}
