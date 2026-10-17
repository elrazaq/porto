"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BatikPattern } from "@/components/ui/BatikPattern";
import {
  FaChessPawn,
  FaArrowLeft,
  FaGraduationCap,
  FaBriefcase,
  FaCode,
} from "react-icons/fa6";
import { Mail, Download, MapPin, Sparkles } from "lucide-react";
import { generateResumePdf } from "@/utils/generateResumePdf";

interface AboutViewProps {
  onBack?: () => void;
}

export function AboutView({ onBack }: AboutViewProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadResume = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      await generateResumePdf();
    } catch (err) {
      console.error("Failed to generate CV PDF:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };
  return (
    <div className="relative w-full min-h-screen lg:h-screen lg:max-h-screen selection:bg-mint-400 selection:text-neutral-950 flex flex-col lg:flex-row bg-[#010a08]">
      {/* ========================================================
          SISI KIRI (Mobile: Top / Desktop: 42% Left)
          Background Forest Green #0a3028 + Cardboard Texture + Kawung Batik
          (100% Solid & Opaque to Prevent Any Background Bleeding)
          ======================================================== */}
      <div className="relative w-full lg:w-[42%] shrink-0 bg-[#0a3028] px-5 py-6 sm:px-8 lg:px-8 lg:py-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-mint-400/20 overflow-hidden z-10">
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

        {/* Left Side Content */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Top Bar: Return to Chessboard Button */}
          <div className="flex items-center justify-between mb-4 lg:mb-0">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-mint-400/50 bg-black/40 hover:bg-black/60 text-mint-200 hover:text-white text-xs font-chess tracking-wider uppercase transition-all duration-200 hover:border-mint-300 group cursor-pointer"
              >
                <FaArrowLeft className="w-3.5 h-3.5 text-mint-400 transition-transform group-hover:-translate-x-1" />
                <span>Back to Board</span>
              </button>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-mint-400/50 bg-black/40 hover:bg-black/60 text-mint-200 hover:text-white text-xs font-chess tracking-wider uppercase transition-all duration-200 hover:border-mint-300 group"
              >
                <FaArrowLeft className="w-3.5 h-3.5 text-mint-400 transition-transform group-hover:-translate-x-1" />
                <span>Back to Board</span>
              </Link>
            )}
            <div className="flex items-center gap-1.5 text-xs font-chess tracking-wider text-mint-300 uppercase">
              <FaChessPawn className="w-3.5 h-3.5 text-mint-400" />
              <span>Professional Bio</span>
            </div>
          </div>

          {/* Center Content: Portrait & Quick Bio */}
          <div className="my-auto py-3 sm:py-5 lg:py-1 flex flex-col items-center text-center">
            {/* Developer Portrait (Sharp 90-degree Border, Flat Regal Frame) */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 lg:w-40 lg:h-40 border-2 border-mint-400/60 bg-[#06241e] p-1.5 shadow-none mb-3 group">
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src="/porto.jpg"
                  alt="Developer Portrait"
                  fill
                  priority
                  className="object-cover object-top filter grayscale contrast-110 transition-transform duration-500 group-hover:scale-105 group-hover:grayscale-0"
                />
              </div>
              {/* Corner Accents */}
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-mint-300" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-mint-300" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-mint-300" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-mint-300" />
            </div>

            {/* Name & Specialization */}
            <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-white font-chess tracking-wider uppercase">
              Abdul Razak, S.T.
            </h1>
            <p className="text-xs sm:text-sm text-mint-200 font-semibold mt-0.5 font-chess tracking-wide">
              Full Stack Web &amp; Native Android Developer
            </p>

            <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-mint-300/80 font-chess">
              <MapPin className="w-3.5 h-3.5 text-mint-400" />
              <span>Indonesia • UTC+7</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-mint-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Available for Projects
              </span>
            </div>

            {/* Chess Philosophy Quote */}
            <p className="text-[11px] lg:text-[11.5px] italic text-mint-100/80 font-chess mt-2.5 max-w-xs leading-relaxed border-t border-mint-400/20 pt-2">
              &ldquo;Master the fundamentals like a pawn, execute with agility like a knight, command vision like a king.&rdquo;
            </p>
          </div>

          {/* Bottom Bar: Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-3 border-t border-mint-400/20">
            <a
              href="mailto:elrazaq185@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 border border-mint-400/50 bg-[#0f4e45] hover:bg-[#146358] text-white text-xs font-chess tracking-wider uppercase transition-all duration-200"
            >
              <Mail className="w-3.5 h-3.5 text-mint-300" />
              <span>Contact Me</span>
            </a>
            <button
              type="button"
              onClick={handleDownloadResume}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 px-4 py-2 border border-mint-400/50 bg-black/40 hover:bg-black/60 text-white text-xs font-chess tracking-wider uppercase transition-all duration-200 active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(52,211,153,0.15)] disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-mint-300 border-t-transparent rounded-full animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-mint-300" />
                  <span>Get Resume (PDF)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          SISI KANAN (Mobile: Bottom / Desktop: 58% Right)
          Deep Charcoal Green #010a08 + Monochrome Batik
          (Desktop: Fitted 100vh Without Scroll / Mobile: Natural Flow)
          ======================================================== */}
      <div className="relative w-full lg:w-[58%] flex-1 bg-[#010a08] px-5 py-5 sm:px-8 lg:px-9 lg:py-5 flex flex-col justify-between overflow-y-auto lg:overflow-y-hidden z-10">
        {/* Monochrome Batik Texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-screen z-0"
          style={{
            backgroundImage: "url('/batik-monochrome.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "280px",
          }}
        />

        {/* Right Side Content */}
        <div className="relative z-10 flex flex-col justify-between h-full space-y-3 lg:space-y-1.5 pb-20 lg:pb-0">
          {/* Section 1: Professional Summary */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-mint-300 font-chess border-b border-white/10 pb-1 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-mint-400" />
              <span>Professional Summary</span>
            </div>
            <p className="text-[11px] sm:text-xs text-white/85 leading-relaxed font-sans">
              Versatile Software Engineer and Systems Specialist with over 8 years of proven track record across full-stack web engineering, native Android development (Kotlin), and enterprise healthcare IT operations. Dedicated to architecting clean, resilient, and offline-first digital ecosystems.
            </p>
          </div>

          {/* Section 2: Work Experience */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase text-mint-300 font-chess border-b border-white/10 pb-1 mb-2">
              <div className="flex items-center gap-2">
                <FaBriefcase className="w-3.5 h-3.5 text-mint-400" />
                <span>Work Experience</span>
              </div>
              <span className="text-[10px] text-white/50 font-mono font-normal">
                Career History
              </span>
            </div>

            <div className="space-y-1.5">
              {/* Job 1: RSUD Bintan */}
              <div className="p-2 bg-white/[0.03] border-l-2 border-mint-400 border-y border-r border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                  <h3 className="text-xs sm:text-[12.5px] font-bold text-white font-chess tracking-wide">
                    Full Time IT Support &amp; IT of All IT
                  </h3>
                  <span className="text-[10px] text-emerald-300 font-mono font-semibold">
                    2021 &mdash; Present • Full Time
                  </span>
                </div>
                <div className="text-[10.5px] text-mint-300/90 font-chess">
                  RSUD Bintan
                </div>
                <p className="text-[10px] sm:text-[10.5px] text-white/70 mt-0.5 leading-snug">
                  Directing comprehensive IT infrastructure, hospital-wide network architecture, SIMRS health management systems, server administration, and mission-critical medical hardware troubleshooting.
                </p>
              </div>

              {/* Job 2: Freelance Android Developer */}
              <div className="p-2 bg-white/[0.03] border-l-2 border-mint-400/80 border-y border-r border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                  <h3 className="text-xs sm:text-[12.5px] font-bold text-white font-chess tracking-wide">
                    Freelance Android Developer
                  </h3>
                  <span className="text-[10px] text-emerald-300 font-mono font-semibold">
                    2024 &mdash; Present • Freelance
                  </span>
                </div>
                <div className="text-[10.5px] text-mint-300/90 font-chess">
                  Independent / Remote Client Projects
                </div>
                <p className="text-[10px] sm:text-[10.5px] text-white/70 mt-0.5 leading-snug">
                  Architecting reactive native Android applications with Kotlin, Jetpack Compose, MVVM/Clean Architecture, Room database (offline-first), and RESTful API integrations.
                </p>
              </div>

              {/* Job 3: Part Time Programmer di Biro Kesra Provinsi Kepri */}
              <div className="p-2 bg-white/[0.03] border-l-2 border-mint-400/60 border-y border-r border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                  <h3 className="text-xs sm:text-[12.5px] font-bold text-white font-chess tracking-wide">
                    Part Time Programmer
                  </h3>
                  <span className="text-[10px] text-mint-200/80 font-mono">
                    2021 &mdash; 2025 • Part Time
                  </span>
                </div>
                <div className="text-[10.5px] text-mint-300/90 font-chess">
                  Biro Kesra Provinsi Kepulauan Riau
                </div>
                <p className="text-[10px] sm:text-[10.5px] text-white/70 mt-0.5 leading-snug">
                  Engineered and maintained regional governmental management systems, digitized public welfare workflows, and streamlined inter-agency reporting databases.
                </p>
              </div>

              {/* Job 4: Freelance Web Developer */}
              <div className="p-2 bg-white/[0.03] border-l-2 border-mint-400/40 border-y border-r border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                  <h3 className="text-xs sm:text-[12.5px] font-bold text-white font-chess tracking-wide">
                    Freelance Web Developer
                  </h3>
                  <span className="text-[10px] text-emerald-300 font-mono font-semibold">
                    2017 &mdash; Present • Freelance
                  </span>
                </div>
                <div className="text-[10.5px] text-mint-300/90 font-chess">
                  Independent / Various Clients
                </div>
                <p className="text-[10px] sm:text-[10.5px] text-white/70 mt-0.5 leading-snug">
                  8+ years delivering bespoke full-stack web platforms, responsive corporate portals, high-converting landing pages, and API-driven web architectures.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Education Background */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-mint-300 font-chess border-b border-white/10 pb-1 mb-1.5">
              <FaGraduationCap className="w-3.5 h-3.5 text-mint-400" />
              <span>Education Background</span>
            </div>

            <div className="p-2 bg-white/[0.03] border-l-2 border-mint-400 border-y border-r border-white/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                <h3 className="text-xs sm:text-[12.5px] font-bold text-white font-chess tracking-wide">
                  Bachelor of Engineering in Informatics (S.T.)
                </h3>
                <span className="text-[10px] text-mint-300/90 font-mono">
                  Undergraduate Degree
                </span>
              </div>
              <div className="text-[10.5px] text-mint-200/90 font-chess mt-0.5">
                Sekolah Tinggi Teknologi Indonesia
              </div>
              <p className="text-[10px] sm:text-[10.5px] text-white/70 mt-0.5 leading-snug">
                Specialized in Software Engineering, Computer Networks, Applied Algorithms, and Enterprise Information Systems Modeling.
              </p>
            </div>
          </div>

          {/* Tech Arsenal Footer */}
          <div className="pt-1.5 border-t border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-chess tracking-wider text-white/70">
              <span className="text-mint-300 font-bold flex items-center gap-1">
                <FaCode className="w-3 h-3 text-mint-400" />
                TECH ARSENAL:
              </span>
              <span>Kotlin • Compose • Next.js • React • TypeScript • SIMRS • Networking • REST</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
