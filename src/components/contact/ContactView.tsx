"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BatikPattern } from "@/components/ui/BatikPattern";
import {
  FaChessRook,
  FaArrowLeft,
  FaWhatsapp,
  FaBriefcase,
} from "react-icons/fa6";
import {
  Mail,
  Phone,
  MessageSquare,
  ExternalLink,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  MapPin,
  Sparkles,
} from "lucide-react";

interface ContactViewProps {
  onBack?: () => void;
}

export function ContactView({ onBack }: ContactViewProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const emailAddress = "elrazaq185@gmail.com";
  const phoneNumber = "0821-6944-1179";
  const internationalPhone = "+62 821-6944-1179";
  const whatsappUrl = "https://wa.me/6282169441179";
  const fastworkUrl =
    "https://fastwork.id/byob/GF2srRZXWQ?openExternalBrowser=1&source=byob";
  const projectsCoIdUrl =
    "https://projects.co.id/public/browse_users/view/df8c13/el-razaq-elrazaq";

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("082169441179");
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <div className="relative w-full min-h-screen lg:h-screen lg:max-h-screen selection:bg-mint-400 selection:text-neutral-950 flex flex-col lg:flex-row bg-[#010a08]">
      {/* ========================================================
          SISI KIRI (Mobile: Top / Desktop: 42% Left)
          Developer Portrait & Quick Connection Card
          Background Forest Green #0a3028 Solid 100% Opaque
          ======================================================== */}
      <div className="relative w-full lg:w-[42%] shrink-0 bg-[#0a3028] px-5 py-6 sm:px-8 lg:px-8 lg:py-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-mint-400/20 overflow-hidden z-10">
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
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Top Bar: Back to Board & Castle Defense Badge */}
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
              <FaChessRook className="w-3.5 h-3.5 text-mint-400" />
              <span>Direct Link &bull; Rook Tower</span>
            </div>
          </div>

          {/* Center: Developer Portrait & Presence */}
          <div className="my-auto py-4 sm:py-6 lg:py-2 flex flex-col items-center text-center">
            {/* Foto Developer (Sharp 90-degree Border, Flat Regal Frame) */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-44 lg:h-44 border-2 border-mint-400/60 bg-[#06241e] p-1.5 shadow-none mb-3.5 group">
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

            {/* Name & Availability */}
            <h1 className="text-xl sm:text-2xl font-black text-white font-chess tracking-wider uppercase">
              Get In Touch
            </h1>
            <p className="text-xs sm:text-sm text-mint-200 font-semibold mt-1 font-chess tracking-wide">
              Full Stack Web &bull; Android Native &bull; IT Systems
            </p>

            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-mint-300/80 font-chess">
              <MapPin className="w-3.5 h-3.5 text-mint-400" />
              <span>Indonesia &bull; UTC+7 (WIB)</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Available for Hire
              </span>
            </div>

            <p className="text-[11px] lg:text-xs italic text-mint-100/80 font-chess mt-3 max-w-xs leading-relaxed border-t border-mint-400/20 pt-2.5">
              &ldquo;Strong defense, decisive execution. Ready to discuss contracts, architecture reviews, and development expeditions.&rdquo;
            </p>
          </div>

          {/* Quick Action Buttons on Left Column */}
          <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-mint-400/20">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 border border-emerald-400/60 bg-emerald-600/30 hover:bg-emerald-600/50 text-white text-xs font-chess tracking-wider uppercase transition-all duration-200"
            >
              <FaWhatsapp className="w-4 h-4 text-emerald-300" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`mailto:${emailAddress}`}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 border border-mint-400/60 bg-[#0f4e45] hover:bg-[#146358] text-white text-xs font-chess tracking-wider uppercase transition-all duration-200"
            >
              <Mail className="w-4 h-4 text-mint-300" />
              <span>Send Email</span>
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================
          SISI KANAN (Mobile: Bottom / Desktop: 58% Right)
          Complete Contact Channels & Official Freelance Profiles
          Background Deep Charcoal Green #010a08 + Monochrome Batik
          ======================================================== */}
      <div className="relative w-full lg:w-[58%] flex-1 bg-[#010a08] px-5 py-6 sm:px-8 lg:px-9 lg:py-6 flex flex-col justify-between overflow-y-auto lg:overflow-y-hidden z-10">
        {/* Monochrome Batik Texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-screen z-0"
          style={{
            backgroundImage: "url('/batik-monochrome.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "280px",
          }}
        />

        {/* Konten Kanan */}
        <div className="relative z-10 flex flex-col justify-between h-full space-y-3.5 lg:space-y-2 pb-20 lg:pb-0">
          {/* Section 1: Header */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase text-mint-300 font-chess border-b border-white/10 pb-1.5 mb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-mint-400" />
                <span>Verified Direct Channels</span>
              </div>
              <span className="text-[10px] text-emerald-300 font-mono font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                100% Verified
              </span>
            </div>

            {/* Direct Channels (Email & Phone/WhatsApp) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Channel 1: Email */}
              <div className="p-3 bg-white/[0.03] border-l-2 border-mint-400 border-y border-r border-white/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-chess font-bold uppercase text-mint-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-mint-400" />
                      Official Email
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1 text-[10px] font-mono text-mint-200/80 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <a
                    href={`mailto:${emailAddress}`}
                    className="text-xs sm:text-[13px] font-mono font-bold text-white hover:text-mint-300 transition-colors break-all"
                  >
                    {emailAddress}
                  </a>
                  <p className="text-[10.5px] text-white/70 mt-1 leading-snug">
                    Primary channel for contracts, project briefs, and technical proposals.
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-chess text-mint-300">
                  <span>Direct Inbox</span>
                  <a
                    href={`mailto:${emailAddress}`}
                    className="inline-flex items-center gap-1 hover:underline"
                  >
                    Compose <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              {/* Channel 2: Phone & WhatsApp */}
              <div className="p-3 bg-white/[0.03] border-l-2 border-emerald-400 border-y border-r border-white/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-chess font-bold uppercase text-emerald-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      Phone &bull; WhatsApp
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      className="inline-flex items-center gap-1 text-[10px] font-mono text-mint-200/80 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedPhone ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-[13px] font-mono font-bold text-white hover:text-emerald-300 transition-colors"
                  >
                    {phoneNumber}{" "}
                    <span className="text-[10px] text-emerald-400 font-normal">
                      ({internationalPhone})
                    </span>
                  </a>
                  <p className="text-[10.5px] text-white/70 mt-1 leading-snug">
                    Instant messaging and voice consultation for fast requirement alignment.
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-chess text-emerald-300">
                  <span>Chat on WhatsApp</span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:underline"
                  >
                    Open Chat <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Official Freelance Platforms (Fastwork & Projects.co.id) */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase text-mint-300 font-chess border-b border-white/10 pb-1.5 mb-2.5">
              <div className="flex items-center gap-2">
                <FaBriefcase className="w-3.5 h-3.5 text-mint-400" />
                <span>Official Freelance Platforms &bull; Escrow Guaranteed</span>
              </div>
              <span className="text-[10px] text-white/50 font-mono">
                Secure Milestones
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Platform 1: Fastwork.id */}
              <div className="p-3 bg-white/[0.03] border-l-2 border-sky-400 border-y border-r border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                      FASTWORK.ID
                    </span>
                    <span className="text-[11px] text-white/80 font-chess font-semibold">
                      Verified Professional Freelancer
                    </span>
                  </div>
                  <p className="text-[11px] text-white/70 leading-snug">
                    Hire via Fastwork with secure milestone payments, official platform contract, and guaranteed delivery protection.
                  </p>
                </div>
                <a
                  href={fastworkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-sky-600/30 hover:bg-sky-600/50 border border-sky-400/50 text-white text-xs font-chess tracking-wider uppercase transition-all shrink-0"
                >
                  <span>Fastwork Profile</span>
                  <ExternalLink className="w-3.5 h-3.5 text-sky-300" />
                </a>
              </div>

              {/* Platform 2: Projects.co.id */}
              <div className="p-3 bg-white/[0.03] border-l-2 border-amber-400 border-y border-r border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      PROJECTS.CO.ID
                    </span>
                    <span className="text-[11px] text-white/80 font-chess font-semibold">
                      El-Razaq Verified Worker Profile
                    </span>
                  </div>
                  <p className="text-[11px] text-white/70 leading-snug">
                    Direct project bidding, contract agreements, and escrow collaboration through Indonesia&apos;s established freelancing network.
                  </p>
                </div>
                <a
                  href={projectsCoIdUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-400/50 text-white text-xs font-chess tracking-wider uppercase transition-all shrink-0"
                >
                  <span>Projects.co.id Profile</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Section 3: Availability & Response Time Assurance Footer */}
          <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10.5px] font-chess text-white/75">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-mint-400 shrink-0" />
              <span>
                Response Time: <strong className="text-mint-300">&lt; 1–2 hours</strong> during active hours (08:00 &ndash; 22:00 WIB).
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full Confidentiality &amp; NDA Friendly</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
