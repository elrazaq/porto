"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ethers } from "ethers";
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
  MEDVOTE_CONTRACT_ADDRESS,
  MEDVOTE_DEPLOY_BLOCK,
  MEDVOTE_NETWORK_NAME,
  MEDVOTE_CHAIN_ID,
  MEDVOTE_RPC_URL,
  MEDVOTE_EXPLORER_BASE,
  MEDVOTE_EXPLORER_URL,
  MEDVOTE_ABI,
  ONCHAIN_WALLET_CREDENTIALS,
  CANDIDATE_PROGRAMS_MAP,
  MedVoteCandidate,
  OnChainAuditEvent,
} from "@/data/medvoteContract";

interface MedVoteAppProps {
  deviceMode?: "desktop" | "mobile";
}

type ActiveTab = "voting" | "leaderboard" | "admin" | "contract";

interface VoterOnChainStatus {
  isWhitelisted: boolean;
  hasVoted: boolean;
  votedCandidateId: number | null;
  votedTimestamp: number;
  doctorName: string;
  department: string;
}

export function MedVoteApp({ deviceMode = "desktop" }: MedVoteAppProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("voting");
  const [selectedCredIdx, setSelectedCredIdx] = useState<number>(0);

  // Live On-Chain State read directly from Smart Contract
  const [candidates, setCandidates] = useState<MedVoteCandidate[]>([]);
  const [voterStatus, setVoterStatus] = useState<VoterOnChainStatus>({
    isWhitelisted: true,
    hasVoted: false,
    votedCandidateId: null,
    votedTimestamp: 0,
    doctorName: ONCHAIN_WALLET_CREDENTIALS[0].name,
    department: ONCHAIN_WALLET_CREDENTIALS[0].department,
  });
  const [isElectionActive, setIsElectionActive] = useState<boolean>(true);
  const [totalWhitelistedOnChain, setTotalWhitelistedOnChain] = useState<number>(7);
  const [auditEvents, setAuditEvents] = useState<OnChainAuditEvent[]>([]);
  const [currentBlock, setCurrentBlock] = useState<number>(MEDVOTE_DEPLOY_BLOCK);
  const [isLoadingChain, setIsLoadingChain] = useState<boolean>(true);

  // Transaction Execution Modal State (Strictly scoped inside WorkView)
  const [txStage, setTxStage] = useState<
    "idle" | "signing" | "broadcasting" | "mining" | "confirmed"
  >("idle");
  const [pendingCandidate, setPendingCandidate] = useState<MedVoteCandidate | null>(null);
  const [latestTxHash, setLatestTxHash] = useState<string>("");
  const [latestBlockNum, setLatestBlockNum] = useState<number>(0);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Admin Form State (Only accessible by Panitia Pemilihan)
  const [regWalletAddr, setRegWalletAddr] = useState<string>(
    ONCHAIN_WALLET_CREDENTIALS[3].address
  );
  const [regDocName, setRegDocName] = useState<string>(
    ONCHAIN_WALLET_CREDENTIALS[3].name
  );
  const [regDocDept, setRegDocDept] = useState<string>(
    ONCHAIN_WALLET_CREDENTIALS[3].department
  );
  const [newCandName, setNewCandName] = useState<string>("");
  const [newCandSpec, setNewCandSpec] = useState<string>("");
  const [newCandDept, setNewCandDept] = useState<string>("");
  const [newCandNip, setNewCandNip] = useState<string>("");
  const [newCandVision, setNewCandVision] = useState<string>("");
  const [isAdminSubmitting, setIsAdminSubmitting] = useState<boolean>(false);
  const [adminSuccessMsg, setAdminSuccessMsg] = useState<{
    message: string;
    txHash: string;
    blockNumber: number;
  } | null>(null);

  const activeCredential = ONCHAIN_WALLET_CREDENTIALS[selectedCredIdx];
  const isAdminRole = activeCredential.role === "admin";

  // Create read-only provider to live EVM Blockchain
  const getProvider = useCallback(() => {
    return new ethers.JsonRpcProvider(MEDVOTE_RPC_URL, MEDVOTE_CHAIN_ID, {
      staticNetwork: true,
      batchMaxCount: 1,
    });
  }, []);

  // Synchronize all data directly from the deployed Smart Contract on the blockchain
  const syncOnChainData = useCallback(async () => {
    try {
      const provider = getProvider();
      const contract = new ethers.Contract(MEDVOTE_CONTRACT_ADDRESS, MEDVOTE_ABI, provider);

      const [rawCandidates, activeFlag, whitelistedCount, blockNum, rawVoter] =
        await Promise.all([
          contract.getResults(),
          contract.isElectionActive(),
          contract.totalWhitelisted(),
          provider.getBlockNumber(),
          contract.getVoterStatus(activeCredential.address),
        ]);

      const mappedCandidates: MedVoteCandidate[] = rawCandidates.map(
        (c: {
          id: bigint;
          number: string;
          name: string;
          specialist: string;
          department: string;
          nip: string;
          experience: string;
          visionMission: string;
          avatarUrl: string;
          voteCount: bigint;
        }) => {
          const cid = Number(c.id);
          return {
            id: cid,
            number: c.number,
            name: c.name,
            specialist: c.specialist,
            department: c.department,
            nip: c.nip,
            experience: c.experience,
            visionMission: c.visionMission,
            programs: CANDIDATE_PROGRAMS_MAP[cid] || [
              "Transparansi kredensialing dan audit medis berkala berbasis data",
              "Pengembangan kompetensi berkelanjutan bagi staf medis fungsional",
            ],
            avatarUrl: c.avatarUrl,
            voteCount: Number(c.voteCount),
          };
        }
      );

      setCandidates(mappedCandidates);
      setIsElectionActive(Boolean(activeFlag));
      setTotalWhitelistedOnChain(Number(whitelistedCount));
      setCurrentBlock(Number(blockNum));

      setVoterStatus({
        isWhitelisted: Boolean(rawVoter[0]),
        hasVoted: Boolean(rawVoter[1]),
        votedCandidateId: Boolean(rawVoter[1]) ? Number(rawVoter[2]) : null,
        votedTimestamp: Number(rawVoter[3]),
        doctorName: rawVoter[4] || activeCredential.name,
        department: rawVoter[5] || activeCredential.department,
      });

      // Fetch real VoteCast events from the blockchain
      try {
        const voteFilter = contract.filters.VoteCast();
        const logs = await contract.queryFilter(voteFilter, MEDVOTE_DEPLOY_BLOCK);
        const parsedEvents: OnChainAuditEvent[] = logs
          .map((log) => {
            const eventLog = log as ethers.EventLog;
            const voterAddr = String(eventLog.args[0]);
            const voterName = String(eventLog.args[1]);
            const candId = Number(eventLog.args[2]);
            const candName = String(eventLog.args[3]);
            const ts = Number(eventLog.args[4]);
            const dateStr =
              ts > 0
                ? new Date(ts * 1000).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "On-Chain Confirmed";

            return {
              txHash: eventLog.transactionHash,
              blockNumber: eventLog.blockNumber,
              eventName: "VoteCast" as const,
              voterOrActor: `${voterAddr.slice(0, 6)}...${voterAddr.slice(-4)}`,
              voterLabel: voterName,
              candidateId: candId,
              candidateName: candName,
              timestamp: dateStr,
            };
          })
          .reverse();

        setAuditEvents(parsedEvents);
      } catch {
        // Keep existing events if log range query times out
      }
    } catch (err) {
      console.error("Failed to sync from blockchain:", err);
    } finally {
      setIsLoadingChain(false);
    }
  }, [activeCredential, getProvider]);

  useEffect(() => {
    setIsLoadingChain(true);
    syncOnChainData();
  }, [syncOnChainData]);

  const totalVotes = useMemo(
    () => candidates.reduce((acc, item) => acc + item.voteCount, 0),
    [candidates]
  );

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

  // REAL ON-CHAIN VOTE TRANSACTION
  const handleCastVote = async (candidate: MedVoteCandidate) => {
    setErrorBanner(null);

    if (isAdminRole) {
      setErrorBanner(
        "Smart Contract Revert — AdminCannotVote(): Komisi Pemilihan Independen (Panitia) bertugas sebagai penyelenggara netral dan tidak memiliki hak suara."
      );
      return;
    }

    if (!isElectionActive) {
      setErrorBanner(
        "Smart Contract Revert — ElectionNotActive(): Periode pemungutan suara sedang ditutup oleh Komisi Pemilihan."
      );
      return;
    }

    if (!voterStatus.isWhitelisted) {
      setErrorBanner(
        `Smart Contract Revert — VoterNotWhitelisted(): Kredensial wallet ${activeCredential.address.slice(
          0,
          10
        )}... (${activeCredential.name}) belum terdaftar pada Daftar Pemilih Tetap (DPT) Komite Medik.`
      );
      return;
    }

    if (voterStatus.hasVoted) {
      setErrorBanner(
        "Smart Contract Revert — VoterAlreadyVoted(): Kredensial dokter ini telah menggunakan hak suaranya di Smart Contract (1 Dokter = 1 Hak Suara)."
      );
      return;
    }

    setPendingCandidate(candidate);
    setTxStage("signing");

    try {
      const provider = getProvider();
      const signer = new ethers.Wallet(activeCredential.privateKey, provider);
      const contract = new ethers.Contract(MEDVOTE_CONTRACT_ADDRESS, MEDVOTE_ABI, signer);

      setTxStage("broadcasting");
      const tx = await contract.vote(candidate.id, {
        type: 2,
        maxFeePerGas: 0,
        maxPriorityFeePerGas: 0,
        gasLimit: 350000,
      });

      setLatestTxHash(tx.hash);
      setTxStage("mining");

      const receipt = await tx.wait();
      setLatestBlockNum(Number(receipt.blockNumber));

      await syncOnChainData();
      setTxStage("confirmed");
    } catch (err: unknown) {
      setTxStage("idle");
      const message = err instanceof Error ? err.message : String(err);
      setErrorBanner(`Transaksi On-Chain Gagal: ${message.slice(0, 160)}`);
    }
  };

  // REAL ON-CHAIN ADMIN REGISTER VOTER (WHITELIST)
  const handleRegisterVoterOnChain = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner(null);
    setAdminSuccessMsg(null);

    if (!isAdminRole) {
      setErrorBanner(
        "Smart Contract Revert — UnauthorizedAdmin(): Hanya Wallet Otoritas Komisi Pemilihan yang diizinkan menambah DPT."
      );
      return;
    }

    if (!ethers.isAddress(regWalletAddr.trim())) {
      setErrorBanner("Alamat wallet EVM tidak valid. Pastikan diawali 0x dan sepanjang 42 karakter.");
      return;
    }

    setIsAdminSubmitting(true);
    try {
      const provider = getProvider();
      const adminSigner = new ethers.Wallet(activeCredential.privateKey, provider);
      const contract = new ethers.Contract(MEDVOTE_CONTRACT_ADDRESS, MEDVOTE_ABI, adminSigner);

      const tx = await contract.registerVoter(
        regWalletAddr.trim(),
        regDocName.trim() || "Staf Medis Fungsional",
        regDocDept.trim() || "Komite Medik RSUD",
        {
          type: 2,
          maxFeePerGas: 0,
          maxPriorityFeePerGas: 0,
          gasLimit: 350000,
        }
      );

      const receipt = await tx.wait();
      await syncOnChainData();

      setAdminSuccessMsg({
        message: `Dokter "${regDocName}" (${regWalletAddr.slice(0, 8)}...) berhasil didaftarkan ke DPT Smart Contract.`,
        txHash: tx.hash,
        blockNumber: Number(receipt.blockNumber),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorBanner(`Gagal mendaftarkan DPT: ${message.slice(0, 160)}`);
    } finally {
      setIsAdminSubmitting(false);
    }
  };

  // REAL ON-CHAIN ADMIN ADD CANDIDATE
  const handleAddCandidateOnChain = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner(null);
    setAdminSuccessMsg(null);

    if (!isAdminRole) {
      setErrorBanner(
        "Smart Contract Revert — UnauthorizedAdmin(): Hanya Wallet Otoritas Komisi Pemilihan yang diizinkan mendaftarkan kandidat."
      );
      return;
    }

    if (!newCandName.trim() || !newCandSpec.trim()) {
      setErrorBanner("EmptyCandidateName(): Nama lengkap dokter dan gelar spesialisasi wajib diisi.");
      return;
    }

    setIsAdminSubmitting(true);
    try {
      const provider = getProvider();
      const adminSigner = new ethers.Wallet(activeCredential.privateKey, provider);
      const contract = new ethers.Contract(MEDVOTE_CONTRACT_ADDRESS, MEDVOTE_ABI, adminSigner);

      const tx = await contract.addCandidate(
        newCandName.trim(),
        newCandSpec.trim(),
        newCandDept.trim() || "KSM Spesialis Terpadu",
        newCandNip.trim() || "19820714 200901 1 008",
        "14 Tahun Pengabdian Klinis",
        newCandVision.trim() ||
          "Peningkatan mutu klinis, tata kelola komite medik yang akuntabel, dan perlindungan profesi dokter.",
        "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
        {
          type: 2,
          maxFeePerGas: 0,
          maxPriorityFeePerGas: 0,
          gasLimit: 550000,
        }
      );

      const receipt = await tx.wait();
      await syncOnChainData();

      setAdminSuccessMsg({
        message: `Kandidat "${newCandName}" berhasil ditambahkan secara permanen ke Smart Contract.`,
        txHash: tx.hash,
        blockNumber: Number(receipt.blockNumber),
      });
      setNewCandName("");
      setNewCandSpec("");
      setNewCandDept("");
      setNewCandNip("");
      setNewCandVision("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorBanner(`Gagal mendaftarkan kandidat: ${message.slice(0, 160)}`);
    } finally {
      setIsAdminSubmitting(false);
    }
  };

  // REAL ON-CHAIN TOGGLE ELECTION STATUS
  const handleToggleElectionStatus = async () => {
    if (!isAdminRole) return;
    setIsAdminSubmitting(true);
    setErrorBanner(null);
    try {
      const provider = getProvider();
      const adminSigner = new ethers.Wallet(activeCredential.privateKey, provider);
      const contract = new ethers.Contract(MEDVOTE_CONTRACT_ADDRESS, MEDVOTE_ABI, adminSigner);

      const tx = await contract.setElectionStatus(!isElectionActive, {
        type: 2,
        maxFeePerGas: 0,
        maxPriorityFeePerGas: 0,
        gasLimit: 200000,
      });
      const receipt = await tx.wait();
      await syncOnChainData();
      setAdminSuccessMsg({
        message: `Status Bilik Suara berhasil diubah menjadi ${
          !isElectionActive ? "AKTIF (DIBUKA)" : "DITUTUP SEMENTARA"
        }.`,
        txHash: tx.hash,
        blockNumber: Number(receipt.blockNumber),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorBanner(`Gagal mengubah status pemilihan: ${message.slice(0, 140)}`);
    } finally {
      setIsAdminSubmitting(false);
    }
  };

  const isMobileViewport = deviceMode === "mobile";

  return (
    /* OUTER CONTAINER: relative + overflow-hidden keeps modals strictly inside WorkView frame */
    <div className="relative w-full h-full bg-slate-50 text-slate-900 flex flex-col overflow-hidden selection:bg-sky-500 selection:text-white font-sans">
      <div className="flex-1 w-full h-full overflow-y-auto flex flex-col">
        {/* =====================================================================
            1. TOP NAVBAR: Hospital Identity, Live Network & Active Credential
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
                    On-Chain E-Voting
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-none mt-0.5">
                  Komite Medik RSUD Kabupaten Bintan &bull; Smart Contract Governance
                </p>
              </div>
            </div>

            {/* Right Controls: Live Network Status & Credential Selector */}
            <div className="flex flex-wrap items-center gap-1.5">
              {!isMobileViewport && (
                <a
                  href={MEDVOTE_EXPLORER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[10.5px] font-mono text-sky-900 transition-colors"
                  title="Lihat Smart Contract di Blockscout Explorer"
                >
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                  <span className="font-semibold">{MEDVOTE_NETWORK_NAME}</span>
                  <span className="text-sky-300">|</span>
                  <span className="text-sky-600 font-bold">Block #{currentBlock}</span>
                  <ExternalLink className="w-3 h-3 text-sky-500" />
                </a>
              )}

              {/* Active Wallet Credential Selector */}
              <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-md px-2.5 py-1">
                <KeyRound className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <select
                  aria-label="Kredensial Wallet Aktif"
                  value={selectedCredIdx}
                  onChange={(e) => {
                    const nextIdx = Number(e.target.value);
                    setSelectedCredIdx(nextIdx);
                    setErrorBanner(null);
                    setAdminSuccessMsg(null);
                    if (ONCHAIN_WALLET_CREDENTIALS[nextIdx].role === "admin") {
                      setActiveTab("admin");
                    }
                  }}
                  className="bg-transparent text-[11px] font-semibold text-slate-800 focus:outline-none cursor-pointer max-w-[170px] sm:max-w-[245px] truncate"
                >
                  {ONCHAIN_WALLET_CREDENTIALS.map((cred, idx) => (
                    <option key={cred.id} value={idx} className="bg-white text-slate-900">
                      {cred.role === "admin" ? "Komisi Pemilihan: " : "Staf Medis: "}
                      {cred.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Connected Wallet Address Pill */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-sky-500 text-white shadow-2xs">
                <Wallet className="w-3.5 h-3.5" />
                <span>
                  {activeCredential.address.slice(0, 6)}...{activeCredential.address.slice(-4)}
                </span>
              </div>
            </div>
          </div>

          {/* Sub-bar: Credential Status & Role Separation Indicator */}
          <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500">Identitas Kredensial:</span>
              <span className="font-bold text-slate-900">{activeCredential.name}</span>
              <span className="text-slate-300 hidden sm:inline">&bull;</span>
              <span className="text-slate-500 text-[10.5px] hidden sm:inline">
                {activeCredential.department}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {isAdminRole ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-mono font-bold">
                  <ShieldCheck className="w-3 h-3 text-indigo-600" />
                  <span>OTORITAS PANITIA (NON-PEMILIH)</span>
                </span>
              ) : voterStatus.isWhitelisted ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-mono font-bold">
                  <CheckCircle2 className="w-3 h-3 text-sky-500" />
                  <span>TERDAFTAR DPT KOMITE MEDIK</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono font-bold">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>BELUM TERDAFTAR DPT</span>
                </span>
              )}

              {!isAdminRole && voterStatus.hasVoted && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>SUDAH MEMILIH (ON-CHAIN)</span>
                </span>
              )}
            </div>
          </div>
        </header>

        {/* =====================================================================
            2. HERO & ON-CHAIN GOVERNANCE BANNER
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
                    <span>{isElectionActive ? "BILIK SUARA AKTIF" : "PEMILIHAN DITUTUP"}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Periode Masa Bakti 2026 &ndash; 2029
                  </span>
                </div>

                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  Pemilihan Ketua Komite Medik RSUD Kabupaten Bintan
                </h1>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  Sistem pemungutan suara elektronik terdesentralisasi berbasis Smart Contract.
                  Menjamin asas 1 Dokter = 1 Suara, pemisahan mutlak wewenang Komisi Pemilihan
                  (non-pemilih), serta transparansi audit publik secara real-time.
                </p>
              </div>

              {/* Live On-Chain Metrics */}
              <div className="grid grid-cols-3 gap-2 shrink-0">
                <div className="bg-white border border-sky-200 rounded-lg p-2.5 text-center shadow-2xs">
                  <div className="text-[10px] font-mono uppercase text-slate-500">Suara Masuk</div>
                  <div className="text-base sm:text-lg font-extrabold text-sky-600 font-mono">
                    {isLoadingChain ? "..." : totalVotes}
                  </div>
                  <div className="text-[9.5px] text-slate-400">On-Chain Verified</div>
                </div>
                <div className="bg-white border border-sky-200 rounded-lg p-2.5 text-center shadow-2xs">
                  <div className="text-[10px] font-mono uppercase text-slate-500">DPT Terdaftar</div>
                  <div className="text-base sm:text-lg font-extrabold text-slate-900 font-mono">
                    {isLoadingChain ? "..." : totalWhitelistedOnChain}
                  </div>
                  <div className="text-[9.5px] text-slate-400">Staf Medis Sah</div>
                </div>
                <div className="bg-white border border-sky-200 rounded-lg p-2.5 text-center shadow-2xs">
                  <div className="text-[10px] font-mono uppercase text-slate-500">Partisipasi</div>
                  <div className="text-base sm:text-lg font-extrabold text-sky-500 font-mono">
                    {totalWhitelistedOnChain > 0
                      ? Math.min(100, Math.round((totalVotes / totalWhitelistedOnChain) * 100))
                      : 0}
                    %
                  </div>
                  <div className="text-[9.5px] text-slate-400">Quorum Komite</div>
                </div>
              </div>
            </div>

            {/* Deployed Smart Contract Address & Public Explorer Link */}
            <div className="mt-3 pt-2.5 border-t border-sky-200/70 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-slate-500 shrink-0">Smart Contract Address:</span>
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

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={syncOnChainData}
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-sky-600 transition-colors cursor-pointer"
                  title="Sinkronisasi ulang state langsung dari Smart Contract"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingChain ? "animate-spin" : ""}`} />
                  <span>Sync Node</span>
                </button>
                <a
                  href={MEDVOTE_EXPLORER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 font-bold transition-colors"
                >
                  <span>Blockscout Explorer</span>
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
              <span>Perolehan Suara &amp; Log Transaksi</span>
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
              <span>Panel Komisi Pemilihan (DPT &amp; Kandidat)</span>
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
              <span>Kode Smart Contract (MedVote.sol)</span>
            </button>
          </div>
        </div>

        {/* Error / Smart Contract Revert Alert Banner */}
        {errorBanner && (
          <div className="px-3 sm:px-5 pt-3">
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-start justify-between gap-3 text-xs text-rose-900">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-rose-700 font-mono">
                    Penolakan Smart Contract (Transaction Reverted)
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
              {/* Role Notice if Admin is viewing Bilik Suara */}
              {isAdminRole && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 flex items-center justify-between gap-2 text-xs text-indigo-950">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>
                      Anda sedang masuk sebagai{" "}
                      <strong>Sekretariat Panitia Pemilihan (Komisi Independen)</strong>. Sesuai
                      tata tertib pemilihan, Panitia tidak memiliki hak pilih dan hanya berwenang
                      mengelola DPT pada tab <strong>Panel Komisi Pemilihan</strong>.
                    </span>
                  </div>
                </div>
              )}

              {/* Voter Status Notice if Doctor has already voted on-chain */}
              {!isAdminRole && voterStatus.hasVoted && (
                <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-sky-900">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>
                      Hak suara Anda (<strong>{activeCredential.name}</strong>) untuk{" "}
                      <strong className="text-slate-900">
                        {candidates.find((c) => c.id === voterStatus.votedCandidateId)?.name}
                      </strong>{" "}
                      telah tercatat permanen di Smart Contract.
                    </span>
                  </div>
                  <a
                    href={MEDVOTE_EXPLORER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[10.5px] text-sky-700 bg-white px-2.5 py-1 rounded border border-sky-200 font-bold hover:bg-sky-100"
                  >
                    <span>Verifikasi di Blockscout</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Loading Skeleton or Candidate Cards */}
              {isLoadingChain && candidates.length === 0 ? (
                <div className="py-14 flex flex-col items-center justify-center gap-2 text-sky-600 font-mono text-xs">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Memuat data kandidat dari Smart Contract ({MEDVOTE_CONTRACT_ADDRESS})...</span>
                </div>
              ) : (
                <div
                  className={`grid gap-3.5 ${
                    isMobileViewport ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
                  }`}
                >
                  {candidates.map((cand) => {
                    const percentage =
                      totalVotes > 0 ? Math.round((cand.voteCount / totalVotes) * 100) : 0;
                    const isChosenByCurrent =
                      !isAdminRole &&
                      voterStatus.hasVoted &&
                      voterStatus.votedCandidateId === cand.id;

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

                            <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-xs border border-sky-200 font-mono text-xs font-extrabold text-sky-600 shadow-2xs">
                              KANDIDAT #{cand.number}
                            </div>

                            <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-sky-500 text-white font-mono text-xs font-bold flex items-center gap-1 shadow-2xs">
                              <span>{cand.voteCount}</span>
                              <span className="text-[10px] text-sky-100">Suara ({percentage}%)</span>
                            </div>

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
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-sky-400 to-sky-600 transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>

                          <button
                            type="button"
                            disabled={isAdminRole || voterStatus.hasVoted}
                            onClick={() => handleCastVote(cand)}
                            className={`w-full py-2.5 px-3 rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                              isAdminRole
                                ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                                : isChosenByCurrent
                                ? "bg-sky-50 border border-sky-400 text-sky-700 cursor-default"
                                : voterStatus.hasVoted
                                ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-sky-500 hover:bg-sky-600 text-white shadow-xs cursor-pointer"
                            }`}
                          >
                            {isAdminRole ? (
                              <>
                                <Lock className="w-3.5 h-3.5" />
                                <span>Panitia Pemilihan (Non-Pemilih)</span>
                              </>
                            ) : isChosenByCurrent ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                                <span>Pilihan Anda (Tercatat On-Chain)</span>
                              </>
                            ) : voterStatus.hasVoted ? (
                              <>
                                <Lock className="w-3.5 h-3.5" />
                                <span>Hak Suara Telah Digunakan</span>
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-4 h-4" />
                                <span>Berikan Suara &bull; Kandidat #{cand.number}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* -----------------------------------------------------------------
              TAB 2: PEROLEHAN SUARA & LOG TRANSAKSI ON-CHAIN
             ----------------------------------------------------------------- */}
          {activeTab === "leaderboard" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left: Real-Time Percentage Chart */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-sky-500" />
                      <span>Rekapitulasi Perolehan Suara</span>
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Data real-time dari fungsi Smart Contract{" "}
                      <code className="text-sky-600">getResults()</code>
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

              {/* Right: Real On-Chain Event Log with Direct Blockscout Links */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-sky-500" />
                      <span>Jejak Audit Transaksi Blockchain (Event VoteCast)</span>
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Setiap transaksi tercatat permanen dan dapat diverifikasi langsung di
                      Blockscout Explorer
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
                      className="p-2.5 rounded-lg bg-slate-50 hover:bg-sky-50/50 border border-slate-200 hover:border-sky-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                            {ev.eventName}
                          </span>
                          <a
                            href={`${MEDVOTE_EXPLORER_BASE}/tx/${ev.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[11px] text-sky-600 hover:text-sky-800 font-bold truncate inline-flex items-center gap-1"
                          >
                            <span>Tx: {ev.txHash.slice(0, 18)}...</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>

                        <div className="text-[11px] text-slate-600">
                          <span className="text-slate-400">Pemilih:</span>{" "}
                          <span className="font-mono text-slate-900 font-semibold">
                            {ev.voterOrActor}
                          </span>{" "}
                          <span className="text-sky-600 font-medium">&bull; {ev.voterLabel}</span>
                        </div>

                        {ev.candidateName && (
                          <div className="text-[11px] text-slate-500">
                            Kandidat Dipilih:{" "}
                            <span className="text-slate-900 font-semibold">{ev.candidateName}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-left sm:text-right font-mono text-[10px] text-slate-500 shrink-0 space-y-0.5">
                        <div className="text-sky-600 font-bold">Block #{ev.blockNumber}</div>
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
              TAB 3: PANEL KOMISI PEMILIHAN (DPT WHITELIST & KANDIDAT)
             ----------------------------------------------------------------- */}
          {activeTab === "admin" && (
            <div className="space-y-3">
              {/* Role Access Control Banner */}
              {!isAdminRole && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-between gap-3 text-xs text-amber-900">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      <strong>Mode Baca (Read-Only):</strong> Anda saat ini terhubung sebagai Pemilih
                      (<strong>{activeCredential.name}</strong>). Untuk mengeksekusi transaksi
                      pendaftaran DPT atau Kandidat ke Smart Contract, ubah kredensial di pojok
                      kanan atas ke{" "}
                      <strong>Komisi Pemilihan: Sekretariat Panitia Pemilihan Komite Medik</strong>.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCredIdx(4)}
                    className="px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-mono text-[10.5px] font-bold shrink-0 cursor-pointer"
                  >
                    Beralih ke Panitia
                  </button>
                </div>
              )}

              {adminSuccessMsg && (
                <div className="bg-sky-50 border border-sky-300 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2 text-xs text-sky-950">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                    <span className="font-medium">
                      {adminSuccessMsg.message} (Block #{adminSuccessMsg.blockNumber})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`${MEDVOTE_EXPLORER_BASE}/tx/${adminSuccessMsg.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-sky-200 text-sky-700 font-mono text-[10.5px] font-bold hover:bg-sky-100"
                    >
                      <span>Lihat Tx di Blockscout</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setAdminSuccessMsg(null)}
                      className="text-sky-600 hover:text-sky-900 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left: Register Doctor Wallet into DPT (Whitelist) */}
                <form
                  onSubmit={handleRegisterVoterOnChain}
                  className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-sky-500" />
                        <span>Registrasi Dokter ke DPT (Whitelist Wallet)</span>
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Fungsi Smart Contract:{" "}
                        <code className="text-sky-600 font-semibold">
                          registerVoter(address, name, department)
                        </code>
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-mono text-[10px] font-bold">
                      onlyAdmin
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Alamat Wallet EVM Dokter *
                      </label>
                      <input
                        type="text"
                        disabled={!isAdminRole || isAdminSubmitting}
                        value={regWalletAddr}
                        onChange={(e) => setRegWalletAddr(e.target.value)}
                        placeholder="0x..."
                        className="w-full rounded-lg bg-slate-50 border border-slate-300 px-2.5 py-1.5 font-mono text-xs text-sky-800 focus:outline-none focus:border-sky-500 disabled:opacity-60"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Nama Lengkap &amp; Gelar Dokter *
                        </label>
                        <input
                          type="text"
                          disabled={!isAdminRole || isAdminSubmitting}
                          value={regDocName}
                          onChange={(e) => setRegDocName(e.target.value)}
                          placeholder="dr. Kevin Pratama, Sp.OT"
                          className="w-full rounded-lg bg-slate-50 border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          KSM / Departemen *
                        </label>
                        <input
                          type="text"
                          disabled={!isAdminRole || isAdminSubmitting}
                          value={regDocDept}
                          onChange={(e) => setRegDocDept(e.target.value)}
                          placeholder="KSM Orthopaedi & Traumatologi"
                          className="w-full rounded-lg bg-slate-50 border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 disabled:opacity-60"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!isAdminRole || isAdminSubmitting}
                    className="w-full py-2 rounded-lg bg-sky-500 hover:bg-sky-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-mono text-xs font-bold uppercase cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    {isAdminSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memproses Transaksi On-Chain...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Otorisasi Hak Pilih ke Smart Contract</span>
                      </>
                    )}
                  </button>

                  {/* Election Status Switcher */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Status Periode Pemungutan Suara
                      </div>
                      <div className="text-[10.5px] text-slate-500">
                        Buka atau tutup sementara akses Bilik Suara pada Smart Contract
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={!isAdminRole || isAdminSubmitting}
                      onClick={handleToggleElectionStatus}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-colors ${
                        !isAdminRole
                          ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                          : isElectionActive
                          ? "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100 cursor-pointer"
                          : "bg-sky-50 border-sky-300 text-sky-700 hover:bg-sky-100 cursor-pointer"
                      }`}
                    >
                      {isElectionActive ? "Tutup Bilik Suara" : "Buka Bilik Suara"}
                    </button>
                  </div>
                </form>

                {/* Right: Add Candidate Form */}
                <form
                  onSubmit={handleAddCandidateOnChain}
                  className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-sky-500" />
                        <span>Registrasi Kandidat Ketua Komite Medik</span>
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
                        disabled={!isAdminRole || isAdminSubmitting}
                        value={newCandName}
                        onChange={(e) => setNewCandName(e.target.value)}
                        placeholder="dr. Lukman Hakim, Sp.OG(K)"
                        className="w-full rounded-lg bg-slate-50 border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Spesialisasi Medis *
                      </label>
                      <input
                        type="text"
                        disabled={!isAdminRole || isAdminSubmitting}
                        value={newCandSpec}
                        onChange={(e) => setNewCandSpec(e.target.value)}
                        placeholder="Spesialis Obstetri & Ginekologi"
                        className="w-full rounded-lg bg-slate-50 border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        KSM / Departemen Rumah Sakit
                      </label>
                      <input
                        type="text"
                        disabled={!isAdminRole || isAdminSubmitting}
                        value={newCandDept}
                        onChange={(e) => setNewCandDept(e.target.value)}
                        placeholder="KSM Kebidanan & Kandungan"
                        className="w-full rounded-lg bg-slate-50 border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        NIP Dokter
                      </label>
                      <input
                        type="text"
                        disabled={!isAdminRole || isAdminSubmitting}
                        value={newCandNip}
                        onChange={(e) => setNewCandNip(e.target.value)}
                        placeholder="19820714 200901 1 008"
                        className="w-full rounded-lg bg-slate-50 border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Ringkasan Visi &amp; Misi Kandidat
                    </label>
                    <textarea
                      rows={2}
                      disabled={!isAdminRole || isAdminSubmitting}
                      value={newCandVision}
                      onChange={(e) => setNewCandVision(e.target.value)}
                      placeholder="Penguatan mutu pelayanan maternal-perinatal dan transparansi komite medik..."
                      className="w-full rounded-lg bg-slate-50 border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 disabled:opacity-60"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!isAdminRole || isAdminSubmitting}
                    className="w-full py-2 rounded-lg bg-sky-500 hover:bg-sky-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-mono text-xs font-bold uppercase cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    {isAdminSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memproses Transaksi On-Chain...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Simpan Kandidat ke Smart Contract</span>
                      </>
                    )}
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
                      Deployed at <code className="text-sky-600">{MEDVOTE_CONTRACT_ADDRESS}</code> (Block #{MEDVOTE_DEPLOY_BLOCK})
                    </p>
                  </div>
                  <a
                    href={MEDVOTE_EXPLORER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-mono text-[10px] font-bold inline-flex items-center gap-1"
                  >
                    <span>Explorer</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <pre className="p-3 rounded-lg bg-slate-900 text-sky-300 font-mono text-[11px] overflow-x-auto max-h-[340px] leading-relaxed">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MedVote {
    error UnauthorizedAdmin();
    error AdminCannotVote();
    error ElectionNotActive();
    error VoterNotWhitelisted();
    error VoterAlreadyVoted();

    address public immutable electionAdmin;
    bool public isElectionActive;
    uint256 public totalVotesCast;

    modifier onlyAdmin() {
        if (msg.sender != electionAdmin) revert UnauthorizedAdmin();
        _;
    }

    function registerVoter(
        address _doctorWallet,
        string calldata _doctorName,
        string calldata _department
    ) external onlyAdmin {
        if (_doctorWallet == address(0) || _doctorWallet == electionAdmin) {
            revert AdminCannotVote();
        }
        voters[_doctorWallet].isWhitelisted = true;
        voters[_doctorWallet].doctorName = _doctorName;
        voters[_doctorWallet].department = _department;
    }

    function vote(uint256 _candidateId) external {
        if (!isElectionActive) revert ElectionNotActive();
        if (msg.sender == electionAdmin) revert AdminCannotVote();

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
        emit VoteCast(msg.sender, sender.doctorName, _candidateId, candidates[_candidateId].name, block.timestamp);
    }
}`}
                </pre>
              </div>

              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Ethers.js Human-Readable ABI</h2>
                    <p className="text-[11px] text-slate-500">
                      Interface interaksi langsung ke node RPC EVM
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(JSON.stringify(MEDVOTE_ABI, null, 2), "abi")}
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
                  {JSON.stringify(MEDVOTE_ABI, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =====================================================================
          5. REAL ON-CHAIN BLOCKCHAIN TRANSACTION MODAL
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
                    ? "Transaksi Suara Dikonfirmasi di Blockchain!"
                    : "Mengirim Transaksi ke Smart Contract..."}
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

            {/* Step-by-Step Real Blockchain Progress */}
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
                  1. Tanda Tangan ECDSA Wallet ({activeCredential.address.slice(0, 8)}...)
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
                  2. Broadcast eth_sendRawTransaction ke Node EVM
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
                  3. Eksekusi Smart Contract &amp; Konfirmasi Blok
                </span>
              </div>
            </div>

            {/* Confirmed Receipt with Real Blockscout Link */}
            {txStage === "confirmed" && (
              <div className="p-3 rounded-lg bg-slate-50 border border-sky-200 space-y-1.5 font-mono text-[10.5px]">
                <div className="flex items-center justify-between">
                  <span className="text-sky-700 font-bold">BUKTI TRANSAKSI ON-CHAIN:</span>
                  <a
                    href={`${MEDVOTE_EXPLORER_BASE}/tx/${latestTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-800 font-bold underline"
                  >
                    <span>Buka di Blockscout</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="text-slate-700 break-all">
                  <span className="text-slate-400">TxHash:</span> {latestTxHash}
                </div>
                <div className="flex items-center justify-between text-sky-700 font-bold pt-1">
                  <span>Confirmed Block: #{latestBlockNum}</span>
                  <span>Contract: {MEDVOTE_CONTRACT_ADDRESS.slice(0, 10)}...</span>
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
                  Lihat Rekapitulasi &amp; Log
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
    </div>
  );
}
