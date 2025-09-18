import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  User,
  Tractor,
  FileText,
  BarChart3,
  Bell,
  ArrowLeftRight,
  Plus
} from "lucide-react";
import kamthaLogo from "@/assets/om-ganesh-official-logo.jpg";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: "admin" | "seller" | "buyer";
}

const DashboardLayout = ({ children, userRole }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const getMenuItems = () => {
    switch (userRole) {
      case "admin":
        return [
          { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
          { icon: Tractor, label: "Vehicle Stock", path: "/admin/vehicles" },
          { icon: User, label: "Users", path: "/admin/users" },
          { icon: FileText, label: "Documents", path: "/admin/documents" },
          { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
          { icon: Tractor, label: "Tractor Master Data", path: "/admin/tractor-master-data" },
          { icon: Bell, label: "Notifications", path: "/admin/notifications" },
        ];
      case "seller":
        return [
          { icon: LayoutDashboard, label: "Dashboard", path: "/seller-portal" },
          { icon: Tractor, label: "My Vehicles", path: "/seller-portal/listings" },
          { icon: Plus, label: "Add Vehicle", path: "/seller-portal/add-vehicle" },
          { icon: Bell, label: "Notifications", path: "/seller-portal/notifications" },
        ];
      case "buyer":
        return [
          { icon: LayoutDashboard, label: "Dashboard", path: "/buyer-portal" },
          { icon: Tractor, label: "Browse Vehicles", path: "/buyer-portal/browse" },
          { icon: FileText, label: "My Purchases", path: "/buyer-portal/purchases" },
          { icon: Bell, label: "Notifications", path: "/buyer-portal/notifications" },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} bg-card border-r border-border transition-all duration-300`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className={`flex items-center space-x-3 ${!sidebarOpen && "justify-center"}`}>
              {sidebarOpen && (
                <>
                  <img 
                    src={kamthaLogo} 
                    alt="Kamtha" 
                    className="h-10 w-auto object-contain"
                  />
                  <div>
                    <h2 className="font-bold text-foreground">Kamtha</h2>
                    <p className="text-xs text-muted-foreground capitalize">{userRole} Portal</p>
                  </div>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                <item.icon className="h-5 w-5" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;