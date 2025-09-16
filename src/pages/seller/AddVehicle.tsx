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
import { Loader2, Save, ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const AddVehicle = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Vehicle form state
  const [formData, setFormData] = useState({
    model_name: "",
    model_year: new Date().getFullYear(),
    category: "tractor" as "tractor" | "other_vehicle",
    ownership_type: "kamtha" as "kamtha" | "third_party",
    deal_value: 250000,
    slab_amount: 0,
    registration_number: "",
    engine_number: "",
    rc_owner_name: "",
    rc_owner_address: "",
    rc_owner_contact: "",
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

    if (!formData.model_name || !formData.rc_owner_name) {
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

      // Navigate to document upload for this vehicle
      navigate(`/seller-portal/vehicles/${data.id}/documents`);
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
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                    onValueChange={(value) => setFormData({ ...formData, category: value as "tractor" | "other_vehicle" })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tractor">Tractor</SelectItem>
                      <SelectItem value="other_vehicle">Commercial Vehicle</SelectItem>
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

          {/* RC Owner Details */}
          <Card>
            <CardHeader>
              <CardTitle>RC Owner Details</CardTitle>
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
                <Label htmlFor="rc_owner_address">Owner Address</Label>
                <Textarea
                  id="rc_owner_address"
                  value={formData.rc_owner_address}
                  onChange={(e) => setFormData({ ...formData, rc_owner_address: e.target.value })}
                  placeholder="Complete address as per RC"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="rc_owner_contact">Contact Number</Label>
                <Input
                  id="rc_owner_contact"
                  value={formData.rc_owner_contact}
                  onChange={(e) => setFormData({ ...formData, rc_owner_contact: e.target.value })}
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                />
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
                Add Vehicle & Upload Documents
              </>
            )}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddVehicle;