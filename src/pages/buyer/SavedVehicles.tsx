import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Heart, Car, Calendar, DollarSign, Trash2, Phone, Mail } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Database } from "@/integrations/supabase/types";

type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];

const SavedVehicles = () => {
  const [savedVehicles, setSavedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSavedVehicles();
  }, []);

  const fetchSavedVehicles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch saved vehicle IDs
      const { data: savedData, error: savedError } = await supabase
        .from("buyer_interests")
        .select("vehicle_id")
        .eq("buyer_id", user.id);

      if (savedError) throw savedError;

      if (savedData && savedData.length > 0) {
        const vehicleIds = savedData.map(s => s.vehicle_id);
        
        // Fetch vehicle details
        const { data: vehiclesData, error: vehiclesError } = await supabase
          .from("vehicles")
          .select("*")
          .in("id", vehicleIds)
          .eq("status", "available");

        if (vehiclesError) throw vehiclesError;
        setSavedVehicles(vehiclesData || []);
      } else {
        setSavedVehicles([]);
      }
    } catch (error) {
      console.error("Error fetching saved vehicles:", error);
      toast({
        title: "Error",
        description: "Failed to load saved vehicles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (vehicleId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("buyer_interests")
        .delete()
        .eq("buyer_id", user.id)
        .eq("vehicle_id", vehicleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vehicle removed from saved list"
      });
      
      fetchSavedVehicles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove vehicle",
        variant: "destructive"
      });
    }
  };

  const handleContact = async (vehicleId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Mark as contacted
      await supabase
        .from("buyer_interests")
        .update({ contacted: true })
        .eq("buyer_id", user.id)
        .eq("vehicle_id", vehicleId);

      toast({
        title: "Success",
        description: "Seller will be notified of your interest"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to contact seller",
        variant: "destructive"
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <DashboardLayout userRole="buyer">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Saved Vehicles</h1>
          <p className="text-muted-foreground">Vehicles you've saved for later</p>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading saved vehicles...</div>
        ) : savedVehicles.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Saved Vehicles</h3>
              <p className="text-muted-foreground mb-4">You haven't saved any vehicles yet</p>
              <Button onClick={() => window.location.href = "/buyer-portal/browse"}>
                Browse Vehicles
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {savedVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{vehicle.model_name}</CardTitle>
                      <CardDescription>
                        {vehicle.model_year} • {vehicle.category}
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemove(vehicle.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{formatPrice(Number(vehicle.deal_value))}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span>{vehicle.ownership_type}</span>
                    </div>
                    {vehicle.registration_number && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Reg:</span>
                        <span>{vehicle.registration_number}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      size="sm"
                      onClick={() => handleContact(vehicle.id)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                    <Button 
                      className="flex-1"
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.href = `/buyer-portal/browse`}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SavedVehicles;