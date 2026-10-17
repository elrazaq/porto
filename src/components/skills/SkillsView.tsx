"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BatikPattern } from "@/components/ui/BatikPattern";
import {
  FaArrowLeft,
  FaShieldHalved,
  FaCode,
  FaNetworkWired,
} from "react-icons/fa6";
import {
  Cpu,
  Layers,
  Activity,
  CheckCircle2,
  Database,
  Smartphone,
  Globe2,
  Server,
  Zap,
  ShieldCheck,
  Code2,
} from "lucide-react";

export type RoleId = "frontend" | "fullstack" | "android" | "it_all";

interface TechDomain {
  id: RoleId;
  name: string;
  specializationTitle: string;
  domainCategory: string;
  readinessTag: string;
  benchmarkScore: string;
  tagline: string;
  borderAccent: string;
  cornerAccent: string;
  glowAccent: string;
  badgeBg: string;
  icon: React.ReactNode;
  metrics: {
    name: string;
    value: number;
    grade: string;
    icon: React.ReactNode;
  }[];
  arsenal: string[];
  coreArchitecture: {
    label: string;
    name: string;
    desc: string;
  };
  keyDeliverable: {
    label: string;
    name: string;
    desc: string;
  };
}

const TECH_DOMAINS: TechDomain[] = [
  {
    id: "frontend",
    name: "Frontend Engineering",
    specializationTitle: "Senior Web & UI Architecture",
    domainCategory: "Modern Web, Reactive State & UI/UX Systems",
    readinessTag: "Core Web Vitals Optimized",
    benchmarkScore: "98% Bench",
    tagline: "Architecting responsive, high-performance web applications with 60fps micro-interactions, robust type safety, and clean modular component trees.",
    borderAccent: "border-emerald-400/90",
    cornerAccent: "border-emerald-300",
    glowAccent: "shadow-[0_0_20px_rgba(52,211,153,0.25)]",
    badgeBg: "bg-emerald-500/15 text-emerald-300 border-emerald-400/40",
    icon: <Globe2 className="w-3.5 h-3.5 text-emerald-400" />,
    metrics: [
      {
        name: "Core Web Vitals & 60fps Rendering",
        value: 98,
        grade: "A+",
        icon: <Zap className="w-3.5 h-3.5 text-emerald-400" />,
      },
      {
        name: "Component State & Modularity",
        value: 95,
        grade: "A+",
        icon: <Layers className="w-3.5 h-3.5 text-emerald-400" />,
      },
      {
        name: "Cross-Device Responsive Geometry",
        value: 96,
        grade: "A+",
        icon: <Activity className="w-3.5 h-3.5 text-emerald-400" />,
      },
      {
        name: "TypeScript Safety & Testing",
        value: 92,
        grade: "A",
        icon: <Code2 className="w-3.5 h-3.5 text-emerald-400" />,
      },
    ],
    arsenal: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "REST & GraphQL",
      "Vite",
      "Zustand",
    ],
    coreArchitecture: {
      label: "Core Methodology",
      name: "Modular Component-Driven Architecture",
      desc: "Strict separation of concerns, optimized React Server Components pipelines, and fine-grained reactive state boundaries.",
    },
    keyDeliverable: {
      label: "Engineering Deliverable",
      name: "High-Velocity Prototyping to Production",
      desc: "Rapid milestone delivery ensuring zero-compromise visual fidelity, accessibility standards, and sub-second interaction latencies.",
    },
  },
  {
    id: "fullstack",
    name: "Full-Stack Web",
    specializationTitle: "Distributed APIs & Cloud Systems",
    domainCategory: "End-to-End Web, Relational Databases & Microservices",
    readinessTag: "High-Throughput Scalability",
    benchmarkScore: "95% Bench",
    tagline: "Bridging intuitive client interfaces with scalable backend microservices, resilient data synchronization, and containerized deployment.",
    borderAccent: "border-sky-400/90",
    cornerAccent: "border-sky-300",
    glowAccent: "shadow-[0_0_20px_rgba(56,189,248,0.25)]",
    badgeBg: "bg-sky-500/15 text-sky-300 border-sky-400/40",
    icon: <Server className="w-3.5 h-3.5 text-sky-400" />,
    metrics: [
      {
        name: "Full-Stack Distributed System Design",
        value: 96,
        grade: "A+",
        icon: <Cpu className="w-3.5 h-3.5 text-sky-400" />,
      },
      {
        name: "API Throughput & Low Latency",
        value: 94,
        grade: "A",
        icon: <Zap className="w-3.5 h-3.5 text-sky-400" />,
      },
      {
        name: "ACID Database Modeling & Indexing",
        value: 95,
        grade: "A+",
        icon: <Database className="w-3.5 h-3.5 text-sky-400" />,
      },
      {
        name: "Security, Auth & Threat Hardening",
        value: 93,
        grade: "A",
        icon: <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />,
      },
    ],
    arsenal: [
      "Next.js App Router",
      "Node.js",
      "Express",
      "PostgreSQL",
      "MySQL",
      "Docker",
      "Prisma ORM",
      "Redis",
    ],
    coreArchitecture: {
      label: "Core Methodology",
      name: "Contract-Driven REST & Service Layer",
      desc: "Deterministic API contracts with strict payload validation, robust middleware boundaries, and scalable data access abstractions.",
    },
    keyDeliverable: {
      label: "Engineering Deliverable",
      name: "Zero-Downtime Schema & Database Migrations",
      desc: "Reliable transactional persistence, connection pooling, and multi-tenant schema isolation ensuring 24/7 continuous uptime.",
    },
  },
  {
    id: "android",
    name: "Native Android",
    specializationTitle: "Kotlin & Jetpack Mobile Architecture",
    domainCategory: "Modern Android SDK, Reactive Flow & Offline-First",
    readinessTag: "99.8% Crash-Free Stability",
    benchmarkScore: "99% Bench",
    tagline: "Developing robust mobile applications with native Kotlin performance, unidirectional state flow, and fault-tolerant local storage.",
    borderAccent: "border-amber-400/90",
    cornerAccent: "border-amber-300",
    glowAccent: "shadow-[0_0_20px_rgba(251,191,36,0.25)]",
    badgeBg: "bg-amber-500/15 text-amber-300 border-amber-400/40",
    icon: <Smartphone className="w-3.5 h-3.5 text-amber-400" />,
    metrics: [
      {
        name: "Native Kotlin Coroutines & Flow",
        value: 98,
        grade: "A+",
        icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
      },
      {
        name: "Jetpack Compose Recomposition Speed",
        value: 96,
        grade: "A+",
        icon: <Activity className="w-3.5 h-3.5 text-amber-400" />,
      },
      {
        name: "Offline-First Persistence (Room DB)",
        value: 99,
        grade: "EX",
        icon: <Database className="w-3.5 h-3.5 text-amber-400" />,
      },
      {
        name: "Crash-Free Runtime Stability (99.8%)",
        value: 99.8,
        grade: "EX",
        icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />,
      },
    ],
    arsenal: [
      "Kotlin",
      "Jetpack Compose",
      "Coroutines & Flow",
      "Room DB",
      "Hilt / Koin DI",
      "Retrofit2",
      "Clean MVVM",
      "WorkManager",
    ],
    coreArchitecture: {
      label: "Core Methodology",
      name: "Clean Architecture & Unidirectional Data Flow",
      desc: "Strict MVVM/MVI implementation separating domain business use-cases from UI state, ensuring modular testability and scalability.",
    },
    keyDeliverable: {
      label: "Engineering Deliverable",
      name: "Hardware-Accelerated 60/120Hz Fluidity",
      desc: "Zero jank UI execution, memory leak prevention, background WorkManager sync, and reliable battery-efficient mobile services.",
    },
  },
  {
    id: "it_all",
    name: "Enterprise IT Systems",
    specializationTitle: "Hospital IT & Infrastructure Architect",
    domainCategory: "Mission-Critical SIMRS, High-Availability Networks & Servers",
    readinessTag: "99.9% Infrastructure Uptime",
    benchmarkScore: "99.9% Bench",
    tagline: "Directing mission-critical hospital IT infrastructure, enterprise SIMRS platforms, high-availability network backbones, and 24/7 reliability.",
    borderAccent: "border-teal-300/90",
    cornerAccent: "border-teal-200",
    glowAccent: "shadow-[0_0_20px_rgba(94,234,212,0.3)]",
    badgeBg: "bg-teal-500/20 text-teal-200 border-teal-300/40",
    icon: <FaNetworkWired className="w-3.5 h-3.5 text-teal-300" />,
    metrics: [
      {
        name: "Mission-Critical System Uptime",
        value: 99.9,
        grade: "EX",
        icon: <Activity className="w-3.5 h-3.5 text-teal-300" />,
      },
      {
        name: "Healthcare SIMRS Integration & Support",
        value: 98,
        grade: "A+",
        icon: <Cpu className="w-3.5 h-3.5 text-teal-300" />,
      },
      {
        name: "Enterprise Network Routing (VLAN/WAN)",
        value: 97,
        grade: "A+",
        icon: <FaNetworkWired className="w-3.5 h-3.5 text-teal-300" />,
      },
      {
        name: "Disaster Recovery & Data Redundancy",
        value: 96,
        grade: "A+",
        icon: <FaShieldHalved className="w-3.5 h-3.5 text-teal-300" />,
      },
    ],
    arsenal: [
      "SIMRS Enterprise",
      "Linux / Windows Server",
      "PostgreSQL / MariaDB",
      "MikroTik / Cisco VLAN",
      "HL7 & Health Protocols",
      "Backup & DR",
      "Hardware Diagnostics",
    ],
    coreArchitecture: {
      label: "Core Methodology",
      name: "High-Availability Redundant Failover Design",
      desc: "Multi-subnet VLAN segregation, automated database replication, and emergency offline fallbacks to safeguard patient data continuity.",
    },
    keyDeliverable: {
      label: "Engineering Deliverable",
      name: "Rapid Incident Triage & 24/7 Diagnostics",
      desc: "Immediate response to critical hardware, server, and network incidents, maintaining uninterrupted clinical operations.",
    },
  },
];

interface SkillsViewProps {
  onBack?: () => void;
}

export function SkillsView({ onBack }: SkillsViewProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<RoleId>("it_all");
  const currentDomain =
    TECH_DOMAINS.find((r) => r.id === selectedRoleId) || TECH_DOMAINS[3];

  return (
    <div className="relative w-full min-h-screen lg:h-screen lg:max-h-screen selection:bg-mint-400 selection:text-neutral-950 flex flex-col lg:flex-row bg-[#010a08]">
      {/* ========================================================
          SISI KIRI (Mobile: Top / Desktop: 44% Left)
          Developer Portrait (As-is nobg with dynamic border)
          Background Forest Green #0a3028 Solid 100% Opaque
          ======================================================== */}
      <div className="relative w-full lg:w-[44%] shrink-0 bg-[#0a3028] px-5 py-5 sm:px-8 lg:px-8 lg:py-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-mint-400/20 overflow-hidden z-10">
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
          {/* Top Bar: Back to Board & Technical Domain Title */}
          <div className="flex items-center justify-between mb-3 lg:mb-0">
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
              <Cpu className="w-3.5 h-3.5 text-mint-400" />
              <span>Technical Domains &bull; Grid 07</span>
            </div>
          </div>

          {/* Center: Original Developer Photo with Background Removed (Only Border changes) */}
          <div className="my-auto py-2 flex flex-col items-center text-center">
            {/* Foto Developer Asli (Background Dihapus, Hanya Border yang Berubah) */}
            <div
              className={`relative w-44 h-44 sm:w-56 sm:h-56 lg:w-48 lg:h-48 border-2 bg-[#06241e] p-1.5 mb-3 group transition-all duration-300 ${currentDomain.borderAccent} ${currentDomain.glowAccent}`}
            >
              <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[#0a3028] to-[#041a15]">
                <Image
                  src="/porto-nobg.png"
                  alt="Developer Portrait"
                  fill
                  priority
                  className="object-contain object-bottom transition-transform duration-300 group-hover:scale-103"
                />
              </div>

              {/* Dynamic Corner Accents */}
              <div
                className={`absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 transition-colors duration-300 ${currentDomain.cornerAccent}`}
              />
              <div
                className={`absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 transition-colors duration-300 ${currentDomain.cornerAccent}`}
              />
              <div
                className={`absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 transition-colors duration-300 ${currentDomain.cornerAccent}`}
              />
              <div
                className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 transition-colors duration-300 ${currentDomain.cornerAccent}`}
              />

              {/* Status Badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap flex items-center gap-1.5 px-3 py-0.5 border border-mint-400/40 bg-black/90 shadow-md text-[10px] sm:text-[11px] font-chess font-bold tracking-wider uppercase">
                {currentDomain.icon}
                <span className="text-white">{currentDomain.readinessTag}</span>
                <span className="text-mint-300 font-mono">[{currentDomain.benchmarkScore}]</span>
              </div>
            </div>

            {/* Specialization Title & Domain */}
            <div className="mt-3">
              <h2 className="text-lg sm:text-xl font-black text-white font-chess tracking-wider uppercase">
                {currentDomain.name}
              </h2>
              <div className="text-xs text-mint-300 font-semibold font-chess mt-0.5">
                {currentDomain.specializationTitle}
              </div>
              <p className="text-[11px] italic text-white/70 max-w-xs mx-auto mt-1 leading-snug">
                &ldquo;{currentDomain.tagline}&rdquo;
              </p>
            </div>
          </div>

          {/* Domain Switcher Tabs */}
          <div className="pt-2 border-t border-mint-400/20">
            <div className="text-[10px] font-chess uppercase tracking-widest text-mint-300/80 mb-1.5 text-center">
              Select Technical Discipline:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {TECH_DOMAINS.map((domain) => {
                const isSelected = domain.id === selectedRoleId;
                return (
                  <button
                    key={domain.id}
                    type="button"
                    onClick={() => setSelectedRoleId(domain.id)}
                    className={`py-1.5 px-2 border text-center transition-all duration-150 cursor-pointer select-none ${
                      isSelected
                        ? "border-mint-300 bg-mint-400/25 text-white font-bold"
                        : "border-mint-400/25 bg-black/30 hover:bg-black/50 text-mint-200/80 text-[10px]"
                    }`}
                  >
                    <div className="text-[10.5px] font-chess leading-tight truncate">
                      {domain.name}
                    </div>
                    <div className="text-[9px] font-mono text-mint-300/70 truncate">
                      {domain.benchmarkScore}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          SISI KANAN (Mobile: Bottom / Desktop: 56% Right)
          Technical Competencies, Architecture & Deliverables
          Background Deep Charcoal #010a08 + Monochrome Batik
          ======================================================== */}
      <div className="relative w-full lg:w-[56%] flex-1 bg-[#010a08] px-5 py-5 sm:px-8 lg:px-9 lg:py-5 flex flex-col justify-between overflow-y-auto lg:overflow-y-hidden z-10">
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
        <div className="relative z-10 flex flex-col justify-between h-full space-y-3 lg:space-y-1.5 pb-20 lg:pb-0">
          {/* Section 1: Technical Competencies & Quality Metrics */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase text-mint-300 font-chess border-b border-white/10 pb-1 mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-mint-400" />
                <span>Technical Competencies &amp; Quality Metrics</span>
              </div>
              <span className="text-[10px] text-white/50 font-mono font-normal">
                Audited Metrics
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentDomain.metrics.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-white/[0.03] border-l-2 border-mint-400/80 border-y border-r border-white/5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-chess font-semibold text-white/90 truncate text-[11px]">
                      {stat.icon}
                      <span className="truncate">{stat.name}</span>
                    </span>
                    <span className="font-mono text-mint-300 text-[11px] font-bold shrink-0 ml-1">
                      {stat.value}% [{stat.grade}]
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/10 h-1 mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-mint-400 transition-all duration-500 ease-out"
                      style={{ width: `${Math.min(stat.value, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Architecture Methodology & Key Deliverable */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase text-mint-300 font-chess border-b border-white/10 pb-1 mb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-mint-400" />
                <span>Core Architecture &amp; Deliverables</span>
              </div>
              <span className="text-[10px] text-mint-200/70 font-mono font-normal">
                Domain Specific
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Architecture Methodology Card */}
              <div className="p-2 bg-white/[0.03] border-l-2 border-mint-400/70 border-y border-r border-white/5">
                <div className="flex items-center gap-1.5 text-[10px] text-mint-300 font-mono font-bold uppercase">
                  <ShieldCheck className="w-3 h-3 text-mint-400 shrink-0" />
                  <span>{currentDomain.coreArchitecture.label}:</span>
                  <span className="text-white font-chess truncate">
                    {currentDomain.coreArchitecture.name}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[10.5px] text-white/70 mt-0.5 leading-snug">
                  {currentDomain.coreArchitecture.desc}
                </p>
              </div>

              {/* Engineering Deliverable Card */}
              <div className="p-2 bg-white/[0.03] border-l-2 border-sky-400/70 border-y border-r border-white/5">
                <div className="flex items-center gap-1.5 text-[10px] text-sky-300 font-mono font-bold uppercase">
                  <Cpu className="w-3 h-3 text-sky-400 shrink-0" />
                  <span>{currentDomain.keyDeliverable.label}:</span>
                  <span className="text-white font-chess truncate">
                    {currentDomain.keyDeliverable.name}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[10.5px] text-white/70 mt-0.5 leading-snug">
                  {currentDomain.keyDeliverable.desc}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Tech Arsenal & Production Tooling */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-mint-300 font-chess border-b border-white/10 pb-1 mb-1.5">
              <FaCode className="w-3.5 h-3.5 text-mint-400" />
              <span>Primary Tech Stack &amp; Production Tooling</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {currentDomain.arsenal.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/[0.04] border border-mint-400/30 text-mint-200 text-[10px] sm:text-[10.5px] font-chess font-semibold hover:border-mint-300 transition-colors"
                >
                  <CheckCircle2 className="w-3 h-3 text-mint-400" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Footer Bar: Professional Guarantee & Direct CTA */}
          <div className="pt-1.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[10px] font-chess text-white/70">
            <span className="inline-flex items-center gap-1.5 text-mint-300/90">
              <ShieldCheck className="w-3.5 h-3.5 text-mint-400 shrink-0" />
              <span>
                Backed by 8+ years of production delivery across web, native Android, and enterprise hospital IT.
              </span>
            </span>
            <Link
              href="/hire"
              className="inline-flex items-center justify-center px-3.5 py-1.5 bg-[#0f4e45] hover:bg-[#146358] border border-mint-400/50 text-white font-bold tracking-wider uppercase transition-all shrink-0 cursor-pointer"
            >
              Hire For This Domain
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
