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
      // Fetch unique users count
      const { data: uniqueUsers } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("user_id", "user_id"); // This gets distinct users

      const uniqueUserIds = new Set(uniqueUsers?.map(u => u.user_id) || []);
      const actualUserCount = uniqueUserIds.size;

      // Fetch user counts by role
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role, user_id");

      // Count unique users per role
      const usersByRole = { admin: 0, seller: 0, buyer: 0 };
      const roleUsers = {
        admin: new Set<string>(),
        seller: new Set<string>(),
        buyer: new Set<string>()
      };

      rolesData?.forEach(r => {
        if (r.role in roleUsers) {
          roleUsers[r.role as keyof typeof roleUsers].add(r.user_id);
        }
      });

      usersByRole.admin = roleUsers.admin.size;
      usersByRole.seller = roleUsers.seller.size;
      usersByRole.buyer = roleUsers.buyer.size;

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
                <CardDescription>Unique users by role type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.usersByRole.admin}
                    </p>
                    <p className="text-sm text-muted-foreground">Admin Users</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {stats.usersByRole.seller}
                    </p>
                    <p className="text-sm text-muted-foreground">Unique Sellers</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {stats.usersByRole.buyer}
                    </p>
                    <p className="text-sm text-muted-foreground">Unique Buyers</p>
                  </div>
                </div>
                {stats.totalUsers === 1 && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <span className="font-semibold">⚠️ Note:</span> Currently showing test data from a single user account with multiple roles. Real data will show unique users per role.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;