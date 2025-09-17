import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, Search, Heart, MessageCircle, FileText, TrendingUp, ShoppingBag, Upload } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useBuyerTracking } from "@/hooks/useBuyerTracking";

const BuyerPortal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    viewedVehicles: 0,
    savedVehicles: 0,
    activeInquiries: 0,
    agreements: 0
  });
  const { trackLogin } = useBuyerTracking();

  useEffect(() => {
    trackLogin(); // Track when buyer logs in
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch saved vehicles count
      const { count: savedCount } = await supabase
        .from("buyer_interests")
        .select("*", { count: "exact" })
        .eq("buyer_id", user.id);

      // Fetch viewed vehicles (from buyer_activity)
      const { count: viewedCount } = await supabase
        .from("buyer_activity")
        .select("*", { count: "exact" })
        .eq("buyer_id", user.id)
        .not("vehicle_interested_id", "is", null);

      // Fetch agreements count
      const { data: vehicles } = await supabase
        .from("vehicles")
        .select("id")
        .eq("buyer_id", user.id)
        .eq("status", "sold");
      
      const vehicleIds = vehicles?.map(v => v.id) || [];
      const { count: agreementCount } = await supabase
        .from("agreements")
        .select("*", { count: "exact" })
        .in("vehicle_id", vehicleIds);

      setStats({
        viewedVehicles: viewedCount || 0,
        savedVehicles: savedCount || 0,
        activeInquiries: savedCount || 0, // Using saved as proxy for inquiries
        agreements: agreementCount || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    navigate("/");
  };

  const statsDisplay = [
    { icon: <Search className="h-8 w-8" />, title: "Vehicles Viewed", value: stats.viewedVehicles },
    { icon: <Heart className="h-8 w-8" />, title: "Saved Vehicles", value: stats.savedVehicles },
    { icon: <MessageCircle className="h-8 w-8" />, title: "Active Inquiries", value: stats.activeInquiries },
    { icon: <FileText className="h-8 w-8" />, title: "Agreements", value: stats.agreements },
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
            {statsDisplay.map((stat, index) => (
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
              onClick={() => navigate("/buyer-portal/browse")}
            >
              <Search className="mr-2 h-4 w-4" />
              Browse All Vehicles
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Vehicle Search
                </CardTitle>
                <CardDescription>Find vehicles matching your needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/buyer-portal/browse">
                  <Button className="w-full">Browse All Vehicles</Button>
                </Link>
                <Link to="/buyer-portal/browse">
                  <Button className="w-full" variant="outline">Advanced Search</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  My Favorites
                </CardTitle>
                <CardDescription>Vehicles you've saved for later</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/buyer-portal/saved">
                  <Button className="w-full">View Saved Vehicles</Button>
                </Link>
                <Link to="/buyer-portal/browse">
                  <Button className="w-full" variant="outline">Continue Browsing</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  My Purchases
                </CardTitle>
                <CardDescription>View your purchased vehicles & upload CC</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/buyer-portal/purchases">
                  <Button className="w-full">View Purchases</Button>
                </Link>
                <Link to="/buyer-portal/cc-upload">
                  <Button className="w-full" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CC Documents
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common tasks and features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/buyer-portal/browse">
                  <Button className="w-full" variant="outline">Search Vehicles</Button>
                </Link>
                <Link to="/contact">
                  <Button className="w-full" variant="outline">Contact Support</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
                <CardDescription>Real-time price trends</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Check analytics dashboard for real-time trends
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