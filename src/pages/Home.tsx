import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tractor, Shield, Users, Award, TrendingUp, Headphones, ArrowRight, BarChart3, FileText } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: <Tractor className="h-8 w-8 text-primary" />,
      title: "Vehicle Stock Management",
      description: "Complete digital platform for managing tractors and commercial vehicles"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Document Verification",
      description: "RC, Insurance, Forms 29/30, NOC - all documents verified and stored"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "11,000+ Farmers Served",
      description: "Trusted platform connecting buyers and sellers across Karnataka"
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Agreement Generation",
      description: "Automated PDF agreements with complete documentation"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Analytics & Reports",
      description: "Track stock movement, buyer interests, and market trends"
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Minimum ₹2.5L Value",
      description: "Quality assured with minimum deal value enforcement"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-earth">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, hsl(var(--primary)) 35px, hsl(var(--primary)) 70px)`,
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Tagline in Kannada */}
            <div className="mb-6 inline-block">
              <p className="text-xl md:text-2xl font-bold text-primary bg-card/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-medium">
                ಕರ್ನಾಟಕದಾದ್ಯಂತ 11000 ರೈತರಿಗೆ ಪಾರದರ್ಶಕತೆಯಿಂದ ಉಪಯೋಗಿಸಿದ ರೈತ ಉಪಕರಣಗಳ ಮಾರಾಟದ ವ್ಯವಸ್ಥೆ
              </p>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              <span className="text-primary">Kamtha</span> Stock Management System
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Pre-owned Agri Machines and Transparent Service Across Karnataka
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary-hover text-primary-foreground"
                onClick={() => {
                  console.log("Login button clicked, navigating to /auth");
                  navigate("/auth");
                }}
              >
                Login to Portal <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => {
                  console.log("Register button clicked, navigating to /auth");
                  navigate("/auth");
                }}
              >
                Register as Seller/Buyer
              </Button>
            </div>

            {/* Contact Numbers */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-primary" />
                <a href="tel:9448147073" className="font-semibold hover:text-primary transition-colors">
                  9448147073
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-primary" />
                <a href="tel:8496971246" className="hover:text-primary transition-colors">
                  8496971246
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Complete Stock Management Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Digital solution for vehicle stock management with document verification, agreement generation, and analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-strong transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
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
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">11,000+</div>
              <div className="text-primary-foreground/80">Farmers Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">₹2.5L+</div>
              <div className="text-primary-foreground/80">Min Deal Value</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-primary-foreground/80">Verified Documents</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-primary-foreground/80">System Access</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;