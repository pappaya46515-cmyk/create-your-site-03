import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Calendar, IndianRupee, FileText, Download, Eye } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { formatPrice } from "@/lib/formatPrice";
import { Database } from "@/integrations/supabase/types";

type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];
type Agreement = Database["public"]["Tables"]["agreements"]["Row"];

interface Purchase {
  vehicle: Vehicle;
  agreement?: Agreement;
  purchaseDate: string;
}

const BuyerPurchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch vehicles where current user is the buyer
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from("vehicles")
        .select("*")
        .eq("buyer_id", user.id)
        .eq("status", "sold");

      if (vehiclesError) throw vehiclesError;

      // Fetch agreements for these vehicles
      const vehicleIds = vehiclesData?.map(v => v.id) || [];
      const { data: agreementsData } = await supabase
        .from("agreements")
        .select("*")
        .in("vehicle_id", vehicleIds);

      // Combine data
      const purchasesData: Purchase[] = vehiclesData?.map(vehicle => ({
        vehicle,
        agreement: agreementsData?.find(a => a.vehicle_id === vehicle.id),
        purchaseDate: vehicle.sold_date || vehicle.created_at || new Date().toISOString()
      })) || [];

      setPurchases(purchasesData);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      toast({
        title: "Error",
        description: "Failed to load your purchases",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAgreement = (agreement: Agreement) => {
    if (agreement.pdf_url) {
      window.open(agreement.pdf_url, "_blank");
    } else {
      toast({
        title: "No Agreement",
        description: "Agreement document not available yet",
        variant: "destructive"
      });
    }
  };


  return (
    <DashboardLayout userRole="buyer">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">My Purchases</h1>
          <p className="text-muted-foreground">View your purchased vehicles and agreements</p>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading your purchases...</div>
        ) : purchases.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Purchases Yet</h3>
              <p className="text-muted-foreground mb-4">You haven't purchased any vehicles yet</p>
              <Button onClick={() => window.location.href = "/buyer-portal/browse"}>
                Browse Vehicles
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Mobile View - Cards */}
            <div className="block md:hidden space-y-4">
              {purchases.map((purchase) => (
                <Card key={purchase.vehicle.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{purchase.vehicle.model_name}</CardTitle>
                    <CardDescription>
                      {purchase.vehicle.model_year} • {purchase.vehicle.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="font-semibold">{formatPrice(Number(purchase.vehicle.deal_value))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Purchase Date</span>
                        <span>{new Date(purchase.purchaseDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Registration</span>
                        <span>{purchase.vehicle.registration_number || "N/A"}</span>
                      </div>
                    </div>
                    {purchase.agreement && (
                      <Button 
                        className="w-full"
                        onClick={() => handleDownloadAgreement(purchase.agreement!)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Agreement
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop View - Table */}
            <Card className="hidden md:block">
              <CardHeader>
                <CardTitle>Purchase History</CardTitle>
                <CardDescription>All your vehicle purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Registration</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Purchase Date</TableHead>
                        <TableHead>Agreement</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchases.map((purchase) => (
                        <TableRow key={purchase.vehicle.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div>{purchase.vehicle.model_name}</div>
                              <div className="text-sm text-muted-foreground">{purchase.vehicle.model_year}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{purchase.vehicle.category}</Badge>
                          </TableCell>
                          <TableCell>{purchase.vehicle.registration_number || "N/A"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <IndianRupee className="h-3 w-3" />
                              {formatPrice(Number(purchase.vehicle.deal_value))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(purchase.purchaseDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            {purchase.agreement ? (
                              <Button 
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadAgreement(purchase.agreement!)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            ) : (
                              <span className="text-sm text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BuyerPurchases;