"use client";

import React from "react";
import { BatikPattern } from "@/components/ui/BatikPattern";

interface LiquidWaterSpillProps {
  isActive: boolean;
  origin: { x: number; y: number };
}

export function LiquidWaterSpill({ isActive, origin }: LiquidWaterSpillProps) {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
      {/* 
        ========================================================================
        1. TUBUH TUMPAHAN AIR (Silky Smooth Fluid Surge)
        Mengalir dari titik klik secara super halus tanpa filter pecah
        ========================================================================
      */}
      <div
        className="absolute inset-0 fluid-surge will-change-[clip-path]"
        style={{
          backgroundColor: "#0a3028",
        }}
      >
        {/* Kilauan Permukaan Air Halus & Lembut (Water Surface Caustic Glow) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen"
          style={{
            background: `radial-gradient(circle at ${origin.x}px ${origin.y}px, rgba(45, 212, 191, 0.35) 0%, rgba(13, 148, 136, 0.15) 30%, transparent 65%)`,
          }}
        />

        {/* Tekstur Kertas Karton & Batik Kawung Menyatu Mulus dengan Halaman About */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-40"
          style={{
            backgroundImage: "url('/cardboard-texture.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "220px",
          }}
        />
        <BatikPattern variant="kawung" opacity={0.035} className="absolute inset-0" />
      </div>

      {/* 
        ========================================================================
        2. GELOMBANG RIAK AIR HALUS (Anti-Aliased Silky Ripple Waves)
        Cincin riak air dengan gradasi lembut bebas bergerigi (tanpa filter pecah)
        ========================================================================
      */}
      {/* Ripple 1 - Gelombang Terdepan */}
      <div
        className="absolute pointer-events-none rounded-full ripple-wave-1 will-change-transform"
        style={{
          left: origin.x,
          top: origin.y,
        }}
      />

      {/* Ripple 2 - Gelombang Tengah */}
      <div
        className="absolute pointer-events-none rounded-full ripple-wave-2 will-change-transform"
        style={{
          left: origin.x,
          top: origin.y,
        }}
      />

      {/* Ripple 3 - Gelombang Lembut Mengikuti */}
      <div
        className="absolute pointer-events-none rounded-full ripple-wave-3 will-change-transform"
        style={{
          left: origin.x,
          top: origin.y,
        }}
      />

      {/* Ripple 4 - Kilau Pusat Percikan */}
      <div
        className="absolute pointer-events-none rounded-full ripple-center-glow will-change-transform"
        style={{
          left: origin.x,
          top: origin.y,
        }}
      />

      {/* CSS Animasi Khusus untuk Gerakan Air Super Mulus (60/120 FPS) */}
      <style jsx>{`
        .fluid-surge {
          clip-path: circle(0% at ${origin.x}px ${origin.y}px);
          animation: smooth-fluid-expand 750ms cubic-bezier(0.2, 0.8, 0.25, 1) forwards;
        }

        .ripple-wave-1 {
          width: 140px;
          height: 140px;
          border: 2px solid rgba(94, 234, 212, 0.7);
          box-shadow: 0 0 25px rgba(45, 212, 191, 0.5), inset 0 0 15px rgba(45, 212, 191, 0.3);
          transform: translate(-50%, -50%) scale(0.1);
          animation: smooth-ripple 850ms cubic-bezier(0.2, 0.8, 0.25, 1) forwards;
        }

        .ripple-wave-2 {
          width: 120px;
          height: 120px;
          border: 1.5px solid rgba(52, 211, 153, 0.6);
          box-shadow: 0 0 20px rgba(52, 211, 153, 0.4);
          transform: translate(-50%, -50%) scale(0.1);
          animation: smooth-ripple 850ms cubic-bezier(0.2, 0.8, 0.25, 1) 100ms forwards;
        }

        .ripple-wave-3 {
          width: 100px;
          height: 100px;
          border: 1px solid rgba(110, 231, 183, 0.5);
          box-shadow: 0 0 15px rgba(110, 231, 183, 0.3);
          transform: translate(-50%, -50%) scale(0.1);
          animation: smooth-ripple 850ms cubic-bezier(0.2, 0.8, 0.25, 1) 200ms forwards;
        }

        .ripple-center-glow {
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, rgba(94, 234, 212, 0.4) 0%, transparent 70%);
          transform: translate(-50%, -50%) scale(0.1);
          animation: smooth-center-flash 600ms cubic-bezier(0.2, 0.8, 0.25, 1) forwards;
        }

        @keyframes smooth-fluid-expand {
          0% {
            clip-path: circle(0% at ${origin.x}px ${origin.y}px);
            opacity: 0.95;
          }
          40% {
            opacity: 1;
          }
          100% {
            clip-path: circle(170% at ${origin.x}px ${origin.y}px);
            opacity: 1;
          }
        }

        @keyframes smooth-ripple {
          0% {
            transform: translate(-50%, -50%) scale(0.1);
            opacity: 0.9;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(18);
            opacity: 0;
          }
        }

        @keyframes smooth-center-flash {
          0% {
            transform: translate(-50%, -50%) scale(0.2);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(4.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
