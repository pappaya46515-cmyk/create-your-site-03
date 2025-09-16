import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Tractor, Shield, Users, Award, TrendingUp, Headphones } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: <Tractor className="h-8 w-8 text-primary" />,
      title: "Wide Range of Equipment",
      description: "Access to various tractors and agricultural machinery"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Verified & Authentic",
      description: "All equipment verified by Om Ganesh executives"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "11,000+ Farmers",
      description: "Trusted by thousands of farmers across Karnataka"
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Quality Assurance",
      description: "Only the best quality equipment listed"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Best Prices",
      description: "Competitive and transparent pricing"
    },
    {
      icon: <Headphones className="h-8 w-8 text-primary" />,
      title: "24/7 Support",
      description: "Always available customer service"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Om Ganesh?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We are committed to providing transparent and reliable services to farmers across the region
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
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-foreground/80">Equipment Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-primary-foreground/80">Verified Listings</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-primary-foreground/80">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;