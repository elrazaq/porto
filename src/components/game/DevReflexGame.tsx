"use client";

import React, { useState, useEffect, useRef } from "react";
import { Zap, RotateCcw, Trophy, Bug, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

type GameState = "IDLE" | "WAITING" | "READY" | "EARLY" | "RESULT";

interface DevReflexGameProps {
  className?: string;
}

export function DevReflexGame({ className = "" }: DevReflexGameProps) {
  const [gameState, setGameState] = useState<GameState>("IDLE");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [rankTitle, setRankTitle] = useState<string>("");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dev_best_reflex");
      if (saved) setBestTime(parseInt(saved, 10));
    } catch {}
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#2dd4bf", "#5eead4", "#14b8a6", "#ffffff"],
      });
    } catch {}
  };

  const determineRank = (ms: number): string => {
    if (ms < 190) return "Godlike Architect!";
    if (ms < 245) return "Senior Kotlin/Web Dev";
    if (ms < 310) return "Clean Code Pro";
    return "Needs Coffee Reflex";
  };

  const startGame = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGameState("WAITING");
    setReactionTime(null);

    const randomDelay = Math.floor(Math.random() * 2000) + 1400;

    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = Date.now();
      setGameState("READY");
    }, randomDelay);
  };

  const handleAreaClick = () => {
    if (gameState === "WAITING") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState("EARLY");
    } else if (gameState === "READY") {
      const elapsed = Date.now() - startTimeRef.current;
      setReactionTime(elapsed);
      const title = determineRank(elapsed);
      setRankTitle(title);
      setGameState("RESULT");

      if (!bestTime || elapsed < bestTime) {
        setBestTime(elapsed);
        try {
          localStorage.setItem("dev_best_reflex", elapsed.toString());
        } catch {}
      }

      if (elapsed < 260) {
        triggerConfetti();
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      onClick={handleAreaClick}
      className={`relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-3.5 sm:p-4 transition-all duration-300 select-none ${
        gameState === "READY"
          ? "cursor-pointer border-mint-400 bg-mint-400 text-neutral-950 shadow-[0_0_30px_rgba(45,212,191,0.5)]"
          : gameState === "WAITING"
          ? "cursor-wait border-amber-500/50 bg-amber-950/40"
          : gameState === "EARLY"
          ? "cursor-pointer border-rose-500/50 bg-rose-950/40"
          : `${className} hover:border-mint-400/50`
      }`}
    >
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-lg border ${
              gameState === "READY"
                ? "bg-neutral-950 text-mint-400 border-neutral-900"
                : "bg-neutral-800 text-mint-300 border-white/10"
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
          </span>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${
              gameState === "READY" ? "text-neutral-950" : "text-slate-300"
            }`}
          >
            Vocal Point • Mini Game
          </span>
        </div>

        {bestTime && (
          <div className="flex items-center gap-1 rounded-full bg-neutral-900/80 px-2 py-0.5 text-[9px] font-semibold text-mint-300 border border-white/10">
            <Trophy className="h-2.5 w-2.5 text-amber-400" />
            <span>Best: {bestTime}ms</span>
          </div>
        )}
      </div>

      {/* Screen Interactive Area */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-1">
        {gameState === "IDLE" && (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-1">
              <Bug className="h-4 w-4 text-mint-400" />
              <p className="text-xs font-bold text-white">Dev Reflex Speed Test</p>
            </div>
            <p className="text-[10px] text-slate-400 max-w-[200px]">
              Klik tombol, lalu klik area secepatnya saat berubah jadi hijau mint!
            </p>
            <button
              onClick={startGame}
              className="mt-2.5 inline-flex items-center gap-1 rounded-lg bg-mint-400 px-3 py-1 text-xs font-extrabold text-neutral-950 shadow-md transition-all hover:bg-mint-300 active:scale-95"
            >
              <Zap className="h-3 w-3 fill-current" />
              <span>Mulai Tes</span>
            </button>
          </div>
        )}

        {gameState === "WAITING" && (
          <div className="flex flex-col items-center animate-pulse">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 mb-1"></span>
            <p className="text-xs font-bold text-amber-300">Tunggu HIJAU MINT...</p>
            <p className="text-[10px] text-amber-200/70 mt-0.5">Jangan klik dulu</p>
          </div>
        )}

        {gameState === "READY" && (
          <div className="flex flex-col items-center">
            <Zap className="h-6 w-6 text-neutral-950 fill-current animate-bounce mb-0.5" />
            <p className="text-sm font-black text-neutral-950 tracking-tight">
              KLIK SEKARANG!
            </p>
          </div>
        )}

        {gameState === "EARLY" && (
          <div className="flex flex-col items-center">
            <p className="text-xs font-bold text-rose-300">Terlalu Cepat!</p>
            <button
              onClick={startGame}
              className="mt-1.5 inline-flex items-center gap-1 rounded bg-rose-500/20 px-2 py-0.5 text-[10px] text-rose-200 border border-rose-500/30"
            >
              <RotateCcw className="h-2.5 w-2.5" /> Ulangi
            </button>
          </div>
        )}

        {gameState === "RESULT" && reactionTime !== null && (
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-1 text-mint-300 font-mono">
              <span className="text-2xl font-black">{reactionTime}</span>
              <span className="text-xs font-bold">ms</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-semibold text-white mt-0.5">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>{rankTitle}</span>
            </div>
            <button
              onClick={startGame}
              className="mt-1.5 inline-flex items-center gap-1 rounded bg-neutral-800 px-2.5 py-0.5 text-[10px] font-semibold text-mint-300 border border-white/10 hover:bg-neutral-700"
            >
              <RotateCcw className="h-2.5 w-2.5" /> Main Lagi
            </button>
          </div>
        )}
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-slate-400">
        <span>Target: &lt; 230ms</span>
        <span className="font-mono text-mint-300">Live Arcade</span>
      </div>
    </div>
  );
}
