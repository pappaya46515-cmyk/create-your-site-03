import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Award, Users, Factory, Trophy, Tractor, Building2, MapPin, Calendar, TrendingUp, Sparkles } from "lucide-react";
import omGaneshLogo from "@/assets/om-ganesh-official-logo.jpg";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const About = () => {
  const [leadership, setLeadership] = useState<Array<{ id: string; name: string; designation: string; description: string | null; photo_url: string | null }>>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('leadership_team')
        .select('*')
        .order('order_index');
      if (data) setLeadership(data as any);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <Navbar />
      
      {/* Hero Section with Enhanced Visuals */}
      <section className="py-20 bg-gradient-to-br from-primary via-secondary to-accent relative overflow-hidden animate-fade-in">
        {/* Animated Tractor Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/40"></div>
          {/* Floating Tractor icons */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <Tractor 
                key={i} 
                className="absolute text-white animate-float"
                style={{
                  width: '60px',
                  height: '60px',
                  left: `${(i % 5) * 25}%`,
                  top: `${Math.floor(i / 5) * 30}%`,
                  transform: `rotate(${i * 15}deg)`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-slide-up">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 inline-block mb-8 shadow-2xl hover-lift">
              <img 
                src={omGaneshLogo} 
                alt="Om Ganesh Tractors" 
                className="h-36 w-auto mx-auto object-contain"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              OM GANESH TRACTORS
            </h1>
            <div className="text-3xl md:text-4xl font-bold text-white/90 mb-6">
              MASSEY FERGUSON
            </div>
            <p className="text-2xl text-white/90 mb-8">
              38 Years of Excellence in Agricultural Equipment & Services
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
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
        </div>
      </section>

      {/* Photo Gallery Section - Enhanced */}
      <section className="py-12 bg-gradient-to-r from-muted/50 via-background to-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-slide-up">
            Our Legacy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-card hover-lift animate-fade-in" style={{animationDelay: '0.1s'}}>
              <img 
                src={omGaneshLogo} 
                alt="Om Ganesh Group" 
                className="w-full h-56 object-contain rounded-lg"
              />
              <p className="text-center mt-4 font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Om Ganesh Group</p>
            </div>
            <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-card hover-lift animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="w-full h-56 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center rounded-lg">
                <Tractor className="h-24 w-24 text-primary animate-float" />
              </div>
              <p className="text-center mt-4 font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Massey Ferguson Dealership</p>
            </div>
            <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-card hover-lift animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="w-full h-56 bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center rounded-lg">
                <Building2 className="h-24 w-24 text-secondary animate-float" style={{animationDelay: '0.5s'}} />
              </div>
              <p className="text-center mt-4 font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Manufacturing Excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Leadership Section with Photos - Enhanced */}
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-slide-up">
                Our Leadership
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in">
                Meet the visionary leaders driving Om Ganesh Tractors towards excellence
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {leadership.length > 0 ? (
                  leadership.map((m, index) => (
                    <Card key={m.id} className="overflow-hidden hover-lift animate-slide-up shadow-card" style={{animationDelay: `${index * 0.1}s`}}>
                      <div className="h-64 relative overflow-hidden group">
                        {m.photo_url ? (
                          <>
                            <img
                              src={m.photo_url}
                              alt={`${m.name} - ${m.designation}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              loading="lazy"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <Users className="h-32 w-32 text-muted-foreground/30 animate-float" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-8">
                        <h3 className="font-bold text-2xl mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {m.name}
                        </h3>
                        <p className="text-primary font-semibold mb-4 text-lg">{m.designation}</p>
                        {m.description && (
                          <p className="text-muted-foreground leading-relaxed">{m.description}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <div className="animate-pulse">
                      <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
                      <div className="h-4 bg-muted rounded w-48 mx-auto"></div>
                    </div>
                  </div>
                )}
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

            {/* Awards Section with Visual Enhancement */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">Awards & Recognition</h2>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-8 border-2 border-yellow-200 dark:border-yellow-800">
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
                      <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                      <p className="text-muted-foreground">{award}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Network & Services with Map Visual */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Network</h2>
              <Card className="overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 flex items-center justify-center relative">
                  <MapPin className="h-32 w-32 text-primary opacity-20 absolute" />
                  <div className="relative z-10 text-center">
                    <p className="text-2xl font-bold text-primary">6 Branches</p>
                    <p className="text-lg text-muted-foreground">Across Karnataka</p>
                  </div>
                </div>
                <CardContent className="p-8">
                  <p className="text-lg text-muted-foreground mb-4">
                    With our headquarters in Shimoga on Shankar Mutt Road, we have expanded our presence 
                    across Karnataka with branches in:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 mb-6">
                    {["Shikaripura", "Chanagiri", "Honnali", "Anvati", "Udupi", "Sagar"].map((location) => (
                      <div key={location} className="bg-primary/5 rounded-lg p-3 text-center border border-primary/20">
                        <MapPin className="h-4 w-4 text-primary mx-auto mb-1" />
                        <p className="font-semibold text-foreground">{location}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-secondary/10 rounded-lg">
                    <p className="text-lg font-semibold mb-3">We are proud distributors for:</p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full"></div>
                        REDLAND range of farm equipment
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full"></div>
                        Veedol lubricants for Shimoga & Chikmagalur districts
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full"></div>
                        Om Ganesh car franchise - Skoda
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* TAFE Partnership */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">TAFE - Tractors & Farm Equipment</h2>
              <Card className="hover:shadow-strong transition-all duration-300 border-2 hover:border-primary overflow-hidden">
                <CardContent className="p-0">
                  {/* Header with gradient */}
                  <div className="bg-gradient-to-r from-primary to-secondary p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-white text-primary px-6 py-3 rounded-lg font-bold text-xl shadow-medium">
                          MASSEY FERGUSON
                        </div>
                        <div className="text-white font-semibold">
                          Official Dealer Partner
                        </div>
                      </div>
                      <Tractor className="h-12 w-12 text-white/80" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-8 space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                        <Award className="h-6 w-6 text-primary" />
                        Legacy & Heritage
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <p className="font-semibold text-foreground">1960</p>
                              <p className="text-sm text-muted-foreground">Amalgamations group entered tractor business</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <p className="font-semibold text-foreground">Bangalore</p>
                              <p className="text-sm text-muted-foreground">Standard Motor Products assembled MF tractors</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Users className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <p className="font-semibold text-foreground">TAFE Partnership</p>
                              <p className="text-sm text-muted-foreground">Collaboration with MF of England</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <p className="font-semibold text-foreground">12,000 Units</p>
                              <p className="text-sm text-muted-foreground">Initial annual capacity in Chennai</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Vision Box */}
                    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-6 rounded-xl border border-primary/20">
                      <div className="flex items-start gap-3">
                        <Sparkles className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h4 className="font-bold text-lg mb-3 text-foreground">TAFE Vision</h4>
                          <p className="text-muted-foreground italic leading-relaxed">
                            "To us in TAFE, Excellence is not something that we engineer, inspect and input into our tractors. 
                            It is an innate desire to attain the best that comes from within each of us. It defines our lives 
                            at work and at home and ripples out into the world around us."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Our Service - Kamtha Section */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                ನಮ್ಮ ಸೇವೆ - Kamtha Service
              </h2>
              <Card className="hover:shadow-strong transition-all duration-300 border-2 hover:border-primary overflow-hidden">
                <CardContent className="p-0">
                  {/* Header with gradient */}
                  <div className="bg-gradient-to-r from-secondary to-accent p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <h3 className="text-2xl font-bold text-white">
                        35 Years of Excellence
                      </h3>
                      <div className="flex items-center gap-3">
                        <Award className="h-8 w-8 text-white/80" />
                        <Trophy className="h-8 w-8 text-white/80" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-8 space-y-6">
                    {/* Kannada Tagline */}
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-xl">
                      <p className="text-xl text-primary font-bold text-center">
                        ಕರ್ನಾಟಕದಾದ್ಯಂತ 11,000+ ರೈತರಿಗೆ ಪಾರದರ್ಶಕತೆಯಿಂದ ಉಪಯೋಗಿಸಿದ ರೈತ ಉಪಕರಣಗಳ ಮಾರಾಟದ ವ್ಯವಸ್ಥೆ
                      </p>
                      <p className="text-center text-muted-foreground mt-2">
                        Transparent Pre-owned Agricultural Equipment Sales Across Karnataka
                      </p>
                    </div>
                    
                    {/* Service Stats */}
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-card rounded-lg border">
                        <div className="text-3xl font-bold text-primary mb-2">35+</div>
                        <p className="text-muted-foreground">Years of Service</p>
                      </div>
                      <div className="text-center p-4 bg-card rounded-lg border">
                        <div className="text-3xl font-bold text-primary mb-2">5</div>
                        <p className="text-muted-foreground">Districts Covered</p>
                      </div>
                      <div className="text-center p-4 bg-card rounded-lg border">
                        <div className="text-3xl font-bold text-primary mb-2">11,000+</div>
                        <p className="text-muted-foreground">Farmers Served</p>
                      </div>
                    </div>
                    
                    {/* Service Description */}
                    <div className="bg-gradient-to-br from-accent/5 to-primary/5 p-6 rounded-xl">
                      <h4 className="font-bold text-lg mb-3 text-foreground flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Our Commitment
                      </h4>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        With 35 years of standing and catering to 5 districts, we specialize in providing 
                        transparent services for pre-owned agricultural machinery to farmers. Every piece of 
                        equipment listed on our platform goes through a thorough verification process by our 
                        executives to ensure quality and authenticity.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <p className="font-semibold text-foreground">Document Verification</p>
                            <p className="text-sm text-muted-foreground">RC, Insurance, NOC, Forms 29/30</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <p className="font-semibold text-foreground">Fair Pricing</p>
                            <p className="text-sm text-muted-foreground">Minimum ₹2.5L deal value</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <p className="font-semibold text-foreground">Quality Assurance</p>
                            <p className="text-sm text-muted-foreground">Thoroughly inspected equipment</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <p className="font-semibold text-foreground">Trust & Transparency</p>
                            <p className="text-sm text-muted-foreground">Clear documentation process</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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