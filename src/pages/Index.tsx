import { Link } from "react-router-dom";
import { ArrowRight, Star, ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import { fetchStrapi, mapStrapiProduct, mapHomepage, getStrapiURL } from "@/lib/strapi";
import { Skeleton } from "@/components/ui/skeleton";

// Provide a safe icon renderer
const DynamicIcon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  // Simple mapping from slug-like icon name to Lucide icon component name
  const IconComponent = (Icons as any)[name.charAt(0).toUpperCase() + name.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())] || Icons.HelpCircle;
  return <IconComponent {...props} />;
};

const Index = () => {
  const hero = useScrollAnimation();
  const cats = useScrollAnimation();
  const featured = useScrollAnimation();
  const why = useScrollAnimation();
  const test = useScrollAnimation();
  const gallery = useScrollAnimation();
  const cta = useScrollAnimation();

  // Fetch Homepage Data
  const { data: pageData, isLoading: pageLoading, isError: pageError } = useQuery({
    queryKey: ["homepage"],
    queryFn: async () => {
      const response = await fetchStrapi("homepage", { populate: ["heroImage", "whyChoose", "testimonials"] });
      return mapHomepage(response);
    },
    retry: 1
  });

  // Fetch Categories
  const { data: categories, isLoading: catsLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetchStrapi("categories", { populate: "*" });
      return (response.data || []).map((c: any) => {
        const data = c.attributes || c;
        const img = data.image?.data?.attributes || data.image;
        return {
          name: data.Name || data.name,
          slug: data.slug,
          image: getStrapiURL(img?.url)
        };
      });
    }
  });

  // Fetch Featured Products
  const { data: featuredProducts, isLoading: prodsLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const response = await fetchStrapi("products", {
        "filters[featured][$eq]": true,
        "pagination[limit]": 4,
        "populate": "*"
      });
      return (response.data || []).map(mapStrapiProduct);
    }
  });

  // Fetch Gallery for showcase
  const { data: showcaseGallery, isLoading: galleryLoading } = useQuery({
    queryKey: ["gallery-showcase"],
    queryFn: async () => {
      const response = await fetchStrapi("galleries", { "pagination[limit]": 6, "populate": "*" });
      return (response.data || []).map((item: any) => {
        const media = item.attributes?.Media?.data?.attributes || item.Media;
        return getStrapiURL(media?.url);
      });
    }
  });

  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">Loading luxury furniture experience...</p>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-secondary/20">
        <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
          <Icons.AlertCircle size={40} />
        </div>
        <h1 className="text-3xl font-bold mb-4 font-display">Connection Error</h1>
        <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
          We couldn't connect to the content server. Please ensure the Strapi CMS is running at <code className="bg-background px-2 py-1 rounded">http://localhost:1337</code> and refresh the page.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="btn-primary-glass flex items-center gap-2"
        >
          <Icons.RefreshCw size={18} /> Retry Connection
        </button>
      </div>
    );
  }

  const { heroTitle, heroSubtitle, heroImage, whyChoose, testimonials } = pageData || {};

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Showroom" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent opacity-30" />
        </div>
        <div
          ref={hero.ref}
          className={`relative z-10 container mx-auto px-4 lg:px-8 max-w-3xl transition-all duration-1000 ${hero.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          
          <p className="text-primary uppercase tracking-[0.3em] text-sm font-medium mb-4">Premium Furniture Collection</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6" dangerouslySetInnerHTML={{ __html: heroTitle?.replace("Dreams", "<span class='gold-text'>Dreams</span>") || "Crafting <span class='gold-text'>Dreams</span> Into Reality" }}>
          </h1>
          <p className="text-foreground/70 text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
            {heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/products" className="btn-primary-glass flex items-center gap-2">
              Explore Collection <ArrowRight size={18} />
            </Link>
            <a
              href="https://wa.me/919801980316?text=Hi%20Dreams%20Furniture"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-glass">
              Visit Showroom
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div
            ref={cats.ref}
            className={`text-center mb-12 transition-all duration-700 ${cats.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="text-primary uppercase tracking-[0.2em] text-sm mb-2">Browse By</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Featured Categories</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {catsLoading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-2xl w-full" />)
            ) : categories?.map((cat: any, i: number) => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className="glass-card-hover group overflow-hidden text-center"
                style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="aspect-square relative overflow-hidden bg-secondary/50">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-lg md:text-xl text-foreground group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto">
          <div
            ref={featured.ref}
            className={`flex items-end justify-between mb-12 transition-all duration-700 ${featured.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div>
              <p className="text-primary uppercase tracking-[0.2em] text-sm mb-2">Handpicked</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold">Featured Products</h2>
            </div>
            <Link to="/products" className="hidden md:flex items-center gap-1 text-primary font-medium hover:gap-2 transition-all">
              View All <ChevronRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {prodsLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-2xl w-full" />)
            ) : featuredProducts?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/products" className="btn-outline-glass inline-flex items-center gap-1">
              View All Products <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div
            ref={why.ref}
            className={`text-center mb-12 transition-all duration-700 ${why.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="text-primary uppercase tracking-[0.2em] text-sm mb-2">Our Promise</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Why Choose Dreams Furniture</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChoose?.map(({ icon, title, desc }: any, i: number) => (
              <div key={title} className="glass-card-hover p-8 text-center" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <DynamicIcon name={icon || "star"} size={28} className="text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto">
          <div
            ref={test.ref}
            className={`text-center mb-12 transition-all duration-700 ${test.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="text-primary uppercase tracking-[0.2em] text-sm mb-2">Testimonials</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials?.map((t: any, i: number) => (
              <div key={i} className="glass-card p-8">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating || 5 }).map((_, j) => (
                    <Star key={j} size={16} className="text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-6 leading-relaxed italic">"{t.text}"</p>
                <p className="font-display font-semibold text-foreground">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Showcase */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div
            ref={gallery.ref}
            className={`text-center mb-12 transition-all duration-700 ${gallery.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="text-primary uppercase tracking-[0.2em] text-sm mb-2">Showroom</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Furniture Showcase</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryLoading ? (
              Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-2xl w-full" />)
            ) : showcaseGallery?.map((img: string, i: number) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl aspect-square">
                <img src={img} alt={`Showcase ${i + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/gallery" className="btn-outline-glass inline-flex items-center gap-2">
              View Full Gallery <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Showroom" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/70" />
        </div>
        <div
          ref={cta.ref}
          className={`relative z-10 container mx-auto px-4 text-center max-w-2xl transition-all duration-700 ${cta.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Visit Our <span className="gold-text">Showroom</span>
          </h2>
          <p className="text-foreground/70 text-lg mb-8">
            Experience the luxury in person. Walk through our curated collections and find the perfect pieces for your home.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://maps.app.goo.gl/66qAor9gFcjXtgWm9?g_st=ipc"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-glass">
              Get Directions
            </a>
            <a
              href="https://wa.me/919801980316?text=Hi%20Dreams%20Furniture"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-glass">
              WhatsApp Inquiry
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
