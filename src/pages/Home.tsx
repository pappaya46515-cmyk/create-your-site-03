import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tractor, Shield, Users, Award, TrendingUp, Headphones, ArrowRight, BarChart3, FileText, Upload, Sparkles, Star, CheckCircle, MapPin, Calendar, IndianRupee, Phone, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Fetch available vehicles
    fetchVehicles();

    return () => subscription.unsubscribe();
  }, []);

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast({
        title: "Error",
        description: "Failed to load vehicles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBuyClick = async (vehicleId: string) => {
    if (!user) {
      // If not logged in, redirect to buyer registration
      navigate('/register/buyer');
      return;
    }

    // Check if user has buyer role
    const { data: roles, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to check user role",
        variant: "destructive"
      });
      return;
    }

    const hasBuyerRole = roles?.some(r => r.role === 'buyer');

    if (hasBuyerRole) {
      // If user is a buyer, navigate to buyer portal with vehicle details
      navigate(`/portal/buyer/browse?vehicle=${vehicleId}`);
    } else {
      // If user doesn't have buyer role, add it and then navigate
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: 'buyer' });

      if (roleError) {
        toast({
          title: "Error",
          description: "Failed to add buyer role",
          variant: "destructive"
        });
        return;
      }

      navigate(`/portal/buyer/browse?vehicle=${vehicleId}`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const slides = [
    {
      title: t('farmersServed'),
      subtitle: t('trustedPlatform'),
      description: t('connectingBuyersSellers'),
      bgColor: "bg-gradient-to-r from-purple-600 to-blue-600"
    },
    {
      title: t('documentVerification'),
      subtitle: t('documentTypes'),
      description: t('documentsVerified'),
      bgColor: "bg-gradient-to-r from-blue-600 to-teal-600"
    },
    {
      title: t('minDealValue'),
      subtitle: t('qualityAssured'),
      description: t('premiumEquipment'),
      bgColor: "bg-gradient-to-r from-teal-600 to-purple-600"
    },
    {
      title: t('stockManagement'),
      subtitle: t('digitalPlatform'),
      description: t('trackInventory'),
      bgColor: "bg-gradient-to-r from-purple-600 to-pink-600"
    }
  ];

  const features = [
    {
      icon: <Tractor className="h-8 w-8 text-white" />,
      title: "Vehicle Stock Management",
      description: "Complete digital platform for managing tractors and commercial vehicles"
    },
    {
      icon: <Shield className="h-8 w-8 text-white" />,
      title: "Document Verification",
      description: "RC, Insurance, Forms 29/30, NOC - all documents verified and stored"
    },
    {
      icon: <Users className="h-8 w-8 text-white" />,
      title: "11,000+ Farmers Served",
      description: "Trusted platform connecting buyers and sellers across Karnataka"
    },
    {
      icon: <FileText className="h-8 w-8 text-white" />,
      title: "Agreement Generation",
      description: "Automated PDF agreements with complete documentation"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-white" />,
      title: "Analytics & Reports",
      description: "Track stock movement, buyer interests, and market trends"
    },
    {
      icon: <Award className="h-8 w-8 text-white" />,
      title: "Minimum ₹2.5L Value",
      description: "Quality assured with minimum deal value enforcement"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50">
      <Navbar />
      
      {/* Hero Section with App Name */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-teal-600/10" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* App Name Header */}
          <div className="text-center mb-8">
            <div className="inline-block relative">
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent animate-pulse">
                {language === 'en' ? 'KAMTHA' : 'ಕಂಠ'}
              </h1>
              <div className="absolute -top-4 -right-4">
                <Sparkles className="h-8 w-8 text-yellow-400 animate-spin" />
              </div>
              <div className="absolute -bottom-4 -left-4">
                <Star className="h-8 w-8 text-yellow-400 animate-bounce" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-purple-600 mt-4">
              {language === 'en' ? 'Serving farmers across Karnataka' : 'ಕರ್ನಾಟಕದಾದ್ಯಂತ ರೈತರಿಗೆ ಸೇವೆ'}
            </p>
            <p className="text-lg text-gray-600 mt-2">
              {t('tagline')}
            </p>
          </div>

          {/* Carousel/Slideshow */}
          <div className="max-w-6xl mx-auto mb-12">
            <Carousel className="w-full">
              <CarouselContent>
                {slides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <div className={`${slide.bgColor} rounded-2xl p-12 text-white shadow-2xl`}>
                      <div className="text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h2>
                        <h3 className="text-2xl md:text-3xl mb-4 text-white/90">{slide.subtitle}</h3>
                        <p className="text-xl text-white/80">{slide.description}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="bg-white/90 hover:bg-white" />
              <CarouselNext className="bg-white/90 hover:bg-white" />
            </Carousel>
          </div>

          {/* Service Options - Buy and Sell */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {/* Buy Pre-owned Section */}
            <Card className="border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mr-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{t('buyPreowned')}</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  {t('buyDescription')}
                </p>
                <Button 
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  onClick={() => navigate("/register/buyer")}
                >
                  {t('startBuying')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            {/* Sell Pre-owned Section */}
            <Card className="border-2 border-teal-200 hover:border-teal-400 transition-all duration-300 hover:shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-teal-600 to-purple-600 rounded-full mr-4">
                    <Tractor className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{t('sellPreowned')}</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  {t('sellDescription')}
                </p>
                <Button 
                  size="lg"
                  className="w-full bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 text-white"
                  onClick={() => navigate("/register/seller")}
                >
                  {t('listEquipment')} <Upload className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Numbers */}
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg">
              <Headphones className="h-6 w-6 text-purple-600" />
              <a href="tel:9448147073" className="font-bold text-lg text-gray-800 hover:text-purple-600 transition-colors">
                9448147073
              </a>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg">
              <Headphones className="h-6 w-6 text-blue-600" />
              <a href="tel:8496971246" className="font-bold text-lg text-gray-800 hover:text-blue-600 transition-colors">
                8496971246
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Available Vehicles Section */}
      <section className="py-16 bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Available Equipment for Sale
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our collection of verified pre-owned agricultural equipment and commercial vehicles
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">Loading vehicles...</p>
            </div>
          ) : vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id} className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-300">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl font-bold text-gray-800">
                        {vehicle.model_name}
                      </CardTitle>
                      <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                        {vehicle.category}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatPrice(vehicle.deal_value)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      {vehicle.model_year && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Year: {vehicle.model_year}</span>
                        </div>
                      )}
                      {vehicle.stock_type && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Tractor className="h-4 w-4" />
                          <span>Type: {vehicle.stock_type}</span>
                        </div>
                      )}
                      {vehicle.ownership_type && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="h-4 w-4" />
                          <span>Ownership: {vehicle.ownership_type}</span>
                        </div>
                      )}
                      {vehicle.property_owner && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>Property: {vehicle.property_owner}</span>
                        </div>
                      )}
                      {vehicle.registration_number && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FileText className="h-4 w-4" />
                          <span>Reg: {vehicle.registration_number}</span>
                        </div>
                      )}
                    </div>

                    {/* Document Status */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {vehicle.has_original_rc && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Original RC
                        </Badge>
                      )}
                      {vehicle.has_insurance && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Insurance
                        </Badge>
                      )}
                      {vehicle.has_noc && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          NOC
                        </Badge>
                      )}
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      onClick={() => handleBuyClick(vehicle.id)}
                    >
                      <IndianRupee className="h-4 w-4 mr-2" />
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Tractor className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">No vehicles available at the moment</p>
              <p className="text-gray-400 mt-2">Check back soon for new listings!</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Complete Stock Management Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Digital solution for vehicle stock management with document verification, agreement generation, and analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-gray-800">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="transform hover:scale-110 transition-transform">
              <div className="text-5xl font-bold mb-2 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 mr-2" />
                11,000+
              </div>
              <div className="text-white/90">Farmers Served</div>
            </div>
            <div className="transform hover:scale-110 transition-transform">
              <div className="text-5xl font-bold mb-2">₹2.5L+</div>
              <div className="text-white/90">Min Deal Value</div>
            </div>
            <div className="transform hover:scale-110 transition-transform">
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-white/90">Verified Documents</div>
            </div>
            <div className="transform hover:scale-110 transition-transform">
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-white/90">System Access</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;