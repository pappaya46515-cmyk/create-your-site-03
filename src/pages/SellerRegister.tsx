import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { EmailPasswordAuth } from "@/components/EmailPasswordAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SellerRegister = () => {
  const navigate = useNavigate();
  const [showDetailsForm, setShowDetailsForm] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
  });

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName.trim()) {
      setShowDetailsForm(false);
    }
  };

  const handleAuthSuccess = () => {
    navigate("/portal-select");
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
              <CardTitle className="text-2xl">Register as Seller</CardTitle>
              <CardDescription>
                Create your account to start listing pre-owned agricultural equipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showDetailsForm ? (
                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="businessName">Business Name (Optional)</Label>
                    <Input
                      id="businessName"
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="Enter your business name"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Continue
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Button
                      type="button"
                      variant="link"
                      className="p-0"
                      onClick={() => navigate("/auth")}
                    >
                      Sign In
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="mb-4 p-3 bg-muted rounded-lg space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Name:</span> {formData.fullName}
                    </p>
                    {formData.businessName && (
                      <p className="text-sm">
                        <span className="font-medium">Business:</span> {formData.businessName}
                      </p>
                    )}
                  </div>
                  
                  <EmailPasswordAuth
                    userType="seller"
                    fullName={formData.fullName}
                    businessName={formData.businessName}
                    onSuccess={handleAuthSuccess}
                    isSignUp={true}
                  />

                  <div className="text-center mt-4">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm"
                      onClick={() => setShowDetailsForm(true)}
                    >
                      Change Details
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SellerRegister;