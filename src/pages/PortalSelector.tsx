import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Package, Shield, ArrowRight, Loader2, Home, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PortalSelector = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const fetchUserRoles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) throw error;

      const roles = data?.map(r => r.role) || [];
      setUserRoles(roles);

      // Always show selector so users can add roles
      // (Removed auto-redirect when only one role)

    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const addRole = async (role: "buyer" | "seller") => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: user.id, role });

      if (error) throw error;

      // Navigate to the new portal
      navigate(role === "seller" ? "/seller-portal" : "/buyer-portal");
    } catch (error) {
      console.error("Error adding role:", error);
      setLoading(false);
    }
  };

  const becomeAdmin = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('bootstrap_admin');
      
      if (error) throw error;
      
      if (data) {
        toast({
          title: "Success!",
          description: "You are now an admin. Refreshing...",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast({
          title: "Admin Already Exists",
          description: "An admin user already exists in the system.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error becoming admin:", error);
      toast({
        title: "Error",
        description: "Failed to become admin. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Select Portal</h1>
          <p className="text-muted-foreground">Choose how you want to use the system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buyer Portal */}
          {userRoles.includes("buyer") ? (
            <Card className="hover:shadow-strong transition-shadow cursor-pointer" 
                  onClick={() => navigate("/buyer-portal")}>
              <CardHeader>
                <User className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Buyer Portal</CardTitle>
                <CardDescription>Browse and purchase vehicles</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate("/buyer-portal")}> 
                  Enter Buyer Portal <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="hover:shadow-strong transition-shadow">
              <CardHeader>
                <User className="h-12 w-12 text-muted-foreground mb-4" />
                <CardTitle>Become a Buyer</CardTitle>
                <CardDescription>Browse and purchase vehicles</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => addRole("buyer")}
                  disabled={loading}
                >
                  Add Buyer Access <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Seller Portal */}
          {userRoles.includes("seller") ? (
            <Card className="hover:shadow-strong transition-shadow cursor-pointer"
                  onClick={() => navigate("/seller-portal")}>
              <CardHeader>
                <Package className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Seller Portal</CardTitle>
                <CardDescription>List and manage your vehicles</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate("/seller-portal")}> 
                  Enter Seller Portal <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="hover:shadow-strong transition-shadow">
              <CardHeader>
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <CardTitle>Become a Seller</CardTitle>
                <CardDescription>List and manage your vehicles</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => addRole("seller")}
                  disabled={loading}
                >
                  Add Seller Access <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Admin Portal (if applicable) */}
          {userRoles.includes("admin") && (
            <Card className="md:col-span-2 hover:shadow-strong transition-shadow cursor-pointer"
                  onClick={() => navigate("/admin")}>
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Admin Portal</CardTitle>
                <CardDescription>Manage the entire platform</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate("/admin")}> 
                  Enter Admin Portal <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Help Text for Admin */}
        {!userRoles.includes("admin") && (
          <div className="mt-6 text-center">
            <div className="text-sm text-muted-foreground mb-4">
              <p>Admin access is granted by system administrators only.</p>
              <p>Contact support if you need admin privileges.</p>
            </div>
            <Button 
              variant="outline"
              onClick={becomeAdmin}
              disabled={loading}
              className="gap-2"
            >
              <Crown className="h-4 w-4" />
              Become First Admin (One-time setup)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortalSelector;