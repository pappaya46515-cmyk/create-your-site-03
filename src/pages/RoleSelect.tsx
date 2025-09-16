import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, User } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

const RoleSelect = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return navigate("/auth");
      setUserId(session.user.id);
    });
  }, [navigate]);

  const setRole = async (role: "buyer" | "seller") => {
    if (!userId) return;
    try {
      setLoading(true);
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) throw error;
      // Redirect to respective portal
      navigate(role === "seller" ? "/seller-portal" : "/buyer-portal");
    } catch (e) {
      console.error("Failed to set role", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Choose your portal</CardTitle>
            <CardDescription>Select how you want to use the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Button
                size="lg"
                className="w-full"
                disabled={loading}
                onClick={() => setRole("buyer")}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <User className="mr-2 h-4 w-4" />}
                Continue as Buyer
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                disabled={loading}
                onClick={() => setRole("seller")}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shield className="mr-2 h-4 w-4" />}
                Continue as Seller
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default RoleSelect;
