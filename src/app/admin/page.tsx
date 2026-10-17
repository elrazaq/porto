"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BatikPattern } from "@/components/ui/BatikPattern";
import { FaChessKing, FaArrowLeft, FaShieldHalved, FaWhatsapp } from "react-icons/fa6";
import {
  Lock,
  Mail,
  Send,
  Check,
  CheckCircle2,
  Clock,
  Trash2,
  RefreshCw,
  LogOut,
  ExternalLink,
  MessageSquare,
  Layers,
  DollarSign,
  AlertCircle,
  Copy,
  ChevronDown,
} from "lucide-react";
import type { Proposal } from "@/lib/proposals";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoadingProposals, setIsLoadingProposals] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "unread" | "replied">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/check");
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
      if (data.authenticated) {
        fetchProposals();
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const fetchProposals = async () => {
    setIsLoadingProposals(true);
    try {
      const res = await fetch("/api/proposals");
      const data = await res.json();
      if (res.ok && data.proposals) {
        setProposals(data.proposals);
      }
    } catch (err) {
      console.error("Failed to fetch proposals:", err);
    } finally {
      setIsLoadingProposals(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Password salah");
      }

      setIsAuthenticated(true);
      setPassword("");
      fetchProposals();
    } catch (err: any) {
      setLoginError(err.message || "Gagal masuk.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setIsAuthenticated(false);
      setProposals([]);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: "unread" | "replied") => {
    try {
      const res = await fetch(`/api/proposals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setProposals((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus pengajuan proyek "${title}"?`)) return;

    try {
      const res = await fetch(`/api/proposals/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProposals((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete proposal:", err);
    }
  };

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredProposals = proposals.filter((p) => {
    if (filterStatus === "unread") return p.status === "unread";
    if (filterStatus === "replied") return p.status === "replied";
    return true;
  });

  const unreadCount = proposals.filter((p) => p.status === "unread").length;
  const repliedCount = proposals.filter((p) => p.status === "replied").length;

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#010a08] flex items-center justify-center text-mint-300 font-chess text-xs">
        <span>Memeriksa Akses Royal Vault...</span>
      </div>
    );
  }

  // View 1: Login Gate
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-[#010a08] flex items-center justify-center p-4 selection:bg-mint-400 selection:text-neutral-950">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-screen"
          style={{
            backgroundImage: "url('/batik-monochrome.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "280px",
          }}
        />

        <div className="relative z-10 w-full max-w-md bg-[#0a3028] border-2 border-mint-400 p-6 sm:p-8 shadow-2xl text-white">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-mint-400/30">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-mint-200 hover:text-white font-chess uppercase"
            >
              <FaArrowLeft className="w-3.5 h-3.5 text-mint-400" />
              <span>Back to Board</span>
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-chess uppercase">
              <FaChessKing className="w-4 h-4" />
              <span>Owner Vault</span>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-full bg-mint-400/10 border border-mint-400/40 flex items-center justify-center mb-3">
              <Lock className="w-6 h-6 text-mint-300" />
            </div>
            <h2 className="text-lg font-black font-chess tracking-wider uppercase">
              Private Project Vault
            </h2>
            <p className="text-xs text-mint-200/80 mt-1 font-chess">
              Area khusus developer untuk membaca dan menindaklanjuti pengajuan proyek klien.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-950/70 border border-rose-500/50 flex items-center gap-2 text-xs text-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-chess font-semibold uppercase tracking-wider text-mint-300 mb-1.5">
                Master Password / PIN Akses
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Masukkan password admin..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-black/60 border border-mint-400/40 focus:border-mint-300 focus:outline-none text-white text-xs font-mono placeholder:text-white/30"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 bg-[#0f4e45] hover:bg-[#146358] border border-mint-400 text-white font-chess font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <Lock className="w-3.5 h-3.5 text-mint-300" />
              <span>{isLoggingIn ? "Membuka Vault..." : "Buka Proposal Masuk"}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // View 2: Authenticated Dashboard
  return (
    <div className="relative min-h-screen bg-[#010a08] text-white selection:bg-mint-400 selection:text-neutral-950 pb-16">
      {/* Background Batik */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.05] mix-blend-screen z-0"
        style={{
          backgroundImage: "url('/batik-monochrome.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "280px",
        }}
      />

      {/* Top Navbar */}
      <header className="relative z-10 w-full bg-[#0a3028] border-b border-mint-400/20 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-mint-300 hover:text-white font-chess uppercase transition-colors"
          >
            <FaArrowLeft className="w-3.5 h-3.5 text-mint-400" />
            <span>Papan Utama</span>
          </Link>
          <span className="text-mint-400/30">|</span>
          <div className="flex items-center gap-2 font-chess">
            <FaChessKing className="w-4 h-4 text-amber-300" />
            <h1 className="text-sm sm:text-base font-black tracking-wider uppercase text-white">
              Royal Vault &bull; Project Inquiries
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchProposals}
            disabled={isLoadingProposals}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/40 hover:bg-black/60 border border-mint-400/40 text-mint-200 text-xs font-chess uppercase transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProposals ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/50 text-rose-200 text-xs font-chess uppercase transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* Statistics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 bg-[#0a3028] border-l-4 border-mint-400 border-y border-r border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-chess uppercase text-mint-300 font-bold tracking-wider">
                Total Proposal Masuk
              </span>
              <div className="text-2xl font-black font-mono mt-0.5 text-white">
                {proposals.length}
              </div>
            </div>
            <Layers className="w-6 h-6 text-mint-400/50" />
          </div>

          <div className="p-3.5 bg-[#0a3028] border-l-4 border-amber-400 border-y border-r border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-chess uppercase text-amber-300 font-bold tracking-wider">
                Belum Dibalas (Unread)
              </span>
              <div className="text-2xl font-black font-mono mt-0.5 text-amber-300">
                {unreadCount}
              </div>
            </div>
            <Clock className="w-6 h-6 text-amber-400/50" />
          </div>

          <div className="p-3.5 bg-[#0a3028] border-l-4 border-emerald-400 border-y border-r border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-chess uppercase text-emerald-300 font-bold tracking-wider">
                Sudah Dibalas (Replied)
              </span>
              <div className="text-2xl font-black font-mono mt-0.5 text-emerald-300">
                {repliedCount}
              </div>
            </div>
            <CheckCircle2 className="w-6 h-6 text-emerald-400/50" />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 text-xs font-chess uppercase tracking-wider border transition-all ${
                filterStatus === "all"
                  ? "bg-mint-400/20 border-mint-300 text-white font-bold"
                  : "bg-black/30 border-white/10 text-white/60 hover:text-white"
              }`}
            >
              Semua ({proposals.length})
            </button>
            <button
              onClick={() => setFilterStatus("unread")}
              className={`px-3 py-1.5 text-xs font-chess uppercase tracking-wider border transition-all ${
                filterStatus === "unread"
                  ? "bg-amber-400/20 border-amber-300 text-amber-300 font-bold"
                  : "bg-black/30 border-white/10 text-white/60 hover:text-white"
              }`}
            >
              Belum Dibalas ({unreadCount})
            </button>
            <button
              onClick={() => setFilterStatus("replied")}
              className={`px-3 py-1.5 text-xs font-chess uppercase tracking-wider border transition-all ${
                filterStatus === "replied"
                  ? "bg-emerald-400/20 border-emerald-300 text-emerald-300 font-bold"
                  : "bg-black/30 border-white/10 text-white/60 hover:text-white"
              }`}
            >
              Sudah Dibalas ({repliedCount})
            </button>
          </div>

          <span className="text-[11px] text-white/50 font-chess hidden sm:inline">
            Klik tombol &quot;Balas via Email&quot; untuk langsung membuka draft email
          </span>
        </div>

        {/* Proposals List */}
        {filteredProposals.length === 0 ? (
          <div className="p-12 text-center bg-[#0a3028]/40 border border-white/10">
            <FaChessKing className="w-10 h-10 text-mint-400/40 mx-auto mb-3" />
            <p className="text-sm font-chess text-white/80">
              {filterStatus === "all"
                ? "Belum ada pengajuan proyek yang masuk."
                : filterStatus === "unread"
                ? "Hebat! Semua proposal sudah Anda balas."
                : "Belum ada proposal dengan status sudah dibalas."}
            </p>
            <p className="text-xs text-white/40 mt-1 font-chess">
              Formulir publik tersedia di halaman Hire Me (/hire).
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProposals.map((item) => {
              const formattedDate = new Date(item.createdAt).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              // Pre-fill email reply parameters
              const emailSubject = encodeURIComponent(
                `Re: Pengajuan Proyek: ${item.title} - El-Razaq Software Engineering`
              );
              const emailBody = encodeURIComponent(
                `Halo ${item.name},\n\nTerima kasih telah mengajukan proposal proyek "${item.title}" melalui portfolio saya.\n\nSaya telah mempelajari rincian kebutuhan Anda:\n- Kategori: ${item.category}\n- Perkiraan Anggaran: ${item.budget || "Sesuai diskusi"}\n\n[Tuliskan tanggapan, pertanyaan lanjutan, atau tawaran jadwal meeting teknis di sini...]\n\nSalam hormat,\nEl-Razaq\nFull Stack Web & Native Android Developer\n0821-6944-1179`
              );
              const mailtoUrl = `mailto:${item.email}?subject=${emailSubject}&body=${emailBody}`;

              // WhatsApp direct link if phone present
              let cleanPhone = item.phone?.replace(/[^0-9]/g, "");
              if (cleanPhone?.startsWith("0")) {
                cleanPhone = "62" + cleanPhone.slice(1);
              }
              const waUrl = cleanPhone
                ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Halo ${item.name}, saya El-Razaq dari Software Engineering. Menanggapi proposal proyek "${item.title}" yang Anda ajukan...`
                  )}`
                : null;

              return (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 bg-[#0a3028]/70 border-2 transition-all ${
                    item.status === "unread"
                      ? "border-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.1)]"
                      : "border-mint-400/40"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded-sm border ${
                            item.status === "unread"
                              ? "bg-amber-500/20 text-amber-300 border-amber-400/50 animate-pulse"
                              : "bg-emerald-500/20 text-emerald-300 border-emerald-400/50"
                          }`}
                        >
                          {item.status === "unread" ? "BELUM DIBALAS" : "SUDAH DIBALAS"}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-black/40 text-mint-200 border border-mint-400/30 font-chess">
                          {item.category}
                        </span>
                        {item.budget && (
                          <span className="text-[10px] px-2 py-0.5 bg-black/40 text-amber-200 border border-amber-400/30 font-chess">
                            Budget: {item.budget}
                          </span>
                        )}
                      </div>
                      <h2 className="text-base sm:text-lg font-black text-white font-chess mt-1.5 tracking-wide">
                        {item.title}
                      </h2>
                    </div>

                    <div className="text-[11px] font-mono text-mint-200/70 sm:text-right shrink-0">
                      <Clock className="w-3 h-3 inline mr-1 text-mint-400" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  {/* Client Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3 p-3 bg-black/40 border border-white/5 text-xs font-chess">
                    <div>
                      <span className="text-mint-300 text-[10px] uppercase block">
                        Klien / Instansi:
                      </span>
                      <strong className="text-white text-sm">{item.name}</strong>
                    </div>

                    <div>
                      <span className="text-mint-300 text-[10px] uppercase block">
                        Email Kontak:
                      </span>
                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${item.email}`}
                          className="text-white hover:text-mint-300 underline font-mono text-xs"
                        >
                          {item.email}
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCopyEmail(item.email, item.id)}
                          className="text-[10px] text-mint-300 hover:text-white inline-flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {item.phone && (
                      <div className="sm:col-span-2 pt-1 border-t border-white/5 flex items-center justify-between">
                        <div>
                          <span className="text-mint-300 text-[10px] uppercase mr-2">
                            WhatsApp:
                          </span>
                          <span className="text-white font-mono">{item.phone}</span>
                        </div>
                        {waUrl && (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-emerald-300 hover:underline"
                          >
                            <FaWhatsapp className="w-3 h-3" />
                            <span>Chat WhatsApp Langsung</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Proposal Description */}
                  <div className="my-3">
                    <span className="text-[10.5px] font-chess uppercase tracking-wider text-mint-300 font-bold block mb-1">
                      Deskripsi Kebutuhan &amp; Spesifikasi:
                    </span>
                    <div className="p-3 bg-black/30 border border-white/5 text-xs text-white/90 leading-relaxed font-sans whitespace-pre-wrap">
                      {item.description}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
                    {/* Primary Reply Button */}
                    <a
                      href={mailtoUrl}
                      onClick={() => handleStatusChange(item.id, "replied")}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f4e45] hover:bg-[#146358] border border-mint-400 text-white text-xs font-chess font-bold tracking-wider uppercase transition-all shadow-md group cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-mint-300 group-hover:scale-110 transition-transform" />
                      <span>Balas via Email Sekarang</span>
                      <ExternalLink className="w-3 h-3 text-mint-300/80" />
                    </a>

                    <div className="flex items-center gap-2">
                      {/* Mark Status Toggle */}
                      {item.status === "unread" ? (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(item.id, "replied")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/40 hover:bg-black/60 border border-emerald-400/50 text-emerald-300 text-xs font-chess uppercase transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Tandai Sudah Dibalas</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(item.id, "unread")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/40 hover:bg-black/60 border border-amber-400/50 text-amber-300 text-xs font-chess uppercase transition-all cursor-pointer"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Tandai Belum Dibalas</span>
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.title)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-chess uppercase transition-all cursor-pointer"
                        title="Hapus proposal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
