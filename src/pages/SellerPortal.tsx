import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>My Listings</CardTitle>
                <CardDescription>Manage your vehicle inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-2">View All Listings</Button>
                <Button className="w-full mb-2" variant="outline">Active (12)</Button>
                <Button className="w-full mb-2" variant="outline">Pending (3)</Button>
                <Button className="w-full" variant="outline">Sold (8)</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Document Management</CardTitle>
                <CardDescription>Upload and manage vehicle documents</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-2">Upload Documents</Button>
                <Button className="w-full mb-2" variant="outline">RC Certificates</Button>
                <Button className="w-full mb-2" variant="outline">Insurance Papers</Button>
                <Button className="w-full" variant="outline">Forms 29/30</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Buyer Inquiries</CardTitle>
                <CardDescription>Respond to interested buyers</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-2">New Inquiries (5)</Button>
                <Button className="w-full mb-2" variant="outline">Ongoing Chats</Button>
                <Button className="w-full" variant="outline">Inquiry History</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales & Analytics</CardTitle>
                <CardDescription>Track your performance</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-2">Sales Report</Button>
                <Button className="w-full mb-2" variant="outline">View Analytics</Button>
                <Button className="w-full" variant="outline">Download Statements</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SellerPortal;