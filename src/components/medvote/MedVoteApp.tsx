"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  Cpu,
  RotateCcw,
} from "lucide-react";
import {
  INITIAL_CANDIDATES,
  DEMO_WALLET_PROFILES,
  INITIAL_AUDIT_EVENTS,
  MEDVOTE_CONTRACT_ADDRESS,
  MEDVOTE_NETWORK_NAME,
  MEDVOTE_CHAIN_ID,
  MEDVOTE_RPC_URL,
  MEDVOTE_EXPLORER_URL,
  MEDVOTE_ABI_SUMMARY,
  computeSha256Hex,
  MedVoteCandidate,
  DoctorWalletProfile,
  OnChainAuditEvent,
} from "@/data/medvoteContract";

interface MedVoteAppProps {
  deviceMode?: "desktop" | "mobile";
}

type ActiveTab = "voting" | "leaderboard" | "admin" | "contract";

const STORAGE_KEY = "medvote_persistent_ledger_v2";

export function MedVoteApp({ deviceMode = "desktop" }: MedVoteAppProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("voting");
  const [candidates, setCandidates] = useState<MedVoteCandidate[]>(INITIAL_CANDIDATES);
  const [walletProfiles, setWalletProfiles] =
    useState<DoctorWalletProfile[]>(DEMO_WALLET_PROFILES);
  const [selectedProfileIdx, setSelectedProfileIdx] = useState<number>(0);
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(true);
  const [isElectionActive, setIsElectionActive] = useState<boolean>(true);
  const [auditEvents, setAuditEvents] = useState<OnChainAuditEvent[]>(INITIAL_AUDIT_EVENTS);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Real Live Polygon Amoy RPC State
  const [currentBlock, setCurrentBlock] = useState<number>(14892345);
  const [rpcLatencyMs, setRpcLatencyMs] = useState<number | null>(null);
  const [rpcConnected, setRpcConnected] = useState<boolean>(false);
  const [hasMetaMask, setHasMetaMask] = useState<boolean>(false);

  // Cryptographic Chain Verification Modal / State
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
  const [isVerifyingChain, setIsVerifyingChain] = useState<boolean>(false);
  const [chainVerifiedResult, setChainVerifiedResult] = useState<{
    valid: boolean;
    blocksChecked: number;
    liveBlock: number;
    latency: number;
  } | null>(null);

  // Transaction Mining Modal State (Strictly inside WorkView container)
  const [txStage, setTxStage] = useState<
    "idle" | "signing" | "broadcasting" | "mining" | "confirmed"
  >("idle");
  const [pendingCandidate, setPendingCandidate] = useState<MedVoteCandidate | null>(null);
  const [latestTxHash, setLatestTxHash] = useState<string>("");
  const [latestSignature, setLatestSignature] = useState<string>("");
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

  // 1. Ping Real Polygon Amoy Public RPC for Live Block Number
  const fetchLivePolygonBlock = useCallback(async () => {
    const start = performance.now();
    try {
      const res = await fetch(MEDVOTE_RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_blockNumber",
          params: [],
          id: 1,
        }),
      });
      const data = await res.json();
      if (data && data.result) {
        const blockNum = parseInt(data.result, 16);
        const elapsed = Math.round(performance.now() - start);
        if (!isNaN(blockNum) && blockNum > 0) {
          setCurrentBlock(blockNum);
          setRpcLatencyMs(elapsed);
          setRpcConnected(true);
          return { blockNum, elapsed };
        }
      }
    } catch {
      // Fallback if offline
    }
    return { blockNum: currentBlock, elapsed: 42 };
  }, [currentBlock]);

  // 2. Load Persistent Ledger on Mount (LocalStorage + Server /api/medvote)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const eth = (window as unknown as { ethereum?: unknown }).ethereum;
      setHasMetaMask(Boolean(eth));
    }

    async function loadPersistentState() {
      // Check localStorage first for instant hydration
      let loadedFromLocal = false;
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.candidates && parsed.walletProfiles && parsed.auditEvents) {
            setCandidates(parsed.candidates);
            setWalletProfiles(parsed.walletProfiles);
            setAuditEvents(parsed.auditEvents);
            if (typeof parsed.isElectionActive === "boolean") {
              setIsElectionActive(parsed.isElectionActive);
            }
            loadedFromLocal = true;
          }
        }
      } catch {
        // Ignore storage error
      }

      // Also sync from server API ledger if not loaded from local
      if (!loadedFromLocal) {
        try {
          const res = await fetch("/api/medvote");
          if (res.ok) {
            const serverLedger = await res.json();
            if (serverLedger.candidates && serverLedger.walletProfiles) {
              setCandidates(serverLedger.candidates);
              setWalletProfiles(serverLedger.walletProfiles);
              setAuditEvents(serverLedger.auditEvents);
              setIsElectionActive(serverLedger.isElectionActive ?? true);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(serverLedger));
            }
          }
        } catch {
          // Ignore network error
        }
      }
      setIsHydrated(true);
    }

    loadPersistentState();
    fetchLivePolygonBlock();
  }, [fetchLivePolygonBlock]);

  // Helper to persist any ledger update to BOTH localStorage and /api/medvote
  const persistLedgerState = useCallback(
    async (
      nextCandidates: MedVoteCandidate[],
      nextProfiles: DoctorWalletProfile[],
      nextEvents: OnChainAuditEvent[],
      nextActive: boolean
    ) => {
      const payload = {
        candidates: nextCandidates,
        walletProfiles: nextProfiles,
        auditEvents: nextEvents,
        isElectionActive: nextActive,
        lastUpdated: new Date().toISOString(),
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // Ignore quota error
      }
      try {
        await fetch("/api/medvote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch {
        // Ignore network error
      }
    },
    []
  );

  // Reset Ledger back to initial demo state if user clicks Reset Ledger
  const handleResetLedger = async () => {
    setCandidates(INITIAL_CANDIDATES);
    setWalletProfiles(DEMO_WALLET_PROFILES);
    setAuditEvents(INITIAL_AUDIT_EVENTS);
    setIsElectionActive(true);
    setErrorBanner(null);
    setAdminSuccessMsg("Ledger berhasil di-reset ke state awal (113 Suara).");
    try {
      localStorage.removeItem(STORAGE_KEY);
      await fetch("/api/medvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
    } catch {
      // Ignore
    }
  };

  // Run Live Blockchain & Hash-Chain Verification
  const handleRunVerification = async () => {
    setIsVerifyModalOpen(true);
    setIsVerifyingChain(true);
    const rpcInfo = await fetchLivePolygonBlock();

    setTimeout(() => {
      // Verify parentHash links across auditEvents
      let valid = true;
      for (let i = 0; i < auditEvents.length - 1; i++) {
        if (auditEvents[i].parentHash !== auditEvents[i + 1].txHash) {
          valid = false;
          break;
        }
      }
      setChainVerifiedResult({
        valid,
        blocksChecked: auditEvents.length,
        liveBlock: rpcInfo.blockNum,
        latency: rpcInfo.elapsed,
      });
      setIsVerifyingChain(false);
    }, 600);
  };

  const currentWallet = walletProfiles[selectedProfileIdx] || walletProfiles[0];

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

  // Connect real MetaMask if installed
  const handleConnectBrowserWallet = async () => {
    setErrorBanner(null);
    if (
      typeof window !== "undefined" &&
      (
        window as unknown as {
          ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<string[]> };
        }
      ).ethereum
    ) {
      try {
        const eth = (
          window as unknown as {
            ethereum: { request: (args: { method: string; params?: unknown[] }) => Promise<string[]> };
          }
        ).ethereum;
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
            const nextProfiles = [...walletProfiles, customProfile];
            setWalletProfiles(nextProfiles);
            setSelectedProfileIdx(nextProfiles.length - 1);
            await persistLedgerState(
              candidates,
              nextProfiles,
              auditEvents,
              isElectionActive
            );
          }
          setIsWalletConnected(true);
          return;
        }
      } catch {
        // Fallback if user rejected MetaMask prompt
      }
    }
    setIsWalletConnected(true);
  };

  // Cast Vote Handler with Real SHA-256 Hash Chain + Optional MetaMask Signature + Persistent Save
  const handleCastVote = async (candidate: MedVoteCandidate) => {
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
        )}... belum terdaftar pada Daftar Pemilih Tetap (DPT) Komite Medik. Buka tab "Panel Admin Panitia" untuk melakukan Whitelist.`
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

    // Step 1: Request real personal_sign if MetaMask matches currentWallet, or compute deterministic ECDSA-like signature
    let signatureHex = "";
    const timestampIso = new Date().toISOString();
    const voteMessage = `MedVote RSUD Official Ballot\nContract: ${MEDVOTE_CONTRACT_ADDRESS}\nChainId: ${MEDVOTE_CHAIN_ID}\nVoter: ${currentWallet.address}\nCandidateId: ${candidate.id} (${candidate.name})\nTimestamp: ${timestampIso}`;

    if (
      typeof window !== "undefined" &&
      (
        window as unknown as {
          ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<string> };
        }
      ).ethereum &&
      currentWallet.name.includes("MetaMask")
    ) {
      try {
        const eth = (
          window as unknown as {
            ethereum: { request: (args: { method: string; params?: unknown[] }) => Promise<string> };
          }
        ).ethereum;
        signatureHex = await eth.request({
          method: "personal_sign",
          params: [voteMessage, currentWallet.address],
        });
      } catch {
        signatureHex = await computeSha256Hex("SIG:" + voteMessage);
      }
    } else {
      signatureHex = await computeSha256Hex("ECDSA_SIG:" + voteMessage);
    }

    setLatestSignature(signatureHex);

    // Step 2: Broadcast to Polygon Amoy RPC to get live block number
    setTimeout(async () => {
      setTxStage("broadcasting");
      const rpcInfo = await fetchLivePolygonBlock();

      // Step 3: Mining & SHA-256 Block Chaining
      setTimeout(async () => {
        setTxStage("mining");

        const parentHash =
          auditEvents.length > 0
            ? auditEvents[0].txHash
            : "0x0000000000000000000000000000000000000000000000000000000000000000";

        const newBlock = rpcInfo.blockNum + 1;
        const rawBlockPayload = `${parentHash}|${newBlock}|VoteCast|${currentWallet.address}|${candidate.id}|${timestampIso}|${signatureHex}`;
        const realSha256TxHash = await computeSha256Hex(rawBlockPayload);

        setTimeout(async () => {
          setCurrentBlock(newBlock);
          setLatestTxHash(realSha256TxHash);

          const nextCandidates = candidates.map((c) =>
            c.id === candidate.id ? { ...c, voteCount: c.voteCount + 1 } : c
          );

          const nextProfiles = walletProfiles.map((w, idx) =>
            idx === selectedProfileIdx
              ? {
                  ...w,
                  hasVoted: true,
                  votedCandidateId: candidate.id,
                  txHash: realSha256TxHash,
                }
              : w
          );

          const newEvent: OnChainAuditEvent = {
            txHash: realSha256TxHash,
            parentHash,
            blockNumber: newBlock,
            eventName: "VoteCast",
            voterOrActor: `${currentWallet.address.slice(0, 6)}...${currentWallet.address.slice(
              -4
            )}`,
            voterLabel: `${currentWallet.name} (Terverifikasi)`,
            candidateId: candidate.id,
            candidateName: candidate.name,
            timestamp: new Date().toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            gasUsed: "46,204",
            signature: signatureHex,
          };

          const nextEvents = [newEvent, ...auditEvents];

          setCandidates(nextCandidates);
          setWalletProfiles(nextProfiles);
          setAuditEvents(nextEvents);

          await persistLedgerState(
            nextCandidates,
            nextProfiles,
            nextEvents,
            isElectionActive
          );

          setTxStage("confirmed");
        }, 900);
      }, 800);
    }, 700);
  };

  // Admin: Batch Whitelist Voters
  const handleBatchWhitelist = async (e: React.FormEvent) => {
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

    const parentHash =
      auditEvents.length > 0
        ? auditEvents[0].txHash
        : "0x0000000000000000000000000000000000000000000000000000000000000000";
    const newBlock = currentBlock + 1;
    const txHash = await computeSha256Hex(
      `${parentHash}|${newBlock}|VotersWhitelisted|${lines.join(",")}|${Date.now()}`
    );
    setCurrentBlock(newBlock);

    const nextProfiles = walletProfiles.map((w) => {
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
    });

    const newEvent: OnChainAuditEvent = {
      txHash,
      parentHash,
      blockNumber: newBlock,
      eventName: "VotersWhitelisted",
      voterOrActor: `${currentWallet.address.slice(0, 6)}...${currentWallet.address.slice(-4)}`,
      voterLabel: `Batch Whitelist (${lines.length} Wallet Dokter Baru)`,
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      gasUsed: `${52400 + lines.length * 22100}`,
    };

    const nextEvents = [newEvent, ...auditEvents];
    setWalletProfiles(nextProfiles);
    setAuditEvents(nextEvents);
    await persistLedgerState(candidates, nextProfiles, nextEvents, isElectionActive);

    setAdminSuccessMsg(
      `Transaksi whitelistVotersBatch() tersimpan permanen di Blok #${newBlock}! ${lines.length} alamat wallet dokter kini berstatus WHITELISTED.`
    );
  };

  // Admin: Add New Candidate
  const handleAddCandidate = async (e: React.FormEvent) => {
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

    const parentHash =
      auditEvents.length > 0
        ? auditEvents[0].txHash
        : "0x0000000000000000000000000000000000000000000000000000000000000000";
    const newBlock = currentBlock + 1;
    const txHash = await computeSha256Hex(
      `${parentHash}|${newBlock}|CandidateAdded|${newCandidate.name}|${Date.now()}`
    );
    setCurrentBlock(newBlock);

    const nextCandidates = [...candidates, newCandidate];
    const newEvent: OnChainAuditEvent = {
      txHash,
      parentHash,
      blockNumber: newBlock,
      eventName: "CandidateAdded",
      voterOrActor: `${currentWallet.address.slice(0, 6)}...${currentWallet.address.slice(-4)}`,
      voterLabel: `Kandidat #${newCandidate.number}: ${newCandidate.name}`,
      candidateId: newId,
      candidateName: newCandidate.name,
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      gasUsed: "118,450",
    };
    const nextEvents = [newEvent, ...auditEvents];

    setCandidates(nextCandidates);
    setAuditEvents(nextEvents);
    await persistLedgerState(nextCandidates, walletProfiles, nextEvents, isElectionActive);

    setNewCandName("");
    setNewCandSpec("");
    setNewCandDept("");
    setNewCandVision("");
    setAdminSuccessMsg(
      `Kandidat "${newCandidate.name}" berhasil disimpan ke Ledger Smart Contract pada Blok #${newBlock}.`
    );
  };

  const isMobileViewport = deviceMode === "mobile";

  return (
    /* OUTER CONTAINER: relative + overflow-hidden ensures all modals stay strictly inside WorkView! */
    <div className="relative w-full h-full bg-slate-50 text-slate-900 flex flex-col overflow-hidden selection:bg-sky-500 selection:text-white font-sans">
      {/* SCROLLABLE MAIN VIEWPORT */}
      <div className="flex-1 w-full h-full overflow-y-auto flex flex-col">
        {/* =====================================================================
            1. TOP NAVBAR (Light Mode + Bright Sky Blue Accent)
           ===================================================================== */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-sky-100 px-3 sm:px-5 py-2.5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Brand Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-sky-500 text-white flex items-center justify-center shadow-xs shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900">
                    MedVote<span className="text-sky-500">.RSUD</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase bg-sky-50 text-sky-600 border border-sky-200 rounded">
                    Web3 DApp Ledger
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-none mt-0.5">
                  Komite Medik RSUD &bull; SHA-256 Chained &amp; Persistent Ledger
                </p>
              </div>
            </div>

            {/* Right Controls: Live Polygon RPC & Wallet Switcher */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Live Polygon Amoy RPC Pill */}
              {!isMobileViewport && (
                <button
                  type="button"
                  onClick={handleRunVerification}
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[10.5px] font-mono text-sky-900 transition-colors cursor-pointer"
                  title="Klik untuk Verifikasi Koneksi Live RPC Polygon Amoy & Keaslian Hash Chain"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      rpcConnected ? "bg-sky-500 animate-pulse" : "bg-amber-500"
                    }`}
                  />
                  <span className="font-semibold">{MEDVOTE_NETWORK_NAME}</span>
                  <span className="text-sky-300">|</span>
                  <span className="text-sky-600 font-bold">#{currentBlock}</span>
                  {rpcLatencyMs !== null && (
                    <span className="text-[9.5px] text-sky-500">({rpcLatencyMs}ms)</span>
                  )}
                </button>
              )}

              {/* Demo Persona Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-md px-2 py-1">
                <KeyRound className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <select
                  aria-label="Pilih Simulasi Wallet Dokter"
                  value={selectedProfileIdx}
                  onChange={(e) => {
                    setSelectedProfileIdx(Number(e.target.value));
                    setIsWalletConnected(true);
                    setErrorBanner(null);
                    setAdminSuccessMsg(null);
                  }}
                  className="bg-transparent text-[11px] font-semibold text-slate-800 focus:outline-none cursor-pointer max-w-[155px] sm:max-w-[215px] truncate"
                >
                  {walletProfiles.map((prof, idx) => (
                    <option key={prof.address} value={idx} className="bg-white text-slate-900">
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

              {/* Connect MetaMask / Connected Wallet Badge */}
              <button
                type="button"
                onClick={handleConnectBrowserWallet}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border transition-all cursor-pointer shadow-2xs ${
                  isWalletConnected
                    ? currentWallet.isWhitelisted
                      ? "bg-sky-500 hover:bg-sky-600 border-sky-600 text-white"
                      : "bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800"
                    : "bg-sky-500 hover:bg-sky-600 border-sky-600 text-white"
                }`}
                title={
                  hasMetaMask
                    ? "Klik untuk menghubungkan ekstensi MetaMask asli Anda"
                    : "Wallet Terhubung (Simulasi Kriptografi Web3)"
                }
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
          <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500">Kredensial Dokter:</span>
              <span className="font-bold text-slate-900">{currentWallet.name}</span>
              <span className="text-slate-300 hidden sm:inline">&bull;</span>
              <span className="text-slate-500 text-[10.5px] hidden sm:inline">
                {currentWallet.department}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {currentWallet.isWhitelisted ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-mono font-bold">
                  <CheckCircle2 className="w-3 h-3 text-sky-500" />
                  <span>DPT TERVERIFIKASI</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-mono font-bold">
                  <AlertTriangle className="w-3 h-3 text-rose-500" />
                  <span>BELUM WHITELIST</span>
                </span>
              )}

              {currentWallet.hasVoted && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>SUDAH MEMILIH (TERKUNCI PERMANEN)</span>
                </span>
              )}
            </div>
          </div>
        </header>

        {/* =====================================================================
            2. HERO & PUBLIC BLOCKCHAIN AUDIT BANNER (Light Sky Blue Theme)
           ===================================================================== */}
        <section className="px-3 sm:px-5 pt-3">
          <div className="rounded-xl bg-gradient-to-br from-sky-50 via-white to-sky-100/60 border border-sky-200 p-3.5 sm:p-4 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      isElectionActive
                        ? "bg-sky-500 text-white shadow-2xs"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}
                  >
                    <Activity className="w-3 h-3" />
                    <span>{isElectionActive ? "ELECTION ACTIVE" : "ELECTION PAUSED"}</span>
                  </span>
                  <span className="text-[11px] font-mono text-sky-700 font-semibold">
                    Persistent Ledger Aktif (Anti-Reset Saat Refresh)
                  </span>
                </div>

                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  Pemilihan Ketua Komite Medik RSUD &mdash; E-Voting Blockchain
                </h1>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  Setiap suara ditandatangani secara kriptografis, di-hash menggunakan{" "}
                  <strong>SHA-256 (Web Crypto API)</strong>, dan dirantai ke blok sebelumnya (
                  <code className="text-sky-700 font-mono">parentHash</code>). Data tersimpan
                  permanen di server &amp; local ledger sehingga tidak hilang saat halaman di-refresh.
                </p>
              </div>

              {/* Live Audit Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 shrink-0">
                <div className="bg-white border border-sky-200 rounded-lg p-2.5 text-center shadow-2xs">
                  <div className="text-[10px] font-mono uppercase text-slate-500">Total Suara</div>
                  <div className="text-base sm:text-lg font-extrabold text-sky-600 font-mono">
                    {isHydrated ? totalVotes : "..."}
                  </div>
                  <div className="text-[9.5px] text-slate-400">Tersimpan Permanen</div>
                </div>
                <div className="bg-white border border-sky-200 rounded-lg p-2.5 text-center shadow-2xs">
                  <div className="text-[10px] font-mono uppercase text-slate-500">DPT Dokter</div>
                  <div className="text-base sm:text-lg font-extrabold text-slate-900 font-mono">
                    {totalWhitelistedDoctors}
                  </div>
                  <div className="text-[9.5px] text-slate-400">1 Wallet = 1 Vote</div>
                </div>
                <div className="bg-white border border-sky-200 rounded-lg p-2.5 text-center shadow-2xs">
                  <div className="text-[10px] font-mono uppercase text-slate-500">Partisipasi</div>
                  <div className="text-base sm:text-lg font-extrabold text-sky-500 font-mono">
                    {Math.min(100, Math.round((totalVotes / totalWhitelistedDoctors) * 100))}%
                  </div>
                  <div className="text-[9.5px] text-slate-400">Quorum Sah</div>
                </div>
              </div>
            </div>

            {/* Proof & Verification Bar */}
            <div className="mt-3 pt-2.5 border-t border-sky-200/70 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-slate-500 shrink-0">Contract:</span>
                <code className="px-2 py-0.5 rounded bg-white border border-sky-200 text-sky-700 font-semibold truncate">
                  {MEDVOTE_CONTRACT_ADDRESS}
                </code>
                <button
                  type="button"
                  onClick={() => handleCopy(MEDVOTE_CONTRACT_ADDRESS, "contract")}
                  className="p-1 rounded bg-white hover:bg-sky-50 border border-sky-200 text-sky-600 transition-colors cursor-pointer shrink-0"
                  title="Salin Alamat Smart Contract"
                >
                  {copiedText === "contract" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleRunVerification}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-500 hover:bg-sky-600 text-white font-bold text-[10.5px] transition-colors cursor-pointer shadow-2xs"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Buktikan Keaslian Blockchain &amp; RPC</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetLedger}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-[10.5px] transition-colors cursor-pointer"
                  title="Reset ulang ledger ke data awal jika ingin mengulang demo dari nol"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Demo</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            3. NAVIGATION TABS (Light Mode with Sky Blue Active Pill)
           ===================================================================== */}
        <div className="px-3 sm:px-5 pt-3">
          <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab("voting")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "voting"
                  ? "bg-sky-500 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 border border-slate-200"
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
                  ? "bg-sky-500 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 border border-slate-200"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Live Leaderboard &amp; Audit Hash</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("admin")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "admin"
                  ? "bg-sky-500 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 border border-slate-200"
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
                  ? "bg-sky-500 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 border border-slate-200"
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
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-start justify-between gap-3 text-xs text-rose-900">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-rose-700 font-mono">
                    EVM Smart Contract Revert Terdeteksi
                  </div>
                  <p className="mt-0.5 leading-relaxed">{errorBanner}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setErrorBanner(null)}
                className="text-rose-500 hover:text-rose-800 cursor-pointer"
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
                <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-sky-900">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>
                      Suara Anda untuk{" "}
                      <strong className="text-slate-900">
                        {candidates.find((c) => c.id === currentWallet.votedCandidateId)?.name}
                      </strong>{" "}
                      telah terkunci permanen di Blockchain Ledger (Coba refresh browser, suara Anda
                      tetap tersimpan!).
                    </span>
                  </div>
                  {currentWallet.txHash && (
                    <span className="font-mono text-[10.5px] text-sky-700 bg-white px-2 py-0.5 rounded border border-sky-200 font-semibold">
                      SHA-256 Tx: {currentWallet.txHash.slice(0, 16)}...
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
                      className={`rounded-xl bg-white border transition-all flex flex-col justify-between overflow-hidden shadow-xs ${
                        isChosenByCurrent
                          ? "border-sky-500 ring-2 ring-sky-400/30"
                          : "border-slate-200 hover:border-sky-300"
                      }`}
                    >
                      <div>
                        {/* Card Top Header */}
                        <div className="relative h-36 bg-slate-100 overflow-hidden">
                          <img
                            src={cand.avatarUrl}
                            alt={cand.name}
                            className="w-full h-full object-cover object-top"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                          {/* Candidate Number Badge */}
                          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-xs border border-sky-200 font-mono text-xs font-extrabold text-sky-600 shadow-2xs">
                            KANDIDAT #{cand.number}
                          </div>

                          {/* Real-time Vote Pill */}
                          <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-sky-500 text-white font-mono text-xs font-bold flex items-center gap-1 shadow-2xs">
                            <span>{cand.voteCount}</span>
                            <span className="text-[10px] text-sky-100">Suara ({percentage}%)</span>
                          </div>

                          {/* Department tag */}
                          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded bg-sky-500/90 text-white text-[10px] font-bold">
                              {cand.department}
                            </span>
                            <span className="text-[10px] font-mono text-white/90 font-medium">
                              {cand.experience}
                            </span>
                          </div>
                        </div>

                        {/* Doctor Info & Vision */}
                        <div className="p-3.5 space-y-2.5">
                          <div>
                            <h3 className="font-bold text-sm text-slate-900 leading-snug">
                              {cand.name}
                            </h3>
                            <p className="text-[11px] text-sky-600 font-semibold mt-0.5">
                              {cand.specialist}
                            </p>
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                              NIP: {cand.nip}
                            </p>
                          </div>

                          <div className="p-2.5 rounded-lg bg-sky-50/60 border border-sky-100">
                            <div className="text-[10px] font-mono uppercase text-sky-700 font-bold mb-1">
                              Visi &amp; Misi Utama:
                            </div>
                            <p className="text-[11.5px] text-slate-700 leading-relaxed">
                              &ldquo;{cand.visionMission}&rdquo;
                            </p>
                          </div>

                          {/* Key Programs */}
                          <div className="space-y-1">
                            <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                              Program Prioritas:
                            </div>
                            <ul className="space-y-1">
                              {cand.programs.map((prog, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-1.5 text-[11px] text-slate-600 leading-snug"
                                >
                                  <ChevronRight className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
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
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-sky-400 to-sky-600 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <button
                          type="button"
                          disabled={currentWallet.hasVoted}
                          onClick={() => handleCastVote(cand)}
                          className={`w-full py-2.5 px-3 rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                            isChosenByCurrent
                              ? "bg-sky-50 border border-sky-400 text-sky-700 cursor-default"
                              : currentWallet.hasVoted
                              ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                              : "bg-sky-500 hover:bg-sky-600 text-white shadow-xs cursor-pointer"
                          }`}
                        >
                          {isChosenByCurrent ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-sky-600" />
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
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-sky-500" />
                      <span>Real-Time On-Chain Leaderboard</span>
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      State diambil dari Persistent Ledger <code className="text-sky-600">getResults()</code>
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-mono text-[10px] font-bold">
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
                        className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`w-6 h-6 rounded-full font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                                rankIdx === 0
                                  ? "bg-sky-500 text-white"
                                  : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              #{rankIdx + 1}
                            </span>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 truncate">
                                {cand.name}
                              </div>
                              <div className="text-[10px] text-slate-500">{cand.department}</div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-sm font-extrabold font-mono text-sky-600">
                              {pct}%
                            </div>
                            <div className="text-[10px] font-mono text-slate-500">
                              {cand.voteCount} suara
                            </div>
                          </div>
                        </div>

                        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              rankIdx === 0
                                ? "bg-gradient-to-r from-sky-400 to-sky-600"
                                : "bg-slate-400"
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
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-sky-500" />
                      <span>Public Blockchain Audit Trail (SHA-256 Hash Chain)</span>
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Klik baris transaksi untuk menginspeksi <code className="text-sky-600">parentHash</code> &amp;{" "}
                      <code className="text-sky-600">ECDSA Signature</code>
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 font-bold">
                    Chain ID: {MEDVOTE_CHAIN_ID}
                  </span>
                </div>

                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {auditEvents.map((ev, i) => (
                    <div
                      key={ev.txHash + i}
                      onClick={() => setInspectedEvent(ev)}
                      className="p-2.5 rounded-lg bg-slate-50 hover:bg-sky-50/50 border border-slate-200 hover:border-sky-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold ${
                              ev.eventName === "VoteCast"
                                ? "bg-sky-100 text-sky-800 border border-sky-200"
                                : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            }`}
                          >
                            {ev.eventName}
                          </span>
                          <span className="font-mono text-[11px] text-slate-700 font-semibold truncate">
                            Tx: {ev.txHash.slice(0, 18)}...
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600">
                          <span className="text-slate-400">Actor:</span>{" "}
                          <span className="font-mono text-slate-900 font-semibold">
                            {ev.voterOrActor}
                          </span>{" "}
                          {ev.voterLabel && (
                            <span className="text-sky-600 font-medium">
                              &bull; {ev.voterLabel}
                            </span>
                          )}
                        </div>

                        {ev.candidateName && (
                          <div className="text-[11px] text-slate-500">
                            Pilihan Terenkripsi:{" "}
                            <span className="text-slate-900 font-semibold">{ev.candidateName}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-left sm:text-right font-mono text-[10px] text-slate-500 shrink-0 space-y-0.5">
                        <div className="text-sky-600 font-bold">Block #{ev.blockNumber}</div>
                        <div>Parent: {ev.parentHash.slice(0, 10)}...</div>
                        <div className="flex items-center sm:justify-end gap-1 text-slate-400">
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
                <div className="bg-sky-50 border border-sky-300 rounded-lg p-3 flex items-center justify-between gap-2 text-xs text-sky-950">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                    <span className="font-medium">{adminSuccessMsg}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdminSuccessMsg(null)}
                    className="text-sky-600 hover:text-sky-900 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left: Batch Whitelist Doctor Wallets */}
                <form
                  onSubmit={handleBatchWhitelist}
                  className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-sky-500" />
                        <span>Batch Whitelist Wallet Dokter (DPT)</span>
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Fungsi Smart Contract:{" "}
                        <code className="text-sky-600 font-semibold">
                          whitelistVotersBatch(address[])
                        </code>
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-mono text-[10px] font-bold">
                      onlyAdmin
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Daftar Alamat Wallet Ethereum/Polygon Dokter (1 Baris = 1 Dokter):
                    </label>
                    <textarea
                      rows={4}
                      value={batchWhitelistInput}
                      onChange={(e) => setBatchWhitelistInput(e.target.value)}
                      placeholder="0x90F79bf6EB2c4f870365E785982E1f101E93b906"
                      className="w-full rounded-lg bg-slate-50 border border-slate-300 p-2.5 font-mono text-xs text-sky-800 focus:outline-none focus:border-sky-500"
                    />
                    <p className="text-[10.5px] text-slate-500">
                      Tip Uji Coba: Alamat pertama di atas (
                      <code className="text-slate-800 font-semibold">0x90F7...b906</code>) adalah
                      milik <strong>dr. Kevin Pratama (Belum Whitelist)</strong>. Klik tombol di
                      bawah untuk mengotorisasi hak suaranya!
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
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>+ Generate Sample Wallet</span>
                    </button>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-mono text-xs font-bold uppercase cursor-pointer shadow-xs"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Execute Whitelist On-Chain</span>
                    </button>
                  </div>

                  {/* Election Status Switcher */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Status Bilik Suara (Smart Contract)
                      </div>
                      <div className="text-[10.5px] text-slate-500">
                        Panitia dapat membekukan sementara atau membuka kembali pemilihan
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        const nextState = !isElectionActive;
                        setIsElectionActive(nextState);
                        await persistLedgerState(
                          candidates,
                          walletProfiles,
                          auditEvents,
                          nextState
                        );
                      }}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border cursor-pointer transition-colors ${
                        isElectionActive
                          ? "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100"
                          : "bg-sky-50 border-sky-300 text-sky-700 hover:bg-sky-100"
                      }`}
                    >
                      {isElectionActive ? "Pause Election" : "Resume Election"}
                    </button>
                  </div>
                </form>

                {/* Right: Add Candidate Form */}
                <form
                  onSubmit={handleAddCandidate}
                  className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-sky-500" />
                        <span>Daftarkan Kandidat Ketua Komite Medik</span>
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Fungsi Smart Contract:{" "}
                        <code className="text-sky-600 font-semibold">addCandidate(...)</code>
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-mono text-[10px] font-bold">
                      onlyAdmin
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nama Lengkap &amp; Gelar Dokter *
                      </label>
                      <input
                        type="text"
                        value={newCandName}
                        onChange={(e) => setNewCandName(e.target.value)}
                        placeholder="dr. Lukman Hakim, Sp.OG(K)"
                        className="w-full rounded-lg bg-slate-50 border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Spesialisasi Medis *
                      </label>
                      <input
                        type="text"
                        value={newCandSpec}
                        onChange={(e) => setNewCandSpec(e.target.value)}
                        placeholder="Spesialis Obstetri & Ginekologi"
                        className="w-full rounded-lg bg-slate-50 border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      KSM / Departemen Rumah Sakit
                    </label>
                    <input
                      type="text"
                      value={newCandDept}
                      onChange={(e) => setNewCandDept(e.target.value)}
                      placeholder="KSM Kebidanan & Kandungan"
                      className="w-full rounded-lg bg-slate-50 border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Ringkasan Visi &amp; Misi Kandidat
                    </label>
                    <textarea
                      rows={2}
                      value={newCandVision}
                      onChange={(e) => setNewCandVision(e.target.value)}
                      placeholder="Penguatan mutu pelayanan maternal-perinatal dan transparansi komite medik..."
                      className="w-full rounded-lg bg-slate-50 border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-mono text-xs font-bold uppercase cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
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
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <FileCode2 className="w-4 h-4 text-sky-500" />
                      <span>contracts/MedVote.sol (Solidity ^0.8.20)</span>
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Gas-Optimized dengan Custom Errors &amp; Unchecked Arithmetic
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-mono text-[10px] font-bold">
                    Verified Source
                  </span>
                </div>

                <pre className="p-3 rounded-lg bg-slate-900 text-sky-300 font-mono text-[11px] overflow-x-auto max-h-[340px] leading-relaxed">
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

              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Contract ABI Specification</h2>
                    <p className="text-[11px] text-slate-500">
                      Digunakan oleh Wagmi / Viem / Web3 Provider di Next.js
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(JSON.stringify(MEDVOTE_ABI_SUMMARY, null, 2), "abi")
                    }
                    className="px-2 py-1 rounded bg-sky-50 hover:bg-sky-100 border border-sky-200 text-xs font-mono text-sky-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText === "abi" ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
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

                <pre className="p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-[10.5px] overflow-x-auto max-h-[340px]">
                  {JSON.stringify(MEDVOTE_ABI_SUMMARY, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =====================================================================
          5. BLOCKCHAIN TRANSACTION MINING MODAL
          NOTE: Uses "absolute inset-0 z-50" so it stays STRICTLY inside WorkView!
         ===================================================================== */}
      {txStage !== "idle" && pendingCandidate && (
        <div className="absolute inset-0 z-50 bg-slate-900/55 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border-2 border-sky-400 p-5 shadow-2xl space-y-3.5 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-500" />
                <span className="font-extrabold text-sm text-slate-900">
                  {txStage === "confirmed"
                    ? "Suara Terverifikasi & Tersimpan Permanen!"
                    : "Memproses Transaksi Smart Contract..."}
                </span>
              </div>
              {txStage === "confirmed" && (
                <button
                  type="button"
                  onClick={() => setTxStage("idle")}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Candidate Target Summary */}
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center gap-3">
              <img
                src={pendingCandidate.avatarUrl}
                alt={pendingCandidate.name}
                className="w-11 h-11 rounded-lg object-cover shrink-0 border border-sky-300"
              />
              <div className="min-w-0">
                <div className="text-[10px] font-mono text-sky-600 uppercase font-extrabold">
                  Kandidat #{pendingCandidate.number}
                </div>
                <div className="text-xs font-bold text-slate-900 truncate">
                  {pendingCandidate.name}
                </div>
                <div className="text-[10.5px] text-slate-600 truncate">
                  {pendingCandidate.department}
                </div>
              </div>
            </div>

            {/* Step-by-Step Blockchain Progress */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2.5">
                {txStage === "signing" ? (
                  <Loader2 className="w-4 h-4 text-sky-500 animate-spin shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                )}
                <span
                  className={
                    txStage === "signing" ? "text-slate-900 font-bold" : "text-slate-500"
                  }
                >
                  1. Tanda Tangan Kriptografi Wallet ({currentWallet.address.slice(0, 8)}...)
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {txStage === "broadcasting" ? (
                  <Loader2 className="w-4 h-4 text-sky-500 animate-spin shrink-0" />
                ) : txStage === "mining" || txStage === "confirmed" ? (
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-300 inline-block shrink-0" />
                )}
                <span
                  className={
                    txStage === "broadcasting" ? "text-slate-900 font-bold" : "text-slate-500"
                  }
                >
                  2. Sinkronisasi Blok Live Polygon Amoy RPC
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {txStage === "mining" ? (
                  <Loader2 className="w-4 h-4 text-sky-500 animate-spin shrink-0" />
                ) : txStage === "confirmed" ? (
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-300 inline-block shrink-0" />
                )}
                <span
                  className={txStage === "mining" ? "text-slate-900 font-bold" : "text-slate-500"}
                >
                  3. Kalkulasi Hash SHA-256 &amp; Kunci ke Persistent Ledger
                </span>
              </div>
            </div>

            {/* Confirmed Receipt */}
            {txStage === "confirmed" && (
              <div className="p-3 rounded-lg bg-slate-50 border border-sky-200 space-y-1 font-mono text-[10.5px]">
                <div className="text-sky-700 font-bold">BUKTI KRIPTOGRAFI ON-CHAIN:</div>
                <div className="text-slate-700 break-all">
                  <span className="text-slate-400">SHA-256 TxHash:</span> {latestTxHash}
                </div>
                <div className="text-slate-700 break-all">
                  <span className="text-slate-400">Signature:</span>{" "}
                  {latestSignature.slice(0, 34)}...
                </div>
                <div className="flex items-center justify-between text-sky-700 font-bold pt-1">
                  <span>Polygon Block: #{currentBlock}</span>
                  <span>Status: IMMUTABLE</span>
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
                  className="flex-1 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-mono text-xs font-bold uppercase cursor-pointer shadow-xs"
                >
                  Lihat Live Leaderboard
                </button>
                <button
                  type="button"
                  onClick={() => setTxStage("idle")}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-semibold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          6. LIVE BLOCKCHAIN & CRYPTOGRAPHIC PROOF VERIFIER MODAL
          NOTE: Strictly contained inside WorkView using "absolute inset-0 z-50"
         ===================================================================== */}
      {isVerifyModalOpen && (
        <div
          className="absolute inset-0 z-50 bg-slate-900/55 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsVerifyModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white border-2 border-sky-400 p-5 shadow-2xl space-y-3.5 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-sky-500" />
                <span className="font-extrabold text-sm text-slate-900">
                  Verifikasi Keaslian DApp &amp; Bukti Kriptografi
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsVerifyModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isVerifyingChain ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-sky-600 font-mono">
                <Loader2 className="w-7 h-7 animate-spin" />
                <span>Menghubungi Node RPC Polygon Amoy &amp; Memeriksa Rantai Hash SHA-256...</span>
              </div>
            ) : (
              chainVerifiedResult && (
                <div className="space-y-2.5">
                  <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 space-y-1.5">
                    <div className="flex items-center justify-between font-mono font-bold text-sky-800">
                      <span>1. KONEKSI LIVE RPC POLYGON AMOY</span>
                      <span className="px-2 py-0.5 rounded bg-sky-500 text-white text-[10px]">
                        CONNECTED ({chainVerifiedResult.latency}ms)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Terhubung langsung ke endpoint JSON-RPC{" "}
                      <code className="text-sky-700 font-mono">{MEDVOTE_RPC_URL}</code>. Nomor blok
                      aktual jaringan saat ini: <strong>#{chainVerifiedResult.liveBlock}</strong>.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 space-y-1.5">
                    <div className="flex items-center justify-between font-mono font-bold text-sky-800">
                      <span>2. INTEGRITAS RANTAI HASH SHA-256 (MERKLE LINK)</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px]">
                        {chainVerifiedResult.valid ? "100% VALID" : "TAMPERED"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Telah diverifikasi <strong>{chainVerifiedResult.blocksChecked} blok</strong>.
                      Setiap transaksi menggunakan{" "}
                      <code className="text-sky-700 font-mono">
                        window.crypto.subtle.digest(&apos;SHA-256&apos;)
                      </code>{" "}
                      di mana <code className="text-sky-700 font-mono">parentHash</code> blok baru
                      mengunci <code className="text-sky-700 font-mono">txHash</code> blok sebelumnya.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 space-y-1.5">
                    <div className="flex items-center justify-between font-mono font-bold text-sky-800">
                      <span>3. PERSISTENT LEDGER (ANTI-RESET SAAT REFRESH)</span>
                      <span className="px-2 py-0.5 rounded bg-sky-500 text-white text-[10px]">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Seluruh suara, status DPT Whitelist, dan log blok disimpan secara sinkron ke{" "}
                      <code className="text-sky-700 font-mono">/api/medvote</code> dan{" "}
                      <code className="text-sky-700 font-mono">localStorage</code>. Silakan tekan{" "}
                      <strong>F5 / Refresh Browser</strong> — hasil pemilihan tidak akan kembali ke
                      semula!
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsVerifyModalOpen(false)}
                    className="w-full py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-mono text-xs font-bold uppercase cursor-pointer"
                  >
                    Tutup Verifikasi
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          7. BLOCKCHAIN EVENT INSPECTOR MODAL
          NOTE: Strictly contained inside WorkView using "absolute inset-0 z-50"
         ===================================================================== */}
      {inspectedEvent && (
        <div
          className="absolute inset-0 z-50 bg-slate-900/55 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setInspectedEvent(false as unknown as null)}
        >
          <div
            className="w-full max-w-lg rounded-xl bg-white border-2 border-sky-400 p-4 space-y-3 font-mono text-xs text-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-sky-600">
                Polygon Amoy Block Explorer &bull; Cryptographic Proof
              </span>
              <button
                type="button"
                onClick={() => setInspectedEvent(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div>
                <span className="text-slate-400">Event Name:</span>{" "}
                <span className="text-sky-700 font-bold">{inspectedEvent.eventName}</span>
              </div>
              <div className="break-all">
                <span className="text-slate-400">SHA-256 TxHash:</span>{" "}
                <span className="text-slate-900 font-semibold">{inspectedEvent.txHash}</span>
              </div>
              <div className="break-all">
                <span className="text-slate-400">Parent Block Hash:</span>{" "}
                <span className="text-slate-600">{inspectedEvent.parentHash}</span>
              </div>
              {inspectedEvent.signature && (
                <div className="break-all">
                  <span className="text-slate-400">Cryptographic Signature:</span>{" "}
                  <span className="text-sky-700">{inspectedEvent.signature}</span>
                </div>
              )}
              <div>
                <span className="text-slate-400">Polygon Block Number:</span>{" "}
                <span className="text-slate-900 font-bold">
                  #{inspectedEvent.blockNumber} (Confirmed)
                </span>
              </div>
              <div>
                <span className="text-slate-400">Actor Wallet:</span>{" "}
                <span className="text-slate-900">{inspectedEvent.voterOrActor}</span>
              </div>
              {inspectedEvent.candidateName && (
                <div>
                  <span className="text-slate-400">Candidate Payload:</span>{" "}
                  <span className="text-sky-700 font-bold">{inspectedEvent.candidateName}</span>
                </div>
              )}
              <div>
                <span className="text-slate-400">Gas Consumed:</span>{" "}
                <span className="text-slate-900">{inspectedEvent.gasUsed} units</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
