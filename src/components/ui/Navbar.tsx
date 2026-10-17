import React from "react";
import Link from "next/link";
import { Terminal, Sparkles, FolderGit2 } from "lucide-react";

export function Navbar() {
  return (
    <header className="shrink-0 w-full rounded-2xl border border-mint-400/25 bg-jade-900/80 px-3 sm:px-4 py-2 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-mint-400 text-jade-950 font-black shadow transition-transform group-hover:scale-105">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-black tracking-tight text-white">
              Portfolio
            </span>
            <span className="hidden sm:inline-block ml-1.5 text-[10px] font-mono text-mint-300 bg-jade-950/70 px-1.5 py-0.2 rounded border border-mint-400/20">
              KOTLIN &amp; NEXT.JS
            </span>
          </div>
        </Link>

        {/* Center info for desktop */}
        <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-mint-200">
          <Link href="/projects/meeting-recorder" className="hover:text-white transition-colors">
            Meeting AI (Kotlin)
          </Link>
          <span className="text-mint-400/40">•</span>
          <Link href="/projects/event-portal" className="hover:text-white transition-colors">
            Event Portal (Web)
          </Link>
          <span className="text-mint-400/40">•</span>
          <Link href="/projects" className="hover:text-white transition-colors flex items-center gap-1">
            <FolderGit2 className="h-3 w-3 text-mint-400" />
            <span>Multi-Subfolder Apps</span>
          </Link>
        </div>

        {/* Action */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-mint-300 font-mono bg-jade-950/80 px-2 py-0.5 rounded-full border border-mint-400/25">
            <span className="h-1.5 w-1.5 rounded-full bg-mint-400 animate-pulse"></span>
            100% Free Vercel Ready
          </span>

          <a
            href="mailto:contact@developer.id"
            className="inline-flex items-center gap-1 rounded-lg bg-mint-400 px-3 py-1 text-xs font-bold text-jade-950 shadow transition-all hover:bg-mint-300 active:scale-95"
          >
            <Sparkles className="h-3 w-3 fill-current" />
            <span>Hire Me</span>
          </a>
        </div>
      </div>
    </header>
  );
}
