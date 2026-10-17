"use client";

import React, { useState } from "react";
import {
  Activity,
  Bed,
  Users,
  Pill,
  Search,
  CheckCircle2,
  Clock,
  Plus,
  Server,
  RefreshCw,
} from "lucide-react";

interface BedItem {
  id: string;
  room: string;
  ward: "ICU" | "VIP" | "Kelas 1" | "Kelas 2" | "Kelas 3";
  patient: string | null;
  status: "Occupied" | "Available" | "Sanitizing";
}

interface PatientQueue {
  ticket: string;
  name: string;
  clinic: string;
  doctor: string;
  priority: "Normal" | "Urgent" | "BPJS";
  status: "Waiting" | "In Consultation" | "Completed";
}

export function SimrsDemo() {
  const [activeTab, setActiveTab] = useState<"beds" | "queue" | "pharmacy">("beds");
  const [searchQuery, setSearchQuery] = useState("");
  const [calledTicket, setCalledTicket] = useState<string | null>("B-014");

  const [beds, setBeds] = useState<BedItem[]>([
    { id: "B1", room: "Ruang Anggrek 101", ward: "VIP", patient: "H. Abdullah (RM-9942)", status: "Occupied" },
    { id: "B2", room: "Ruang Anggrek 102", ward: "VIP", patient: null, status: "Available" },
    { id: "B3", room: "Ruang Melati 201", ward: "Kelas 1", patient: "Siti Rahma (RM-8821)", status: "Occupied" },
    { id: "B4", room: "Ruang Melati 202", ward: "Kelas 1", patient: null, status: "Sanitizing" },
    { id: "B5", room: "Intensive Care 01", ward: "ICU", patient: "Tn. Darmawan (RM-1029)", status: "Occupied" },
    { id: "B6", room: "Intensive Care 02", ward: "ICU", patient: null, status: "Available" },
    { id: "B7", room: "Ruang Dahlia 301", ward: "Kelas 2", patient: "Ahmad Fauzi (RM-7740)", status: "Occupied" },
    { id: "B8", room: "Ruang Dahlia 302", ward: "Kelas 2", patient: "M. Rizal (RM-6311)", status: "Occupied" },
  ]);

  const [queue, setQueue] = useState<PatientQueue[]>([
    { ticket: "A-012", name: "Ibu Fatimah", clinic: "Poli Penyakit Dalam", doctor: "dr. Hendra, Sp.PD", priority: "BPJS", status: "Completed" },
    { ticket: "B-014", name: "Tn. Bambang Sutrisno", clinic: "Poli Jantung", doctor: "dr. Jessica, Sp.JP", priority: "Urgent", status: "In Consultation" },
    { ticket: "B-015", name: "Ny. Ratna Sari", clinic: "Poli Jantung", doctor: "dr. Jessica, Sp.JP", priority: "Normal", status: "Waiting" },
    { ticket: "C-008", name: "Ananda Farhan", clinic: "Poli Anak", doctor: "dr. Maya, Sp.A", priority: "BPJS", status: "Waiting" },
    { ticket: "C-009", name: "Ananda Zahra", clinic: "Poli Anak", doctor: "dr. Maya, Sp.A", priority: "Normal", status: "Waiting" },
  ]);

  const [prescriptions, setPrescriptions] = useState([
    { id: "RX-4091", patient: "Tn. Bambang Sutrisno", medicine: "Amlodipine 10mg, Candesartan 8mg", status: "Dispensing" },
    { id: "RX-4090", patient: "Ibu Fatimah", medicine: "Metformin 500mg, Glimepiride 2mg", status: "Ready for Pickup" },
    { id: "RX-4089", patient: "Tn. Darmawan (ICU)", medicine: "Ceftriaxone 1g IV, Paracetamol Infus", status: "Delivered to Ward" },
  ]);

  const toggleBedStatus = (id: string) => {
    setBeds((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        if (b.status === "Available") return { ...b, status: "Occupied", patient: "Pasien Baru (RM-Baru)" };
        if (b.status === "Occupied") return { ...b, status: "Sanitizing", patient: null };
        return { ...b, status: "Available", patient: null };
      })
    );
  };

  const callNextQueue = () => {
    const waiting = queue.find((q) => q.status === "Waiting");
    if (waiting) {
      setCalledTicket(waiting.ticket);
      setQueue((prev) =>
        prev.map((q) => {
          if (q.ticket === waiting.ticket) return { ...q, status: "In Consultation" };
          if (q.status === "In Consultation") return { ...q, status: "Completed" };
          return q;
        })
      );
    }
  };

  const occupiedBeds = beds.filter((b) => b.status === "Occupied").length;
  const totalBeds = beds.length;
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

  return (
    <div className="w-full h-full flex flex-col bg-[#051c17] text-white select-none text-xs font-sans">
      {/* Top System Bar */}
      <div className="bg-[#031310] border-b border-mint-400/20 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono font-bold text-mint-300 text-[11px] tracking-wide">
            RSUD BINTAN &bull; SIMRS CLINICAL HUB
          </span>
          <span className="text-[9px] px-1.5 py-0.2 bg-mint-400/20 text-mint-200 border border-mint-400/30 font-mono">
            v4.8.2 ONLINE
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-mint-300/80">
          <Server className="w-3 h-3 text-mint-400" />
          <span>Local Cluster: 12ms</span>
          <span className="text-white/30">&bull;</span>
          <span>PostgreSQL Active</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-[#07241e] border-b border-white/10 px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("beds")}
            className={`px-2.5 py-1 text-[11px] font-chess uppercase tracking-wide border transition-all cursor-pointer ${
              activeTab === "beds"
                ? "bg-mint-400/20 border-mint-300 text-white font-bold"
                : "bg-black/30 border-white/10 text-white/60 hover:text-white"
            }`}
          >
            Inpatient Beds ({occupiedBeds}/{totalBeds})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("queue")}
            className={`px-2.5 py-1 text-[11px] font-chess uppercase tracking-wide border transition-all cursor-pointer ${
              activeTab === "queue"
                ? "bg-mint-400/20 border-mint-300 text-white font-bold"
                : "bg-black/30 border-white/10 text-white/60 hover:text-white"
            }`}
          >
            Outpatient Triage Queue
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pharmacy")}
            className={`px-2.5 py-1 text-[11px] font-chess uppercase tracking-wide border transition-all cursor-pointer ${
              activeTab === "pharmacy"
                ? "bg-mint-400/20 border-mint-300 text-white font-bold"
                : "bg-black/30 border-white/10 text-white/60 hover:text-white"
            }`}
          >
            e-Pharmacy Dispatch
          </button>
        </div>

        <span className="text-[10px] text-mint-200/60 font-mono hidden sm:inline">
          BOR: {occupancyRate}%
        </span>
      </div>

      {/* Main Interactive Work Area */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {/* Tab 1: Inpatient Bed Occupancy Tracker */}
        {activeTab === "beds" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-chess text-mint-200 uppercase font-semibold">
                Live Inpatient Bed Status (Click any bed to toggle state)
              </span>
              <span className="text-[10px] text-white/50 font-mono">
                Auto-syncing LAN
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {beds.map((bed) => {
                const isOccupied = bed.status === "Occupied";
                const isAvailable = bed.status === "Available";
                return (
                  <div
                    key={bed.id}
                    onClick={() => toggleBedStatus(bed.id)}
                    className={`p-2.5 border transition-all cursor-pointer select-none ${
                      isOccupied
                        ? "bg-rose-950/40 border-rose-500/50 hover:border-rose-400"
                        : isAvailable
                        ? "bg-emerald-950/40 border-emerald-500/50 hover:border-emerald-400"
                        : "bg-amber-950/40 border-amber-500/50 hover:border-amber-400"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="font-mono font-bold text-white/90">{bed.ward}</span>
                      <span
                        className={`px-1 py-0.2 rounded-xs font-mono text-[9px] uppercase font-bold ${
                          isOccupied
                            ? "text-rose-300 bg-rose-500/20"
                            : isAvailable
                            ? "text-emerald-300 bg-emerald-500/20"
                            : "text-amber-300 bg-amber-500/20"
                        }`}
                      >
                        {bed.status}
                      </span>
                    </div>

                    <div className="text-[11px] font-bold text-white truncate">
                      {bed.room}
                    </div>

                    <div className="mt-1.5 text-[10px] font-mono text-white/70 truncate">
                      {bed.patient || "— Vacant —"}
                    </div>

                    <div className="mt-2 pt-1 border-t border-white/10 text-[9px] text-mint-300/70 flex items-center justify-between">
                      <span>Click to switch</span>
                      <Bed className="w-2.5 h-2.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Outpatient Triage Queue Simulator */}
        {activeTab === "queue" && (
          <div className="space-y-2.5">
            {/* Call Next Banner */}
            <div className="p-3 bg-black/40 border border-mint-400/30 flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[10px] text-mint-300 font-chess uppercase block">
                  Currently Called in Clinic:
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl font-black font-mono text-amber-300 animate-pulse">
                    {calledTicket || "None"}
                  </span>
                  <span className="text-xs text-white/90 font-chess">
                    Poli Jantung &bull; dr. Jessica, Sp.JP
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={callNextQueue}
                className="px-3 py-1.5 bg-[#0f4e45] hover:bg-[#146358] border border-mint-400 text-white font-chess text-xs font-bold uppercase transition-all cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-mint-300" />
                <span>Call Next Ticket</span>
              </button>
            </div>

            {/* Queue Table */}
            <div className="border border-white/10 overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-[#031310] text-[10px] font-chess text-mint-300 uppercase">
                  <tr>
                    <th className="p-2">Ticket</th>
                    <th className="p-2">Patient Name</th>
                    <th className="p-2">Clinic &amp; Doctor</th>
                    <th className="p-2">Priority</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-black/20 font-sans">
                  {queue.map((q) => (
                    <tr key={q.ticket} className="hover:bg-white/[0.02]">
                      <td className="p-2 font-mono font-bold text-mint-200">{q.ticket}</td>
                      <td className="p-2 font-medium text-white">{q.name}</td>
                      <td className="p-2 text-white/70">
                        {q.clinic} &bull; <span className="text-white/50">{q.doctor}</span>
                      </td>
                      <td className="p-2 font-mono text-[10px]">
                        <span
                          className={`px-1.5 py-0.5 rounded-xs ${
                            q.priority === "Urgent"
                              ? "bg-rose-500/20 text-rose-300"
                              : q.priority === "BPJS"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-white/10 text-white/80"
                          }`}
                        >
                          {q.priority}
                        </span>
                      </td>
                      <td className="p-2 font-mono text-[10px]">
                        <span
                          className={`px-1.5 py-0.5 rounded-xs ${
                            q.status === "In Consultation"
                              ? "bg-amber-500/20 text-amber-300 font-bold"
                              : q.status === "Completed"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-white/10 text-white/60"
                          }`}
                        >
                          {q.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: e-Pharmacy Dispatch */}
        {activeTab === "pharmacy" && (
          <div className="space-y-2">
            <span className="text-[10.5px] font-chess text-mint-200 uppercase font-semibold block">
              Digital Medical Prescription Stream
            </span>

            <div className="space-y-1.5">
              {prescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="p-2.5 bg-black/30 border border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <Pill className="w-4 h-4 text-mint-400 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-mint-300 text-xs">
                          {rx.id}
                        </span>
                        <span className="text-white font-semibold text-[11px]">
                          {rx.patient}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-white/70 font-sans mt-0.5">
                        {rx.medicine}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 bg-mint-400/20 text-mint-200 border border-mint-400/30">
                    {rx.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Ticker */}
      <div className="bg-[#031310] border-t border-white/10 px-3 py-1.5 flex items-center justify-between text-[10px] font-mono text-white/50">
        <span>SIMRS Module: Rawat Inap &amp; Poli Rawat Jalan</span>
        <span className="text-mint-300">Sample Records Simulated On Local Server</span>
      </div>
    </div>
  );
}
