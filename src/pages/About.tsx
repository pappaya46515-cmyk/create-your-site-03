import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Award } from "lucide-react";
import omGaneshLogo from "@/assets/om-ganesh-official-logo.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-earth">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <img 
              src={omGaneshLogo} 
              alt="Om Ganesh" 
              className="h-32 w-auto mx-auto mb-6 object-contain"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              About Kamtha Trailers
            </h1>
            <p className="text-xl text-muted-foreground">
              Empowering farmers with quality agricultural equipment and transparent services
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                Kamtha Trailers has been a trusted name in agricultural equipment services, 
                dedicated to serving the farming community with integrity and transparency. 
                We understand the challenges farmers face and strive to provide accessible, 
                reliable solutions for their equipment needs.
              </p>
              
              <h2 className="text-2xl font-bold text-foreground mb-4 mt-8">Our Journey</h2>
              <p className="text-muted-foreground mb-6">
                Started with a vision to revolutionize the agricultural equipment market, 
                Kamtha has grown to serve over 11,000 farmers across Karnataka. Our commitment 
                to quality and service has made us the preferred choice for farmers looking to 
                buy or sell agricultural equipment.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-4 mt-8">
                ನಮ್ಮ ಸೇವೆ (Our Service)
              </h2>
              <p className="text-lg text-primary font-semibold mb-6">
                ಕರ್ನಾಟಕದಾದ್ಯಂತ 11000 ರೈತರಿಗೆ ಪಾರದರ್ಶಕತೆಯಿಂದ ಉಪಯೋಗಿಸಿದ ರೈತ ಉಪಕರಣಗಳ ಮಾರಾಟದ ವ್ಯವಸ್ಥೆ
              </p>
              <p className="text-muted-foreground">
                We specialize in providing transparent services for pre-owned agricultural machinery to farmers. 
                Every piece of equipment listed on our platform goes through a thorough verification process by our executives 
                to ensure quality and authenticity.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-primary/10 rounded-full inline-block mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Mission</h3>
                <p className="text-sm text-muted-foreground">
                  To provide transparent and reliable agricultural equipment services
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-secondary/10 rounded-full inline-block mb-4">
                  <Eye className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Vision</h3>
                <p className="text-sm text-muted-foreground">
                  To be the most trusted platform for agricultural equipment
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-accent/10 rounded-full inline-block mb-4">
                  <Heart className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Values</h3>
                <p className="text-sm text-muted-foreground">
                  Integrity, transparency, and farmer-first approach
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-primary/10 rounded-full inline-block mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Quality</h3>
                <p className="text-sm text-muted-foreground">
                  100% verified and authentic equipment listings
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;