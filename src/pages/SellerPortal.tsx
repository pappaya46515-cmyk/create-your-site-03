import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, Plus, Package, Eye, FileText, DollarSign } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const SellerPortal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    navigate("/");
  };

  const stats = [
    { icon: <Package className="h-8 w-8" />, title: "Active Listings", value: "12" },
    { icon: <Eye className="h-8 w-8" />, title: "Total Views", value: "1,234" },
    { icon: <FileText className="h-8 w-8" />, title: "Inquiries", value: "45" },
    { icon: <DollarSign className="h-8 w-8" />, title: "Total Sales", value: "₹25.5L" },
  ];

  return (
    <DashboardLayout userRole="seller">
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Seller Dashboard</h1>
              <p className="text-muted-foreground">Manage your vehicle listings</p>
            </div>
            <Button 
              onClick={handleLogout}
              disabled={loading}
              variant="outline"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-primary">{stat.icon}</div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mb-8">
            <Button 
              size="lg" 
              className="w-full md:w-auto"
              onClick={() => navigate("/seller-portal/add-vehicle")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Vehicle
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  My Listings
                </CardTitle>
                <CardDescription>Manage your vehicle inventory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/seller-portal/listings">
                  <Button className="w-full">View All Listings</Button>
                </Link>
                <Link to="/seller-portal/add-vehicle">
                  <Button className="w-full" variant="outline">Add New Vehicle</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Management
                </CardTitle>
                <CardDescription>Upload and manage vehicle documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/seller-portal/listings">
                  <Button className="w-full">Manage Documents</Button>
                </Link>
                <p className="text-sm text-muted-foreground text-center">
                  Add a vehicle first, then upload documents
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Sales Summary
                </CardTitle>
                <CardDescription>Track your performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/seller-portal/listings">
                  <Button className="w-full">View My Sales</Button>
                </Link>
                <Button className="w-full" variant="outline" disabled>
                  Download Reports
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/seller-portal/add-vehicle">
                  <Button className="w-full" variant="outline">Add Vehicle</Button>
                </Link>
                <Link to="/contact">
                  <Button className="w-full" variant="outline">Get Support</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SellerPortal;