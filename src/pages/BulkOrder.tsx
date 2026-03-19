import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as Icons from "lucide-react";
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchStrapi, mapBulkOrderPage, mapStrapiGallery, mapStrapiProduct } from "@/lib/strapi";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const WHATSAPP_NUMBER = "919801980316";

const titleIconMap: Record<string, string> = {
  "Hotels & Resorts": "hotel",
  "Offices & Workspaces": "briefcase-business",
  "Restaurants & Cafes": "utensils-crossed",
  "Real Estate Developers": "building-2",
  "Interior Designers": "palette",
  "Schools & Institutions": "graduation-cap",
  "Bulk Pricing": "badge-percent",
  "Custom Designs": "pencil-ruler",
  "High Quality Materials": "shield-check",
  "Fast Production": "factory",
  "Pan India Delivery": "truck",
  "Dedicated Project Support": "headset",
};

const sectionHeadings = {
  serve: {
    eyebrow: "Industries We Support",
    title: "Built for Projects That Need Scale, Speed, and Consistency",
  },
  categories: {
    eyebrow: "Bulk Collections",
    title: "Furniture Categories Available for Bulk Orders",
  },
  whyChoose: {
    eyebrow: "Why Dreams Furniture",
    title: "Execution That Works Beyond a Catalog Sale",
  },
  process: {
    eyebrow: "How It Works",
    title: "A Clear Process From Inquiry to Installation",
  },
  gallery: {
    eyebrow: "Project Showcase",
    title: "Bulk Furniture Visuals",
  },
  form: {
    eyebrow: "Bulk Inquiry",
    title: "Request a Tailored Quote for Your Project",
    description:
      "Share your project details and our team will connect with you for planning, pricing, and timelines.",
  },
};

const defaultWhoWeServe = [
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
];

const defaultFurnitureCategories = [
  {
    title: "Living Room",
    description: "Sofas, armchairs, coffee tables, and TV units for premium shared spaces.",
  },
  {
    title: "Bedroom",
    description: "Beds, wardrobes, bedside tables, and complete room furniture packages.",
  },
  {
    title: "Dining",
    description: "Dining tables and dining chairs suitable for homes, hospitality, and cafes.",
  },
  {
    title: "Office",
    description: "Office chairs, workstations, executive desks, and conference tables.",
  },
  {
    title: "Commercial",
    description: "Restaurant seating, reception furniture, and lounge seating for business spaces.",
  },
];

const defaultWhyChooseUs = [
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
];

const defaultProcessSteps = [
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
];

const defaultCta = {
  title: "Planning a Bulk Furniture Project?",
  description:
    "Talk to Dreams Furniture for custom quotations, design coordination, and dependable project delivery.",
};

const DynamicIcon = ({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) => {
  const resolvedName = (name || "package")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  const IconComponent = (Icons as any)[resolvedName] || Icons.Package;
  return <IconComponent className={className} />;
};

const BulkOrder = () => {
  const serve = useScrollAnimation();
  const categories = useScrollAnimation();
  const whyChoose = useScrollAnimation();
  const process = useScrollAnimation();
  const gallery = useScrollAnimation();
  const inquiry = useScrollAnimation();
  const cta = useScrollAnimation();

  const [form, setForm] = useState({
    name: "",
    companyName: "",
    phone: "",
    email: "",
    city: "",
    furnitureType: "",
    quantity: "",
    message: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["bulk-order-page"],
    queryFn: async () => {
      try {
        const response = await fetchStrapi("bulk-order-page", {
          "populate[bannerImage]": "*",
          "populate[whoWeServe][populate][icon]": "*",
          "populate[furnitureCategories][populate][image]": "*",
          "populate[whyChooseUs]": "*",
          "populate[processSteps]": "*",
          "populate[galleryImages]": "*",
        });

        return mapBulkOrderPage(response);
      } catch (error) {
        console.warn("Bulk Order page entry unavailable in Strapi. Using fallback content.", error);
        return null;
      }
    },
  });

  const { data: galleryItems } = useQuery({
    queryKey: ["bulk-order-gallery-fallback"],
    queryFn: async () => {
      const response = await fetchStrapi("galleries", { "pagination[limit]": 12, "populate": "*" });
      return (response.data || []).map(mapStrapiGallery).filter(Boolean);
    },
  });

  const { data: productItems } = useQuery({
    queryKey: ["bulk-order-products-fallback"],
    queryFn: async () => {
      const response = await fetchStrapi("products", { "pagination[limit]": 12, "populate": "*" });
      return (response.data || []).map(mapStrapiProduct).filter(Boolean);
    },
  });

  const resolvedData = useMemo(() => {
    const productImages = (productItems || []).flatMap((item: any) => [item.image, ...(item.images || [])]).filter(Boolean);
    const galleryImages = (galleryItems || []).filter(Boolean);
    const imagePool = [...(data?.galleryImages || []), ...galleryImages, ...productImages].filter(Boolean);

    const pickImage = (index: number) => imagePool[index % Math.max(imagePool.length, 1)];
    const findProductImage = (keyword: string) =>
      (productItems || []).find((item: any) => item.category?.toLowerCase().includes(keyword) || item.name?.toLowerCase().includes(keyword))?.image;

    const whoWeServe = (data?.whoWeServe?.length ? data.whoWeServe : defaultWhoWeServe).map((item: any, index: number) => ({
      ...item,
      icon: item.icon || pickImage(index),
    }));

    const categoryImageMap = [
      findProductImage("sofa") || pickImage(0),
      findProductImage("bed") || findProductImage("wardrobe") || pickImage(1),
      findProductImage("dining") || pickImage(2),
      findProductImage("office") || pickImage(3),
      pickImage(4),
    ];

    const furnitureCategories = (data?.furnitureCategories?.length ? data.furnitureCategories : defaultFurnitureCategories).map(
      (item: any, index: number) => ({
        ...item,
        image: item.image || categoryImageMap[index] || pickImage(index),
      })
    );

    return {
      whoWeServe,
      furnitureCategories,
      whyChooseUs: data?.whyChooseUs?.length ? data.whyChooseUs : defaultWhyChooseUs,
      processSteps: data?.processSteps?.length ? data.processSteps : defaultProcessSteps,
      galleryImages: imagePool.slice(0, 9),
      ctaTitle: data?.ctaTitle || defaultCta.title,
      ctaDescription: data?.ctaDescription || defaultCta.description,
    };
  }, [data, galleryItems, productItems]);

  const showcaseImages = useMemo(
    () => (resolvedData.galleryImages || []).filter(Boolean),
    [resolvedData.galleryImages]
  );

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const lines = [
      "Bulk Order Inquiry",
      `Name: ${form.name}`,
      `Company Name: ${form.companyName}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      `City: ${form.city}`,
      `Furniture Type: ${form.furnitureType}`,
      `Quantity: ${form.quantity}`,
      `Message: ${form.message}`,
    ];

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success("Your inquiry draft is ready. Please send it in WhatsApp.");
    setForm({
      name: "",
      companyName: "",
      phone: "",
      email: "",
      city: "",
      furnitureType: "",
      quantity: "",
      message: "",
    });
  };

  const scrollToInquiry = () => {
    const element = document.getElementById("bulk-inquiry-form");
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hasWhoWeServe = Boolean(resolvedData.whoWeServe?.length);
  const hasCategories = Boolean(resolvedData.furnitureCategories?.length);
  const hasWhyChooseUs = Boolean(resolvedData.whyChooseUs?.length);
  const hasProcessSteps = Boolean(resolvedData.processSteps?.length);
  const hasGallery = Boolean(showcaseImages.length);
  const hasCta = Boolean(resolvedData.ctaTitle || resolvedData.ctaDescription);
  const heroBannerImage = data?.bannerImage || showcaseImages[0] || "/placeholder.svg";

  return (
    <div className="min-h-screen pt-24">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-none" />
          ) : (
            <img src={heroBannerImage} alt="Bulk order banner" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="relative h-[320px] md:h-[400px] lg:h-[440px]" />
      </section>

      {hasWhoWeServe && (
        <section className="px-4 pb-16 pt-8 sm:px-6 md:pb-24 md:pt-10 lg:px-8">
          <div className="container mx-auto">
            <div
              ref={serve.ref}
              className={`mb-12 max-w-3xl transition-all duration-700 ${
                serve.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="mb-2 text-sm uppercase tracking-[0.2em] text-primary">{sectionHeadings.serve.eyebrow}</p>
              <h2 className="font-display text-4xl font-bold md:text-5xl">{sectionHeadings.serve.title}</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {resolvedData.whoWeServe.map((item: any, index: number) => (
                <article key={`${item.title}-${index}`} className="glass-card-hover p-7">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-primary/10">
                    {item.icon ? (
                      <img src={item.icon} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                      <DynamicIcon
                        name={titleIconMap[item.title] || "package"}
                        className="h-7 w-7 text-primary"
                      />
                    )}
                  </div>
                  <h3 className="mb-3 font-display text-2xl font-semibold">{item.title}</h3>
                  {item.description && <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {hasCategories && (
        <section className="section-padding bg-secondary/20">
          <div className="container mx-auto">
            <div
              ref={categories.ref}
              className={`mb-12 text-center transition-all duration-700 ${
                categories.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="mb-2 text-sm uppercase tracking-[0.2em] text-primary">{sectionHeadings.categories.eyebrow}</p>
              <h2 className="font-display text-4xl font-bold md:text-5xl">{sectionHeadings.categories.title}</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {resolvedData.furnitureCategories.map((item: any, index: number) => (
                <article key={`${item.title}-${index}`} className="group overflow-hidden rounded-[1.75rem] border border-glass-border bg-card/70">
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary/40">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/20 to-primary/5">
                        <Icons.Package className="h-10 w-10 text-primary/70" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/75 via-transparent to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-3 font-display text-2xl font-semibold">{item.title}</h3>
                    {item.description && <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{item.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {hasWhyChooseUs && (
        <section className="section-padding">
          <div className="container mx-auto">
            <div
              ref={whyChoose.ref}
              className={`mb-12 text-center transition-all duration-700 ${
                whyChoose.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="mb-2 text-sm uppercase tracking-[0.2em] text-primary">{sectionHeadings.whyChoose.eyebrow}</p>
              <h2 className="font-display text-4xl font-bold md:text-5xl">{sectionHeadings.whyChoose.title}</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {resolvedData.whyChooseUs.map((item: any, index: number) => (
                <article key={`${item.title}-${index}`} className="glass-card-hover p-7">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <DynamicIcon name={item.icon || titleIconMap[item.title] || "shield-check"} className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-3 font-display text-2xl font-semibold">{item.title}</h3>
                  {item.description && <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {hasProcessSteps && (
        <section className="section-padding bg-secondary/20">
          <div className="container mx-auto">
            <div
              ref={process.ref}
              className={`mb-12 text-center transition-all duration-700 ${
                process.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="mb-2 text-sm uppercase tracking-[0.2em] text-primary">{sectionHeadings.process.eyebrow}</p>
              <h2 className="font-display text-4xl font-bold md:text-5xl">{sectionHeadings.process.title}</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              {resolvedData.processSteps.map((item: any, index: number) => (
                <article key={`${item.stepTitle}-${index}`} className="relative glass-card p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {index + 1}
                  </div>
                  <h3 className="mb-3 font-display text-xl font-semibold">{item.stepTitle}</h3>
                  {item.stepDescription && (
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.stepDescription}</p>
                  )}
                  {index < resolvedData.processSteps.length - 1 && (
                    <ChevronRight className="absolute -right-4 top-10 hidden h-6 w-6 text-primary/60 lg:block" />
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {hasGallery && (
        <section className="section-padding">
          <div className="container mx-auto">
            <div
              ref={gallery.ref}
              className={`mb-12 text-center transition-all duration-700 ${
                gallery.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="mb-2 text-sm uppercase tracking-[0.2em] text-primary">{sectionHeadings.gallery.eyebrow}</p>
              <h2 className="font-display text-4xl font-bold md:text-5xl">{sectionHeadings.gallery.title}</h2>
            </div>
            <div className="columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3">
              {showcaseImages.map((image: string, index: number) => (
                <div key={`${image}-${index}`} className="overflow-hidden rounded-[1.75rem] break-inside-avoid border border-glass-border">
                  <img
                    src={image}
                    alt={`Bulk project ${index + 1}`}
                    className="w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="bulk-inquiry-form" className="section-padding bg-secondary/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-10 xl:grid-cols-[0.95fr_1.05fr]">
            <div
              ref={inquiry.ref}
              className={`transition-all duration-700 ${
                inquiry.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="mb-2 text-sm uppercase tracking-[0.2em] text-primary">{sectionHeadings.form.eyebrow}</p>
              <h2 className="mb-5 font-display text-4xl font-bold md:text-5xl">{sectionHeadings.form.title}</h2>
              <p className="mb-8 max-w-xl text-base leading-relaxed text-muted-foreground">
                {sectionHeadings.form.description}
              </p>
              <div className="space-y-4">
                {[
                  "Bulk pricing for project-scale requirements",
                  "Design guidance for residential and commercial spaces",
                  "Coordination for dispatch, delivery, and installation",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                    <p className="text-sm text-foreground/80">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {[
                  { key: "name", label: "Name", type: "text" },
                  { key: "companyName", label: "Company Name", type: "text" },
                  { key: "phone", label: "Phone", type: "tel" },
                  { key: "email", label: "Email", type: "email" },
                  { key: "city", label: "City", type: "text" },
                  { key: "furnitureType", label: "Furniture Type", type: "text" },
                  { key: "quantity", label: "Quantity", type: "number" },
                ].map(({ key, label, type }) => (
                  <div key={key} className={key === "quantity" ? "md:col-span-2" : ""}>
                    <label className="mb-2 block text-sm text-muted-foreground">{label}</label>
                    <input
                      type={type}
                      required
                      min={type === "number" ? 1 : undefined}
                      value={form[key as keyof typeof form]}
                      onChange={(event) => handleChange(key, event.target.value)}
                      className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder={label}
                    />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm text-muted-foreground">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(event) => handleChange("message", event.target.value)}
                    className="w-full resize-none rounded-xl border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Tell us about your project requirements, timeline, and preferred furniture."
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary-glass mt-6 inline-flex w-full items-center justify-center gap-2">
                Request Quote <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {hasCta && (
        <section className="section-padding">
          <div className="container mx-auto">
            <div
              ref={cta.ref}
              className={`relative overflow-hidden rounded-[2rem] border border-glass-border bg-card px-8 py-12 md:px-12 md:py-16 transition-all duration-700 ${
                cta.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(38_70%_50%_/_0.15),transparent_35%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(216_19%_26%_/_0.08),transparent_50%)]" />
              <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="mb-2 text-sm uppercase tracking-[0.2em] text-primary">Start Your Project</p>
                  <h2 className="mb-4 font-display text-4xl font-bold md:text-5xl">{resolvedData.ctaTitle}</h2>
                  {resolvedData.ctaDescription && (
                    <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{resolvedData.ctaDescription}</p>
                  )}
                </div>
                <button type="button" onClick={scrollToInquiry} className="btn-primary-glass inline-flex items-center gap-2 self-start">
                  Request Bulk Quote <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BulkOrder;
