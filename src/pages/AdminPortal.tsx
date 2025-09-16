import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, Users, FileText, BarChart3, Settings, Car, Shield, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const AdminPortal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    navigate("/");
  };

  const stats = [
    { icon: <Users className="h-8 w-8" />, title: "Total Users", value: "11,234" },
    { icon: <FileText className="h-8 w-8" />, title: "Active Listings", value: "342" },
    { icon: <BarChart3 className="h-8 w-8" />, title: "Transactions", value: "1,456" },
    { icon: <Settings className="h-8 w-8" />, title: "Pending Approvals", value: "23" },
  ];

  return (
    <DashboardLayout userRole="admin">
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage the entire platform</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>Manage buyers and sellers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/admin/users">
                  <Button className="w-full">View All Users</Button>
                </Link>
                <Link to="/admin/users">
                  <Button className="w-full" variant="outline">Manage Roles</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle Management
                </CardTitle>
                <CardDescription>Oversee all vehicle listings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/admin/vehicles">
                  <Button className="w-full">All Listings</Button>
                </Link>
                <Link to="/admin/vehicles">
                  <Button className="w-full" variant="outline">Pending Approvals</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Verification
                </CardTitle>
                <CardDescription>Verify RC, insurance, and other documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/admin/documents">
                  <Button className="w-full">Review Documents</Button>
                </Link>
                <Link to="/admin/documents">
                  <Button className="w-full" variant="outline">Verification Queue</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Analytics & Reports
                </CardTitle>
                <CardDescription>Platform insights and metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/admin/analytics">
                  <Button className="w-full">View Analytics</Button>
                </Link>
                <Link to="/admin/analytics">
                  <Button className="w-full" variant="outline">Revenue Dashboard</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPortal;