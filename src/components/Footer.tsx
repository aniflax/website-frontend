import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/Dreams logo.png";

const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Dreams+Furniture+-Branded+Furniture+Showroom+in+muzaffarpur+%7C+Best+Furniture+Shop+in+muzaffarpur/@26.119157,85.3947706,17.89z/data=!3m1!5s0x39ed10f88339f585:0x9c4ffdbc5317bc2!4m6!3m5!1s0x39ed11dc964fe957:0x4074c99300c9628!8m2!3d26.1180634!4d85.3960641!16s%2Fg%2F11jb8lt1zn?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D";
const DEVELOPER_URL = "https://aniflax.github.io/net";

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
            <div className="developer-glass-card">
              <p className="developer-glass-label">DEVELOPER:</p>
              <a
                href={DEVELOPER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="developer-liquid-link"
                aria-label="Visit developer portfolio"
              >
                <span className="developer-liquid-shine" aria-hidden="true" />
                <span className="developer-liquid-text">𝐀𝐧𝐢𝐟𝐥𝐚𝐱 ツ</span>
              </a>
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
              { to: "/bulk-order", label: "Bulk Order" },
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
            <div className="relative rounded-xl overflow-hidden border border-border h-40">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3588.123456789!2d85.39!3d26.12!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDA3JzEyLjAiTiA4NcKwMjMnMjQuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, pointerEvents: "none" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dreams Furniture Location"
              />
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Dreams Furniture location in Google Maps"
                className="absolute inset-0"
              >
                <span className="absolute bottom-3 right-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
                  Open exact store location
                </span>
              </a>
            </div>
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-sm text-primary hover:text-primary/80 transition-colors">
              Open in Google Maps
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
