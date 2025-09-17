import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tractor, Shield, Users, Award, TrendingUp, Headphones, ArrowRight, BarChart3, FileText, Upload, Camera, Sparkles, Star, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const totalImages = uploadedImages.length + files.length;
      if (totalImages > 5) {
        toast({
          title: "Upload Limit",
          description: "Maximum 5 photos allowed",
          variant: "destructive"
        });
        return;
      }
      
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string);
            if (newImages.length === files.length) {
              setUploadedImages([...uploadedImages, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  const slides = [
    {
      title: "11,000+ Farmers Served",
      subtitle: "Trusted Platform Across Karnataka",
      description: "Connecting buyers and sellers with transparency",
      bgColor: "bg-gradient-to-r from-purple-600 to-blue-600"
    },
    {
      title: "100% Document Verification",
      subtitle: "RC, Insurance, Forms 29/30, NOC",
      description: "All documents verified and stored digitally",
      bgColor: "bg-gradient-to-r from-blue-600 to-teal-600"
    },
    {
      title: "Minimum ₹2.5L Deal Value",
      subtitle: "Quality Assured Equipment",
      description: "Premium pre-owned agricultural machinery",
      bgColor: "bg-gradient-to-r from-teal-600 to-purple-600"
    },
    {
      title: "Complete Stock Management",
      subtitle: "Digital Platform for Dealers",
      description: "Track inventory, generate agreements, analytics",
      bgColor: "bg-gradient-to-r from-purple-600 to-pink-600"
    }
  ];

  const tractorModels = [
    "Mahindra 575 DI",
    "Mahindra 475 DI",
    "John Deere 5310",
    "Swaraj 744 FE",
    "Sonalika DI 750",
    "Massey Ferguson 241",
    "New Holland 3630",
    "Kubota MU4501",
    "Eicher 485",
    "TAFE 1002"
  ];

  const modelTypes = [
    "2WD Tractor",
    "4WD Tractor",
    "Mini Tractor",
    "Rotavator",
    "Cultivator",
    "Plough",
    "Harrow",
    "Seed Drill",
    "Harvester",
    "Thresher"
  ];

  const features = [
    {
      icon: <Tractor className="h-8 w-8 text-white" />,
      title: "Vehicle Stock Management",
      description: "Complete digital platform for managing tractors and commercial vehicles"
    },
    {
      icon: <Shield className="h-8 w-8 text-white" />,
      title: "Document Verification",
      description: "RC, Insurance, Forms 29/30, NOC - all documents verified and stored"
    },
    {
      icon: <Users className="h-8 w-8 text-white" />,
      title: "11,000+ Farmers Served",
      description: "Trusted platform connecting buyers and sellers across Karnataka"
    },
    {
      icon: <FileText className="h-8 w-8 text-white" />,
      title: "Agreement Generation",
      description: "Automated PDF agreements with complete documentation"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-white" />,
      title: "Analytics & Reports",
      description: "Track stock movement, buyer interests, and market trends"
    },
    {
      icon: <Award className="h-8 w-8 text-white" />,
      title: "Minimum ₹2.5L Value",
      description: "Quality assured with minimum deal value enforcement"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50">
      <Navbar />
      
      {/* Hero Section with App Name */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-teal-600/10" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* App Name Header */}
          <div className="text-center mb-8">
            <div className="inline-block relative">
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent animate-pulse">
                KAMTHA
              </h1>
              <div className="absolute -top-4 -right-4">
                <Sparkles className="h-8 w-8 text-yellow-400 animate-spin" />
              </div>
              <div className="absolute -bottom-4 -left-4">
                <Star className="h-8 w-8 text-yellow-400 animate-bounce" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-purple-600 mt-4">
              ಕರ್ನಾಟಕದಾದ್ಯಂತ ರೈತರಿಗೆ ಸೇವೆ
            </p>
            <p className="text-lg text-gray-600 mt-2">
              Pre-owned Agricultural Equipment Marketplace
            </p>
          </div>

          {/* Carousel/Slideshow */}
          <div className="max-w-6xl mx-auto mb-12">
            <Carousel className="w-full">
              <CarouselContent>
                {slides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <div className={`${slide.bgColor} rounded-2xl p-12 text-white shadow-2xl`}>
                      <div className="text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h2>
                        <h3 className="text-2xl md:text-3xl mb-4 text-white/90">{slide.subtitle}</h3>
                        <p className="text-xl text-white/80">{slide.description}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="bg-white/90 hover:bg-white" />
              <CarouselNext className="bg-white/90 hover:bg-white" />
            </Carousel>
          </div>

          {/* Service Options - Buy and Sell */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Buy Pre-owned Section */}
            <Card className="border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mr-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Buy Pre-owned Equipment</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Browse verified pre-owned tractors and agricultural equipment with complete documentation
                </p>
                <Button 
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  onClick={() => navigate("/auth")}
                >
                  Start Buying <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            {/* Sell Pre-owned Section */}
            <Card className="border-2 border-teal-200 hover:border-teal-400 transition-all duration-300 hover:shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-teal-600 to-purple-600 rounded-full mr-4">
                    <Tractor className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Sell Your Pre-owned</h3>
                </div>
                
                {/* Upload Photos Section */}
                <div className="mb-4">
                  <Label className="text-sm font-semibold text-gray-700">Upload Photos (Max 5)</Label>
                  <div className="mt-2">
                    <div className="flex gap-2 flex-wrap mb-2">
                      {uploadedImages.map((img, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-purple-300">
                          <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg p-1"
                            onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== idx))}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {uploadedImages.length < 5 && (
                        <label className="w-20 h-20 border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-500 transition-colors">
                          <Camera className="h-6 w-6 text-purple-400" />
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Model Name Dropdown */}
                <div className="mb-4">
                  <Label className="text-sm font-semibold text-gray-700">Model Name</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select tractor model" />
                    </SelectTrigger>
                    <SelectContent>
                      {tractorModels.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Model Type Dropdown */}
                <div className="mb-6">
                  <Label className="text-sm font-semibold text-gray-700">Model Type</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select equipment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {modelTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  size="lg"
                  className="w-full bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 text-white"
                  onClick={() => navigate("/auth")}
                >
                  List Your Equipment <Upload className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Numbers */}
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg">
              <Headphones className="h-6 w-6 text-purple-600" />
              <a href="tel:9448147073" className="font-bold text-lg text-gray-800 hover:text-purple-600 transition-colors">
                9448147073
              </a>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg">
              <Headphones className="h-6 w-6 text-blue-600" />
              <a href="tel:8496971246" className="font-bold text-lg text-gray-800 hover:text-blue-600 transition-colors">
                8496971246
              </a>
            </div>
          </div>
        </div>
      </section>
      
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
              <div className="text-white/90">Verified Documents</div>
            </div>
            <div className="transform hover:scale-110 transition-transform">
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-white/90">System Access</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;