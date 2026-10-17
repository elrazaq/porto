"use client";

import React, { useState } from "react";
import {
  Server,
  Activity,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Cpu,
  HardDrive,
  Radio,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface NodeItem {
  id: string;
  name: string;
  ip: string;
  role: string;
  ping: number;
  cpu: number;
  status: "ONLINE" | "FAILOVER" | "DEGRADED";
}

export function NetworkMonitorDemo() {
  const [isPinging, setIsPinging] = useState(false);
  const [failoverActive, setFailoverActive] = useState(false);

  const [nodes, setNodes] = useState<NodeItem[]>([
    { id: "SRV-01", name: "Primary Database (SIMRS PostgreSQL)", ip: "192.168.10.12", role: "Database Cluster", ping: 4, cpu: 32, status: "ONLINE" },
    { id: "SRV-02", name: "PACS Radiology Imaging Server", ip: "192.168.10.15", role: "DICOM Storage", ping: 7, cpu: 48, status: "ONLINE" },
    { id: "GW-01", name: "MikroTik CCR1036 Core Router", ip: "192.168.10.1", role: "VLAN Gateway", ping: 2, cpu: 18, status: "ONLINE" },
    { id: "SW-ICU", name: "Switch Cisco Catalyst - Gedung ICU", ip: "192.168.20.2", role: "Access Switch", ping: 5, cpu: 14, status: "ONLINE" },
    { id: "SRV-BK", name: "Disaster Recovery Backup Server", ip: "192.168.99.10", role: "Standby Replication", ping: 11, cpu: 12, status: "ONLINE" },
  ]);

  const runPingTest = () => {
    setIsPinging(true);
    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          ping: Math.floor(Math.random() * 8 + 2),
          cpu: Math.floor(Math.random() * 20 + 20),
        }))
      );
      setIsPinging(false);
    }, 800);
  };

  const toggleFailover = () => {
    setFailoverActive(!failoverActive);
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === "GW-01") {
          return {
            ...n,
            status: !failoverActive ? "FAILOVER" : "ONLINE",
            name: !failoverActive ? "Secondary MikroTik (Auto Failover Active)" : "MikroTik CCR1036 Core Router",
            ping: !failoverActive ? 8 : 2,
          };
        }
        return n;
      })
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#021410] text-white select-none text-xs font-sans">
      {/* Top Header */}
      <div className="bg-[#010c0a] border-b border-mint-400/20 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Server className="w-3.5 h-3.5 text-mint-400" />
          <span className="font-mono font-bold text-mint-300 text-[11px]">
            HOSPITAL IT INFRASTRUCTURE &bull; TELEMETRY WATCHDOG
          </span>
          <span className="text-[9px] px-1.5 py-0.2 bg-teal-500/20 text-teal-300 border border-teal-400/30 font-mono">
            SNMP &bull; 24/7 UP
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={runPingTest}
            disabled={isPinging}
            className="px-2 py-0.5 bg-black/40 hover:bg-black/60 border border-mint-400/40 text-mint-200 text-[10px] font-mono flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className={`w-2.5 h-2.5 ${isPinging ? "animate-spin text-mint-300" : ""}`} />
            <span>Ping All Nodes</span>
          </button>

          <button
            type="button"
            onClick={toggleFailover}
            className={`px-2 py-0.5 border text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-all ${
              failoverActive
                ? "bg-amber-500/20 text-amber-300 border-amber-400"
                : "bg-black/40 text-white/70 border-white/20 hover:text-white"
            }`}
          >
            <Radio className="w-2.5 h-2.5" />
            <span>{failoverActive ? "Failover Route Active" : "Simulate Failover"}</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Ribbon */}
      <div className="bg-[#051f18] border-b border-white/10 px-3 py-2 grid grid-cols-4 gap-2">
        <div className="p-1.5 bg-black/30 border border-white/5">
          <span className="text-[9px] font-chess text-white/50 block">Uptime Target</span>
          <span className="text-sm font-mono font-black text-emerald-400">99.98%</span>
        </div>
        <div className="p-1.5 bg-black/30 border border-white/5">
          <span className="text-[9px] font-chess text-white/50 block">Active VLANs</span>
          <span className="text-sm font-mono font-black text-white">8 Subnets</span>
        </div>
        <div className="p-1.5 bg-black/30 border border-white/5">
          <span className="text-[9px] font-chess text-white/50 block">Average Latency</span>
          <span className="text-sm font-mono font-black text-mint-300">4.2 ms</span>
        </div>
        <div className="p-1.5 bg-black/30 border border-white/5">
          <span className="text-[9px] font-chess text-white/50 block">SIMRS DB Sync</span>
          <span className="text-sm font-mono font-black text-teal-300">0s Lag</span>
        </div>
      </div>

      {/* Nodes Monitoring Table */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        <div className="flex items-center justify-between text-[10px] font-chess text-mint-300 uppercase">
          <span>Mission-Critical Hospital Server &amp; Gateway Nodes</span>
          <span className="font-mono text-white/50">Auto-Polling 5s</span>
        </div>

        <div className="space-y-1.5">
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`p-2.5 border transition-all ${
                node.status === "FAILOVER"
                  ? "bg-amber-950/40 border-amber-500/60"
                  : "bg-black/30 border-white/10 hover:border-mint-400/40"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-mint-300 text-xs">
                    {node.id}
                  </span>
                  <span className="text-white font-semibold text-[11px]">
                    {node.name}
                  </span>
                </div>

                <span
                  className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded-xs font-bold uppercase ${
                    node.status === "ONLINE"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                  }`}
                >
                  {node.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[10.5px] font-mono text-white/70 pt-1 border-t border-white/5">
                <div>
                  <span className="text-white/40 block text-[9px]">IP ADDRESS</span>
                  <span className="text-mint-200">{node.ip}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[9px]">PING LATENCY</span>
                  <span className={node.ping > 10 ? "text-amber-300" : "text-emerald-400"}>
                    {node.ping} ms
                  </span>
                </div>
                <div>
                  <span className="text-white/40 block text-[9px]">CPU UTILIZATION</span>
                  <span>{node.cpu}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#010c0a] border-t border-white/10 px-3 py-1.5 flex items-center justify-between text-[10px] font-mono text-white/50">
        <span>Administration by IT RSUD Bintan (2021&ndash;Present)</span>
        <span className="text-mint-300">Live Telemetry Sandbox</span>
      </div>
    </div>
  );
}
