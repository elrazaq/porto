export interface PosMenuItem {
  id: string;
  name: string;
  category: 'combo-crispy' | 'combo-lava' | 'alacarte' | 'drinks' | 'coffee';
  price: number;
  priceFormatted: string;
  description: string;
  image: string;
  popular?: boolean;
  spicyLevel?: boolean;
}

export interface TableItem {
  id: string;
  name: string;
  area: 'Indoor Utama' | 'Area Outdoor' | 'VIP Room' | 'Takeaway Counter';
  capacity: number;
  status: 'available' | 'occupied' | 'billing';
  orderCount?: number;
  currentTotal?: number;
}

export const POS_CATEGORIES = [
  { id: 'all', label: 'Semua Menu', icon: 'Utensils' },
  { id: 'combo-crispy', label: 'Combo Crispy', icon: 'Flame' },
  { id: 'combo-lava', label: 'Lava & Volcano', icon: 'Zap' },
  { id: 'alacarte', label: 'A La Carte & Snacks', icon: 'Box' },
  { id: 'drinks', label: 'Mocktail & Segar', icon: 'Sparkles' },
  { id: 'coffee', label: 'Coffee & Frappe', icon: 'Coffee' },
] as const;

export const POS_MENU_ITEMS: PosMenuItem[] = [
  // Combo Crispy
  {
    id: 'combo-crispy-1',
    name: 'Combo Crispy 1',
    category: 'combo-crispy',
    price: 21500,
    priceFormatted: 'Rp 21.500',
    description: '1 Ayam Crispy Dada/Paha Atas + 1 Nasi Pulen + Air Mineral Dingin.',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=80',
    popular: true,
  },
  {
    id: 'combo-crispy-2',
    name: 'Combo Crispy 2',
    category: 'combo-crispy',
    price: 46000,
    priceFormatted: 'Rp 46.000',
    description: '2 Ayam Crispy Golden Brown + 1 Nasi Pulen + Saus Celup + Air Mineral.',
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'combo-crispy-3',
    name: 'Combo Crispy 3 (Party)',
    category: 'combo-crispy',
    price: 53000,
    priceFormatted: 'Rp 53.000',
    description: '3 Ayam Crispy Renyah Gurih + 1 French Fries + Saus BBQ + Minuman.',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80',
  },

  // Combo Lava & Volcano (Signature Lava Cheese)
  {
    id: 'combo-lava-1',
    name: 'Combo Lava 1 (Signature)',
    category: 'combo-lava',
    price: 46000,
    priceFormatted: 'Rp 46.000',
    description: '1 Ayam Crispy dibalut Saus Lava Pedas Gurih + Saus Keju Leleh + Nasi + Minum.',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&auto=format&fit=crop&q=80',
    popular: true,
    spicyLevel: true,
  },
  {
    id: 'combo-lava-2',
    name: 'Combo Lava 2 Double',
    category: 'combo-lava',
    price: 49000,
    priceFormatted: 'Rp 49.000',
    description: '2 Ayam Saus Lava Spesial + Ekstra Melted Cheese Cup + Nasi + Minum.',
    image: 'https://images.unsplash.com/photo-1626082896492-766af4eb6501?w=500&auto=format&fit=crop&q=80',
    spicyLevel: true,
  },
  {
    id: 'combo-volcano-1',
    name: 'Combo Volcano 1 Super Pedas',
    category: 'combo-lava',
    price: 47000,
    priceFormatted: 'Rp 47.000',
    description: '1 Ayam Volcano Cabai Rawit Api + Double Saus Keju Lava + Nasi + Air Mineral.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=80',
    spicyLevel: true,
  },
  {
    id: 'combo-volcano-2',
    name: 'Combo Volcano 2 Party Pack',
    category: 'combo-lava',
    price: 65000,
    priceFormatted: 'Rp 65.000',
    description: '2 Ayam Volcano Berapi + 2 Cup Saus Keju Cheddar Hangat + 1 Nasi + Minuman.',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&auto=format&fit=crop&q=80',
    spicyLevel: true,
  },
  {
    id: 'combo-lava-wings',
    name: 'Combo Lava Wings 4pcs',
    category: 'combo-lava',
    price: 35000,
    priceFormatted: 'Rp 35.000',
    description: '4 Sayap Ayam Renyah berlapis Saus Pedas Lava + Cocolan Keju + Nasi.',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop&q=80',
    popular: true,
    spicyLevel: true,
  },
  {
    id: 'combo-geprek-lava',
    name: 'Combo Geprek Sambal Lava',
    category: 'combo-lava',
    price: 33000,
    priceFormatted: 'Rp 33.000',
    description: 'Ayam Geprek Crispy dengan ulekan sambal lava bawang + Nasi + Es Teh Manis.',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=80',
    spicyLevel: true,
  },

  // A La Carte & Snacks
  {
    id: 'alacarte-ayam-lava',
    name: 'Ayam Lava Cheese (Satuan)',
    category: 'alacarte',
    price: 29000,
    priceFormatted: 'Rp 29.000',
    description: '1 potong Ayam Renyah berlumur saus lava pedas manis gurih (tanpa nasi).',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'alacarte-ayam-crispy',
    name: 'Ayam Crispy Original (Satuan)',
    category: 'alacarte',
    price: 21000,
    priceFormatted: 'Rp 21.000',
    description: '1 potong Ayam Goreng Tepung Crispy rempah rahasia Batu 9.',
    image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'french-fries',
    name: 'French Fries Golden Crispy',
    category: 'alacarte',
    price: 19000,
    priceFormatted: 'Rp 19.000',
    description: 'Kentang goreng impor renyah dengan taburan bumbu keju dan saus cocol.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80',
    popular: true,
  },
  {
    id: 'extra-cheese-sauce',
    name: 'Extra Cup Saus Keju Lava',
    category: 'alacarte',
    price: 8000,
    priceFormatted: 'Rp 8.000',
    description: '1 Cup Saus Keju Hangat Kental gurih racikan khas Lava Cheese.',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'lava-box-blackpepper',
    name: 'Lava Box Black Pepper',
    category: 'alacarte',
    price: 25000,
    priceFormatted: 'Rp 25.000',
    description: 'Nasi hangat dengan potongan ayam crispy berlumur lada hitam wangi di kotak praktis.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'nasi-putih',
    name: 'Nasi Putih Pulen Wangi',
    category: 'alacarte',
    price: 6000,
    priceFormatted: 'Rp 6.000',
    description: 'Porsi nasi putih hangat beras premium.',
    image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=500&auto=format&fit=crop&q=80',
  },

  // Drinks & Mocktail
  {
    id: 'red-sunrise',
    name: 'Red Sunrise Mocktail',
    category: 'drinks',
    price: 22000,
    priceFormatted: 'Rp 22.000',
    description: 'Mocktail segar sirup delima merah, sari jeruk manis, dan soda dingin menyegarkan.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80',
    popular: true,
  },
  {
    id: 'floating-coconut-taro',
    name: 'Floating Coconut Taro',
    category: 'drinks',
    price: 30000,
    priceFormatted: 'Rp 30.000',
    description: 'Minuman taro ungu creamy dengan jelly kelapa muda dan es serut manis.',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'cola-softdrink',
    name: 'Coca Cola Dingin Kaleng',
    category: 'drinks',
    price: 9000,
    priceFormatted: 'Rp 9.000',
    description: 'Minuman bersoda dingin kaleng 330ml.',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'air-mineral',
    name: 'Air Mineral Botol 600ml',
    category: 'drinks',
    price: 5000,
    priceFormatted: 'Rp 5.000',
    description: 'Air mineral murni dingin atau biasa.',
    image: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=500&auto=format&fit=crop&q=80',
  },

  // Coffee & Frappe
  {
    id: 'cappuccino-cincau',
    name: 'Cappuccino Cincau Hitam',
    category: 'coffee',
    price: 20000,
    priceFormatted: 'Rp 20.000',
    description: 'Kopi cappuccino manis legit berpadu dengan potongan cincau hitam kenyal.',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&auto=format&fit=crop&q=80',
    popular: true,
  },
  {
    id: 'cold-butterscotch',
    name: 'Cold Butterscotch Latte',
    category: 'coffee',
    price: 28000,
    priceFormatted: 'Rp 28.000',
    description: 'Espresso blend susu segar dengan sirup butterscotch wangi karamel gurih.',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'sea-salt-coffee',
    name: 'Sea Salt Cream Coffee',
    category: 'coffee',
    price: 42000,
    priceFormatted: 'Rp 42.000',
    description: 'Cold brew pekat dengan lapisan busa sea salt cream gurih asin manis.',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'red-velvet-frappe',
    name: 'Red Velvet Ice Frappe',
    category: 'coffee',
    price: 37000,
    priceFormatted: 'Rp 37.000',
    description: 'Minuman blender red velvet manis lembut dengan topping whipped cream keju.',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_TABLES: TableItem[] = [
  { id: 't-01', name: 'Meja 01', area: 'Indoor Utama', capacity: 2, status: 'available' },
  { id: 't-02', name: 'Meja 02', area: 'Indoor Utama', capacity: 4, status: 'occupied', orderCount: 3, currentTotal: 124500 },
  { id: 't-03', name: 'Meja 03', area: 'Indoor Utama', capacity: 4, status: 'available' },
  { id: 't-04', name: 'Meja 04', area: 'Indoor Utama', capacity: 6, status: 'billing', orderCount: 5, currentTotal: 215000 },
  { id: 't-05', name: 'Meja 05', area: 'Indoor Utama', capacity: 4, status: 'available' },
  { id: 't-06', name: 'Meja 06', area: 'Indoor Utama', capacity: 2, status: 'available' },
  { id: 't-vip-1', name: 'VIP 01 (AC)', area: 'VIP Room', capacity: 8, status: 'occupied', orderCount: 6, currentTotal: 342000 },
  { id: 't-vip-2', name: 'VIP 02 (AC)', area: 'VIP Room', capacity: 10, status: 'available' },
  { id: 't-out-1', name: 'Outdoor 01', area: 'Area Outdoor', capacity: 4, status: 'available' },
  { id: 't-out-2', name: 'Outdoor 02', area: 'Area Outdoor', capacity: 4, status: 'occupied', orderCount: 2, currentTotal: 68000 },
  { id: 't-out-3', name: 'Outdoor 03', area: 'Area Outdoor', capacity: 6, status: 'available' },
  { id: 't-takeaway', name: 'Bungkus / Take Away', area: 'Takeaway Counter', capacity: 0, status: 'available' },
];
