"use client";

import React, { useState, useEffect } from "react";
import { BentoGrid } from "@/components/bento/BentoGrid";
import { BatikPattern } from "@/components/ui/BatikPattern";
import { TopMenu } from "@/components/navigation/TopMenu";
import { AboutView } from "@/components/about/AboutView";
import { SkillsView } from "@/components/skills/SkillsView";
import { ContactView } from "@/components/contact/ContactView";
import { HireView } from "@/components/hire/HireView";
import { WorkView } from "@/components/work/WorkView";
import { LiquidWaterSpill } from "@/components/transitions/LiquidWaterSpill";
import { ChessArenaModal } from "@/components/chess/ChessArenaModal";

export default function Home() {
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isSkillsVisible, setIsSkillsVisible] = useState(false);
  const [isContactVisible, setIsContactVisible] = useState(false);
  const [isHireVisible, setIsHireVisible] = useState(false);
  const [isWorkVisible, setIsWorkVisible] = useState(false);
  const [isChessArenaOpen, setIsChessArenaOpen] = useState(false);
  const [scatterTarget, setScatterTarget] = useState<2 | 5 | 7 | 10 | 11 | null>(null);
  const [isSpilling, setIsSpilling] = useState(false);
  const [originCoords, setOriginCoords] = useState({ x: 0, y: 0 });

  // Sinkronisasi dengan tombol Back & Forward bawaan browser
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== "undefined") {
        if (window.location.pathname === "/about") {
          setIsSkillsVisible(false);
          setIsContactVisible(false);
          setIsHireVisible(false);
          setIsWorkVisible(false);
          setScatterTarget(2);
          setIsAboutVisible(true);
        } else if (window.location.pathname === "/work") {
          setIsAboutVisible(false);
          setIsSkillsVisible(false);
          setIsContactVisible(false);
          setIsHireVisible(false);
          setScatterTarget(5);
          setIsWorkVisible(true);
        } else if (window.location.pathname === "/skills") {
          setIsAboutVisible(false);
          setIsContactVisible(false);
          setIsHireVisible(false);
          setIsWorkVisible(false);
          setScatterTarget(7);
          setIsSkillsVisible(true);
        } else if (window.location.pathname === "/contact") {
          setIsAboutVisible(false);
          setIsSkillsVisible(false);
          setIsHireVisible(false);
          setIsWorkVisible(false);
          setScatterTarget(10);
          setIsContactVisible(true);
        } else if (window.location.pathname === "/hire") {
          setIsAboutVisible(false);
          setIsSkillsVisible(false);
          setIsContactVisible(false);
          setIsWorkVisible(false);
          setScatterTarget(11);
          setIsHireVisible(true);
        } else {
          setIsAboutVisible(false);
          setIsSkillsVisible(false);
          setIsContactVisible(false);
          setIsHireVisible(false);
          setIsWorkVisible(false);
          setScatterTarget(null);
          setIsSpilling(false);
        }
      }
    };

    handlePopState();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Handler transisi klik "More About Me" (Grid 02)
  const handleNavigateAbout = (coords?: { x: number; y: number }) => {
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

    // A. Tampilan Mobile: Langsung transisi halaman baru tanpa animasi air (eksklusif desktop)
    if (!isDesktop) {
      setIsSkillsVisible(false);
      setIsContactVisible(false);
      setIsHireVisible(false);
      setIsWorkVisible(false);
      setIsAboutVisible(true);
      window.history.pushState({ view: "about" }, "", "/about");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      return;
    }

    // B. Tampilan Desktop:
    let spillOrigin = coords;
    if (!spillOrigin || (spillOrigin.x === 0 && spillOrigin.y === 0)) {
      const el = document.getElementById("grid-about");
      if (el) {
        const rect = el.getBoundingClientRect();
        spillOrigin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      } else {
        spillOrigin = { x: window.innerWidth * 0.38, y: window.innerHeight * 0.25 };
      }
    }
    setOriginCoords(spillOrigin);

    // Kartu-kartu terlempar ke samping dari pusat Grid 02 & luncurkan tumpahan air
    setScatterTarget(2);
    setIsSpilling(true);

    setTimeout(() => {
      setIsSkillsVisible(false);
      setIsContactVisible(false);
      setIsHireVisible(false);
      setIsWorkVisible(false);
      setIsAboutVisible(true);
      window.history.pushState({ view: "about" }, "", "/about");
    }, 520);

    setTimeout(() => {
      setIsSpilling(false);
    }, 1100);
  };

  // Handler kembali ke Papan Catur dari About Me ("Back to Board")
  const handleBackToBoard = () => {
    setIsAboutVisible(false);
    setScatterTarget(null);
    setIsSpilling(false);
    window.history.pushState({ view: "board" }, "", "/");
  };

  // Handler transisi klik "My Work" (Grid 05 - Queen/Menteri)
  const handleNavigateWork = (coords?: { x: number; y: number }) => {
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

    // A. Tampilan Mobile: Langsung transisi halaman baru tanpa animasi air (eksklusif desktop)
    if (!isDesktop) {
      setIsAboutVisible(false);
      setIsSkillsVisible(false);
      setIsContactVisible(false);
      setIsHireVisible(false);
      setIsWorkVisible(true);
      window.history.pushState({ view: "work" }, "", "/work");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      return;
    }

    // B. Tampilan Desktop: Animasi kartu terlempar & tumpahan air identik dengan About, Skills, & Hire!
    let spillOrigin = coords;
    if (!spillOrigin || (spillOrigin.x === 0 && spillOrigin.y === 0)) {
      const el = document.getElementById("grid-mywork");
      if (el) {
        const rect = el.getBoundingClientRect();
        spillOrigin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      } else {
        spillOrigin = { x: window.innerWidth * 0.15, y: window.innerHeight * 0.5 };
      }
    }
    setOriginCoords(spillOrigin);

    // Kartu-kartu terlempar ke samping dari pusat Grid 05 & luncurkan tumpahan air
    setScatterTarget(5);
    setIsSpilling(true);

    setTimeout(() => {
      setIsAboutVisible(false);
      setIsSkillsVisible(false);
      setIsContactVisible(false);
      setIsHireVisible(false);
      setIsWorkVisible(true);
      window.history.pushState({ view: "work" }, "", "/work");
    }, 520);

    setTimeout(() => {
      setIsSpilling(false);
    }, 1100);
  };

  // Handler kembali ke Papan Catur dari My Work ("Back to Board")
  const handleBackFromWork = () => {
    setIsWorkVisible(false);
    setScatterTarget(null);
    setIsSpilling(false);
    window.history.pushState({ view: "board" }, "", "/");
  };

  // Handler transisi klik "Core Skills" (Grid 07)
  const handleNavigateSkills = (coords?: { x: number; y: number }) => {
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

    // A. Tampilan Mobile: Langsung transisi halaman baru tanpa animasi air (eksklusif desktop)
    if (!isDesktop) {
      setIsAboutVisible(false);
      setIsContactVisible(false);
      setIsHireVisible(false);
      setIsWorkVisible(false);
      setIsSkillsVisible(true);
      window.history.pushState({ view: "skills" }, "", "/skills");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      return;
    }

    // B. Tampilan Desktop: Animasi kartu terlempar & tumpahan air identik dengan About Me!
    let spillOrigin = coords;
    if (!spillOrigin || (spillOrigin.x === 0 && spillOrigin.y === 0)) {
      const el = document.getElementById("grid-skills");
      if (el) {
        const rect = el.getBoundingClientRect();
        spillOrigin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      } else {
        spillOrigin = { x: window.innerWidth * 0.62, y: window.innerHeight * 0.5 };
      }
    }
    setOriginCoords(spillOrigin);

    // Kartu-kartu terlempar ke samping dari pusat Grid 07 & luncurkan tumpahan air
    setScatterTarget(7);
    setIsSpilling(true);

    setTimeout(() => {
      setIsAboutVisible(false);
      setIsContactVisible(false);
      setIsHireVisible(false);
      setIsWorkVisible(false);
      setIsSkillsVisible(true);
      window.history.pushState({ view: "skills" }, "", "/skills");
    }, 520);

    setTimeout(() => {
      setIsSpilling(false);
    }, 1100);
  };

  // Handler kembali ke Papan Catur dari Skills ("Back to Board")
  const handleBackFromSkills = () => {
    setIsSkillsVisible(false);
    setScatterTarget(null);
    setIsSpilling(false);
    window.history.pushState({ view: "board" }, "", "/");
  };

  // Handler transisi klik "Get In Touch / Contact Info" (Grid 10)
  const handleNavigateContact = (coords?: { x: number; y: number }) => {
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

    // A. Tampilan Mobile: Langsung transisi halaman baru tanpa animasi air (eksklusif desktop)
    if (!isDesktop) {
      setIsAboutVisible(false);
      setIsSkillsVisible(false);
      setIsHireVisible(false);
      setIsWorkVisible(false);
      setIsContactVisible(true);
      window.history.pushState({ view: "contact" }, "", "/contact");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      return;
    }

    // B. Tampilan Desktop: Animasi kartu terlempar & tumpahan air identik dengan About & Skills!
    let spillOrigin = coords;
    if (!spillOrigin || (spillOrigin.x === 0 && spillOrigin.y === 0)) {
      const el = document.getElementById("grid-contact");
      if (el) {
        const rect = el.getBoundingClientRect();
        spillOrigin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      } else {
        spillOrigin = { x: window.innerWidth * 0.38, y: window.innerHeight * 0.75 };
      }
    }
    setOriginCoords(spillOrigin);

    // Kartu-kartu terlempar ke samping dari pusat Grid 10 & luncurkan tumpahan air
    setScatterTarget(10);
    setIsSpilling(true);

    setTimeout(() => {
      setIsAboutVisible(false);
      setIsSkillsVisible(false);
      setIsHireVisible(false);
      setIsWorkVisible(false);
      setIsContactVisible(true);
      window.history.pushState({ view: "contact" }, "", "/contact");
    }, 520);

    setTimeout(() => {
      setIsSpilling(false);
    }, 1100);
  };

  // Handler kembali ke Papan Catur dari Contact ("Back to Board")
  const handleBackFromContact = () => {
    setIsContactVisible(false);
    setScatterTarget(null);
    setIsSpilling(false);
    window.history.pushState({ view: "board" }, "", "/");
  };

  // Handler transisi klik "Hire Me" (Grid 11)
  const handleNavigateHire = (coords?: { x: number; y: number }) => {
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

    // A. Tampilan Mobile: Langsung transisi halaman baru tanpa animasi air (eksklusif desktop)
    if (!isDesktop) {
      setIsAboutVisible(false);
      setIsSkillsVisible(false);
      setIsContactVisible(false);
      setIsWorkVisible(false);
      setIsHireVisible(true);
      window.history.pushState({ view: "hire" }, "", "/hire");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      return;
    }

    // B. Tampilan Desktop: Animasi kartu terlempar & tumpahan air identik dengan About, Skills, & Contact!
    let spillOrigin = coords;
    if (!spillOrigin || (spillOrigin.x === 0 && spillOrigin.y === 0)) {
      const el = document.getElementById("grid-hire");
      if (el) {
        const rect = el.getBoundingClientRect();
        spillOrigin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      } else {
        spillOrigin = { x: window.innerWidth * 0.62, y: window.innerHeight * 0.75 };
      }
    }
    setOriginCoords(spillOrigin);

    // Kartu-kartu terlempar ke samping dari pusat Grid 11 & luncurkan tumpahan air
    setScatterTarget(11);
    setIsSpilling(true);

    setTimeout(() => {
      setIsAboutVisible(false);
      setIsSkillsVisible(false);
      setIsContactVisible(false);
      setIsWorkVisible(false);
      setIsHireVisible(true);
      window.history.pushState({ view: "hire" }, "", "/hire");
    }, 520);

    setTimeout(() => {
      setIsSpilling(false);
    }, 1100);
  };

  // Handler kembali ke Papan Catur dari Hire Me ("Back to Board")
  const handleBackFromHire = () => {
    setIsHireVisible(false);
    setScatterTarget(null);
    setIsSpilling(false);
    window.history.pushState({ view: "board" }, "", "/");
  };

  const isAnyOverlayActive =
    isAboutVisible || isSkillsVisible || isContactVisible || isHireVisible || isWorkVisible;

  return (
    <div className="relative w-full min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden selection:bg-mint-400 selection:text-neutral-950">
      {/* 
        ========================================================================
        LAYER 1 (BASE): HALAMAN UTAMA (CHESSBOARD BENTO GRID)
        Selalu berada di layer dasar sehingga tombol balik langsung fade ke sini,
        tidak pernah ada layar hitam kosong sama sekali!
        ========================================================================
      */}
      <div
        className={`relative z-0 w-full min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-start lg:justify-center ${
          isAnyOverlayActive ? "max-lg:hidden" : ""
        }`}
      >
        {/* Tombol Menu Trapesium Terbalik & Dropdown Gulung Tikar (Khusus Mobile di Papan Catur) */}
        {!isAnyOverlayActive && (
          <TopMenu
            onNavigateAbout={() => handleNavigateAbout()}
            onNavigateSkills={() => handleNavigateSkills()}
            onNavigateContact={() => handleNavigateContact()}
            onNavigateHire={() => handleNavigateHire()}
            onNavigateWork={() => handleNavigateWork()}
          />
        )}

        {/* 
          Background Split Papan Catur:
          - Mobile: Natural vertical scroll
          - Desktop: Fixed 50:50 vertical split
        */}
        <div className="absolute inset-0 h-full w-full lg:fixed lg:inset-0 pointer-events-none flex flex-col lg:flex-row z-0">
          {/* Sisi Kiri: Hijau dengan Tekstur Kertas Karton */}
          <div className="relative w-full h-1/2 lg:w-1/2 lg:h-full bg-[#0a3028] overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-40"
              style={{
                backgroundImage: "url('/cardboard-texture.png')",
                backgroundRepeat: "repeat",
                backgroundSize: "220px",
              }}
            />
            <BatikPattern variant="kawung" opacity={0.03} className="absolute inset-0" />
          </div>

          {/* Sisi Kanan: Hijau Gelap Pekat dengan Batik Monokrom */}
          <div className="relative w-full h-1/2 lg:w-1/2 lg:h-full bg-[#010a08] overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-screen"
              style={{
                backgroundImage: "url('/batik-monochrome.png')",
                backgroundRepeat: "repeat",
                backgroundSize: "280px",
              }}
            />
          </div>
        </div>

        {/* Grid Container */}
        <main className="relative z-10 w-full h-auto lg:h-full px-4 sm:px-8 lg:px-6 pt-16 sm:pt-20 lg:py-0 flex flex-col items-center justify-start lg:justify-center">
          <BentoGrid
            onNavigateAbout={handleNavigateAbout}
            scatterTarget={scatterTarget}
            originCoords={originCoords}
            onNavigateSkills={handleNavigateSkills}
            onNavigateContact={handleNavigateContact}
            onNavigateHire={handleNavigateHire}
            onNavigateWork={handleNavigateWork}
            onOpenChessArena={() => setIsChessArenaOpen(true)}
          />

          {/* Spacer untuk Mobile agar tidak kepotong di bagian paling bawah */}
          <div
            className="w-full h-40 sm:h-48 lg:hidden pointer-events-none shrink-0"
            aria-hidden="true"
          />
        </main>
      </div>

      {/* 
        ========================================================================
        LAYER 2: ANIMASI ALIRAN RIAK TUMPAHAN AIR HARFIAH (Eksklusif Desktop)
        ========================================================================
      */}
      <div className="hidden lg:block">
        <LiquidWaterSpill isActive={isSpilling} origin={originCoords} />
      </div>

      {/* 
        ========================================================================
        LAYER 3 (OVERLAY): HALAMAN ABOUT ME
        ========================================================================
      */}
      <div
        className={`fixed inset-0 z-50 w-full h-full overflow-y-auto lg:overflow-hidden transition-opacity duration-500 ease-in-out ${
          isAboutVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <AboutView onBack={handleBackToBoard} />
      </div>

      {/* 
        ========================================================================
        LAYER 4 (OVERLAY): HALAMAN TECHNICAL DOMAINS & CORE ARCHITECTURE
        ========================================================================
      */}
      <div
        className={`fixed inset-0 z-50 w-full h-full overflow-y-auto lg:overflow-hidden transition-opacity duration-500 ease-in-out ${
          isSkillsVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <SkillsView onBack={handleBackFromSkills} />
      </div>

      {/* 
        ========================================================================
        LAYER 5 (OVERLAY): HALAMAN CONTACT INFO (FASTWORK, PROJECTS.CO.ID, WHATSAPP, EMAIL)
        ========================================================================
      */}
      <div
        className={`fixed inset-0 z-50 w-full h-full overflow-y-auto lg:overflow-hidden transition-opacity duration-500 ease-in-out ${
          isContactVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <ContactView onBack={handleBackFromContact} />
      </div>

      {/* 
        ========================================================================
        LAYER 6 (OVERLAY): HALAMAN HIRE ME & PROJECT PROPOSALS
        ========================================================================
      */}
      <div
        className={`fixed inset-0 z-50 w-full h-full overflow-y-auto lg:overflow-hidden transition-opacity duration-500 ease-in-out ${
          isHireVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <HireView onBack={handleBackFromHire} />
      </div>

      {/* 
        ========================================================================
        LAYER 7 (OVERLAY): HALAMAN MY WORK & INTERACTIVE LIVE SERVER SANDBOX
        ========================================================================
      */}
      <div
        className={`fixed inset-0 z-50 w-full h-full overflow-y-auto lg:overflow-hidden transition-opacity duration-500 ease-in-out ${
          isWorkVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <WorkView onBack={handleBackFromWork} onNavigateHire={handleNavigateHire} />
      </div>

      {/* 
        ========================================================================
        LAYER 8 (MODAL): TACTICAL CHESS ARENA VS ABDUL RAZAK (AI BOT) - DESKTOP EXCLUSIVE
        ========================================================================
      */}
      <ChessArenaModal
        isOpen={isChessArenaOpen}
        onClose={() => setIsChessArenaOpen(false)}
      />
    </div>
  );
}
