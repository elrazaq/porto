"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  Lock,
  Activity,
  FileCode2,
  Users,
  Clock,
  Award,
  BarChart3,
  UserPlus,
  Loader2,
  Building2,
  ChevronRight,
  KeyRound,
  Terminal,
  RefreshCw,
  X,
} from "lucide-react";
import {
  INITIAL_CANDIDATES,
  DEMO_WALLET_PROFILES,
  INITIAL_AUDIT_EVENTS,
  MEDVOTE_CONTRACT_ADDRESS,
  MEDVOTE_NETWORK_NAME,
  MEDVOTE_CHAIN_ID,
  MEDVOTE_EXPLORER_URL,
  MEDVOTE_ABI_SUMMARY,
  MedVoteCandidate,
  DoctorWalletProfile,
  OnChainAuditEvent,
} from "@/data/medvoteContract";

interface MedVoteAppProps {
  deviceMode?: "desktop" | "mobile";
}

type ActiveTab = "voting" | "leaderboard" | "admin" | "contract";

export function MedVoteApp({ deviceMode = "desktop" }: MedVoteAppProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("voting");
  const [candidates, setCandidates] = useState<MedVoteCandidate[]>(INITIAL_CANDIDATES);
  const [walletProfiles, setWalletProfiles] =
    useState<DoctorWalletProfile[]>(DEMO_WALLET_PROFILES);
  const [selectedProfileIdx, setSelectedProfileIdx] = useState<number>(0);
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(true);
  const [isElectionActive, setIsElectionActive] = useState<boolean>(true);
  const [auditEvents, setAuditEvents] = useState<OnChainAuditEvent[]>(INITIAL_AUDIT_EVENTS);
  const [currentBlock, setCurrentBlock] = useState<number>(14892345);

  // Transaction Mining Modal State
  const [txStage, setTxStage] = useState<
    "idle" | "signing" | "broadcasting" | "mining" | "confirmed"
  >("idle");
  const [pendingCandidate, setPendingCandidate] = useState<MedVoteCandidate | null>(null);
  const [latestTxHash, setLatestTxHash] = useState<string>("");
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Admin Form State
  const [batchWhitelistInput, setBatchWhitelistInput] = useState<string>(
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906\n0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"
  );
  const [newCandName, setNewCandName] = useState<string>("");
  const [newCandSpec, setNewCandSpec] = useState<string>("");
  const [newCandDept, setNewCandDept] = useState<string>("");
  const [newCandVision, setNewCandVision] = useState<string>("");
  const [adminSuccessMsg, setAdminSuccessMsg] = useState<string | null>(null);

  // Explorer Inspector Modal State
  const [inspectedEvent, setInspectedEvent] = useState<OnChainAuditEvent | null>(null);

  const currentWallet = walletProfiles[selectedProfileIdx];

  const totalVotes = useMemo(
    () => candidates.reduce((acc, item) => acc + item.voteCount, 0),
    [candidates]
  );

  const totalWhitelistedDoctors = useMemo(() => {
    const baseWhitelisted = 125;
    const extraWhitelisted = walletProfiles.filter((w) => w.isWhitelisted).length - 2;
    return baseWhitelisted + Math.max(0, extraWhitelisted);
  }, [walletProfiles]);

  const sortedLeaderboard = useMemo(
    () => [...candidates].sort((a, b) => b.voteCount - a.voteCount),
    [candidates]
  );

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const generateRandomHex = (len: number) => {
    const chars = "0123456789abcdef";
    let out = "0x";
    for (let i = 0; i < len; i++) {
      out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
  };

  // Connect real MetaMask if user wants, or toggle simulated wallet
  const handleConnectBrowserWallet = async () => {
    setErrorBanner(null);
    if (typeof window !== "undefined" && (window as unknown as { ethereum?: { request: (args: { method: string }) => Promise<string[]> } }).ethereum) {
      try {
        const eth = (window as unknown as { ethereum: { request: (args: { method: string }) => Promise<string[]> } }).ethereum;
        const accounts = await eth.request({ method: "eth_requestAccounts" });
        if (accounts && accounts[0]) {
          const addr = accounts[0];
          const existingIdx = walletProfiles.findIndex(
            (w) => w.address.toLowerCase() === addr.toLowerCase()
          );
          if (existingIdx >= 0) {
            setSelectedProfileIdx(existingIdx);
          } else {
            const customProfile: DoctorWalletProfile = {
              address: addr,
              name: "dr. Abdul Razak, S.T. (MetaMask Connected)",
              department: "KSM Terverifikasi Web3 Browser Wallet",
              role: "voter",
              isWhitelisted: true,
              hasVoted: false,
              votedCandidateId: null,
            };
            setWalletProfiles((prev) => [...prev, customProfile]);
            setSelectedProfileIdx(walletProfiles.length);
          }
          setIsWalletConnected(true);
          return;
        }
      } catch {
        // Fallback to simulated connect
      }
    }
    setIsWalletConnected(true);
  };

  // Cast Vote Handler with Smart Contract Validation
  const handleCastVote = (candidate: MedVoteCandidate) => {
    setErrorBanner(null);

    if (!isWalletConnected) {
      setErrorBanner(
        "WalletNotConnected: Harap hubungkan wallet dokter Anda terlebih dahulu pada pojok kanan atas."
      );
      return;
    }

    if (!isElectionActive) {
      setErrorBanner(
        "Smart Contract Revert — ElectionNotActive(): Periode pemungutan suara sedang ditutup oleh Panitia Pemilihan."
      );
      return;
    }

    if (!currentWallet.isWhitelisted) {
      setErrorBanner(
        `Smart Contract Revert — VoterNotWhitelisted(): Alamat wallet ${currentWallet.address.slice(
          0,
          8
        )}... belum terdaftar pada Daftar Pemilih Tetap (DPT) Komite Medik. Silakan buka tab "Panel Admin Panitia" untuk melakukan Whitelist.`
      );
      return;
    }

    if (currentWallet.hasVoted) {
      setErrorBanner(
        `Smart Contract Revert — VoterAlreadyVoted(): Identitas wallet ini sudah menggunakan hak suara (1 Dokter = 1 Suara Mutlak).`
      );
      return;
    }

    setPendingCandidate(candidate);
    setTxStage("signing");

    // Step 1 -> Step 2: Signing to Broadcasting
    setTimeout(() => {
      setTxStage("broadcasting");
    }, 900);

    // Step 2 -> Step 3: Broadcasting to Block Mining
    setTimeout(() => {
      setTxStage("mining");
    }, 1900);

    // Step 3 -> Confirmed On-Chain
    setTimeout(() => {
      const txHash = generateRandomHex(64);
      const newBlock = currentBlock + 1;
      setCurrentBlock(newBlock);
      setLatestTxHash(txHash);

      // Update candidate vote count
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidate.id ? { ...c, voteCount: c.voteCount + 1 } : c
        )
      );

      // Update voter status
      setWalletProfiles((prev) =>
        prev.map((w, idx) =>
          idx === selectedProfileIdx
            ? {
                ...w,
                hasVoted: true,
                votedCandidateId: candidate.id,
                txHash,
              }
            : w
        )
      );

      // Emit VoteCast Event to Audit Log
      const newEvent: OnChainAuditEvent = {
        txHash,
        blockNumber: newBlock,
        eventName: "VoteCast",
        voterOrActor: `${currentWallet.address.slice(0, 6)}...${currentWallet.address.slice(
          -4
        )}`,
        voterLabel: `${currentWallet.name} (Terverifikasi)`,
        candidateId: candidate.id,
        candidateName: candidate.name,
        timestamp: "Baru saja (Real-time)",
        gasUsed: "46,204",
      };

      setAuditEvents((prev) => [newEvent, ...prev]);
      setTxStage("confirmed");
    }, 3100);
  };

  // Admin: Batch Whitelist Voters
  const handleBatchWhitelist = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminSuccessMsg(null);
    setErrorBanner(null);

    const lines = batchWhitelistInput
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter((s) => s.startsWith("0x") && s.length >= 10);

    if (lines.length === 0) {
      setErrorBanner("EmptyBatchList(): Masukkan minimal 1 alamat wallet EVM yang valid (0x...).");
      return;
    }

    const txHash = generateRandomHex(64);
    const newBlock = currentBlock + 1;
    setCurrentBlock(newBlock);

    // Update any matching demo profiles to whitelisted
    setWalletProfiles((prev) =>
      prev.map((w) => {
        const matched = lines.some(
          (addr) => addr.toLowerCase() === w.address.toLowerCase()
        );
        if (matched) {
          return {
            ...w,
            isWhitelisted: true,
            department: "Terdaftar via Batch Whitelist Panitia",
          };
        }
        return w;
      })
    );

    const newEvent: OnChainAuditEvent = {
      txHash,
      blockNumber: newBlock,
      eventName: "VotersWhitelisted",
      voterOrActor: `${currentWallet.address.slice(0, 6)}...${currentWallet.address.slice(-4)}`,
      voterLabel: `Batch Whitelist (${lines.length} Wallet Dokter Baru)`,
      timestamp: "Baru saja",
      gasUsed: `${52400 + lines.length * 22100}`,
    };

    setAuditEvents((prev) => [newEvent, ...prev]);
    setAdminSuccessMsg(
      `Transaksi whitelistVotersBatch() berhasil dikonfirmasi di Blok #${newBlock}! ${lines.length} alamat wallet dokter kini berstatus WHITELISTED.`
    );
  };

  // Admin: Add New Candidate
  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminSuccessMsg(null);
    setErrorBanner(null);

    if (!newCandName.trim() || !newCandSpec.trim()) {
      setErrorBanner("EmptyCandidateName(): Nama lengkap dokter dan spesialisasi wajib diisi.");
      return;
    }

    const newId = candidates.length;
    const newCandidate: MedVoteCandidate = {
      id: newId,
      number: String(newId + 1).padStart(2, "0"),
      name: newCandName.trim(),
      specialist: newCandSpec.trim(),
      department: newCandDept.trim() || "KSM Spesialis Terpadu",
      nip: `19830519 201001 1 00${newId + 5}`,
      experience: "12 Tahun Pengabdian Klinis",
      visionMission:
        newCandVision.trim() ||
        "Peningkatan mutu pelayanan medis, tata kelola komite medik yang akuntabel, dan kolaborasi klinis modern.",
      programs: [
        "Transparansi kredensialing dan audit medis berkala berbasis data",
        "Pengembangan kompetensi berkelanjutan bagi staf medis fungsional",
      ],
      avatarUrl:
        "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
      voteCount: 0,
    };

    const txHash = generateRandomHex(64);
    const newBlock = currentBlock + 1;
    setCurrentBlock(newBlock);

    setCandidates((prev) => [...prev, newCandidate]);
    setAuditEvents((prev) => [
      {
        txHash,
        blockNumber: newBlock,
        eventName: "CandidateAdded",
        voterOrActor: `${currentWallet.address.slice(0, 6)}...${currentWallet.address.slice(-4)}`,
        voterLabel: `Kandidat #${newCandidate.number}: ${newCandidate.name}`,
        candidateId: newId,
        candidateName: newCandidate.name,
        timestamp: "Baru saja",
        gasUsed: "118,450",
      },
      ...prev,
    ]);

    setNewCandName("");
    setNewCandSpec("");
    setNewCandDept("");
    setNewCandVision("");
    setAdminSuccessMsg(
      `Kandidat "${newCandidate.name}" berhasil ditambahkan ke Smart Contract pada Blok #${newBlock}.`
    );
  };

  const isMobileViewport = deviceMode === "mobile";

  return (
    <div className="w-full h-full bg-[#0b1120] text-slate-100 flex flex-col overflow-y-auto selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* =====================================================================
          1. TOP NAVBAR: Hospital Brand, Network Indicator & Doctor Wallet
         ===================================================================== */}
      <header className="sticky top-0 z-30 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-5 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  MedVote<span className="text-emerald-400">.RSUD</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30 rounded">
                  Web3 E-Voting
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">
                Komite Medik RSUD &bull; Tamper-Proof Smart Contract
              </p>
            </div>
          </div>

          {/* Right Controls: Polygon Network & Wallet Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Polygon Amoy Network Pill */}
            {!isMobileViewport && (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/80 text-[10.5px] font-mono text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{MEDVOTE_NETWORK_NAME}</span>
                <span className="text-slate-500">|</span>
                <span className="text-emerald-400">#{currentBlock}</span>
              </div>
            )}

            {/* Demo Persona Switcher (Allows testing Voter, Admin, and Unwhitelisted Doctor) */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-md px-2 py-1">
              <KeyRound className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <select
                aria-label="Pilih Simulasi Wallet Dokter"
                value={selectedProfileIdx}
                onChange={(e) => {
                  setSelectedProfileIdx(Number(e.target.value));
                  setIsWalletConnected(true);
                  setErrorBanner(null);
                  setAdminSuccessMsg(null);
                }}
                className="bg-transparent text-[11px] font-medium text-slate-200 focus:outline-none cursor-pointer max-w-[165px] sm:max-w-[230px] truncate"
              >
                {walletProfiles.map((prof, idx) => (
                  <option key={prof.address} value={idx} className="bg-slate-900 text-slate-100">
                    {prof.role === "admin"
                      ? "[ADMIN] "
                      : prof.isWhitelisted
                      ? "[WHITELISTED] "
                      : "[UNREGISTERED] "}
                    {prof.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Connect / Connected Wallet Badge */}
            <button
              type="button"
              onClick={handleConnectBrowserWallet}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-mono font-bold border transition-all cursor-pointer ${
                isWalletConnected
                  ? currentWallet.isWhitelisted
                    ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/25"
                    : "bg-amber-500/15 border-amber-500/50 text-amber-300 hover:bg-amber-500/25"
                  : "bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-slate-950"
              }`}
              title="Klik untuk sinkronisasi MetaMask atau gunakan Wallet Simulator"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>
                {isWalletConnected
                  ? `${currentWallet.address.slice(0, 6)}...${currentWallet.address.slice(-4)}`
                  : "Connect Wallet"}
              </span>
            </button>
          </div>
        </div>

        {/* Connected Doctor Identity Bar */}
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400">Identitas Kredensial:</span>
            <span className="font-semibold text-white">{currentWallet.name}</span>
            <span className="text-slate-500 hidden sm:inline">&bull;</span>
            <span className="text-slate-400 text-[10.5px] hidden sm:inline">
              {currentWallet.department}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentWallet.isWhitelisted ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>DPT TERVERIFIKASI</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-semibold">
                <AlertTriangle className="w-3 h-3" />
                <span>BELUM WHITELIST</span>
              </span>
            )}

            {currentWallet.hasVoted && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30 text-[10px] font-mono font-semibold">
                <Lock className="w-3 h-3" />
                <span>SUDAH MEMILIH (1/1)</span>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* =====================================================================
          2. HERO & PUBLIC BLOCKCHAIN AUDIT BANNER
         ===================================================================== */}
      <section className="px-3 sm:px-5 pt-3">
        <div className="rounded-xl bg-gradient-to-br from-slate-900 via-[#0f1d35] to-slate-900 border border-slate-800 p-3.5 sm:p-4 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    isElectionActive
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}
                >
                  <Activity className="w-3 h-3" />
                  <span>{isElectionActive ? "ELECTION ACTIVE" : "ELECTION PAUSED"}</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Periode Masa Bakti 2026 &ndash; 2029
                </span>
              </div>

              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                Pemilihan Ketua Komite Medik RSUD &mdash; E-Voting Blockchain
              </h1>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Setiap suara dienkripsi dan dicatat langsung ke Smart Contract Polygon. Tidak dapat
                diubah atau dihapus oleh pihak mana pun (termasuk Admin IT maupun Direksi) serta
                dapat diaudit secara publik secara real-time.
              </p>
            </div>

            {/* Live Audit Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 shrink-0">
              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 text-center">
                <div className="text-[10px] font-mono uppercase text-slate-400">Total Suara</div>
                <div className="text-base sm:text-lg font-extrabold text-emerald-400 font-mono">
                  {totalVotes}
                </div>
                <div className="text-[9.5px] text-slate-500">On-Chain Verified</div>
              </div>
              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 text-center">
                <div className="text-[10px] font-mono uppercase text-slate-400">DPT Dokter</div>
                <div className="text-base sm:text-lg font-extrabold text-white font-mono">
                  {totalWhitelistedDoctors}
                </div>
                <div className="text-[9.5px] text-slate-500">1 Wallet = 1 Vote</div>
              </div>
              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 text-center">
                <div className="text-[10px] font-mono uppercase text-slate-400">Partisipasi</div>
                <div className="text-base sm:text-lg font-extrabold text-teal-400 font-mono">
                  {Math.min(100, Math.round((totalVotes / totalWhitelistedDoctors) * 100))}%
                </div>
                <div className="text-[9.5px] text-slate-500">Quorum Sah</div>
              </div>
            </div>
          </div>

          {/* Contract Address & Polygonscan Verification Bar */}
          <div className="mt-3 pt-2.5 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-slate-400 shrink-0">Smart Contract:</span>
              <code className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-300 truncate">
                {MEDVOTE_CONTRACT_ADDRESS}
              </code>
              <button
                type="button"
                onClick={() => handleCopy(MEDVOTE_CONTRACT_ADDRESS, "contract")}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer shrink-0"
                title="Salin Alamat Smart Contract"
              >
                {copiedText === "contract" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("contract")}
                className="inline-flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Inspect Solidity Source</span>
              </button>
              <a
                href={MEDVOTE_EXPLORER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                <span>Polygonscan Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. NAVIGATION TABS
         ===================================================================== */}
      <div className="px-3 sm:px-5 pt-3">
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("voting")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "voting"
                ? "bg-emerald-500 text-slate-950 shadow-sm"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Bilik Suara Kandidat ({candidates.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("leaderboard")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "leaderboard"
                ? "bg-emerald-500 text-slate-950 shadow-sm"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Live Leaderboard &amp; Audit Log</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("admin")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "admin"
                ? "bg-emerald-500 text-slate-950 shadow-sm"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Panel Admin Panitia (Whitelist)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("contract")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "contract"
                ? "bg-emerald-500 text-slate-950 shadow-sm"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Smart Contract (MedVote.sol)</span>
          </button>
        </div>
      </div>

      {/* Error / Revert Alert Banner */}
      {errorBanner && (
        <div className="px-3 sm:px-5 pt-3">
          <div className="bg-rose-950/70 border border-rose-500/50 rounded-lg p-3 flex items-start justify-between gap-3 text-xs text-rose-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-rose-300 font-mono">
                  EVM Smart Contract Revert Terdeteksi
                </div>
                <p className="mt-0.5 leading-relaxed">{errorBanner}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setErrorBanner(null)}
              className="text-rose-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. TAB CONTENT AREA
         ===================================================================== */}
      <main className="flex-1 px-3 sm:px-5 py-3">
        {/* -----------------------------------------------------------------
            TAB 1: BILIK SUARA KANDIDAT (VOTING BOOTH)
           ----------------------------------------------------------------- */}
        {activeTab === "voting" && (
          <div className="space-y-3">
            {/* Voter Status Notice if already voted */}
            {currentWallet.hasVoted && (
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Suara Anda untuk{" "}
                    <strong className="text-white">
                      {candidates.find((c) => c.id === currentWallet.votedCandidateId)?.name}
                    </strong>{" "}
                    telah tercatat permanen di Blockchain.
                  </span>
                </div>
                {currentWallet.txHash && (
                  <span className="font-mono text-[10.5px] text-emerald-300 bg-slate-950 px-2 py-0.5 rounded border border-emerald-500/30">
                    Tx: {currentWallet.txHash.slice(0, 14)}...
                  </span>
                )}
              </div>
            )}

            {/* Candidate Grid */}
            <div
              className={`grid gap-3.5 ${
                isMobileViewport ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
              }`}
            >
              {candidates.map((cand) => {
                const percentage =
                  totalVotes > 0 ? Math.round((cand.voteCount / totalVotes) * 100) : 0;
                const isChosenByCurrent = currentWallet.votedCandidateId === cand.id;

                return (
                  <div
                    key={cand.id}
                    className={`rounded-xl bg-slate-900/90 border transition-all flex flex-col justify-between overflow-hidden ${
                      isChosenByCurrent
                        ? "border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.18)]"
                        : "border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      {/* Card Top Header */}
                      <div className="relative h-36 bg-slate-950 overflow-hidden">
                        <img
                          src={cand.avatarUrl}
                          alt={cand.name}
                          className="w-full h-full object-cover object-top opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

                        {/* Candidate Number Badge */}
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-slate-950/85 backdrop-blur-xs border border-slate-700 font-mono text-xs font-extrabold text-emerald-400">
                          KANDIDAT #{cand.number}
                        </div>

                        {/* Real-time Vote Pill */}
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-slate-950/85 backdrop-blur-xs border border-emerald-500/40 font-mono text-xs font-bold text-white flex items-center gap-1">
                          <span className="text-emerald-400">{cand.voteCount}</span>
                          <span className="text-[10px] text-slate-300">Suara ({percentage}%)</span>
                        </div>

                        {/* Department tag */}
                        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-semibold">
                            {cand.department}
                          </span>
                          <span className="text-[10px] font-mono text-slate-300">
                            {cand.experience}
                          </span>
                        </div>
                      </div>

                      {/* Doctor Info & Vision */}
                      <div className="p-3.5 space-y-2.5">
                        <div>
                          <h3 className="font-bold text-sm text-white leading-snug">{cand.name}</h3>
                          <p className="text-[11px] text-emerald-400/90 font-medium mt-0.5">
                            {cand.specialist}
                          </p>
                          <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                            NIP: {cand.nip}
                          </p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                          <div className="text-[10px] font-mono uppercase text-slate-400 mb-1">
                            Visi &amp; Misi Utama:
                          </div>
                          <p className="text-[11.5px] text-slate-300 leading-relaxed">
                            &ldquo;{cand.visionMission}&rdquo;
                          </p>
                        </div>

                        {/* Key Programs */}
                        <div className="space-y-1">
                          <div className="text-[10px] font-mono uppercase text-slate-400">
                            Program Prioritas:
                          </div>
                          <ul className="space-y-1">
                            {cand.programs.map((prog, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-1.5 text-[11px] text-slate-300 leading-snug"
                              >
                                <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{prog}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Vote Action Footer */}
                    <div className="p-3.5 pt-0 space-y-2">
                      {/* Mini Progress Bar */}
                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <button
                        type="button"
                        disabled={currentWallet.hasVoted}
                        onClick={() => handleCastVote(cand)}
                        className={`w-full py-2.5 px-3 rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                          isChosenByCurrent
                            ? "bg-emerald-500/20 border border-emerald-400 text-emerald-300 cursor-default"
                            : currentWallet.hasVoted
                            ? "bg-slate-800/70 border border-slate-700 text-slate-500 cursor-not-allowed"
                            : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md cursor-pointer"
                        }`}
                      >
                        {isChosenByCurrent ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Pilihan Anda (Tercatat On-Chain)</span>
                          </>
                        ) : currentWallet.hasVoted ? (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Hak Suara Telah Digunakan</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Cast Vote &bull; Kandidat #{cand.number}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------
            TAB 2: LIVE LEADERBOARD & REAL-TIME AUDIT LOG
           ----------------------------------------------------------------- */}
        {activeTab === "leaderboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Real-Time Percentage Chart */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <span>Real-Time On-Chain Leaderboard</span>
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Data diambil langsung dari fungsi <code className="text-emerald-300">getResults()</code>
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono text-[10px] font-bold">
                  {totalVotes} SUARA SAH
                </span>
              </div>

              <div className="space-y-3">
                {sortedLeaderboard.map((cand, rankIdx) => {
                  const pct =
                    totalVotes > 0 ? ((cand.voteCount / totalVotes) * 100).toFixed(1) : "0.0";
                  return (
                    <div
                      key={cand.id}
                      className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-6 h-6 rounded-full font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                              rankIdx === 0
                                ? "bg-emerald-500 text-slate-950"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            #{rankIdx + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">{cand.name}</div>
                            <div className="text-[10px] text-slate-400">{cand.department}</div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-sm font-extrabold font-mono text-emerald-400">
                            {pct}%
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {cand.voteCount} suara
                          </div>
                        </div>
                      </div>

                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            rankIdx === 0
                              ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                              : "bg-slate-600"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Immutable Blockchain Event Log */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Public Blockchain Audit Trail (Event Logs)</span>
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Setiap transaksi meninggalkan jejak kriptografi yang dapat diverifikasi publik
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Chain ID: {MEDVOTE_CHAIN_ID}
                </span>
              </div>

              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {auditEvents.map((ev, i) => (
                  <div
                    key={ev.txHash + i}
                    onClick={() => setInspectedEvent(ev)}
                    className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold ${
                            ev.eventName === "VoteCast"
                              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                              : "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                          }`}
                        >
                          {ev.eventName}
                        </span>
                        <span className="font-mono text-[11px] text-slate-300 truncate">
                          Tx: {ev.txHash.slice(0, 18)}...
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-300">
                        <span className="text-slate-400">Actor:</span>{" "}
                        <span className="font-mono text-white">{ev.voterOrActor}</span>{" "}
                        {ev.voterLabel && (
                          <span className="text-emerald-400/90">&bull; {ev.voterLabel}</span>
                        )}
                      </div>

                      {ev.candidateName && (
                        <div className="text-[11px] text-slate-400">
                          Pilihan Terenkripsi:{" "}
                          <span className="text-slate-200 font-semibold">{ev.candidateName}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-left sm:text-right font-mono text-[10px] text-slate-400 shrink-0 space-y-0.5">
                      <div className="text-emerald-400 font-semibold">Block #{ev.blockNumber}</div>
                      <div>Gas: {ev.gasUsed}</div>
                      <div className="flex items-center sm:justify-end gap-1 text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{ev.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------
            TAB 3: PANEL ADMIN PANITIA (WHITELIST & CANDIDATE MANAGEMENT)
           ----------------------------------------------------------------- */}
        {activeTab === "admin" && (
          <div className="space-y-3">
            {adminSuccessMsg && (
              <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-lg p-3 flex items-center justify-between gap-2 text-xs text-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{adminSuccessMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminSuccessMsg(null)}
                  className="text-emerald-300 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left: Batch Whitelist Doctor Wallets */}
              <form
                onSubmit={handleBatchWhitelist}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span>Batch Whitelist Wallet Dokter (DPT)</span>
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Fungsi Smart Contract: <code className="text-emerald-300">whitelistVotersBatch(address[])</code>
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-mono text-[10px] font-bold">
                    onlyAdmin
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Daftar Alamat Wallet Ethereum/Polygon Dokter (1 Baris = 1 Dokter):
                  </label>
                  <textarea
                    rows={4}
                    value={batchWhitelistInput}
                    onChange={(e) => setBatchWhitelistInput(e.target.value)}
                    placeholder="0x90F79bf6EB2c4f870365E785982E1f101E93b906"
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10.5px] text-slate-400">
                    Tip Demo: Alamat pertama di atas (<code className="text-slate-200">0x90F7...b906</code>) adalah milik{" "}
                    <strong>dr. Kevin Pratama (Belum Whitelist)</strong>. Klik tombol di bawah untuk
                    mengotorisasi hak suaranya!
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setBatchWhitelistInput((prev) =>
                        `${prev}\n${generateRandomHex(40)}`.trim()
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>+ Generate Sample Wallet</span>
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold uppercase cursor-pointer shadow-md"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Execute Whitelist On-Chain</span>
                  </button>
                </div>

                {/* Election Status Switcher */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Status Bilik Suara (Smart Contract)</div>
                    <div className="text-[10.5px] text-slate-400">
                      Panitia dapat membekukan sementara atau membuka kembali pemilihan
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsElectionActive((prev) => !prev)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border cursor-pointer transition-colors ${
                      isElectionActive
                        ? "bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25"
                        : "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25"
                    }`}
                  >
                    {isElectionActive ? "Pause Election" : "Resume Election"}
                  </button>
                </div>
              </form>

              {/* Right: Add Candidate Form */}
              <form
                onSubmit={handleAddCandidate}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <span>Daftarkan Kandidat Ketua Komite Medik</span>
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Fungsi Smart Contract: <code className="text-emerald-300">addCandidate(...)</code>
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-mono text-[10px] font-bold">
                    onlyAdmin
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Nama Lengkap &amp; Gelar Dokter *
                    </label>
                    <input
                      type="text"
                      value={newCandName}
                      onChange={(e) => setNewCandName(e.target.value)}
                      placeholder="dr. Lukman Hakim, Sp.OG(K)"
                      className="w-full rounded-lg bg-slate-950 border border-slate-700 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Spesialisasi Medis *
                    </label>
                    <input
                      type="text"
                      value={newCandSpec}
                      onChange={(e) => setNewCandSpec(e.target.value)}
                      placeholder="Spesialis Obstetri & Ginekologi"
                      className="w-full rounded-lg bg-slate-950 border border-slate-700 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    KSM / Departemen Rumah Sakit
                  </label>
                  <input
                    type="text"
                    value={newCandDept}
                    onChange={(e) => setNewCandDept(e.target.value)}
                    placeholder="KSM Kebidanan & Kandungan"
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Ringkasan Visi &amp; Misi Kandidat
                  </label>
                  <textarea
                    rows={2}
                    value={newCandVision}
                    onChange={(e) => setNewCandVision(e.target.value)}
                    placeholder="Penguatan mutu pelayanan maternal-perinatal dan transparansi komite medik..."
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold uppercase cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Deploy Kandidat Baru ke Smart Contract</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------
            TAB 4: SMART CONTRACT & ABI INSPECTOR
           ----------------------------------------------------------------- */}
        {activeTab === "contract" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <FileCode2 className="w-4 h-4 text-emerald-400" />
                    <span>contracts/MedVote.sol (Solidity ^0.8.20)</span>
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Gas-Optimized dengan Custom Errors &amp; Unchecked Arithmetic
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono text-[10px]">
                  Verified Contract
                </span>
              </div>

              <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-[340px] leading-relaxed">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MedVote {
    error UnauthorizedAdmin();
    error ElectionNotActive();
    error VoterNotWhitelisted();
    error VoterAlreadyVoted();

    struct Candidate {
        uint256 id;
        string name;
        string specialist;
        string visionMission;
        string avatarUrl;
        uint256 voteCount;
    }

    struct VoterInfo {
        bool isWhitelisted;
        bool hasVoted;
        uint256 votedCandidateId;
        uint256 votedTimestamp;
    }

    address public immutable electionAdmin;
    bool public isElectionActive;
    uint256 public totalVotesCast;
    Candidate[] private candidates;
    mapping(address => VoterInfo) public voters;

    event VoteCast(address indexed voter, uint256 indexed candidateId, uint256 timestamp);
    event VotersWhitelisted(uint256 count, address indexed addedBy);

    function vote(uint256 _candidateId) external {
        if (!isElectionActive) revert ElectionNotActive();
        VoterInfo storage sender = voters[msg.sender];
        if (!sender.isWhitelisted) revert VoterNotWhitelisted();
        if (sender.hasVoted) revert VoterAlreadyVoted();

        sender.hasVoted = true;
        sender.votedCandidateId = _candidateId;
        sender.votedTimestamp = block.timestamp;

        unchecked {
            candidates[_candidateId].voteCount += 1;
            totalVotesCast += 1;
        }
        emit VoteCast(msg.sender, _candidateId, block.timestamp);
    }

    function getResults() external view returns (Candidate[] memory) {
        return candidates;
    }
}`}
              </pre>
            </div>

            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h2 className="text-sm font-bold text-white">Contract ABI Specification</h2>
                  <p className="text-[11px] text-slate-400">
                    Digunakan oleh Wagmi / Viem / Thirdweb SDK di Next.js
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(JSON.stringify(MEDVOTE_ABI_SUMMARY, null, 2), "abi")
                  }
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  {copiedText === "abi" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy ABI</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10.5px] text-slate-300 overflow-x-auto max-h-[340px]">
                {JSON.stringify(MEDVOTE_ABI_SUMMARY, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* =====================================================================
          5. BLOCKCHAIN TRANSACTION MINING MODAL (UX FEEDBACK)
         ===================================================================== */}
      {txStage !== "idle" && pendingCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-emerald-500/40 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm text-white">
                  {txStage === "confirmed"
                    ? "Suara Terverifikasi di Blockchain!"
                    : "Memproses Transaksi Smart Contract..."}
                </span>
              </div>
              {txStage === "confirmed" && (
                <button
                  type="button"
                  onClick={() => setTxStage("idle")}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Candidate Target Summary */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-3">
              <img
                src={pendingCandidate.avatarUrl}
                alt={pendingCandidate.name}
                className="w-11 h-11 rounded-lg object-cover shrink-0"
              />
              <div className="min-w-0">
                <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                  Kandidat #{pendingCandidate.number}
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {pendingCandidate.name}
                </div>
                <div className="text-[10.5px] text-slate-400 truncate">
                  {pendingCandidate.department}
                </div>
              </div>
            </div>

            {/* Step-by-Step Blockchain Progress */}
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center gap-2.5">
                {txStage === "signing" ? (
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <span className={txStage === "signing" ? "text-white font-bold" : "text-slate-400"}>
                  1. Tanda Tangan Kriptografi Wallet ({currentWallet.address.slice(0, 8)}...)
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {txStage === "broadcasting" ? (
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
                ) : txStage === "mining" || txStage === "confirmed" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-700 inline-block shrink-0" />
                )}
                <span
                  className={
                    txStage === "broadcasting" ? "text-white font-bold" : "text-slate-400"
                  }
                >
                  2. Broadcast vote({pendingCandidate.id}) ke Polygon Amoy RPC
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {txStage === "mining" ? (
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
                ) : txStage === "confirmed" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-700 inline-block shrink-0" />
                )}
                <span className={txStage === "mining" ? "text-white font-bold" : "text-slate-400"}>
                  3. Konfirmasi Blok &amp; Emit Event VoteCast
                </span>
              </div>
            </div>

            {/* Confirmed Receipt */}
            {txStage === "confirmed" && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 space-y-1.5 font-mono text-[11px]">
                <div className="text-emerald-300 font-bold">BUKTI AUDIT ON-CHAIN:</div>
                <div className="text-slate-300 break-all">
                  <span className="text-slate-400">Tx Hash:</span> {latestTxHash}
                </div>
                <div className="flex items-center justify-between text-slate-300 pt-1">
                  <span>Block: #{currentBlock}</span>
                  <span>Gas Used: 46,204</span>
                </div>
              </div>
            )}

            {txStage === "confirmed" && (
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setTxStage("idle");
                    setActiveTab("leaderboard");
                  }}
                  className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold uppercase cursor-pointer"
                >
                  Lihat Live Leaderboard
                </button>
                <button
                  type="button"
                  onClick={() => setTxStage("idle")}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          6. BLOCKCHAIN EVENT INSPECTOR MODAL
         ===================================================================== */}
      {inspectedEvent && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setInspectedEvent(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl bg-slate-900 border border-slate-700 p-4 space-y-3 font-mono text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-emerald-400">
                Polygon Amoy Block Explorer &bull; Event Log
              </span>
              <button
                type="button"
                onClick={() => setInspectedEvent(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div>
                <span className="text-slate-400">Event Name:</span>{" "}
                <span className="text-white font-bold">{inspectedEvent.eventName}</span>
              </div>
              <div className="break-all">
                <span className="text-slate-400">Transaction Hash:</span>{" "}
                <span className="text-emerald-300">{inspectedEvent.txHash}</span>
              </div>
              <div>
                <span className="text-slate-400">Block Number:</span>{" "}
                <span className="text-white">#{inspectedEvent.blockNumber} (Confirmed)</span>
              </div>
              <div>
                <span className="text-slate-400">Actor Wallet:</span>{" "}
                <span className="text-white">{inspectedEvent.voterOrActor}</span>
              </div>
              {inspectedEvent.candidateName && (
                <div>
                  <span className="text-slate-400">Candidate Payload:</span>{" "}
                  <span className="text-emerald-300">{inspectedEvent.candidateName}</span>
                </div>
              )}
              <div>
                <span className="text-slate-400">Gas Consumed:</span>{" "}
                <span className="text-white">{inspectedEvent.gasUsed} units</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
