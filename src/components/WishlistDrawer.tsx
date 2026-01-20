import { X, Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const { items, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!isOpen) return null;

  const handleAddToCart = async (product: any) => {
    try {
      await addToCart(product, 1, product.sizes[0], product.colors[0]);
      alert('Added to cart!');
    } catch (error) {
      alert('Failed to add to cart');
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      ></div>

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Wishlist ({items.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <Heart className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Save your favorite items for later</p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.map((product) => (
              <div key={product.id} className="flex gap-4 pb-4 border-b border-gray-100">
                <div className="w-24 h-24 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      👕
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold mb-3">
                    KSh {product.price.toLocaleString()}
                  </p>
                  {product.in_stock ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <span className="flex-1 px-4 py-2 bg-gray-100 text-gray-500 text-sm font-medium rounded text-center">
                        Out of Stock
                      </span>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
