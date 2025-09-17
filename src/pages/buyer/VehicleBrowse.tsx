import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, Eye, Heart, MessageCircle, FileCheck, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

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
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedVehicles, setSavedVehicles] = useState<Set<string>>(new Set());
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [ownershipType, setOwnershipType] = useState("all");
  const [priceRange, setPriceRange] = useState([250000, 5000000]);
  const [yearFilter, setYearFilter] = useState("");

  useEffect(() => {
    fetchVehicles();
    fetchSavedVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vehicles, searchTerm, category, ownershipType, priceRange, yearFilter]);

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

    // Year filter
    if (yearFilter) {
      const year = parseInt(yearFilter);
      filtered = filtered.filter(v => v.model_year === year);
    }

    setFilteredVehicles(filtered);

    // Log search analytics
    if (searchTerm || category !== "all" || priceRange[0] !== 250000 || priceRange[1] !== 5000000) {
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

  const toggleSaveVehicle = async (vehicleId: string) => {
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

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)}L`;
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const getDocumentCount = (vehicle: Vehicle) => {
    let count = 0;
    if (vehicle.has_original_rc || vehicle.has_duplicate_rc) count++;
    if (vehicle.has_insurance) count++;
    if (vehicle.has_form_29) count++;
    if (vehicle.has_form_30) count++;
    if (vehicle.has_noc) count++;
    return count;
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
                  <Label>Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={250000}
                    max={5000000}
                    step={50000}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="hover:shadow-strong transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{vehicle.model_name}</CardTitle>
                      <CardDescription>
                        {vehicle.model_year} • {vehicle.ownership_type === 'kamtha' ? 'Kamtha' : 'Third Party'}
                      </CardDescription>
                      {/* Display Ownership Type */}
                      <Badge 
                        variant={vehicle.ownership_type === 'kamtha' ? 'default' : 'secondary'}
                        className="mt-2"
                      >
                        {vehicle.ownership_type === 'kamtha' ? '✓ Kamtha Property' : 'Non-Kamtha (Third Party)'}
                      </Badge>
                    </div>
                    <Button
                      size="icon"
                      variant={savedVehicles.has(vehicle.id) ? "default" : "outline"}
                      onClick={() => toggleSaveVehicle(vehicle.id)}
                    >
                      <Heart className={`h-4 w-4 ${savedVehicles.has(vehicle.id) ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(vehicle.deal_value)}
                      </span>
                      {vehicle.slab_amount && (
                        <span className="text-sm text-muted-foreground">
                          +{formatPrice(vehicle.slab_amount)} slab
                        </span>
                      )}
                    </div>

                    {vehicle.registration_number && (
                      <div className="text-sm text-muted-foreground">
                        Reg: {vehicle.registration_number}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileCheck className="h-4 w-4" />
                      <span>{getDocumentCount(vehicle)} documents available</span>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1"
                        onClick={() => navigate(`/buyer-portal/vehicle/${vehicle.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Button 
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`/buyer-portal/contact/${vehicle.id}`)}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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