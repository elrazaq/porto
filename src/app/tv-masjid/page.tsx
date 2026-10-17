import React from "react";
import { TvMasjidApp } from "@/components/tv/TvMasjidApp";

export const metadata = {
  title: "Android TV Masjid Al-Uswah — Sistem Informasi & Jadwal Sholat Digital",
  description:
    "Aplikasi Android TV 16:9 berbasis Kotlin & Jetpack Compose untuk jadwal sholat hisab Kemenag RI, alarm adzan, countdown iqomah, dan mode redup sholat.",
};

export default function TvMasjidPage() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-black">
      <TvMasjidApp />
    </main>
  );
}
