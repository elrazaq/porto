"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Utensils,
  ShoppingBag,
  Flame,
  Smartphone,
  Tablet,
  CreditCard,
  MessageSquare,
  Clock,
  Printer,
  ChevronRight,
  X,
} from "lucide-react";

import { usePosStore } from "@/store/posStore";
import { POS_CATEGORIES, POS_MENU_ITEMS } from "@/data/posMenu";
import { TableModal } from "./TableModal";
import { PaymentModal } from "./PaymentModal";
import { ThermalReceipt } from "./ThermalReceipt";

interface RestaurantPosAppProps {
  initialDeviceMode?: "tablet" | "mobile";
}

export function RestaurantPosApp({ initialDeviceMode }: RestaurantPosAppProps) {
  const {
    cart,
    selectedTable,
    orderType,
    setOrderType,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    getSubtotal,
    getTaxAmount,
    getDiscountAmount,
    getGrandTotal,
    getTotalItems,
    setItemNotes,
    openPaymentModal,
    openTableModal,
    openReceiptModal,
    paymentModalOpen,
    tableModalOpen,
    receiptModalOpen,
    deviceMode,
    setDeviceMode,
  } = usePosStore();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");

  // Set initial device mode if provided
  useEffect(() => {
    if (initialDeviceMode) {
      setDeviceMode(initialDeviceMode);
    }
  }, [initialDeviceMode, setDeviceMode]);

  // Realtime Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " WIB"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter menu items by category & search query
  const filteredItems = POS_MENU_ITEMS.filter((item) => {
    const matchCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchSearch =
      searchQuery.trim() === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const subtotal = getSubtotal();
  const tax = getTaxAmount();
  const discountAmount = getDiscountAmount();
  const grandTotal = getGrandTotal();
  const totalItems = getTotalItems();

  const handleSaveNote = (itemId: string) => {
    setItemNotes(itemId, noteInput);
    setEditingNoteId(null);
    setNoteInput("");
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 text-slate-900 select-none overflow-hidden font-sans">
      {/* ========================================================
          1. TOP CASHIER TOOLBAR (Clean White + Dominant Red Accent)
          ======================================================== */}
      <header className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3 shrink-0 z-20 shadow-xs">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-red-500/25 shrink-0">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-xs sm:text-sm tracking-tight text-slate-900 truncate">
                LAVA CHEESE
              </h1>
              <span className="px-1.5 py-0.5 bg-red-100 text-red-700 border border-red-200 text-[9px] font-mono font-bold rounded">
                BATU 9
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono truncate hidden sm:block">
              Cloud Resto &amp; Cafe POS • Tg. Pinang Timur
            </p>
          </div>
        </div>

        {/* Center: Table & Order Type Selector */}
        <div className="flex items-center gap-2">
          {/* Table Selector Pill */}
          <button
            type="button"
            onClick={openTableModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-300 rounded-lg text-xs font-mono font-bold text-slate-800 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Pilih Meja Pelanggan"
          >
            <Utensils className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span className="truncate max-w-[100px] sm:max-w-none text-slate-900">
              {selectedTable.name}
            </span>
            <span className="text-[10px] text-slate-500 hidden md:inline">
              ({selectedTable.area})
            </span>
          </button>

          {/* Dine-In vs Takeaway Toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-mono font-bold">
            <button
              type="button"
              onClick={() => setOrderType("dine-in")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                orderType === "dine-in"
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Dine-In
            </button>
            <button
              type="button"
              onClick={() => setOrderType("takeaway")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                orderType === "takeaway"
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Bungkus
            </button>
          </div>
        </div>

        {/* Right: Cashier Info & Device Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Clock */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            <Clock className="w-3 h-3 text-red-600" />
            <span>{currentTime || "12:00:00 WIB"}</span>
          </div>

          {/* Receipt Shortcut */}
          <button
            type="button"
            onClick={openReceiptModal}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-red-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            title="Cetak Ulang Struk Terakhir"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ========================================================
          2. MAIN BODY (Clean Light Layout: Menu Catalog + Cart)
          ======================================================== */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* ======================================================
            CENTER/LEFT: MENU CATALOG & CATEGORY FILTER
            ====================================================== */}
        <main
          className={`flex-1 flex flex-col overflow-hidden bg-slate-50 ${
            deviceMode === "mobile" ? "w-full" : ""
          }`}
        >
          {/* Subheader: Search Bar & Categories */}
          <div className="p-3 bg-white border-b border-slate-200 space-y-2.5 shrink-0 shadow-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari menu cepat (misal: Lava, Crispy, Taro, Red Sunrise)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-sans shadow-inner transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Pills (Red Dominant Accent) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
              {POS_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                        : "bg-white text-slate-600 hover:bg-red-50 hover:text-red-700 border border-slate-200"
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 pos-light-scrollbar">
            {filteredItems.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-slate-400 text-xs">
                <Utensils className="w-8 h-8 mb-2 opacity-30 text-slate-400" />
                <p>Menu tidak ditemukan untuk kata kunci tersebut.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
                {filteredItems.map((item) => {
                  const inCartItem = cart.find((ci) => ci.item.id === item.id);
                  const inCartQty = inCartItem?.quantity || 0;

                  return (
                    <div
                      key={item.id}
                      onClick={() => addToCart(item)}
                      className={`group bg-white border rounded-xl overflow-hidden p-2.5 flex flex-col justify-between transition-all duration-150 cursor-pointer hover:border-red-400 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] relative ${
                        inCartQty > 0
                          ? "border-red-500 ring-2 ring-red-500/20 bg-red-50/10 shadow-sm"
                          : "border-slate-200 shadow-xs"
                      }`}
                    >
                      {/* Active In-Cart Quantity Badge */}
                      {inCartQty > 0 && (
                        <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-red-600 text-white font-mono font-black text-xs flex items-center justify-center shadow-md animate-in fade-in">
                          {inCartQty}
                        </div>
                      )}

                      {/* Item Image with Guaranteed Fallback */}
                      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 mb-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80";
                          }}
                        />
                        {/* Spicy badge */}
                        {item.spicyLevel && (
                          <span className="absolute bottom-1 left-1 bg-red-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow">
                            <Flame className="w-2.5 h-2.5" />
                            Lava Hot
                          </span>
                        )}
                        {/* Popular badge */}
                        {item.popular && (
                          <span className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-mono font-black px-1.5 py-0.5 rounded shadow">
                            FAVORIT
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <div className="min-w-0">
                        <h3 className="font-bold text-xs text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-sans">
                          {item.description}
                        </p>
                      </div>

                      {/* Price & Fast Add Button */}
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-mono font-extrabold text-red-600">
                          {item.priceFormatted}
                        </span>
                        <div className="w-6 h-6 rounded-md bg-slate-100 group-hover:bg-red-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-colors shadow-xs">
                          <Plus className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        {/* ======================================================
            RIGHT: INSTANT CASHIER CART (Clean Light Theme)
            ====================================================== */}
        <aside
          className={`bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col shrink-0 shadow-lg ${
            deviceMode === "mobile"
              ? "w-full max-h-[380px] lg:max-h-none lg:w-80"
              : "w-full lg:w-[350px] xl:w-[380px]"
          }`}
        >
          {/* Cart Header */}
          <div className="p-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                {totalItems}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Keranjang Kasir</span>
                  <span className="text-[10px] text-slate-500 font-mono font-normal">
                    ({selectedTable.name})
                  </span>
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">
                  Order #Live-01 • {orderType.toUpperCase()}
                </p>
              </div>
            </div>

            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-[11px] font-mono text-red-600 hover:text-red-700 p-1 flex items-center gap-1 cursor-pointer transition-colors"
                title="Hapus semua pesanan"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 pos-light-scrollbar">
            {cart.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-slate-400 text-xs text-center p-4">
                <ShoppingBag className="w-10 h-10 mb-2 opacity-25 text-red-600" />
                <p className="font-semibold text-slate-600">Keranjang kasir masih kosong</p>
                <p className="text-[10.5px] text-slate-400 mt-1">
                  Klik menu di samping untuk menambahkan pesanan pelanggan.
                </p>
              </div>
            ) : (
              cart.map((ci) => {
                const itemTotal = ci.item.price * ci.quantity;
                const isEditingThisNote = editingNoteId === ci.item.id;

                return (
                  <div
                    key={ci.item.id}
                    className="p-2.5 bg-slate-50/90 rounded-xl border border-slate-200/90 space-y-1.5 text-xs font-sans transition-all shadow-xs"
                  >
                    {/* Top Row: Title & Remove */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-900 truncate text-[12.5px]">
                          {ci.item.name}
                        </h4>
                        <div className="text-[11px] font-mono font-bold text-red-600">
                          Rp {ci.item.price.toLocaleString("id-ID")}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(ci.item.id)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                        title="Hapus item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Note row / Edit note */}
                    {isEditingThisNote ? (
                      <div className="flex items-center gap-1.5 pt-1">
                        <input
                          type="text"
                          value={noteInput}
                          onChange={(e) => setNoteInput(e.target.value)}
                          placeholder="Catatan (misal: Jangan pedas / Saus pisah)"
                          className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-[11px] text-slate-800 focus:outline-none focus:border-red-500 shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveNote(ci.item.id)}
                          className="px-2 py-1 bg-red-600 text-white font-bold text-[10px] rounded cursor-pointer shadow-xs"
                        >
                          Simpan
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-[10px]">
                        {ci.notes ? (
                          <span
                            onClick={() => {
                              setEditingNoteId(ci.item.id);
                              setNoteInput(ci.notes || "");
                            }}
                            className="text-red-700 italic bg-red-50 px-1.5 py-0.5 rounded border border-red-200 truncate max-w-[200px] cursor-pointer hover:border-red-400 font-medium"
                          >
                            * {ci.notes}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNoteId(ci.item.id);
                              setNoteInput("");
                            }}
                            className="text-slate-400 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                          >
                            <MessageSquare className="w-2.5 h-2.5" />
                            <span>+ Tambah Catatan</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Quantity Controls & Line Subtotal */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 font-mono">
                      <div className="flex items-center gap-1.5 bg-white rounded-lg border border-slate-200 p-0.5 shadow-xs">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(ci.item.id)}
                          className="w-6 h-6 rounded flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-xs text-slate-900">
                          {ci.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(ci.item.id)}
                          className="w-6 h-6 rounded flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-extrabold text-xs text-slate-900">
                        Rp {itemTotal.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Pricing Calculation Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2 shrink-0">
            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({totalItems} item):</span>
                <span>Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Diskon Promo:</span>
                  <span>-Rp {discountAmount.toLocaleString("id-ID")}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Pajak Resto PB1 (10%):</span>
                <span>Rp {tax.toLocaleString("id-ID")}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                <span>TOTAL AKHIR:</span>
                <span className="text-red-600 font-mono text-base font-extrabold">
                  Rp {grandTotal.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Pay Button (Dominant Red) */}
            <button
              type="button"
              onClick={openPaymentModal}
              disabled={cart.length === 0}
              className={`w-full py-3.5 rounded-xl font-bold font-mono text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer ${
                cart.length > 0
                  ? "bg-red-600 hover:bg-red-700 text-white shadow-red-600/30"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Bayar &amp; Selesaikan (Rp {grandTotal.toLocaleString("id-ID")})</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </aside>
      </div>

      {/* ========================================================
          3. MODALS (Clean Light Theme)
          ======================================================== */}
      {tableModalOpen && <TableModal />}
      {paymentModalOpen && <PaymentModal />}
      {receiptModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-2xl h-[90vh] bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xl flex flex-col">
            <ThermalReceipt />
          </div>
        </div>
      )}
    </div>
  );
}
