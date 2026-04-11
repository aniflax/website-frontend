import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import * as Icons from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchStrapi, mapAboutPage } from "@/lib/strapi";
import { Skeleton } from "@/components/ui/skeleton";
import ContentLoadError from "@/components/ContentLoadError";

// Provide a safe icon renderer
const DynamicIcon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const IconComponent = (Icons as any)[name.charAt(0).toUpperCase() + name.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())] || Icons.HelpCircle;
  return <IconComponent {...props} />;
};

const ABOUT_COPY = {
  heroEyebrow: "Our Story",
  heroTitle: "About Dreams Furniture",
  heroSubtitle: "Where luxury meets comfort, and every piece tells a story of craftsmanship and elegance.",
  storyEyebrow: "Our Journey",
  storyTitle: "A Legacy of Craftsmanship",
  storyText:
    "Founded with a passion for creating exceptional furniture, Dreams Furniture has been Muzaffarpur's premier destination for luxury home furnishings. What started as a small workshop has grown into a sprawling showroom featuring over 500 unique designs.\n\nWe believe that furniture is more than just functional — it's an expression of your personality and taste. That's why every piece in our collection is carefully curated or custom-designed to bring beauty and comfort into your home.",
  valuesEyebrow: "What Drives Us",
  valuesTitle: "Our Values",
};

const ABOUT_STATS = [
  { value: "15+", label: "Years of Excellence" },
  { value: "10K+", label: "Happy Customers" },
  { value: "500+", label: "Unique Designs" },
  { value: "100%", label: "Quality Assured" },
];

const ABOUT_VALUES = [
  { icon: "heart", title: "Passion for Craft", desc: "Every piece is crafted with love and meticulous attention to detail." },
  { icon: "eye", title: "Eye for Design", desc: "Contemporary aesthetics blended with timeless elegance." },
  { icon: "award", title: "Quality First", desc: "Only the finest materials make it into our collections." },
  { icon: "users", title: "Customer Focus", desc: "Your satisfaction drives every decision we make." },
];

const About = () => {
  const header = useScrollAnimation();
  const story = useScrollAnimation();
  const mission = useScrollAnimation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["about-page"],
    queryFn: async () => {
      const response = await fetchStrapi("about-page", { populate: ["heroImage", "storyImage"] });
      return mapAboutPage(response);
    }
  });
  const { storyImage } = data || {};
  const heroImage = "/hero-banner.jpg";

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Showroom" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/70" />
        </div>
        <div ref={header.ref} className={`relative z-10 container mx-auto px-4 text-center max-w-3xl transition-all duration-700 ${header.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-2">{ABOUT_COPY.heroEyebrow}</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: ABOUT_COPY.heroTitle.replace("Dreams Furniture", "<span class='gold-text'>Dreams Furniture</span>") }}></h1>
          <p className="text-foreground/70 text-lg">{ABOUT_COPY.heroSubtitle}</p>
        </div>
      </section>

      {isError && (
        <div className="container mx-auto px-4 pt-6">
          <ContentLoadError message="About page images could not be loaded." />
        </div>
      )}

      {/* Stats */}
      <section className="py-12 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {ABOUT_STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl md:text-4xl font-bold gold-text">{s.value}</p>
                <p className="text-muted-foreground text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div ref={story.ref} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${story.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="space-y-6">
              <p className="text-primary uppercase tracking-[0.2em] text-sm">{ABOUT_COPY.storyEyebrow}</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">{ABOUT_COPY.storyTitle}</h2>
              <div className="text-foreground/70 leading-relaxed whitespace-pre-wrap">
                {ABOUT_COPY.storyText}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden">
              {isLoading ? (
                <Skeleton className="h-80 w-full lg:h-96 rounded-none" />
              ) : (
                <img src={storyImage} alt="Our Store" className="w-full h-80 lg:h-96 object-cover" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto">
          <div ref={mission.ref} className={`text-center mb-12 transition-all duration-700 ${mission.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="text-primary uppercase tracking-[0.2em] text-sm mb-2">{ABOUT_COPY.valuesEyebrow}</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">{ABOUT_COPY.valuesTitle}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ABOUT_VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="glass-card-hover p-8 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <DynamicIcon name={icon || "heart"} size={24} className="text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
