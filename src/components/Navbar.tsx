import { Button } from "@/components/ui/button";
import { Menu, Phone, Globe2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import omGaneshLogo from "@/assets/om-ganesh-official-logo.jpg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "kn">("en");

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "kn" : "en");
  };

  const navItems = {
    en: ["Home", "Login"],
    kn: ["ಮುಖಪುಟ", "ಲಾಗಿನ್"]
  };

  const paths = ["/", "/auth"];

  return (
    <nav className="sticky top-0 z-50 bg-card shadow-medium border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={omGaneshLogo} 
              alt="Om Ganesh" 
              className="h-12 w-auto object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-primary">Kamtha Stock System</h1>
              <p className="text-xs text-muted-foreground">ESTD-1988</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems[language].map((item, index) => (
              <Link
                key={item}
                to={paths[index]}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-2"
            >
              <Globe2 className="h-4 w-4" />
              {language === "en" ? "ಕನ್ನಡ" : "English"}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">1800-XXX-XXXX</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {navItems[language].map((item, index) => (
                <Link
                  key={item}
                  to={paths[index]}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="justify-start"
              >
                <Globe2 className="h-4 w-4 mr-2" />
                {language === "en" ? "ಕನ್ನಡ" : "English"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;