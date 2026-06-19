export interface ProductVariant {
  id: string;
  name: string;
  value: string; // e.g. "200 CP" or "1 Month" or "1GB"
  priceNaira: number;
}

export type CategoryType = 'Gaming' | 'Streaming' | 'Data & Airtime' | 'Bills';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: CategoryType;
  description: string;
  image: string; // Lucide icon name or emoji or image placeholder
  deliveryLabel: string; // e.g. "Player ID", "Phone Number", "In-Game UID / Email"
  deliveryPlaceholder: string; // e.g. "eg. 5124958102"
  variants: ProductVariant[];
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variantId: string;
  variantValue: string;
  priceNaira: number;
  deliveryInfo: string;
  email: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  paymentMethod: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  walletBalance: number;
}

export const PRODUCTS: Product[] = [
  // GAMING
  {
    id: 'codm-cp',
    name: 'Call of Duty: Mobile CP',
    slug: 'codm-cp',
    category: 'Gaming',
    description: 'Get Call of Duty: Mobile COD Points (CP) instantly. CP can be used to purchase the battle pass, weapon skins, crates, lucky draws, and more.',
    image: 'Gamepad2',
    deliveryLabel: 'Player UID',
    deliveryPlaceholder: 'Enter your CODM UID (e.g. 6812345678901234567)',
    variants: [
      { id: 'codm-200', name: '200 CP', value: '200 CP', priceNaira: 1200 },
      { id: 'codm-400', name: '400 CP', value: '400 CP', priceNaira: 2300 },
      { id: 'codm-800', name: '800 CP', value: '800 CP', priceNaira: 4500 },
      { id: 'codm-1600', name: '1600 CP', value: '1600 CP', priceNaira: 8800 },
      { id: 'codm-4000', name: '4000 CP', value: '4000 CP', priceNaira: 21500 }
    ]
  },
  {
    id: 'freefire-diamonds',
    name: 'Free Fire Diamonds',
    slug: 'freefire-diamonds',
    category: 'Gaming',
    description: 'Top up Free Fire Diamonds instantly. Diamonds can be used to buy characters, outfits, weapon skins, and items in Free Fire.',
    image: 'Gem',
    deliveryLabel: 'Player ID',
    deliveryPlaceholder: 'Enter your Free Fire Player ID (e.g. 845210934)',
    variants: [
      { id: 'ff-100', name: '100 Diamonds', value: '100 Diamonds', priceNaira: 850 },
      { id: 'ff-210', name: '210 Diamonds', value: '210 Diamonds', priceNaira: 1700 },
      { id: 'ff-530', name: '530 Diamonds', value: '530 Diamonds', priceNaira: 4200 },
      { id: 'ff-1080', name: '1080 Diamonds', value: '1080 Diamonds', priceNaira: 8400 },
      { id: 'ff-2200', name: '2200 Diamonds', value: '2200 Diamonds', priceNaira: 16800 }
    ]
  },
  {
    id: 'mobile-legends',
    name: 'Mobile Legends Bang Bang Diamonds',
    slug: 'mobile-legends',
    category: 'Gaming',
    description: 'Get MLBB Diamonds delivered directly to your character. Enter your Player ID and Zone ID.',
    image: 'Swords',
    deliveryLabel: 'Player ID & Zone ID',
    deliveryPlaceholder: 'e.g. 12345678 (1234)',
    variants: [
      { id: 'ml-50', name: '50 Diamonds', value: '50 Diamonds', priceNaira: 600 },
      { id: 'ml-150', name: '150 Diamonds', value: '150 Diamonds', priceNaira: 1750 },
      { id: 'ml-250', name: '250 Diamonds', value: '250 Diamonds', priceNaira: 2900 },
      { id: 'ml-500', name: '500 Diamonds', value: '500 Diamonds', priceNaira: 5600 }
    ]
  },
  {
    id: 'roblox-robux',
    name: 'Roblox Robux Gift Cards',
    slug: 'roblox-robux',
    category: 'Gaming',
    description: 'Purchase Roblox Robux gift pin to redeem on your account. Buy virtual items, upgrades, and experiences inside Roblox.',
    image: 'ShieldAlert',
    deliveryLabel: 'Email Address',
    deliveryPlaceholder: 'e.g. gamer@gmail.com',
    variants: [
      { id: 'rbx-400', name: '400 Robux Pin', value: '400 Robux', priceNaira: 4800 },
      { id: 'rbx-800', name: '800 Robux Pin', value: '800 Robux', priceNaira: 9500 },
      { id: 'rbx-1700', name: '1700 Robux Pin', value: '1700 Robux', priceNaira: 19800 }
    ]
  },

  // STREAMING
  {
    id: 'spotify-premium',
    name: 'Spotify Premium (Nigeria)',
    slug: 'spotify-premium',
    category: 'Streaming',
    description: 'Ad-free high-quality music streaming. Active Spotify premium on your local Nigerian account instantly via a digital activation voucher.',
    image: 'Spotify',
    deliveryLabel: 'Email Address for Code Delivery',
    deliveryPlaceholder: 'e.g. musiclover@gmail.com',
    variants: [
      { id: 'spot-1m', name: '1 Month Premium', value: '1 Month', priceNaira: 1500 },
      { id: 'spot-3m', name: '3 Months Premium', value: '3 Months', priceNaira: 4300 },
      { id: 'spot-6m', name: '6 Months Premium', value: '6 Months', priceNaira: 8200 }
    ]
  },
  {
    id: 'youtube-premium',
    name: 'YouTube Premium Voucher',
    slug: 'youtube-premium',
    category: 'Streaming',
    description: 'Get rid of ads, watch offline, and stream background music on YouTube and YouTube Music.',
    image: 'Youtube',
    deliveryLabel: 'Email Address',
    deliveryPlaceholder: 'e.g. viewer@gmail.com',
    variants: [
      { id: 'yt-1m', name: '1 Month Premium', value: '1 Month', priceNaira: 1800 },
      { id: 'yt-3m', name: '3 Months Premium', value: '3 Months', priceNaira: 5200 }
    ]
  },
  {
    id: 'canva-pro',
    name: 'Canva Pro Premium Invite',
    slug: 'canva-pro',
    category: 'Streaming',
    description: 'Unlock Canva premium template libraries, brand kits, and cloud storage features with a direct invitation to a pro workspace team.',
    image: 'PenTool',
    deliveryLabel: 'Canva Account Email',
    deliveryPlaceholder: 'e.g. designer@gmail.com',
    variants: [
      { id: 'canva-1m', name: '1 Month access', value: '1 Month', priceNaira: 2500 },
      { id: 'canva-1y', name: '1 Year premium team pack', value: '1 Year', priceNaira: 22000 }
    ]
  },

  // DATA & AIRTIME
  {
    id: 'mtn-data',
    name: 'MTN High-Speed SME Data',
    slug: 'mtn-data',
    category: 'Data & Airtime',
    description: 'Top up high-speed MTN internet data bundle instantly sent to your mobile phone number. 30 Days expiration.',
    image: 'Rss',
    deliveryLabel: 'MTN Mobile Number',
    deliveryPlaceholder: 'e.g. 08031234567',
    variants: [
      { id: 'mtn-500mb', name: '500MB (30 Days)', value: '500MB', priceNaira: 350 },
      { id: 'mtn-1gb', name: '1GB (30 Days)', value: '1GB', priceNaira: 600 },
      { id: 'mtn-2gb', name: '2GB (30 Days)', value: '2GB', priceNaira: 1100 },
      { id: 'mtn-5gb', name: '5GB (30 Days)', value: '5GB', priceNaira: 2500 },
      { id: 'mtn-10gb', name: '10GB (30 Days)', value: '10GB', priceNaira: 4500 }
    ]
  },
  {
    id: 'airtel-data',
    name: 'Airtel Gifting Data',
    slug: 'airtel-data',
    category: 'Data & Airtime',
    description: 'Send high-speed Airtel internet data pin or direct recharge bundle directly to your mobile device.',
    image: 'Phone',
    deliveryLabel: 'Airtel Mobile Number',
    deliveryPlaceholder: 'e.g. 08021234567',
    variants: [
      { id: 'air-1gb', name: '1GB SME Bundle', value: '1GB', priceNaira: 600 },
      { id: 'air-2gb', name: '2GB SME Bundle', value: '2GB', priceNaira: 1100 },
      { id: 'air-5gb', name: '5GB CG Bundle', value: '5GB', priceNaira: 2500 },
      { id: 'air-10gb', name: '10GB CG Bundle', value: '10GB', priceNaira: 4500 }
    ]
  },
  {
    id: 'glo-data',
    name: 'Glo Direct Gift Data',
    slug: 'glo-data',
    category: 'Data & Airtime',
    description: 'Get Glo Grandmasters of Data credit topped up instantly on your Glo line.',
    image: 'Wifi',
    deliveryLabel: 'Glo Mobile Number',
    deliveryPlaceholder: 'e.g. 08051234567',
    variants: [
      { id: 'glo-1_5gb', name: '1.5GB Data (30-days)', value: '1.5GB', priceNaira: 600 },
      { id: 'glo-3gb', name: '3GB Data (30-days)', value: '3GB', priceNaira: 1100 },
      { id: 'glo-6gb', name: '6GB Data (30-days)', value: '6GB', priceNaira: 2500 },
      { id: 'glo-12gb', name: '12GB Data (30-days)', value: '12GB', priceNaira: 4500 }
    ]
  },

  // BILLS
  {
    id: 'dstv-bill',
    name: 'DSTV Subscription Pay',
    slug: 'dstv-bill',
    category: 'Bills',
    description: 'Renew your DSTV smartcard subscription instantly. Your channel selection will be re-enabled automatically.',
    image: 'Tv',
    deliveryLabel: 'DSTV Smartcard Decoder ID',
    deliveryPlaceholder: 'Enter Smartcard number (e.g. 1024567894)',
    variants: [
      { id: 'dstv-padi', name: 'DSTV Padi Bouquet', value: 'Padi Plan', priceNaira: 4500 },
      { id: 'dstv-yanga', name: 'DSTV Yanga Bouquet', value: 'Yanga Plan', priceNaira: 5800 },
      { id: 'dstv-confam', name: 'DSTV Confam Bouquet', value: 'Confam Plan', priceNaira: 9300 },
      { id: 'dstv-compact', name: 'DSTV Compact Premium', value: 'Compact Plan', priceNaira: 15700 }
    ]
  },
  {
    id: 'electricity-bill',
    name: 'IKEDC / EKEDC Prepaid Meter Token',
    slug: 'electricity-bill',
    category: 'Bills',
    description: 'Instantly pay and receive prepaid electricity units token pin code directly on your screen and via email.',
    image: 'Zap',
    deliveryLabel: 'Prepaid Meter Number',
    deliveryPlaceholder: 'Enter Prepaid Meter Number (e.g. 04123456789)',
    variants: [
      { id: 'elec-2k', name: '₦2,000 Electricity Token', value: '₦2,000 credit', priceNaira: 2000 },
      { id: 'elec-5k', name: '₦5,000 Electricity Token', value: '₦5,000 credit', priceNaira: 5000 },
      { id: 'elec-10k', name: '₦10,000 Electricity Token', value: '₦10,000 credit', priceNaira: 10000 },
      { id: 'elec-20k', name: '₦20,000 Electricity Token', value: '₦20,000 credit', priceNaira: 20000 }
    ]
  },
  {
    id: 'waec-card',
    name: 'WAEC Result Scratch Card PIN',
    slug: 'waec-card',
    category: 'Bills',
    description: 'Purchase WAEC result checker e-PIN instantly to check secondary school examinations online.',
    image: 'GraduationCap',
    deliveryLabel: 'Email Address for Token Code',
    deliveryPlaceholder: 'e.g. examtaker@gmail.com',
    variants: [
      { id: 'waec-1u', name: '1 unit WAEC PIN', value: '1 Checker PIN', priceNaira: 4500 },
      { id: 'waec-2u', name: '2 units WAEC PINs', value: '2 Checker PINs', priceNaira: 8800 }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'TXN-902148',
    productId: 'codm-cp',
    productName: 'Call of Duty: Mobile CP',
    productImage: 'Gamepad2',
    variantId: 'codm-800',
    variantValue: '800 CP',
    priceNaira: 4500,
    deliveryInfo: '6812345678901234567',
    email: '0xchronosfi@gmail.com',
    status: 'completed',
    createdAt: '2026-06-18T14:30:00Z',
    paymentMethod: 'Paystack'
  },
  {
    id: 'TXN-159482',
    productId: 'mtn-data',
    productName: 'MTN High-Speed SME Data',
    productImage: 'Rss',
    variantId: 'mtn-2gb',
    variantValue: '2GB',
    priceNaira: 1100,
    deliveryInfo: '08031234567',
    email: '0xchronosfi@gmail.com',
    status: 'completed',
    createdAt: '2026-06-19T09:15:00Z',
    paymentMethod: 'Paystack'
  },
  {
    id: 'TXN-382951',
    productId: 'spotify-premium',
    productName: 'Spotify Premium (Nigeria)',
    productImage: 'Spotify',
    variantId: 'spot-3m',
    variantValue: '3 Months',
    priceNaira: 4300,
    deliveryInfo: '0xchronosfi@gmail.com',
    email: '0xchronosfi@gmail.com',
    status: 'processing',
    createdAt: '2026-06-19T11:20:00Z',
    paymentMethod: 'Wallet'
  }
];
