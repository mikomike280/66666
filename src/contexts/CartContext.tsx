import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, Product } from '../lib/supabase';

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function getSessionId(): string {
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const sessionId = getSessionId();

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      const { data: cartData, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('session_id', sessionId);

      if (error) throw error;

      if (!cartData || cartData.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      const productIds = [...new Set(cartData.map(item => item.product_id))];
      const { data: products, error: productError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      if (productError) throw productError;

      const cartItems = cartData
        .map(item => {
          const product = products?.find(p => p.id === item.product_id);
          if (!product) return null;
          return {
            id: item.id,
            product,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          };
        })
        .filter((item): item is CartItem => item !== null);

      setItems(cartItems);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(product: Product, quantity: number, size?: string, color?: string) {
    try {
      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('session_id', sessionId)
        .eq('product_id', product.id)
        .eq('size', size || '')
        .eq('color', color || '')
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert([{
            session_id: sessionId,
            product_id: product.id,
            quantity,
            size: size || null,
            color: color || null,
          }]);

        if (error) throw error;
      }

      await loadCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async function removeFromCart(itemId: string) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      await loadCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  async function updateQuantity(itemId: string, quantity: number) {
    try {
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;
      await loadCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  }

  async function clearCart() {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('session_id', sessionId);

      if (error) throw error;
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalAmount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
