import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-12 bg-gradient-earth">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground">
              We're here to help with all your agricultural equipment needs
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone Support</h3>
                    <p className="text-muted-foreground">1800-XXX-XXXX</p>
                    <p className="text-sm text-muted-foreground">Available 24/7</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-secondary/10 rounded-full">
                    <Mail className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">info@kamtha.com</p>
                    <p className="text-sm text-muted-foreground">Response within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-accent/10 rounded-full">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Office Location</h3>
                    <p className="text-muted-foreground">Karnataka, India</p>
                    <p className="text-sm text-muted-foreground">Visit by appointment</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Your phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="What is this about?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary-hover text-primary-foreground">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">How does the verification process work?</h4>
                  <p className="text-sm text-muted-foreground">
                    All equipment listings are verified by our executives through document checks and physical inspection.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">How long does approval take?</h4>
                  <p className="text-sm text-muted-foreground">
                    Typically, the verification and approval process takes 24-48 hours after submission.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Is there a fee for listing equipment?</h4>
                  <p className="text-sm text-muted-foreground">
                    Contact our customer service for information about listing fees and commissions.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Can I visit to see equipment in person?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, we can arrange visits to inspect equipment. Contact us to schedule an appointment.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;