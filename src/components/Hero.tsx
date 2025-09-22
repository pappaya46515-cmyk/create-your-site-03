import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Shield, Sparkles, ChevronLeft, ChevronRight, Tractor, BadgeCheck, HandshakeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Hero = () => {
  const { toast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Welcome to Kamtha",
      subtitle: "Pre-owned Agri Machines and Transparent Service",
      kannada: "ಕರ್ನಾಟಕದಾದ್ಯಂತ 11000 ರೈತರಿಗೆ ಪಾರದರ್ಶಕತೆಯಿಂದ ಉಪಯೋಗಿಸಿದ ರೈತ ಉಪಕರಣಗಳ ಮಾರಾಟದ ವ್ಯವಸ್ಥೆ",
      icon: <Tractor className="h-16 w-16 text-primary animate-fade-in" />,
      bgClass: "bg-gradient-to-br from-primary/20 via-primary/10 to-transparent",
    },
    {
      title: "11,000+ Farmers Served",
      subtitle: "Trusted by farmers across Karnataka since 1988",
      kannada: "೧೯೮೮ ರಿಂದ ಕರ್ನಾಟಕದಾದ್ಯಂತ ರೈತರ ವಿಶ್ವಾಸ",
      icon: <Users className="h-16 w-16 text-secondary animate-fade-in" />,
      bgClass: "bg-gradient-to-br from-secondary/20 via-secondary/10 to-transparent",
    },
    {
      title: "Verified Equipment",
      subtitle: "All documents checked and verified for your peace of mind",
      kannada: "ಎಲ್ಲಾ ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ ಮತ್ತು ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
      icon: <BadgeCheck className="h-16 w-16 text-accent animate-fade-in" />,
      bgClass: "bg-gradient-to-br from-accent/20 via-accent/10 to-transparent",
    },
    {
      title: "Transparent Dealings",
      subtitle: "Fair prices and honest service for all",
      kannada: "ಎಲ್ಲರಿಗೂ ನ್ಯಾಯಯುತ ಬೆಲೆಗಳು ಮತ್ತು ಪ್ರಾಮಾಣಿಕ ಸೇವೆ",
      icon: <HandshakeIcon className="h-16 w-16 text-primary animate-fade-in" />,
      bgClass: "bg-gradient-to-br from-primary/20 via-accent/10 to-transparent",
    },
  ];

  const handleGetStarted = () => {
    toast({
      title: "Welcome to Kamtha!",
      description: "Choose your service type to continue.",
    });
  };

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-earth">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 animate-pulse" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, hsl(var(--primary)) 35px, hsl(var(--primary)) 70px)`,
        }} />
      </div>

      {/* Carousel Slides */}
      <div className="absolute inset-0 flex items-center justify-center">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 translate-x-0' 
                : index < currentSlide 
                  ? 'opacity-0 -translate-x-full' 
                  : 'opacity-0 translate-x-full'
            }`}
          >
            <div className={`absolute inset-0 ${slide.bgClass}`} />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Slide Content */}
          <div className="mb-8 animate-fade-in" key={currentSlide}>
            {/* Icon */}
            <div className="flex justify-center mb-6">
              {slides[currentSlide].icon}
            </div>

            {/* Kannada Tagline */}
            <div className="mb-6 inline-block">
              <p className="text-xl md:text-2xl font-bold text-primary bg-card/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-medium">
                {slides[currentSlide].kannada}
              </p>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-scale-in">
              <span className="text-primary">{slides[currentSlide].title}</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {slides[currentSlide].subtitle}
            </p>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-8 bg-primary' 
                    : 'w-2 bg-primary/30 hover:bg-primary/50'
                } rounded-full`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Service Options - Always Visible */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
            <Link to="/services" onClick={handleGetStarted}>
              <div className="group bg-card/90 backdrop-blur-sm hover:shadow-strong transition-all duration-300 rounded-xl p-6 border border-border hover:border-primary cursor-pointer hover-scale">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  ಖರೀದಿದಾರ ಮತ್ತು ಗ್ರಾಹಕ ಸೇವೆ
                </h3>
                <p className="text-muted-foreground mb-4">
                  Buy Pre-owned Equipment & Customer Service
                </p>
                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                  Buy Pre Own <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Link>

            <Link to="/sell" onClick={handleGetStarted}>
              <div className="group bg-card/90 backdrop-blur-sm hover:shadow-strong transition-all duration-300 rounded-xl p-6 border border-border hover:border-secondary cursor-pointer hover-scale">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors">
                    <Sparkles className="h-8 w-8 text-secondary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  ಮಾರಾಟಗಾರ
                </h3>
                <p className="text-muted-foreground mb-4">
                  Sell Your Pre-owned Equipment
                </p>
                <Button className="bg-secondary hover:bg-secondary-hover text-secondary-foreground">
                  Sell Pre Own <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2 animate-fade-in">
              <Shield className="h-5 w-5 text-primary" />
              <span>Verified Equipment</span>
            </div>
            <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Users className="h-5 w-5 text-primary" />
              <span>11,000+ Farmers Served</span>
            </div>
            <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Transparent Service</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;