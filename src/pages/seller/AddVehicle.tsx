import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, ArrowLeft, Tractor, Package, User, Phone, Home } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const AddVehicle = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Vehicle form state
  const [formData, setFormData] = useState({
    // Stock Type & Ownership
    stock_type: "tractor" as "tractor" | "others",
    property_owner: "party" as "kamtha" | "party",
    
    // Basic Info
    model_name: "",
    model_year: new Date().getFullYear(),
    category: "tractor" as "tractor" | "commercial" | "agriculture" | "other_vehicle",
    ownership_type: "kamtha" as "kamtha" | "third_party",
    deal_value: 250000,
    slab_amount: 0,
    registration_number: "",
    engine_number: "",
    
    // RC Owner Details
    rc_owner_name: "",
    rc_owner_address: "",
    rc_owner_contact: "",
    
    // New Buyer Details (Optional)
    new_buyer_name: "",
    new_buyer_address: "",
    new_buyer_contact: "",
    
    // Documents
    has_original_rc: false,
    has_duplicate_rc: false,
    has_insurance: false,
    has_form_29: false,
    has_form_30: false,
    has_noc: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.deal_value < 250000) {
      toast({
        title: "Invalid Deal Value",
        description: "Minimum deal value must be ₹2.5L",
        variant: "destructive",
      });
      return;
    }

    if (!formData.model_name || !formData.rc_owner_name || !formData.rc_owner_contact) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Type-safe form data
      const vehicleData = {
        ...formData,
        seller_id: user.id,
        status: "available" as const,
      };

      const { data, error } = await supabase
        .from("vehicles")
        .insert(vehicleData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Vehicle listed successfully",
      });

      // Navigate to listings
      navigate("/seller-portal/listings");
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast({
        title: "Error",
        description: "Failed to add vehicle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout userRole="seller">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/seller-portal")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Add New Vehicle</h1>
          <p className="text-muted-foreground">List your vehicle for sale</p>
          
          {/* Selected Seller Type Indicator */}
          {formData.property_owner && (
            <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm font-medium">
                Seller Type: <span className="text-primary font-bold">
                  {formData.property_owner === 'kamtha' ? 'Kamtha Owned Vehicle' : 'Third Party Vehicle'}
                </span>
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Seller Type Selection */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Home className="h-5 w-5" />
                Step 1: Select Seller Type
              </CardTitle>
              <CardDescription className="text-base">
                Please specify if this vehicle belongs to Kamtha or a Third Party seller
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    formData.property_owner === 'kamtha' 
                      ? 'border-2 border-primary bg-primary/5' 
                      : 'border hover:border-primary/50'
                  }`}
                  onClick={() => setFormData({ ...formData, property_owner: 'kamtha' })}
                >
                  <CardContent className="p-6 text-center">
                    <div className="mb-2">
                      <Home className="h-12 w-12 mx-auto text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">Kamtha Owned</h3>
                    <p className="text-sm text-muted-foreground">
                      Vehicle owned by Kamtha
                    </p>
                    <div className="mt-4">
                      <Checkbox 
                        checked={formData.property_owner === 'kamtha'}
                        className="h-5 w-5"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    formData.property_owner === 'party' 
                      ? 'border-2 border-primary bg-primary/5' 
                      : 'border hover:border-primary/50'
                  }`}
                  onClick={() => setFormData({ ...formData, property_owner: 'party' })}
                >
                  <CardContent className="p-6 text-center">
                    <div className="mb-2">
                      <User className="h-12 w-12 mx-auto text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">Third Party</h3>
                    <p className="text-sm text-muted-foreground">
                      Vehicle owned by Third Party seller
                    </p>
                    <div className="mt-4">
                      <Checkbox 
                        checked={formData.property_owner === 'party'}
                        className="h-5 w-5"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* STEP 2: Stock Type & Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Package className="h-5 w-5" />
                Step 2: Vehicle Information
              </CardTitle>
              <CardDescription>Specify stock type and basic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock_type">Stock Type *</Label>
                  <Select 
                    value={formData.stock_type}
                    onValueChange={(value) => setFormData({ ...formData, stock_type: value as "tractor" | "others" })}
                  >
                    <SelectTrigger id="stock_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tractor">
                        <div className="flex items-center gap-2">
                          <Tractor className="h-4 w-4" />
                          Tractor
                        </div>
                      </SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* STEP 3: RC Owner Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="h-5 w-5" />
                Step 3: RC Owner Details
              </CardTitle>
              <CardDescription>As per Registration Certificate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="rc_owner_name">Owner Name *</Label>
                <Input
                  id="rc_owner_name"
                  value={formData.rc_owner_name}
                  onChange={(e) => setFormData({ ...formData, rc_owner_name: e.target.value })}
                  placeholder="Full name as per RC"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="rc_owner_address">Owner Address *</Label>
                <Textarea
                  id="rc_owner_address"
                  value={formData.rc_owner_address}
                  onChange={(e) => setFormData({ ...formData, rc_owner_address: e.target.value })}
                  placeholder="Complete address as per RC"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="rc_owner_contact" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Number *
                </Label>
                <Input
                  id="rc_owner_contact"
                  value={formData.rc_owner_contact}
                  onChange={(e) => setFormData({ ...formData, rc_owner_contact: e.target.value })}
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* STEP 4: New Buyer Details (Optional) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="h-5 w-5" />
                Step 4: New Buyer Details
              </CardTitle>
              <CardDescription>Optional - Fill when vehicle is sold</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="new_buyer_name">Buyer Name</Label>
                <Input
                  id="new_buyer_name"
                  value={formData.new_buyer_name}
                  onChange={(e) => setFormData({ ...formData, new_buyer_name: e.target.value })}
                  placeholder="Full name of buyer"
                />
              </div>
              
              <div>
                <Label htmlFor="new_buyer_address">Buyer Address</Label>
                <Textarea
                  id="new_buyer_address"
                  value={formData.new_buyer_address}
                  onChange={(e) => setFormData({ ...formData, new_buyer_address: e.target.value })}
                  placeholder="Complete address of buyer"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="new_buyer_contact">Buyer Contact Number</Label>
                <Input
                  id="new_buyer_contact"
                  value={formData.new_buyer_contact}
                  onChange={(e) => setFormData({ ...formData, new_buyer_contact: e.target.value })}
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                />
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Primary details about the vehicle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="model_name">Model Name *</Label>
                  <Input
                    id="model_name"
                    value={formData.model_name}
                    onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
                    placeholder="e.g., John Deere 5310"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="model_year">Model Year *</Label>
                  <Input
                    id="model_year"
                    type="number"
                    value={formData.model_year}
                    onChange={(e) => setFormData({ ...formData, model_year: parseInt(e.target.value) })}
                    min="2000"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as "tractor" | "commercial" | "agriculture" | "other_vehicle" })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tractor">Tractor</SelectItem>
                      <SelectItem value="commercial">Commercial Vehicle</SelectItem>
                      <SelectItem value="agriculture">Agriculture Equipment</SelectItem>
                      <SelectItem value="other_vehicle">Other Vehicle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ownership">Ownership Type *</Label>
                  <Select 
                    value={formData.ownership_type}
                    onValueChange={(value) => setFormData({ ...formData, ownership_type: value as "kamtha" | "third_party" })}
                  >
                    <SelectTrigger id="ownership">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kamtha">Kamtha</SelectItem>
                      <SelectItem value="third_party">Third Party</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set the vehicle price (minimum ₹2.5L)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deal_value">Deal Value (₹) *</Label>
                  <Input
                    id="deal_value"
                    type="number"
                    value={formData.deal_value}
                    onChange={(e) => setFormData({ ...formData, deal_value: parseInt(e.target.value) })}
                    min="250000"
                    step="10000"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="slab_amount">Slab Amount (₹)</Label>
                  <Input
                    id="slab_amount"
                    type="number"
                    value={formData.slab_amount}
                    onChange={(e) => setFormData({ ...formData, slab_amount: parseInt(e.target.value) })}
                    min="0"
                    step="1000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Details */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
              <CardDescription>Registration and identification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="registration_number">Registration Number</Label>
                  <Input
                    id="registration_number"
                    value={formData.registration_number}
                    onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                    placeholder="KA-01-AB-1234"
                  />
                </div>
                
                <div>
                  <Label htmlFor="engine_number">Engine Number</Label>
                  <Input
                    id="engine_number"
                    value={formData.engine_number}
                    onChange={(e) => setFormData({ ...formData, engine_number: e.target.value })}
                    placeholder="Engine serial number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Available Documents</CardTitle>
              <CardDescription>Check all documents you have for this vehicle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_original_rc"
                    checked={formData.has_original_rc}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, has_original_rc: checked as boolean })
                    }
                  />
                  <Label htmlFor="has_original_rc">Original RC</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_duplicate_rc"
                    checked={formData.has_duplicate_rc}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, has_duplicate_rc: checked as boolean })
                    }
                  />
                  <Label htmlFor="has_duplicate_rc">Duplicate RC</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_insurance"
                    checked={formData.has_insurance}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, has_insurance: checked as boolean })
                    }
                  />
                  <Label htmlFor="has_insurance">Insurance</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_form_29"
                    checked={formData.has_form_29}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, has_form_29: checked as boolean })
                    }
                  />
                  <Label htmlFor="has_form_29">Form 29</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_form_30"
                    checked={formData.has_form_30}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, has_form_30: checked as boolean })
                    }
                  />
                  <Label htmlFor="has_form_30">Form 30</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_noc"
                    checked={formData.has_noc}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, has_noc: checked as boolean })
                    }
                  />
                  <Label htmlFor="has_noc">NOC</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button 
            type="submit" 
            size="lg" 
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Vehicle...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Add Vehicle
              </>
            )}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddVehicle;