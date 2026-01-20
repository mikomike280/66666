interface FeaturedCollectionsProps {
  onCollectionClick: (category: string) => void;
}

export default function FeaturedCollections({ onCollectionClick }: FeaturedCollectionsProps) {
  const collections = [
    {
      title: 'Men\'s Collection',
      subtitle: 'Polo, Blazers & Suits',
      category: 'men',
      image: 'https://i.postimg.cc/prHkRFTz/download-(10).jpg',
    },
    {
      title: 'Women\'s Collection',
      subtitle: 'Dresses & Sweaters',
      category: 'women',
      image: 'https://i.postimg.cc/FR97vFv9/download-(11).jpg',
    },
    {
      title: 'Unisex Essentials',
      subtitle: 'For Everyone',
      category: 'unisex',
      image: 'https://i.postimg.cc/FR97vFv9/download-(11).jpg',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-4xl font-bold text-center mb-12">Shop by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {collections.map((collection, index) => (
          <div
            key={index}
            onClick={() => onCollectionClick(collection.category)}
            className="group relative h-[280px] overflow-hidden cursor-pointer rounded-[16px] shadow-lg bg-[#ff3b30]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${collection.image})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-end text-white p-4">
              <h3 className="text-xl font-bold mb-1 text-center">{collection.title}</h3>
              <p className="text-xs text-gray-200 mb-2">{collection.subtitle}</p>
              <button className="px-6 py-2 bg-white text-black text-sm font-medium hover:bg-gray-100 transition-colors rounded-lg">
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
