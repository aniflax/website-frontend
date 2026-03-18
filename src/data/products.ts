import sofa1 from "@/assets/products/sofa-1.jpg";
import sofa2 from "@/assets/products/sofa-2.jpg";
import bed1 from "@/assets/products/bed-1.jpg";
import bed2 from "@/assets/products/bed-2.jpg";
import dining1 from "@/assets/products/dining-1.jpg";
import dining2 from "@/assets/products/dining-2.jpg";
import wardrobe1 from "@/assets/products/wardrobe-1.jpg";
import office1 from "@/assets/products/office-1.jpg";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number | null;
  originalPrice?: number | null;
  image: string;
  images?: string[];
  description: string;
  features?: string[];
  badge?: string;
}

export const categories = ["All", "Sofas", "Beds", "Dining", "Wardrobes", "Office"];

export const products: Product[] = [
  {
    id: "1",
    name: "Royal Velvet Sofa",
    category: "Sofas",
    price: 89999,
    originalPrice: 110000,
    image: sofa1,
    images: [sofa1, sofa2],
    description: "Experience unmatched luxury with our Royal Velvet Sofa. Crafted with premium velvet upholstery and solid wood frame, this sofa brings elegance to any living space.",
    features: ["Premium Velvet Fabric", "Solid Wood Frame", "High-Density Foam", "5 Year Warranty"],
    badge: "Bestseller",
  },
  {
    id: "2",
    name: "Modern L-Shape Sectional",
    category: "Sofas",
    price: 125000,
    originalPrice: 150000,
    image: sofa2,
    images: [sofa2, sofa1],
    description: "The perfect blend of style and comfort. Our L-Shape Sectional provides generous seating for the whole family with contemporary design.",
    features: ["Modular Design", "Stain-Resistant Fabric", "Reversible Cushions", "10 Year Warranty"],
    badge: "New",
  },
  {
    id: "3",
    name: "Elegance King Bed",
    category: "Beds",
    price: 75000,
    originalPrice: 95000,
    image: bed1,
    images: [bed1, bed2],
    description: "Transform your bedroom into a luxury retreat with the Elegance King Bed. Features a plush upholstered headboard and sturdy construction.",
    features: ["King Size", "Upholstered Headboard", "Under-bed Storage", "Engineered Wood"],
    badge: "Popular",
  },
  {
    id: "4",
    name: "Heritage Platform Bed",
    category: "Beds",
    price: 95000,
    image: bed2,
    images: [bed2, bed1],
    description: "A statement piece that combines classic tufted design with modern platform styling. The Heritage bed is built to last generations.",
    features: ["Tufted Leather Headboard", "Platform Design", "No Box Spring Needed", "Premium Finish"],
  },
  {
    id: "5",
    name: "Grand Dining Table Set",
    category: "Dining",
    price: 65000,
    originalPrice: 80000,
    image: dining1,
    images: [dining1, dining2],
    description: "Gather around the Grand Dining Table Set for memorable meals. Solid wood construction with seating for six in timeless elegance.",
    features: ["Seats 6", "Solid Sheesham Wood", "Natural Finish", "Matching Chairs Included"],
    badge: "Sale",
  },
  {
    id: "6",
    name: "Marble Top Round Dining",
    category: "Dining",
    price: 110000,
    image: dining2,
    images: [dining2, dining1],
    description: "A showstopper for modern dining rooms. Italian marble top paired with a sculptural gold-tone base creates a stunning centerpiece.",
    features: ["Italian Marble Top", "Gold-Tone Base", "Seats 4-6", "Designer Chairs"],
    badge: "Premium",
  },
  {
    id: "7",
    name: "Walk-in Wardrobe System",
    category: "Wardrobes",
    price: 135000,
    originalPrice: 165000,
    image: wardrobe1,
    images: [wardrobe1],
    description: "Organize your wardrobe like a luxury boutique. Our walk-in system features adjustable shelving, hanging rods, and soft-close drawers.",
    features: ["Modular System", "Soft-Close Drawers", "LED Lighting", "Adjustable Shelving"],
    badge: "Trending",
  },
  {
    id: "8",
    name: "Executive Office Suite",
    category: "Office",
    price: 85000,
    image: office1,
    images: [office1],
    description: "Command your workspace with the Executive Office Suite. Featuring a sleek glass-top desk with ergonomic chair for maximum productivity.",
    features: ["Glass Top Desk", "Ergonomic Chair", "Cable Management", "Built-in Shelving"],
  },
];
