import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LogOut, Search, Heart, MessageCircle, FileText, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const BuyerPortal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    navigate("/");
  };

  const stats = [
    { icon: <Search className="h-8 w-8" />, title: "Vehicles Viewed", value: "45" },
    { icon: <Heart className="h-8 w-8" />, title: "Saved Vehicles", value: "8" },
    { icon: <MessageCircle className="h-8 w-8" />, title: "Active Inquiries", value: "3" },
    { icon: <FileText className="h-8 w-8" />, title: "Agreements", value: "2" },
  ];

  return (
    <DashboardLayout userRole="buyer">
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Buyer Dashboard</h1>
              <p className="text-muted-foreground">Find your perfect vehicle</p>
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
            <Button size="lg" className="w-full md:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Browse All Vehicles
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Search</CardTitle>
                <CardDescription>Find vehicles matching your needs</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-2">Browse Tractors</Button>
                <Button className="w-full mb-2" variant="outline">Commercial Vehicles</Button>
                <Button className="w-full mb-2" variant="outline">Farm Equipment</Button>
                <Button className="w-full" variant="outline">Advanced Search</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My Favorites</CardTitle>
                <CardDescription>Vehicles you've saved for later</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-2">View Saved (8)</Button>
                <Button className="w-full mb-2" variant="outline">Compare Vehicles</Button>
                <Button className="w-full" variant="outline">Share List</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inquiries & Messages</CardTitle>
                <CardDescription>Communication with sellers</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-2">Active Chats (3)</Button>
                <Button className="w-full mb-2" variant="outline">New Messages</Button>
                <Button className="w-full" variant="outline">Chat History</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Purchase Documents</CardTitle>
                <CardDescription>Agreements and paperwork</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-2">View Agreements</Button>
                <Button className="w-full mb-2" variant="outline">Pending Documents</Button>
                <Button className="w-full" variant="outline">Download All</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
                <CardDescription>Price trends and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Average tractor price: ₹4.5L - ₹6L
                </span>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>We're here to assist you</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-2" variant="outline">Contact Support</Button>
                <Button className="w-full" variant="outline">Buying Guide</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BuyerPortal;