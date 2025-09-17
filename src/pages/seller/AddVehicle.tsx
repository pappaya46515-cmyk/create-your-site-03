import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, ArrowLeft, Upload, FileText, Printer, Download } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const AddVehicle = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showAgreementPreview, setShowAgreementPreview] = useState(false);
  const agreementRef = useRef<HTMLDivElement>(null);
  
  // Vehicle form state with all required fields
  const [formData, setFormData] = useState({
    // Basic Info
    model_name: "",
    model_year: new Date().getFullYear(),
    category: "tractor" as "tractor" | "commercial" | "agriculture" | "other_vehicle",
    ownership_type: "kamtha" as "kamtha" | "third_party",
    deal_value: 250000,
    
    // Vehicle Numbers
    registration_number: "",
    engine_number: "",
    vehicle_number: "",
    jersey_number: "",
    serial_number: "",
    insurance_number: "",
    rc_number: "",
    
    // Seller Details
    seller_name: "",
    seller_father_name: "",
    seller_address: "",
    seller_pincode: "",
    seller_contact: "",
    seller_aadhaar: "",
    
    // Buyer Details
    buyer_name: "",
    buyer_father_name: "",
    buyer_address: "",
    buyer_pincode: "",
    buyer_contact: "",
    buyer_aadhaar: "",
    
    // Witness
    witness_signature: "",
    
    // Documents
    has_original_rc: false,
    has_duplicate_rc: false,
    has_insurance: false,
    has_form_29: false,
    has_form_30: false,
    has_noc: false,
    
    // Photo uploads
    photo1: null as File | null,
    photo2: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Deal value validation
    if (formData.deal_value < 250000) {
      newErrors.deal_value = "Deal value must be above ₹2,50,000/-";
    }
    
    // Required fields validation
    if (!formData.seller_name) newErrors.seller_name = "Seller name is required";
    if (!formData.seller_father_name) newErrors.seller_father_name = "Father's name is required";
    if (!formData.seller_address) newErrors.seller_address = "Seller address is required";
    if (!formData.seller_pincode) newErrors.seller_pincode = "Pincode is required";
    if (!formData.seller_contact) newErrors.seller_contact = "Contact number is required";
    if (!formData.seller_aadhaar) newErrors.seller_aadhaar = "Aadhaar number is required";
    
    if (!formData.buyer_name) newErrors.buyer_name = "Buyer name is required";
    if (!formData.buyer_father_name) newErrors.buyer_father_name = "Father's name is required";
    if (!formData.buyer_address) newErrors.buyer_address = "Buyer address is required";
    if (!formData.buyer_pincode) newErrors.buyer_pincode = "Pincode is required";
    if (!formData.buyer_contact) newErrors.buyer_contact = "Contact number is required";
    if (!formData.buyer_aadhaar) newErrors.buyer_aadhaar = "Aadhaar number is required";
    
    if (!formData.vehicle_number) newErrors.vehicle_number = "Vehicle number is required";
    if (!formData.jersey_number) newErrors.jersey_number = "Jersey number is required";
    if (!formData.serial_number) newErrors.serial_number = "Serial number is required";
    
    // Validate Aadhaar format (12 digits)
    if (formData.seller_aadhaar && !/^\d{12}$/.test(formData.seller_aadhaar)) {
      newErrors.seller_aadhaar = "Aadhaar must be 12 digits";
    }
    if (formData.buyer_aadhaar && !/^\d{12}$/.test(formData.buyer_aadhaar)) {
      newErrors.buyer_aadhaar = "Aadhaar must be 12 digits";
    }
    
    // Validate contact numbers (10 digits)
    if (formData.seller_contact && !/^\d{10}$/.test(formData.seller_contact)) {
      newErrors.seller_contact = "Contact must be 10 digits";
    }
    if (formData.buyer_contact && !/^\d{10}$/.test(formData.buyer_contact)) {
      newErrors.buyer_contact = "Contact must be 10 digits";
    }
    
    // Validate pincode (6 digits)
    if (formData.seller_pincode && !/^\d{6}$/.test(formData.seller_pincode)) {
      newErrors.seller_pincode = "Pincode must be 6 digits";
    }
    if (formData.buyer_pincode && !/^\d{6}$/.test(formData.buyer_pincode)) {
      newErrors.buyer_pincode = "Pincode must be 6 digits";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'photo1' | 'photo2') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, [field]: file });
    }
  };

  const generatePDF = async () => {
    if (!agreementRef.current) return;
    
    // Validate insurance and RC numbers before generating PDF
    if (!formData.insurance_number || !formData.rc_number) {
      toast({
        title: "Missing Information",
        description: "Insurance number and RC number are mandatory for agreement generation",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const canvas = await html2canvas(agreementRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Save the PDF with date and vehicle number
      const date = new Date().toISOString().split('T')[0];
      const filename = `Agreement_${date}_${formData.vehicle_number}.pdf`;
      pdf.save(filename);
      
      toast({
        title: "PDF Generated",
        description: `Agreement saved as ${filename}`,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix all errors before submitting",
        variant: "destructive",
      });
      return;
    }

    setShowAgreementPreview(true);
  };

  const confirmAndSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Save vehicle data
      const vehicleData = {
        model_name: formData.model_name,
        model_year: formData.model_year,
        category: formData.category,
        ownership_type: formData.ownership_type,
        property_owner: formData.ownership_type, // Set property_owner same as ownership_type
        deal_value: formData.deal_value,
        registration_number: formData.registration_number,
        engine_number: formData.engine_number,
        seller_id: user.id,
        status: "available" as const,
        rc_owner_name: formData.seller_name,
        rc_owner_address: formData.seller_address,
        rc_owner_contact: formData.seller_contact,
        new_buyer_name: formData.buyer_name,
        new_buyer_address: formData.buyer_address,
        new_buyer_contact: formData.buyer_contact,
        has_original_rc: formData.has_original_rc,
        has_duplicate_rc: formData.has_duplicate_rc,
        has_insurance: formData.has_insurance,
        has_form_29: formData.has_form_29,
        has_form_30: formData.has_form_30,
        has_noc: formData.has_noc,
      };

      const { data: vehicle, error: vehicleError } = await supabase
        .from("vehicles")
        .insert(vehicleData)
        .select()
        .single();

      if (vehicleError) throw vehicleError;

      // Save agreement data
      const agreementData = {
        vehicle_id: vehicle.id,
        seller_name: formData.seller_name,
        seller_father_name: formData.seller_father_name,
        seller_address: formData.seller_address,
        seller_pincode: formData.seller_pincode,
        seller_contact: formData.seller_contact,
        seller_aadhaar: formData.seller_aadhaar,
        buyer_name: formData.buyer_name,
        buyer_father_name: formData.buyer_father_name,
        buyer_address: formData.buyer_address,
        buyer_contact: formData.buyer_contact,
        vehicle_number: formData.vehicle_number,
        jersey_number: formData.jersey_number,
        serial_number: formData.serial_number,
        insurance_number: formData.insurance_number,
        rc_number: formData.rc_number,
        witness_signature: formData.witness_signature,
        created_by: user.id,
      };

      const { error: agreementError } = await supabase
        .from("agreements")
        .insert(agreementData);

      if (agreementError) throw agreementError;

      // Generate PDF
      await generatePDF();

      toast({
        title: "Success!",
        description: "Vehicle and agreement saved successfully",
      });

      navigate("/seller-portal/listings");
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        title: "Error",
        description: "Failed to save data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout userRole="seller">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
          <p className="text-muted-foreground">Complete all fields to create vehicle listing and agreement</p>
        </div>

        {!showAgreementPreview ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Property Type Selection</CardTitle>
                <CardDescription>
                  Select whether this is a Kamtha or Non-Kamtha (Third Party) property
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.ownership_type}
                  onValueChange={(value) => setFormData({ ...formData, ownership_type: value as "kamtha" | "third_party" })}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="kamtha" id="kamtha" />
                    <Label htmlFor="kamtha" className="font-medium cursor-pointer">
                      Kamtha Property
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="third_party" id="third_party" />
                    <Label htmlFor="third_party" className="font-medium cursor-pointer">
                      Non-Kamtha (Third Party) Property
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Deal Value Validation */}
            <Card className={errors.deal_value ? "border-destructive" : ""}>
              <CardHeader>
                <CardTitle className="text-xl">Deal Value</CardTitle>
                <CardDescription>
                  Final deal value must be above ₹2,50,000/-
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="deal_value">Deal Value (₹) *</Label>
                  <Input
                    id="deal_value"
                    type="number"
                    value={formData.deal_value}
                    onChange={(e) => setFormData({ ...formData, deal_value: parseInt(e.target.value) || 0 })}
                    min="250000"
                    step="10000"
                    className={errors.deal_value ? "border-destructive" : ""}
                    required
                  />
                  {errors.deal_value && (
                    <p className="text-sm text-destructive mt-1">{errors.deal_value}</p>
                  )}
                  {formData.deal_value < 250000 && (
                    <p className="text-sm text-destructive mt-1">
                      ⚠️ Not valid - Deal value must be above ₹2,50,000/-
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Seller Agreement Fields */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Seller Details</CardTitle>
                <CardDescription>Information about the seller</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="seller_name">Name *</Label>
                    <Input
                      id="seller_name"
                      value={formData.seller_name}
                      onChange={(e) => setFormData({ ...formData, seller_name: e.target.value })}
                      placeholder="Full name"
                      className={errors.seller_name ? "border-destructive" : ""}
                      required
                    />
                    {errors.seller_name && (
                      <p className="text-sm text-destructive mt-1">{errors.seller_name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="seller_father_name">S/O (Father's Name) *</Label>
                    <Input
                      id="seller_father_name"
                      value={formData.seller_father_name}
                      onChange={(e) => setFormData({ ...formData, seller_father_name: e.target.value })}
                      placeholder="Father's name"
                      className={errors.seller_father_name ? "border-destructive" : ""}
                      required
                    />
                    {errors.seller_father_name && (
                      <p className="text-sm text-destructive mt-1">{errors.seller_father_name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="seller_address">Address *</Label>
                  <Textarea
                    id="seller_address"
                    value={formData.seller_address}
                    onChange={(e) => setFormData({ ...formData, seller_address: e.target.value })}
                    placeholder="Complete address"
                    rows={3}
                    className={errors.seller_address ? "border-destructive" : ""}
                    required
                  />
                  {errors.seller_address && (
                    <p className="text-sm text-destructive mt-1">{errors.seller_address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="seller_pincode">Pincode *</Label>
                    <Input
                      id="seller_pincode"
                      value={formData.seller_pincode}
                      onChange={(e) => setFormData({ ...formData, seller_pincode: e.target.value })}
                      placeholder="6-digit pincode"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      className={errors.seller_pincode ? "border-destructive" : ""}
                      required
                    />
                    {errors.seller_pincode && (
                      <p className="text-sm text-destructive mt-1">{errors.seller_pincode}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="seller_contact">Contact Number *</Label>
                    <Input
                      id="seller_contact"
                      value={formData.seller_contact}
                      onChange={(e) => setFormData({ ...formData, seller_contact: e.target.value })}
                      placeholder="10-digit mobile"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      className={errors.seller_contact ? "border-destructive" : ""}
                      required
                    />
                    {errors.seller_contact && (
                      <p className="text-sm text-destructive mt-1">{errors.seller_contact}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="seller_aadhaar">Aadhaar Number *</Label>
                  <Input
                    id="seller_aadhaar"
                    value={formData.seller_aadhaar}
                    onChange={(e) => setFormData({ ...formData, seller_aadhaar: e.target.value })}
                    placeholder="12-digit Aadhaar"
                    pattern="[0-9]{12}"
                    maxLength={12}
                    className={errors.seller_aadhaar ? "border-destructive" : ""}
                    required
                  />
                  {errors.seller_aadhaar && (
                    <p className="text-sm text-destructive mt-1">{errors.seller_aadhaar}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Buyer Agreement Fields */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Buyer Details</CardTitle>
                <CardDescription>Information about the buyer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="buyer_name">Name *</Label>
                    <Input
                      id="buyer_name"
                      value={formData.buyer_name}
                      onChange={(e) => setFormData({ ...formData, buyer_name: e.target.value })}
                      placeholder="Full name"
                      className={errors.buyer_name ? "border-destructive" : ""}
                      required
                    />
                    {errors.buyer_name && (
                      <p className="text-sm text-destructive mt-1">{errors.buyer_name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="buyer_father_name">S/O (Father's Name) *</Label>
                    <Input
                      id="buyer_father_name"
                      value={formData.buyer_father_name}
                      onChange={(e) => setFormData({ ...formData, buyer_father_name: e.target.value })}
                      placeholder="Father's name"
                      className={errors.buyer_father_name ? "border-destructive" : ""}
                      required
                    />
                    {errors.buyer_father_name && (
                      <p className="text-sm text-destructive mt-1">{errors.buyer_father_name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="buyer_address">Address *</Label>
                  <Textarea
                    id="buyer_address"
                    value={formData.buyer_address}
                    onChange={(e) => setFormData({ ...formData, buyer_address: e.target.value })}
                    placeholder="Complete address"
                    rows={3}
                    className={errors.buyer_address ? "border-destructive" : ""}
                    required
                  />
                  {errors.buyer_address && (
                    <p className="text-sm text-destructive mt-1">{errors.buyer_address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="buyer_pincode">Pincode *</Label>
                    <Input
                      id="buyer_pincode"
                      value={formData.buyer_pincode}
                      onChange={(e) => setFormData({ ...formData, buyer_pincode: e.target.value })}
                      placeholder="6-digit pincode"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      className={errors.buyer_pincode ? "border-destructive" : ""}
                      required
                    />
                    {errors.buyer_pincode && (
                      <p className="text-sm text-destructive mt-1">{errors.buyer_pincode}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="buyer_contact">Contact Number *</Label>
                    <Input
                      id="buyer_contact"
                      value={formData.buyer_contact}
                      onChange={(e) => setFormData({ ...formData, buyer_contact: e.target.value })}
                      placeholder="10-digit mobile"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      className={errors.buyer_contact ? "border-destructive" : ""}
                      required
                    />
                    {errors.buyer_contact && (
                      <p className="text-sm text-destructive mt-1">{errors.buyer_contact}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="buyer_aadhaar">Aadhaar Number *</Label>
                  <Input
                    id="buyer_aadhaar"
                    value={formData.buyer_aadhaar}
                    onChange={(e) => setFormData({ ...formData, buyer_aadhaar: e.target.value })}
                    placeholder="12-digit Aadhaar"
                    pattern="[0-9]{12}"
                    maxLength={12}
                    className={errors.buyer_aadhaar ? "border-destructive" : ""}
                    required
                  />
                  {errors.buyer_aadhaar && (
                    <p className="text-sm text-destructive mt-1">{errors.buyer_aadhaar}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Vehicle Information</CardTitle>
                <CardDescription>Vehicle identification details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vehicle_number">Vehicle Number *</Label>
                    <Input
                      id="vehicle_number"
                      value={formData.vehicle_number}
                      onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                      placeholder="e.g., MH12AB1234"
                      className={errors.vehicle_number ? "border-destructive" : ""}
                      required
                    />
                    {errors.vehicle_number && (
                      <p className="text-sm text-destructive mt-1">{errors.vehicle_number}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="jersey_number">Jersey Number *</Label>
                    <Input
                      id="jersey_number"
                      value={formData.jersey_number}
                      onChange={(e) => setFormData({ ...formData, jersey_number: e.target.value })}
                      placeholder="Jersey number"
                      className={errors.jersey_number ? "border-destructive" : ""}
                      required
                    />
                    {errors.jersey_number && (
                      <p className="text-sm text-destructive mt-1">{errors.jersey_number}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="serial_number">Serial Number *</Label>
                    <Input
                      id="serial_number"
                      value={formData.serial_number}
                      onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                      placeholder="Serial number"
                      className={errors.serial_number ? "border-destructive" : ""}
                      required
                    />
                    {errors.serial_number && (
                      <p className="text-sm text-destructive mt-1">{errors.serial_number}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="registration_number">Registration Number</Label>
                    <Input
                      id="registration_number"
                      value={formData.registration_number}
                      onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                      placeholder="RC number"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="engine_number">Engine Number</Label>
                    <Input
                      id="engine_number"
                      value={formData.engine_number}
                      onChange={(e) => setFormData({ ...formData, engine_number: e.target.value })}
                      placeholder="Engine number"
                    />
                  </div>
                  
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
                </div>
              </CardContent>
            </Card>

            {/* Attached Documents & Photos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Attached Documents</CardTitle>
                <CardDescription>Upload required documents and photos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="witness_signature">Witness Signature</Label>
                  <Input
                    id="witness_signature"
                    value={formData.witness_signature}
                    onChange={(e) => setFormData({ ...formData, witness_signature: e.target.value })}
                    placeholder="Witness name/signature"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="photo1">1. Photo to be uploaded</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="photo1"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'photo1')}
                        className="flex-1"
                      />
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                    {formData.photo1 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.photo1.name}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="photo2">2. Photo to be uploaded</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="photo2"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'photo2')}
                        className="flex-1"
                      />
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                    {formData.photo2 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.photo2.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Available Documents</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="original_rc"
                        checked={formData.has_original_rc}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, has_original_rc: checked as boolean })
                        }
                      />
                      <Label htmlFor="original_rc">Original RC</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="duplicate_rc"
                        checked={formData.has_duplicate_rc}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, has_duplicate_rc: checked as boolean })
                        }
                      />
                      <Label htmlFor="duplicate_rc">Duplicate RC</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="insurance"
                        checked={formData.has_insurance}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, has_insurance: checked as boolean })
                        }
                      />
                      <Label htmlFor="insurance">Insurance</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="form_29"
                        checked={formData.has_form_29}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, has_form_29: checked as boolean })
                        }
                      />
                      <Label htmlFor="form_29">Form 29</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="form_30"
                        checked={formData.has_form_30}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, has_form_30: checked as boolean })
                        }
                      />
                      <Label htmlFor="form_30">Form 30</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="noc"
                        checked={formData.has_noc}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, has_noc: checked as boolean })
                        }
                      />
                      <Label htmlFor="noc">NOC</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/seller-portal")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Submit & Generate Agreement
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          // Agreement Preview
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Agreement Preview</CardTitle>
                <CardDescription>Review the agreement before finalizing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-4 bg-warning/10 border border-warning rounded-lg">
                  <p className="text-sm font-medium text-warning-foreground">
                    ⚠️ Insurance Number and RC Number are mandatory for agreement generation
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="insurance_number">Insurance Number *</Label>
                    <Input
                      id="insurance_number"
                      value={formData.insurance_number}
                      onChange={(e) => setFormData({ ...formData, insurance_number: e.target.value })}
                      placeholder="Insurance policy number"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="rc_number">RC Number *</Label>
                    <Input
                      id="rc_number"
                      value={formData.rc_number}
                      onChange={(e) => setFormData({ ...formData, rc_number: e.target.value })}
                      placeholder="Registration certificate number"
                      required
                    />
                  </div>
                </div>

                <div ref={agreementRef} className="p-8 bg-white text-black">
                  <h2 className="text-2xl font-bold text-center mb-6">VEHICLE SALE AGREEMENT</h2>
                  <p className="text-center mb-8">Date: {new Date().toLocaleDateString()}</p>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">SELLER DETAILS:</h3>
                    <p>Name: {formData.seller_name}</p>
                    <p>S/O: {formData.seller_father_name}</p>
                    <p>Address: {formData.seller_address}</p>
                    <p>Pincode: {formData.seller_pincode}</p>
                    <p>Contact: {formData.seller_contact}</p>
                    <p>Aadhaar: {formData.seller_aadhaar}</p>
                    
                    <h3 className="font-semibold text-lg mt-6">BUYER DETAILS:</h3>
                    <p>Name: {formData.buyer_name}</p>
                    <p>S/O: {formData.buyer_father_name}</p>
                    <p>Address: {formData.buyer_address}</p>
                    <p>Pincode: {formData.buyer_pincode}</p>
                    <p>Contact: {formData.buyer_contact}</p>
                    <p>Aadhaar: {formData.buyer_aadhaar}</p>
                    
                    <h3 className="font-semibold text-lg mt-6">VEHICLE DETAILS:</h3>
                    <p>Vehicle Number: {formData.vehicle_number}</p>
                    <p>Jersey Number: {formData.jersey_number}</p>
                    <p>Serial Number: {formData.serial_number}</p>
                    <p>Model: {formData.model_name}</p>
                    <p>Registration Number: {formData.registration_number}</p>
                    <p>Engine Number: {formData.engine_number}</p>
                    <p>Insurance Number: {formData.insurance_number}</p>
                    <p>RC Number: {formData.rc_number}</p>
                    <p>Deal Value: ₹{formData.deal_value.toLocaleString('en-IN')}</p>
                    
                    <h3 className="font-semibold text-lg mt-6">WITNESS:</h3>
                    <p>Signature: {formData.witness_signature}</p>
                    
                    <div className="mt-8 pt-8 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold">Seller's Signature</p>
                          <div className="mt-8 border-b border-black w-48"></div>
                        </div>
                        <div>
                          <p className="font-semibold">Buyer's Signature</p>
                          <div className="mt-8 border-b border-black w-48"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAgreementPreview(false)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Form
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.print()}
                    >
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generatePDF}
                      disabled={!formData.insurance_number || !formData.rc_number}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                    
                    <Button
                      type="button"
                      onClick={confirmAndSave}
                      disabled={loading || !formData.insurance_number || !formData.rc_number}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Confirm & Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AddVehicle;