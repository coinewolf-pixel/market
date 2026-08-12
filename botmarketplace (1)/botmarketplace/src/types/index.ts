export interface Bot {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  oldPrice?: number;
  category: string;
  tags: string[];
  image: string;
  features: string[];
  status: 'active' | 'inactive' | 'sold_out';
  stock: number;
  sold: number;
  rating: number;
  reviews: number;
  created_at: string;
  updated_at: string;
  demoLink?: string;
  documentation?: string;
}

export interface Order {
  id: string;
  bot_id: string;
  bot_name: string;
  buyer_email: string;
  buyer_name: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'delivered' | 'cancelled' | 'refunded';
  payment_method: string;
  payment_id?: string;
  tx_hash?: string;
  created_at: string;
  updated_at: string;
  notes?: string;
}

export interface CartItem {
  bot: Bot;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'customer';
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}