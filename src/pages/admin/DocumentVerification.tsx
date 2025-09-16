import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Search, CheckCircle, XCircle, Eye, Download, Calendar } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Database } from "@/integrations/supabase/types";

type VehicleDocument = Database["public"]["Tables"]["vehicle_documents"]["Row"] & {
  vehicle: {
    model_name: string;
    registration_number: string | null;
    rc_owner_name: string | null;
  };
};

const DocumentVerification = () => {
  const [documents, setDocuments] = useState<VehicleDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<VehicleDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("pending");
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [searchTerm, typeFilter, statusFilter]);

  const fetchDocuments = async () => {
    try {
      const { data: documentsData, error: docsError } = await supabase
        .from("vehicle_documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (docsError) throw docsError;

      // Fetch vehicle details for each document
      const vehicleIds = [...new Set(documentsData?.map(d => d.vehicle_id) || [])];
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from("vehicles")
        .select("id, model_name, registration_number, rc_owner_name")
        .in("id", vehicleIds);

      if (vehiclesError) throw vehiclesError;

      // Merge document and vehicle data
      const documentsWithVehicles = documentsData?.map(doc => {
        const vehicle = vehiclesData?.find(v => v.id === doc.vehicle_id);
        return {
          ...doc,
          vehicle: {
            model_name: vehicle?.model_name || "Unknown",
            registration_number: vehicle?.registration_number || null,
            rc_owner_name: vehicle?.rc_owner_name || null
          }
        };
      }) || [];

      setDocuments(documentsWithVehicles);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = [...documents];

    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.vehicle.model_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.vehicle.registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.document_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(doc => doc.document_type === typeFilter);
    }

    setFilteredDocuments(filtered);
  };

  const handleVerifyDocument = async (documentId: string) => {
    try {
      // In a real application, you would update a verification status field
      toast({
        title: "Success",
        description: "Document verified successfully"
      });
      
      // Create notification for the vehicle owner
      const doc = documents.find(d => d.id === documentId);
      if (doc) {
        await supabase
          .from("notifications")
          .insert({
            user_id: doc.uploaded_by,
            message: `Your ${doc.document_type} has been verified`,
            type: "document_verified"
          });
      }
      
      fetchDocuments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify document",
        variant: "destructive"
      });
    }
  };

  const handleRejectDocument = async (documentId: string) => {
    if (!confirm("Are you sure you want to reject this document?")) return;

    try {
      const { error } = await supabase
        .from("vehicle_documents")
        .delete()
        .eq("id", documentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document rejected and removed"
      });
      
      fetchDocuments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject document",
        variant: "destructive"
      });
    }
  };

  const handleViewDocument = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  const getDocumentTypeBadge = (type: string) => {
    const badges: { [key: string]: string } = {
      "RC": "bg-blue-500",
      "Insurance": "bg-green-500",
      "NOC": "bg-purple-500",
      "Form 29": "bg-yellow-500",
      "Form 30": "bg-orange-500"
    };
    
    return <Badge className={badges[type] || ""}>{type}</Badge>;
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Document Verification</CardTitle>
            <CardDescription>
              Total Documents: {documents.length} | Pending Review: {documents.filter(d => !d.file_url.includes("verified")).length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by vehicle, document type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="RC">RC</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                  <SelectItem value="NOC">NOC</SelectItem>
                  <SelectItem value="Form 29">Form 29</SelectItem>
                  <SelectItem value="Form 30">Form 30</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Documents Table */}
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Registration</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">No documents found</TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            {document.vehicle.model_name}
                          </div>
                        </TableCell>
                        <TableCell>{getDocumentTypeBadge(document.document_type)}</TableCell>
                        <TableCell>{document.vehicle.registration_number || "N/A"}</TableCell>
                        <TableCell>{document.vehicle.rc_owner_name || "N/A"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {new Date(document.created_at!).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDocument(document.file_url)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600"
                              onClick={() => handleVerifyDocument(document.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => handleRejectDocument(document.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DocumentVerification;