import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/main logo.png";

const Footer = () => {
  return (
    <footer className="glass-footer">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logo} alt="Dreams Furniture" className="h-20 w-auto" />
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
            <div className="rounded-xl overflow-hidden border border-border h-40">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3588.123456789!2d85.39!3d26.12!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDA3JzEyLjAiTiA4NcKwMjMnMjQuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dreams Furniture Location" />
              
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} <span className="text-primary font-semibold">Dreams Furniture</span>. All rights reserved.
        </div>
      </div>
    </footer>);

};

export default Footer;
