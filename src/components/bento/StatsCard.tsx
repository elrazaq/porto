import React from "react";
import { Award, CheckCircle, Flame, Clock, Star } from "lucide-react";

interface StatsCardProps {
  className?: string;
}

export function StatsCard({ className = "" }: StatsCardProps) {
  const stats = [
    { label: "On-time", value: "100%", icon: Clock },
    { label: "Architecture", value: "Clean MVVM", icon: CheckCircle },
    { label: "UI Response", value: "60 FPS", icon: Flame },
    { label: "Client Rating", value: "5.0 / 5.0", icon: Star },
  ];

  return (
    <div
      className={`relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-3.5 sm:p-4 transition-all duration-300 ${className}`}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-neutral-800 text-mint-300 border border-white/10">
            <Award className="h-3.5 w-3.5" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
            Metrik &amp; Prestasi
          </span>
        </div>
        <span className="text-[9px] font-mono text-slate-500">GRID 08</span>
      </div>

      <div className="relative z-10 my-auto grid grid-cols-2 gap-1.5 py-1">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="flex flex-col rounded-lg bg-neutral-900/60 p-1.5 border border-white/5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-400">{s.label}</span>
                <Icon className="h-2.5 w-2.5 text-mint-400" />
              </div>
              <span className="text-xs sm:text-sm font-black text-white mt-0.5">
                {s.value}
              </span>
            </div>
          );
        })}
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-slate-400">
        <span>Verified Performance</span>
        <span className="font-mono text-mint-300">High Standard</span>
      </div>
    </div>
  );
}
