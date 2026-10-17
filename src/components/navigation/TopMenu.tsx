"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaChessPawn,
  FaChessQueen,
  FaChessRook,
  FaChessKing,
} from "react-icons/fa6";
import { Sparkles, Code2 } from "lucide-react";

interface MenuItem {
  id: string;
  gridNumber: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

interface TopMenuProps {
  onNavigateAbout?: () => void;
  onNavigateSkills?: () => void;
  onNavigateContact?: () => void;
  onNavigateHire?: () => void;
  onNavigateWork?: () => void;
}

export function TopMenu({
  onNavigateAbout,
  onNavigateSkills,
  onNavigateContact,
  onNavigateHire,
  onNavigateWork,
}: TopMenuProps = {}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Hanya menampilkan menu fungsional utama (Bishop & Knight ditiadakan)
  const menuItems: MenuItem[] = [
    {
      id: "grid-about",
      gridNumber: "02",
      title: "About Me",
      subtitle: "Full Stack & Android Native",
      icon: <FaChessPawn className="w-4 h-4" />,
    },
    {
      id: "grid-mywork",
      gridNumber: "05",
      title: "My Work",
      subtitle: "Featured Project Portfolio",
      icon: <FaChessQueen className="w-4 h-4" />,
    },
    {
      id: "grid-skills",
      gridNumber: "07",
      title: "Core Skills",
      subtitle: "Kotlin, Next.js, Architecture",
      icon: <Code2 className="w-4 h-4" />,
    },
    {
      id: "grid-contact",
      gridNumber: "10",
      title: "Get In Touch",
      subtitle: "Contact Info & Channels",
      icon: <FaChessRook className="w-4 h-4" />,
    },
    {
      id: "grid-hire",
      gridNumber: "11",
      title: "Hire Me",
      subtitle: "Project Inquiries & Contracts",
      icon: <FaChessKing className="w-4 h-4" />,
    },
  ];

  const handleNavigate = (id: string) => {
    setIsOpen(false);
    if (id === "grid-about") {
      if (onNavigateAbout) {
        onNavigateAbout();
      } else {
        router.push("/about");
      }
      return;
    }
    if (id === "grid-mywork") {
      if (onNavigateWork) {
        onNavigateWork();
      } else {
        router.push("/work");
      }
      return;
    }
    if (id === "grid-skills") {
      if (onNavigateSkills) {
        onNavigateSkills();
      } else {
        router.push("/skills");
      }
      return;
    }
    if (id === "grid-contact") {
      if (onNavigateContact) {
        onNavigateContact();
      } else {
        router.push("/contact");
      }
      return;
    }
    if (id === "grid-hire") {
      if (onNavigateHire) {
        onNavigateHire();
      } else {
        router.push("/hire");
      }
      return;
    }
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.add("ring-2", "ring-mint-300");
      setTimeout(() => {
        target.classList.remove("ring-2", "ring-mint-300");
      }, 1200);
    }
  };

  return (
    <>
      {/* 
        Inverted Trapezoid Button (Trapesium Terbalik Garis 3)
        Fixed at top center, khusus mobile view saja (lg:hidden)
      */}
      <div className="lg:hidden fixed top-0 left-1/2 -translate-x-1/2 z-50 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="relative w-24 h-10 flex flex-col items-center justify-center pt-0.5 cursor-pointer transition-all duration-300 hover:brightness-125 focus:outline-none select-none group"
          style={{
            clipPath: "polygon(0 0, 100% 0, 78% 100%, 22% 100%)",
            backgroundColor: "rgba(20, 26, 25, 0.94)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          {/* Animated Hamburger 3 Lines to 'X' */}
          <div className="w-5 h-4 flex flex-col justify-between items-center">
            <span
              className={`w-5 h-0.5 bg-white rounded-full transition-transform duration-300 origin-center ${
                isOpen ? "translate-y-[7px] rotate-45 bg-mint-300" : ""
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-white rounded-full transition-all duration-200 ${
                isOpen ? "opacity-0 scale-x-0" : "opacity-100"
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-white rounded-full transition-transform duration-300 origin-center ${
                isOpen ? "-translate-y-[7px] -rotate-45 bg-mint-300" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Backdrop Overlay when dropdown is open (Mobile only) */}
      <div
        onClick={() => setIsOpen(false)}
        className={`lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* 
        Dropdown Menu (Roll down & roll back up like a mat / tikar, khusus mobile)
      */}
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#161c1b]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-14 pb-7">
          {/* Dropdown Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-mint-300" />
              <span className="text-xs font-bold tracking-widest text-mint-300 font-chess uppercase">
                Portfolio Navigation
              </span>
            </div>
            <span className="text-[11px] text-white/50 font-chess">
              {menuItems.length} Key Sections
            </span>
          </div>

          {/* Directory Items: Only functional menus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-mint-400/40 transition-all text-left group cursor-pointer"
              >
                <div className="p-2 bg-white/5 group-hover:bg-mint-400/20 text-mint-300 transition-colors">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-mint-200 font-chess tracking-wider uppercase truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-white/40 font-mono">
                      {item.gridNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60 group-hover:text-white/85 truncate">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 font-chess">
            <span>Press ESC or click outside to roll up</span>
            <span>DIRECT ACCESS</span>
          </div>
        </div>
      </div>
    </>
  );
}
