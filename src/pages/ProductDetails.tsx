import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import { useState } from "react";
import { fetchStrapi, mapStrapiProduct } from "@/lib/strapi";
import { Skeleton } from "@/components/ui/skeleton";
import ContentLoadError from "@/components/ContentLoadError";

const ProductDetails = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);

  // Fetch Product
  const { data: product, isLoading: productLoading, isError: productError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      // id is documentId from Strapi 5
      const response = await fetchStrapi(`products/${id}`);
      return mapStrapiProduct(response.data);
    },
    enabled: !!id
  });

  // Fetch Related Products (same category)
  const { data: related } = useQuery({
    queryKey: ["related-products", product?.category],
    queryFn: async () => {
      const response = await fetchStrapi("products", {
        "filters[category][Name][$eq]": product?.category,
        "filters[documentId][$ne]": id,
        "pagination[limit]": 4
      });
      return response.data.map(mapStrapiProduct);
    },
    enabled: !!product?.category
  });

  if (productLoading) {
    return (
      <div className="min-h-screen pt-24 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (productError) {
    return (
      <div className="min-h-screen pt-24 container mx-auto px-4">
        <ContentLoadError message="This product could not be loaded." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Product Not Found</h1>
          <Link to="/products" className="btn-primary-glass inline-flex items-center gap-2">
            <ArrowLeft size={18} /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen pt-24">
      <section className="section-padding">
        <div className="container mx-auto">
          <Link to="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={18} /> Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="glass-card overflow-hidden rounded-2xl aspect-square">
                <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              </div>
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === i ? "border-primary" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              {product.badge && (
                <span className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                  {product.badge}
                </span>
              )}
              <h1 className="font-display text-3xl md:text-4xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground uppercase tracking-wider text-sm">{product.category}</p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{product.description}</div>

              {product.features && product.features.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-display text-lg font-semibold">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((f: string) => (
                      <li key={f} className="flex items-center gap-2 text-foreground/80">
                        <Check size={16} className="text-primary shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href={`https://wa.me/919801980316?text=Hi%20Dreams%20Furniture%2C%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary-glass flex items-center gap-2"
                >
                  <MessageCircle size={20} /> Inquire on WhatsApp
                </a>
                <Link to="/contact" className="btn-outline-glass">Contact Us</Link>
              </div>
            </div>
          </div>

          {/* Related */}
          {related && related.length > 0 && (
            <div className="mt-24">
              <h2 className="font-display text-3xl font-bold mb-8">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p: any) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
