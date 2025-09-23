import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, UserPlus } from "lucide-react";

interface EmailPasswordAuthProps {
  userType: "buyer" | "seller";
  fullName?: string;
  businessName?: string;
  onSuccess: () => void;
  isSignUp?: boolean;
}

export function EmailPasswordAuth({ userType, fullName, businessName, onSuccess, isSignUp = true }: EmailPasswordAuthProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Validate password
    if (password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    // Validate password match for sign up
    if (isSignUp && password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      if (isSignUp) {
        // Sign up new user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              business_name: businessName,
              user_type: userType,
            },
            emailRedirectTo: `${window.location.origin}/portal-select`,
          },
        });

        if (error) throw error;

        if (data.user) {
          // Add user role
          const { error: roleError } = await supabase
            .from("user_roles")
            .insert({
              user_id: data.user.id,
              role: userType,
            });

          if (roleError && !roleError.message.includes("duplicate")) {
            console.error("Role assignment error:", roleError);
          }

          toast({
            title: "Registration Successful!",
            description: "Please check your email to verify your account. You can now log in.",
          });
          
          onSuccess();
        }
      } else {
        // Sign in existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          toast({
            title: "Welcome back!",
            description: "Successfully signed in to your account",
          });
          
          onSuccess();
        }
      }
    } catch (error: any) {
      toast({
        title: isSignUp ? "Registration Failed" : "Sign In Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email Address *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          We'll use this for account notifications
        </p>
      </div>

      <div>
        <Label htmlFor="password">Password *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            required
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {isSignUp ? "Minimum 6 characters" : "Enter your account password"}
        </p>
      </div>

      {isSignUp && (
        <div>
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isSignUp ? "Creating Account..." : "Signing In..."}
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" />
            {isSignUp ? "Create Account" : "Sign In"}
          </>
        )}
      </Button>
    </form>
  );
}