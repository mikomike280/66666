import { useState } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { LogOut, Package, ShoppingBag, ShoppingCart } from 'lucide-react';
import ProductManagement from '../components/admin/ProductManagement';
import OrderManagement from '../components/admin/OrderManagement';

export default function AdminDashboard() {
  const { signOut, user } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6" />
              <h1 className="text-xl font-bold">Eddjos Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          <aside className="w-64 bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'products'
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Package className="w-5 h-5" />
                <span className="font-medium">Products</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium">Orders</span>
              </button>
            </nav>
          </aside>

          <main className="flex-1">
            {activeTab === 'products' && <ProductManagement />}
            {activeTab === 'orders' && <OrderManagement />}
          </main>
        </div>
      </div>
    </div>
  );
}
