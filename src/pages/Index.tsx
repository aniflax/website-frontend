import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ChevronRight, Play } from "lucide-react";
import * as Icons from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import { fetchStrapi, mapStrapiProduct, mapHomepage, getStrapiURL } from "@/lib/strapi";
import { Skeleton } from "@/components/ui/skeleton";
import ContentLoadError from "@/components/ContentLoadError";
import showroomImage from "@/assets/showroom.jpg";

// Provide a safe icon renderer
const DynamicIcon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  // Simple mapping from slug-like icon name to Lucide icon component name
  const IconComponent = (Icons as any)[name.charAt(0).toUpperCase() + name.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())] || Icons.HelpCircle;
  return <IconComponent {...props} />;
};

const HERO_EYEBROW = "Premium Furniture Collection";
const HERO_TITLE = "Dreams Furnitures";
const HERO_SUBTITLE = "Transform your living spaces with handcrafted luxury furniture that speaks elegance and comfort.";
const SHOWROOM_SUBTITLE = "Experience the luxury in person. Walk through our curated collections and find the perfect pieces for your home.";

const Index = () => {
  const [playingVideos, setPlayingVideos] = useState<Record<number, boolean>>({});

  const toggleVideo = (index: number) => {
    setPlayingVideos((prev) => ({ ...prev, [index]: true }));
  };

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
      const response = await fetchStrapi("homepage", { populate: ["heroImage", "whyChoose", "testimonials", "featuredVideos"] });
      return mapHomepage(response);
    },
    retry: 1
  });

  // Fetch Categories
  const { data: categories, isLoading: catsLoading, isError: catsError } = useQuery({
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
  const { data: featuredProducts, isLoading: prodsLoading, isError: prodsError } = useQuery({
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
  const { data: showcaseGallery, isLoading: galleryLoading, isError: galleryError } = useQuery({
    queryKey: ["gallery-showcase"],
    queryFn: async () => {
      const response = await fetchStrapi("galleries", { "pagination[limit]": 6, "populate": "*" });
      return (response.data || []).map((item: any) => {
        const media = item.attributes?.Media?.data?.attributes || item.Media;
        return getStrapiURL(media?.url);
      });
    }
  });

  const { heroImage, whyChoose, testimonials, featuredVideos } = pageData || {};

  // Helper to convert YouTube URL to embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1].split("?")[0];
    } else if (url.includes("shorts/")) {
      videoId = url.split("shorts/")[1].split("?")[0];
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  };

  // Helper to get YouTube Thumbnail URL
  const getYoutubeThumbnail = (url: string) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("shorts/")) {
      videoId = url.split("shorts/")[1].split("?")[0];
    }
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

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
          
          <p className="text-primary uppercase tracking-[0.3em] text-sm font-medium mb-4">{HERO_EYEBROW}</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6" dangerouslySetInnerHTML={{ __html: HERO_TITLE.replace("Dreams", "<span class='gold-text'>Dreams</span>") }}>
          </h1>
          <p className="text-foreground/70 text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
            {HERO_SUBTITLE}
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
            ) : catsError ? (
              <div className="col-span-full">
                <ContentLoadError message="Featured categories could not be loaded." />
              </div>
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
            ) : prodsError ? (
              <div className="col-span-full">
                <ContentLoadError message="Featured products could not be loaded." />
              </div>
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

      {/* Featured Videos */}
      {pageLoading ? (
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <p className="text-primary uppercase tracking-[0.2em] text-sm mb-2">Watch & Experience</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold">Featured Videos</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-2xl w-full" />)}
            </div>
          </div>
        </section>
      ) : pageError ? (
        <section className="section-padding">
          <div className="container mx-auto">
            <ContentLoadError message="Featured videos could not be loaded." />
          </div>
        </section>
      ) : featuredVideos && featuredVideos.length > 0 && (
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <p className="text-primary uppercase tracking-[0.2em] text-sm mb-2">Watch & Experience</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold">Featured Videos</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {featuredVideos.map((video: any, i: number) => (
                <div key={i} className="glass-card-hover overflow-hidden group flex flex-col">
                  <div className="aspect-square relative bg-black cursor-pointer overflow-hidden" onClick={() => toggleVideo(i)}>
                    {playingVideos[i] ? (
                      <iframe
                        width="100%"
                        height="100%"
                        src={getEmbedUrl(video.youtube_url)}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full object-cover"
                      ></iframe>
                    ) : (
                      <>
                        <img 
                          src={getYoutubeThumbnail(video.youtube_url)} 
                          alt={video.title} 
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 scale-105 group-hover:scale-100"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                            <Play size={32} fill="currentColor" className="ml-1" />
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </>
                    )}
                  </div>
                  <div className="p-6 bg-card mt-auto border-t">
                    <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors text-center">
                      {video.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
            {pageLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl w-full" />)
            ) : pageError ? (
              <div className="col-span-full">
                <ContentLoadError message="Homepage highlights could not be loaded." />
              </div>
            ) : whyChoose?.map(({ icon, title, desc }: any, i: number) => (
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
            {pageLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl w-full" />)
            ) : pageError ? (
              <div className="col-span-full">
                <ContentLoadError message="Testimonials could not be loaded." />
              </div>
            ) : testimonials?.map((t: any, i: number) => (
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
            ) : galleryError ? (
              <div className="col-span-full">
                <ContentLoadError message="Gallery images could not be loaded." />
              </div>
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
          <img src={showroomImage} alt="Showroom" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/70" />
        </div>
        <div
          ref={cta.ref}
          className={`relative z-10 container mx-auto px-4 text-center max-w-2xl transition-all duration-700 ${cta.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Visit Our <span className="gold-text">Showroom</span>
          </h2>
          <p className="text-foreground/70 text-lg mb-8">
            {SHOWROOM_SUBTITLE}
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
