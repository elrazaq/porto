import React from "react";
import { FaChessQueen } from "react-icons/fa6";
import { ArrowUpRight } from "lucide-react";

interface CellMyWorkProps {
  onClick?: (e?: React.MouseEvent) => void;
}

export function CellMyWork({ onClick }: CellMyWorkProps = {}) {
  return (
    <div
      onClick={(e) => onClick?.(e)}
      className="group relative w-full h-full p-4 sm:p-5 flex flex-col justify-between overflow-hidden cursor-pointer select-none bg-[#05241e]"
    >
      {/* Background: Garis Abstrak Hijau Lebih Gelap & Mencolok */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 200 160"
      >
        {/* Dynamic Abstract Angled & Ray Lines */}
        <line x1="-20" y1="20" x2="180" y2="180" stroke="#0a4338" strokeWidth="4" />
        <line x1="10" y1="-20" x2="220" y2="150" stroke="#0e5648" strokeWidth="3" />
        <line x1="60" y1="-20" x2="240" y2="110" stroke="#147563" strokeWidth="2" />
        <line x1="-30" y1="80" x2="160" y2="200" stroke="#199982" strokeWidth="1.5" />
        <line x1="120" y1="-10" x2="210" y2="60" stroke="#22bf9d" strokeWidth="1" strokeDasharray="3 3" />

        {/* Striking Geometric Intersecting Accents */}
        <path
          d="M0,160 L120,40 L160,80 L200,20"
          fill="none"
          stroke="#10b981"
          strokeWidth="1.5"
          opacity="0.35"
        />
        <circle cx="160" cy="80" r="3" fill="#2dd4bf" opacity="0.6" />
        <circle cx="120" cy="40" r="2" fill="#2dd4bf" opacity="0.6" />
      </svg>

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <span className="text-[10px] font-bold tracking-widest uppercase text-mint-300 font-chess">
          PORTFOLIO SHOWCASE
        </span>
        <ArrowUpRight className="h-4 w-4 text-mint-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>

      {/* Center: Large Queen/Menteri Icon with Title */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-1">
        <div className="text-mint-300 group-hover:scale-110 group-hover:text-mint-200 transition-all duration-300 drop-shadow-sm mb-1.5">
          <FaChessQueen className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16" />
        </div>
        <h3 className="text-base sm:text-lg lg:text-xl font-black text-white font-chess tracking-wider uppercase drop-shadow-sm">
          My Work
        </h3>
      </div>

      {/* Bottom Hint */}
      <div className="relative z-10 flex items-center justify-between text-[10px] text-mint-200/80 font-chess tracking-wide border-t border-mint-500/20 pt-1.5">
        <span>EXPLORE PROJECTS</span>
        <span className="font-mono text-mint-300">STAGE 05</span>
      </div>
    </div>
  );
}
