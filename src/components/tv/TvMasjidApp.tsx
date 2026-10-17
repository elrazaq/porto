"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Clock,
  Calendar,
  Volume2,
  VolumeX,
  Play,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Info,
  Flame,
  Radio,
  Tv,
  RotateCcw,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Moon,
  Sun,
  Coins,
  Users,
  Compass,
} from "lucide-react";

// Tipe Data Status Layar TV
export type TvScreenMode = "NORMAL" | "ADZAN" | "IQOMAH" | "SHOLAT";

export interface PrayerTimeItem {
  id: string;
  name: string;
  arabic: string;
  time: string; // "HH:mm"
  isCurrent?: boolean;
  isNext?: boolean;
}

export function TvMasjidApp() {
  // State Layar Utama
  const [screenMode, setScreenMode] = useState<TvScreenMode>("NORMAL");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Tanjungpinang, Kepri");
  const [iqomahMinutes, setIqomahMinutes] = useState(10);
  const [iqomahCountdownSec, setIqomahCountdownSec] = useState(600);
  const [adzanActivePrayer, setAdzanActivePrayer] = useState("Maghrib");
  const [focusedKey, setFocusedKey] = useState<string>("tv-screen");

  // Anti Burn-in Pixel Orbit (sedikit menggeser elemen setiap beberapa menit)
  const [pixelShift, setPixelShift] = useState({ x: 0, y: 0 });

  // Web Audio Context untuk mensimulasikan Bunyi Beep Iqomah & Alarm Adzan
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playBeep = (freq = 880, duration = 0.25) => {
    if (!isAudioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not permitted yet
    }
  };

  // Clock Update & Anti Burn-in effect
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Pixel shift setiap 15 menit (di sini per detik acak kecil +/- 1px untuk simulasi)
      if (now.getSeconds() === 0) {
        setPixelShift({
          x: Math.floor(Math.random() * 3) - 1,
          y: Math.floor(Math.random() * 3) - 1,
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Media Slider Auto Play
  useEffect(() => {
    if (screenMode !== "NORMAL") return;
    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, [screenMode]);

  // Iqomah Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (screenMode === "IQOMAH") {
      timer = setInterval(() => {
        setIqomahCountdownSec((prev) => {
          if (prev <= 1) {
            // Bunyi beep panjang penanda masuk sholat
            playBeep(1200, 1.2);
            setScreenMode("SHOLAT");
            return 0;
          }
          if (prev <= 10) {
            // Beep peringatan 10 detik terakhir
            playBeep(880, 0.2);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [screenMode]);

  // Keyboard Remote D-Pad Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setScreenMode("NORMAL");
        setShowSettings(false);
      } else if (e.key === "1") {
        triggerAdzan("Maghrib");
      } else if (e.key === "2") {
        triggerIqomah();
      } else if (e.key === "3") {
        setScreenMode("SHOLAT");
      } else if (e.key === "0") {
        setScreenMode("NORMAL");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Jadwal Sholat Berdasarkan Standar Hisab Kemenag RI
  const prayerTimes: PrayerTimeItem[] = useMemo(() => {
    return [
      { id: "subuh", name: "SUBUH", arabic: "الفجر", time: "04:38" },
      { id: "syuruq", name: "SYURUQ", arabic: "الشروق", time: "05:52" },
      { id: "dzuhur", name: "DZUHUR", arabic: "الظهر", time: "11:58" },
      { id: "ashar", name: "ASHAR", arabic: "العصر", time: "15:14" },
      { id: "maghrib", name: "MAGHRIB", arabic: "المغرب", time: "18:01", isNext: true },
      { id: "isya", name: "ISYA", arabic: "العشاء", time: "19:10" },
    ];
  }, []);

  // Format Jam & Detik
  const hours = String(currentTime.getHours()).padStart(2, "0");
  const minutes = String(currentTime.getMinutes()).padStart(2, "0");
  const seconds = String(currentTime.getSeconds()).padStart(2, "0");

  // Format Tanggal Masehi & Hijriah
  const daysId = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
  const monthsId = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const dateFormatted = `${daysId[currentTime.getDay()]}, ${currentTime.getDate()} ${monthsId[currentTime.getMonth()]} ${currentTime.getFullYear()}`;
  const hijriFormatted = "27 Rabi'ul Akhir 1448 H";

  // Trigger Helpers
  const triggerAdzan = (prayerName = "Maghrib") => {
    setAdzanActivePrayer(prayerName);
    setScreenMode("ADZAN");
    playBeep(523, 0.8);
  };

  const triggerIqomah = () => {
    setIqomahCountdownSec(iqomahMinutes * 60);
    setScreenMode("IQOMAH");
    playBeep(659, 0.4);
  };

  // Format Detik ke mm:ss
  const formatCountdown = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row bg-[#020b08] text-white overflow-hidden relative select-none font-sans">
      {/* ========================================================
          PANEL UTAMA: SMART TV 16:9 BEZEL SIMULATOR
          ======================================================== */}
      <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 lg:p-6 overflow-hidden">
        {/* Frame Bezel TV Hitam Modern */}
        <div className="w-full max-w-5xl aspect-[16/9] bg-black rounded-2xl sm:rounded-3xl p-2 sm:p-3.5 shadow-[0_0_50px_rgba(0,0,0,0.8)] border-4 sm:border-[6px] border-slate-800 relative flex flex-col justify-between overflow-hidden">
          {/* Logo & IR Sensor Bezel Bawah TV */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 pointer-events-none opacity-60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase">
              MASJID-TV • 4K HDR
            </span>
          </div>

          {/* Layar Dalam TV (Screen Canvas 16:9) */}
          <div
            style={{
              transform: `translate(${pixelShift.x}px, ${pixelShift.y}px)`,
              transition: "transform 1s ease",
            }}
            className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden relative flex flex-col justify-between bg-gradient-to-b from-[#021a13] via-[#010f0b] to-[#010906] text-white border border-emerald-500/20 shadow-inner"
          >
            {/* Islamic Geometric Watermark Overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-5 mix-blend-screen"
              style={{
                backgroundImage:
                  "radial-gradient(#10b981 1.5px, transparent 1.5px), radial-gradient(#fbbf24 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                backgroundPosition: "0 0, 14px 14px",
              }}
            />

            {/* ====================================================
                KONDISI 1: MODE NORMAL (DASHBOARD LENGKAP)
                ==================================================== */}
            {screenMode === "NORMAL" && (
              <div className="w-full h-full flex flex-col justify-between p-3 sm:p-5 relative z-10">
                {/* 1. HEADER SECTION: Identitas Masjid & Jam Real-Time */}
                <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-emerald-500/25">
                  {/* Kiri: Logo & Nama Masjid */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-800 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-300/40 shrink-0">
                      <Moon className="w-5 h-5 sm:w-7 sm:h-7 text-amber-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                          STANDAR KEMENAG RI
                        </span>
                        <span className="text-[10px] font-mono text-emerald-300/80 hidden sm:inline">
                          GPS: 0.9167° N, 104.4583° E
                        </span>
                      </div>
                      <h1 className="text-base sm:text-2xl font-black text-white tracking-wide uppercase drop-shadow-md">
                        MASJID AGUNG AL-USWAH
                      </h1>
                      <p className="text-[10px] sm:text-xs text-emerald-200/80 font-medium">
                        Jl. R.H. Fisabilillah Km. 10, {selectedCity}
                      </p>
                    </div>
                  </div>

                  {/* Kanan: Jam Digital & Tanggal */}
                  <div className="text-right flex flex-col items-end">
                    <div className="flex items-baseline gap-1 font-mono tracking-tight font-black text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                      <span className="text-2xl sm:text-4xl md:text-5xl">{hours}</span>
                      <span className="text-xl sm:text-3xl text-emerald-400 animate-pulse">:</span>
                      <span className="text-2xl sm:text-4xl md:text-5xl">{minutes}</span>
                      <span className="text-sm sm:text-xl text-emerald-300 font-bold ml-1">{seconds}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                      <span className="text-[10px] sm:text-xs font-semibold text-slate-200">
                        {dateFormatted}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span className="text-[10px] sm:text-xs font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                        {hijriFormatted}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. BODY SECTION (Split 2 Kolom: Media Slider & Info Masjid) */}
                <div className="flex-1 grid grid-cols-12 gap-3 sm:gap-4 my-2 sm:my-3 min-h-0">
                  {/* Kolom Kiri (7/12): Media Slider / Poster Kajian Carousel */}
                  <div className="col-span-7 bg-slate-950/60 rounded-xl sm:rounded-2xl border border-emerald-500/20 overflow-hidden relative flex flex-col justify-between p-3 sm:p-4">
                    {/* Slide 0: Kajian Akbar Dhuha */}
                    {activeSlide === 0 && (
                      <div className="h-full flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 uppercase font-mono">
                            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                            AGENDA KAJIAN RUTIN
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            Slide 1 / 4
                          </span>
                        </div>
                        <div className="my-2">
                          <h2 className="text-sm sm:text-xl font-extrabold text-white leading-snug">
                            Kajian Dhuha: &quot;Tafsir Tematik Surah Al-Kahfi &amp; Kesiapan Akhir Zaman&quot;
                          </h2>
                          <p className="text-[10.5px] sm:text-xs text-emerald-200/90 mt-1">
                            Bersama: <strong>Dr. H. Muhammad Ridwan, M.Ag</strong> &bull; Ahad Pagi, 08:30 WIB s.d Selesai
                          </p>
                          <div className="mt-2.5 flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold">
                              Tempat: Ruang Utama Masjid
                            </span>
                            <span className="px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 text-[10px] font-mono">
                              Terbuka untuk Umum (Ikhwan &amp; Akhwat)
                            </span>
                          </div>
                        </div>
                        <div className="text-[9.5px] text-slate-400 font-mono flex items-center gap-2 border-t border-white/5 pt-2">
                          <Info className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>Disediakan snack &amp; sarapan bersama ba&apos;da kajian.</span>
                        </div>
                      </div>
                    )}

                    {/* Slide 1: Laporan Kas & Keuangan */}
                    {activeSlide === 1 && (
                      <div className="h-full flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 uppercase font-mono">
                            <Coins className="w-3 h-3 text-amber-400" />
                            TRANSPARANSI KEUANGAN MASJID
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            Slide 2 / 4
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 my-2">
                          <div className="p-2 sm:p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30">
                            <div className="text-[9.5px] sm:text-[10px] font-mono text-emerald-300 uppercase">
                              Saldo Kas Operasional
                            </div>
                            <div className="text-base sm:text-2xl font-black text-amber-300 font-mono mt-0.5">
                              Rp 84.750.000
                            </div>
                            <div className="text-[9px] text-slate-400 mt-1">Audit per 16 Oktober 2026</div>
                          </div>
                          <div className="p-2 sm:p-3 bg-teal-950/40 rounded-xl border border-teal-500/30">
                            <div className="text-[9.5px] sm:text-[10px] font-mono text-teal-300 uppercase">
                              Total Infaq Jum&apos;at Lalu
                            </div>
                            <div className="text-base sm:text-2xl font-black text-emerald-300 font-mono mt-0.5">
                              Rp 6.320.000
                            </div>
                            <div className="text-[9px] text-slate-400 mt-1">Kotak Terbuka &amp; QRIS Masjid</div>
                          </div>
                        </div>
                        <div className="text-[9.5px] text-slate-400 font-mono flex items-center gap-2 border-t border-white/5 pt-2">
                          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>Laporan keuangan lengkap tertempel di papan mading serbaguna.</span>
                        </div>
                      </div>
                    )}

                    {/* Slide 2: Jadwal Petugas Sholat */}
                    {activeSlide === 2 && (
                      <div className="h-full flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5 uppercase font-mono">
                            <Users className="w-3 h-3 text-teal-400" />
                            JADWAL PETUGAS SHOLAT &amp; JUM&apos;AT
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            Slide 3 / 4
                          </span>
                        </div>
                        <div className="space-y-1.5 sm:space-y-2 my-1 text-xs">
                          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-slate-300 font-mono text-[11px]">Imam Rawatib Hari Ini:</span>
                            <span className="font-bold text-amber-300 text-[11.5px]">Ust. H. Ahmad Fauzi, S.Pd.I</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-slate-300 font-mono text-[11px]">Khatib Jum&apos;at Mendatang:</span>
                            <span className="font-bold text-emerald-300 text-[11.5px]">Dr. H. Muhammad Ridwan</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-slate-300 font-mono text-[11px]">Muadzin:</span>
                            <span className="font-bold text-white text-[11.5px]">Ust. Bilal Al-Banjari</span>
                          </div>
                        </div>
                        <div className="text-[9.5px] text-slate-400 font-mono border-t border-white/5 pt-2">
                          Penyusunan jadwal dikoordinasikan oleh Bidang Ta&apos;mir &amp; Peribadatan.
                        </div>
                      </div>
                    )}

                    {/* Slide 3: Hadits / Pesan Keutamaan */}
                    {activeSlide === 3 && (
                      <div className="h-full flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 uppercase font-mono">
                            MUTIARA HADITS SHOLAT
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            Slide 4 / 4
                          </span>
                        </div>
                        <div className="my-2 space-y-1 text-center">
                          <p className="text-xs sm:text-base font-serif italic text-amber-200">
                            &quot;Sholat berjamaah itu lebih utama dua puluh tujuh derajat dibanding sholat sendirian.&quot;
                          </p>
                          <p className="text-[10px] font-mono text-slate-400">
                            (HR. Bukhari no. 645 &amp; Muslim no. 650)
                          </p>
                        </div>
                        <div className="text-[9.5px] text-slate-400 font-mono text-center border-t border-white/5 pt-2">
                          Mari istiqomah memakmurkan sholat fardhu berjamaah di shaf terdepan.
                        </div>
                      </div>
                    )}

                    {/* Slide Indicator Dots */}
                    <div className="absolute bottom-2 right-3 flex items-center gap-1">
                      {[0, 1, 2, 3].map((dot) => (
                        <button
                          key={dot}
                          type="button"
                          onClick={() => setActiveSlide(dot)}
                          className={`w-2 h-1.5 rounded-full transition-all cursor-pointer ${
                            activeSlide === dot ? "w-5 bg-amber-400" : "bg-white/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Kolom Kanan (5/12): Next Prayer Highlight & Status Sync */}
                  <div className="col-span-5 flex flex-col justify-between gap-2.5">
                    {/* Card Countdown Menuju Waktu Sholat Berikutnya */}
                    <div className="flex-1 bg-gradient-to-br from-emerald-950/80 to-slate-950 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-amber-400/40 relative overflow-hidden flex flex-col justify-between shadow-lg shadow-amber-500/10">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[9.5px] sm:text-[10.5px] font-mono font-bold bg-amber-400 text-slate-950 uppercase">
                          MENUJU ADZAN BERIKUTNYA
                        </span>
                        <Compass className="w-4 h-4 text-amber-300" />
                      </div>

                      <div className="my-1 sm:my-2">
                        <div className="text-xs sm:text-sm font-bold text-slate-300 uppercase font-mono">
                          WAKTU MAGHRIB
                        </div>
                        <div className="text-xl sm:text-3xl md:text-4xl font-black text-amber-300 font-mono tracking-tight drop-shadow-md">
                          - 01:24:18
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-emerald-300/80 mt-0.5 font-medium">
                          Adzan Maghrib dijadwalkan pada <strong>18:01 WIB</strong>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-300">
                        <span>Jeda Iqomah: {iqomahMinutes} Menit</span>
                        <span className="text-emerald-400 font-bold">Siap Otomatis</span>
                      </div>
                    </div>

                    {/* Card Status Server & Sensor TV */}
                    <div className="bg-slate-950/70 p-2.5 sm:p-3 rounded-xl border border-emerald-500/20 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <div>
                          <div className="font-mono text-[10px] sm:text-[11px] font-bold text-white uppercase">
                            NTP Time Sync: Accurate
                          </div>
                          <div className="text-[9px] text-slate-400 font-mono">
                            Auto Hisab Altitude: +12m dpl
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[9.5px] font-mono font-bold">
                        D-PAD READY
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. PRAYER TIMES HORIZONTAL GRID (6 Waktu Sholat) */}
                <div className="grid grid-cols-6 gap-2 sm:gap-3 my-1">
                  {prayerTimes.map((item) => {
                    const isMaghrib = item.name === "MAGHRIB";
                    return (
                      <div
                        key={item.id}
                        className={`rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between items-center text-center transition-all ${
                          isMaghrib
                            ? "bg-gradient-to-b from-amber-500/30 via-emerald-950 to-slate-950 border-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] scale-[1.03]"
                            : "bg-slate-950/80 border border-emerald-500/20 hover:border-emerald-500/40"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <span
                            className={`font-mono text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider ${
                              isMaghrib ? "text-amber-300" : "text-emerald-300/90"
                            }`}
                          >
                            {item.name}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-arabic hidden sm:block">
                          {item.arabic}
                        </div>
                        <div
                          className={`text-sm sm:text-xl md:text-2xl font-black font-mono tracking-tight my-0.5 ${
                            isMaghrib ? "text-amber-300 drop-shadow-md" : "text-white"
                          }`}
                        >
                          {item.time}
                        </div>
                        <span
                          className={`text-[8.5px] sm:text-[9.5px] font-mono px-1.5 py-0.2 rounded ${
                            isMaghrib
                              ? "bg-amber-400 text-slate-950 font-bold"
                              : "text-slate-400 bg-white/5"
                          }`}
                        >
                          {isMaghrib ? "SELANJUTNYA" : "WIB"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* 4. FOOTER RUNNING TEXT (Marquee Pengumuman) */}
                <div className="bg-slate-950/90 border border-emerald-500/30 rounded-xl px-3 py-1.5 sm:py-2 flex items-center gap-3 overflow-hidden shadow-md mt-1">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-[9.5px] sm:text-[10.5px] font-mono font-black text-emerald-300 shrink-0 uppercase">
                    <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span>WARTA MASJID</span>
                  </div>

                  <div className="flex-1 overflow-hidden whitespace-nowrap text-[10.5px] sm:text-xs font-medium text-slate-200">
                    <div className="inline-block animate-[marquee_28s_linear_infinite]">
                      Luruskan dan rapatkan shaf saat sholat berjamaah &bull; Mohon nonaktifkan atau heningkan nada dering ponsel Anda selama di area masjid &bull; Kajian Fiqih Muamalah setiap Rabu ba&apos;da Maghrib bersama Dewan Asatidz &bull; Salurkan Infaq Renovasi Kubah &amp; Kanopi Selasar melalui Rekening BSI: 7123-456-789 a.n Masjid Al-Uswah &bull; Layanan Konsultasi Zakat &amp; Wakaf buka setiap hari kerja pukul 08:00 - 16:00 WIB.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ====================================================
                KONDISI 2: MODE MASUK WAKTU ADZAN (ALERT VISUAL)
                ==================================================== */}
            {screenMode === "ADZAN" && (
              <div className="w-full h-full flex flex-col justify-between items-center text-center p-6 sm:p-10 relative z-20 bg-gradient-to-b from-emerald-950 via-[#01140e] to-black">
                {/* Glowing Aura Ring */}
                <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-amber-400/20 border-4 border-amber-400 flex items-center justify-center animate-pulse shadow-[0_0_60px_rgba(251,191,36,0.6)] my-auto">
                  <Moon className="w-12 h-12 sm:w-20 sm:h-20 text-amber-300" />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <span className="px-4 py-1 rounded-full text-xs sm:text-sm font-mono font-bold bg-amber-400 text-slate-950 uppercase tracking-widest animate-bounce">
                    ALLAHU AKBAR &bull; ADZAN BERKUMANDANG
                  </span>
                  <h2 className="text-2xl sm:text-5xl font-black text-white tracking-tight drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                    SAATNYA ADZAN {adzanActivePrayer.toUpperCase()}
                  </h2>
                  <p className="text-xs sm:text-base text-emerald-200 max-w-lg mx-auto">
                    Hentikan segala aktivitas duniawi, dengarkan dan jawablah seruan adzan dengan khusyuk. Segera ambil wudhu dan bersiap di shaf sholat.
                  </p>
                </div>

                {/* Tombol Interaktif Pengendali Demo */}
                <div className="flex items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={triggerIqomah}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm font-mono uppercase tracking-wider hover:brightness-110 shadow-lg shadow-amber-500/30 cursor-pointer"
                  >
                    Mulai Hitung Iqomah ({iqomahMinutes} Menit)
                  </button>
                  <button
                    type="button"
                    onClick={() => setScreenMode("NORMAL")}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase cursor-pointer"
                  >
                    Kembali ke Layar Normal
                  </button>
                </div>
              </div>
            )}

            {/* ====================================================
                KONDISI 3: MODE COUNTDOWN IQOMAH
                ==================================================== */}
            {screenMode === "IQOMAH" && (
              <div className="w-full h-full flex flex-col justify-between items-center text-center p-6 sm:p-8 relative z-20 bg-gradient-to-b from-teal-950 via-slate-950 to-black">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-wider">
                    HITUNG MUNDUR MENUJU IQOMAH
                  </span>
                </div>

                {/* Big Digital Countdown Timer */}
                <div className="my-auto">
                  <div className="text-6xl sm:text-8xl md:text-9xl font-black font-mono tracking-tight text-amber-300 drop-shadow-[0_0_35px_rgba(251,191,36,0.5)]">
                    {formatCountdown(iqomahCountdownSec)}
                  </div>
                  <p className="text-xs sm:text-base font-semibold text-slate-200 mt-2">
                    Luruskan shaf, rapikan barisan, dan siapkan diri menyambut takbiratul ihram.
                  </p>
                  {iqomahCountdownSec <= 10 && (
                    <div className="text-sm font-mono font-black text-rose-400 animate-pulse mt-1">
                      BEEP PENANDA IQOMAH AKTIF (10 Detik Terakhir)
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setScreenMode("SHOLAT")}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm font-mono uppercase tracking-wider shadow-lg shadow-rose-600/30 cursor-pointer"
                  >
                    Masuk Mode Sholat Sekarang
                  </button>
                  <button
                    type="button"
                    onClick={() => setScreenMode("NORMAL")}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase cursor-pointer"
                  >
                    Batalkan
                  </button>
                </div>
              </div>
            )}

            {/* ====================================================
                KONDISI 4: MODE SHOLAT / KHOTBAH JUMAT (REDUP STANDBY)
                Anti-Burn-In OLED Friendly (Serene Dark Screen)
                ==================================================== */}
            {screenMode === "SHOLAT" && (
              <div className="w-full h-full flex flex-col justify-between items-center text-center p-8 sm:p-12 relative z-20 bg-black text-slate-300">
                <div className="opacity-40 text-[10px] font-mono tracking-widest text-slate-500">
                  SHOLAT SEDANG BERLANGSUNG &bull; LAYAR REDUP HEMAT DAYA
                </div>

                <div className="my-auto space-y-4 max-w-xl">
                  <div className="w-16 h-1 rounded-full bg-emerald-500/40 mx-auto" />
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-wider uppercase leading-tight font-serif drop-shadow-md">
                    Luruskan &amp; Rapatkan Shaf
                  </h2>
                  <p className="text-sm sm:text-lg text-emerald-300/80 font-medium leading-relaxed">
                    &quot;Luruskan shaf-shaf kalian, karena sesungguhnya lurusnya shaf termasuk kesempurnaan sholat.&quot;
                  </p>
                  <div className="pt-3 flex items-center justify-center gap-2 text-xs font-mono text-rose-400 bg-rose-950/40 py-2 px-4 rounded-xl border border-rose-500/20 max-w-sm mx-auto">
                    <VolumeX className="w-4 h-4 shrink-0" />
                    <span>Matikan atau heningkan dering ponsel Anda demi kekhusyukan jamaah.</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setScreenMode("NORMAL")}
                  className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-mono text-[11px] uppercase cursor-pointer transition-colors"
                >
                  Selesai Sholat (Kembali ke Dashboard)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Petunjuk Keyboard Shortcut */}
        <div className="hidden sm:flex items-center gap-4 mt-3 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">1</kbd>
            <span>Adzan</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">2</kbd>
            <span>Iqomah</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">3</kbd>
            <span>Sholat Mode</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">0 / Esc</kbd>
            <span>Normal</span>
          </span>
        </div>
      </div>

      {/* ========================================================
          PANEL KANAN: VIRTUAL D-PAD TV REMOTE CONTROLLER
          Menguji Navigasi Remote TV & Pengendalian Jadwal
          ======================================================== */}
      <div className="w-full lg:w-80 shrink-0 bg-[#061813] border-t lg:border-t-0 lg:border-l border-emerald-500/20 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          {/* Header Remote */}
          <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Android TV Remote
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsAudioEnabled((prev) => !prev)}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                isAudioEnabled
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                  : "bg-black/40 border-white/10 text-slate-400"
              }`}
              title="Toggle Audio Beep / Alarm"
            >
              {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="font-mono text-[10px]">{isAudioEnabled ? "BEEP ON" : "MUTED"}</span>
            </button>
          </div>

          {/* Quick Simulation Trigger Buttons */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Simulasi Siklus Waktu Sholat:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => triggerAdzan("Maghrib")}
                className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold font-mono text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Trigger Adzan</span>
              </button>

              <button
                type="button"
                onClick={triggerIqomah}
                className="p-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/40 text-teal-300 font-bold font-mono text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Hitung Iqomah</span>
              </button>

              <button
                type="button"
                onClick={() => setScreenMode("SHOLAT")}
                className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300 font-bold font-mono text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Mode Sholat</span>
              </button>

              <button
                type="button"
                onClick={() => setScreenMode("NORMAL")}
                className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 font-bold font-mono text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Normal Standby</span>
              </button>
            </div>
          </div>

          {/* D-Pad Navigasi Remote TV Fisik */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-emerald-500/20 flex flex-col items-center gap-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              Navigasi D-Pad TV
            </div>

            <div className="relative w-36 h-36 flex items-center justify-center my-1">
              {/* Lingkaran Luar D-Pad */}
              <div className="absolute inset-0 rounded-full border-2 border-slate-700 bg-slate-900/90 shadow-inner" />

              {/* Tombol Atas */}
              <button
                type="button"
                onClick={() => setActiveSlide((prev) => (prev > 0 ? prev - 1 : 3))}
                className="absolute top-1 p-2 text-slate-300 hover:text-amber-400 cursor-pointer active:scale-95"
                title="Up / Prev Slide"
              >
                <ChevronUp className="w-5 h-5" />
              </button>

              {/* Tombol Bawah */}
              <button
                type="button"
                onClick={() => setActiveSlide((prev) => (prev + 1) % 4)}
                className="absolute bottom-1 p-2 text-slate-300 hover:text-amber-400 cursor-pointer active:scale-95"
                title="Down / Next Slide"
              >
                <ChevronDown className="w-5 h-5" />
              </button>

              {/* Tombol Kiri */}
              <button
                type="button"
                onClick={() => setActiveSlide((prev) => (prev > 0 ? prev - 1 : 3))}
                className="absolute left-1 p-2 text-slate-300 hover:text-amber-400 cursor-pointer active:scale-95"
                title="Left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Tombol Kanan */}
              <button
                type="button"
                onClick={() => setActiveSlide((prev) => (prev + 1) % 4)}
                className="absolute right-1 p-2 text-slate-300 hover:text-amber-400 cursor-pointer active:scale-95"
                title="Right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Tombol Tengah OK */}
              <button
                type="button"
                onClick={() => setShowSettings((prev) => !prev)}
                className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center justify-center shadow-lg shadow-emerald-600/40 cursor-pointer active:scale-90 z-10"
                title="OK / Toggle Settings"
              >
                OK
              </button>
            </div>

            <div className="w-full flex items-center justify-between px-2 pt-2 border-t border-white/5 text-xs">
              <button
                type="button"
                onClick={() => setScreenMode("NORMAL")}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] cursor-pointer"
              >
                BACK
              </button>
              <button
                type="button"
                onClick={() => setShowSettings((prev) => !prev)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] flex items-center gap-1 cursor-pointer"
              >
                <Settings className="w-3 h-3 text-amber-300" />
                <span>MENU</span>
              </button>
            </div>
          </div>

          {/* Quick Settings Drawer */}
          {showSettings && (
            <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-400/40 space-y-3 animate-in fade-in duration-200">
              <div className="text-xs font-mono font-bold text-amber-300 uppercase flex items-center justify-between">
                <span>Pengaturan TV Masjid</span>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="text-slate-400 hover:text-white"
                >
                  &times;
                </button>
              </div>

              {/* Pilih Lokasi Kota */}
              <div className="space-y-1">
                <label className="text-[10.5px] font-mono text-slate-300">Lokasi / Koordinat:</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                >
                  <option value="Tanjungpinang, Kepri">Tanjungpinang, Kepri (0.91° N, 104.45° E)</option>
                  <option value="Batam, Kepri">Batam, Kepri (1.04° N, 104.03° E)</option>
                  <option value="Jakarta Pusat">DKI Jakarta (-6.17° S, 106.82° E)</option>
                  <option value="Surabaya, Jatim">Surabaya, Jatim (-7.25° S, 112.75° E)</option>
                  <option value="Medan, Sumut">Medan, Sumut (3.59° N, 98.67° E)</option>
                  <option value="Makassar, Sulsel">Makassar, Sulsel (-5.14° S, 119.43° E)</option>
                </select>
              </div>

              {/* Jeda Iqomah */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-300">
                  <span>Jeda Waktu Iqomah:</span>
                  <span className="font-bold text-amber-400">{iqomahMinutes} Menit</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={iqomahMinutes}
                  onChange={(e) => setIqomahMinutes(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="text-[9.5px] text-slate-400 font-mono">
                *Rumus hisab sholat otomatis menyesuaikan koordinat, bujur lokal, dan elevasi Kemenag RI (+2 menit ihtiyat).
              </div>
            </div>
          )}
        </div>

        {/* Footer Info Remote */}
        <div className="pt-3 border-t border-emerald-500/20 text-[10px] text-slate-400 font-mono space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-300">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Anti Burn-in Screen Protection ON</span>
          </div>
          <div>D-pad leanback navigation ready for Android TV (Sony Bravia, Xiaomi TV, TCL, Android Box).</div>
        </div>
      </div>
    </div>
  );
}
