"use client";

import React, { useState } from "react";
import { Cpu, Smartphone, Globe, Layers } from "lucide-react";

interface TechStackCardProps {
  className?: string;
}

export function TechStackCard({ className = "" }: TechStackCardProps) {
  const [filter, setFilter] = useState<"all" | "android" | "web">("all");

  const stacks = [
    { name: "Kotlin", cat: "android", icon: Smartphone },
    { name: "Jetpack Compose", cat: "android", icon: Smartphone },
    { name: "Play Store", cat: "android", icon: Layers },
    { name: "Next.js", cat: "web", icon: Globe },
    { name: "React 19", cat: "web", icon: Globe },
    { name: "Tailwind CSS", cat: "web", icon: Globe },
    { name: "Node.js", cat: "web", icon: Layers },
    { name: "REST API", cat: "web", icon: Cpu },
  ];

  const filtered = filter === "all" ? stacks : stacks.filter((s) => s.cat === filter);

  return (
    <div
      className={`relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-3.5 sm:p-4 transition-all duration-300 ${className}`}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-neutral-800 text-mint-300 border border-white/10">
            <Cpu className="h-3.5 w-3.5" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
            Tech Stack &amp; Tools
          </span>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-1 text-[9px]">
          {(["all", "android", "web"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded px-1.5 py-0.5 capitalize transition-all ${
                filter === c
                  ? "bg-mint-400 text-neutral-950 font-bold"
                  : "bg-neutral-800 text-slate-400 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Tech Chips */}
      <div className="relative z-10 my-auto flex flex-wrap gap-1.5 py-1">
        {filtered.map((item, idx) => {
          const Icon = item.icon;
          return (
            <span
              key={idx}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-neutral-900/60 px-2 py-1 text-[10px] font-medium text-slate-200 transition-all hover:border-mint-400/50 hover:bg-neutral-800"
            >
              <Icon className="h-2.5 w-2.5 text-mint-400" />
              <span>{item.name}</span>
            </span>
          );
        })}
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-slate-400">
        <span>Production Ready</span>
        <span className="font-mono text-mint-300">Clean Code</span>
      </div>
    </div>
  );
}
