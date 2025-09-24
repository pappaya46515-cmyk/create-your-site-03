import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import Autoplay from "embla-carousel-autoplay";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [leadership, setLeadership] = useState<Array<{ id: string; name: string; designation: string; description: string | null; photo_url: string | null }>>([]);
  
  // Auto-play plugin for carousel
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );
  
  // Auto-play plugin for info carousel
  const infoPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      {/* Hero Section with Clean Design */}
      <section className="relative py-12 overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent">
        {/* Simple Pattern Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Company Logo */}
          <div className="text-center mb-8">
            <div className="bg-white rounded-2xl p-4 inline-block shadow-xl">
              <img 
                src={omGaneshLogo} 
                alt="Om Ganesh Tractors" 
                className="h-24 w-auto mx-auto object-contain"
              />
            </div>
          </div>

          {/* KAMTA and Tagline */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-yellow-300 animate-pulse mb-3">
              {language === 'en' ? 'KAMTA' : 'ಕಂಠ'}
            </h1>
            <p className="text-xl md:text-2xl text-white font-medium mb-2">
              {language === 'kn' ? 'ನಿಮ್ಮ ವಿಶ್ವಾಸಪಾತ್ರ ಕೃಷಿ ಸಹಯೋಗಿ' : 'Your Trusted Agriculture Partner'}
            </p>
            <p className="text-lg md:text-xl text-yellow-100">
              {language === 'kn' ? '38 ವರ್ಷಗಳ ಸೇವೆ' : '38 Years of Service'}
            </p>
          </div>

          {/* Leadership Team - Simplified */}
          <div className="max-w-5xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              {language === 'kn' ? 'ನಮ್ಮನ್ನು ಏಕೆ ಆಯ್ಕೆ ಮಾಡಬೇಕು?' : 'Why Choose Kamta?'}
            </h2>
            {/* Service Excellence Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white/95 backdrop-blur hover:shadow-xl transition-all">
                <CardContent className="p-4 text-center">
                  <Shield className="w-10 h-10 text-green-600 mx-auto mb-2" />
                  <h3 className="font-bold">Verified Equipment</h3>
                  <p className="text-xs text-gray-600 mt-1">All equipment tested</p>
                </CardContent>
              </Card>
              <Card className="bg-white/95 backdrop-blur hover:shadow-xl transition-all">
                <CardContent className="p-4 text-center">
                  <Award className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-bold">Trusted Since 1988</h3>
                  <p className="text-xs text-gray-600 mt-1">38 years of service</p>
                </CardContent>
              </Card>
              <Card className="bg-white/95 backdrop-blur hover:shadow-xl transition-all">
                <CardContent className="p-4 text-center">
                  <IndianRupee className="w-10 h-10 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-bold">Best Prices</h3>
                  <p className="text-xs text-gray-600 mt-1">With easy EMI</p>
                </CardContent>
              </Card>
              <Card className="bg-white/95 backdrop-blur hover:shadow-xl transition-all">
                <CardContent className="p-4 text-center">
                  <Phone className="w-10 h-10 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-bold">24/7 Support</h3>
                  <p className="text-xs text-gray-600 mt-1">Always available</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Key Stats - Simplified with Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/95 backdrop-blur px-6 py-4 rounded-xl shadow-lg text-center">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-gray-800 font-bold text-lg">
                {language === 'kn' ? '1988 ರಿಂದ' : 'Since 1988'}
              </p>
            </div>
            <div className="bg-white/95 backdrop-blur px-6 py-4 rounded-xl shadow-lg text-center">
              <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-gray-800 font-bold text-lg">
                {language === 'kn' ? '5 ಜಿಲ್ಲೆಗಳು' : '5 Districts'}
              </p>
            </div>
            <div className="bg-white/95 backdrop-blur px-6 py-4 rounded-xl shadow-lg text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-gray-800 font-bold text-lg">
                {language === 'kn' ? '11,000+ ರೈತರು' : '11,000+ Farmers'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Options - Simple and Clear */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {/* Buy Pre-Owned */}
            <Card className="group hover:shadow-xl transition-all cursor-pointer border-2 border-green-400 bg-green-50">
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 rounded-full p-4 inline-block mb-4">
                  <Tractor className="w-12 h-12 text-green-700" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  {language === 'kn' ? 'ಟ್ರ್ಯಾಕ್ಟರ್ ಖರೀದಿಸಿ' : 'Buy pre own vehicle'}
                </h3>
                <p className="text-gray-700 mb-4 text-sm">
                  {language === 'kn' ? 'ಪರೀಕ್ಷಿತ ಮತ್ತು ಗುಣಮಟ್ಟದ' : 'Tested & Quality'}
                </p>
                <Link to="/register/buyer">
                  <Button className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 text-lg">
                    {language === 'kn' ? '👉 ನೋಡಿ' : '👉 View'}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Sell Your Equipment */}
            <Card className="group hover:shadow-xl transition-all cursor-pointer border-2 border-blue-400 bg-blue-50">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
                  <IndianRupee className="w-12 h-12 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  {language === 'kn' ? 'ಟ್ರ್ಯಾಕ್ಟರ್ ಮಾರಾಟ' : 'Sell Pre Own Vehicle'}
                </h3>
                <p className="text-gray-700 mb-4 text-sm">
                  {language === 'kn' ? 'ಉತ್ತಮ ಬೆಲೆ ಪಡೆಯಿರಿ' : 'Best Price'}
                </p>
                <Link to="/register/seller">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 text-lg">
                    {language === 'kn' ? '💰 ಮಾರಿ' : '💰 Sell'}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Contact Service */}
            <Card className="group hover:shadow-xl transition-all cursor-pointer border-2 border-orange-400 bg-orange-50">
              <CardContent className="p-6 text-center">
                <div className="bg-orange-100 rounded-full p-4 inline-block mb-4">
                  <Phone className="w-12 h-12 text-orange-700 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  {language === 'kn' ? 'ಸೇವೆ ಕರೆ' : 'Service Call'}
                </h3>
                <div className="space-y-2">
                  <a href="tel:+919480833792" className="flex items-center justify-center gap-2 bg-orange-100 rounded-lg p-2 hover:bg-orange-200">
                    <Phone className="w-5 h-5 text-orange-700" />
                    <span className="font-bold text-lg text-orange-800">9480833792</span>
                  </a>
                  <a href="tel:+919900045575" className="flex items-center justify-center gap-2 bg-orange-100 rounded-lg p-2 hover:bg-orange-200">
                    <Phone className="w-5 h-5 text-orange-700" />
                    <span className="font-bold text-lg text-orange-800">9900045575</span>
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
          <Carousel 
            className="max-w-4xl mx-auto"
            plugins={[infoPlugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
            onMouseEnter={infoPlugin.current.stop}
            onMouseLeave={infoPlugin.current.reset}
          >
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

      {/* Company Overview - Our Legacy */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {language === 'kn' ? 'ನಮ್ಮ ಇತಿಹಾಸ' : 'Our Legacy'}
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <Card className="backdrop-blur-sm bg-white/90 shadow-xl hover:shadow-2xl transition-all">
              <CardContent className="p-8">
                <p className="text-gray-700 mb-4 text-lg">
                  {language === 'kn' 
                    ? 'ಓಂ ಗಣೇಶ್ ಗ್ರೂಪ್ 38 ವರ್ಷಗಳ ಹಿಂದೆ ಪ್ರಾರಂಭವಾಯಿತು. ಶ್ರೀ ಭಾಸ್ಕರ್ ಕಾಮತ್ CMD ಆಗಿ, ಟ್ರ್ಯಾಕ್ಟರ್ ಮಾರಾಟದಿಂದ ಪ್ರಾರಂಭಿಸಿ, ಶಿವಮೊಗ್ಗದಲ್ಲಿ ಮೊದಲ ಸಂಘಟಿತ ಟ್ರೇಲರ್ ತಯಾರಿಕೆ ಘಟಕವನ್ನು ಸ್ಥಾಪಿಸಿದರು.'
                    : 'Om Ganesh Group was founded 38 years ago by Mr. Bhaskar Kamath (CMD). Starting with freelance tractor sales, he established the first organized trailer manufacturing unit in Shimoga and revived a Massey Ferguson dealership 20 years ago.'
                  }
                </p>
                <p className="text-gray-700 text-lg">
                  {language === 'kn'
                    ? 'ಶ್ರೀ ಹರ್ಷ ಬಿ ಕಾಮತ್ (CEO), ಮೆಕಾನಿಕಲ್ ಇಂಜಿನಿಯರ್, ಕುಟುಂಬ ವ್ಯವಹಾರವನ್ನು ಹೊಸ ಎತ್ತರಕ್ಕೆ ಕೊಂಡೊಯ್ದಿದ್ದಾರೆ.'
                    : 'Mr. Harsha B Kamath (CEO), a mechanical engineer, joined the family business and has been instrumental in achieving our current market position.'
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


      {/* Latest Vehicles Section */}



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
              <div className="text-5xl font-bold mb-2">₹1.5L+</div>
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