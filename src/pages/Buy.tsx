import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MapPin, Calendar, IndianRupee, Phone, Eye, LogIn } from "lucide-react";
import { useState } from "react";

const Buy = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Sample equipment data (in production, this would come from a database)
  const equipment = [
    {
      id: 1,
      name: "John Deere 5075E",
      type: "Tractor",
      year: "2020",
      price: "₹8,50,000",
      location: "Bangalore",
      image: "/api/placeholder/300/200",
      verified: true
    },
    {
      id: 2,
      name: "Mahindra 575 DI",
      type: "Tractor",
      year: "2019",
      price: "₹6,75,000",
      location: "Mysore",
      image: "/api/placeholder/300/200",
      verified: true
    },
    {
      id: 3,
      name: "Swaraj 744 FE",
      type: "Tractor",
      year: "2021",
      price: "₹7,25,000",
      location: "Hubli",
      image: "/api/placeholder/300/200",
      verified: true
    },
    {
      id: 4,
      name: "Kubota Harvester",
      type: "Harvester",
      year: "2018",
      price: "₹12,00,000",
      location: "Mandya",
      image: "/api/placeholder/300/200",
      verified: true
    }
  ];

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.type.toLowerCase() === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-12 bg-gradient-earth">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              ಖರೀದಿದಾರ / Buy Pre-owned
            </h1>
            <p className="text-xl text-muted-foreground">
              Browse verified pre-owned agricultural equipment from trusted sellers
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-card border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search equipment..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Equipment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="tractor">Tractors</SelectItem>
                <SelectItem value="harvester">Harvesters</SelectItem>
                <SelectItem value="tiller">Tillers</SelectItem>
                <SelectItem value="plough">Ploughs</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-5">Under ₹5 Lakh</SelectItem>
                <SelectItem value="5-10">₹5-10 Lakh</SelectItem>
                <SelectItem value="10+">Above ₹10 Lakh</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Equipment Listings */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Available Pre-owned Equipment ({filteredEquipment.length})
            </h2>
            <p className="text-muted-foreground">All listings are verified by Kamta executives</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((item) => (
              <Card key={item.id} className="hover:shadow-strong transition-all duration-300">
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {item.verified && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold">
                      Verified
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{item.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{item.type}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Year: {item.year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                      <IndianRupee className="h-4 w-4" />
                      <span>{item.price}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isAuthenticated ? (
                      <>
                        <Button className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                      </>
                    ) : (
                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={() => navigate("/auth")}
                      >
                        <LogIn className="h-4 w-4 mr-1" />
                        Login to View
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEquipment.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No equipment found matching your criteria.</p>
              <Button className="mt-4" onClick={() => {setSearchTerm(""); setFilterType("all");}}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Buy;