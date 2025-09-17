import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileImage, Check, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const CCUpload = () => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPurchasesWithCC();
  }, []);

  const fetchPurchasesWithCC = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch vehicles purchased by the user
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from("vehicles")
        .select("*")
        .eq("buyer_id", user.id)
        .eq("status", "sold");

      if (vehiclesError) throw vehiclesError;

      // Fetch CC upload status for these vehicles
      const vehicleIds = vehiclesData?.map(v => v.id) || [];
      const { data: ccData } = await supabase
        .from("vehicle_cc_uploads")
        .select("*")
        .in("vehicle_id", vehicleIds);

      // Combine data
      const purchasesWithCC = vehiclesData?.map(vehicle => {
        const ccUpload = ccData?.find(cc => cc.vehicle_id === vehicle.id);
        return {
          vehicle,
          ccUpload: ccUpload || {
            vehicle_id: vehicle.id,
            buyer_id: user.id,
            cc_image_url: null,
            uploaded_at: null
          }
        };
      }) || [];

      setPurchases(purchasesWithCC);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      toast({
        title: "Error",
        description: "Failed to load your purchases",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (vehicleId: string, file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(vehicleId);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload to storage
      const fileName = `${vehicleId}-${Date.now()}.${file.name.split('.').pop()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("vehicle-documents")
        .upload(`cc-uploads/${fileName}`, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("vehicle-documents")
        .getPublicUrl(`cc-uploads/${fileName}`);

      // Check if CC upload record exists
      const { data: existingCC } = await supabase
        .from("vehicle_cc_uploads")
        .select("id")
        .eq("vehicle_id", vehicleId)
        .eq("buyer_id", user.id)
        .maybeSingle();

      if (existingCC) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("vehicle_cc_uploads")
          .update({
            cc_image_url: publicUrl,
            uploaded_at: new Date().toISOString()
          })
          .eq("id", existingCC.id);

        if (updateError) throw updateError;
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from("vehicle_cc_uploads")
          .insert({
            vehicle_id: vehicleId,
            buyer_id: user.id,
            cc_image_url: publicUrl,
            uploaded_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: "CC document uploaded successfully"
      });

      // Refresh data
      await fetchPurchasesWithCC();
    } catch (error) {
      console.error("Error uploading CC:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload CC document",
        variant: "destructive"
      });
    } finally {
      setUploading(null);
    }
  };

  return (
    <DashboardLayout userRole="buyer">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">CC Document Upload</h1>
          <p className="text-muted-foreground">Upload clearance certificate for your purchased vehicles</p>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading your purchases...</div>
        ) : purchases.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Purchases Found</h3>
              <p className="text-muted-foreground">You haven't purchased any vehicles yet</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please upload the Clearance Certificate (CC) for each purchased vehicle. This is required for completing the transfer process.
              </AlertDescription>
            </Alert>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {purchases.map(({ vehicle, ccUpload }) => (
                <Card key={vehicle.id} className={ccUpload.cc_image_url ? "border-green-500" : "border-orange-500"}>
                  <CardHeader>
                    <CardTitle className="text-lg">{vehicle.model_name}</CardTitle>
                    <CardDescription>
                      {vehicle.registration_number || "Registration pending"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm space-y-1">
                        <p><span className="font-medium">Year:</span> {vehicle.model_year}</p>
                        <p><span className="font-medium">Category:</span> {vehicle.category}</p>
                        <p><span className="font-medium">Purchase Date:</span> {new Date(vehicle.sold_date || vehicle.created_at).toLocaleDateString()}</p>
                      </div>

                      {ccUpload.cc_image_url ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-green-600">
                            <Check className="h-5 w-5" />
                            <span className="font-medium">CC Uploaded</span>
                          </div>
                          <img 
                            src={ccUpload.cc_image_url} 
                            alt="CC Document" 
                            className="w-full h-40 object-cover rounded-lg border"
                          />
                          <label className="block">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(vehicle.id, file);
                              }}
                              disabled={uploading === vehicle.id}
                            />
                            <Button 
                              variant="outline" 
                              className="w-full"
                              disabled={uploading === vehicle.id}
                            >
                              {uploading === vehicle.id ? "Uploading..." : "Replace CC"}
                            </Button>
                          </label>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>CC not uploaded yet</AlertDescription>
                          </Alert>
                          <label className="block">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(vehicle.id, file);
                              }}
                              disabled={uploading === vehicle.id}
                            />
                            <Button 
                              className="w-full"
                              disabled={uploading === vehicle.id}
                            >
                              {uploading === vehicle.id ? (
                                "Uploading..."
                              ) : (
                                <>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload CC Document
                                </>
                              )}
                            </Button>
                          </label>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CCUpload;