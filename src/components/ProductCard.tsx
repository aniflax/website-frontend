import { Link } from "react-router-dom";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link to={`/products/${product.id}`} className="block group">
      <div className="glass-card-hover overflow-hidden">
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {product.badge && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider">
              {product.badge}
            </span>
          )}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            <span className="btn-primary-glass text-sm inline-block">View Details</span>
          </div>
        </div>
        <div className="p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.category}</p>
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
