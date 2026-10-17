"use client";

import React, { useState } from "react";
import { Printer, CheckCircle, Copy, Check, FileText, RotateCcw } from "lucide-react";
import { usePosStore, CompletedTransaction } from "@/store/posStore";

interface ThermalReceiptProps {
  transaction?: CompletedTransaction | null;
  onClose?: () => void;
  onNewOrder?: () => void;
}

export function ThermalReceipt({ transaction: propTx, onNewOrder }: ThermalReceiptProps) {
  const {
    lastTransaction,
    receiptFormat,
    setReceiptFormat,
    closeReceiptModal,
    resetOrder,
  } = usePosStore();

  const [activeTab, setActiveTab] = useState<"slip" | "escpos">("slip");
  const [copiedEscpos, setCopiedEscpos] = useState(false);

  const tx = propTx || lastTransaction;

  if (!tx) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white">
        Belum ada riwayat transaksi yang selesai.
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleFinish = () => {
    if (onNewOrder) {
      onNewOrder();
    } else {
      closeReceiptModal();
      resetOrder();
    }
  };

  // Generate raw ESC/POS command representation for thermal printers
  const generateEscPosCommands = () => {
    const is58 = receiptFormat === "58mm";
    const lineChars = is58 ? 32 : 48;
    const divider = "-".repeat(lineChars);

    let esc = "";
    esc += "[ESC @]  // Initialize Printer\n";
    esc += "[ESC a 1] // Align Center\n";
    esc += "[GS ! 17] // Double Height + Double Width\n";
    esc += "LAVA CHEESE BATU 9\n";
    esc += "[GS ! 0]  // Normal Text\n";
    esc += "Resto & Cafe Spesial Keju Leleh\n";
    esc += "Jl. D.I. Panjaitan Km. 9, Tg. Pinang\n";
    esc += "Telp: +62 811-7752-933\n";
    esc += `${divider}\n`;
    esc += "[ESC a 0] // Align Left\n";
    esc += `No. Struk : ${tx.orderNumber}\n`;
    esc += `Waktu     : ${tx.timestamp}\n`;
    esc += `Kasir     : ${tx.cashierName}\n`;
    esc += `Pesanan   : ${tx.orderType === "dine-in" ? `DINE-IN (${tx.table.name})` : "TAKE AWAY"}\n`;
    esc += `${divider}\n`;

    tx.items.forEach((ci) => {
      const name = ci.item.name.substring(0, is58 ? 18 : 28);
      const totalItem = (ci.item.price * ci.quantity).toLocaleString("id-ID");
      esc += `${name.padEnd(is58 ? 20 : 32)} x${ci.quantity} Rp${totalItem}\n`;
      if (ci.notes) {
        esc += `  * ${ci.notes}\n`;
      }
    });

    esc += `${divider}\n`;
    esc += `Subtotal         : Rp ${tx.subtotal.toLocaleString("id-ID")}\n`;
    if (tx.discount > 0) {
      esc += `Diskon (${tx.discount}%)     : -Rp ${tx.discountAmount.toLocaleString("id-ID")}\n`;
    }
    esc += `Pajak PB1 (10%)  : Rp ${tx.tax.toLocaleString("id-ID")}\n`;
    esc += `TOTAL AKHIR      : Rp ${tx.grandTotal.toLocaleString("id-ID")}\n`;
    esc += `${divider}\n`;
    esc += `Metode Bayar     : ${tx.paymentMethod.toUpperCase()}\n`;
    esc += `Bayar            : Rp ${tx.cashReceived.toLocaleString("id-ID")}\n`;
    esc += `Kembalian        : Rp ${tx.change.toLocaleString("id-ID")}\n`;
    esc += `${divider}\n`;
    esc += "[ESC a 1] // Align Center\n";
    esc += "TERIMA KASIH ATAS KUNJUNGAN ANDA!\n";
    esc += "Follow Instagram: @lavacheese.id\n";
    esc += "[GS k 2]  // Barcode / QR Code Payload\n";
    esc += `*${tx.orderNumber}*\n`;
    esc += "[ESC d 3] // Feed 3 Lines\n";
    esc += "[GS V 0]  // Partial Paper Cut\n";

    return esc;
  };

  const handleCopyEscPos = () => {
    navigator.clipboard.writeText(generateEscPosCommands());
    setCopiedEscpos(true);
    setTimeout(() => setCopiedEscpos(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 text-slate-900 select-none">
      {/* Top Header Controls (Clean Light + Dominant Red Accent) */}
      <div className="no-print p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              Transaksi Berhasil &amp; Siap Cetak
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Order {tx.orderNumber} • {tx.table.name}
            </p>
          </div>
        </div>

        {/* Paper Format Switcher & Tabs */}
        <div className="flex items-center gap-2">
          {/* Format selector */}
          <div className="bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex text-xs font-mono">
            <button
              type="button"
              onClick={() => setReceiptFormat("58mm")}
              className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                receiptFormat === "58mm"
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              58mm Mini
            </button>
            <button
              type="button"
              onClick={() => setReceiptFormat("80mm")}
              className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                receiptFormat === "80mm"
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              80mm POS
            </button>
          </div>

          {/* View Tab */}
          <div className="bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("slip")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === "slip"
                  ? "bg-white text-slate-900 font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-red-600" />
              <span>Struk Fisik</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("escpos")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === "escpos"
                  ? "bg-white text-slate-900 font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Printer className="w-3.5 h-3.5 text-red-600" />
              <span>ESC/POS Code</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md shadow-red-600/25 transition-transform active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Struk (Print)</span>
          </button>

          <button
            type="button"
            onClick={handleFinish}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Transaksi Baru</span>
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center bg-slate-100 pos-light-scrollbar">
        {activeTab === "slip" ? (
          /* ========================================================
             THERMAL PAPER VISUAL SLIP (@media print ready)
             ======================================================== */
          <div
            id="printable-receipt"
            className={`bg-white text-slate-900 font-mono shadow-xl p-5 border-t-4 border-red-600 transition-all duration-200 relative select-text rounded-b-sm ${
              receiptFormat === "58mm" ? "w-[280px] text-[11px]" : "w-[360px] text-[12.5px]"
            }`}
            style={{
              lineHeight: "1.35",
            }}
          >
            {/* Top Zigzag Pattern Decorator */}
            <div
              className="no-print absolute -top-2 left-0 right-0 h-2 bg-repeat-x pointer-events-none opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle, transparent, transparent 50%, #ffffff 50%, #ffffff 100%)",
                backgroundSize: "10px 10px",
              }}
            />

            {/* Receipt Header */}
            <div className="text-center pb-3 border-b border-dashed border-slate-300">
              <div className="inline-block px-2 py-0.5 mb-1 rounded bg-red-600 text-white font-black text-xs tracking-wider">
                LAVA CHEESE
              </div>
              <h2 className="font-extrabold text-base tracking-tight text-slate-900 leading-tight">
                LAVA CHEESE BATU 9
              </h2>
              <p className="text-[10px] text-slate-600 mt-0.5">
                Resto &amp; Cafe Spesial Keju Leleh
              </p>
              <p className="text-[9.5px] text-slate-500">
                Jl. D.I. Panjaitan Km. 9, Tg. Pinang Timur
              </p>
              <p className="text-[9.5px] text-slate-500">WhatsApp: +62 811-7752-933</p>
            </div>

            {/* Metadata */}
            <div className="py-2.5 border-b border-dashed border-slate-300 text-[10.5px] space-y-0.5">
              <div className="flex justify-between">
                <span className="text-slate-500">No. Nota:</span>
                <span className="font-bold text-slate-900">{tx.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Waktu:</span>
                <span>{tx.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kasir:</span>
                <span>{tx.cashierName}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">Tipe / Meja:</span>
                <span className="text-red-700">
                  {tx.orderType === "dine-in"
                    ? `DINE-IN (${tx.table.name})`
                    : "BUNGKUS / TAKE AWAY"}
                </span>
              </div>
            </div>

            {/* Items List */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-2">
              <div className="flex justify-between text-[10px] text-slate-500 uppercase font-semibold">
                <span>Menu Item</span>
                <span>Total</span>
              </div>

              {tx.items.map((ci, index) => {
                const itemTotal = ci.item.price * ci.quantity;
                return (
                  <div key={index} className="space-y-0.5">
                    <div className="flex justify-between font-semibold">
                      <span className="truncate pr-2">{ci.item.name}</span>
                      <span className="shrink-0 text-slate-900 font-bold">
                        Rp {itemTotal.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>
                        {ci.quantity} x @Rp {ci.item.price.toLocaleString("id-ID")}
                      </span>
                    </div>
                    {ci.notes && (
                      <div className="text-[9.5px] text-red-700 italic bg-red-50 px-1 py-0.5 rounded border border-red-100">
                        * {ci.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Payment Summary */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>Rp {tx.subtotal.toLocaleString("id-ID")}</span>
              </div>

              {tx.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Diskon Promo ({tx.discount}%):</span>
                  <span>-Rp {tx.discountAmount.toLocaleString("id-ID")}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Pajak Resto PB1 (10%):</span>
                <span>Rp {tx.tax.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex justify-between text-sm font-black pt-1 border-t border-slate-200 text-slate-900">
                <span>TOTAL:</span>
                <span className="text-red-700">Rp {tx.grandTotal.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* Tender Info */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Metode Bayar:</span>
                <span className="font-bold uppercase text-slate-900">
                  {tx.paymentMethod === "qris" ? "QRIS DINAMIS (LUNAS)" : "TUNAI / CASH"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Uang Diterima:</span>
                <span>Rp {tx.cashReceived.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">Kembalian:</span>
                <span className="text-slate-900">Rp {tx.change.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* Footer Notice & Simulated Barcode */}
            <div className="pt-3 text-center space-y-2">
              <p className="text-[10px] text-slate-600 leading-tight">
                TERIMA KASIH ATAS KUNJUNGAN ANDA!
                <br />
                Kritik &amp; Saran: IG @lavacheese.id
                <br />
                Makanan yang dibeli tidak dapat ditukar
              </p>

              {/* Barcode Graphic */}
              <div className="pt-1 flex flex-col items-center">
                <div className="h-8 w-44 bg-repeat-x flex items-center justify-center font-mono tracking-widest text-[10px] bg-slate-100 text-slate-800 border border-slate-300">
                  ||||| | |||| ||| |||| | ||
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5 tracking-wider font-mono">
                  *{tx.orderNumber}*
                </span>
              </div>
            </div>

            {/* Bottom Paper Tear Simulation */}
            <div
              className="no-print absolute -bottom-2 left-0 right-0 h-2 bg-repeat-x pointer-events-none opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle, transparent, transparent 50%, #ffffff 50%, #ffffff 100%)",
                backgroundSize: "10px 10px",
                transform: "rotate(180deg)",
              }}
            />
          </div>
        ) : (
          /* ========================================================
             ESC/POS COMMAND RAW DATA CODE VIEW (Clean Code Box)
             ======================================================== */
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xl flex flex-col">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-red-600" />
                <span className="text-xs font-mono font-bold text-slate-800">
                  ESC/POS Thermal Raw Commands ({receiptFormat})
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyEscPos}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                {copiedEscpos ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Raw Code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-700 bg-slate-900 text-emerald-400 overflow-x-auto leading-relaxed max-h-[500px]">
              {generateEscPosCommands()}
            </pre>
          </div>
        )}
      </div>

      {/* Embedded CSS for Print Styling */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-receipt,
          #printable-receipt * {
            visibility: visible !important;
          }
          #printable-receipt {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: ${receiptFormat === "58mm" ? "58mm" : "80mm"} !important;
            margin: 0 !important;
            padding: 2mm !important;
            box-shadow: none !important;
            border-top: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
