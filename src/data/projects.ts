import React from "react";

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  category: string;
  badge: string;
  client: string;
  year: string;
  description: string;
  architectureHighlights: string[];
  techStack: string[];
  simulatedUrl: string;
}

export const FEATURED_PROJECTS: ProjectItem[] = [
  {
    id: "saman-coffee-roasters",
    number: "01",
    title: "SAMAN Specialty Coffee Roasters — Artisan Roastery & Nusantara Beans",
    category: "Vanilla Web Engineering (Pure HTML5 & Modern CSS3)",
    badge: "Pure HTML & CSS",
    client: "Specialty Coffee Roastery (Tanjung Pinang, Kepri)",
    year: "2019 — Present",
    description:
      "Modern luxury redesign of a specialty coffee roastery web platform. Built with zero external frameworks using pure semantic HTML5, modern CSS3 (Flexbox/Grid), and vanilla JavaScript. Features 9 single origin Nusantara beans, 3-phase roast philosophy, custom artisan date picker & select dropdowns, interactive cupping specs, and live WhatsApp ordering.",
    architectureHighlights: [
      "Zero-framework pure HTML5 & modern CSS3 architecture for sub-50ms paint times",
      "Interactive 9 Single Origin Nusantara coffee catalog with live grind calculator",
      "Bespoke Vanilla JS Custom Select & Calendar Date-Picker components",
      "3-Phase precision roasting telemetry showcase (Drying, Maillard, Development)",
      "Integrated table reservation (RSVP) & WhatsApp ordering integration",
    ],
    techStack: [
      "Pure HTML5",
      "Modern CSS3",
      "Vanilla JavaScript",
      "Custom Date Picker",
      "Custom Select UI",
      "Responsive Web Design",
      "Artisan Typography",
    ],
    simulatedUrl: "http://localhost:3000/projects/coffee-shop/index.html",
  },
  {
    id: "lava-cheese-pos",
    number: "02",
    title: "Lava Cheese Resto & Cafe — Tablet/Mobile Cloud POS System",
    category: "Fullstack Architecture (Next.js 15, Tailwind CSS, Zustand)",
    badge: "Next.js & Zustand",
    client: "Lava Cheese Batu 9 (Tanjung Pinang Timur)",
    year: "2024 — Production Demo",
    description:
      "High-performance cloud Point of Sale (POS) application engineered specifically for restaurant tablets and mobile cashiers. Features zero-lag instant cart with Zustand state store, multi-area table management (Indoor, Outdoor, VIP, Takeaway), fast cash denomination calculator & dynamic QRIS verification, and 58mm/80mm thermal receipt printer with ESC/POS formatting and CSS @media print.",
    architectureHighlights: [
      "Zustand atomic state store for zero-latency cart updates (<1KB footprint)",
      "Multi-area visual table management (Available, Occupied, Billing states)",
      "Fast cash denomination calculator with auto change calculation & QRIS",
      "Hardware ESC/POS thermal printing engine with 58mm/80mm roll support",
      "CSS @media print styling for direct thermal bluetooth/USB printer output",
      "Dual responsive layout tailored for tablet landscape and mobile cashier handheld",
    ],
    techStack: [
      "Next.js 15 (App Router)",
      "React 19",
      "Tailwind CSS",
      "Zustand Store",
      "ESC/POS Print Engine",
      "Web Print API",
      "Tablet & Mobile POS UI",
      "QRIS Dynamic Generator",
    ],
    simulatedUrl: "http://localhost:3000/pos",
  },
  {
    id: "nusantara-travel-astro",
    number: "03",
    title: "Nusantara Odyssey — Modern Ultra-Light Travel Platform",
    category: "Jamstack & Island Architecture (Astro & Tailwind CSS)",
    badge: "Astro & Tailwind",
    client: "Nusantara Odyssey Tour & Travel",
    year: "2024 — Production Demo",
    description:
      "Ultra-fast, mobile-optimized travel booking and destination discovery platform. Engineered with Astro and Tailwind CSS following a Zero-JS by default architecture. Features an atmospheric looping HTML5 video hero with cinematic overlay, transparent glassmorphism navbar, multi-parameter tour search bar, and high-performance responsive destination cards.",
    architectureHighlights: [
      "Zero-JS by default Astro architecture for sub-0.3s First Contentful Paint",
      "Seamless HTML5 background video loop with muted autoplay and poster fallback",
      "Dynamic glassmorphism navigation header with responsive mobile drawer",
      "Interactive 4-parameter destination query filter (Tujuan, Tanggal, Tamu)",
      "Mobile-first responsive card grid with pricing, itinerary specs & WhatsApp CTA",
      "100/100 Google Lighthouse performance score on mobile devices",
    ],
    techStack: [
      "Astro 4.x",
      "Tailwind CSS",
      "HTML5 Video API",
      "Zero-JS Architecture",
      "Mobile-First Responsive",
      "Glassmorphism UI",
      "WhatsApp Direct Booking",
    ],
    simulatedUrl: "http://localhost:3000/projects/travel-astro/index.html",
  },
  {
    id: "masjid-tv-signage",
    number: "04",
    title: "Masjid Al-Uswah — Android TV (16:9) Mosque Digital Signage & Prayer Engine",
    category: "Native Android TV (Kotlin, Jetpack Compose for TV, StateFlow)",
    badge: "Android TV & Kotlin",
    client: "Dewan Kemakmuran Masjid Agung Al-Uswah (Tanjungpinang)",
    year: "2024 — Production Demo",
    description:
      "Aplikasi Android TV native landscape 16:9 untuk sistem informasi digital masjid dan display jadwal sholat hisab otomatis Kemenag RI. Menggunakan arsitektur Kotlin, Jetpack Compose for TV (`androidx.tv.material3`), dan StateFlow engine untuk transisi status waktu: Standby Dashboard, Masuk Waktu Adzan (visual alarm & audio), Countdown Jeda Iqomah dengan warning beeper, dan Mode Redup Khotbah/Sholat (OLED anti-burn-in safe). Dilengkapi D-Pad leanback remote support, carousel kajian, running text warta, dan laporan keuangan.",
    architectureHighlights: [
      "Formula Astronomis Hisab Waktu Sholat Kemenag RI (+2 menit ihtiyat, rasio bayangan, koreksi elevasi dpl)",
      "Automated StateFlow Cycle: Standby -> Adzan Visual & Audio -> Iqomah Countdown -> Dim Sholat Screen",
      "Full D-Pad Leanback Remote TV Navigation (Up/Down/Left/Right/OK) & Keypad shortcuts",
      "Anti-Burn-In Protection with subtle periodic pixel orbiting (pixel shifting) & OLED-friendly black palette",
      "Multi-slide carousel agenda kajian, laporan keuangan infaq Jumat, dan jadwal petugas imam/khatib",
      "Low-overhead native memory footprint (<45MB RAM) optimized for Android TV Boxes & Smart TVs",
    ],
    techStack: [
      "Kotlin",
      "Android TV (Leanback)",
      "Jetpack Compose for TV",
      "StateFlow & Coroutines",
      "Kemenag Hisab Math Engine",
      "Android MediaPlayer / SoundPool",
      "D-Pad Remote Focus Engine",
      "OLED Anti-Burn-In Shifter",
    ],
    simulatedUrl: "http://localhost:3000/tv-masjid",
  },
  {
    id: "absensi-pegawai-integrated",
    number: "05",
    title: "PresensiKu Enterprise — Integrated Employee Attendance (Android & Web Admin)",
    category: "Fullstack & Mobile Engineering (Kotlin Android, Next.js, PostgreSQL)",
    badge: "Android & Next.js",
    client: "PT Teknologi Nusantara Enterprise",
    year: "2024 — Production Demo",
    description:
      "Sistem presensi pegawai terintegrasi multi-platform: Aplikasi Mobile Pegawai (Android Native Kotlin) dan Web Admin Dashboard (Next.js). Dilengkapi validasi ganda Geofencing GPS (Formula Haversine dengan deteksi anti-Mock/Fake GPS) dan pemindaian Dynamic QR Code (HMAC SHA-256 yang me-refresh token otomatis tiap 30 detik). Mendukung manajemen multi-shift fleksibel, kalender jadwal kerja per divisi, dan rekapitulasi laporan ekspor Excel/PDF.",
    architectureHighlights: [
      "Dual-viewport adaptive UI: Mode Desktop menampilkan Web Admin, Mode Mobile menampilkan Aplikasi Android",
      "Dynamic QR Code Engine: HMAC-SHA256 Time-based OTP dengan siklus auto-refresh 30 detik anti-titip absen",
      "Geofencing Radius Validator: Kalkulasi jarak presisi formula Haversine dengan deteksi Mock Provider",
      "Android CameraX Scanner: Integrasi Google ML Kit Barcode Scanning dengan respons sub-100ms",
      "Multi-Shift Scheduling: Konfigurasi shift pagi/siang/malam, toleransi telat, dan penugasan per divisi",
      "PostgreSQL Relational Schema: Tabel pegawai, kantor, shift, jadwal harian, dan log audit presensi",
    ],
    techStack: [
      "Kotlin Android",
      "CameraX & ML Kit",
      "FusedLocationProvider",
      "Next.js 15",
      "PostgreSQL",
      "HMAC Dynamic QR",
      "Haversine GPS Engine",
      "Excel/PDF Exporter",
    ],
    simulatedUrl: "http://localhost:3000/work?project=05",
  },
  {
    id: "medvote-web3-dapp",
    number: "06",
    title: "MedVote DApp — Blockchain E-Voting Pemilihan Ketua Komite Medik RSUD",
    category: "Web3 & Smart Contract Engineering (Solidity 0.8.20, Polygon EVM, Next.js)",
    badge: "Web3 & Solidity",
    client: "Komite Medik RSUD (Healthcare Governance Case Study)",
    year: "2025 — Production Demo",
    description:
      "Decentralized Application (DApp) E-Voting berbasis Smart Contract untuk Pemilihan Ketua Komite Medik Rumah Sakit. Menjamin integritas mutlak (tamper-proof & immutable) di mana setiap suara dokter terenkripsi di jaringan blockchain Polygon dan tidak dapat dimanipulasi oleh pihak mana pun, termasuk admin IT maupun direksi RS. Dilengkapi mekanisme 1 Dokter = 1 Wallet Whitelist, anti-double voting, live leaderboard real-time, dan jejak audit transaksi publik.",
    architectureHighlights: [
      "Gas-Optimized Solidity ^0.8.20 Smart Contract dengan Custom Errors & Unchecked Arithmetic",
      "Strict Voter Whitelisting (DPT KSM) & Anti-Double Voting boolean mapping (1 Wallet = 1 Vote)",
      "Real-time On-Chain Audit Log via Event VoteCast(voter, candidateId, timestamp)",
      "Dual-Mode Web3 Wallet Engine: MetaMask Browser Wallet & Instant Multi-Role Persona Simulator",
      "Panel Admin Panitia (onlyAdmin) untuk Batch Whitelist alamat wallet dokter & registrasi kandidat",
      "Built-in Smart Contract & JSON ABI Inspector terintegrasi langsung pada antarmuka DApp",
    ],
    techStack: [
      "Solidity ^0.8.20",
      "Polygon Amoy Testnet",
      "Next.js 15 (App Router)",
      "TypeScript",
      "Tailwind CSS",
      "EVM Web3 Provider",
      "On-Chain Event Audit",
      "Smart Contract ABI",
    ],
    simulatedUrl: "http://localhost:3000/medvote",
  },
];
