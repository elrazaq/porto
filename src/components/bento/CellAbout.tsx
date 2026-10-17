import React from "react";
import { ArrowUpRight } from "lucide-react";
import { FaChessPawn } from "react-icons/fa6";

interface CellAboutProps {
  onClick?: (e: React.MouseEvent) => void;
}

export function CellAbout({ onClick }: CellAboutProps) {
  return (
    <div
      onClick={(e) => onClick?.(e)}
      className="group relative w-full h-full p-4 sm:p-5 flex flex-col justify-between overflow-hidden cursor-pointer select-none"
    >
      {/* Default State: Hilang Total (opacity-0) saat hover agar tidak berbayang */}
      <div className="relative z-10 flex flex-col justify-between h-full transition-opacity duration-200 group-hover:opacity-0">
        <div>
          {/* Badge dengan Ikon Pion di Depannya Sesuai Permintaan User */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-mint-300 font-chess">
            <FaChessPawn className="h-3.5 w-3.5 text-mint-400 shrink-0" />
            <span>ABOUT ME</span>
          </div>
          <h3 className="mt-1 text-xs sm:text-sm lg:text-base font-extrabold text-white leading-snug font-chess tracking-wide">
            Full Stack Web &amp; Native Android Developer
          </h3>
        </div>

        <p className="my-auto text-[11px] sm:text-xs text-mint-100/90 leading-relaxed line-clamp-3">
          Passionate engineer building high-performance Android native apps with Kotlin and scalable modern full-stack web platforms.
        </p>

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-mint-300/80 pt-1 border-t border-mint-400/20 font-chess tracking-wider">
          <span>KOTLIN</span>
          <span>•</span>
          <span>NEXT.JS</span>
          <span>•</span>
          <span>CLEAN CODE</span>
        </div>
      </div>

      {/* Hover State: Solid 100% dengan ikon Pion Resmi FontAwesome */}
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0f4e45] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="inline-flex items-center gap-2 rounded-full border border-mint-300 bg-mint-400/20 px-4 py-2 text-xs font-bold text-mint-200 font-chess tracking-wider">
          <FaChessPawn className="h-4 w-4 text-mint-300" />
          <span>More About Me</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-mint-300" />
        </div>
      </div>
    </div>
  );
}
