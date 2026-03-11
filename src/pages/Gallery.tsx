import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchStrapi, mapStrapiGallery } from "@/lib/strapi";
import { Skeleton } from "@/components/ui/skeleton";
import ContentLoadError from "@/components/ContentLoadError";

const Gallery = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const header = useScrollAnimation();

  // Fetch Gallery
  const { data: galleryImages, isLoading, isError } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const response = await fetchStrapi("galleries", { "pagination[limit]": 50, "populate": "*" });
      const rawData = response.data || [];
      return rawData.map(mapStrapiGallery).filter(Boolean);
    }
  });

  return (
    <div className="min-h-screen pt-24">
      <section className="section-padding">
        <div className="container mx-auto">
          <div
            ref={header.ref}
            className={`text-center mb-12 transition-all duration-700 ${header.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <p className="text-primary uppercase tracking-[0.2em] text-sm mb-2">Visual Journey</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold">Our Gallery</h1>
          </div>

          {/* Masonry Grid */}
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {isLoading ? (
              Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-64 rounded-2xl" />
              ))
            ) : isError ? (
              <ContentLoadError message="Gallery content could not be loaded." />
            ) : (
              galleryImages?.map((img: string, i: number) => (
                <div
                  key={i}
                  onClick={() => setLightbox(i)}
                  className="break-inside-avoid group cursor-pointer overflow-hidden rounded-2xl relative"
                >
                  <img
                    src={img}
                    alt={`Gallery ${i + 1}`}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    style={{ aspectRatio: i % 3 === 0 ? "3/4" : i % 3 === 1 ? "1/1" : "4/3" }}
                  />
                  <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <span className="text-foreground font-display text-lg font-semibold">View</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {!isLoading && (!galleryImages || galleryImages.length === 0) && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-xl">Our gallery is coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && galleryImages && (
        <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors">
            <X size={32} />
          </button>
          <img
            src={galleryImages[lightbox]}
            alt=""
            className="max-w-full max-h-[85vh] object-contain rounded-2xl animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;
