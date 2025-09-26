import { useState, useRef, useEffect } from "react";
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
import { VehicleFormWithMasterData } from "@/components/VehicleFormWithMasterData";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const AddVehicle = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showAgreementPreview, setShowAgreementPreview] = useState(false);
  const agreementRef = useRef<HTMLDivElement>(null);
  
  // Master data states
  const [makes, setMakes] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [filteredModels, setFilteredModels] = useState<any[]>([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  
  // Vehicle form state with all required fields
  const [formData, setFormData] = useState({
    // Basic Info
    model_name: "",
    model_year: new Date().getFullYear(),
    category: "tractor" as "tractor" | "commercial" | "agriculture" | "other_vehicle",
    ownership_type: "kamtha" as "kamtha" | "third_party",
    deal_value: 150000,
    hp: "",
    hp_range: "",
    
    // Vehicle Numbers
    registration_number: "",
    engine_number: "",
    vehicle_number: "",
    chassis_number: "",
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
    
    // Documents
    // Documents
    photos: [] as File[],
    
    // Terms
    terms_accepted: false,
  });

  // Validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate deal value (minimum ₹1,50,000 as per database constraint)
    if (formData.deal_value < 150000) {
      newErrors.deal_value = "Deal value must be at least ₹1,50,000/-";
    }

    // Validate seller Aadhaar
    if (formData.seller_aadhaar && formData.seller_aadhaar.length !== 12) {
      newErrors.seller_aadhaar = "Aadhaar number must be exactly 12 digits";
    }

    // Validate contact numbers
    if (formData.seller_contact && formData.seller_contact.length !== 10) {
      newErrors.seller_contact = "Contact number must be exactly 10 digits";
    }

    if (formData.seller_contact && formData.seller_contact.length !== 10) {
      newErrors.seller_contact = "Contact number must be exactly 10 digits";
    }

    // Validate pincode
    if (formData.seller_pincode && formData.seller_pincode.length !== 6) {
      newErrors.seller_pincode = "Pincode must be exactly 6 digits";
    }

    // Check required fields
    const requiredFields = [
      'model_name', 'seller_name', 'seller_father_name', 'seller_address',
      'seller_pincode', 'seller_contact', 'seller_aadhaar'
    ];

    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${field.replace(/_/g, ' ')} is required`;
      }
    });

    // Check terms acceptance
    if (!formData.terms_accepted) {
      newErrors.terms_accepted = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, photos: Array.from(e.target.files) });
    }
  };

  const handlePrint = () => {
    // Create a style element for print-specific styles
    const printStyles = document.createElement('style');
    printStyles.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #agreement-content, #agreement-content * {
          visibility: visible;
        }
        #agreement-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }
    `;
    
    // Add styles to document
    document.head.appendChild(printStyles);
    
    // Print
    window.print();
    
    // Clean up - remove the style element after a short delay
    setTimeout(() => {
      document.head.removeChild(printStyles);
    }, 100);
  };

  const generatePDF = async () => {
    if (!agreementRef.current) return;

    // Check if insurance and RC numbers are provided
    if (!formData.insurance_number || !formData.rc_number) {
      toast({
        title: "Missing Information",
        description: "Please enter both Insurance Number and RC Number before generating the PDF.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Create canvas from the agreement HTML
      const canvas = await html2canvas(agreementRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save the PDF
      pdf.save(`vehicle_listing_${formData.seller_name}_${Date.now()}.pdf`);
      
      toast({
        title: "PDF Generated",
        description: "Vehicle listing PDF has been downloaded successfully."
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix all errors before submitting.",
        variant: "destructive"
      });
      return;
    }

    // Show agreement preview
    setShowAgreementPreview(true);
  };

  const confirmAndSave = async () => {
    try {
      setLoading(true);
      
      // Get user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Save vehicle to database
      const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .insert({
          seller_id: user.id,
          ownership_type: formData.ownership_type,
          category: formData.category,
          // Start as draft, seller needs to submit for approval
          status: 'archived', // Using 'archived' as draft status
          deal_value: formData.deal_value,
          registration_number: formData.registration_number || null,
          engine_number: formData.engine_number || null,
          model_name: formData.model_name,
          model_year: formData.model_year,
        })
        .select()
        .single();

      if (vehicleError) throw vehicleError;

      // Skip agreement creation as there's no buyer yet
      // Agreement will be created when vehicle is sold

      // Upload photos if any
      if (formData.photos.length > 0) {
        for (const photo of formData.photos) {
          const fileName = `${vehicle.id}/${Date.now()}_${photo.name}`;
          const { error: uploadError } = await supabase.storage
            .from('vehicle-photos')
            .upload(fileName, photo);

          if (uploadError) {
            console.error('Photo upload error:', uploadError);
          }
        }
      }

      // Generate PDF after successful save
      await generatePDF();

      toast({
        title: "Success",
        description: "Vehicle listing created successfully!",
      });

      navigate('/seller-portal/listings');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to save vehicle listing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout userRole="seller">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/seller-portal')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Add New Vehicle</h1>
            <p className="text-gray-600 mt-2">List your vehicle and generate sale agreement</p>
          </div>

          {!showAgreementPreview ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Display Location Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Display Location</CardTitle>
                  <CardDescription>
                    Select whether this is a Kamta or Non-Kamta (Third Party) display
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
                        Kamta Display
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="third_party" id="third_party" />
                      <Label htmlFor="third_party" className="font-medium cursor-pointer">
                        Non-Kamta (Third Party) Display
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
                    Final deal value must be at least ₹1,50,000/-
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="deal_value">Deal Amount (₹) - Minimum: ₹1,50,000</Label>
                    <Input
                      id="deal_value"
                      type="number"
                      min="150000"
                      value={formData.deal_value}
                      onChange={(e) => setFormData({ ...formData, deal_value: parseInt(e.target.value) || 0 })}
                      className={errors.deal_value ? "border-destructive" : ""}
                    />
                    {errors.deal_value && (
                      <p className="text-sm text-destructive">{errors.deal_value}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Seller Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Seller Details</CardTitle>
                  <CardDescription>
                    Enter the seller's information
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seller_name">Full Name *</Label>
                    <Input
                      id="seller_name"
                      value={formData.seller_name}
                      onChange={(e) => setFormData({ ...formData, seller_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seller_father_name">Father's Name *</Label>
                    <Input
                      id="seller_father_name"
                      value={formData.seller_father_name}
                      onChange={(e) => setFormData({ ...formData, seller_father_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="seller_address">Full Address *</Label>
                    <Textarea
                      id="seller_address"
                      value={formData.seller_address}
                      onChange={(e) => setFormData({ ...formData, seller_address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seller_pincode">Pincode (6 digits) *</Label>
                    <Input
                      id="seller_pincode"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      value={formData.seller_pincode}
                      onChange={(e) => setFormData({ ...formData, seller_pincode: e.target.value })}
                      className={errors.seller_pincode ? "border-destructive" : ""}
                      required
                    />
                    {errors.seller_pincode && (
                      <p className="text-sm text-destructive">{errors.seller_pincode}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seller_contact">Contact Number (10 digits) *</Label>
                    <Input
                      id="seller_contact"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      value={formData.seller_contact}
                      onChange={(e) => setFormData({ ...formData, seller_contact: e.target.value })}
                      className={errors.seller_contact ? "border-destructive" : ""}
                      required
                    />
                    {errors.seller_contact && (
                      <p className="text-sm text-destructive">{errors.seller_contact}</p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="seller_aadhaar">Aadhaar Number (12 digits) *</Label>
                    <Input
                      id="seller_aadhaar"
                      maxLength={12}
                      pattern="[0-9]{12}"
                      value={formData.seller_aadhaar}
                      onChange={(e) => setFormData({ ...formData, seller_aadhaar: e.target.value })}
                      className={errors.seller_aadhaar ? "border-destructive" : ""}
                      required
                    />
                    {errors.seller_aadhaar && (
                      <p className="text-sm text-destructive">{errors.seller_aadhaar}</p>
                    )}
                  </div>
                </CardContent>
              </Card>


              {/* Vehicle Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Vehicle Information</CardTitle>
                  <CardDescription>
                    Select or enter the vehicle details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VehicleFormWithMasterData 
                    formData={formData} 
                    setFormData={setFormData} 
                    errors={errors} 
                  />
                  <div className="space-y-2">
                    <Label htmlFor="registration_number">Registration Number</Label>
                    <Input
                      id="registration_number"
                      value={formData.registration_number}
                      onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engine_number">Engine Number</Label>
                    <Input
                      id="engine_number"
                      value={formData.engine_number}
                      onChange={(e) => setFormData({ ...formData, engine_number: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle_number">Vehicle Number</Label>
                    <Input
                      id="vehicle_number"
                      value={formData.vehicle_number}
                      onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chassis_number">Chassis Number</Label>
                    <Input
                      id="chassis_number"
                      value={formData.chassis_number}
                      onChange={(e) => setFormData({ ...formData, chassis_number: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serial_number">Serial Number</Label>
                    <Input
                      id="serial_number"
                      value={formData.serial_number}
                      onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Document Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Upload Documents</CardTitle>
                  <CardDescription>
                    Upload vehicle photos and documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="photos">Vehicle Photos</Label>
                    <Input
                      id="photos"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-gray-500">
                      {formData.photos.length > 0 
                        ? `${formData.photos.length} file(s) selected`
                        : "No files selected"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Terms & Conditions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.terms_accepted}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, terms_accepted: checked as boolean })
                      }
                    />
                    <div className="space-y-1">
                      <Label htmlFor="terms" className="cursor-pointer">
                        I accept the terms and conditions *
                      </Label>
                      <p className="text-sm text-gray-600">
                        By checking this box, you agree to our Terms of Service and Privacy Policy.
                      </p>
                      {errors.terms_accepted && (
                        <p className="text-sm text-destructive">{errors.terms_accepted}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/seller-portal')}
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
                      <FileText className="mr-2 h-4 w-4" />
                      Preview Agreement
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            // Agreement Preview Section
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Complete Vehicle Information</CardTitle>
                  <CardDescription>
                    Please enter the Insurance and RC numbers to generate the complete agreement
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="insurance_number">Insurance Number *</Label>
                    <Input
                      id="insurance_number"
                      value={formData.insurance_number}
                      onChange={(e) => setFormData({ ...formData, insurance_number: e.target.value })}
                      placeholder="Enter insurance number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rc_number">RC Number *</Label>
                    <Input
                      id="rc_number"
                      value={formData.rc_number}
                      onChange={(e) => setFormData({ ...formData, rc_number: e.target.value })}
                      placeholder="Enter RC number"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Vehicle Listing Document</CardTitle>
                  <CardDescription>
                    Review the vehicle details before listing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    ref={agreementRef}
                    id="agreement-content"
                    className="bg-white p-8 rounded-lg shadow-sm"
                    style={{ fontFamily: 'serif' }}
                  >
                    <div className="text-center mb-8">
                      <h1 className="text-2xl font-bold mb-2">VEHICLE LISTING DOCUMENT</h1>
                      <p className="text-gray-600">
                        Date: {new Date().toLocaleDateString('en-IN')}
                      </p>
                    </div>

                    <div className="space-y-6 text-sm">
                      <div>
                        <h2 className="font-bold text-lg mb-3">PROPERTY TYPE</h2>
                        <p className="leading-relaxed">
                          This sale agreement is for a <strong>{formData.ownership_type === 'kamtha' ? 'Kamta' : 'Non-Kamta (Third Party)'}</strong> property.
                        </p>
                      </div>

                      <div>
                        <h2 className="font-bold text-lg mb-3">PARTIES TO THE AGREEMENT</h2>
                        <div className="space-y-3">
                          <div>
                            <p className="font-semibold">SELLER:</p>
                            <p>Name: {formData.seller_name}</p>
                            <p>Father's Name: {formData.seller_father_name}</p>
                            <p>Address: {formData.seller_address}</p>
                            <p>Pincode: {formData.seller_pincode}</p>
                            <p>Contact: {formData.seller_contact}</p>
                            <p>Aadhaar: XXXX-XXXX-{formData.seller_aadhaar.slice(-4)}</p>
                          </div>
                          </div>
                      </div>

                      <div>
                        <h2 className="font-bold text-lg mb-3">VEHICLE DETAILS</h2>
                        <p>Model: {formData.model_name}</p>
                        <p>Year: {formData.model_year}</p>
                        <p>Category: {formData.category.replace(/_/g, ' ').toUpperCase()}</p>
                        {formData.registration_number && <p>Registration Number: {formData.registration_number}</p>}
                        {formData.engine_number && <p>Engine Number: {formData.engine_number}</p>}
                        {formData.vehicle_number && <p>Vehicle Number: {formData.vehicle_number}</p>}
                        {formData.chassis_number && <p>Chassis Number: {formData.chassis_number}</p>}
                        {formData.serial_number && <p>Serial Number: {formData.serial_number}</p>}
                        {formData.insurance_number && <p>Insurance Number: {formData.insurance_number}</p>}
                        {formData.rc_number && <p>RC Number: {formData.rc_number}</p>}
                      </div>

                      <div>
                        <h2 className="font-bold text-lg mb-3">SALE CONSIDERATION</h2>
                        <p className="leading-relaxed">
                          The total sale consideration for the above-mentioned vehicle is 
                          <strong> ₹{formData.deal_value.toLocaleString('en-IN')}/-</strong> 
                          (Rupees {new Intl.NumberFormat('en-IN').format(formData.deal_value)} only).
                        </p>
                      </div>

                      <div>
                        <h2 className="font-bold text-lg mb-3">DECLARATION</h2>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>The Seller hereby confirms that the vehicle is free from all encumbrances and has clear title.</li>
                          <li>All vehicle details provided are accurate and complete.</li>
                          <li>The vehicle is in working condition as described.</li>
                          <li>All documents related to the vehicle are genuine and valid.</li>
                          <li>This listing is governed by the laws of India.</li>
                        </ol>
                      </div>

                      <div className="mt-12 pt-8 border-t">
                        <div className="text-center">
                          <div>
                            <p className="mb-12">_______________________</p>
                            <p className="font-semibold">Seller's Signature</p>
                            <p>{formData.seller_name}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8">
                        <p className="font-semibold">Witnesses:</p>
                        <div className="grid grid-cols-2 gap-8 mt-4">
                          <div>
                            <p>1. _______________________</p>
                            <p className="text-xs mt-1">Name & Signature</p>
                          </div>
                          <div>
                            <p>2. _______________________</p>
                            <p className="text-xs mt-1">Name & Signature</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowAgreementPreview(false)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Edit
                </Button>
                <div className="space-x-4">
                  <Button
                    variant="outline"
                    onClick={handlePrint}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                  <Button
                    variant="outline"
                    onClick={generatePDF}
                    disabled={loading || !formData.insurance_number || !formData.rc_number}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </>
                    )}
                  </Button>
                  <Button 
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
                        <Save className="mr-2 h-4 w-4" />
                        Confirm & Save
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddVehicle;