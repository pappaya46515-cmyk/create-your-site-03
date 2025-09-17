import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Award, Users, Factory, Trophy, Tractor } from "lucide-react";
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
              alt="Om Ganesh Tractors" 
              className="h-32 w-auto mx-auto mb-6 object-contain"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Om Ganesh Tractors - Massey Ferguson
            </h1>
            <p className="text-xl text-muted-foreground">
              38 Years of Excellence in Agricultural Equipment & Services
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Leadership Section */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Leadership</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2">Mr. Bhaskar Kamath</h3>
                    <p className="text-primary font-semibold mb-2">CMD - Om Ganesh Group</p>
                    <p className="text-muted-foreground">
                      Our visionary founder who started 38 years back with freelance sales of tractors. 
                      He established the first organized trailer manufacturing unit in Shimoga and 
                      revived a sick MF dealership 20 years ago.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2">Mr. Harsha B Kamath</h3>
                    <p className="text-primary font-semibold mb-2">CEO - Om Ganesh Group</p>
                    <p className="text-muted-foreground">
                      A mechanical engineer with AutoCAD expertise from Bangalore, he joined the 
                      family business and is responsible for our current enviable market position.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2">Mrs. Shalini Kamath</h3>
                    <p className="text-primary font-semibold mb-2">Director</p>
                    <p className="text-muted-foreground">
                      A pillar of moral support, she has successfully managed the business during 
                      our CMD's business tours, ensuring continuity and stability.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2">Mr. Vishwas Kamath</h3>
                    <p className="text-primary font-semibold mb-2">Managing Partner</p>
                    <p className="text-muted-foreground">
                      With vast IT industry experience, he manages the Channagiri TAFE tractor 
                      dealership and oversees Veedol distributorship in Shimoga & Chikmagalur districts.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Group Companies */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Group Companies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6 flex items-start gap-4">
                    <Factory className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Om Ganesh Agro Products</h3>
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
                      <h3 className="font-semibold text-lg mb-1">Shimoga Tractors & Implements (P) Ltd</h3>
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
                      <h3 className="font-semibold text-lg mb-1">Om Ganesh Motors</h3>
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
                      <h3 className="font-semibold text-lg mb-1">Om Ganesh Agro Spares</h3>
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
              <h2 className="text-3xl font-bold text-foreground mb-6">Awards & Recognition</h2>
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-8">
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
                      <Trophy className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <p className="text-muted-foreground">{award}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Network & Services */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Network</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-muted-foreground mb-4">
                  With our headquarters in Shimoga on Shankar Mutt Road, we have expanded our presence 
                  across Karnataka with branches in:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                  {["Shikaripura", "Chanagiri", "Honnali", "Anvati", "Udupi", "Sagar"].map((location) => (
                    <div key={location} className="bg-primary/5 rounded-lg p-3 text-center">
                      <p className="font-semibold text-foreground">{location}</p>
                    </div>
                  ))}
                </div>
                <p className="text-lg text-muted-foreground mb-4">
                  We are proud distributors for:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>REDLAND range of farm equipment</li>
                  <li>Veedol lubricants for Shimoga & Chikmagalur districts</li>
                  <li>Om Ganesh car franchise - Skoda</li>
                </ul>
              </div>
            </div>

            {/* TAFE Partnership */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">TAFE - Tractors & Farm Equipment</h2>
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-4">Massey Ferguson Legacy</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <p>• Amalgamations group entered tractor business in 1960</p>
                    <p>• Standard Motor Products assembled Massey Ferguson tractors in Bangalore</p>
                    <p>• TAFE established through collaboration with MF of England</p>
                    <p>• Operations moved to Chennai with initial capacity of 12,000 units annually</p>
                  </div>
                  <div className="mt-6 p-4 bg-background/50 rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">TAFE Vision:</h4>
                    <p className="text-muted-foreground italic">
                      "To us in TAFE, Excellence is not something that we engineer, inspect and input into our tractors. 
                      It is an innate desire to attain the best that comes from within each of us. It defines our lives 
                      at work and at home and ripples out into the world around us."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Our Service - Kamtha Section */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                ನಮ್ಮ ಸೇವೆ - Kamtha Service
              </h2>
              <Card>
                <CardContent className="p-8">
                  <p className="text-xl text-primary font-semibold mb-4">
                    ಕರ್ನಾಟಕದಾದ್ಯಂತ 11,000+ ರೈತರಿಗೆ ಪಾರದರ್ಶಕತೆಯಿಂದ ಉಪಯೋಗಿಸಿದ ರೈತ ಉಪಕರಣಗಳ ಮಾರಾಟದ ವ್ಯವಸ್ಥೆ
                  </p>
                  <p className="text-lg text-muted-foreground">
                    With 35 years of standing and catering to 5 districts, we specialize in providing 
                    transparent services for pre-owned agricultural machinery to farmers. Every piece of 
                    equipment listed on our platform goes through a thorough verification process by our 
                    executives to ensure quality and authenticity.
                  </p>
                </CardContent>
              </Card>
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
                <h3 className="font-semibold text-lg mb-2 text-foreground">Excellence</h3>
                <p className="text-sm text-muted-foreground">
                  38 years of trusted service with 100% verified equipment
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