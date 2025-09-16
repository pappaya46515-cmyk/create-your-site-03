import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Car, Calendar, DollarSign, FileText, Edit, Trash2, Upload, Eye } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Database } from "@/integrations/supabase/types";

type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];

const MyListings = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyVehicles();
  }, []);

  const fetchMyVehicles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast({
        title: "Error",
        description: "Failed to load your vehicles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vehicleId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", vehicleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vehicle listing deleted"
      });
      
      fetchMyVehicles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete vehicle",
        variant: "destructive"
      });
    }
  };

  const handleMarkAsSold = async (vehicleId: string) => {
    try {
      const { error } = await supabase
        .from("vehicles")
        .update({ 
          status: "sold",
          sold_date: new Date().toISOString()
        })
        .eq("id", vehicleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vehicle marked as sold"
      });
      
      fetchMyVehicles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update vehicle status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500">Available</Badge>;
      case "sold":
        return <Badge className="bg-blue-500">Sold</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "archived":
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === "available").length,
    sold: vehicles.filter(v => v.status === "sold").length,
    pending: vehicles.filter(v => v.status === "pending").length
  };

  return (
    <DashboardLayout userRole="seller">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">My Vehicle Listings</h1>
          <p className="text-muted-foreground">Manage your vehicle inventory</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Listings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.available}</div>
              <p className="text-sm text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.sold}</div>
              <p className="text-sm text-muted-foreground">Sold</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading your listings...</div>
        ) : vehicles.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Listings Yet</h3>
              <p className="text-muted-foreground mb-4">Start by adding your first vehicle</p>
              <Button onClick={() => navigate("/seller-portal/add-vehicle")}>
                Add Vehicle
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Mobile View - Cards */}
            <div className="block md:hidden space-y-4">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{vehicle.model_name}</CardTitle>
                        <CardDescription>
                          {vehicle.model_year} • {vehicle.category}
                        </CardDescription>
                      </div>
                      {getStatusBadge(vehicle.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="font-semibold">{formatPrice(Number(vehicle.deal_value))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Registration</span>
                        <span>{vehicle.registration_number || "N/A"}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/seller-portal/vehicles/${vehicle.id}/documents`)}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      {vehicle.status === "available" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsSold(vehicle.id)}
                        >
                          Mark Sold
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(vehicle.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop View - Table */}
            <Card className="hidden md:block">
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Registration</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Listed</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div>{vehicle.model_name}</div>
                              <div className="text-sm text-muted-foreground">{vehicle.model_year}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{vehicle.category}</Badge>
                          </TableCell>
                          <TableCell>{vehicle.registration_number || "N/A"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {formatPrice(Number(vehicle.deal_value))}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3" />
                              {new Date(vehicle.created_at!).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/seller-portal/vehicles/${vehicle.id}/documents`)}
                              >
                                <Upload className="h-4 w-4" />
                              </Button>
                              {vehicle.status === "available" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMarkAsSold(vehicle.id)}
                                >
                                  Sold
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(vehicle.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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

export default MyListings;