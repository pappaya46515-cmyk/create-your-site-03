import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Car, Search, CheckCircle, XCircle, AlertTriangle, Calendar, IndianRupee } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Database } from "@/integrations/supabase/types";
import { formatPrice } from "@/lib/formatPrice";

type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [searchTerm, statusFilter, categoryFilter]);

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast({
        title: "Error",
        description: "Failed to fetch vehicles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterVehicles = () => {
    let filtered = [...vehicles];

    if (searchTerm) {
      filtered = filtered.filter(vehicle => 
        vehicle.model_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.rc_owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(vehicle => vehicle.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(vehicle => vehicle.category === categoryFilter);
    }

    setFilteredVehicles(filtered);
  };

  const handleApprove = async (vehicleId: string) => {
    try {
      const { error } = await supabase
        .from("vehicles")
        .update({ status: "available" })
        .eq("id", vehicleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vehicle approved and made available"
      });
      
      fetchVehicles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve vehicle",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (vehicleId: string) => {
    try {
      const { error } = await supabase
        .from("vehicles")
        .update({ status: "archived" })
        .eq("id", vehicleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vehicle archived"
      });
      
      fetchVehicles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject vehicle",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (vehicleId: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", vehicleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vehicle deleted successfully"
      });
      
      fetchVehicles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete vehicle",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Available</Badge>;
      case "sold":
        return <Badge className="bg-blue-500">Sold</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500"><AlertTriangle className="h-3 w-3 mr-1" />Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };


  return (
    <DashboardLayout userRole="admin">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Management</CardTitle>
            <CardDescription>
              Total Vehicles: {vehicles.length} | Available: {vehicles.filter(v => v.status === 'available').length} | Sold: {vehicles.filter(v => v.status === 'sold').length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by model, registration, owner..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="bike">Bike</SelectItem>
                  <SelectItem value="scooty">Scooty</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Vehicles Table */}
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Registration</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Listed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : filteredVehicles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">No vehicles found</TableCell>
                    </TableRow>
                  ) : (
                    filteredVehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div>{vehicle.model_name}</div>
                              <div className="text-sm text-muted-foreground">{vehicle.model_year}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{vehicle.category}</Badge>
                        </TableCell>
                        <TableCell>{vehicle.registration_number || "N/A"}</TableCell>
                        <TableCell>{vehicle.rc_owner_name || "N/A"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <IndianRupee className="h-3 w-3" />
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
                            {vehicle.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600"
                                  onClick={() => handleApprove(vehicle.id)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600"
                                  onClick={() => handleReject(vehicle.id)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(vehicle.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VehicleManagement;