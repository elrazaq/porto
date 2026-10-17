import { create } from "zustand";
import { PosMenuItem, TableItem, INITIAL_TABLES } from "@/data/posMenu";

export interface CartItem {
  item: PosMenuItem;
  quantity: number;
  notes?: string;
}

export interface CompletedTransaction {
  orderNumber: string;
  orderType: 'dine-in' | 'takeaway';
  table: TableItem;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  discountAmount: number;
  grandTotal: number;
  paymentMethod: 'cash' | 'qris';
  cashReceived: number;
  change: number;
  timestamp: string;
  cashierName: string;
}

interface PosState {
  // Cart & Order
  cart: CartItem[];
  orderType: 'dine-in' | 'takeaway';
  selectedTable: TableItem;
  tables: TableItem[];
  discountPercent: number; // e.g. 0, 5, 10
  taxPercent: number; // PB1 10%

  // Modals & UI States
  paymentModalOpen: boolean;
  tableModalOpen: boolean;
  receiptModalOpen: boolean;
  receiptFormat: '58mm' | '80mm';
  deviceMode: 'tablet' | 'mobile';

  // Last completed transaction
  lastTransaction: CompletedTransaction | null;

  // Actions
  addToCart: (item: PosMenuItem) => void;
  removeFromCart: (itemId: string) => void;
  increaseQuantity: (itemId: string) => void;
  decreaseQuantity: (itemId: string) => void;
  setItemNotes: (itemId: string, notes: string) => void;
  clearCart: () => void;
  setOrderType: (type: 'dine-in' | 'takeaway') => void;
  selectTable: (table: TableItem) => void;
  setDiscount: (percent: number) => void;
  setDeviceMode: (mode: 'tablet' | 'mobile') => void;
  setReceiptFormat: (format: '58mm' | '80mm') => void;

  openPaymentModal: () => void;
  closePaymentModal: () => void;
  openTableModal: () => void;
  closeTableModal: () => void;
  openReceiptModal: () => void;
  closeReceiptModal: () => void;

  completePayment: (method: 'cash' | 'qris', cashReceived: number) => CompletedTransaction;
  resetOrder: () => void;

  // Computed calculations
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTaxAmount: () => number;
  getGrandTotal: () => number;
  getTotalItems: () => number;
}

export const usePosStore = create<PosState>((set, get) => ({
  cart: [
    // Pre-populate with realistic initial items for instant demo delight
    {
      item: {
        id: 'combo-lava-1',
        name: 'Combo Lava 1 (Signature)',
        category: 'combo-lava',
        price: 46000,
        priceFormatted: 'Rp 46.000',
        description: '1 Ayam Crispy dibalut Saus Lava Pedas Gurih + Saus Keju Leleh + Nasi + Minum.',
        image: 'https://images.unsplash.com/photo-1527477245898-def308bc29e3?w=500&auto=format&fit=crop&q=80',
        popular: true,
        spicyLevel: true,
      },
      quantity: 2,
      notes: 'Level pedas 3, saus keju dipisah',
    },
    {
      item: {
        id: 'red-sunrise',
        name: 'Red Sunrise Mocktail',
        category: 'drinks',
        price: 22000,
        priceFormatted: 'Rp 22.000',
        description: 'Mocktail segar sirup delima merah, sari jeruk manis, dan soda dingin menyegarkan.',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80',
        popular: true,
      },
      quantity: 2,
      notes: 'Kurang es batu',
    },
    {
      item: {
        id: 'french-fries',
        name: 'French Fries Golden Crispy',
        category: 'alacarte',
        price: 19000,
        priceFormatted: 'Rp 19.000',
        description: 'Kentang goreng impor renyah dengan taburan bumbu keju dan saus cocol.',
        image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80',
        popular: true,
      },
      quantity: 1,
    },
  ],
  orderType: 'dine-in',
  selectedTable: INITIAL_TABLES[0],
  tables: INITIAL_TABLES,
  discountPercent: 0,
  taxPercent: 10,

  paymentModalOpen: false,
  tableModalOpen: false,
  receiptModalOpen: false,
  receiptFormat: '58mm',
  deviceMode: 'tablet',
  lastTransaction: null,

  addToCart: (item: PosMenuItem) => {
    set((state) => {
      const existing = state.cart.find((ci) => ci.item.id === item.id);
      if (existing) {
        return {
          cart: state.cart.map((ci) =>
            ci.item.id === item.id
              ? { ...ci, quantity: ci.quantity + 1 }
              : ci
          ),
        };
      }
      return {
        cart: [...state.cart, { item, quantity: 1 }],
      };
    });
  },

  removeFromCart: (itemId: string) => {
    set((state) => ({
      cart: state.cart.filter((ci) => ci.item.id !== itemId),
    }));
  },

  increaseQuantity: (itemId: string) => {
    set((state) => ({
      cart: state.cart.map((ci) =>
        ci.item.id === itemId
          ? { ...ci, quantity: ci.quantity + 1 }
          : ci
      ),
    }));
  },

  decreaseQuantity: (itemId: string) => {
    set((state) => {
      const existing = state.cart.find((ci) => ci.item.id === itemId);
      if (existing && existing.quantity > 1) {
        return {
          cart: state.cart.map((ci) =>
            ci.item.id === itemId
              ? { ...ci, quantity: ci.quantity - 1 }
              : ci
          ),
        };
      }
      // If quantity is 1, remove item
      return {
        cart: state.cart.filter((ci) => ci.item.id !== itemId),
      };
    });
  },

  setItemNotes: (itemId: string, notes: string) => {
    set((state) => ({
      cart: state.cart.map((ci) =>
        ci.item.id === itemId ? { ...ci, notes } : ci
      ),
    }));
  },

  clearCart: () => {
    set({ cart: [], discountPercent: 0 });
  },

  setOrderType: (type: 'dine-in' | 'takeaway') => {
    set((state) => {
      if (type === 'takeaway') {
        const takeawayTable = state.tables.find((t) => t.id === 't-takeaway') || state.selectedTable;
        return { orderType: type, selectedTable: takeawayTable };
      }
      return { orderType: type };
    });
  },

  selectTable: (table: TableItem) => {
    set({
      selectedTable: table,
      tableModalOpen: false,
      orderType: table.id === 't-takeaway' ? 'takeaway' : 'dine-in',
    });
  },

  setDiscount: (percent: number) => {
    set({ discountPercent: percent });
  },

  setDeviceMode: (mode: 'tablet' | 'mobile') => {
    set({ deviceMode: mode });
  },

  setReceiptFormat: (format: '58mm' | '80mm') => {
    set({ receiptFormat: format });
  },

  openPaymentModal: () => set({ paymentModalOpen: true }),
  closePaymentModal: () => set({ paymentModalOpen: false }),
  openTableModal: () => set({ tableModalOpen: true }),
  closeTableModal: () => set({ tableModalOpen: false }),
  openReceiptModal: () => set({ receiptModalOpen: true }),
  closeReceiptModal: () => set({ receiptModalOpen: false }),

  completePayment: (method: 'cash' | 'qris', cashReceived: number) => {
    const state = get();
    const subtotal = state.getSubtotal();
    const discountAmount = state.getDiscountAmount();
    const tax = state.getTaxAmount();
    const grandTotal = state.getGrandTotal();
    const change = Math.max(0, cashReceived - grandTotal);

    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `LC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${randomSuffix}`;

    const transaction: CompletedTransaction = {
      orderNumber,
      orderType: state.orderType,
      table: state.selectedTable,
      items: [...state.cart],
      subtotal,
      tax,
      discount: state.discountPercent,
      discountAmount,
      grandTotal,
      paymentMethod: method,
      cashReceived: method === 'cash' ? cashReceived : grandTotal,
      change: method === 'cash' ? change : 0,
      timestamp: `${dateStr} • ${timeStr} WIB`,
      cashierName: 'Kasir 01 (Rian)',
    };

    // Update table status to occupied if dine-in
    const updatedTables = state.tables.map((t) =>
      t.id === state.selectedTable.id && t.id !== 't-takeaway'
        ? { ...t, status: 'occupied' as const, currentTotal: grandTotal, orderCount: (t.orderCount || 0) + 1 }
        : t
    );

    set({
      lastTransaction: transaction,
      tables: updatedTables,
      paymentModalOpen: false,
      receiptModalOpen: true,
      cart: [],
      discountPercent: 0,
    });

    return transaction;
  },

  resetOrder: () => {
    set({
      cart: [],
      discountPercent: 0,
      paymentModalOpen: false,
      tableModalOpen: false,
      receiptModalOpen: false,
    });
  },

  getSubtotal: () => {
    return get().cart.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  },

  getDiscountAmount: () => {
    const subtotal = get().getSubtotal();
    return Math.round((subtotal * get().discountPercent) / 100);
  },

  getTaxAmount: () => {
    const subtotal = get().getSubtotal();
    const discountAmount = get().getDiscountAmount();
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    return Math.round(taxableAmount * (get().taxPercent / 100));
  },

  getGrandTotal: () => {
    const subtotal = get().getSubtotal();
    const discountAmount = get().getDiscountAmount();
    const tax = get().getTaxAmount();
    return subtotal - discountAmount + tax;
  },

  getTotalItems: () => {
    return get().cart.reduce((sum, ci) => sum + ci.quantity, 0);
  },
}));
