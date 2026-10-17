import React from "react";
import { Terminal, Gauge, ShieldCheck, Zap } from "lucide-react";
import { BatikPattern } from "@/components/ui/BatikPattern";

interface AboutCardProps {
  className?: string;
}

export function AboutCard({ className = "" }: AboutCardProps) {
  return (
    <div
      className={`relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-3.5 sm:p-4 transition-all duration-300 ${className}`}
    >
      <BatikPattern variant="parang" opacity={0.035} />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-neutral-800 text-mint-300 border border-white/10">
            <Terminal className="h-3.5 w-3.5" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
            About &amp; Core Standards
          </span>
        </div>
        <span className="text-[9px] font-mono text-slate-500">GRID 02</span>
      </div>

      <div className="relative z-10 my-auto py-1">
        <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">
          Kecepatan Pengerjaan &amp; Arsitektur Handal
        </h3>
        <p className="mt-1 text-[11px] text-slate-300 leading-relaxed line-clamp-2 sm:line-clamp-3">
          Menggabungkan performa tinggi Native Android (Kotlin Coroutines) dengan kelincahan ekosistem Web App modern (Next.js &amp; Tailwind).
        </p>
      </div>

      {/* Mini metric badges */}
      <div className="relative z-10 grid grid-cols-3 gap-1.5 border-t border-white/10 pt-2">
        <div className="flex items-center gap-1 rounded-lg bg-neutral-900/60 px-1.5 py-1 text-[10px] text-slate-300 border border-white/5">
          <Gauge className="h-3 w-3 text-mint-400 shrink-0" />
          <span className="truncate">Cepat</span>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-neutral-900/60 px-1.5 py-1 text-[10px] text-slate-300 border border-white/5">
          <ShieldCheck className="h-3 w-3 text-mint-400 shrink-0" />
          <span className="truncate">Clean MVVM</span>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-neutral-900/60 px-1.5 py-1 text-[10px] text-slate-300 border border-white/5">
          <Zap className="h-3 w-3 text-mint-400 shrink-0" />
          <span className="truncate">60 FPS</span>
        </div>
      </div>
    </div>
  );
}
