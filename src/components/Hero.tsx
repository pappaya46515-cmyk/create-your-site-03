import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Hero = () => {
  const { toast } = useToast();

  const handleGetStarted = () => {
    toast({
      title: "Welcome to Kamtha!",
      description: "Choose your service type to continue.",
    });
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-earth">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, hsl(var(--primary)) 35px, hsl(var(--primary)) 70px)`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Tagline in Kannada */}
          <div className="mb-6 inline-block">
            <p className="text-2xl md:text-3xl font-bold text-primary bg-card/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-medium">
              11000 ರೈತರಿಗೆ ಪಾರದರ್ಶಕ ಸೇವೆ ನೀಡಲಾಗುತ್ತಿದೆ
            </p>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Welcome to <span className="text-primary">Kamtha</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Your Trusted Partner in Agricultural Equipment
          </p>

          {/* Service Options */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
            <Link to="/services" onClick={handleGetStarted}>
              <div className="group bg-card hover:shadow-strong transition-all duration-300 rounded-xl p-6 border border-border hover:border-primary cursor-pointer">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  ಖರೀದಿದಾರ ಮತ್ತು ಗ್ರಾಹಕ ಸೇವೆ
                </h3>
                <p className="text-muted-foreground mb-4">
                  Buyer and Customer Service
                </p>
                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                  Explore Services <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Link>

            <Link to="/sell" onClick={handleGetStarted}>
              <div className="group bg-card hover:shadow-strong transition-all duration-300 rounded-xl p-6 border border-border hover:border-secondary cursor-pointer">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors">
                    <Sparkles className="h-8 w-8 text-secondary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  ಮಾರಾಟಗಾರ
                </h3>
                <p className="text-muted-foreground mb-4">
                  Seller Services
                </p>
                <Button className="bg-secondary hover:bg-secondary-hover text-secondary-foreground">
                  Start Selling <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Verified Equipment</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span>11,000+ Farmers Served</span>
            </div>
            <div className="flex items-center gap-2">
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