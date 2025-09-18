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

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      const nextButton = document.querySelector('[aria-label="Next slide"]') as HTMLButtonElement;
      if (nextButton) {
        nextButton.click();
      }
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
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
      title: t('vehicleStockManagement'),
      description: t('vehicleStockDesc')
    },
    {
      icon: <Shield className="h-8 w-8 text-white" />,
      title: t('documentVerificationFeature'),
      description: t('documentVerificationDesc')
    },
    {
      icon: <Users className="h-8 w-8 text-white" />,
      title: t('farmersServedFeature'),
      description: t('farmersServedDesc')
    },
    {
      icon: <FileText className="h-8 w-8 text-white" />,
      title: t('agreementGeneration'),
      description: t('agreementGenerationDesc')
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-white" />,
      title: t('analyticsReports'),
      description: t('analyticsReportsDesc')
    },
    {
      icon: <Award className="h-8 w-8 text-white" />,
      title: t('minValueFeature'),
      description: t('minValueDesc')
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

          {/* Leadership Team Carousel - Auto-scrolling */}
          <div className="max-w-6xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">{t('leadershipTeam')}</h2>
            <Carousel 
              className="w-full"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {leadership.length > 0 ? (
                  leadership.map((leader) => (
                    <CarouselItem key={leader.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                      <Card className="overflow-hidden hover-lift shadow-2xl h-full">
                        <div className="h-64 relative overflow-hidden group">
                          {leader.photo_url ? (
                            <img
                              src={leader.photo_url}
                              alt={`${leader.name} - ${leader.designation}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                              <Users className="h-24 w-24 text-white/50" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-xl mb-1 text-white">
                            {leader.name}
                          </h3>
                          <p className="text-yellow-300 font-semibold">{leader.designation}</p>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))
                ) : (
                  // Placeholder cards while loading
                  [...Array(4)].map((_, index) => (
                    <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                      <Card className="overflow-hidden shadow-2xl h-full">
                        <div className="h-64 bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                          <Users className="h-24 w-24 text-white/50" />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-xl mb-1 text-white">Loading...</h3>
                          <p className="text-yellow-300 font-semibold">Management Team</p>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))
                )}
              </CarouselContent>
              <CarouselPrevious className="bg-white/90 hover:bg-white -left-12" />
              <CarouselNext className="bg-white/90 hover:bg-white -right-12" />
            </Carousel>
          </div>

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

      {/* Key Information Carousel */}
      <section className="py-12 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index}>
                  <Card className={`${slide.bgColor} text-white border-0`}>
                    <CardContent className="p-12 text-center">
                      <h3 className="text-3xl font-bold mb-4">{slide.title}</h3>
                      <p className="text-xl mb-2">{slide.subtitle}</p>
                      <p className="text-lg opacity-90">{slide.description}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white/90 hover:bg-white" />
            <CarouselNext className="bg-white/90 hover:bg-white" />
          </Carousel>
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

          {/* Contact Numbers - Customer Service */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 max-w-2xl mx-auto border-2 border-yellow-400">
            <h3 className="text-center text-xl font-bold text-gray-800 mb-4">{t('contactForService')}</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="tel:9448147073" 
                className="flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-purple-200 hover:border-purple-400"
              >
                <Phone className="h-6 w-6 text-purple-600 animate-pulse" />
                <div className="text-left">
                  <p className="text-xs text-gray-600">{t('clickToCall')}</p>
                  <p className="font-bold text-lg text-gray-800">9448147073</p>
                </div>
              </a>
              <a 
                href="tel:8496971246" 
                className="flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-blue-200 hover:border-blue-400"
              >
                <Phone className="h-6 w-6 text-blue-600 animate-pulse" />
                <div className="text-left">
                  <p className="text-xs text-gray-600">{t('clickToCall')}</p>
                  <p className="font-bold text-lg text-gray-800">8496971246</p>
                </div>
              </a>
            </div>
          </div>
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
              <div className="text-white/90">{t('verifiedDocuments')}</div>
            </div>
            <div className="transform hover:scale-110 transition-transform">
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-white/90">{t('systemAccess')}</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;