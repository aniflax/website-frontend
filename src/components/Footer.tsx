import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/Dreams logo.png";

const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/RQfb4XZZevJR1qqC8";

const Footer = () => {
  return (
    <footer className="glass-footer">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logo} alt="Dreams Furniture" className="h-24 w-auto" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Crafting dreams into reality with premium furniture that transforms your living spaces into luxurious havens.
            </p>
            <div className="flex gap-3 pt-2">
              {[
              { icon: Facebook, url: "https://www.facebook.com/DREAMSFURNITUREMUZAFFARPUR" },
              { icon: Instagram, url: "https://www.instagram.com/dreamsfurnituremuzaffarpur" },
              { icon: Youtube, url: "https://www.youtube.com/@dreamsfurnituremuzaffarpur" }].
              map(({ icon: Icon, url }) =>
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 bg-primary-foreground">
                
                  <Icon size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-foreground">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
              { to: "/", label: "Home" },
              { to: "/products", label: "Products" },
              { to: "/about", label: "About Us" },
              { to: "/gallery", label: "Gallery" },
              { to: "/contact", label: "Contact" }].
              map((link) =>
              <Link key={link.to} to={link.to} className="text-muted-foreground hover:text-primary text-sm transition-colors duration-300">
                  {link.label}
                </Link>
              )}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-foreground">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                <span>Dreams Furniture, Muzaffarpur, Bihar, India</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone size={16} className="text-primary shrink-0" />
                <span>+91 9801980316</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail size={16} className="text-primary shrink-0" />
                <span>muzaffarpurdreams@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Map */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-foreground">Find Us</h4>
            <div className="rounded-xl overflow-hidden border border-border h-40 bg-secondary/30 relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.85),transparent_28%),linear-gradient(135deg,rgba(232,236,240,0.95),rgba(244,246,248,0.9))]" />
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.2) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
              <div className="absolute left-[22%] top-[28%] h-10 w-16 rounded-full bg-background/90 shadow-sm" />
              <div className="absolute right-[18%] bottom-[22%] h-12 w-20 rounded-full bg-background/80 shadow-sm" />
              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-background/95 px-3 py-2 shadow-lg border border-primary/20">
                <MapPin size={16} className="text-primary fill-current shrink-0" />
                <span className="text-xs font-medium text-foreground">Dreams Furniture</span>
              </div>
            </div>
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-sm text-primary hover:text-primary/80 transition-colors">
              View Dreams Furniture on Google Maps
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} <span className="text-primary font-semibold">Dreams Furniture</span>. All rights reserved.
        </div>
      </div>
    </footer>);

};

export default Footer;
