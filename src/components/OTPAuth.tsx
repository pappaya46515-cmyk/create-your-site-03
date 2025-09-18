import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Phone, ShieldCheck } from "lucide-react";

interface OTPAuthProps {
  userType: "buyer" | "seller";
  fullName?: string;
  businessName?: string;
  onSuccess: () => void;
}

export function OTPAuth({ userType, fullName, businessName, onSuccess }: OTPAuthProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

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
        options: {
          data: {
            full_name: fullName,
            business_name: businessName,
            user_type: userType,
          },
        },
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
          title: "Success!",
          description: "You have been successfully authenticated",
        });
        
        onSuccess();
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

  const handleResendOTP = async () => {
    setOtpSent(false);
    setOtp("");
  };

  if (!otpSent) {
    return (
      <form onSubmit={handleSendOTP} className="space-y-4">
        <div>
          <Label htmlFor="phone">Mobile Number *</Label>
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
            Enter your 10-digit Indian mobile number
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
      </form>
    );
  }

  return (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">
          OTP sent to <span className="font-medium">+91{phone}</span>
        </p>
      </div>

      <div>
        <Label htmlFor="otp">Enter 6-digit OTP *</Label>
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

      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={handleResendOTP}
          disabled={loading}
          className="text-sm"
        >
          Didn't receive OTP? Resend
        </Button>
      </div>
    </form>
  );
}