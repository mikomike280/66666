import { useState, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import ProductCard from './ProductCard';
import CategoryHero from './CategoryHero';

interface ProductGridProps {
  category: string;
  searchQuery?: string;
}

type SortOption = 'featured' | 'price-low' | 'price-high' | 'newest';

export default function ProductGrid({ category, searchQuery }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [category, searchQuery]);

  async function fetchProducts() {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (category !== 'all') {
        const { data: categoryData, error: catError } = await supabase
          .from('categories')
          .select('id')
          .eq('name', category.charAt(0).toUpperCase() + category.slice(1))
          .maybeSingle();

        if (catError) throw catError;

        if (categoryData) {
          query = query.eq('category_id', categoryData.id);
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      setProducts(data || []);
      setSubcategories([]);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  let filteredProducts = products;

  if (searchQuery && searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.color && p.color.toLowerCase().includes(query))
    );
  }

  filteredProducts = filteredProducts.filter(
    (p) => (p.price || 0) >= priceRange[0] && (p.price || 0) <= priceRange[1]
  );

  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'featured':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <>
      {category !== 'all' && <CategoryHero category={category} />}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">
              {category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1)}
            </h2>
            <p className="text-gray-600 mt-1">{filteredProducts.length} items</p>
          </div>

          <div className="flex gap-2 items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: KSh {priceRange[0].toLocaleString()} - KSh {priceRange[1].toLocaleString()}
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="500"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="flex-1"
                />
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products available in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
    </>
  );
}
