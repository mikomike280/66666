interface CategoryHeroProps {
  category: string;
}

export default function CategoryHero({ category }: CategoryHeroProps) {
  const categoryData: Record<string, { title: string; subtitle: string; image: string }> = {
    men: {
      title: "Men's Collection",
      subtitle: 'Elevate Your Style with Premium Menswear',
      image: 'https://i.postimg.cc/prHkRFTz/download-(10).jpg',
    },
    women: {
      title: "Women's Collection",
      subtitle: 'Timeless Elegance for the Modern Woman',
      image: 'https://i.postimg.cc/FR97vFv9/download-(11).jpg',
    },
    unisex: {
      title: 'Unisex Collection',
      subtitle: 'Fashion for Everyone',
      image: 'https://i.postimg.cc/FR97vFv9/download-(11).jpg',
    },
    all: {
      title: 'All Products',
      subtitle: 'Discover Our Complete Collection',
      image: 'https://i.postimg.cc/FRkVjK26/316c4caea73bb89b04e80d7d08f6fa57.jpg',
    },
  };

  const data = categoryData[category] || categoryData.all;

  return (
    <section className="relative h-[400px] flex items-center justify-center overflow-hidden mb-8">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${data.image})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/40"></div>

      <div className="relative z-10 text-center max-w-4xl px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight text-white drop-shadow-2xl">
          {data.title}
        </h1>
        <p className="text-xl md:text-2xl text-white font-light drop-shadow-lg">
          {data.subtitle}
        </p>
      </div>
    </section>
  );
}
