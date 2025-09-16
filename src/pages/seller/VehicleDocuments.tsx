import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, ArrowLeft, FileText, Check } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const VehicleDocuments = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [vehicle, setVehicle] = useState<any>(null);
  const [existingDocs, setExistingDocs] = useState<any[]>([]);

  const documentTypes = [
    { id: "rc", label: "Registration Certificate (RC)", required: true },
    { id: "insurance", label: "Insurance", required: false },
    { id: "form29", label: "Form 29", required: false },
    { id: "form30", label: "Form 30", required: false },
    { id: "noc", label: "NOC", required: false },
    { id: "photos", label: "Vehicle Photos", required: true },
  ];

  useEffect(() => {
    fetchVehicleData();
    fetchExistingDocuments();
  }, [vehicleId]);

  const fetchVehicleData = async () => {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", vehicleId)
        .single();

      if (error) throw error;
      setVehicle(data);
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      toast({
        title: "Error",
        description: "Failed to load vehicle data",
        variant: "destructive",
      });
    }
  };

  const fetchExistingDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from("vehicle_documents")
        .select("*")
        .eq("vehicle_id", vehicleId);

      if (error) throw error;
      setExistingDocs(data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleFileUpload = async (file: File, documentType: string) => {
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split(".").pop();
      const fileName = `${vehicleId}/${documentType}_${Date.now()}.${fileExt}`;

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("vehicle-documents")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("vehicle-documents")
        .getPublicUrl(fileName);

      // Save document record
      const { error: dbError } = await supabase
        .from("vehicle_documents")
        .insert({
          vehicle_id: vehicleId,
          document_type: documentType,
          file_url: publicUrl,
          uploaded_by: user.id,
        });

      if (dbError) throw dbError;

      toast({
        title: "Success!",
        description: `${documentType} uploaded successfully`,
      });

      fetchExistingDocuments();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Vehicle Listed!",
      description: "Your vehicle has been successfully listed for sale",
    });
    navigate("/seller-portal");
  };

  const isDocumentUploaded = (docType: string) => {
    return existingDocs.some(doc => doc.document_type === docType);
  };

  if (!vehicle) {
    return (
      <DashboardLayout userRole="seller">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

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
          <h1 className="text-3xl font-bold text-foreground">Upload Documents</h1>
          <p className="text-muted-foreground">
            Upload documents for {vehicle.model_name} ({vehicle.model_year})
          </p>
        </div>

        <div className="space-y-4">
          {documentTypes.map((docType) => (
            <Card key={docType.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {docType.label}
                    {docType.required && (
                      <span className="text-xs text-destructive">*Required</span>
                    )}
                  </span>
                  {isDocumentUploaded(docType.id) && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                </CardTitle>
                <CardDescription>
                  {docType.id === "photos" 
                    ? "Upload clear photos of your vehicle from different angles"
                    : `Upload ${docType.label} document`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    id={`file-${docType.id}`}
                    accept={docType.id === "photos" ? "image/*" : ".pdf,.jpg,.jpeg,.png"}
                    multiple={docType.id === "photos"}
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        if (docType.id === "photos") {
                          // Handle multiple photo uploads
                          Array.from(files).forEach((file, index) => {
                            handleFileUpload(file, `photo_${index + 1}`);
                          });
                        } else {
                          handleFileUpload(files[0], docType.id);
                        }
                      }
                    }}
                    disabled={uploading}
                    className="flex-1"
                  />
                  <Label htmlFor={`file-${docType.id}`} className="cursor-pointer">
                    <Button
                      type="button"
                      variant={isDocumentUploaded(docType.id) ? "outline" : "default"}
                      disabled={uploading}
                      asChild
                    >
                      <span>
                        {uploading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-4 w-4" />
                        )}
                        {isDocumentUploaded(docType.id) ? "Re-upload" : "Upload"}
                      </span>
                    </Button>
                  </Label>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/seller-portal")}
          >
            Save & Continue Later
          </Button>
          <Button
            onClick={handleComplete}
            disabled={!documentTypes.filter(d => d.required).every(d => isDocumentUploaded(d.id))}
          >
            Complete Listing
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VehicleDocuments;