import { useState } from 'react';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoriesCarousel from './components/CategoriesCarousel';
import ProductGrid from './components/ProductGrid';
import BrandStory from './components/BrandStory';
import WhatsAppCTA from './components/WhatsAppCTA';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import WhatsAppFloating from './components/WhatsAppFloating';
import WhatsAppChannelPopup from './components/WhatsAppChannelPopup';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';

function App() {
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [showHero, setShowHero] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    setShowHero(category === 'all');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() !== '') {
      setShowHero(false);
    }
  };

  return (
    <CartProvider>
      <WishlistProvider>
        <div className="min-h-screen bg-gray-50">
          <Header
            onCategoryChange={handleCategoryChange}
            currentCategory={currentCategory}
            onSearch={handleSearch}
            onCartClick={() => setIsCartOpen(true)}
            onWishlistClick={() => setIsWishlistOpen(true)}
          />

          {showHero && (
            <>
              <Hero onShopClick={handleCategoryChange} />
              <CategoriesCarousel onCategoryClick={handleCategoryChange} />
              <BrandStory />
            </>
          )}

          <ProductGrid category={currentCategory} searchQuery={searchQuery} />

          {showHero && (
            <>
              <WhatsAppCTA />
              <Newsletter />
            </>
          )}

          <Footer />
          <WhatsAppFloating />
          <WhatsAppChannelPopup />

          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
