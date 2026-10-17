"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BatikPattern } from "@/components/ui/BatikPattern";
import {
  FaChessQueen,
  FaArrowLeft,
  FaChevronUp,
  FaChevronDown,
  FaCode,
  FaBriefcase,
} from "react-icons/fa6";
import {
  ExternalLink,
  Laptop,
  Smartphone,
  RefreshCw,
  Layers,
  CheckCircle2,
  Info,
  ShieldCheck,
  Server,
  ArrowRight,
} from "lucide-react";
import { FEATURED_PROJECTS, ProjectItem } from "@/data/projects";
import { CoffeeShopDemo } from "./demos/CoffeeShopDemo";
import { RestaurantPosDemo } from "./demos/RestaurantPosDemo";
import { TravelAstroDemo } from "./demos/TravelAstroDemo";
import { MasjidTvDemo } from "./demos/MasjidTvDemo";
import { AbsensiPegawaiDemo } from "./demos/AbsensiPegawaiDemo";

interface WorkViewProps {
  onBack?: () => void;
  onNavigateHire?: () => void;
}

export function WorkView({ onBack, onNavigateHire }: WorkViewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [refreshKey, setRefreshKey] = useState(0);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const currentProject: ProjectItem = FEATURED_PROJECTS[selectedIndex];
  const isTabletOnly = currentProject.id === "lava-cheese-pos";
  const isTvOnly = currentProject.id === "masjid-tv-signage";
  const isWidescreenOnly = isTabletOnly || isTvOnly;

  // Auto-switch to desktop if a tablet-only or TV-only project is active
  useEffect(() => {
    if (isWidescreenOnly && deviceMode === "mobile") {
      setDeviceMode("desktop");
    }
  }, [isWidescreenOnly, deviceMode]);

  // Auto-scroll the gallery list so selectedIndex is always in view (slider behavior)
  useEffect(() => {
    if (!listContainerRef.current) return;
    if (selectedIndex === 0) {
      listContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } else if (selectedIndex === FEATURED_PROJECTS.length - 1) {
      listContainerRef.current.scrollTo({
        top: listContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    } else {
      const activeItem = document.getElementById(`project-card-${selectedIndex}`);
      if (activeItem) {
        activeItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [selectedIndex]);

  // Up/Down keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : FEATURED_PROJECTS.length - 1));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < FEATURED_PROJECTS.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : FEATURED_PROJECTS.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < FEATURED_PROJECTS.length - 1 ? prev + 1 : 0));
  };

  const handleReloadDemo = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="relative w-full min-h-screen lg:h-screen lg:max-h-screen selection:bg-mint-400 selection:text-neutral-950 flex flex-col lg:flex-row bg-[#010a08]">
      {/* ========================================================
          SISI KIRI (Mobile: Top / Desktop: 38% Left)
          Gallery List with Up & Down Carousel Controls
          Background Forest Green #0a3028 Solid 100% Opaque
          ======================================================== */}
      <div className="relative w-full lg:w-[38%] shrink-0 bg-[#0a3028] px-4 py-4 sm:px-6 lg:px-6 lg:py-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-mint-400/20 overflow-hidden z-10">
        {/* Cardboard Texture & Kawung Batik Pattern */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-40 z-0"
          style={{
            backgroundImage: "url('/cardboard-texture.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "220px",
          }}
        />
        <BatikPattern variant="kawung" opacity={0.035} className="absolute inset-0 z-0" />

        {/* Konten Kiri */}
        <div className="relative z-10 flex flex-col justify-between h-full space-y-3">
          {/* Top Bar: Back to Board & Section Badge */}
          <div className="flex items-center justify-between">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 px-3 py-1.5 border border-mint-400/50 bg-black/40 hover:bg-black/60 text-mint-200 hover:text-white text-xs font-chess tracking-wider uppercase transition-all duration-200 hover:border-mint-300 group cursor-pointer"
              >
                <FaArrowLeft className="w-3.5 h-3.5 text-mint-400 transition-transform group-hover:-translate-x-1" />
                <span>Back to Board</span>
              </button>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-3 py-1.5 border border-mint-400/50 bg-black/40 hover:bg-black/60 text-mint-200 hover:text-white text-xs font-chess tracking-wider uppercase transition-all duration-200 hover:border-mint-300 group"
              >
                <FaArrowLeft className="w-3.5 h-3.5 text-mint-400 transition-transform group-hover:-translate-x-1" />
                <span>Back to Board</span>
              </Link>
            )}

            <div className="flex items-center gap-1.5 text-xs font-chess tracking-wider text-mint-300 uppercase">
              <FaChessQueen className="w-3.5 h-3.5 text-mint-400" />
              <span>Selected Works &bull; Grid 05</span>
            </div>
          </div>

          {/* Gallery Header & Navigation Controls */}
          <div>
            <div className="flex items-center justify-between pb-1.5 border-b border-mint-400/20">
              <div>
                <h1 className="text-base sm:text-lg font-black text-white font-chess tracking-wider uppercase">
                  Project Gallery
                </h1>
                <p className="text-[11px] text-mint-200/80 font-chess">
                  Interactive Live Prototypes with Sample Data
                </p>
              </div>

              {/* Up & Down Navigation Arrows */}
              <div className="flex items-center gap-1 bg-black/40 border border-mint-400/30 p-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1 hover:bg-mint-400/20 text-mint-300 hover:text-white transition-colors cursor-pointer"
                  title="Previous project (Arrow Up)"
                >
                  <FaChevronUp className="w-3 h-3" />
                </button>
                <span className="px-1.5 font-mono text-[10.5px] font-bold text-mint-200">
                  {currentProject.number} / {String(FEATURED_PROJECTS.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1 hover:bg-mint-400/20 text-mint-300 hover:text-white transition-colors cursor-pointer"
                  title="Next project (Arrow Down)"
                >
                  <FaChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Vertical Gallery List (Mobile: Max 2 Cards with Smooth Slider Behavior) */}
          <div
            ref={listContainerRef}
            className="flex-1 max-h-[196px] sm:max-h-[205px] lg:max-h-none overflow-y-auto scroll-smooth space-y-2 pr-1 select-none"
          >
            {FEATURED_PROJECTS.map((project, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={project.id}
                  id={`project-card-${idx}`}
                  onClick={() => setSelectedIndex(idx)}
                  className={`p-3 border transition-all cursor-pointer select-none relative shrink-0 ${
                    isSelected
                      ? "bg-[#05241e] border-mint-300 shadow-[0_0_15px_rgba(45,212,191,0.15)]"
                      : "bg-black/30 border-white/10 hover:border-mint-400/40 hover:bg-black/50"
                  }`}
                >
                  {/* Active Indicator Bar */}
                  {isSelected && (
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-mint-400" />
                  )}

                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-mono font-bold text-mint-300">
                      PROJECT {project.number}
                    </span>
                    <span className="px-1.5 py-0.2 bg-black/40 text-mint-200 border border-mint-400/30 font-chess text-[9px] uppercase">
                      {project.badge}
                    </span>
                  </div>

                  <h3
                    className={`text-xs sm:text-[12.5px] font-bold font-chess leading-snug tracking-wide line-clamp-2 ${
                      isSelected ? "text-white" : "text-white/80"
                    }`}
                  >
                    {project.title}
                  </h3>

                  <div className="mt-1 text-[10px] text-mint-200/70 font-chess flex items-center justify-between">
                    <span className="truncate pr-2">{project.client}</span>
                    <span className="font-mono text-white/50 shrink-0">{project.year}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Slider Indicator Dots */}
          <div className="flex lg:hidden items-center justify-between pt-1 text-[10px] font-mono text-mint-300/80 border-t border-mint-400/10">
            <span>Tampilkan 2 dari {FEATURED_PROJECTS.length} Proyek</span>
            <div className="flex items-center gap-1.5">
              {FEATURED_PROJECTS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    i === selectedIndex ? "w-4 bg-mint-400" : "w-1.5 bg-white/20"
                  }`}
                  title={`Ke Project ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Bottom Sandbox Disclaimer */}
          <div className="pt-2 border-t border-mint-400/20 flex items-start gap-2 text-[10px] font-chess text-white/70 leading-snug">
            <Info className="w-3.5 h-3.5 text-mint-400 shrink-0 mt-0.5" />
            <p>
              <strong>Interactive Sandbox Notice:</strong> The preview on the right is a simulated functional prototype running directly in this project. All data shown are sample records to demonstrate workflows and architectural behavior.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================
          SISI KANAN (Mobile: Bottom / Desktop: 62% Right)
          Live Server Simulated Application Container
          Background Deep Charcoal #010a08 + Monochrome Batik
          ======================================================== */}
      <div className="relative w-full lg:w-[62%] flex-1 bg-[#010a08] px-4 py-4 sm:px-6 lg:px-7 lg:py-4 flex flex-col justify-between overflow-y-auto lg:overflow-y-hidden z-10">
        {/* Monochrome Batik Texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-screen z-0"
          style={{
            backgroundImage: "url('/batik-monochrome.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "280px",
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-between h-full space-y-3 pb-16 lg:pb-0">
          {/* Top Bar: Sandbox Browser Header */}
          <div className="bg-[#0a3028] border border-mint-400/30 p-2 sm:px-3 flex flex-wrap items-center justify-between gap-2 shadow-md">
            {/* Window Dots & Simulated Address Bar */}
            <div className="flex items-center gap-2.5 flex-1 min-w-[200px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>

              {/* URL Bar */}
              <div className="flex-1 bg-black/50 border border-white/10 px-2.5 py-1 text-[10.5px] font-mono text-mint-200/90 flex items-center justify-between truncate">
                <span className="truncate">{currentProject.simulatedUrl}</span>
                <span className="text-[9px] text-emerald-400 font-bold ml-2 shrink-0">
                  SECURE &bull; LOCAL SANDBOX
                </span>
              </div>
            </div>

            {/* View Mode & Reset Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReloadDemo}
                className="p-1.5 bg-black/40 hover:bg-black/60 border border-white/10 text-mint-300 hover:text-white transition-colors cursor-pointer"
                title="Reset sample state"
              >
                <RefreshCw className="w-3 h-3" />
              </button>

              <div className="flex items-center gap-2">
                {isTabletOnly && (
                  <span className="hidden sm:inline-flex items-center text-[10px] font-mono text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded">
                    Tablet Only (Mobile N/A)
                  </span>
                )}
                {isTvOnly && (
                  <span className="hidden sm:inline-flex items-center text-[10px] font-mono text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded">
                    16:9 Smart TV (Mobile N/A)
                  </span>
                )}
                {currentProject.id === "absensi-pegawai-integrated" && (
                  <span className="hidden sm:inline-flex items-center text-[10px] font-mono text-mint-300 bg-mint-500/15 border border-mint-500/30 px-2 py-0.5 rounded">
                    Desktop = Web Admin &bull; Mobile = App Android
                  </span>
                )}
                <div className="flex items-center border border-white/10 bg-black/40 p-0.5">
                  <button
                    type="button"
                    onClick={() => setDeviceMode("desktop")}
                    className={`p-1 text-xs transition-colors cursor-pointer ${
                      deviceMode === "desktop"
                        ? "bg-mint-400/20 text-white"
                        : "text-white/40 hover:text-white"
                    }`}
                    title="Desktop / Web Admin View"
                  >
                    <Laptop className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={isWidescreenOnly}
                    onClick={() => {
                      if (!isWidescreenOnly) setDeviceMode("mobile");
                    }}
                    className={`p-1 text-xs transition-colors ${
                      isWidescreenOnly
                        ? "opacity-25 cursor-not-allowed text-white/30"
                        : deviceMode === "mobile"
                        ? "bg-mint-400/20 text-white cursor-pointer"
                        : "text-white/40 hover:text-white cursor-pointer"
                    }`}
                    title={
                      isWidescreenOnly
                        ? "Tampilan Mobile Tidak Tersedia (Khusus Widescreen Tablet POS / 16:9 Android TV)"
                        : "Mobile Viewport / App Android Pegawai"
                    }
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview Container Frame */}
          <div className="flex-1 min-h-[360px] sm:min-h-[400px] border-2 border-mint-400/30 bg-[#02110c] overflow-hidden flex flex-col justify-between shadow-2xl relative">
            <div
              key={`${currentProject.id}-${refreshKey}`}
              className={`w-full h-full mx-auto transition-all duration-300 ${
                deviceMode === "mobile" && !isWidescreenOnly
                  ? "max-w-sm border-x border-mint-400/30 shadow-2xl"
                  : "w-full"
              }`}
            >
              {currentProject.id === "saman-coffee-roasters" ? (
                <CoffeeShopDemo />
              ) : currentProject.id === "lava-cheese-pos" ? (
                <RestaurantPosDemo />
              ) : currentProject.id === "nusantara-travel-astro" ? (
                <TravelAstroDemo />
              ) : currentProject.id === "masjid-tv-signage" ? (
                <MasjidTvDemo />
              ) : currentProject.id === "absensi-pegawai-integrated" ? (
                <AbsensiPegawaiDemo deviceMode={deviceMode} onSwitchMode={setDeviceMode} />
              ) : (
                <CoffeeShopDemo />
              )}
            </div>
          </div>

          {/* Technical Blueprint & Architecture Highlights Footer */}
          <div className="p-3 bg-[#0a3028]/80 border border-mint-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-chess font-bold uppercase tracking-wider text-white text-[11px]">
                  {currentProject.title}
                </span>
                <span className="text-[10px] text-mint-300 font-mono">
                  &bull; {currentProject.category}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {currentProject.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-black/40 border border-mint-400/30 text-[9.5px] font-chess text-mint-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Contact CTA */}
            {onNavigateHire ? (
              <button
                type="button"
                onClick={onNavigateHire}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#0f4e45] hover:bg-[#146358] border border-mint-400 text-white font-chess text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-md"
              >
                <span>Request Similar Architecture</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Link
                href="/hire"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#0f4e45] hover:bg-[#146358] border border-mint-400 text-white font-chess text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-md"
              >
                <span>Request Similar Architecture</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
