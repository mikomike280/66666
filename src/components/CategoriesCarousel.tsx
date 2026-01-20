import { useRef, useState, useEffect } from 'react';

interface CategoriesCarouselProps {
  onCategoryClick: (category: string) => void;
}

export default function CategoriesCarousel({ onCategoryClick }: CategoriesCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const categories = [
    {
      title: 'MEN',
      subcategories: ['T-Shirts & Polos', 'Official Shirts', 'Casual Shirts', 'Suits & Blazers', 'Accessories', 'Outerwear', 'Bottoms'],
      image: 'https://i.postimg.cc/prHkRFTz/download-(10).jpg',
      category: 'men',
    },
    {
      title: 'WOMEN',
      subcategories: ['Dresses', 'Two-Piece Sets', 'Tops', 'Sweaters', 'Trousers / Jeans', 'Jumpsuits', 'Accessories'],
      image: 'https://i.postimg.cc/FR97vFv9/download-(11).jpg',
      category: 'women',
    },
    {
      title: 'UNISEX',
      subcategories: ['Sweaters', 'Accessories', 'Casual Wear', 'Outerwear', 'Bottoms'],
      image: 'https://i.postimg.cc/t4SQqCpx/23_Valentine_s_Day_Gift_Ideas_For_Your_Picky_S_O.jpg',
      category: 'unisex',
    },
  ];

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationId: number;
    let position = 0;
    const speed = 0.5;

    const animate = () => {
      if (!isDragging) {
        position += speed;
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
          position = 0;
        } else {
          container.scrollLeft = position;
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h2 className="text-4xl font-bold text-center mb-4">Shop by Category</h2>
        <p className="text-center text-gray-600 mb-2">Drag to explore our collections</p>
      </div>

      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {[...categories, ...categories].map((cat, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-56 group relative rounded-[16px] overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 bg-[#ff3b30]"
            style={{ userSelect: 'none' }}
          >
            <div
              className="h-64 bg-cover bg-center"
              style={{ backgroundImage: `url(${cat.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-3 text-white">
                <h3 className="text-xl font-bold mb-2">{cat.title}</h3>
                <div className="space-y-0.5 mb-2">
                  {cat.subcategories.slice(0, 4).map((sub, idx) => (
                    <p key={idx} className="text-xs text-gray-200">
                      • {sub}
                    </p>
                  ))}
                </div>
                <button
                  onClick={() => onCategoryClick(cat.category)}
                  className="w-full py-2 bg-white text-black text-xs font-medium rounded-full hover:bg-gray-100 transition-colors"
                >
                  Explore {cat.title}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
