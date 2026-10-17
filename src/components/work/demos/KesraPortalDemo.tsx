"use client";

import React, { useState } from "react";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  DollarSign,
  Building2,
  Users,
} from "lucide-react";

interface GrantProposal {
  id: string;
  applicant: string;
  category: "Pendidikan & Beasiswa" | "Rumah Ibadah" | "Bantuan Sosial";
  regency: string;
  amount: string;
  status: "Pending Review" | "Verified" | "Disbursed" | "Revision Needed";
  submittedDate: string;
}

export function KesraPortalDemo() {
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [proposals, setProposals] = useState<GrantProposal[]>([
    {
      id: "KSR-2024-081",
      applicant: "Yayasan Pendidikan Al-Hidayah",
      category: "Pendidikan & Beasiswa",
      regency: "Kabupaten Bintan",
      amount: "Rp 35.000.000",
      status: "Pending Review",
      submittedDate: "12 Okt 2026",
    },
    {
      id: "KSR-2024-079",
      applicant: "Masjid Raya Baiturrahman",
      category: "Rumah Ibadah",
      regency: "Kota Tanjungpinang",
      amount: "Rp 50.000.000",
      status: "Verified",
      submittedDate: "10 Okt 2026",
    },
    {
      id: "KSR-2024-077",
      applicant: "Kelompok Tani Pesisir Mandiri",
      category: "Bantuan Sosial",
      regency: "Kabupaten Karimun",
      amount: "Rp 25.000.000",
      status: "Disbursed",
      submittedDate: "05 Okt 2026",
    },
    {
      id: "KSR-2024-082",
      applicant: "Panti Asuhan Kasih Bunda",
      category: "Bantuan Sosial",
      regency: "Kota Batam",
      amount: "Rp 30.000.000",
      status: "Pending Review",
      submittedDate: "14 Okt 2026",
    },
    {
      id: "KSR-2024-075",
      applicant: "Vihara Dharma Loka",
      category: "Rumah Ibadah",
      regency: "Kabupaten Lingga",
      amount: "Rp 40.000.000",
      status: "Verified",
      submittedDate: "02 Okt 2026",
    },
  ]);

  const handleAction = (id: string, newStatus: "Verified" | "Disbursed") => {
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const filtered = proposals.filter((p) => {
    if (filterCategory === "All") return true;
    return p.category === filterCategory;
  });

  const verifiedTotal = proposals.filter((p) => p.status === "Verified").length;
  const disbursedTotal = proposals.filter((p) => p.status === "Disbursed").length;
  const pendingTotal = proposals.filter((p) => p.status === "Pending Review").length;

  return (
    <div className="w-full h-full flex flex-col bg-[#031713] text-white select-none text-xs font-sans">
      {/* Top Header */}
      <div className="bg-[#020e0b] border-b border-mint-400/20 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-mint-400" />
          <span className="font-mono font-bold text-mint-300 text-[11px]">
            BIRO KESRA KEPRI &bull; E-GRANT MONITORING PORTAL
          </span>
          <span className="text-[9px] px-1.5 py-0.2 bg-mint-400/20 text-mint-200 border border-mint-400/30 font-mono">
            APBD PROVINSI
          </span>
        </div>

        <span className="text-[10px] font-mono text-mint-300/80">
          Status Anggaran: 74% Terverifikasi
        </span>
      </div>

      {/* Stats Summary Bar */}
      <div className="bg-[#06241e] border-b border-white/10 px-3 py-2 grid grid-cols-3 gap-2">
        <div className="p-1.5 bg-black/30 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-chess uppercase text-amber-300 block">
              Menunggu Review
            </span>
            <span className="text-base font-black font-mono text-amber-300">
              {pendingTotal} Proposal
            </span>
          </div>
          <Clock className="w-4 h-4 text-amber-400/50" />
        </div>

        <div className="p-1.5 bg-black/30 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-chess uppercase text-mint-300 block">
              Terverifikasi
            </span>
            <span className="text-base font-black font-mono text-mint-200">
              {verifiedTotal} Proposal
            </span>
          </div>
          <CheckCircle2 className="w-4 h-4 text-mint-400/50" />
        </div>

        <div className="p-1.5 bg-black/30 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-chess uppercase text-emerald-300 block">
              Tercairkan
            </span>
            <span className="text-base font-black font-mono text-emerald-300">
              {disbursedTotal} Bantuan
            </span>
          </div>
          <DollarSign className="w-4 h-4 text-emerald-400/50" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-[#031713] border-b border-white/10 px-3 py-1.5 flex items-center gap-1.5">
        <span className="text-[10px] text-white/50 font-chess uppercase mr-1">
          Kategori:
        </span>
        {["All", "Pendidikan & Beasiswa", "Rumah Ibadah", "Bantuan Sosial"].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilterCategory(cat)}
            className={`px-2 py-0.5 text-[10px] font-chess uppercase tracking-wide border transition-all cursor-pointer ${
              filterCategory === cat
                ? "bg-mint-400/20 border-mint-300 text-white font-bold"
                : "bg-black/30 border-white/10 text-white/60 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table of Proposals */}
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="border border-white/10 overflow-hidden">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-[#020e0b] text-[10px] font-chess text-mint-300 uppercase">
              <tr>
                <th className="p-2">No. Berkas</th>
                <th className="p-2">Pemohon / Instansi</th>
                <th className="p-2">Wilayah</th>
                <th className="p-2">Nominal Usulan</th>
                <th className="p-2">Status</th>
                <th className="p-2 text-right">Aksi Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-black/20 font-sans">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02]">
                  <td className="p-2 font-mono font-bold text-mint-200">{item.id}</td>
                  <td className="p-2">
                    <div className="font-semibold text-white">{item.applicant}</div>
                    <div className="text-[10px] text-white/50">{item.category}</div>
                  </td>
                  <td className="p-2 text-white/70">{item.regency}</td>
                  <td className="p-2 font-mono font-bold text-amber-200">
                    {item.amount}
                  </td>
                  <td className="p-2 font-mono text-[10px]">
                    <span
                      className={`px-1.5 py-0.5 rounded-xs font-bold ${
                        item.status === "Verified"
                          ? "bg-mint-500/20 text-mint-300"
                          : item.status === "Disbursed"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-2 text-right space-x-1">
                    {item.status === "Pending Review" && (
                      <button
                        type="button"
                        onClick={() => handleAction(item.id, "Verified")}
                        className="px-2 py-0.5 bg-[#0f4e45] hover:bg-[#146358] border border-mint-400 text-white font-chess text-[10px] uppercase cursor-pointer"
                      >
                        Verifikasi
                      </button>
                    )}
                    {item.status === "Verified" && (
                      <button
                        type="button"
                        onClick={() => handleAction(item.id, "Disbursed")}
                        className="px-2 py-0.5 bg-emerald-700/60 hover:bg-emerald-600 border border-emerald-400 text-white font-chess text-[10px] uppercase cursor-pointer"
                      >
                        Cairkan
                      </button>
                    )}
                    {item.status === "Disbursed" && (
                      <span className="text-[10px] text-emerald-400 font-mono">
                        Selesai
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#020e0b] border-t border-white/10 px-3 py-1.5 flex items-center justify-between text-[10px] font-mono text-white/50">
        <span>Pengembangan Sistem Informasi Biro Kesra Kepri (2021&ndash;2025)</span>
        <span className="text-mint-300">Sample Records Simulated On Local Server</span>
      </div>
    </div>
  );
}
