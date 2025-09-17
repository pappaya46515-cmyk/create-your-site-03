-- Create function to automatically create CC upload record when vehicle is sold
CREATE OR REPLACE FUNCTION public.create_cc_upload_on_sale()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if vehicle status changed to 'sold' and buyer_id is set
  IF NEW.status = 'sold' AND NEW.buyer_id IS NOT NULL AND 
     (OLD.status IS NULL OR OLD.status != 'sold') THEN
    
    -- Create CC upload record for tracking
    INSERT INTO public.vehicle_cc_uploads (
      vehicle_id,
      buyer_id,
      cc_image_url,
      uploaded_at,
      reminder_sent
    ) VALUES (
      NEW.id,
      NEW.buyer_id,
      NULL,
      NULL,
      false
    ) ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic CC upload record creation
CREATE TRIGGER create_cc_upload_on_vehicle_sale
AFTER INSERT OR UPDATE ON public.vehicles
FOR EACH ROW
EXECUTE FUNCTION public.create_cc_upload_on_sale();