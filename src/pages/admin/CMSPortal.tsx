import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Image, Settings, Globe, Phone, Mail, MapPin, Save, Plus, Trash2, Edit } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const CMSPortal = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Content states
  const [siteSettings, setSiteSettings] = useState({
    siteName: "Kamtha Stock System",
    tagline: "Pre-owned Agricultural Equipment Marketplace",
    kannadaTagline: "ಕರ್ನಾಟಕದಾದ್ಯಂತ ರೈತರಿಗೆ ಸೇವೆ",
    phone1: "9448147073",
    phone2: "8496971246",
    email: "info@kamtha.com",
    address: "Karnataka, India",
    whatsapp: "9448147073"
  });

  const [banners, setBanners] = useState([
    { 
      id: 1, 
      title: "11,000+ Farmers Served", 
      subtitle: "Trusted Platform Across Karnataka",
      active: true 
    },
    { 
      id: 2, 
      title: "100% Document Verification", 
      subtitle: "RC, Insurance, Forms 29/30, NOC",
      active: true 
    }
  ]);

  const [announcements, setAnnouncements] = useState([
    { 
      id: 1, 
      title: "New Feature Launch", 
      content: "Now supporting commercial vehicles",
      active: true,
      date: new Date().toISOString()
    }
  ]);

  const handleSaveSettings = () => {
    setLoading(true);
    // In a real app, this would save to the database
    setTimeout(() => {
      toast({
        title: "Settings Saved",
        description: "Site settings have been updated successfully",
      });
      setLoading(false);
    }, 1000);
  };

  const handleAddBanner = () => {
    const newBanner = {
      id: banners.length + 1,
      title: "New Banner",
      subtitle: "Enter subtitle",
      active: false
    };
    setBanners([...banners, newBanner]);
  };

  const handleDeleteBanner = (id: number) => {
    setBanners(banners.filter(b => b.id !== id));
    toast({
      title: "Banner Deleted",
      description: "Banner has been removed",
    });
  };

  const handleAddAnnouncement = () => {
    const newAnnouncement = {
      id: announcements.length + 1,
      title: "New Announcement",
      content: "Enter content",
      active: false,
      date: new Date().toISOString()
    };
    setAnnouncements([...announcements, newAnnouncement]);
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Content Management System</h1>
          <p className="text-muted-foreground">Manage website content and settings</p>
        </div>

        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="banners">
              <Image className="h-4 w-4 mr-2" />
              Banners
            </TabsTrigger>
            <TabsTrigger value="announcements">
              <FileText className="h-4 w-4 mr-2" />
              Announcements
            </TabsTrigger>
            <TabsTrigger value="contact">
              <Phone className="h-4 w-4 mr-2" />
              Contact Info
            </TabsTrigger>
          </TabsList>

          {/* Site Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>Configure general website settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tagline">Tagline (English)</Label>
                    <Input
                      id="tagline"
                      value={siteSettings.tagline}
                      onChange={(e) => setSiteSettings({...siteSettings, tagline: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="kannadaTagline">Tagline (ಕನ್ನಡ)</Label>
                    <Input
                      id="kannadaTagline"
                      value={siteSettings.kannadaTagline}
                      onChange={(e) => setSiteSettings({...siteSettings, kannadaTagline: e.target.value})}
                    />
                  </div>
                </div>
                <Button onClick={handleSaveSettings} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Banners Tab */}
          <TabsContent value="banners">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Homepage Banners</CardTitle>
                    <CardDescription>Manage carousel banners</CardDescription>
                  </div>
                  <Button onClick={handleAddBanner}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Banner
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {banners.map((banner, index) => (
                    <Card key={banner.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 space-y-2">
                            <Input
                              value={banner.title}
                              onChange={(e) => {
                                const updated = [...banners];
                                updated[index].title = e.target.value;
                                setBanners(updated);
                              }}
                              placeholder="Banner Title"
                            />
                            <Input
                              value={banner.subtitle}
                              onChange={(e) => {
                                const updated = [...banners];
                                updated[index].subtitle = e.target.value;
                                setBanners(updated);
                              }}
                              placeholder="Banner Subtitle"
                            />
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant={banner.active ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                const updated = [...banners];
                                updated[index].active = !updated[index].active;
                                setBanners(updated);
                              }}
                            >
                              {banner.active ? "Active" : "Inactive"}
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDeleteBanner(banner.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Announcements</CardTitle>
                    <CardDescription>Manage site-wide announcements</CardDescription>
                  </div>
                  <Button onClick={handleAddAnnouncement}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Announcement
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement, index) => (
                    <Card key={announcement.id}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <Input
                            value={announcement.title}
                            onChange={(e) => {
                              const updated = [...announcements];
                              updated[index].title = e.target.value;
                              setAnnouncements(updated);
                            }}
                            placeholder="Announcement Title"
                          />
                          <Textarea
                            value={announcement.content}
                            onChange={(e) => {
                              const updated = [...announcements];
                              updated[index].content = e.target.value;
                              setAnnouncements(updated);
                            }}
                            placeholder="Announcement Content"
                            rows={3}
                          />
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              {new Date(announcement.date).toLocaleDateString()}
                            </span>
                            <div className="flex gap-2">
                              <Button
                                variant={announcement.active ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  const updated = [...announcements];
                                  updated[index].active = !updated[index].active;
                                  setAnnouncements(updated);
                                }}
                              >
                                {announcement.active ? "Active" : "Inactive"}
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => {
                                  setAnnouncements(announcements.filter(a => a.id !== announcement.id));
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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

          {/* Contact Information Tab */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Update contact details displayed on the website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone1">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Primary Phone
                    </Label>
                    <Input
                      id="phone1"
                      value={siteSettings.phone1}
                      onChange={(e) => setSiteSettings({...siteSettings, phone1: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone2">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Secondary Phone
                    </Label>
                    <Input
                      id="phone2"
                      value={siteSettings.phone2}
                      onChange={(e) => setSiteSettings({...siteSettings, phone2: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={siteSettings.email}
                      onChange={(e) => setSiteSettings({...siteSettings, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">
                      <Globe className="h-4 w-4 inline mr-2" />
                      WhatsApp Number
                    </Label>
                    <Input
                      id="whatsapp"
                      value={siteSettings.whatsapp}
                      onChange={(e) => setSiteSettings({...siteSettings, whatsapp: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">
                      <MapPin className="h-4 w-4 inline mr-2" />
                      Address
                    </Label>
                    <Textarea
                      id="address"
                      value={siteSettings.address}
                      onChange={(e) => setSiteSettings({...siteSettings, address: e.target.value})}
                      rows={3}
                    />
                  </div>
                </div>
                <Button onClick={handleSaveSettings} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Contact Information
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CMSPortal;