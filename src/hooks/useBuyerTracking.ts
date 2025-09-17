import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useBuyerTracking = () => {
  const trackLogin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user email for contact info
      const { data: authUser } = await supabase.auth.getUser();
      
      // Track the login activity
      await supabase
        .from("buyer_activity")
        .insert({
          buyer_id: user.id,
          buyer_name: authUser?.user?.email?.split('@')[0] || "Unknown",
          buyer_contact: authUser?.user?.email || "No contact",
          login_date: new Date().toISOString()
        });
    } catch (error) {
      console.error("Error tracking buyer login:", error);
    }
  };

  const trackSearch = async (searchQuery: string, resultsCount: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: authUser } = await supabase.auth.getUser();

      // Track search in buyer_activity
      await supabase
        .from("buyer_activity")
        .insert({
          buyer_id: user.id,
          buyer_name: authUser?.user?.email?.split('@')[0] || "Unknown",
          buyer_contact: authUser?.user?.email || "No contact",
          search_query: searchQuery,
          login_date: new Date().toISOString()
        });

      // Also track in search_analytics
      await supabase
        .from("search_analytics")
        .insert({
          user_id: user.id,
          search_term: searchQuery,
          results_count: resultsCount
        });
    } catch (error) {
      console.error("Error tracking search:", error);
    }
  };

  const trackVehicleInterest = async (vehicleId: string, vehicleName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: authUser } = await supabase.auth.getUser();

      // Track interest in buyer_activity
      await supabase
        .from("buyer_activity")
        .insert({
          buyer_id: user.id,
          buyer_name: authUser?.user?.email?.split('@')[0] || "Unknown",
          buyer_contact: authUser?.user?.email || "No contact",
          vehicle_interested_id: vehicleId,
          vehicle_interested_name: vehicleName,
          login_date: new Date().toISOString()
        });
    } catch (error) {
      console.error("Error tracking vehicle interest:", error);
    }
  };

  const createCCUploadRecord = async (vehicleId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if record already exists
      const { data: existing } = await supabase
        .from("vehicle_cc_uploads")
        .select("id")
        .eq("vehicle_id", vehicleId)
        .eq("buyer_id", user.id)
        .maybeSingle();

      if (!existing) {
        // Create CC upload record for tracking
        await supabase
          .from("vehicle_cc_uploads")
          .insert({
            vehicle_id: vehicleId,
            buyer_id: user.id,
            cc_image_url: null,
            uploaded_at: null,
            reminder_sent: false
          });
      }
    } catch (error) {
      console.error("Error creating CC upload record:", error);
    }
  };

  return {
    trackLogin,
    trackSearch,
    trackVehicleInterest,
    createCCUploadRecord
  };
};