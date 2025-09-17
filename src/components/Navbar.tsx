import { Button } from "@/components/ui/button";
import { Menu, Phone, Globe2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import omGaneshLogo from "@/assets/om-ganesh-official-logo.jpg";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "kn">("en");
  const [user, setUser] = useState<any>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "kn" : "en");
  };

  const navItems = {
    en: ["Home", "About Us", "Services"],
    kn: ["ಮುಖಪುಟ", "ನಮ್ಮ ಬಗ್ಗೆ", "ಸೇವೆಗಳು"]
  };

  const paths = ["/", "/about", "/services"];

  useEffect(() => {
    // Initialize auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRoles(session.user.id);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRoles(session.user.id);
      } else {
        setUserRoles([]);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRoles = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    
    if (!error && data) {
      setUserRoles(data.map(r => r.role));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRoles([]);
    navigate("/");
  };

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

            {/* Auth Controls */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground max-w-[160px] truncate" title={user.email}>
                  {user.email}
                </span>
                {userRoles.includes('admin') && (
                  <Button variant="outline" size="sm" onClick={() => navigate('/portal-select')}>
                    Portal
                  </Button>
                )}
                {userRoles.includes('seller') && !userRoles.includes('admin') && (
                  <Button variant="outline" size="sm" onClick={() => navigate('/seller-portal')}>
                    Seller Portal
                  </Button>
                )}
                {userRoles.includes('buyer') && !userRoles.includes('admin') && !userRoles.includes('seller') && (
                  <Button variant="outline" size="sm" onClick={() => navigate('/buyer-portal')}>
                    Buyer Portal
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/auth" className="hidden md:block">
                <Button size="sm">Login</Button>
              </Link>
            )}

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

              {user ? (
                <>
                  <div className="px-4 py-2 text-sm text-muted-foreground truncate" title={user.email}>
                    {user.email}
                  </div>
                  {userRoles.includes('admin') && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start mx-4"
                      onClick={() => { navigate('/portal-select'); setIsMenuOpen(false); }}
                    >
                      Portal
                    </Button>
                  )}
                  {userRoles.includes('seller') && !userRoles.includes('admin') && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start mx-4"
                      onClick={() => { navigate('/seller-portal'); setIsMenuOpen(false); }}
                    >
                      Seller Portal
                    </Button>
                  )}
                  {userRoles.includes('buyer') && !userRoles.includes('admin') && !userRoles.includes('seller') && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start mx-4"
                      onClick={() => { navigate('/buyer-portal'); setIsMenuOpen(false); }}
                    >
                      Buyer Portal
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start mx-4"
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;