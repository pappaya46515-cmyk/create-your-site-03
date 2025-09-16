import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import omGaneshLogo from "@/assets/om-ganesh-official-logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={omGaneshLogo} 
                alt="Om Ganesh" 
                className="h-12 w-auto object-contain"
              />
              <div>
                <h3 className="text-lg font-bold">Kamtha Trailer</h3>
                <p className="text-sm opacity-80">ESTD-1988</p>
              </div>
            </div>
            <p className="text-sm opacity-80 mb-4">
              Empowering farmers with quality agricultural equipment and transparent services since 1988.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="p-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="opacity-80 hover:opacity-100 transition-opacity">About Us</Link></li>
              <li><Link to="/services" className="opacity-80 hover:opacity-100 transition-opacity">Our Services</Link></li>
              <li><Link to="/buy" className="opacity-80 hover:opacity-100 transition-opacity">Buy Pre-owned</Link></li>
              <li><Link to="/sell" className="opacity-80 hover:opacity-100 transition-opacity">Sell Pre-owned</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li className="opacity-80">Pre-owned Tractor Sales</li>
              <li className="opacity-80">Equipment Verification</li>
              <li className="opacity-80">Customer Support</li>
              <li className="opacity-80">Farmer Assistance</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="opacity-80">Karnataka, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="opacity-80">1800-XXX-XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="opacity-80">info@kamtha.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/20 text-center text-sm opacity-80">
          <p>&copy; 2024 Kamtha Trailers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;