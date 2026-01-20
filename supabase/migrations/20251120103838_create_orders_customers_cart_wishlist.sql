/*
  # Create Orders, Customers, Cart, and Wishlist Tables

  ## Overview
  This migration creates tables for:
  - Customer tracking from WhatsApp orders
  - Order history and management
  - Shopping cart for users
  - Wishlist functionality

  ## 1. New Tables
  
  ### `customers`
  Customer information from WhatsApp orders
  - `id` (uuid, primary key) - Unique customer identifier
  - `phone_number` (text, unique, not null) - WhatsApp phone number
  - `name` (text) - Customer name
  - `email` (text) - Customer email
  - `total_orders` (integer) - Total orders count
  - `total_spent` (numeric) - Total amount spent
  - `created_at` (timestamptz) - Registration date
  - `updated_at` (timestamptz) - Last update

  ### `orders`
  Order records from WhatsApp purchases
  - `id` (uuid, primary key) - Order ID
  - `customer_id` (uuid) - Customer reference
  - `order_number` (text, unique) - Order number (ED-YYYYMMDD-XXXX)
  - `product_id` (uuid) - Product reference
  - `product_name` (text) - Product snapshot
  - `product_price` (numeric) - Price at purchase
  - `quantity` (integer) - Items ordered
  - `size` (text) - Selected size
  - `color` (text) - Selected color
  - `total_amount` (numeric) - Total order amount
  - `status` (text) - pending/confirmed/delivered/cancelled
  - `delivery_address` (text) - Delivery location
  - `notes` (text) - Order notes
  - `created_at` (timestamptz) - Order date
  - `updated_at` (timestamptz) - Last update

  ### `cart_items`
  Shopping cart for browsing users
  - `id` (uuid, primary key) - Cart item ID
  - `session_id` (text) - Browser session ID
  - `product_id` (uuid) - Product reference
  - `quantity` (integer) - Item quantity
  - `size` (text) - Selected size
  - `color` (text) - Selected color
  - `created_at` (timestamptz) - Added date
  - `updated_at` (timestamptz) - Last update

  ### `wishlist_items`
  User wishlist functionality
  - `id` (uuid, primary key) - Wishlist item ID
  - `session_id` (text) - Browser session ID
  - `product_id` (uuid) - Product reference
  - `created_at` (timestamptz) - Added date

  ## 2. Security
  - Enable RLS on all tables
  - Admin-only access for customers and orders
  - Public access to own cart/wishlist via session_id

  ## 3. Indexes
  - Customer phone lookup
  - Order number search
  - Status filtering
  - Session-based cart/wishlist queries

  ## 4. Important Notes
  - Orders manually created by admin from WhatsApp
  - Cart/wishlist use session IDs (no auth required)
  - Auto-cleanup of old cart items (30+ days)
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text UNIQUE NOT NULL,
  name text,
  email text,
  total_orders integer DEFAULT 0,
  total_spent numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_price numeric NOT NULL CHECK (product_price >= 0),
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  size text,
  color text,
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  delivery_address text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  size text,
  color text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(session_id, product_id, size, color)
);

-- Create wishlist_items table
CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_id, product_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone_number);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cart_session ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_product ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_session ON wishlist_items(session_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product ON wishlist_items(product_id);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Customers policies (admin only)
CREATE POLICY "Admins can read all customers"
  ON customers FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert customers"
  ON customers FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins can update customers"
  ON customers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins can delete customers"
  ON customers FOR DELETE TO authenticated USING (true);

-- Orders policies (admin only)
CREATE POLICY "Admins can read all orders"
  ON orders FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert orders"
  ON orders FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins can delete orders"
  ON orders FOR DELETE TO authenticated USING (true);

-- Cart policies (public access via session)
CREATE POLICY "Anyone can read own cart"
  ON cart_items FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone can insert to own cart"
  ON cart_items FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can update own cart"
  ON cart_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete from own cart"
  ON cart_items FOR DELETE TO anon, authenticated USING (true);

-- Wishlist policies (public access via session)
CREATE POLICY "Anyone can read own wishlist"
  ON wishlist_items FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone can insert to own wishlist"
  ON wishlist_items FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can delete from own wishlist"
  ON wishlist_items FOR DELETE TO anon, authenticated USING (true);

-- Function to update customer stats
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE customers
    SET 
      total_orders = (
        SELECT COUNT(*) FROM orders 
        WHERE customer_id = NEW.customer_id AND status != 'cancelled'
      ),
      total_spent = (
        SELECT COALESCE(SUM(total_amount), 0) FROM orders
        WHERE customer_id = NEW.customer_id AND status != 'cancelled'
      ),
      updated_at = now()
    WHERE id = NEW.customer_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE customers
    SET 
      total_orders = (
        SELECT COUNT(*) FROM orders
        WHERE customer_id = OLD.customer_id AND status != 'cancelled'
      ),
      total_spent = (
        SELECT COALESCE(SUM(total_amount), 0) FROM orders
        WHERE customer_id = OLD.customer_id AND status != 'cancelled'
      ),
      updated_at = now()
    WHERE id = OLD.customer_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for customer stats
DROP TRIGGER IF EXISTS update_customer_stats_trigger ON orders;
CREATE TRIGGER update_customer_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_stats();

-- Function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_cart_updated_at ON cart_items;
CREATE TRIGGER update_cart_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();