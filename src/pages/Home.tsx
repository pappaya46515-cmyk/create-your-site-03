import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LatestVehicles from "@/components/LatestVehicles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tractor, Shield, Users, Award, TrendingUp, Headphones, ArrowRight, BarChart3, FileText, Upload, Sparkles, Star, CheckCircle, MapPin, Calendar, IndianRupee, Phone, User, Factory, Trophy, Target, Eye, Heart, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import omGaneshLogo from "@/assets/om-ganesh-official-logo.jpg";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [leadership, setLeadership] = useState<Array<{ id: string; name: string; designation: string; description: string | null; photo_url: string | null }>>([]);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadLeadership = async () => {
      const { data } = await supabase
        .from('leadership_team')
        .select('*')
        .order('order_index');
      if (data) setLeadership(data as any);
    };
    loadLeadership();
  }, []);

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
      
      {/* Hero Section with Management Team Photos */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 opacity-20">
            {[...Array(10)].map((_, i) => (
              <Tractor 
                key={i} 
                className="absolute text-white animate-float"
                style={{
                  width: '40px',
                  height: '40px',
                  left: `${(i % 5) * 25}%`,
                  top: `${Math.floor(i / 5) * 50}%`,
                  transform: `rotate(${i * 15}deg)`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Company Header with Logo */}
          <div className="text-center mb-12">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 inline-block mb-8 shadow-2xl hover-lift">
              <img 
                src={omGaneshLogo} 
                alt="Om Ganesh Tractors" 
                className="h-36 w-auto mx-auto object-contain"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              OM GANESH TRACTORS
            </h1>
            <div className="text-3xl md:text-4xl font-bold text-white/90 mb-6">
              MASSEY FERGUSON
            </div>
            <p className="text-2xl text-white/90 mb-4">
              38 Years of Excellence in Agricultural Equipment & Services
            </p>
            <div className="inline-block relative">
              <h2 className="text-4xl md:text-5xl font-bold text-yellow-300 animate-pulse">
                {language === 'en' ? 'KAMTHA' : 'ಕಂಠ'}
              </h2>
              <p className="text-xl text-white/90 mt-2">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Leadership Team Carousel */}
          {leadership.length > 0 && (
            <div className="max-w-6xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-white text-center mb-8">Our Leadership Team</h2>
              <Carousel className="w-full">
                <CarouselContent>
                  {leadership.map((leader) => (
                    <CarouselItem key={leader.id} className="md:basis-1/2">
                      <div className="p-4">
                        <Card className="overflow-hidden hover-lift shadow-2xl">
                          <div className="h-72 relative overflow-hidden group">
                            {leader.photo_url ? (
                              <img
                                src={leader.photo_url}
                                alt={`${leader.name} - ${leader.designation}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                <Users className="h-32 w-32 text-muted-foreground/30" />
                              </div>
                            )}
                          </div>
                          <CardContent className="p-6">
                            <h3 className="font-bold text-2xl mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                              {leader.name}
                            </h3>
                            <p className="text-primary font-semibold text-lg">{leader.designation}</p>
                            {leader.description && (
                              <p className="text-muted-foreground mt-2">{leader.description}</p>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="bg-white/90 hover:bg-white" />
                <CarouselNext className="bg-white/90 hover:bg-white" />
              </Carousel>
            </div>
          )}

          {/* Key Stats */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="glass backdrop-blur-xl px-8 py-4 rounded-xl border border-white/30 hover-lift">
              <p className="text-white font-bold text-lg">Since 1988</p>
            </div>
            <div className="glass backdrop-blur-xl px-8 py-4 rounded-xl border border-white/30 hover-lift">
              <p className="text-white font-bold text-lg">5 Districts</p>
            </div>
            <div className="glass backdrop-blur-xl px-8 py-4 rounded-xl border border-white/30 hover-lift">
              <p className="text-white font-bold text-lg">11,000+ Farmers Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Options - Buy and Sell */}
      <section className="py-12">
        <div className="container mx-auto px-4">
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

      {/* About Us Section */}
      <section className="py-16 bg-gradient-to-r from-muted/50 via-background to-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            About Om Ganesh Group
          </h2>

          {/* Mission Vision Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-8 w-8 text-primary" />
                  <h3 className="font-bold text-xl">Our Mission</h3>
                </div>
                <p className="text-muted-foreground">
                  To provide comprehensive agricultural equipment and services that empower farmers 
                  and contribute to agricultural prosperity across Karnataka.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="h-8 w-8 text-primary" />
                  <h3 className="font-bold text-xl">Our Vision</h3>
                </div>
                <p className="text-muted-foreground">
                  To be the most trusted partner for farmers in Karnataka, driving agricultural 
                  innovation and sustainable farming practices.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                  <h3 className="font-bold text-xl">Our Values</h3>
                </div>
                <p className="text-muted-foreground">
                  Integrity, Quality, Innovation, Customer Focus, and Sustainable Growth 
                  form the foundation of our business operations.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Group Companies */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-center mb-8">Our Group Companies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <Factory className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Om Ganesh Agro Products</h4>
                    <p className="text-sm text-muted-foreground">
                      Manufacturing Trailers, Trollies and Agri equipment since 1988
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <Tractor className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Shimoga Tractors & Implements (P) Ltd</h4>
                    <p className="text-sm text-muted-foreground">
                      Manufacturing Power Tillers & Power Trolley since 1988
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <Users className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Om Ganesh Motors</h4>
                    <p className="text-sm text-muted-foreground">
                      Authorized Yamaha 2-wheeler dealers since 2008
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <Factory className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Om Ganesh Agro Spares</h4>
                    <p className="text-sm text-muted-foreground">
                      Authorized TAFE spare parts dealers since 1998
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Awards Section */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-center mb-8">Awards & Recognition</h3>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-8 border-2 border-yellow-200 dark:border-yellow-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Best Customer Relation Award - Govt of Karnataka (2005-06)",
                  "Excellence in Manufacturing - Chamber of Commerce, Shimoga (2010-11)",
                  "SMERA Ranking - Canara Bank (2010-11)",
                  "Star Dealer Award from TAFE",
                  "12 Achievement Awards from TAFE (2000-2013)",
                  "Best Exchange Sales Award from TAFE",
                  "Best Upcoming Dealer from Yamaha (2010-11)"
                ].map((award, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">{award}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Network */}
          <Card className="overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 flex items-center justify-center relative">
              <MapPin className="h-32 w-32 text-primary opacity-20 absolute" />
              <div className="relative z-10 text-center">
                <p className="text-2xl font-bold text-primary">6 Branches</p>
                <p className="text-lg text-muted-foreground">Across Karnataka</p>
              </div>
            </div>
            <CardContent className="p-8">
              <p className="text-lg text-muted-foreground mb-4">
                With our headquarters in Shimoga on Shankar Mutt Road, we have expanded our presence 
                across Karnataka with branches in:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
                {["Shikaripura", "Chanagiri", "Honnali", "Anvati", "Udupi", "Sagar"].map((location) => (
                  <div key={location} className="bg-primary/5 rounded-lg p-3 text-center border border-primary/20">
                    <MapPin className="h-4 w-4 text-primary mx-auto mb-1" />
                    <p className="font-semibold text-foreground">{location}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Latest Vehicles from Sellers */}
      <LatestVehicles />

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