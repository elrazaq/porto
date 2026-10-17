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
  blockNumber: number;
  eventName: "VoteCast" | "VoterWhitelisted" | "VotersWhitelistedBatch" | "CandidateAdded";
  voterOrActor: string;
  voterLabel: string;
  candidateId?: number;
  candidateName?: string;
  timestamp: string;
}

export interface DoctorWalletCredential {
  id: string;
  name: string;
  department: string;
  role: "voter" | "admin";
  address: string;
  privateKey: string;
}

export const MEDVOTE_CONTRACT_ADDRESS = "0x31A5b9fb29304092626e06d720AC471c7aFa3aA5";
export const MEDVOTE_DEPLOY_TX_HASH =
  "0x290fb28b49072787fa0621f2b2a1b789bcbcde3302a8012403de76b4e18ad7a5";
export const MEDVOTE_DEPLOY_BLOCK = 37438715;
export const MEDVOTE_NETWORK_NAME = "Stability EVM Testnet";
export const MEDVOTE_CHAIN_ID = 20180427;
export const MEDVOTE_RPC_URL = "https://rpc.testnet.stabilityprotocol.com/zgt/try-it-out";
export const MEDVOTE_EXPLORER_BASE = "https://stability-testnet.blockscout.com";
export const MEDVOTE_EXPLORER_URL = `${MEDVOTE_EXPLORER_BASE}/address/${MEDVOTE_CONTRACT_ADDRESS}`;

export const CANDIDATE_PROGRAMS_MAP: Record<number, string[]> = {
  0: [
    "Digitalisasi Clinical Pathway & E-Medical Audit berbasis standar akreditasi paripurna",
    "Pembentukan tim advokasi & pendampingan medikolegal 24 jam bagi seluruh staf medis",
    "Transparansi insentif jasa medis dan percepatan rekomendasi surat kewenangan klinis (RKK)",
  ],
  1: [
    "Audit medis kolaboratif tanpa budaya menyalahkan (No-Blame Culture Clinical Review)",
    "Program dana hibah pendidikan berkelanjutan (CME/Simposium/Fellowship) staf medis",
    "Integrasi sistem mutu komite medik dengan rekam medis elektronik (RME) rumah sakit",
  ],
  2: [
    "Prioritas peremajaan instrumen kamar operasi, ICU, dan poliklinik spesialis",
    "Standarisasi beban jaga dan remunerasi berkeadilan bagi dokter subspesialis & umum",
    "Forum komunikasi bulanan terbuka antara Komite Medik dan jajaran Direksi RSUD",
  ],
};

export const ONCHAIN_WALLET_CREDENTIALS: DoctorWalletCredential[] = [
  {
    id: "voter-1",
    name: "dr. Ahmad Fauzi, Sp.JP(K), FIHA",
    department: "KSM Jantung & Pembuluh Darah",
    role: "voter",
    address: "0x78FaBc486213Db4951142EcE119e01587cA13C39",
    privateKey: "0xd6cf3fdfbaa14cba2595781b4536a9b4e51a4e8601fa13304a3e4c1ad45452ea",
  },
  {
    id: "voter-2",
    name: "dr. Rina Kartika, Sp.An-TI",
    department: "KSM Anestesiologi & Terapi Intensif",
    role: "voter",
    address: "0x4e30b1093191D96b98c6fb6b4049546E0faf8BCe",
    privateKey: "0x6340fd03f811215f6fcc96f556e6c18a4f52a07b22ba245cdebfc4165ea72ec6",
  },
  {
    id: "voter-3",
    name: "dr. Farhan Maulana, Sp.Rad",
    department: "KSM Radiologi Klinik",
    role: "voter",
    address: "0xb3980e4238A88d975f72f708084B5F10576a073D",
    privateKey: "0xc30697e01aab9a6e027f18da7ad617e926f59137fda79792e28c17b9d138cc7a",
  },
  {
    id: "unregistered-1",
    name: "dr. Kevin Pratama, Sp.OT",
    department: "KSM Orthopaedi & Traumatologi",
    role: "voter",
    address: "0x99b61dC9d2005a6806a50e988aEF69AF350522Ea",
    privateKey: "0x2ec3ac0057fa5cc05bd671e646cff22ebac6a0cca5f756770f5d9e7381a2fc4b",
  },
  {
    id: "admin",
    name: "Sekretariat Panitia Pemilihan Komite Medik",
    department: "Komisi Pemilihan Independen (Non-Pemilih)",
    role: "admin",
    address: "0xDD2F7d8F346d0414e73f4F270053000b6db63BB4",
    privateKey: "0x982e2dddb07edc5a2eb577cc1dbce068fb2ffcf52567407dba2262c6d268e357",
  },
];

export const MEDVOTE_ABI = [
  "error UnauthorizedAdmin()",
  "error AdminCannotVote()",
  "error ElectionNotActive()",
  "error VoterNotWhitelisted()",
  "error VoterAlreadyVoted()",
  "error InvalidCandidateId()",
  "error EmptyCandidateName()",
  "error EmptyBatchList()",
  "event CandidateAdded(uint256 indexed candidateId, string number, string name, string department)",
  "event VoterWhitelisted(address indexed voter, string doctorName, string department, address indexed addedBy)",
  "event VotersWhitelistedBatch(uint256 count, address indexed addedBy)",
  "event VoteCast(address indexed voter, string voterName, uint256 indexed candidateId, string candidateName, uint256 timestamp)",
  "event ElectionStatusChanged(bool isActive, uint256 timestamp)",
  "function electionAdmin() view returns (address)",
  "function electionTitle() view returns (string)",
  "function hospitalName() view returns (string)",
  "function isElectionActive() view returns (bool)",
  "function totalVotesCast() view returns (uint256)",
  "function totalWhitelisted() view returns (uint256)",
  "function getResults() view returns (tuple(uint256 id, string number, string name, string specialist, string department, string nip, string experience, string visionMission, string avatarUrl, uint256 voteCount)[])",
  "function getVoterStatus(address _voter) view returns (bool isWhitelisted, bool hasVoted, uint256 votedCandidateId, uint256 votedTimestamp, string doctorName, string department)",
  "function vote(uint256 _candidateId)",
  "function registerVoter(address _doctorWallet, string _doctorName, string _department)",
  "function whitelistVotersBatch(address[] _doctorWallets)",
  "function addCandidate(string _name, string _specialist, string _department, string _nip, string _experience, string _visionMission, string _avatarUrl)",
  "function setElectionStatus(bool _isActive)",
];
