"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BatikPattern } from "@/components/ui/BatikPattern";
import { FaArrowLeft, FaShieldHalved, FaBriefcase } from "react-icons/fa6";
import {
  Send,
  CheckCircle2,
  Clock,
  Layers,
  DollarSign,
  AlertCircle,
  Loader2,
  Lock,
  ShieldCheck,
  FileText,
} from "lucide-react";

interface HireViewProps {
  onBack?: () => void;
}

const CATEGORIES = [
  "Full Stack Web",
  "Native Android (Kotlin)",
  "Healthcare / SIMRS IT",
  "API & Cloud Architecture",
  "Custom Enterprise Solution",
];

const BUDGET_OPTIONS = [
  "< $500 / Rp 5M",
  "$500 – $1,500 / Rp 5M–15M",
  "$1,500 – $3,500 / Rp 15M–35M",
  "> $3,500 / Enterprise",
  "To Be Discussed",
];

export function HireView({ onBack }: HireViewProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Full Stack Web");
  const [budget, setBudget] = useState("To Be Discussed");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Full name or organization name is required.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("A valid work email address is required.");
      return;
    }
    if (!title.trim()) {
      setErrorMsg("Project title is required.");
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setErrorMsg("Please provide a project description with at least 10 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          title,
          category,
          budget,
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit project proposal.");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(
        err.message || "An unexpected error occurred while submitting. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setTitle("");
    setCategory("Full Stack Web");
    setBudget("To Be Discussed");
    setDescription("");
    setIsSuccess(false);
    setErrorMsg(null);
  };

  return (
    <div className="relative w-full min-h-screen lg:h-screen lg:max-h-screen selection:bg-mint-400 selection:text-neutral-950 flex flex-col lg:flex-row bg-[#010a08]">
      {/* ========================================================
          SISI KIRI (Mobile: Top / Desktop: 40% Left)
          Professional Partnership & Engineering Philosophy
          Background Forest Green #0a3028 Solid 100% Opaque
          ======================================================== */}
      <div className="relative w-full lg:w-[40%] shrink-0 bg-[#0a3028] px-5 py-6 sm:px-8 lg:px-8 lg:py-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-mint-400/20 overflow-hidden z-10">
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
          {/* Top Bar: Back to Board & Project Engagement Badge */}
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
              <FaBriefcase className="w-3.5 h-3.5 text-mint-400" />
              <span>Project Engagement &bull; Grid 11</span>
            </div>
          </div>

          {/* Center: Developer Portrait & Clean Professional Branding */}
          <div className="my-auto py-4 sm:py-6 lg:py-2 flex flex-col items-center text-center">
            {/* Foto Developer (Sharp 90-degree Border, Flat Regal Frame) */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 lg:w-40 lg:h-40 border-2 border-mint-400/60 bg-[#06241e] p-1.5 shadow-none mb-3.5 group">
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

            {/* Clean Title Without Emojis / Stickers */}
            <h1 className="text-xl sm:text-2xl font-black text-white font-chess tracking-wider uppercase">
              Hire Me
            </h1>
            <p className="text-xs sm:text-sm text-mint-200 font-semibold mt-1 font-chess tracking-wide">
              Full Stack Web &amp; Native Android Engineering
            </p>

            {/* Philosophy Block */}
            <div className="mt-3 p-3 bg-[#05241e]/80 border-l-2 border-mint-400 max-w-sm text-left">
              <p className="text-xs italic text-mint-100 font-chess leading-relaxed">
                &ldquo;Mutual respect, decisive execution, and high architectural standards. Partnering to build resilient, high-impact digital systems.&rdquo;
              </p>
            </div>

            {/* Professional Standard Guarantees */}
            <div className="mt-3 grid grid-cols-2 gap-2 w-full max-w-sm text-[11px] font-chess text-mint-200/90">
              <div className="flex items-center gap-1.5 p-1.5 bg-black/20 border border-white/5">
                <FaShieldHalved className="w-3 h-3 text-mint-400 shrink-0" />
                <span>NDA &amp; IP Protection</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 bg-black/20 border border-white/5">
                <Clock className="w-3 h-3 text-mint-400 shrink-0" />
                <span>&lt; 2h Response SLA</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-3 border-t border-mint-400/20 flex items-center justify-between text-[10px] font-chess text-mint-300/80">
            <span>Direct Technical Proposal</span>
            <span>Encrypted &amp; Confidential</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          SISI KANAN (Mobile: Bottom / Desktop: 60% Right)
          Interactive Project Proposal Form (100% English)
          Background Deep Charcoal Green #010a08 + Monochrome Batik
          ======================================================== */}
      <div className="relative w-full lg:w-[60%] flex-1 bg-[#010a08] px-5 py-6 sm:px-8 lg:px-10 lg:py-6 flex flex-col justify-between overflow-y-auto z-10">
        {/* Monochrome Batik Texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-screen z-0"
          style={{
            backgroundImage: "url('/batik-monochrome.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "280px",
          }}
        />

        {/* Form Container */}
        <div className="relative z-10 flex flex-col justify-between h-full space-y-4 pb-16 lg:pb-0">
          <div>
            <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase text-mint-300 font-chess border-b border-white/10 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-mint-400" />
                <span>Project Proposal &bull; Request Form</span>
              </div>
              <span className="text-[10px] text-white/50 font-mono">
                Direct to Developer Inbox
              </span>
            </div>

            {isSuccess ? (
              /* Success Confirmation Card (100% English) */
              <div className="p-6 bg-[#0a3028]/90 border-2 border-mint-400 text-center animate-in fade-in duration-300 my-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-mint-400/20 border border-mint-300 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6 text-mint-300" />
                </div>
                <h3 className="text-lg font-black text-white font-chess tracking-wider uppercase">
                  Project Proposal Received!
                </h3>
                <p className="text-xs sm:text-sm text-mint-100 font-chess mt-2 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{name}</strong>. Your project proposal for &ldquo;<strong>{title}</strong>&rdquo; has been successfully logged.
                </p>
                <div className="mt-4 p-3 bg-black/40 border border-white/10 max-w-md mx-auto text-left text-xs font-chess text-white/80 space-y-1">
                  <div>
                    <span className="text-mint-300">Reply Process:</span> I will review your technical specifications and respond directly to <strong className="text-white underline">{email}</strong> within 1&ndash;2 business hours.
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/6282169441179?text=${encodeURIComponent(
                      `Hello Abdul Razak, I just submitted a project proposal on your portfolio:\n\n• Name/Org: ${name}\n• Email: ${email}\n• Project: ${title}\n• Category: ${category}\n• Budget: ${budget}\n• Details: ${description}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-emerald-400 bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-chess font-bold tracking-wider uppercase transition-all cursor-pointer"
                  >
                    Fast-Track via WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 border border-mint-400 bg-[#0f4e45] hover:bg-[#146358] text-white text-xs font-chess font-bold tracking-wider uppercase transition-all cursor-pointer"
                  >
                    Submit Another Proposal
                  </button>
                  {onBack ? (
                    <button
                      type="button"
                      onClick={onBack}
                      className="px-4 py-2 border border-white/20 bg-black/40 hover:bg-black/60 text-white text-xs font-chess tracking-wider uppercase transition-all cursor-pointer"
                    >
                      Back to Board
                    </button>
                  ) : (
                    <Link
                      href="/"
                      className="px-4 py-2 border border-white/20 bg-black/40 hover:bg-black/60 text-white text-xs font-chess tracking-wider uppercase transition-all"
                    >
                      Back to Board
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              /* Proposal Form (100% English) */
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {errorMsg && (
                  <div className="p-3 bg-rose-950/60 border border-rose-500/50 flex items-center gap-2 text-xs text-rose-200">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-chess font-semibold uppercase tracking-wider text-mint-300 mb-1">
                      Full Name / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan / Acme Corporation"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-mint-400/30 focus:border-mint-300 focus:outline-none text-white text-xs font-sans placeholder:text-white/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-chess font-semibold uppercase tracking-wider text-mint-300 mb-1">
                      Work Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-mint-400/30 focus:border-mint-300 focus:outline-none text-white text-xs font-sans placeholder:text-white/30"
                    />
                  </div>
                </div>

                {/* Row 2: WhatsApp & Project Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-chess font-semibold uppercase tracking-wider text-mint-300 mb-1">
                      WhatsApp / Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +62 812-xxxx-xxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-mint-400/30 focus:border-mint-300 focus:outline-none text-white text-xs font-sans placeholder:text-white/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-chess font-semibold uppercase tracking-wider text-mint-300 mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Enterprise Android Fleet Tracking & Admin Web Dashboard"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-mint-400/30 focus:border-mint-300 focus:outline-none text-white text-xs font-sans placeholder:text-white/30"
                    />
                  </div>
                </div>

                {/* Row 3: Category Selection */}
                <div>
                  <label className="block text-[11px] font-chess font-semibold uppercase tracking-wider text-mint-300 mb-1.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-mint-400" />
                    <span>Technical Domain / Solution Stack</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-2.5 py-1 text-[10.5px] font-chess tracking-wider uppercase transition-all border cursor-pointer ${
                          category === cat
                            ? "bg-mint-400/20 border-mint-300 text-white font-bold"
                            : "bg-black/40 border-white/10 text-white/70 hover:border-white/30"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 4: Budget Range */}
                <div>
                  <label className="block text-[11px] font-chess font-semibold uppercase tracking-wider text-mint-300 mb-1.5 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-mint-400" />
                    <span>Estimated Budget Range</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {BUDGET_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setBudget(opt)}
                        className={`px-2.5 py-1 text-[10.5px] font-chess tracking-wider transition-all border cursor-pointer ${
                          budget === opt
                            ? "bg-emerald-400/20 border-emerald-300 text-emerald-200 font-bold"
                            : "bg-black/40 border-white/10 text-white/70 hover:border-white/30"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 5: Description */}
                <div>
                  <label className="block text-[11px] font-chess font-semibold uppercase tracking-wider text-mint-300 mb-1">
                    Project Scope &amp; Technical Specifications *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe the system architecture, core user flows, target milestones, timeline, or third-party integrations needed..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-mint-400/30 focus:border-mint-300 focus:outline-none text-white text-xs font-sans placeholder:text-white/30 leading-relaxed resize-y"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10">
                  <div className="flex items-center gap-1.5 text-[10px] font-chess text-white/60">
                    <ShieldCheck className="w-3.5 h-3.5 text-mint-400" />
                    <span>Data stored securely &bull; Direct confidential communication via verified email</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0f4e45] hover:bg-[#146358] active:scale-95 disabled:opacity-50 border border-mint-400 text-white text-xs font-chess font-bold tracking-wider uppercase transition-all cursor-pointer shadow-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-mint-300" />
                        <span>Submitting Proposal...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-mint-300" />
                        <span>Submit Project Proposal</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
