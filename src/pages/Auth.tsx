import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Phone, ShieldCheck, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/portal-select");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number
    if (!phone.match(/^[6-9]\d{9}$/)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit Indian mobile number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const fullPhoneNumber = `+91${phone}`;
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
      });

      if (error) throw error;

      setOtpSent(true);
      toast({
        title: "OTP Sent!",
        description: `A 6-digit code has been sent to ${fullPhoneNumber}`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to send OTP",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const fullPhoneNumber = `+91${phone}`;
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: fullPhoneNumber,
        token: otp,
        type: "sms",
      });

      if (error) throw error;

      if (data.session) {
        toast({
          title: "Welcome back!",
          description: "Successfully signed in to your account",
        });
        navigate("/portal-select");
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid OTP. Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setOtpSent(false);
    setOtp("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Access your Kamtha account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Mobile Number</Label>
                    <div className="flex gap-2">
                      <div className="flex items-center px-3 bg-muted rounded-l-md border border-r-0">
                        <span className="text-sm font-medium">+91</span>
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        pattern="[6-9][0-9]{9}"
                        placeholder="10-digit mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="rounded-l-none"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter your registered mobile number
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || phone.length !== 10}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        <Phone className="mr-2 h-4 w-4" />
                        Send OTP
                      </>
                    )}
                  </Button>

                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/register/buyer")}
                      >
                        Register as Buyer
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/register/seller")}
                      >
                        Register as Seller
                      </Button>
                    </div>
                    <div className="pt-4 mt-4 border-t">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/admin-auth")}
                        className="text-xs"
                      >
                        Admin Login →
                      </Button>
                    </div>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground">
                      OTP sent to <span className="font-medium">+91{phone}</span>
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="otp">Enter 6-digit OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      pattern="[0-9]{6}"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="text-center text-2xl tracking-widest"
                      required
                      autoComplete="one-time-code"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter the 6-digit code sent to your mobile
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Verify OTP
                      </>
                    )}
                  </Button>

                  <div className="text-center space-y-2">
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="text-sm"
                    >
                      Didn't receive OTP? Resend
                    </Button>
                    
                    <div className="text-sm text-muted-foreground">
                      Wrong number?{" "}
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 text-sm"
                        onClick={handleResendOTP}
                      >
                        Change Number
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Auth;