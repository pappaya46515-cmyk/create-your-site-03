import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Save, Users, Trophy, Building2, MapPin, Plus, Trash2, Edit } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface LeadershipMember {
  id: string;
  name: string;
  designation: string;
  description: string;
  photo_url: string | null;
  order_index: number;
}

interface Award {
  id: string;
  title: string;
  year: string;
  organization: string;
}

interface Branch {
  id: string;
  location: string;
  address: string;
  contact: string;
}

const AboutPageCMS = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Leadership state
  const [leadership, setLeadership] = useState<LeadershipMember[]>([
    {
      id: "1",
      name: "Mr. Bhaskar Kamath",
      designation: "CMD - Om Ganesh Group",
      description: "Our visionary founder who started 38 years back with freelance sales of tractors.",
      photo_url: null,
      order_index: 1
    },
    {
      id: "2",
      name: "Mr. Harsha B Kamath",
      designation: "CEO - Om Ganesh Group",
      description: "A mechanical engineer with AutoCAD expertise from Bangalore.",
      photo_url: null,
      order_index: 2
    },
    {
      id: "3",
      name: "Mrs. Shalini Kamath",
      designation: "Director",
      description: "A pillar of moral support, managing business operations.",
      photo_url: null,
      order_index: 3
    },
    {
      id: "4",
      name: "Mr. Vishwas Kamath",
      designation: "Managing Partner",
      description: "With vast IT industry experience, manages Channagiri TAFE dealership.",
      photo_url: null,
      order_index: 4
    }
  ]);

  // Awards state
  const [awards, setAwards] = useState<Award[]>([
    { id: "1", title: "Best Customer Relation Award", year: "2005-06", organization: "Govt of Karnataka" },
    { id: "2", title: "Excellence in Manufacturing", year: "2010-11", organization: "Chamber of Commerce, Shimoga" },
    { id: "3", title: "Star Dealer Award", year: "2000-2013", organization: "TAFE" }
  ]);

  // Branches state
  const [branches, setBranches] = useState<Branch[]>([
    { id: "1", location: "Shimoga", address: "Shankar Mutt Road (HQ)", contact: "" },
    { id: "2", location: "Shikaripura", address: "", contact: "" },
    { id: "3", location: "Chanagiri", address: "", contact: "" },
    { id: "4", location: "Honnali", address: "", contact: "" },
    { id: "5", location: "Anvati", address: "", contact: "" },
    { id: "6", location: "Udupi", address: "", contact: "" },
    { id: "7", location: "Sagar", address: "", contact: "" }
  ]);

  // Company info state
  const [companyInfo, setCompanyInfo] = useState({
    tagline: "38 Years of Excellence in Agricultural Equipment & Services",
    mission: "To provide transparent and reliable agricultural equipment services",
    vision: "To be the most trusted platform for agricultural equipment",
    values: "Integrity, transparency, and farmer-first approach",
    kannada_tagline: "ಕರ್ನಾಟಕದಾದ್ಯಂತ 11,000+ ರೈತರಿಗೆ ಪಾರದರ್ಶಕತೆಯಿಂದ ಉಪಯೋಗಿಸಿದ ರೈತ ಉಪಕರಣಗಳ ಮಾರಾಟದ ವ್ಯವಸ್ಥೆ"
  });

  // Photo upload handler for leadership
  const handlePhotoUpload = async (file: File, memberId: string) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const fileName = `leadership/${memberId}-${Date.now()}.${file.name.split('.').pop()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("vehicle-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("vehicle-images")
        .getPublicUrl(fileName);

      // Update leadership member with photo URL
      setLeadership(prev => prev.map(member => 
        member.id === memberId 
          ? { ...member, photo_url: publicUrl }
          : member
      ));

      toast({
        title: "Success",
        description: "Photo uploaded successfully"
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload photo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Gallery photo upload
  const handleGalleryUpload = async (file: File, category: string) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const fileName = `gallery/${category}-${Date.now()}.${file.name.split('.').pop()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("vehicle-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      toast({
        title: "Success",
        description: `${category} photo uploaded successfully`
      });
    } catch (error) {
      console.error("Error uploading gallery photo:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload gallery photo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Save all changes
  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      // Here you would save to database
      // For now, just show success message
      toast({
        title: "Success",
        description: "About page content updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">About Page Management</h1>
            <p className="text-muted-foreground">Manage content and photos for the About Us page</p>
          </div>
          <Button onClick={handleSaveChanges} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>

        <Tabs defaultValue="leadership" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="leadership">Leadership</TabsTrigger>
            <TabsTrigger value="gallery">Photo Gallery</TabsTrigger>
            <TabsTrigger value="awards">Awards</TabsTrigger>
            <TabsTrigger value="branches">Branches</TabsTrigger>
            <TabsTrigger value="company">Company Info</TabsTrigger>
          </TabsList>

          {/* Leadership Tab */}
          <TabsContent value="leadership">
            <Card>
              <CardHeader>
                <CardTitle>Leadership Team</CardTitle>
                <CardDescription>Manage leadership team members and their photos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {leadership.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Photo Upload Area */}
                          <div className="relative">
                            {member.photo_url ? (
                              <img 
                                src={member.photo_url} 
                                alt={member.name}
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                <Users className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                            <label className="absolute bottom-2 right-2">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handlePhotoUpload(file, member.id);
                                }}
                                disabled={loading}
                              />
                              <Button size="sm" variant="secondary">
                                <Upload className="h-4 w-4 mr-1" />
                                Upload Photo
                              </Button>
                            </label>
                          </div>

                          {/* Member Details */}
                          <div className="space-y-2">
                            <Input
                              value={member.name}
                              onChange={(e) => {
                                setLeadership(prev => prev.map(m => 
                                  m.id === member.id ? { ...m, name: e.target.value } : m
                                ));
                              }}
                              placeholder="Name"
                            />
                            <Input
                              value={member.designation}
                              onChange={(e) => {
                                setLeadership(prev => prev.map(m => 
                                  m.id === member.id ? { ...m, designation: e.target.value } : m
                                ));
                              }}
                              placeholder="Designation"
                            />
                            <Textarea
                              value={member.description}
                              onChange={(e) => {
                                setLeadership(prev => prev.map(m => 
                                  m.id === member.id ? { ...m, description: e.target.value } : m
                                ));
                              }}
                              placeholder="Description"
                              rows={3}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Button 
                  className="mt-4" 
                  variant="outline"
                  onClick={() => {
                    const newMember: LeadershipMember = {
                      id: Date.now().toString(),
                      name: "",
                      designation: "",
                      description: "",
                      photo_url: null,
                      order_index: leadership.length + 1
                    };
                    setLeadership([...leadership, newMember]);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Photo Gallery Tab */}
          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle>Photo Gallery</CardTitle>
                <CardDescription>Upload photos for different sections of the About page</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Hero Banner */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Hero Banner</h3>
                      <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                        <Building2 className="h-8 w-8 text-gray-400" />
                      </div>
                      <label>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleGalleryUpload(file, "hero");
                          }}
                          disabled={loading}
                        />
                        <Button variant="outline" className="w-full">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Hero Image
                        </Button>
                      </label>
                    </CardContent>
                  </Card>

                  {/* Team Photo */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Team Photo</h3>
                      <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <label>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleGalleryUpload(file, "team");
                          }}
                          disabled={loading}
                        />
                        <Button variant="outline" className="w-full">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Team Photo
                        </Button>
                      </label>
                    </CardContent>
                  </Card>

                  {/* Facility Photos */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Facility Photos</h3>
                      <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                        <Building2 className="h-8 w-8 text-gray-400" />
                      </div>
                      <label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files) {
                              Array.from(files).forEach(file => 
                                handleGalleryUpload(file, "facility")
                              );
                            }
                          }}
                          disabled={loading}
                        />
                        <Button variant="outline" className="w-full">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Facility Photos
                        </Button>
                      </label>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Awards Tab */}
          <TabsContent value="awards">
            <Card>
              <CardHeader>
                <CardTitle>Awards & Recognition</CardTitle>
                <CardDescription>Manage company awards and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {awards.map((award) => (
                    <div key={award.id} className="flex gap-4 items-center">
                      <Trophy className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                      <Input
                        value={award.title}
                        onChange={(e) => {
                          setAwards(prev => prev.map(a => 
                            a.id === award.id ? { ...a, title: e.target.value } : a
                          ));
                        }}
                        placeholder="Award Title"
                        className="flex-1"
                      />
                      <Input
                        value={award.year}
                        onChange={(e) => {
                          setAwards(prev => prev.map(a => 
                            a.id === award.id ? { ...a, year: e.target.value } : a
                          ));
                        }}
                        placeholder="Year"
                        className="w-32"
                      />
                      <Input
                        value={award.organization}
                        onChange={(e) => {
                          setAwards(prev => prev.map(a => 
                            a.id === award.id ? { ...a, organization: e.target.value } : a
                          ));
                        }}
                        placeholder="Organization"
                        className="flex-1"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setAwards(prev => prev.filter(a => a.id !== award.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const newAward: Award = {
                        id: Date.now().toString(),
                        title: "",
                        year: "",
                        organization: ""
                      };
                      setAwards([...awards, newAward]);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Award
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branches Tab */}
          <TabsContent value="branches">
            <Card>
              <CardHeader>
                <CardTitle>Branch Locations</CardTitle>
                <CardDescription>Manage branch office information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {branches.map((branch) => (
                    <div key={branch.id} className="flex gap-4 items-center">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                      <Input
                        value={branch.location}
                        onChange={(e) => {
                          setBranches(prev => prev.map(b => 
                            b.id === branch.id ? { ...b, location: e.target.value } : b
                          ));
                        }}
                        placeholder="Location"
                        className="flex-1"
                      />
                      <Input
                        value={branch.address}
                        onChange={(e) => {
                          setBranches(prev => prev.map(b => 
                            b.id === branch.id ? { ...b, address: e.target.value } : b
                          ));
                        }}
                        placeholder="Address"
                        className="flex-1"
                      />
                      <Input
                        value={branch.contact}
                        onChange={(e) => {
                          setBranches(prev => prev.map(b => 
                            b.id === branch.id ? { ...b, contact: e.target.value } : b
                          ));
                        }}
                        placeholder="Contact"
                        className="w-40"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setBranches(prev => prev.filter(b => b.id !== branch.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const newBranch: Branch = {
                        id: Date.now().toString(),
                        location: "",
                        address: "",
                        contact: ""
                      };
                      setBranches([...branches, newBranch]);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Branch
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Info Tab */}
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Update mission, vision, values and taglines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Company Tagline</Label>
                    <Input
                      value={companyInfo.tagline}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, tagline: e.target.value })}
                      placeholder="Company tagline"
                    />
                  </div>
                  <div>
                    <Label>Mission Statement</Label>
                    <Textarea
                      value={companyInfo.mission}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, mission: e.target.value })}
                      placeholder="Mission statement"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Vision Statement</Label>
                    <Textarea
                      value={companyInfo.vision}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, vision: e.target.value })}
                      placeholder="Vision statement"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Core Values</Label>
                    <Textarea
                      value={companyInfo.values}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, values: e.target.value })}
                      placeholder="Core values"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Kannada Tagline</Label>
                    <Textarea
                      value={companyInfo.kannada_tagline}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, kannada_tagline: e.target.value })}
                      placeholder="ಕನ್ನಡ ಟ್ಯಾಗ್‌ಲೈನ್"
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AboutPageCMS;