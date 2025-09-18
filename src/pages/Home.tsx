import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LatestVehicles from "@/components/LatestVehicles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tractor, Shield, Users, Award, TrendingUp, Headphones, ArrowRight, BarChart3, FileText, Upload, Sparkles, Star, CheckCircle, MapPin, Calendar, IndianRupee, Phone, User, Factory, Trophy, Target, Eye, Heart, Building2, Wrench, PhoneCall } from "lucide-react";
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

      {/* Service Options - Buy, Sell and Contact for Service */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Buy Pre-Owned */}
            <Card className="group hover:shadow-2xl transition-all cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-8 text-center">
                <Tractor className="w-16 h-16 mx-auto mb-4 text-green-600 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-3 text-gray-800">
                  {language === 'kn' ? 'ಪೂರ್ವ ಮಾಲೀಕತ್ವದ ಖರೀದಿ' : 'Buy Pre-Owned Equipment'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === 'kn' ? 'ಗುಣಮಟ್ಟದ ಪರೀಕ್ಷಿತ ಉಪಕರಣಗಳು' : 'Quality tested equipment'}
                </p>
                <Link to="/register/buyer">
                  <Button className="bg-green-600 hover:bg-green-700">
                    {language === 'kn' ? 'ಈಗ ಬ್ರೌಸ್ ಮಾಡಿ' : 'Browse Now'}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Sell Your Equipment */}
            <Card className="group hover:shadow-2xl transition-all cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-8 text-center">
                <Wrench className="w-16 h-16 mx-auto mb-4 text-blue-600 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-3 text-gray-800">
                  {language === 'kn' ? 'ನಿಮ್ಮ ಪೂರ್ವ ಮಾಲೀಕತ್ವ ಮಾರಾಟ' : 'Sell Your Pre-Owned'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === 'kn' ? 'ಉತ್ತಮ ಮೌಲ್ಯ ಪಡೆಯಿರಿ' : 'Get the best value'}
                </p>
                <Link to="/register/seller">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    {language === 'kn' ? 'ಈಗ ಮಾರಾಟ ಮಾಡಿ' : 'Sell Now'}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Contact Service */}
            <Card className="group hover:shadow-2xl transition-all cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-8 text-center">
                <PhoneCall className="w-16 h-16 mx-auto mb-4 text-orange-600 group-hover:scale-110 transition-transform animate-pulse" />
                <h3 className="text-2xl font-bold mb-3 text-gray-800">
                  {language === 'kn' ? 'ಸೇವೆಗಾಗಿ ಸಂಪರ್ಕಿಸಿ' : 'Contact for Service'}
                </h3>
                <div className="space-y-3">
                  <a href="tel:+919448147073" className="flex items-center justify-center gap-2 text-orange-600 hover:text-orange-700 font-semibold">
                    <Phone className="w-5 h-5" />
                    <span>9448147073</span>
                  </a>
                  <a href="tel:+918496971246" className="flex items-center justify-center gap-2 text-orange-600 hover:text-orange-700 font-semibold">
                    <Phone className="w-5 h-5" />
                    <span>8496971246</span>
                  </a>
                </div>
              </CardContent>
            </Card>
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

      {/* Company Overview */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {language === 'kn' ? 'ಕಂಪನಿ ಮಾಹಿತಿ' : 'About Om Ganesh Tractors'}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* History */}
            <Card className="backdrop-blur-sm bg-white/90 shadow-xl hover:shadow-2xl transition-all">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4 text-orange-600">
                  {language === 'kn' ? 'ನಮ್ಮ ಇತಿಹಾಸ' : 'Our Legacy'}
                </h3>
                <p className="text-gray-700 mb-4">
                  {language === 'kn' 
                    ? 'ಓಂ ಗಣೇಶ್ ಗ್ರೂಪ್ 38 ವರ್ಷಗಳ ಹಿಂದೆ ಪ್ರಾರಂಭವಾಯಿತು. ಶ್ರೀ ಭಾಸ್ಕರ್ ಕಾಮತ್ CMD ಆಗಿ, ಟ್ರ್ಯಾಕ್ಟರ್ ಮಾರಾಟದಿಂದ ಪ್ರಾರಂಭಿಸಿ, ಶಿವಮೊಗ್ಗದಲ್ಲಿ ಮೊದಲ ಸಂಘಟಿತ ಟ್ರೇಲರ್ ತಯಾರಿಕೆ ಘಟಕವನ್ನು ಸ್ಥಾಪಿಸಿದರು.'
                    : 'Om Ganesh Group was founded 38 years ago by Mr. Bhaskar Kamath (CMD). Starting with freelance tractor sales, he established the first organized trailer manufacturing unit in Shimoga and revived a Massey Ferguson dealership 20 years ago.'
                  }
                </p>
                <p className="text-gray-700">
                  {language === 'kn'
                    ? 'ಶ್ರೀ ಹರ್ಷ ಬಿ ಕಾಮತ್ (CEO), ಮೆಕಾನಿಕಲ್ ಇಂಜಿನಿಯರ್, ಕುಟುಂಬ ವ್ಯವಹಾರವನ್ನು ಹೊಸ ಎತ್ತರಕ್ಕೆ ಕೊಂಡೊಯ್ದಿದ್ದಾರೆ.'
                    : 'Mr. Harsha B Kamath (CEO), a mechanical engineer, joined the family business and has been instrumental in achieving our current market position.'
                  }
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="backdrop-blur-sm bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl hover:shadow-2xl transition-all">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4">
                  {language === 'kn' ? 'TAFE ದೃಷ್ಟಿ' : 'TAFE Vision'}
                </h3>
                <p className="text-white/95 italic">
                  {language === 'kn'
                    ? '"ಉತ್ಕೃಷ್ಟತೆ ನಮಗೆ ಕೇವಲ ಇಂಜಿನಿಯರಿಂಗ್ ಅಲ್ಲ. ಇದು ನಮ್ಮೊಳಗಿನ ಅತ್ಯುತ್ತಮವನ್ನು ಸಾಧಿಸುವ ಆಂತರಿಕ ಬಯಕೆ. ಇದು ಕೆಲಸ ಮತ್ತು ಮನೆಯಲ್ಲಿ ನಮ್ಮ ಜೀವನವನ್ನು ವ್ಯಾಖ್ಯಾನಿಸುತ್ತದೆ ಮತ್ತು ನಮ್ಮ ಸುತ್ತಲಿನ ಜಗತ್ತಿನಲ್ಲಿ ಹರಡುತ್ತದೆ."'
                    : '"To us in TAFE, Excellence is not something that we engineer, inspect and input into our tractors. It is an innate desire to attain the best that comes from within each of us. It defines our lives at work and at home and ripples out into the world around us."'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Group Companies */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {language === 'kn' ? 'ನಮ್ಮ ಗ್ರೂಪ್ ಕಂಪನಿಗಳು' : 'Our Group Companies'}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h4 className="font-semibold text-orange-600 mb-2">Om Ganesh Agro Products</h4>
                <p className="text-sm text-gray-600">
                  {language === 'kn' ? 'ಟ್ರೇಲರ್ ಮತ್ತು ಕೃಷಿ ಉಪಕರಣಗಳು (1988)' : 'Trailers & Agri Equipment (Since 1988)'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h4 className="font-semibold text-orange-600 mb-2">Shimoga Tractors & Implements</h4>
                <p className="text-sm text-gray-600">
                  {language === 'kn' ? 'ಪವರ್ ಟಿಲ್ಲರ್ಸ್ & ಟ್ರಾಲಿಗಳು (1988)' : 'Power Tillers & Trolleys (Since 1988)'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h4 className="font-semibold text-orange-600 mb-2">Om Ganesh Motors</h4>
                <p className="text-sm text-gray-600">
                  {language === 'kn' ? 'ಯಮಹಾ 2 ವೀಲರ್ಸ್ ಡೀಲರ್ (2008)' : 'Yamaha 2 Wheelers Dealer (Since 2008)'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h4 className="font-semibold text-orange-600 mb-2">Om Ganesh Agro Spares</h4>
                <p className="text-sm text-gray-600">
                  {language === 'kn' ? 'TAFE ಸ್ಪೇರ್ ಪಾರ್ಟ್ಸ್ ಡೀಲರ್ (1998)' : 'TAFE Spare Parts Dealer (Since 1998)'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-700 max-w-3xl mx-auto">
              {language === 'kn'
                ? 'ಮುಖ್ಯ ಕಚೇರಿ: ಶಿವಮೊಗ್ಗ - ಶಂಕರ ಮಠ ರಸ್ತೆ | ಶಾಖೆಗಳು: ಶಿಕಾರಿಪುರ, ಚನ್ನಗಿರಿ, ಹೊನ್ನಾಳಿ, ಅಣ್ವತ್ತಿ, ಉಡುಪಿ ಮತ್ತು ಸಾಗರ'
                : 'HQ: Shimoga - Shankar Mutt Road | Branches: Shikaripura, Chanagiri, Honnali, Anvati, Udupi & Sagar'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16 bg-gradient-to-br from-white to-orange-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {language === 'kn' ? 'ಪ್ರಶಸ್ತಿಗಳು ಮತ್ತು ಗೌರವಗಳು' : 'Awards & Recognition'}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-orange-500 mb-3">🏆</div>
              <h4 className="font-semibold mb-2">
                {language === 'kn' ? 'ಉತ್ತಮ ಗ್ರಾಹಕ ಸಂಬಂಧ ಪ್ರಶಸ್ತಿ' : 'Best Customer Relation Award'}
              </h4>
              <p className="text-sm text-gray-600">Government of Karnataka (2005-06)</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-orange-500 mb-3">⭐</div>
              <h4 className="font-semibold mb-2">
                {language === 'kn' ? 'ಸ್ಟಾರ್ ಡೀಲರ್ ಪ್ರಶಸ್ತಿ' : 'Star Dealer Award'}
              </h4>
              <p className="text-sm text-gray-600">TAFE Recognition</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-orange-500 mb-3">🎯</div>
              <h4 className="font-semibold mb-2">
                {language === 'kn' ? '12 TAFE ಪ್ರಶಸ್ತಿಗಳು' : '12 TAFE Awards'}
              </h4>
              <p className="text-sm text-gray-600">Various Achievements (2000-2013)</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-orange-500 mb-3">🏅</div>
              <h4 className="font-semibold mb-2">
                {language === 'kn' ? 'ಉತ್ಪಾದನೆಯಲ್ಲಿ ಶ್ರೇಷ್ಠತೆ' : 'Excellence in Manufacturing'}
              </h4>
              <p className="text-sm text-gray-600">Chamber of Commerce, Shimoga (2010-11)</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-orange-500 mb-3">💼</div>
              <h4 className="font-semibold mb-2">
                {language === 'kn' ? 'SMERA ರೇಟಿಂಗ್' : 'SMERA Rating'}
              </h4>
              <p className="text-sm text-gray-600">Canara Bank (2010-11)</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="text-orange-500 mb-3">🚀</div>
              <h4 className="font-semibold mb-2">
                {language === 'kn' ? 'ಉತ್ತಮ ಬೆಳವಣಿಗೆ ಡೀಲರ್' : 'Best Upcoming Dealer'}
              </h4>
              <p className="text-sm text-gray-600">Yamaha (2010-11)</p>
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