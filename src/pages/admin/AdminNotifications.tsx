import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bell, BellOff, Check, Calendar, AlertTriangle, CheckCircle, AlertCircle, UserPlus, Shield } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Database } from "@/integrations/supabase/types";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification",
        variant: "destructive"
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);

      if (error) throw error;

      toast({
        title: "Success",
        description: "All notifications marked as read"
      });
      
      fetchNotifications();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark all as read",
        variant: "destructive"
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_user":
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case "security_alert":
        return <Shield className="h-5 w-5 text-red-500" />;
      case "system_update":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "document_pending":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case "vehicle_pending":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      "new_user": "New User",
      "security_alert": "Security",
      "system_update": "System",
      "document_pending": "Document",
      "vehicle_pending": "Vehicle"
    };
    
    return typeLabels[type] || "Notification";
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout userRole="admin">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">System Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                <Check className="h-4 w-4 mr-2" />
                Mark All as Read
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BellOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
              <p className="text-muted-foreground">All systems operating normally!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-all ${!notification.read ? 'border-primary bg-primary/5' : ''}`}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className={`text-sm md:text-base ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {getTypeBadge(notification.type)}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(notification.created_at!).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                            className="shrink-0"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminNotifications;