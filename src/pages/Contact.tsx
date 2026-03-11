import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Send } from "lucide-react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchStrapi, mapContactPage } from "@/lib/strapi";
import { Skeleton } from "@/components/ui/skeleton";
import ContentLoadError from "@/components/ContentLoadError";

// Provide a safe icon renderer
const DynamicIcon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const IconComponent = (Icons as any)[name.charAt(0).toUpperCase() + name.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())] || Icons.HelpCircle;
  return <IconComponent {...props} />;
};

const Contact = () => {
  const header = useScrollAnimation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["contact-page"],
    queryFn: async () => {
      const response = await fetchStrapi("contact-page", { populate: ["contactInfo"] });
      return mapContactPage(response);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! We'll get back to you shortly.");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Skeleton className="w-full h-full" /></div>;
  }

  if (isError) {
    return (
      <div className="min-h-screen pt-24">
        <div className="container mx-auto px-4">
          <ContentLoadError message="Contact page content could not be loaded." />
        </div>
      </div>
    );
  }

  const { title, subtitle, contactInfo } = data || {};

  return (
    <div className="min-h-screen pt-24">
      <section className="section-padding">
        <div className="container mx-auto">
          <div
            ref={header.ref}
            className={`text-center mb-16 transition-all duration-700 ${header.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <p className="text-primary uppercase tracking-[0.2em] text-sm mb-2">{subtitle || "Get In Touch"}</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold">{title || "Contact Us"}</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="glass-card p-8 md:p-10">
              <h2 className="font-display text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  { key: "name", label: "Full Name", type: "text" },
                  { key: "email", label: "Email Address", type: "email" },
                  { key: "phone", label: "Phone Number", type: "tel" },
                ].map(({ key, label, type }) => (
                  <div key={key}>
                    <label className="text-sm text-muted-foreground mb-1 block">{label}</label>
                    <input
                      type={type}
                      required
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder={label}
                    />
                  </div>
                ))}
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    placeholder="Tell us what you're looking for..."
                  />
                </div>
                <button type="submit" className="btn-primary-glass w-full flex items-center justify-center gap-2">
                  <Send size={18} /> Send Message
                </button>
              </form>
            </div>

            {/* Info */}
            <div className="space-y-6">
              {contactInfo?.map(({ icon, title, detail }: any) => (
                <div key={title} className="glass-card-hover p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <DynamicIcon name={icon || "map-pin"} size={22} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold mb-1">{title}</h3>
                    <p className="text-muted-foreground text-sm">{detail}</p>
                  </div>
                </div>
              ))}

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-border h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3588.123456789!2d85.39!3d26.12!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDA3JzEyLjAiTiA4NcKwMjMnMjQuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Dreams Furniture Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
