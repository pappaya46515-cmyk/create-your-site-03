import { Button } from "@/components/ui/button";
import { Menu, Phone, Globe2, Building2, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import omGaneshLogo from "@/assets/om-ganesh-official-logo.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "kn" : "en");
  };

  const navItems = [
    t("home"),
    t("aboutUs"),
    t("services")
  ];

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
    <nav className="sticky top-0 z-50 glass-dark backdrop-blur-xl border-b border-white/10 animate-slide-up">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section - Enhanced */}
          <Link to="/" className="flex items-center space-x-3 group hover-lift">
            <div className="relative">
              <img 
                src={omGaneshLogo} 
                alt="Om Ganesh" 
                className="h-14 w-auto object-contain rounded-lg shadow-lg group-hover:shadow-glow transition-all"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Kamta
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation - Enhanced */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <Link
                key={item}
                to={paths[index]}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-all duration-300 relative group"
              >
                <span className="relative z-10">{item}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Right Section - Enhanced */}
          <div className="flex items-center space-x-3">
            {/* Language Toggle - Always Visible with Enhanced Design */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="relative flex items-center gap-2 hover-glow bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20"
            >
              <Globe2 className="h-4 w-4" />
              <span className="font-bold text-sm">
                {language === "en" ? "ಕನ್ನಡ" : "English"}
              </span>
              <span className="absolute -top-1 -right-1 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-gradient-to-r from-primary to-secondary items-center justify-center text-[9px] text-white font-bold">
                  {language.toUpperCase()}
                </span>
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover-glow"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">9480833792</span>
            </Button>

            {/* Auth Controls */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground max-w-[160px] truncate" title={user.email}>
                  {user.email}
                </span>
                
                {/* Portal Switcher Dropdown - Admin Only */}
                {userRoles.includes('admin') && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Building2 className="h-4 w-4 mr-2" />
                        Switch Portal
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        Admin Portal
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/buyer-portal')}>
                        Buyer Portal
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/seller-portal')}>
                        Seller Portal
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  {t('logout')}
                </Button>
              </div>
            ) : (
              <Link to="/auth" className="hidden md:block">
                <Button size="sm">{t('login')}</Button>
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
              {navItems.map((item, index) => (
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
                  
                  {/* Portal Switcher for Mobile - Admin Only */}
                  {userRoles.includes('admin') && (
                    <div className="px-4 py-2">
                      <p className="text-xs text-muted-foreground mb-2">Switch Portal</p>
                      <div className="space-y-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => { navigate('/admin'); setIsMenuOpen(false); }}
                        >
                          Admin Portal
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => { navigate('/buyer-portal'); setIsMenuOpen(false); }}
                        >
                          Buyer Portal
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => { navigate('/seller-portal'); setIsMenuOpen(false); }}
                        >
                          Seller Portal
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/auth"
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('login')}
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