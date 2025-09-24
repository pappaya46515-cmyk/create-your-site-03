import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Camera, FileText, Calendar, IndianRupee, Send, LogIn } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Sell = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    photos: null as File[] | null,
    registerNumber: "",
    modelName: "",
    modelType: "",
    modelYear: "",
    approxAmount: "",
    description: ""
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.registerNumber || !formData.modelName || !formData.approxAmount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Application Submitted!",
      description: "Your listing has been sent to Kamta executives for verification and approval.",
    });

    // Reset form
    setFormData({
      photos: null,
      registerNumber: "",
      modelName: "",
      modelType: "",
      modelYear: "",
      approxAmount: "",
      description: ""
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, photos: Array.from(e.target.files) });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-12 bg-gradient-earth">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              ಮಾರಾಟಗಾರ / Sell Your Pre-owned
            </h1>
            <p className="text-xl text-muted-foreground">
              List your pre-owned agricultural equipment for sale with our verification process
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {isAuthenticated ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Pre-owned Equipment Listing Form</CardTitle>
                    <CardDescription>
                      Fill in the details below to list your equipment. All listings are verified by Kamta executives.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Photo Upload */}
                      <div>
                        <Label htmlFor="photos" className="flex items-center gap-2 mb-2">
                          <Camera className="h-4 w-4" />
                          Upload Photos *
                        </Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                          <input
                            type="file"
                            id="photos"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label htmlFor="photos" className="cursor-pointer">
                            <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload equipment photos
                            </p>
                            {formData.photos && (
                              <p className="text-sm text-primary mt-2">
                                {formData.photos.length} file(s) selected
                              </p>
                            )}
                          </label>
                        </div>
                      </div>

                      {/* Registration Number */}
                      <div>
                        <Label htmlFor="registerNumber" className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4" />
                          Registration Number *
                        </Label>
                        <Input
                          id="registerNumber"
                          placeholder="Enter registration number"
                          value={formData.registerNumber}
                          onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                          required
                        />
                      </div>

                      {/* Model Name */}
                      <div>
                        <Label htmlFor="modelName">Model Name *</Label>
                        <Input
                          id="modelName"
                          placeholder="e.g., John Deere 5075E"
                          value={formData.modelName}
                          onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                          required
                        />
                      </div>

                      {/* Model Type */}
                      <div>
                        <Label htmlFor="modelType">Model Type</Label>
                        <Select
                          value={formData.modelType}
                          onValueChange={(value) => setFormData({ ...formData, modelType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select equipment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tractor">Tractor</SelectItem>
                            <SelectItem value="harvester">Harvester</SelectItem>
                            <SelectItem value="tiller">Tiller</SelectItem>
                            <SelectItem value="plough">Plough</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Model Year */}
                      <div>
                        <Label htmlFor="modelYear" className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4" />
                          Model Year
                        </Label>
                        <Input
                          id="modelYear"
                          type="date"
                          value={formData.modelYear}
                          onChange={(e) => setFormData({ ...formData, modelYear: e.target.value })}
                        />
                      </div>

                      {/* Approximate Amount */}
                      <div>
                        <Label htmlFor="approxAmount" className="flex items-center gap-2 mb-2">
                          <IndianRupee className="h-4 w-4" />
                          Approximate Amount (₹) *
                        </Label>
                        <Input
                          id="approxAmount"
                          type="number"
                          placeholder="Enter amount in rupees"
                          value={formData.approxAmount}
                          onChange={(e) => setFormData({ ...formData, approxAmount: e.target.value })}
                          required
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <Label htmlFor="description">Additional Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Provide any additional details about the equipment..."
                          rows={4}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>

                      {/* Submit Button */}
                      <Button type="submit" className="w-full bg-primary hover:bg-primary-hover text-primary-foreground" size="lg">
                        <Send className="mr-2 h-4 w-4" />
                        Submit for Verification & Approval
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="mt-6 bg-muted">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">What happens next?</h3>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      <li>1. Your submission will be sent to Kamta executives for review</li>
                      <li>2. Our team will verify the equipment details and documents</li>
                      <li>3. Once approved, your listing will be added to the buyer portal</li>
                      <li>4. You will be notified via SMS/email about the approval status</li>
                    </ol>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Login Required</CardTitle>
                  <CardDescription>
                    You need to be logged in to list your equipment for sale
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Please login or register to access the seller portal and list your pre-owned agricultural equipment.
                  </p>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => navigate("/auth")}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login / Register
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sell;