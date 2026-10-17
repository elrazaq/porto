import React from "react";
import { Link2, Github, Briefcase, ArrowUpRight } from "lucide-react";

interface DirectLinksCardProps {
  className?: string;
}

export function DirectLinksCard({ className = "" }: DirectLinksCardProps) {
  const links = [
    {
      name: "Projects.co.id",
      sub: "Verified Escrow",
      href: "https://projects.co.id",
      icon: Briefcase,
    },
    {
      name: "Fastwork.id",
      sub: "Top Rated Dev",
      href: "https://fastwork.id",
      icon: Briefcase,
    },
    {
      name: "GitHub Repos",
      sub: "Open Source",
      href: "https://github.com",
      icon: Github,
    },
  ];

  return (
    <div
      className={`relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-3.5 sm:p-4 transition-all duration-300 ${className}`}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-neutral-800 text-mint-300 border border-white/10">
            <Link2 className="h-3.5 w-3.5" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
            Direct Freelance
          </span>
        </div>
        <span className="text-[9px] font-mono text-slate-500">GRID 10</span>
      </div>

      <div className="relative z-10 my-auto space-y-1.5 py-1">
        {links.map((link, idx) => {
          const Icon = link.icon;
          return (
            <a
              key={idx}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-lg border border-white/5 bg-neutral-900/60 p-1.5 transition-all hover:border-mint-400/50 hover:bg-neutral-800"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Icon className="h-3 w-3 text-mint-400 shrink-0" />
                <div className="truncate">
                  <span className="text-xs font-bold text-white group-hover:text-mint-300">
                    {link.name}
                  </span>
                  <span className="block text-[9px] text-slate-400">
                    {link.sub}
                  </span>
                </div>
              </div>
              <ArrowUpRight className="h-3 w-3 text-slate-500 group-hover:text-white" />
            </a>
          );
        })}
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-slate-400">
        <span>Aman &amp; Terverifikasi</span>
        <span className="font-mono text-mint-300">Escrow Ready</span>
      </div>
    </div>
  );
}
