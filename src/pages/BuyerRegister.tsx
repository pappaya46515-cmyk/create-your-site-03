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

const BuyerRegister = () => {
  const navigate = useNavigate();
  const [showNameForm, setShowNameForm] = useState(true);
  const [fullName, setFullName] = useState("");

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim()) {
      setShowNameForm(false);
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
              <CardTitle className="text-2xl">Register as Buyer</CardTitle>
              <CardDescription>
                Create your account to start browsing pre-owned agricultural equipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showNameForm ? (
                <form onSubmit={handleNameSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      required
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
                  <div className="mb-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Name:</span> {fullName}
                    </p>
                  </div>
                  
                  <EmailPasswordAuth
                    userType="buyer"
                    fullName={fullName}
                    onSuccess={handleAuthSuccess}
                    isSignUp={true}
                  />

                  <div className="text-center mt-4">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm"
                      onClick={() => setShowNameForm(true)}
                    >
                      Change Name
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

export default BuyerRegister;