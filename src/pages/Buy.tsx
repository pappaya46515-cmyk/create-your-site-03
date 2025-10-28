import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MapPin, Calendar, IndianRupee, Phone, Eye, LogIn } from "lucide-react";
import { useState } from "react";

const Buy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the actual buyer browse page with real vehicle listings
    navigate("/buyer/browse");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to vehicle listings...</p>
    </div>
  );
};

export default Buy;