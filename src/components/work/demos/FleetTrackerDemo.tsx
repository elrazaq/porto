"use client";

import React, { useState } from "react";
import {
  Smartphone,
  Navigation,
  Wifi,
  WifiOff,
  Package,
  MapPin,
  Clock,
  RotateCcw,
  CheckCircle2,
  Database,
  Truck,
  ArrowRight,
} from "lucide-react";

export function FleetTrackerDemo() {
  const [isOffline, setIsOffline] = useState(false);
  const [syncedCount, setSyncedCount] = useState(14);
  const [localQueueCount, setLocalQueueCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const [deliveries, setDeliveries] = useState([
    {
      id: "WB-88910",
      recipient: "PT. Batam Shipyard Logistics",
      dest: "Kawasan Industri Sekupang",
      status: "In Transit",
      driver: "Budi Pratama (Truck B-901)",
      progress: 68,
      timestamp: "10:42 WIB",
    },
    {
      id: "WB-88909",
      recipient: "Gudang Logistik Bintan Center",
      dest: "Jl. D.I. Panjaitan Km. 9",
      status: "Delivered",
      driver: "Hendra Wijaya (Van A-220)",
      progress: 100,
      timestamp: "10:15 WIB",
    },
    {
      id: "WB-88911",
      recipient: "Klinik Medika Tanjungpinang",
      dest: "Jl. Basuki Rahmat No. 12",
      status: "Dispatched",
      driver: "Rian Santoso (Courier C-04)",
      progress: 25,
      timestamp: "11:05 WIB",
    },
  ]);

  const toggleNetwork = () => {
    if (!isOffline) {
      // Switching to offline
      setIsOffline(true);
    } else {
      // Switching back online: trigger Room DB Sync simulation
      setIsOffline(false);
      if (localQueueCount > 0) {
        setIsSyncing(true);
        setTimeout(() => {
          setSyncedCount((c) => c + localQueueCount);
          setLocalQueueCount(0);
          setIsSyncing(false);
        }, 1200);
      }
    }
  };

  const simulateDriverAction = () => {
    if (isOffline) {
      setLocalQueueCount((c) => c + 1);
      setDeliveries((prev) => [
        {
          id: `WB-${Math.floor(Math.random() * 90000 + 10000)}`,
          recipient: "Toko Baru Jaya (Offline Receipt)",
          dest: "Jl. Merdeka No. 45",
          status: "Queued (Room DB)",
          driver: "Rian Santoso (Offline Entry)",
          progress: 100,
          timestamp: "Just now",
        },
        ...prev,
      ]);
    } else {
      setSyncedCount((c) => c + 1);
      setDeliveries((prev) => [
        {
          id: `WB-${Math.floor(Math.random() * 90000 + 10000)}`,
          recipient: "Apotek Sehat Mandiri",
          dest: "Jl. Pos Kota Lama",
          status: "Live Sync Verified",
          driver: "Budi Pratama",
          progress: 100,
          timestamp: "Just now",
        },
        ...prev,
      ]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#02130e] text-white select-none text-xs font-sans">
      {/* Top Device Bar */}
      <div className="bg-[#010c09] border-b border-mint-400/20 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smartphone className="w-3.5 h-3.5 text-mint-400" />
          <span className="font-mono font-bold text-mint-300 text-[11px]">
            NATIVE ANDROID (KOTLIN) &bull; FLEET TRACKER
          </span>
          <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono">
            SDK 34 (Android 14)
          </span>
        </div>

        {/* Live Network & Offline Mode Simulator Toggle */}
        <button
          type="button"
          onClick={toggleNetwork}
          className={`px-2 py-0.5 rounded-xs font-mono text-[10px] flex items-center gap-1 border transition-all cursor-pointer ${
            isOffline
              ? "bg-rose-500/20 text-rose-300 border-rose-500/50 hover:bg-rose-500/30"
              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30"
          }`}
          title="Click to toggle network state and test Room DB offline caching"
        >
          {isOffline ? (
            <>
              <WifiOff className="w-3 h-3 text-rose-400" />
              <span>Offline Mode (Simulated)</span>
            </>
          ) : (
            <>
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span>Online (Cloud Connected)</span>
            </>
          )}
        </button>
      </div>

      {/* State & Metrics Ribbon */}
      <div className="bg-[#051e17] border-b border-white/10 px-3 py-2 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-mint-400" />
            <span>Room DB Cache:</span>
            <strong className="text-amber-300">{localQueueCount} queued</strong>
          </div>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cloud Synced:</span>
            <strong className="text-mint-300">{syncedCount} manifests</strong>
          </div>
        </div>

        {/* Test Action Button */}
        <button
          type="button"
          onClick={simulateDriverAction}
          className="px-2.5 py-1 bg-[#0f4e45] hover:bg-[#146358] border border-mint-400 text-white font-chess text-[10.5px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm"
        >
          <Package className="w-3 h-3 text-mint-300" />
          <span>Simulate Proof-of-Delivery</span>
        </button>
      </div>

      {/* Syncing Toast Banner */}
      {isSyncing && (
        <div className="bg-amber-950/80 border-b border-amber-500/50 px-3 py-1 flex items-center gap-2 text-[10.5px] text-amber-200 animate-pulse font-mono">
          <RotateCcw className="w-3 h-3 animate-spin text-amber-400" />
          <span>Syncing {localQueueCount} Room DB records to central logistics backend...</span>
        </div>
      )}

      {/* Waybill / Deliveries Stream */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        <div className="flex items-center justify-between text-[10px] font-chess text-mint-300 uppercase">
          <span>Active Android Waybill Feed</span>
          <span className="font-mono text-white/50">Unidirectional StateFlow</span>
        </div>

        <div className="space-y-1.5">
          {deliveries.map((item) => (
            <div
              key={item.id}
              className="p-2.5 bg-black/30 border border-white/10 hover:border-mint-400/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-mint-300 text-xs">
                    {item.id}
                  </span>
                  <span className="text-white font-semibold text-[11px]">
                    {item.recipient}
                  </span>
                </div>

                <span
                  className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded-xs uppercase font-bold ${
                    item.status === "Delivered" || item.status === "Live Sync Verified"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : item.status === "Queued (Room DB)"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10.5px] text-white/70">
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-mint-400 shrink-0" />
                  <span className="truncate">{item.dest}</span>
                </span>
                <span className="font-mono text-[10px] text-white/50 shrink-0 ml-2">
                  {item.timestamp}
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full bg-white/10 h-1 mt-2 overflow-hidden">
                <div
                  className="h-full bg-mint-400 transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#010c09] border-t border-white/10 px-3 py-1.5 flex items-center justify-between text-[10px] font-mono text-white/50">
        <span>Architecture: Clean MVVM + Room SQLite + Coroutines/Flow</span>
        <span className="text-mint-300">Sample Android Data Sandbox</span>
      </div>
    </div>
  );
}
