import topBanner from "@/assets/bulk-order/bulk-order-top-banner.jpg";
import sofa1 from "@/assets/products/sofa-1.jpg";
import sofa2 from "@/assets/products/sofa-2.jpg";
import bed1 from "@/assets/products/bed-1.jpg";
import bed2 from "@/assets/products/bed-2.jpg";
import dining1 from "@/assets/products/dining-1.jpg";
import dining2 from "@/assets/products/dining-2.jpg";
import wardrobe1 from "@/assets/products/wardrobe-1.jpg";
import office1 from "@/assets/products/office-1.jpg";

export const BULK_ORDER_PAGE_DATA = {
  bannerImage: topBanner,
  whoWeServe: [
    {
      title: "Hotels & Resorts",
      description: "Elegant guest room, lobby, and lounge furniture tailored for hospitality environments.",
    },
    {
      title: "Offices & Workspaces",
      description: "Functional desks, chairs, workstations, and meeting room furniture for modern offices.",
    },
    {
      title: "Restaurants & Cafes",
      description: "Durable seating and tables built for daily commercial use without compromising on style.",
    },
    {
      title: "Real Estate Developers",
      description: "Bulk furnishing support for sample flats, clubhouses, and complete residential projects.",
    },
    {
      title: "Interior Designers",
      description: "Reliable manufacturing and custom furniture support for turnkey interior projects.",
    },
    {
      title: "Schools & Institutions",
      description: "Practical, robust furniture solutions for campuses, training centers, and institutional spaces.",
    },
  ],
  furnitureCategories: [
    {
      title: "Living Room",
      description: "Sofas, armchairs, coffee tables, and TV units for premium shared spaces.",
      image: sofa1,
    },
    {
      title: "Bedroom",
      description: "Beds, wardrobes, bedside tables, and complete room furniture packages.",
      image: bed1,
    },
    {
      title: "Dining",
      description: "Dining tables and dining chairs suitable for homes, hospitality, and cafes.",
      image: dining1,
    },
    {
      title: "Office",
      description: "Office chairs, workstations, executive desks, and conference tables.",
      image: office1,
    },
    {
      title: "Commercial",
      description: "Restaurant seating, reception furniture, and lounge seating for business spaces.",
      image: sofa2,
    },
  ],
  whyChooseUs: [
    {
      title: "Bulk Pricing",
      description: "Project-friendly pricing and quantity-based cost efficiency for large requirements.",
      icon: "badge-percent",
    },
    {
      title: "Custom Designs",
      description: "Flexible design support to align furniture with your layout and aesthetic goals.",
      icon: "pencil-ruler",
    },
    {
      title: "High Quality Materials",
      description: "Strong materials, quality finishes, and dependable workmanship across categories.",
      icon: "shield-check",
    },
    {
      title: "Fast Production",
      description: "Planned production timelines to help keep your project delivery on track.",
      icon: "factory",
    },
    {
      title: "Pan India Delivery",
      description: "Reliable logistics coordination for projects across cities and states.",
      icon: "truck",
    },
    {
      title: "Dedicated Project Support",
      description: "A responsive team to assist with planning, quotations, and execution follow-through.",
      icon: "headset",
    },
  ],
  processSteps: [
    {
      stepTitle: "Submit Request",
      stepDescription: "Share your furniture needs, project type, location, and expected quantities.",
    },
    {
      stepTitle: "Consultation with our team",
      stepDescription: "We understand your use case, style direction, and commercial requirements.",
    },
    {
      stepTitle: "Custom quotation",
      stepDescription: "Receive a tailored quotation with product scope, pricing, and estimated timelines.",
    },
    {
      stepTitle: "Manufacturing",
      stepDescription: "Once approved, we move into production with quality checks throughout the process.",
    },
    {
      stepTitle: "Delivery & installation",
      stepDescription: "We coordinate dispatch, on-site delivery, and setup support as required.",
    },
  ],
  galleryImages: [sofa1, bed1, dining1, wardrobe1, office1, sofa2, bed2, dining2, topBanner],
  ctaTitle: "Planning a Bulk Furniture Project?",
  ctaDescription:
    "Talk to Dreams Furniture for custom quotations, design coordination, and dependable project delivery.",
} as const;
