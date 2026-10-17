export interface MedVoteCandidate {
  id: number;
  number: string;
  name: string;
  specialist: string;
  department: string;
  nip: string;
  experience: string;
  visionMission: string;
  programs: string[];
  avatarUrl: string;
  voteCount: number;
}

export interface OnChainAuditEvent {
  txHash: string;
  parentHash: string;
  blockNumber: number;
  eventName: "VoteCast" | "VotersWhitelisted" | "CandidateAdded" | "ElectionStatusChanged";
  voterOrActor: string;
  voterLabel?: string;
  candidateId?: number;
  candidateName?: string;
  timestamp: string;
  gasUsed: string;
  signature?: string;
}

export interface DoctorWalletProfile {
  address: string;
  name: string;
  department: string;
  role: "voter" | "admin" | "unregistered";
  isWhitelisted: boolean;
  hasVoted: boolean;
  votedCandidateId: number | null;
  txHash?: string;
}

export const MEDVOTE_CONTRACT_ADDRESS = "0x7F4c89A2d3eB1095F8160c9E239A1d2B942e881A";
export const MEDVOTE_NETWORK_NAME = "Polygon Amoy Testnet";
export const MEDVOTE_CHAIN_ID = 80002;
export const MEDVOTE_RPC_URL = "https://rpc-amoy.polygon.technology";
export const MEDVOTE_EXPLORER_URL = `https://amoy.polygonscan.com/address/${MEDVOTE_CONTRACT_ADDRESS}`;

/**
 * Compute real cryptographic SHA-256 hash using Web Crypto API (SubtleCrypto)
 */
export async function computeSha256Hex(payload: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return "0x" + hashHex;
  }
  // Fallback deterministic hash if SubtleCrypto unavailable
  let h1 = 0xdeadbeef ^ payload.length;
  let h2 = 0x41c6ce57 ^ payload.length;
  for (let i = 0, ch; i < payload.length; i++) {
    ch = payload.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hex =
    (h1 >>> 0).toString(16).padStart(8, "0") +
    (h2 >>> 0).toString(16).padStart(8, "0");
  return "0x" + hex.repeat(4);
}

export const INITIAL_CANDIDATES: MedVoteCandidate[] = [
  {
    id: 0,
    number: "01",
    name: "dr. Hendra Wijaya, Sp.PD-KGEH, FINASIM",
    specialist: "Spesialis Penyakit Dalam — Konsultan Gastroentero-Hepatologi",
    department: "KSM Penyakit Dalam",
    nip: "19780412 200501 1 004",
    experience: "18 Tahun Pengabdian Klinis",
    visionMission:
      "Transformasi tata kelola klinis berbasis bukti (Evidence-Based Medicine), kemandirian kredensialing staf medis, serta perlindungan hukum dokter yang responsif dan berkeadilan.",
    programs: [
      "Digitalisasi Clinical Pathway & E-Medical Audit berbasis standar akreditasi paripurna",
      "Pembentukan tim advokasi & pendampingan medikolegal 24 jam bagi seluruh staf medis",
      "Transparansi insentif jasa medis dan percepatan rekomendasi surat kewenangan klinis (RKK)",
    ],
    avatarUrl:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80",
    voteCount: 38,
  },
  {
    id: 1,
    number: "02",
    name: "dr. Siti Nurbaya, Sp.A(K), M.Kes",
    specialist: "Spesialis Kesehatan Anak — Konsultan Tumbuh Kembang",
    department: "KSM Kesehatan Anak",
    nip: "19810923 200801 2 009",
    experience: "15 Tahun Pengabdian Klinis",
    visionMission:
      "Mewujudkan Komite Medik yang inklusif, berorientasi pada keselamatan pasien (Patient Safety), dan harmonisasi beban kerja serta kesejahteraan dokter spesialis maupun dokter umum.",
    programs: [
      "Audit medis kolaboratif tanpa budaya menyalahkan (No-Blame Culture Clinical Review)",
      "Program dana hibah pendidikan berkelanjutan (CME/Simposium/Fellowship) staf medis",
      "Integrasi sistem mutu komite medik dengan rekam medis elektronik (RME) rumah sakit",
    ],
    avatarUrl:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80",
    voteCount: 44,
  },
  {
    id: 2,
    number: "03",
    name: "dr. Bambang Prakoso, Sp.B-KBD, FICS",
    specialist: "Spesialis Bedah — Konsultan Bedah Digestif",
    department: "KSM Bedah Sentral",
    nip: "19761105 200312 1 002",
    experience: "20 Tahun Pengabdian Klinis",
    visionMission:
      "Modernisasi standar prosedur operasional tindakan medis, penguatan etika disiplin profesi yang objektif, dan akselerasi pengadaan alat kesehatan berteknologi tinggi.",
    programs: [
      "Prioritas peremajaan instrumen kamar operasi, ICU, dan poliklinik spesialis",
      "Standarisasi beban jaga dan remunerasi berkeadilan bagi dokter subspesialis & umum",
      "Forum komunikasi bulanan terbuka antara Komite Medik dan jajaran Direksi RSUD",
    ],
    avatarUrl:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
    voteCount: 31,
  },
];

export const DEMO_WALLET_PROFILES: DoctorWalletProfile[] = [
  {
    address: "0x71C95911E9a5D330f4D621842EC243EE1343289A",
    name: "dr. Ahmad Fauzi, Sp.JP(K), FIHA",
    department: "KSM Jantung & Pembuluh Darah (Pemilih Sah)",
    role: "voter",
    isWhitelisted: true,
    hasVoted: false,
    votedCandidateId: null,
  },
  {
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    name: "dr. Ratna Sari, Sp.OG — Ketua Panitia Pemilihan",
    department: "Panitia Pemilihan Komite Medik (Election Admin)",
    role: "admin",
    isWhitelisted: true,
    hasVoted: false,
    votedCandidateId: null,
  },
  {
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    name: "dr. Kevin Pratama (Dokter Tamu / Belum Whitelist)",
    department: "Belum Terdaftar di DPT Komite Medik",
    role: "unregistered",
    isWhitelisted: false,
    hasVoted: false,
    votedCandidateId: null,
  },
];

export const INITIAL_AUDIT_EVENTS: OnChainAuditEvent[] = [
  {
    txHash: "0x94b8e2f10a3c7d6e8f21b4c9a120d8e7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1",
    parentHash: "0x61c3d9a82b5f4e107c8a9d2e3f4b5a6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f23",
    blockNumber: 14892310,
    eventName: "VoteCast",
    voterOrActor: "0x8A1f...39C2",
    voterLabel: "Anggota KSM Anestesiologi (Terverifikasi)",
    candidateId: 1,
    candidateName: "dr. Siti Nurbaya, Sp.A(K), M.Kes",
    timestamp: "3 menit yang lalu",
    gasUsed: "46,210",
    signature: "0x4c8f92e1a7b3d5091e2f8a4b6c7d0e1f2a3b4c5d6e7f8091a2b3c4d5e6f708191b",
  },
  {
    txHash: "0x61c3d9a82b5f4e107c8a9d2e3f4b5a6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f23",
    parentHash: "0x28f7a6c5d4e3b2a1908f7e6d5c4b3a29182736455463728190a1b2c3d4e5f607",
    blockNumber: 14892284,
    eventName: "VoteCast",
    voterOrActor: "0x4E9b...11A8",
    voterLabel: "Anggota KSM Radiologi (Terverifikasi)",
    candidateId: 0,
    candidateName: "dr. Hendra Wijaya, Sp.PD-KGEH, FINASIM",
    timestamp: "8 menit yang lalu",
    gasUsed: "46,198",
    signature: "0x91a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f801c",
  },
  {
    txHash: "0x28f7a6c5d4e3b2a1908f7e6d5c4b3a29182736455463728190a1b2c3d4e5f607",
    parentHash: "0x11a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f80",
    blockNumber: 14892190,
    eventName: "VoteCast",
    voterOrActor: "0xD21c...74F0",
    voterLabel: "Anggota KSM Bedah Saraf (Terverifikasi)",
    candidateId: 2,
    candidateName: "dr. Bambang Prakoso, Sp.B-KBD, FICS",
    timestamp: "15 menit yang lalu",
    gasUsed: "46,210",
    signature: "0x7f8091a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e1b",
  },
  {
    txHash: "0x11a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f80",
    parentHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    blockNumber: 14891802,
    eventName: "VotersWhitelisted",
    voterOrActor: "0x3C44...93BC",
    voterLabel: "Panitia Pemilihan (Batch DPT 125 Dokter)",
    timestamp: "2 jam yang lalu",
    gasUsed: "184,520",
    signature: "0x3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a1c",
  },
];

export const MEDVOTE_ABI_SUMMARY = [
  {
    type: "constructor",
    inputs: [
      { name: "_electionTitle", type: "string" },
      { name: "_hospitalName", type: "string" },
    ],
  },
  {
    type: "function",
    name: "vote",
    stateMutability: "nonpayable",
    inputs: [{ name: "_candidateId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "whitelistVotersBatch",
    stateMutability: "nonpayable",
    inputs: [{ name: "_doctorWallets", type: "address[]" }],
    outputs: [],
  },
  {
    type: "function",
    name: "addCandidate",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_name", type: "string" },
      { name: "_specialist", type: "string" },
      { name: "_visionMission", type: "string" },
      { name: "_avatarUrl", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "getResults",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "id", type: "uint256" },
          { name: "name", type: "string" },
          { name: "specialist", type: "string" },
          { name: "visionMission", type: "string" },
          { name: "avatarUrl", type: "string" },
          { name: "voteCount", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "event",
    name: "VoteCast",
    inputs: [
      { name: "voter", type: "address", indexed: true },
      { name: "candidateId", type: "uint256", indexed: true },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
];
