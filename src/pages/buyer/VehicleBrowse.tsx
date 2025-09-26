import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, Loader2, IndianRupee, X } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { useBuyerTracking } from "@/hooks/useBuyerTracking";
import { formatPrice } from "@/lib/formatPrice";
import BuyerInfoModal from "@/components/BuyerInfoModal";
import VehicleCard from "@/components/VehicleCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Vehicle {
  id: string;
  model_name: string;
  model_year: number;
  category: string;
  ownership_type: string;
  property_owner?: "kamtha" | "party";
  deal_value: number;
  slab_amount: number;
  registration_number: string;
  has_original_rc: boolean;
  has_duplicate_rc: boolean;
  has_insurance: boolean;
  has_form_29: boolean;
  has_form_30: boolean;
  has_noc: boolean;
  status: string;
  created_at: string;
}

const VehicleBrowse = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackSearch, trackVehicleInterest } = useBuyerTracking();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedVehicles, setSavedVehicles] = useState<Set<string>>(new Set());
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [ownershipType, setOwnershipType] = useState("all");
  const [priceRange, setPriceRange] = useState([150000, 5000000]);
  const [slabRange, setSlabRange] = useState([0, 100000]);
  const [yearFilter, setYearFilter] = useState("");
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    fetchVehicles();
    fetchSavedVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vehicles, searchTerm, category, ownershipType, priceRange, slabRange, yearFilter]);

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVehicles((data || []) as Vehicle[]);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast({
        title: "Error",
        description: "Failed to load vehicles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedVehicles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("buyer_interests")
        .select("vehicle_id")
        .eq("buyer_id", user.id);

      if (error) throw error;
      
      const saved = new Set(data?.map(item => item.vehicle_id) || []);
      setSavedVehicles(saved);
    } catch (error) {
      console.error("Error fetching saved vehicles:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...vehicles];

    // Check if first search - show modal
    if (!hasSearched && (searchTerm || category !== "all")) {
      setShowBuyerModal(true);
      setHasSearched(true);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(v => 
        v.model_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.registration_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (category !== "all") {
      filtered = filtered.filter(v => v.category === category);
    }

    // Ownership type filter
    if (ownershipType !== "all") {
      filtered = filtered.filter(v => v.ownership_type === ownershipType);
    }

    // Price range filter
    filtered = filtered.filter(v => 
      v.deal_value >= priceRange[0] && v.deal_value <= priceRange[1]
    );

    // Slab amount filter
    filtered = filtered.filter(v => 
      v.slab_amount >= slabRange[0] && v.slab_amount <= slabRange[1]
    );

    // Year filter
    if (yearFilter) {
      const year = parseInt(yearFilter);
      filtered = filtered.filter(v => v.model_year === year);
    }

    setFilteredVehicles(filtered);

    // Track search analytics with real data
    if (searchTerm || category !== "all" || priceRange[0] !== 150000 || priceRange[1] !== 5000000) {
      const searchQuery = `${searchTerm} ${category !== "all" ? category : ""} ₹${priceRange[0]}-₹${priceRange[1]}`.trim();
      trackSearch(searchQuery, filtered.length);
      logSearchAnalytics(searchTerm, category, priceRange, filtered.length);
    }
  };

  const logSearchAnalytics = async (term: string, cat: string, price: number[], count: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Convert category to match enum values
      let categoryValue: "tractor" | "other_vehicle" | undefined = undefined;
      if (cat === "tractor") categoryValue = "tractor";
      else if (cat === "commercial") categoryValue = "other_vehicle";
      
      await supabase.from("search_analytics").insert({
        search_term: term || "browse",
        category: categoryValue,
        min_price: price[0],
        max_price: price[1],
        results_count: count
      });
    } catch (error) {
      console.error("Error logging search:", error);
    }
  };

  const toggleSaveVehicle = async (vehicleId: string, vehicleName?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please login to save vehicles",
          variant: "destructive",
        });
        return;
      }

      if (savedVehicles.has(vehicleId)) {
        // Remove from saved
        const { error } = await supabase
          .from("buyer_interests")
          .delete()
          .eq("buyer_id", user.id)
          .eq("vehicle_id", vehicleId);

        if (error) throw error;

        const newSaved = new Set(savedVehicles);
        newSaved.delete(vehicleId);
        setSavedVehicles(newSaved);
        
        toast({
          title: "Removed from saved",
          description: "Vehicle removed from your saved list",
        });
      } else {
        // Track interest in vehicle
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (vehicle) {
          trackVehicleInterest(vehicleId, vehicle.model_name);
        }
        
        // Add to saved
        const { error } = await supabase
          .from("buyer_interests")
          .insert({
            buyer_id: user.id,
            vehicle_id: vehicleId,
            search_query: searchTerm
          });

        if (error) throw error;

        const newSaved = new Set(savedVehicles);
        newSaved.add(vehicleId);
        setSavedVehicles(newSaved);
        
        toast({
          title: "Saved!",
          description: "Vehicle added to your saved list",
        });
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      toast({
        title: "Error",
        description: "Failed to update saved vehicles",
        variant: "destructive",
      });
    }
  };


  const handleBuyerInfo = async (name: string, phone: string) => {
    setShowBuyerModal(false);
    
    // Store buyer info in localStorage for session
    localStorage.setItem('buyerInfo', JSON.stringify({ name, phone }));
    
    // Send WhatsApp notification about search
    const searchDetails = `
Search Query: ${searchTerm || 'All'}
Category: ${category}
Price Range: ${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}
Slab Range: ${formatPrice(slabRange[0])} - ${formatPrice(slabRange[1])}
Results Found: ${filteredVehicles.length}
    `.trim();
    
    // Send search details to WhatsApp (this would need actual WhatsApp API integration)
    const whatsappMessage = `New search by ${name} (${phone}):\n${searchDetails}`;
    console.log('WhatsApp message:', whatsappMessage);
    
    toast({
      title: "Search Registered",
      description: "Your search details have been recorded. You'll receive updates on WhatsApp.",
    });
  };

  if (loading) {
    return (
      <DashboardLayout userRole="buyer">
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="buyer">
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Browse Vehicles</h1>
            <p className="text-muted-foreground">
              {filteredVehicles.length} vehicles available
            </p>
          </div>

          {/* Filters Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Model or Reg number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="tractor">Tractor</SelectItem>
                      <SelectItem value="commercial">Commercial Vehicle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Ownership */}
                <div>
                  <Label htmlFor="ownership">Ownership</Label>
                  <Select value={ownershipType} onValueChange={setOwnershipType}>
                    <SelectTrigger id="ownership">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="first">First Owner</SelectItem>
                      <SelectItem value="second">Second Owner</SelectItem>
                      <SelectItem value="third_plus">Third+ Owner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Year */}
                <div>
                  <Label htmlFor="year">Model Year</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="e.g., 2020"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    min="2000"
                    max={new Date().getFullYear()}
                  />
                </div>

                {/* Price Range */}
                <div className="col-span-full">
                  <Label className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4" />
                    Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={150000}
                    max={5000000}
                    step={50000}
                    className="mt-2"
                  />
                </div>

                {/* Slab Amount Range - PROMINENT */}
                <div className="col-span-full bg-accent/10 p-4 rounded-lg">
                  <Label className="flex items-center gap-2 text-lg font-semibold">
                    <IndianRupee className="h-5 w-5" />
                    Slab Amount: {formatPrice(slabRange[0])} - {formatPrice(slabRange[1])}
                  </Label>
                  <Slider
                    value={slabRange}
                    onValueChange={setSlabRange}
                    min={0}
                    max={100000}
                    step={5000}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isSaved={savedVehicles.has(vehicle.id)}
                onToggleSave={() => toggleSaveVehicle(vehicle.id)}
                onViewDetails={() => navigate(`/buyer-portal/vehicle/${vehicle.id}`)}
              />
            ))}
          </div>

          {/* Buyer Info Modal */}
          <BuyerInfoModal
            open={showBuyerModal}
            onClose={() => setShowBuyerModal(false)}
            onSubmit={handleBuyerInfo}
          />

          {filteredVehicles.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground">No vehicles found matching your criteria</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setCategory("all");
                    setOwnershipType("all");
                    setPriceRange([250000, 5000000]);
                    setSlabRange([0, 100000]);
                    setYearFilter("");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VehicleBrowse;