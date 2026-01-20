import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id: string;
  name: string;
  category_id: string;
  description: string | null;
  price: number;
  color: string | null;
  size: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  created_at: string;
}

export interface Customer {
  id: string;
  phone_number: string;
  name: string | null;
  email: string | null;
  total_orders: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  order_number: string;
  product_id: string | null;
  product_name: string;
  product_price: number;
  quantity: number;
  size: string | null;
  color: string | null;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  delivery_address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  session_id: string;
  product_id: string;
  quantity: number;
  size: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  session_id: string;
  product_id: string;
  created_at: string;
}
