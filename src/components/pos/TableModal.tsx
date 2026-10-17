"use client";

import React, { useState } from "react";
import { X, Users, Utensils, Check, ShoppingBag } from "lucide-react";
import { usePosStore } from "@/store/posStore";

export function TableModal() {
  const { tables, selectedTable, selectTable, closeTableModal } = usePosStore();
  const [selectedArea, setSelectedArea] = useState<string>("all");

  const areas = ["all", "Indoor Utama", "Area Outdoor", "VIP Room", "Takeaway Counter"];

  const filteredTables = selectedArea === "all"
    ? tables
    : tables.filter((t) => t.area === selectedArea);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-slate-900">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Manajemen Meja &amp; Area Pelanggan</h3>
              <p className="text-xs text-slate-500 font-mono">
                Pilih nomor meja aktif untuk pesanan kasir
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeTableModal}
            className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Area Filter Tabs & Status Legend */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {areas.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => setSelectedArea(area)}
                className={`px-3 py-1 rounded-full font-mono text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                  selectedArea === area
                    ? "bg-red-600 text-white font-bold shadow-xs"
                    : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
              >
                {area === "all" ? "Semua Meja" : area}
              </button>
            ))}
          </div>

          {/* Status Legend */}
          <div className="flex items-center gap-3 text-[10.5px] font-mono text-slate-600">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Tersedia</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>Terisi</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Billing</span>
            </div>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-slate-50/50 pos-light-scrollbar">
          {filteredTables.map((table) => {
            const isSelected = selectedTable.id === table.id;

            let statusBg = "border-emerald-200 bg-emerald-50/60 hover:border-emerald-400";
            let statusBadge = "bg-emerald-100 text-emerald-800 border-emerald-300";
            let statusText = "Tersedia";

            if (table.status === "occupied") {
              statusBg = "border-red-200 bg-red-50/70 hover:border-red-400";
              statusBadge = "bg-red-100 text-red-800 border-red-300";
              statusText = "Terisi";
            } else if (table.status === "billing") {
              statusBg = "border-amber-200 bg-amber-50/70 hover:border-amber-400";
              statusBadge = "bg-amber-100 text-amber-800 border-amber-300";
              statusText = "Billing";
            }

            return (
              <button
                key={table.id}
                type="button"
                onClick={() => selectTable(table)}
                className={`p-3.5 rounded-xl border-2 flex flex-col justify-between text-left transition-all cursor-pointer relative shadow-xs ${statusBg} ${
                  isSelected ? "ring-2 ring-red-600 border-red-600 bg-white shadow-md scale-[1.02]" : ""
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold ${statusBadge}`}
                    >
                      {statusText}
                    </span>
                    {table.capacity > 0 && (
                      <span className="flex items-center gap-0.5 text-[10px] text-slate-500 font-mono">
                        <Users className="w-3 h-3" />
                        <span>{table.capacity}</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    {table.id === "t-takeaway" ? (
                      <ShoppingBag className="w-4 h-4 text-red-600" />
                    ) : null}
                    <span>{table.name}</span>
                  </h4>
                  <p className="text-[10.5px] text-slate-500">{table.area}</p>
                </div>

                {/* Sub-info if occupied */}
                {table.currentTotal ? (
                  <div className="mt-3 pt-2 border-t border-slate-200 text-[10.5px] font-mono flex items-center justify-between text-slate-700">
                    <span className="text-slate-500">{table.orderCount} item</span>
                    <span className="font-bold text-red-600">
                      Rp {table.currentTotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                ) : (
                  <div className="mt-3 text-[10px] text-emerald-700 font-mono font-medium">
                    Siap digunakan
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>
            Meja Terpilih: <strong className="text-red-600">{selectedTable.name}</strong> ({selectedTable.area})
          </span>
          <button
            type="button"
            onClick={closeTableModal}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
