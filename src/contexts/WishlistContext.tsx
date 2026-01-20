import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, Product } from '../lib/supabase';

interface WishlistContextType {
  items: Product[];
  loading: boolean;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function getSessionId(): string {
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const sessionId = getSessionId();

  useEffect(() => {
    loadWishlist();
  }, []);

  async function loadWishlist() {
    try {
      const { data: wishlistData, error } = await supabase
        .from('wishlist_items')
        .select('product_id')
        .eq('session_id', sessionId);

      if (error) throw error;

      if (!wishlistData || wishlistData.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      const productIds = wishlistData.map(item => item.product_id);
      const { data: products, error: productError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      if (productError) throw productError;

      setItems(products || []);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addToWishlist(product: Product) {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .insert([{
          session_id: sessionId,
          product_id: product.id,
        }]);

      if (error) throw error;
      await loadWishlist();
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  }

  async function removeFromWishlist(productId: string) {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('session_id', sessionId)
        .eq('product_id', productId);

      if (error) throw error;
      await loadWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }

  function isInWishlist(productId: string): boolean {
    return items.some(item => item.id === productId);
  }

  async function toggleWishlist(product: Product) {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  }

  return (
    <WishlistContext.Provider value={{
      items,
      loading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
