import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Users, Car, TrendingUp, Search, FileText, IndianRupee, Calendar, Phone, AlertCircle, Clock, Activity } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Analytics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    soldVehicles: 0,
    
    activeListings: 0,
    totalDocuments: 0,
    recentSearches: 0,
    usersByRole: { admin: 0, seller: 0, buyer: 0 }
  });
  const [buyerActivity, setBuyerActivity] = useState<any[]>([]);
  const [searchAnalytics, setSearchAnalytics] = useState<any[]>([]);
  const [vehicleInterests, setVehicleInterests] = useState<any[]>([]);
  const [slowMovingStock, setSlowMovingStock] = useState<any[]>([]);
  const [pendingCCUploads, setPendingCCUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
    fetchBuyerActivity();
    fetchSearchAnalytics();
    fetchVehicleInterests();
    fetchSlowMovingStock();
    fetchPendingCCUploads();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch unique users count
      const { data: uniqueUsers } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("user_id", "user_id");

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
        .select("status, deal_value, created_at");

      const totalVehicles = vehiclesData?.length || 0;
      const soldVehicles = vehiclesData?.filter(v => v.status === "sold").length || 0;
      const activeListings = vehiclesData?.filter(v => v.status === "available").length || 0;

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

  const fetchBuyerActivity = async () => {
    try {
      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data } = await supabase
        .from("buyer_activity")
        .select("*")
        .gte("login_date", today.toISOString())
        .order("login_date", { ascending: false });

      setBuyerActivity(data || []);
    } catch (error) {
      console.error("Error fetching buyer activity:", error);
    }
  };

  const fetchSearchAnalytics = async () => {
    try {
      const { data } = await supabase
        .from("search_analytics")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      setSearchAnalytics(data || []);
    } catch (error) {
      console.error("Error fetching search analytics:", error);
    }
  };

  const fetchVehicleInterests = async () => {
    try {
      const { data } = await supabase
        .from("buyer_interests")
        .select(`
          *,
          vehicles!inner(model_name, category, deal_value)
        `)
        .order("created_at", { ascending: false })
        .limit(20);

      setVehicleInterests(data || []);
    } catch (error) {
      console.error("Error fetching vehicle interests:", error);
    }
  };

  const fetchSlowMovingStock = async () => {
    try {
      // Get vehicles that have been available for more than 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data } = await supabase
        .from("vehicles")
        .select("*")
        .eq("status", "available")
        .lte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at", { ascending: true });

      setSlowMovingStock(data || []);
    } catch (error) {
      console.error("Error fetching slow moving stock:", error);
    }
  };

  const fetchPendingCCUploads = async () => {
    try {
      const { data } = await supabase
        .from("vehicle_cc_uploads")
        .select(`
          *,
          vehicles!inner(model_name, registration_number, buyer_id)
        `)
        .is("cc_image_url", null)
        .order("created_at", { ascending: false });

      setPendingCCUploads(data || []);
    } catch (error) {
      console.error("Error fetching pending CC uploads:", error);
    }
  };

  const handleCallBuyer = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const sendWhatsAppReminder = async (buyerId: string, vehicleId: string) => {
    toast({
      title: "WhatsApp Reminder",
      description: "WhatsApp reminder feature will be integrated with WhatsApp Business API"
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateDaysOld = (date: string) => {
    const created = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const statCards = [
    { icon: <Users className="h-8 w-8" />, title: "Total Users", value: stats.totalUsers, color: "text-blue-500" },
    { icon: <Car className="h-8 w-8" />, title: "Total Vehicles", value: stats.totalVehicles, color: "text-green-500" },
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

            <Tabs defaultValue="buyer-activity" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                <TabsTrigger value="buyer-activity">Buyer Activity</TabsTrigger>
                <TabsTrigger value="search-analytics">Search Analytics</TabsTrigger>
                <TabsTrigger value="interests">Buyer Interests</TabsTrigger>
                <TabsTrigger value="slow-stock">Slow Moving Stock</TabsTrigger>
                <TabsTrigger value="cc-uploads">CC Uploads</TabsTrigger>
              </TabsList>

              <TabsContent value="buyer-activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Buyer Activity</CardTitle>
                    <CardDescription>Today's buyer logins and activities for follow-up</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {buyerActivity.length === 0 ? (
                      <Alert>
                        <Activity className="h-4 w-4" />
                        <AlertDescription>No buyer activity recorded today</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Buyer Name</TableHead>
                              <TableHead>Contact</TableHead>
                              <TableHead>Login Time</TableHead>
                              <TableHead>Search Query</TableHead>
                              <TableHead>Interested Vehicle</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {buyerActivity.map((activity) => (
                              <TableRow key={activity.id}>
                                <TableCell>{activity.buyer_name || "N/A"}</TableCell>
                                <TableCell>{activity.buyer_contact || "N/A"}</TableCell>
                                <TableCell>{new Date(activity.login_date).toLocaleTimeString()}</TableCell>
                                <TableCell>{activity.search_query || "-"}</TableCell>
                                <TableCell>{activity.vehicle_interested_name || "-"}</TableCell>
                                <TableCell>
                                  {activity.buyer_contact && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleCallBuyer(activity.buyer_contact)}
                                    >
                                      <Phone className="h-4 w-4 mr-1" />
                                      Call
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="search-analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Search Analytics</CardTitle>
                    <CardDescription>What buyers are searching for</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {searchAnalytics.length === 0 ? (
                      <Alert>
                        <Search className="h-4 w-4" />
                        <AlertDescription>No search data available</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Search Term</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Price Range</TableHead>
                              <TableHead>Results</TableHead>
                              <TableHead>Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {searchAnalytics.map((search) => (
                              <TableRow key={search.id}>
                                <TableCell className="font-medium">{search.search_term}</TableCell>
                                <TableCell>
                                  {search.category && <Badge variant="outline">{search.category}</Badge>}
                                </TableCell>
                                <TableCell>
                                  {search.min_price && search.max_price
                                    ? `${formatCurrency(search.min_price)} - ${formatCurrency(search.max_price)}`
                                    : "-"}
                                </TableCell>
                                <TableCell>{search.results_count || 0}</TableCell>
                                <TableCell>{new Date(search.created_at).toLocaleDateString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="interests">
                <Card>
                  <CardHeader>
                    <CardTitle>Buyer Interests</CardTitle>
                    <CardDescription>Vehicles buyers have shown interest in - Click to call them</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {vehicleInterests.length === 0 ? (
                      <Alert>
                        <TrendingUp className="h-4 w-4" />
                        <AlertDescription>No buyer interests recorded yet</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Vehicle</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Contacted</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {vehicleInterests.map((interest) => (
                              <TableRow key={interest.id} className="cursor-pointer hover:bg-muted/50">
                                <TableCell>{interest.vehicles?.model_name}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{interest.vehicles?.category}</Badge>
                                </TableCell>
                                <TableCell>{formatCurrency(interest.vehicles?.deal_value)}</TableCell>
                                <TableCell>{new Date(interest.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  {interest.contacted ? (
                                    <Badge variant="default">Contacted</Badge>
                                  ) : (
                                    <Badge variant="secondary">Pending</Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="slow-stock">
                <Card>
                  <CardHeader>
                    <CardTitle>Slow Moving Stock</CardTitle>
                    <CardDescription>Vehicles not moving in the market (30+ days)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {slowMovingStock.length === 0 ? (
                      <Alert>
                        <Clock className="h-4 w-4" />
                        <AlertDescription>No slow moving stock identified</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Vehicle</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Days Old</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {slowMovingStock.map((vehicle) => (
                              <TableRow key={vehicle.id}>
                                <TableCell className="font-medium">{vehicle.model_name}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{vehicle.category}</Badge>
                                </TableCell>
                                <TableCell>{formatCurrency(vehicle.deal_value)}</TableCell>
                                <TableCell>
                                  <Badge variant="destructive">{calculateDaysOld(vehicle.created_at)} days</Badge>
                                </TableCell>
                                <TableCell>
                                  <Button size="sm" variant="outline">Review Pricing</Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cc-uploads">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending CC Uploads</CardTitle>
                    <CardDescription>Vehicles sold but CC not uploaded yet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {pendingCCUploads.length === 0 ? (
                      <Alert>
                        <FileText className="h-4 w-4" />
                        <AlertDescription>All CC documents are uploaded</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-4">
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            {pendingCCUploads.length} vehicles pending CC upload
                          </AlertDescription>
                        </Alert>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Vehicle</TableHead>
                                <TableHead>Registration</TableHead>
                                <TableHead>Sold Date</TableHead>
                                <TableHead>Reminder Sent</TableHead>
                                <TableHead>Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {pendingCCUploads.map((upload) => (
                                <TableRow key={upload.id}>
                                  <TableCell>{upload.vehicles?.model_name}</TableCell>
                                  <TableCell>{upload.vehicles?.registration_number || "N/A"}</TableCell>
                                  <TableCell>{new Date(upload.created_at).toLocaleDateString()}</TableCell>
                                  <TableCell>
                                    {upload.reminder_sent ? (
                                      <Badge variant="default">Sent</Badge>
                                    ) : (
                                      <Badge variant="secondary">Not Sent</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => sendWhatsAppReminder(upload.buyer_id, upload.vehicle_id)}
                                    >
                                      Send WhatsApp
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="mt-8">
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
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;