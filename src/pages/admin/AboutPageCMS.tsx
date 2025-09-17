import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Save, Users, Trophy, Building2, MapPin, Plus, Trash2, Edit, Loader2, Image } from "lucide-react";
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
  order_index: number;
}

interface Branch {
  id: string;
  location: string;
  address: string;
  contact: string;
  order_index: number;
}

const AboutPageCMS = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  
  // Predefined leadership team with fixed names and roles
  const defaultLeadership: LeadershipMember[] = [
    {
      id: 'bhaskar-kamath',
      name: 'Mr. Bhaskar Kamath',
      designation: 'CEO & Founder',
      description: 'Leader with over 20 years of experience in agricultural machinery',
      photo_url: null,
      order_index: 0
    },
    {
      id: 'harsha-kamath',
      name: 'Mr. Harsha Kamath',
      designation: 'Operations Manager',
      description: 'Expert in logistics and operations management',
      photo_url: null,
      order_index: 1
    },
    {
      id: 'shalini-kamath',
      name: 'Mrs. Shalini Kamath',
      designation: 'Finance Head',
      description: 'Financial strategist ensuring sustainable growth',
      photo_url: null,
      order_index: 2
    },
    {
      id: 'vishwas-kamath',
      name: 'Mr. Vishwas Kamath',
      designation: 'Technical Director',
      description: 'Technical expert in agricultural equipment and machinery',
      photo_url: null,
      order_index: 3
    }
  ];
  
  const [leadership, setLeadership] = useState<LeadershipMember[]>(defaultLeadership);
  const [awards, setAwards] = useState<Award[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [companyInfo, setCompanyInfo] = useState({
    id: "",
    tagline: "",
    mission: "",
    vision: "",
    values: "",
    kannada_tagline: "",
    hero_image_url: "",
    team_photo_url: ""
  });

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // First, ensure predefined members exist in database
      for (const member of defaultLeadership) {
        const { error } = await supabase
          .from("leadership_team")
          .upsert({
            id: member.id,
            name: member.name,
            designation: member.designation,
            description: member.description,
            order_index: member.order_index
          }, {
            onConflict: 'id'
          });
        
        if (error) {
          console.error('Error upserting member:', error);
        }
      }
      
      // Now load existing data including photos
      const { data: leadershipData, error: loadError } = await supabase
        .from("leadership_team")
        .select("*")
        .in("id", ['bhaskar-kamath', 'harsha-kamath', 'shalini-kamath', 'vishwas-kamath'])
        .order("order_index");
      
      if (loadError) {
        console.error('Error loading leadership data:', loadError);
        toast({
          title: "Error",
          description: "Failed to load leadership data",
          variant: "destructive"
        });
      } else if (leadershipData) {
        // Update state with photos from database
        setLeadership(defaultLeadership.map(member => {
          const dbMember = leadershipData.find(d => d.id === member.id);
          return dbMember ? { ...member, photo_url: dbMember.photo_url } : member;
        }));
      }

      // Load awards
      const { data: awardsData } = await supabase
        .from("company_awards")
        .select("*")
        .order("order_index");
      
      if (awardsData) {
        setAwards(awardsData);
      }

      // Load branches
      const { data: branchesData } = await supabase
        .from("branch_locations")
        .select("*")
        .order("order_index");
      
      if (branchesData) {
        setBranches(branchesData);
      }

      // Load company info
      const { data: companyData } = await supabase
        .from("company_info")
        .select("*")
        .single();
      
      if (companyData) {
        setCompanyInfo(companyData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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

    setUploading(memberId);

    try {
      // Find the member to get their name for the filename
      const member = leadership.find(m => m.id === memberId);
      if (!member) {
        throw new Error("Member not found");
      }

      // Create a unique filename based on member ID and timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `leadership/${memberId}-${Date.now()}.${fileExt}`;
      
      // Delete old photo if exists
      if (member.photo_url) {
        const oldPath = member.photo_url.split('/').slice(-2).join('/');
        if (oldPath.startsWith('leadership/')) {
          const { error: deleteError } = await supabase.storage
            .from("vehicle-images")
            .remove([oldPath]);
          
          if (deleteError) {
            console.warn('Could not delete old photo:', deleteError);
          }
        }
      }

      // Upload new photo
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("vehicle-images")
        .upload(fileName, file, { 
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("vehicle-images")
        .getPublicUrl(fileName);

      // Update in database
      const { error: updateError } = await supabase
        .from("leadership_team")
        .update({ 
          photo_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq("id", memberId);

      if (updateError) {
        console.error('Database update error:', updateError);
        throw updateError;
      }

      // Update local state immediately for responsive UI
      setLeadership(prev => prev.map(m => 
        m.id === memberId 
          ? { ...m, photo_url: publicUrl }
          : m
      ));

      toast({
        title: "Success",
        description: `Photo uploaded successfully for ${member.name}`
      });
      
      // Reload data to ensure sync
      await loadAllData();
    } catch (error: any) {
      console.error("Error uploading photo:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(null);
    }
  };

  // Save leadership member
  const saveLeadershipMember = async (member: LeadershipMember) => {
    try {
      const { error } = await supabase
        .from("leadership_team")
        .upsert({
          id: member.id,
          name: member.name,
          designation: member.designation,
          description: member.description,
          photo_url: member.photo_url,
          order_index: member.order_index
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error saving member:", error);
      throw error;
    }
  };

  // Removed add/delete functions since we have fixed leadership members

  // Save award
  const saveAward = async (award: Award) => {
    try {
      const { error } = await supabase
        .from("company_awards")
        .upsert({
          id: award.id,
          title: award.title,
          year: award.year,
          organization: award.organization,
          order_index: award.order_index
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error saving award:", error);
      throw error;
    }
  };

  // Add new award
  const addAward = async () => {
    try {
      const newAward = {
        title: "New Award",
        year: new Date().getFullYear().toString(),
        organization: "Organization",
        order_index: awards.length
      };

      const { data, error } = await supabase
        .from("company_awards")
        .insert(newAward)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setAwards([...awards, data]);
        toast({
          title: "Success",
          description: "New award added"
        });
      }
    } catch (error) {
      console.error("Error adding award:", error);
      toast({
        title: "Error",
        description: "Failed to add award",
        variant: "destructive"
      });
    }
  };

  // Delete award
  const deleteAward = async (id: string) => {
    try {
      const { error } = await supabase
        .from("company_awards")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setAwards(prev => prev.filter(a => a.id !== id));
      toast({
        title: "Success",
        description: "Award removed"
      });
    } catch (error) {
      console.error("Error deleting award:", error);
      toast({
        title: "Error",
        description: "Failed to remove award",
        variant: "destructive"
      });
    }
  };

  // Similar functions for branches
  const addBranch = async () => {
    try {
      const newBranch = {
        location: "New Location",
        address: "",
        contact: "",
        order_index: branches.length
      };

      const { data, error } = await supabase
        .from("branch_locations")
        .insert(newBranch)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setBranches([...branches, data]);
        toast({
          title: "Success",
          description: "New branch added"
        });
      }
    } catch (error) {
      console.error("Error adding branch:", error);
      toast({
        title: "Error",
        description: "Failed to add branch",
        variant: "destructive"
      });
    }
  };

  const deleteBranch = async (id: string) => {
    try {
      const { error } = await supabase
        .from("branch_locations")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setBranches(prev => prev.filter(b => b.id !== id));
      toast({
        title: "Success",
        description: "Branch removed"
      });
    } catch (error) {
      console.error("Error deleting branch:", error);
      toast({
        title: "Error",
        description: "Failed to remove branch",
        variant: "destructive"
      });
    }
  };

  // Save all changes
  const handleSaveAll = async () => {
    setLoading(true);
    try {
      // Save all leadership members
      for (const member of leadership) {
        await saveLeadershipMember(member);
      }

      // Save all awards
      for (const award of awards) {
        await saveAward(award);
      }

      // Save all branches
      for (const branch of branches) {
        const { error } = await supabase
          .from("branch_locations")
          .upsert({
            id: branch.id,
            location: branch.location,
            address: branch.address,
            contact: branch.contact,
            order_index: branch.order_index
          });
        if (error) throw error;
      }

      // Save company info
      const { error: companyError } = await supabase
        .from("company_info")
        .upsert({
          id: companyInfo.id || undefined,
          tagline: companyInfo.tagline,
          mission: companyInfo.mission,
          vision: companyInfo.vision,
          values: companyInfo.values,
          kannada_tagline: companyInfo.kannada_tagline,
          hero_image_url: companyInfo.hero_image_url,
          team_photo_url: companyInfo.team_photo_url
        });

      if (companyError) throw companyError;

      toast({
        title: "Success",
        description: "All changes saved successfully"
      });
    } catch (error) {
      console.error("Error saving changes:", error);
      toast({
        title: "Error",
        description: "Failed to save some changes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && leadership.length === 0) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">About Page Management</h1>
            <p className="text-muted-foreground">Manage content and photos for the About Us page</p>
          </div>
          <Button onClick={handleSaveAll} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
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
                    <Card key={member.id} className="relative">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Photo Upload Area */}
                          <div className="relative">
                            {member.photo_url ? (
                              <div className="relative">
                                <img 
                                  key={member.photo_url}
                                  src={member.photo_url} 
                                  alt={member.name}
                                  className="w-full h-48 object-cover rounded-lg"
                                  onError={(e) => {
                                    console.error('Image failed to load:', member.photo_url);
                                    e.currentTarget.src = '/placeholder.svg';
                                  }}
                                />
                                {/* Show loading overlay when uploading */}
                                {uploading === member.id && (
                                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                <Users className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                            
                            <input
                              ref={el => fileInputRefs.current[member.id] = el}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  e.target.value = ''; // Reset input
                                  handlePhotoUpload(file, member.id);
                                }
                              }}
                            />
                            
                            <Button 
                              size="sm" 
                              variant={member.photo_url ? "default" : "secondary"}
                              className="absolute bottom-2 right-2"
                              onClick={() => fileInputRefs.current[member.id]?.click()}
                              disabled={uploading === member.id}
                            >
                              {uploading === member.id ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              ) : (
                                <Upload className="h-4 w-4 mr-1" />
                              )}
                              {member.photo_url ? 'Change' : 'Upload'} Photo
                            </Button>
                          </div>

                          {/* Member Details - Read Only */}
                          <div className="space-y-2">
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                              <p className="text-sm text-muted-foreground">{member.designation}</p>
                              <div className="mt-2">
                                <p className="text-sm text-muted-foreground">{member.description}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
                        value={award.year || ""}
                        onChange={(e) => {
                          setAwards(prev => prev.map(a => 
                            a.id === award.id ? { ...a, year: e.target.value } : a
                          ));
                        }}
                        placeholder="Year"
                        className="w-32"
                      />
                      <Input
                        value={award.organization || ""}
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
                        onClick={() => deleteAward(award.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline"
                    onClick={addAward}
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
                        value={branch.address || ""}
                        onChange={(e) => {
                          setBranches(prev => prev.map(b => 
                            b.id === branch.id ? { ...b, address: e.target.value } : b
                          ));
                        }}
                        placeholder="Address"
                        className="flex-1"
                      />
                      <Input
                        value={branch.contact || ""}
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
                        onClick={() => deleteBranch(branch.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline"
                    onClick={addBranch}
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
                      value={companyInfo.tagline || ""}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, tagline: e.target.value })}
                      placeholder="Company tagline"
                    />
                  </div>
                  <div>
                    <Label>Mission Statement</Label>
                    <Textarea
                      value={companyInfo.mission || ""}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, mission: e.target.value })}
                      placeholder="Mission statement"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Vision Statement</Label>
                    <Textarea
                      value={companyInfo.vision || ""}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, vision: e.target.value })}
                      placeholder="Vision statement"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Core Values</Label>
                    <Textarea
                      value={companyInfo.values || ""}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, values: e.target.value })}
                      placeholder="Core values"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Kannada Tagline</Label>
                    <Textarea
                      value={companyInfo.kannada_tagline || ""}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, kannada_tagline: e.target.value })}
                      placeholder="ಕನ್ನಡ ಟ್ಯಾಗ್‌ಲೈನ್"
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab - Simplified */}
          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle>Photo Gallery</CardTitle>
                <CardDescription>Upload photos by clicking the Upload Photo button for each team member in the Leadership tab</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Image className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Photos can be uploaded for each team member in the Leadership tab.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Click on "Upload Photo" button under each team member's photo area.
                  </p>
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