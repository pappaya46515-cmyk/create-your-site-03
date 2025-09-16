import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Users, Car, TrendingUp, Search, FileText, DollarSign, Calendar } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const Analytics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    soldVehicles: 0,
    totalRevenue: 0,
    activeListings: 0,
    totalDocuments: 0,
    recentSearches: 0,
    usersByRole: { admin: 0, seller: 0, buyer: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch user counts by role
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role");

      const usersByRole = { admin: 0, seller: 0, buyer: 0 };
      rolesData?.forEach(r => {
        if (r.role in usersByRole) {
          usersByRole[r.role as keyof typeof usersByRole]++;
        }
      });

      // Fetch vehicle stats
      const { data: vehiclesData } = await supabase
        .from("vehicles")
        .select("status, deal_value");

      const totalVehicles = vehiclesData?.length || 0;
      const soldVehicles = vehiclesData?.filter(v => v.status === "sold").length || 0;
      const activeListings = vehiclesData?.filter(v => v.status === "available").length || 0;
      const totalRevenue = vehiclesData
        ?.filter(v => v.status === "sold")
        .reduce((sum, v) => sum + Number(v.deal_value), 0) || 0;

      // Fetch document count
      const { count: documentCount } = await supabase
        .from("vehicle_documents")
        .select("*", { count: "exact" });

      // Fetch recent searches
      const { count: searchCount } = await supabase
        .from("search_analytics")
        .select("*", { count: "exact" });

      setStats({
        totalUsers: Object.values(usersByRole).reduce((a, b) => a + b, 0),
        totalVehicles,
        soldVehicles,
        totalRevenue,
        activeListings,
        totalDocuments: documentCount || 0,
        recentSearches: searchCount || 0,
        usersByRole
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const statCards = [
    { icon: <Users className="h-8 w-8" />, title: "Total Users", value: stats.totalUsers, color: "text-blue-500" },
    { icon: <Car className="h-8 w-8" />, title: "Total Vehicles", value: stats.totalVehicles, color: "text-green-500" },
    { icon: <DollarSign className="h-8 w-8" />, title: "Total Revenue", value: formatCurrency(stats.totalRevenue), color: "text-purple-500" },
    { icon: <TrendingUp className="h-8 w-8" />, title: "Active Listings", value: stats.activeListings, color: "text-orange-500" },
    { icon: <BarChart3 className="h-8 w-8" />, title: "Sold Vehicles", value: stats.soldVehicles, color: "text-red-500" },
    { icon: <FileText className="h-8 w-8" />, title: "Documents", value: stats.totalDocuments, color: "text-indigo-500" },
    { icon: <Search className="h-8 w-8" />, title: "Searches", value: stats.recentSearches, color: "text-teal-500" },
    { icon: <Calendar className="h-8 w-8" />, title: "Conversion Rate", value: `${stats.soldVehicles ? ((stats.soldVehicles / stats.totalVehicles) * 100).toFixed(1) : 0}%`, color: "text-pink-500" }
  ];

  return (
    <DashboardLayout userRole="admin">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

        {loading ? (
          <div className="text-center">Loading analytics...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className={stat.color}>{stat.icon}</div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown by role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Admins</span>
                    <span className="font-bold">{stats.usersByRole.admin}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sellers</span>
                    <span className="font-bold">{stats.usersByRole.seller}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Buyers</span>
                    <span className="font-bold">{stats.usersByRole.buyer}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;