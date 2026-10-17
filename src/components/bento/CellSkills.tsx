import React from "react";
import { FaChessPawn } from "react-icons/fa6";
import { ArrowUpRight, Zap } from "lucide-react";

interface CellSkillsProps {
  onClick?: () => void;
}

export function CellSkills({ onClick }: CellSkillsProps) {
  return (
    <div
      onClick={onClick}
      className="group relative w-full h-full p-4 sm:p-5 flex flex-col justify-between overflow-hidden cursor-pointer select-none"
    >
      {/* Default State: Ringkasan Skill dengan Ikon Pion */}
      <div className="relative z-10 flex flex-col justify-between h-full transition-opacity duration-200 group-hover:opacity-0">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-mint-300 font-chess">
            <FaChessPawn className="h-3 w-3 text-mint-400" />
            <span>CORE SKILLS</span>
          </div>
          <h3 className="mt-1 text-xs sm:text-sm lg:text-base font-extrabold text-white leading-snug font-chess tracking-wide">
            Mobile &amp; Web Expertise
          </h3>
        </div>

        {/* Skill Chips */}
        <div className="my-auto flex flex-wrap gap-1.5 py-1">
          <span className="rounded bg-mint-400/15 border border-mint-400/30 px-2 py-0.5 text-[10px] font-semibold text-mint-200">
            Kotlin Native
          </span>
          <span className="rounded bg-mint-400/15 border border-mint-400/30 px-2 py-0.5 text-[10px] font-semibold text-mint-200">
            Jetpack Compose
          </span>
          <span className="rounded bg-mint-400/15 border border-mint-400/30 px-2 py-0.5 text-[10px] font-semibold text-mint-200">
            Next.js / React
          </span>
          <span className="rounded bg-mint-400/15 border border-mint-400/30 px-2 py-0.5 text-[10px] font-semibold text-mint-200">
            IT Systems
          </span>
          <span className="rounded bg-mint-400/15 border border-mint-400/30 px-2 py-0.5 text-[10px] font-semibold text-mint-200">
            RESTful API
          </span>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[10px] font-mono text-mint-300/80 pt-1 border-t border-mint-400/20 font-chess tracking-wider">
          <span>CLEAN ARCHITECTURE</span>
          <span>MVVM / MVI</span>
        </div>
      </div>

      {/* Hover State: Tombol "See More CV" Solid 100% tanpa bayangan */}
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0f4e45] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="inline-flex items-center gap-2 rounded-full border border-mint-300 bg-mint-400/20 px-4 py-2 text-xs font-bold text-mint-200 font-chess tracking-wider transition-transform duration-200 group-hover:scale-105"
        >
          <FaChessPawn className="h-4 w-4 text-mint-300" />
          <span>See More CV</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-mint-300" />
        </button>
      </div>
    </div>
  );
}
