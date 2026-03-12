import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
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
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                      <MapPin size={18} className="fill-current" />
                    </div>
                    <div>
                      <p className="font-display text-base font-semibold text-foreground">Dreams Furniture</p>
                      <p className="text-sm text-muted-foreground">Muzaffarpur showroom location</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Open the highlighted location in Google Maps.
                  </p>
                </div>
                <ArrowUpRight size={18} className="text-primary transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </a>
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
