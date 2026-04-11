import { useState } from "react";
import * as Icons from "lucide-react";
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { BULK_ORDER_PAGE_DATA } from "@/data/bulkOrder";

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
  const resolvedData = BULK_ORDER_PAGE_DATA;
  const showcaseImages = resolvedData.galleryImages.filter(Boolean);

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
  const heroBannerImage = resolvedData.bannerImage || "/placeholder.svg";

  return (
    <div className="min-h-screen pt-24">
      <section className="bg-secondary/20 px-0 pb-4 pt-2 sm:px-4 md:px-6 lg:px-8">
        <div className="mx-auto w-full sm:container">
          <div className="overflow-hidden border-y border-glass-border bg-card/60 sm:rounded-[1.75rem] sm:border">
            <img
              src={heroBannerImage}
              alt="Bulk order banner"
              className="aspect-[125/43] h-auto w-full object-contain object-center"
            />
          </div>
        </div>
      </section>

      {hasWhoWeServe && (
        <section className="px-1 pb-16 pt-8 sm:px-6 md:pb-24 md:pt-10 lg:px-8">
          <div className="container mx-auto">
            <div
              ref={serve.ref}
              className={`mb-12 max-w-3xl transition-all duration-700 ${
                serve.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="mb-2 text-sm uppercase tracking-[0.2em] text-primary">{sectionHeadings.serve.eyebrow}</p>
              <h2 className="font-display text-2xl font-bold md:text-5xl">{sectionHeadings.serve.title}</h2>
            </div>
            <div className="grid grid-cols-3 gap-1.5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
              {resolvedData.whoWeServe.map((item: any, index: number) => (
                <article key={`${item.title}-${index}`} className="glass-card-hover p-2 md:p-7">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-primary/10 md:mb-6 md:h-16 md:w-16 md:rounded-2xl">
                    {item.icon ? (
                      <img src={item.icon} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                      <DynamicIcon
                        name={titleIconMap[item.title] || "package"}
                        className="h-4 w-4 text-primary md:h-7 md:w-7"
                      />
                    )}
                  </div>
                  <h3 className="mb-1 font-display text-[0.65rem] font-semibold leading-tight md:mb-3 md:text-2xl">{item.title}</h3>
                  {item.description && <p className="hidden text-sm leading-relaxed text-muted-foreground md:block">{item.description}</p>}
                </article>
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
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

            <form onSubmit={handleSubmit} className="glass-card p-5 md:p-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    <label className="mb-1 block text-xs text-muted-foreground md:mb-2 md:text-sm">{label}</label>
                    <input
                      type={type}
                      required
                      min={type === "number" ? 1 : undefined}
                      value={form[key as keyof typeof form]}
                      onChange={(event) => handleChange(key, event.target.value)}
                      className="w-full rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 md:rounded-xl md:px-4 md:py-3 md:text-base"
                      placeholder={label}
                    />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs text-muted-foreground md:mb-2 md:text-sm">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(event) => handleChange("message", event.target.value)}
                    className="w-full resize-none rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 md:rounded-xl md:px-4 md:py-3 md:text-base"
                    placeholder="Tell us about your project requirements, timeline, and preferred furniture."
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary-glass mt-5 inline-flex w-full items-center justify-center gap-2 py-3 md:mt-6 md:py-4">
                Request Quote <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>

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
              <h2 className="font-display text-2xl font-bold md:text-5xl">{sectionHeadings.whyChoose.title}</h2>
            </div>
            <div className="grid grid-cols-3 gap-1.5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
              {resolvedData.whyChooseUs.map((item: any, index: number) => (
                <article key={`${item.title}-${index}`} className="glass-card-hover p-2 md:p-7">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 md:mb-5 md:h-14 md:w-14 md:rounded-2xl">
                    <DynamicIcon name={item.icon || titleIconMap[item.title] || "shield-check"} className="h-4 w-4 text-primary md:h-6 md:w-6" />
                  </div>
                  <h3 className="mb-1 font-display text-[0.65rem] font-semibold leading-tight md:mb-3 md:text-2xl">{item.title}</h3>
                  {item.description && <p className="hidden text-sm leading-relaxed text-muted-foreground md:block">{item.description}</p>}
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
              <h2 className="font-display text-2xl font-bold md:text-5xl">{sectionHeadings.process.title}</h2>
            </div>
            <div className="grid grid-cols-5 gap-1 md:gap-6 lg:grid-cols-5">
              {resolvedData.processSteps.map((item: any, index: number) => (
                <article key={`${item.stepTitle}-${index}`} className="relative glass-card p-2 md:p-6">
                  <div className="mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[0.6rem] text-primary-foreground md:mb-5 md:h-12 md:w-12 md:text-base">
                    {index + 1}
                  </div>
                  <h3 className="mb-1 font-display text-[0.55rem] font-semibold leading-tight md:mb-3 md:text-xl">{item.stepTitle}</h3>
                  {item.stepDescription && (
                    <p className="hidden text-sm leading-relaxed text-muted-foreground md:block">{item.stepDescription}</p>
                  )}
                  {index < resolvedData.processSteps.length - 1 && (
                    <ChevronRight className="absolute -right-2 top-4 hidden h-4 w-4 text-primary/60 md:-right-4 md:top-10 lg:block lg:h-6 lg:w-6" />
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

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
