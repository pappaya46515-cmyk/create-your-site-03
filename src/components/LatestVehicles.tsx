import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, IndianRupee, Calendar, MapPin, Phone, Loader2, Tractor, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Vehicle {
  id: string;
  model_name: string;
  model_year: number;
  category: string;
  ownership_type: string;
  property_owner?: string;
  deal_value: number;
  slab_amount: number;
  registration_number: string;
  has_original_rc: boolean;
  has_duplicate_rc: boolean;
  has_insurance: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

const LatestVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLatestVehicles();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('vehicles-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vehicles',
          filter: 'status=eq.available'
        },
        () => {
          fetchLatestVehicles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLatestVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("status", "available")
        .order("updated_at", { ascending: false })
        .limit(12);

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)}L`;
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const updated = new Date(date);
    const diffMs = now.getTime() - updated.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getCategoryIcon = (category: string) => {
    return category === "tractor" ? 
      <Tractor className="h-5 w-5" /> : 
      <Truck className="h-5 w-5" />;
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Available Pre-owned Equipment
          </h2>
          <p className="text-lg text-muted-foreground">
            ಲಭ್ಯವಿರುವ ಉಪಕರಣಗಳು | Browse Our Available Equipment
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-12">
            <Tractor className="h-24 w-24 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">No equipment listed yet</p>
            <p className="text-muted-foreground mt-2">Check back soon for new listings!</p>
          </div>
        ) : (
          <>
            {/* Vehicles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {vehicles.map((vehicle) => (
                <Card 
                  key={vehicle.id} 
                  className="hover:shadow-strong transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  {/* Equipment Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    <img 
                      src={
                        vehicle.category === 'tractor' ? 'https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?w=400&h=300&fit=crop' :
                        vehicle.category === 'harvester' ? 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=400&h=300&fit=crop' :
                        vehicle.category === 'tiller' ? 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=400&h=300&fit=crop' :
                        vehicle.category === 'plough' ? 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop' :
                        'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=400&h=300&fit=crop'
                      }
                      alt={vehicle.model_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=400&h=300&fit=crop';
                      }}
                    />
                    <Badge 
                      variant="secondary"
                      className="absolute top-2 right-2"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      {getTimeAgo(vehicle.updated_at)}
                    </Badge>
                    {vehicle.property_owner === 'kamtha' && (
                      <Badge className="absolute top-2 left-2 bg-green-600 text-white">
                        ✓ Kamta Property
                      </Badge>
                    )}
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getCategoryIcon(vehicle.category)}
                          {vehicle.model_name}
                        </CardTitle>
                        <CardDescription>
                          {vehicle.model_year} Model • {vehicle.ownership_type}
                        </CardDescription>
                      </div>
                    </div>
                    
                    {/* Property Owner Badge */}
                    {vehicle.property_owner && (
                      <Badge 
                        variant={vehicle.property_owner === 'kamtha' ? 'default' : 'outline'}
                        className="mt-2"
                      >
                        {vehicle.property_owner === 'kamtha' ? '✓ Kamta Property' : 'Third Party'}
                      </Badge>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Price Display */}
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Deal Value</p>
                          <p className="text-2xl font-bold text-primary">
                            {formatPrice(vehicle.deal_value)}
                          </p>
                        </div>
                        {vehicle.slab_amount > 0 && (
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Slab</p>
                            <p className="text-lg font-semibold text-secondary">
                              +{formatPrice(vehicle.slab_amount)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Registration Number */}
                    {vehicle.registration_number && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>Reg: {vehicle.registration_number}</span>
                      </div>
                    )}

                    {/* Document Status */}
                    <div className="flex flex-wrap gap-1">
                      {vehicle.has_original_rc && (
                        <Badge variant="outline" className="text-xs">RC Original</Badge>
                      )}
                      {vehicle.has_duplicate_rc && (
                        <Badge variant="outline" className="text-xs">RC Duplicate</Badge>
                      )}
                      {vehicle.has_insurance && (
                        <Badge variant="outline" className="text-xs">Insurance</Badge>
                      )}
                    </div>

                    {/* Contact Numbers */}
                    <div className="bg-accent/10 p-3 rounded-lg space-y-1">
                      <a 
                        href="tel:9480833792" 
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        <span className="font-semibold">9480833792</span>
                      </a>
                      <a 
                        href="tel:9900045575" 
                        className="text-sm flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Phone className="h-3 w-3" />
                        <span>9900045575</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <Link to="/buy">
                <Button size="lg" className="hover-scale">
                  View All Available Equipment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LatestVehicles;