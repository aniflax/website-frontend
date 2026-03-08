import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/919801980316?text=Hi%20Dreams%20Furniture%2C%20I%20am%20interested%20in%20your%20products"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[hsl(142,70%,45%)] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 animate-float"
    aria-label="WhatsApp Inquiry"
  >
    <MessageCircle size={28} className="text-[hsl(0,0%,100%)]" />
  </a>
);

export default WhatsAppButton;
