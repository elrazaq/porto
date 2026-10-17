"use client";

import React, { useState } from "react";
import { X, DollarSign, QrCode, CheckCircle, ArrowRight } from "lucide-react";
import { usePosStore } from "@/store/posStore";

export function PaymentModal() {
  const {
    getGrandTotal,
    getSubtotal,
    getTaxAmount,
    getDiscountAmount,
    discountPercent,
    setDiscount,
    selectedTable,
    orderType,
    closePaymentModal,
    completePayment,
  } = usePosStore();

  const grandTotal = getGrandTotal();
  const subtotal = getSubtotal();
  const tax = getTaxAmount();
  const discountAmount = getDiscountAmount();

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qris">("cash");
  const [cashAmount, setCashAmount] = useState<number>(grandTotal);
  const [qrisPaidSimulated, setQrisPaidSimulated] = useState<boolean>(false);

  // Fast cash presets
  const presets = [
    { label: "Uang Pas", value: grandTotal },
    { label: "Rp 50.000", value: 50000 },
    { label: "Rp 100.000", value: 100000 },
    { label: "Rp 150.000", value: 150000 },
    { label: "Rp 200.000", value: 200000 },
    { label: "Rp 300.000", value: 300000 },
  ];

  const change = Math.max(0, cashAmount - grandTotal);
  const isSufficient = paymentMethod === "cash" ? cashAmount >= grandTotal : true;

  const handleKeypad = (val: string) => {
    if (val === "C") {
      setCashAmount(0);
    } else if (val === "000") {
      setCashAmount((prev) => (prev ? prev * 1000 : 0));
    } else {
      setCashAmount((prev) => {
        const str = String(prev === 0 ? "" : prev) + val;
        return Number(str) || 0;
      });
    }
  };

  const handleConfirm = () => {
    if (!isSufficient) return;
    completePayment(paymentMethod, cashAmount);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-900">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-red-600 font-bold">
              Pembayaran Transaksi Kasir
            </span>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <span>Total Tagihan:</span>
              <span className="text-xl sm:text-2xl text-red-600 font-mono font-black">
                Rp {grandTotal.toLocaleString("id-ID")}
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 shadow-xs">
              {orderType === "dine-in" ? `Meja: ${selectedTable.name}` : "Bungkus (Takeaway)"}
            </span>
            <button
              type="button"
              onClick={closePaymentModal}
              className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 bg-slate-50/40 pos-light-scrollbar">
          {/* Sisi Kiri: Rincian & Diskon (5 Kolom) */}
          <div className="md:col-span-5 space-y-4">
            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-slate-600 block mb-2 font-bold">
                Metode Pembayaran:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`p-3 rounded-xl border-2 font-mono text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === "cash"
                      ? "border-red-600 bg-red-50 text-red-600 shadow-xs"
                      : "border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <DollarSign className="w-5 h-5" />
                  <span>TUNAI / CASH</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("qris")}
                  className={`p-3 rounded-xl border-2 font-mono text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === "qris"
                      ? "border-red-600 bg-red-50 text-red-600 shadow-xs"
                      : "border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span>QRIS DINAMIS</span>
                </button>
              </div>
            </div>

            {/* Diskon Promosi */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-slate-600 block mb-2 font-bold flex items-center justify-between">
                <span>Voucher / Diskon Kasir:</span>
                <span className="text-red-600">{discountPercent}%</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
                {[0, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDiscount(pct)}
                    className={`py-1.5 rounded-lg border font-bold transition-colors cursor-pointer ${
                      discountPercent === pct
                        ? "bg-red-600 text-white border-red-600 shadow-xs"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {pct === 0 ? "0%" : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Ringkasan Biaya */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 font-mono text-xs space-y-1.5 shadow-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Diskon ({discountPercent}%):</span>
                  <span>-Rp {discountAmount.toLocaleString("id-ID")}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Pajak PB1 (10%):</span>
                <span>Rp {tax.toLocaleString("id-ID")}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                <span>TOTAL AKHIR:</span>
                <span className="text-red-600 font-bold">
                  Rp {grandTotal.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Kalkulator Tunai / QRIS Code (7 Kolom) */}
          <div className="md:col-span-7 flex flex-col justify-between">
            {paymentMethod === "cash" ? (
              /* ========================================================
                 CASH PAYMENT CALCULATOR (Clean Light Theme)
                 ======================================================== */
              <div className="space-y-3">
                {/* Display Uang Diterima & Kembalian */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[10.5px] font-mono text-slate-500 uppercase block font-semibold">
                      Uang Diterima:
                    </span>
                    <div className="text-xl font-mono font-black text-slate-900 mt-1">
                      Rp {cashAmount.toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-xl border shadow-xs ${
                      cashAmount >= grandTotal
                        ? "bg-emerald-50 border-emerald-300"
                        : "bg-red-50 border-red-300"
                    }`}
                  >
                    <span
                      className={`text-[10.5px] font-mono uppercase block font-bold ${
                        cashAmount >= grandTotal ? "text-emerald-800" : "text-red-800"
                      }`}
                    >
                      {cashAmount >= grandTotal ? "Kembalian:" : "Kurang:"}
                    </span>
                    <div
                      className={`text-xl font-mono font-black mt-1 ${
                        cashAmount >= grandTotal ? "text-emerald-700" : "text-red-600"
                      }`}
                    >
                      {cashAmount >= grandTotal
                        ? `Rp ${change.toLocaleString("id-ID")}`
                        : `Rp ${(grandTotal - cashAmount).toLocaleString("id-ID")}`}
                    </div>
                  </div>
                </div>

                {/* Quick Bill Preset Pills */}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 block mb-1.5 font-bold">
                    Pecahan Cepat Kasir:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
                    {presets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCashAmount(preset.value)}
                        className={`py-2 px-1.5 rounded-lg border font-bold text-center transition-all cursor-pointer ${
                          cashAmount === preset.value
                            ? "bg-red-600 text-white border-red-600 shadow-xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Numeric Keypad */}
                <div className="grid grid-cols-3 gap-1.5 font-mono text-base font-bold">
                  {["7", "8", "9", "4", "5", "6", "1", "2", "3", "000", "0", "C"].map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleKeypad(key)}
                      className={`py-2.5 rounded-lg border transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs ${
                        key === "C"
                          ? "bg-red-100 border-red-300 text-red-700 hover:bg-red-200"
                          : "bg-white border-slate-200 text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* ========================================================
                 QRIS DYNAMIC PAYMENT SIMULATOR
                 ======================================================== */
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 text-center space-y-3 shadow-xs">
                <div className="bg-white p-3 rounded-xl shadow-md inline-block border-2 border-red-600">
                  <div className="w-44 h-44 bg-slate-50 p-2 flex flex-col items-center justify-center relative rounded">
                    <QrCode className="w-36 h-36 text-slate-900" />
                    <div className="absolute inset-x-0 bottom-1 flex items-center justify-center">
                      <span className="text-[8px] font-mono text-red-700 bg-white px-1.5 py-0.5 rounded border border-red-200 font-bold">
                        QRIS • GPN
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    LAVA CHEESE BATU 9 (TANJUNG PINANG)
                  </h4>
                  <p className="text-[11px] font-mono text-slate-500">
                    NMID: ID102008291044 • Acquirer: BCA / Mandiri
                  </p>
                  <div className="mt-1 font-mono text-lg font-black text-red-600">
                    Rp {grandTotal.toLocaleString("id-ID")}
                  </div>
                </div>

                {/* Simulation Button */}
                <button
                  type="button"
                  onClick={() => setQrisPaidSimulated(true)}
                  className={`w-full py-2.5 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    qrisPaidSimulated
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-red-50 hover:bg-red-100 text-red-700 border border-red-300"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {qrisPaidSimulated
                      ? "Pembayaran Terverifikasi (Berhasil)"
                      : "Simulasikan Pelanggan Scan & Bayar Sukses"}
                  </span>
                </button>
              </div>
            )}

            {/* Bottom Final Submit CTA (Dominant Red) */}
            <div className="pt-4 border-t border-slate-200 mt-3">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!isSufficient}
                className={`w-full py-3.5 rounded-xl font-bold font-mono text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer ${
                  isSufficient
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-red-600/30"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                }`}
              >
                <span>Konfirmasi Pembayaran &amp; Cetak Struk</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
