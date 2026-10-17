"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BatikPattern } from "@/components/ui/BatikPattern";
import { CellAbout } from "./CellAbout";
import { CellKnight } from "./CellKnight";
import { CellArRahman } from "./CellArRahman";
import { CellMyWork } from "./CellMyWork";
import { CellSkills } from "./CellSkills";
import { CellBishop } from "./CellBishop";
import { CellQuote } from "./CellQuote";
import { CellContact } from "./CellContact";
import { CellHire } from "./CellHire";
import { CellChallenge } from "./CellChallenge";

interface BentoGridProps {
  onNavigateAbout?: (coords: { x: number; y: number }) => void;
  isNavigatingAbout?: boolean;
  originCoords?: { x: number; y: number };
  onNavigateSkills?: (coords: { x: number; y: number }) => void;
  onNavigateContact?: (coords: { x: number; y: number }) => void;
  onNavigateHire?: (coords: { x: number; y: number }) => void;
  onNavigateWork?: (coords: { x: number; y: number }) => void;
  onOpenChessArena?: () => void;
  scatterTarget?: 2 | 5 | 7 | 10 | 11 | null;
}

export function BentoGrid({
  onNavigateAbout,
  isNavigatingAbout: externalNavigating,
  originCoords: externalOrigin,
  onNavigateSkills,
  onNavigateContact,
  onNavigateHire,
  onNavigateWork,
  onOpenChessArena,
  scatterTarget,
}: BentoGridProps = {}) {
  const router = useRouter();
  const [localNavigating, setLocalNavigating] = useState(false);
  const isNavigatingAbout = externalNavigating ?? localNavigating;
  const [localCoords, setLocalCoords] = useState({ x: 0, y: 0 });
  const originCoords =
    externalOrigin && (externalOrigin.x !== 0 || externalOrigin.y !== 0)
      ? externalOrigin
      : localCoords;

  // Animasi Balok Tersusun (Block Stacking / Assembly Animation)
  const [isAssembled, setIsAssembled] = useState(false);
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);

  useEffect(() => {
    // Mulai animasi perakitan balok saat refresh / load pertama
    const startTimer = setTimeout(() => {
      setIsAssembled(true);
    }, 70);

    const finishTimer = setTimeout(() => {
      setIsAnimationFinished(true);
    }, 1300);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  // Desktop: 4 columns x 3 rows = 12 cells (Chessboard)
  // Mobile: 1 column x 9 rows = 9 cells (1x9 Vertical Strip)
  const rows = 3;
  const cols = 4;
  const cells = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const index = r * cols + c;
      const number = index + 1; // 1 to 12
      const isLightDesktop = (r + c) % 2 === 0;
      const isLightMobile = index % 2 === 0;

      cells.push({
        id: `${r}-${c}`,
        number,
        index,
        row: r,
        col: c,
        isLightDesktop,
        isLightMobile,
      });
    }
  }

  // Handler klik About Me:
  const handleAboutClick = (e?: React.MouseEvent) => {
    let coords = { x: 0, y: 0 };
    if (e && e.clientX && e.clientY) {
      coords = { x: e.clientX, y: e.clientY };
    } else {
      const el = document.getElementById("grid-about");
      if (el) {
        const rect = el.getBoundingClientRect();
        coords = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      } else if (typeof window !== "undefined") {
        coords = { x: window.innerWidth * 0.38, y: window.innerHeight * 0.25 };
      }
    }
    setLocalCoords(coords);

    if (onNavigateAbout) {
      onNavigateAbout(coords);
      return;
    }

    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      router.push("/about");
      return;
    }

    setLocalNavigating(true);
    setTimeout(() => {
      router.push("/about");
    }, 750);
  };

  // Handler klik Core Skills:
  const handleSkillsClick = (e?: React.MouseEvent) => {
    let coords = { x: 0, y: 0 };
    if (e && e.clientX && e.clientY) {
      coords = { x: e.clientX, y: e.clientY };
    } else {
      const el = document.getElementById("grid-skills");
      if (el) {
        const rect = el.getBoundingClientRect();
        coords = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      } else if (typeof window !== "undefined") {
        coords = { x: window.innerWidth * 0.62, y: window.innerHeight * 0.5 };
      }
    }
    setLocalCoords(coords);

    if (onNavigateSkills) {
      onNavigateSkills(coords);
      return;
    }

    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      router.push("/skills");
      return;
    }
  };

  // Handler klik Get In Touch / Contact Info:
  const handleContactClick = (e?: React.MouseEvent) => {
    let coords = { x: 0, y: 0 };
    if (e && e.clientX && e.clientY) {
      coords = { x: e.clientX, y: e.clientY };
    } else {
      const el = document.getElementById("grid-contact");
      if (el) {
        const rect = el.getBoundingClientRect();
        coords = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      } else if (typeof window !== "undefined") {
        coords = { x: window.innerWidth * 0.38, y: window.innerHeight * 0.75 };
      }
    }
    setLocalCoords(coords);

    if (onNavigateContact) {
      onNavigateContact(coords);
      return;
    }

    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      router.push("/contact");
      return;
    }
  };

  // Handler klik Hire Me (Grid 11):
  const handleHireClick = (e?: React.MouseEvent) => {
    let coords = { x: 0, y: 0 };
    if (e && e.clientX && e.clientY) {
      coords = { x: e.clientX, y: e.clientY };
    } else {
      const el = document.getElementById("grid-hire");
      if (el) {
        const rect = el.getBoundingClientRect();
        coords = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      } else if (typeof window !== "undefined") {
        coords = { x: window.innerWidth * 0.62, y: window.innerHeight * 0.75 };
      }
    }
    setLocalCoords(coords);

    if (onNavigateHire) {
      onNavigateHire(coords);
      return;
    }

    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      router.push("/hire");
      return;
    }
  };

  // Handler klik My Work (Grid 05):
  const handleWorkClick = (e?: React.MouseEvent) => {
    let coords = { x: 0, y: 0 };
    if (e && e.clientX && e.clientY) {
      coords = { x: e.clientX, y: e.clientY };
    } else {
      const el = document.getElementById("grid-mywork");
      if (el) {
        const rect = el.getBoundingClientRect();
        coords = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      } else if (typeof window !== "undefined") {
        coords = { x: window.innerWidth * 0.15, y: window.innerHeight * 0.5 };
      }
    }
    setLocalCoords(coords);

    if (onNavigateWork) {
      onNavigateWork(coords);
      return;
    }

    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      router.push("/work");
      return;
    }
  };

  // Gaya animasi kartu terlempar eksklusif desktop (halus & organik)
  const getCardScatterStyle = (cellNumber: number) => {
    const activeTarget = scatterTarget ?? (isNavigatingAbout ? 2 : null);
    if (!activeTarget) return "";

    // Grid pusat tumpahan/transisi (Grid 02, 05, 07, 10, atau 11) memudar halus di tempat
    if (cellNumber === activeTarget) {
      return "opacity-0 transition-opacity duration-300 pointer-events-none";
    }

    // Grid lainnya: Terlempar ke samping seperti kartu berhamburan
    switch (cellNumber) {
      case 1:
        return "-translate-x-[160%] -translate-y-[140%] -rotate-[35deg] scale-75 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none";
      case 2:
        return "-translate-x-[180%] -translate-y-[110%] -rotate-[25deg] scale-75 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none";
      case 3:
        return "translate-x-[160%] -translate-y-[140%] rotate-[30deg] scale-75 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none";
      case 4:
        return "translate-x-[240%] -translate-y-[100%] rotate-[45deg] scale-75 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none";
      case 5:
        return "-translate-x-[240%] rotate-[-35deg] scale-75 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none";
      case 6:
        return "-translate-x-[130%] translate-y-[160%] rotate-[25deg] scale-75 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none";
      case 7:
        return "translate-x-[90%] translate-y-[190%] -rotate-[25deg] scale-75 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none";
      case 8:
        return "translate-x-[240%] rotate-[35deg] scale-75 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none";
      case 9:
        return "-translate-x-[220%] translate-y-[220%] -rotate-[45deg] scale-75 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none";
      case 10:
        return "-translate-x-[80%] translate-y-[240%] rotate-[30deg] scale-75 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none";
      case 11:
        return "translate-x-[100%] translate-y-[240%] -rotate-[30deg] scale-75 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none";
      case 12:
        return "translate-x-[240%] translate-y-[240%] rotate-[50deg] scale-75 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none";
      default:
        return "";
    }
  };

  const hasScatter = Boolean(scatterTarget ?? (isNavigatingAbout ? 2 : null));

  return (
    <div
      className="w-full lg:w-auto max-w-xs sm:max-w-sm lg:max-w-[91vw] h-auto lg:h-[80vh] lg:aspect-[4.65/3] mx-auto grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-3 gap-0"
      style={{ perspective: "1200px" }}
    >
        {cells.map((cell) => {
          // Grid 01: Abu-abu gelap (Dark Sage Charcoal)
          const isGrid01 = cell.number === 1;
          // Grid 02: Ringkasan diri (Full Stack & Android Native) dengan hover "More About Me"
          const isGrid02 = cell.number === 2;
          // Grid 03: Abu-abu terang selaras dengan ikon kuda catur besar
          const isGrid03 = cell.number === 3;
          // Grid 04: Surah Ar-Rahman Quote dengan kaligrafi & font Islami (Amiri)
          const isGrid04 = cell.number === 4;
          // Grid 05: My Work dengan ikon Menteri/Queen dan garis abstrak
          const isGrid05 = cell.number === 5;
          // Grid 06: Abu-abu gelap mirip Grid 01 tapi sedikit lebih terang
          const isGrid06 = cell.number === 6;
          // Grid 07: Ringkasan Skill dengan ikon Pion & tombol hover "See More CV"
          const isGrid07 = cell.number === 7;
          // Grid 08: Abu-abu terang selaras dengan ikon Gajah/Bishop yang miring saat hover
          const isGrid08 = cell.number === 8;
          // Grid 09: Abu-abu terang dengan kata-kata motivasi
          const isGrid09 = cell.number === 9;
          // Grid 10: Ikon Benteng/Rook + Get In Touch dengan tombol Contact Info saat hover
          const isGrid10 = cell.number === 10;
          // Grid 11: Ikon Raja/King + Hire Me dengan filosofi sesama raja
          const isGrid11 = cell.number === 11;
          // Grid 12: Sama persis dengan Grid 01 (Abu-abu gelap polos)
          const isGrid12 = cell.number === 12;

          // Grid yang cuma warna saja (tanpa konten): 01, 06, 12
          const isColorOnly = isGrid01 || isGrid06 || isGrid12;
          // Di mobile view, grid yang cuma warna diskip (tidak ditampilkan)
          const isHiddenOnMobile = isColorOnly;

          const mobileBg = isGrid01 || isGrid12
            ? "bg-[#202826]"
            : isGrid03 || isGrid08 || isGrid09 || isGrid11
            ? "bg-[#dce5e1]"
            : isGrid05
            ? "bg-[#05241e]"
            : isGrid06
            ? "bg-[#2d3835]"
            : "bg-[#0f4e45]";

          const desktopBg = isGrid01 || isGrid12
            ? "lg:bg-[#202826]"
            : isGrid03 || isGrid08 || isGrid09 || isGrid11
            ? "lg:bg-[#dce5e1]"
            : isGrid05
            ? "lg:bg-[#05241e]"
            : isGrid06
            ? "lg:bg-[#2d3835]"
            : "lg:bg-[#0f4e45]";

          // Tentukan ID unik untuk deep linking anchor menu
          const cellDomId = isGrid02
            ? "grid-about"
            : isGrid05
            ? "grid-mywork"
            : isGrid07
            ? "grid-skills"
            : isGrid10
            ? "grid-contact"
            : isGrid11
            ? "grid-hire"
            : undefined;

          const scatterStyle = getCardScatterStyle(cell.number);

          // Diagonal wave stagger for 3x4 chessboard grid (r + c from 0 to 5)
          const diagonalStep = cell.row + cell.col;
          const assembleDelayMs = diagonalStep * 85;

          // Block Assembly 3D Transition Style
          const assembleStyle: React.CSSProperties =
            !isAnimationFinished && !hasScatter
              ? {
                  transitionProperty: "transform, opacity, box-shadow",
                  transitionDuration: "720ms",
                  transitionTimingFunction: "cubic-bezier(0.34, 1.45, 0.64, 1)",
                  transitionDelay: `${assembleDelayMs}ms`,
                  transform: !isAssembled
                    ? `translate3d(0, -85px, 60px) rotateX(24deg) rotateZ(${cell.col % 2 === 0 ? "-2.5deg" : "2.5deg"}) scale(0.88)`
                    : "translate3d(0, 0, 0) rotateX(0deg) rotateZ(0deg) scale(1)",
                  opacity: !isAssembled ? 0 : 1,
                }
              : {};

          // Tactile 3D Block Hover once assembled and resting
          const hoverElevationClass =
            isAnimationFinished && !hasScatter
              ? "hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.6)] hover:z-20 transition-all duration-200 cursor-pointer"
              : "";

          return (
            <div
              key={cell.id}
              id={cellDomId}
              style={assembleStyle}
              className={`w-full aspect-square lg:aspect-auto lg:h-full select-none ${mobileBg} ${desktopBg} ${
                isHiddenOnMobile ? "hidden lg:flex" : "flex"
              } ${scatterStyle} ${hoverElevationClass}`}
            >
              {/* Grid 02: Konten Ringkasan About Me */}
              {isGrid02 ? (
                <CellAbout onClick={handleAboutClick} />
              ) : isGrid03 ? (
                /* Grid 03: Ikon Kuda Catur Besar */
                <CellKnight />
              ) : isGrid04 ? (
                /* Grid 04: Surah Ar-Rahman Quote Islami */
                <CellArRahman />
              ) : isGrid05 ? (
                /* Grid 05: My Work dengan Ikon Menteri/Queen */
                <CellMyWork onClick={handleWorkClick} />
              ) : isGrid07 ? (
                /* Grid 07: Ringkasan Skill dengan Ikon Pion & Hover "See More CV" */
                <CellSkills onClick={handleSkillsClick} />
              ) : isGrid08 ? (
                /* Grid 08: Ikon Gajah/Bishop Catur Besar */
                <CellBishop />
              ) : isGrid09 ? (
                /* Grid 09: Kata-Kata Motivasi */
                <CellQuote />
              ) : isGrid10 ? (
                /* Grid 10: Ikon Benteng + Get In Touch & Hover Contact */
                <CellContact onClick={handleContactClick} />
              ) : isGrid11 ? (
                /* Grid 11: Ikon Raja + Hire Me & Hover */
                <CellHire onClick={handleHireClick} />
              ) : isGrid12 ? (
                /* Grid 12: Abdul Razak (AI Bot) + "Or Challenge Me" (Desktop Exclusive) */
                <CellChallenge onClick={onOpenChessArena} />
              ) : null}
            </div>
          );
        })}
    </div>
  );
}
