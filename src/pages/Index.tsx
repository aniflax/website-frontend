import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ChevronRight, Play, MessageCircle } from "lucide-react";
import * as Icons from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import { fetchStrapi, mapStrapiProduct, mapHomepage, getStrapiURL } from "@/lib/strapi";
import { Skeleton } from "@/components/ui/skeleton";
import ContentLoadError from "@/components/ContentLoadError";

// Provide a safe icon renderer
const DynamicIcon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  // Simple mapping from slug-like icon name to Lucide icon component name
  const IconComponent = (Icons as any)[name.charAt(0).toUpperCase() + name.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())] || Icons.HelpCircle;
  return <IconComponent {...props} />;
};

const GoogleReviewsBadge = () => (
  <div className="inline-flex flex-col items-center gap-4 rounded-[2rem] border border-border/60 bg-background/90 px-7 py-5 shadow-lg backdrop-blur-sm md:px-10 md:py-6">
    <div className="flex items-center gap-4 md:gap-5">
      <div
        className="flex h-12 min-w-[3rem] items-center justify-center rounded-full bg-white px-2 text-lg font-black shadow-sm md:h-14 md:min-w-[3.5rem] md:px-2.5 md:text-xl"
        aria-label="Google"
      >
        <span aria-hidden="true" className="tracking-[-0.08em]">
          <span className="text-[#4285F4]">G</span>
          <span className="text-[#EA4335]">o</span>
          <span className="text-[#FBBC05]">o</span>
          <span className="text-[#4285F4]">g</span>
          <span className="text-[#34A853]">l</span>
          <span className="text-[#EA4335]">e</span>
        </span>
      </div>
      <div className="text-left">
        <p className="text-base font-semibold text-foreground md:text-xl">500+ Reviews</p>
        <div className="flex items-center gap-1.5 text-[#f4c430]" aria-label="4.5 out of 5 stars">
          {Array.from({ length: 4 }).map((_, index) => (
            <Star key={index} size={20} className="fill-current md:h-6 md:w-6" />
          ))}
          <span className="relative inline-flex h-5 w-5 md:h-6 md:w-6">
            <Star size={20} className="absolute inset-0 text-[#f4c430]/30 md:h-6 md:w-6" />
            <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: "50%" }}>
              <Star size={20} className="fill-current text-[#f4c430] md:h-6 md:w-6" />
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
);

const HERO_EYEBROW = "Premium Furniture Collection";
const HERO_TITLE = "Dreams Furnitures";
const HERO_SUBTITLE = "Transform your living spaces with handcrafted luxury furniture that speaks elegance and comfort.";
const SHOWROOM_SUBTITLE = "Income Tax Department: Canara Bank, Bank of India, LIC, ICAR-National Research Centre on Litchi, DAV School, Kendriya Vidyalaya, Sacred Heart School, Leprosy Mission Hospital, and more.";
const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Dreams+Furniture+-Branded+Furniture+Showroom+in+muzaffarpur+%7C+Best+Furniture+Shop+in+muzaffarpur/@26.119157,85.3947706,17.89z/data=!3m1!5s0x39ed10f88339f585:0x9c4ffdbc5317bc2!4m6!3m5!1s0x39ed11dc964fe957:0x4074c99300c9628!8m2!3d26.1180634!4d85.3960641!16s%2Fg%2F11jb8lt1zn?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D";
const WHATSAPP_URL = "https://wa.me/919801980316?text=Hi%20Dreams%20Furniture%2C%20I%20want%20to%20enquire%20about%20your%20furniture";

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
  const cta = useScrollAnimation();

  // Fetch Homepage Data
  const { data: pageData, isLoading: pageLoading, isError: pageError } = useQuery({
    queryKey: ["homepage"],
    queryFn: async () => {
      const response = await fetchStrapi("homepage", {
        populate: ["heroImage", "incomeTaxBannerImage", "ctaLogos", "whyChoosePoster", "whyChoose", "testimonials", "featuredVideos"]
      });
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
        "populate": "*"
      });
      return (response.data || []).map(mapStrapiProduct);
    }
  });

  const { heroImage, incomeTaxBannerImage, whyChoosePoster, ctaLogos, whyChoose, testimonials, featuredVideos } = pageData || {};
  const incomeTaxSectionImage =
    incomeTaxBannerImage && incomeTaxBannerImage !== "/placeholder.svg" ? incomeTaxBannerImage : heroImage;

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
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/34 via-foreground/16 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent opacity-30" />
        </div>
        <div
          ref={hero.ref}
          className={`relative z-10 container mx-auto px-4 lg:px-8 max-w-3xl transition-all duration-1000 ${hero.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          
          <p className="text-primary uppercase tracking-[0.3em] text-sm font-medium mb-4">{HERO_EYEBROW}</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6" dangerouslySetInnerHTML={{ __html: HERO_TITLE.replace("Dreams", "<span class='hero-dreams-text'>Dreams</span>") }}>
          </h1>
          <p className="hero-subtitle-glass mb-10">
            {HERO_SUBTITLE}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/products" className="btn-liquid-glass flex items-center gap-2">
              Explore Collection <ArrowRight size={18} />
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-liquid-glass flex items-center gap-2">
              <MessageCircle size={18} />
              WhatsApp Enquiry
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
          <div className="grid grid-cols-4 gap-2 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
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
                  <div className="p-2 md:p-4">
                    <h3 className="font-display font-semibold text-sm leading-tight text-foreground group-hover:text-primary transition-colors md:text-xl">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Poster */}
      {(pageLoading || (!pageError && whyChoosePoster && whyChoosePoster !== "/placeholder.svg")) && (
        <section className="pb-8 md:pb-12">
          <div className="container mx-auto px-2 sm:px-4">
            {pageLoading ? (
              <Skeleton className="mx-auto aspect-[16/7] w-full rounded-3xl" />
            ) : (
              <div className="mx-auto w-full overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5">
                <img
                  src={whyChoosePoster}
                  alt="Why Choose Dreams Furniture poster"
                  className="max-h-[390px] w-full object-contain md:max-h-[310px] lg:max-h-[350px]"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </section>
      )}

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
            <Link to="/products" className="featured-products-view-link hidden md:inline-flex items-center gap-2">
              View All <ChevronRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {prodsLoading ? (
              Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-2xl w-full" />)
            ) : prodsError ? (
              <div className="col-span-full">
                <ContentLoadError message="Featured products could not be loaded." />
              </div>
            ) : featuredProducts?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/products" className="featured-products-view-link inline-flex items-center gap-2">
              View All Products <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="pt-6 pb-0 md:pt-8 md:pb-0">
        <div className="container mx-auto flex justify-center px-4">
          <GoogleReviewsBadge />
        </div>
      </section>

      {/* Featured Videos */}
      {pageLoading ? (
        <section className="pt-2 pb-16 md:pt-4 md:pb-24">
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
        <section className="pt-2 pb-16 md:pt-4 md:pb-24">
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
          <div className="grid auto-cols-[78%] grid-flow-col gap-4 overflow-x-auto pb-2 sm:grid-cols-2 sm:grid-flow-row sm:auto-cols-auto sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
            {pageLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl w-full" />)
            ) : pageError ? (
              <div className="col-span-full">
                <ContentLoadError message="Homepage highlights could not be loaded." />
              </div>
            ) : whyChoose?.map(({ icon, title, desc }: any, i: number) => (
              <div key={title} className="glass-card-hover p-6 text-center sm:p-8" style={{ transitionDelay: `${i * 100}ms` }}>
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
          <div className="grid auto-cols-[82%] grid-flow-col gap-4 overflow-x-auto pb-2 md:grid-cols-3 md:grid-flow-row md:auto-cols-auto md:gap-6 md:overflow-visible md:pb-0">
            {pageLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl w-full" />)
            ) : pageError ? (
              <div className="col-span-full">
                <ContentLoadError message="Testimonials could not be loaded." />
              </div>
            ) : testimonials?.map((t: any, i: number) => (
              <div key={i} className="glass-card p-6 sm:p-8">
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

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={incomeTaxSectionImage} alt="Our Corporate Clients" className="w-full h-full object-cover" />
        </div>
        <div
          ref={cta.ref}
          className={`relative z-10 container mx-auto px-4 text-center max-w-2xl transition-all duration-700 ${cta.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Our Corporate <span className="gold-text">Clients</span>
          </h2>
          {ctaLogos?.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center justify-center gap-4 md:mb-8 md:gap-5">
              {ctaLogos.slice(0, 7).map((logo: string, index: number) => (
                <div
                  key={`${logo}-${index}`}
                  className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/95 p-3 shadow-lg ring-1 ring-black/5 backdrop-blur-sm md:h-24 md:w-24 md:rounded-3xl"
                >
                  <img
                    src={logo}
                    alt={`Corporate client logo ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}
            </div>
          )}
          <p className="text-foreground/70 text-lg mb-8">
            {SHOWROOM_SUBTITLE}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={GOOGLE_MAPS_URL}
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
