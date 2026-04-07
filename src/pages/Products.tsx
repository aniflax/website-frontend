import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fetchStrapi, mapStrapiProduct } from "@/lib/strapi";
import { Skeleton } from "@/components/ui/skeleton";
import ContentLoadError from "@/components/ContentLoadError";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "All";
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const header = useScrollAnimation();

  // Fetch Products
  const { data: products, isLoading: productsLoading, isError: productsError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetchStrapi("products", {
        "populate": "*",
        "pagination[limit]": 100,
      });
      const rawData = response.data || [];
      return rawData.map(mapStrapiProduct);
    }
  });

  // Fetch Categories
  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const response = await fetchStrapi("categories");
      const rawData = response.data || [];
      return ["All", ...rawData.map((c: any) => c.Name || c.attributes?.Name)];
    }
  });

  const filtered = useMemo(() => {
    if (!products) return [];
    if (activeCategory === "All") return products;
    return products.filter((p: any) => p.category === activeCategory);
  }, [products, activeCategory]);

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === "All") newParams.delete("category");
    else newParams.set("category", cat);
    setSearchParams(newParams);
  };

  const isLoading = productsLoading || categoriesLoading;

  return (
    <div className="min-h-screen pt-24">
      <section className="section-padding">
        <div className="container mx-auto">
          <div
            ref={header.ref}
            className={`text-center mb-12 transition-all duration-700 ${header.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <p className="text-primary uppercase tracking-[0.2em] text-sm mb-2">Our Collection</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold">Premium Furniture</h1>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-24 rounded-xl" />
              ))
            ) : categoriesError ? (
              <ContentLoadError message="Product categories could not be loaded." />
            ) : (
              categories?.map((cat: string) => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {cat}
                </button>
              ))
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl w-full" />
              ))
            ) : productsError ? (
              <div className="col-span-full">
                <ContentLoadError message="Products could not be loaded." />
              </div>
            ) : (
              filtered.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          {!isLoading && activeCategory !== "All" && filtered.length > 0 && (
            <div className="mt-10 flex justify-center">
              <div className="btn-liquid-glass inline-flex items-center justify-center text-center text-sm font-semibold md:text-base">
                More variants are available at the showroom
              </div>
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-xl">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
