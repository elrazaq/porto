import React from "react";
import { Metadata } from "next";
import { RestaurantPosApp } from "@/components/pos/RestaurantPosApp";

export const metadata: Metadata = {
  title: "Lava Cheese Batu 9 — Cloud Restaurant POS System",
  description: "Next.js, Tailwind CSS & Zustand Restaurant POS System with 58mm/80mm Thermal Receipt Printing.",
};

export default function PosPage() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-zinc-950">
      <RestaurantPosApp />
    </div>
  );
}
