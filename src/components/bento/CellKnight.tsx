import React from "react";
import { FaChessKnight } from "react-icons/fa6";

export function CellKnight() {
  return (
    <div className="group relative w-full h-full flex items-center justify-center cursor-pointer select-none overflow-hidden p-4">
      {/* Official FontAwesome 6 Chess Knight Icon - Miring saat Hover */}
      <div className="transition-transform duration-300 ease-out origin-bottom group-hover:-rotate-12 group-hover:scale-110 text-[#0a3028]">
        <FaChessKnight className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24" />
      </div>
    </div>
  );
}
