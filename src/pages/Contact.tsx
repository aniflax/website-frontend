import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Send, MapPin, ExternalLink } from "lucide-react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { CONTACT_PAGE_DATA } from "@/data/contact";

const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Dreams+Furniture+-Branded+Furniture+Showroom+in+muzaffarpur+%7C+Best+Furniture+Shop+in+muzaffarpur/@26.119157,85.3947706,17.89z/data=!3m1!5s0x39ed10f88339f585:0x9c4ffdbc5317bc2!4m6!3m5!1s0x39ed11dc964fe957:0x4074c99300c9628!8m2!3d26.1180634!4d85.3960641!16s%2Fg%2F11jb8lt1zn?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D";

// Provide a safe icon renderer
const DynamicIcon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const IconComponent = (Icons as any)[name.charAt(0).toUpperCase() + name.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())] || Icons.HelpCircle;
  return <IconComponent {...props} />;
};

const Contact = () => {
  const header = useScrollAnimation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! We'll get back to you shortly.");
    setForm({ name: "", email: "", phone: "", message: "" });
  };
  const { title, subtitle, contactInfo } = CONTACT_PAGE_DATA;

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
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card-hover flex h-64 flex-col justify-between rounded-2xl p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-3xl font-bold text-foreground">Visit Our Showroom</p>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                      Open the exact Dreams Furniture location in Google Maps for directions and navigation.
                    </p>
                  </div>
                  <MapPin size={24} className="text-primary shrink-0" />
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                  Preview location <ExternalLink size={16} />
                </span>
              </a>
              <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex text-sm text-primary hover:text-primary/80 transition-colors">
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
