import { Product, Order, UserProfile, PRODUCTS, INITIAL_ORDERS } from './data';

// Helper to initialize localStorage
const initMockDB = () => {
  if (typeof window === 'undefined') return;

  // Sync products catalog if updated or not existing
  const CURRENT_DB_VERSION = 'v4';
  const storedVersion = localStorage.getItem('carry1st_db_version');

  if (storedVersion !== CURRENT_DB_VERSION || !localStorage.getItem('carry1st_products')) {
    localStorage.setItem('carry1st_products', JSON.stringify(PRODUCTS));
    localStorage.setItem('carry1st_db_version', CURRENT_DB_VERSION);
  }

  if (!localStorage.getItem('carry1st_orders')) {
    localStorage.setItem('carry1st_orders', JSON.stringify(INITIAL_ORDERS));
  }

  if (!localStorage.getItem('carry1st_user')) {
    const defaultUser: UserProfile = {
      name: 'Chronos User',
      email: '0xchronosfi@gmail.com',
      phone: '08123456789',
      walletBalance: 25000, // starting custom naira balance
    };
    localStorage.setItem('carry1st_user', JSON.stringify(defaultUser));
  }
};

// Initialize DB immediately
initMockDB();

// Utility for sleep delay
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// --- PRODUCTS API ---

export async function fetchProducts(category?: string): Promise<Product[]> {
  await delay();
  const raw = localStorage.getItem('carry1st_products');
  const products: Product[] = raw ? JSON.parse(raw) : PRODUCTS;
  if (category && category.toLowerCase() !== 'all') {
    return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  return products;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  await delay();
  const raw = localStorage.getItem('carry1st_products');
  const products: Product[] = raw ? JSON.parse(raw) : PRODUCTS;
  const product = products.find(p => p.id === id);
  return product || null;
}

export async function createProduct(product: Product): Promise<Product> {
  await delay();
  const raw = localStorage.getItem('carry1st_products');
  const products: Product[] = raw ? JSON.parse(raw) : PRODUCTS;
  
  // ensure unique id
  const newProduct = { ...product };
  if (!newProduct.id) {
    newProduct.id = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  
  products.push(newProduct);
  localStorage.setItem('carry1st_products', JSON.stringify(products));
  return newProduct;
}

export async function updateProduct(id: string, updatedProduct: Partial<Product>): Promise<Product> {
  await delay();
  const raw = localStorage.getItem('carry1st_products');
  let products: Product[] = raw ? JSON.parse(raw) : [ ...PRODUCTS ];
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Product not found');
  }
  products[index] = { ...products[index], ...updatedProduct };
  localStorage.setItem('carry1st_products', JSON.stringify(products));
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  await delay();
  const raw = localStorage.getItem('carry1st_products');
  let products: Product[] = raw ? JSON.parse(raw) : [ ...PRODUCTS ];
  const filtered = products.filter(p => p.id !== id);
  localStorage.setItem('carry1st_products', JSON.stringify(filtered));
  return true;
}


// --- ORDERS API ---

export async function fetchOrders(): Promise<Order[]> {
  await delay();
  const raw = localStorage.getItem('carry1st_orders');
  return raw ? JSON.parse(raw) : [];
}

export async function createOrder(orderInput: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> {
  await delay();
  const raw = localStorage.getItem('carry1st_orders');
  const orders: Order[] = raw ? JSON.parse(raw) : [];

  const newOrder: Order = {
    ...orderInput,
    id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    status: 'completed', // automatically set completed for mock instant delivery (or 'processing')
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder); // Add to the top
  localStorage.setItem('carry1st_orders', JSON.stringify(orders));

  // Deduct from wallet if wallet payment method was used
  if (orderInput.paymentMethod === 'Wallet') {
    const userRaw = localStorage.getItem('carry1st_user');
    if (userRaw) {
      const user: UserProfile = JSON.parse(userRaw);
      if (user.walletBalance >= orderInput.priceNaira) {
        user.walletBalance -= orderInput.priceNaira;
        localStorage.setItem('carry1st_user', JSON.stringify(user));
      }
    }
  }

  return newOrder;
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
  await delay();
  const raw = localStorage.getItem('carry1st_orders');
  const orders: Order[] = raw ? JSON.parse(raw) : [];
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) {
    throw new Error('Order not found');
  }
  orders[index].status = status;
  localStorage.setItem('carry1st_orders', JSON.stringify(orders));
  return orders[index];
}


// --- USER PROFILE API ---

export async function fetchUserProfile(): Promise<UserProfile> {
  await delay();
  const raw = localStorage.getItem('carry1st_user');
  if (!raw) {
    const defaultUser: UserProfile = {
      name: 'Chronos User',
      email: '0xchronosfi@gmail.com',
      phone: '08123456789',
      walletBalance: 25000,
    };
    localStorage.setItem('carry1st_user', JSON.stringify(defaultUser));
    return defaultUser;
  }
  return JSON.parse(raw);
}

export async function updateUserProfile(updated: Partial<UserProfile>): Promise<UserProfile> {
  await delay();
  const raw = localStorage.getItem('carry1st_user');
  const user: UserProfile = raw ? JSON.parse(raw) : { name: '', email: '', phone: '', walletBalance: 0 };
  const newUser = { ...user, ...updated };
  localStorage.setItem('carry1st_user', JSON.stringify(newUser));
  return newUser;
}

export async function fundWallet(amount: number): Promise<UserProfile> {
  await delay();
  const raw = localStorage.getItem('carry1st_user');
  const user: UserProfile = raw ? JSON.parse(raw) : { name: '', email: '', phone: '', walletBalance: 0 };
  user.walletBalance += amount;
  localStorage.setItem('carry1st_user', JSON.stringify(user));
  return user;
}
