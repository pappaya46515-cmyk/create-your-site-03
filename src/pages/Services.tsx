import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Package, Shield, Headphones, FileCheck, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      icon: <ShoppingCart className="h-10 w-10 text-primary" />,
      title: "ಖರೀದಿದಾರ ಸೇವೆ",
      subtitle: "Buyer Services",
      description: "Browse and purchase verified agricultural equipment from trusted sellers",
      features: [
        "Verified equipment listings",
        "Transparent pricing",
        "Quality assurance",
        "Direct seller contact"
      ],
      link: "/buy",
      buttonText: "Start Buying"
    },
    {
      icon: <Package className="h-10 w-10 text-secondary" />,
      title: "ಮಾರಾಟಗಾರ ಸೇವೆ",
      subtitle: "Seller Services",
      description: "List your agricultural equipment for sale with our verification process",
      features: [
        "Easy listing process",
        "Executive verification",
        "Wide buyer network",
        "Fair pricing guidance"
      ],
      link: "/sell",
      buttonText: "Start Selling"
    },
    {
      icon: <Shield className="h-10 w-10 text-accent" />,
      title: "ಪರಿಶೀಲನೆ ಸೇವೆ",
      subtitle: "Verification Services",
      description: "All equipment verified by Kamtha executives for authenticity",
      features: [
        "Document verification",
        "Physical inspection",
        "Quality certification",
        "Ownership validation"
      ],
      link: "#",
      buttonText: "Learn More"
    },
    {
      icon: <Headphones className="h-10 w-10 text-primary" />,
      title: "ಗ್ರಾಹಕ ಬೆಂಬಲ",
      subtitle: "Customer Support",
      description: "24/7 support for all your queries and assistance needs",
      features: [
        "24/7 helpline",
        "Multilingual support",
        "Technical assistance",
        "Transaction support"
      ],
      link: "/contact",
      buttonText: "Contact Us"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-earth">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Services
            </h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive solutions for all your agricultural equipment needs
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-strong transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-muted rounded-lg">
                      {service.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-1">{service.title}</CardTitle>
                      <p className="text-lg text-muted-foreground">{service.subtitle}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <FileCheck className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {service.link !== "#" ? (
                    <Link to={service.link}>
                      <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground">
                        {service.buttonText}
                      </Button>
                    </Link>
                  ) : (
                    <Button className="w-full" variant="outline">
                      {service.buttonText}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of farmers who trust Kamtha for their equipment needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/buy">
              <Button size="lg" className="bg-card text-foreground hover:bg-card/90">
                Browse Equipment
              </Button>
            </Link>
            <Link to="/sell">
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                List Your Equipment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;