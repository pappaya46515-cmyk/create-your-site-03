-- Create table for tracking buyer daily activity
CREATE TABLE IF NOT EXISTS public.buyer_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL,
  buyer_name TEXT,
  buyer_contact TEXT,
  login_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  search_query TEXT,
  vehicle_interested_id UUID,
  vehicle_interested_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.buyer_activity ENABLE ROW LEVEL SECURITY;

-- Create policies for buyer activity
CREATE POLICY "Admins can view all activity" 
ON public.buyer_activity 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own activity" 
ON public.buyer_activity 
FOR INSERT 
WITH CHECK (buyer_id = auth.uid());

-- Create table for vehicle CC (Clearance Certificate) uploads
CREATE TABLE IF NOT EXISTS public.vehicle_cc_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL,
  buyer_id UUID NOT NULL,
  cc_image_url TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE,
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vehicle_cc_uploads ENABLE ROW LEVEL SECURITY;

-- Create policies for CC uploads
CREATE POLICY "Buyers can upload their CC" 
ON public.vehicle_cc_uploads 
FOR ALL 
USING (buyer_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Create index for better performance
CREATE INDEX idx_buyer_activity_buyer_id ON public.buyer_activity(buyer_id);
CREATE INDEX idx_buyer_activity_login_date ON public.buyer_activity(login_date);
CREATE INDEX idx_vehicle_cc_uploads_vehicle_id ON public.vehicle_cc_uploads(vehicle_id);
CREATE INDEX idx_vehicle_cc_uploads_buyer_id ON public.vehicle_cc_uploads(buyer_id);

-- Create trigger for updating timestamps on CC uploads
CREATE TRIGGER update_vehicle_cc_uploads_updated_at
BEFORE UPDATE ON public.vehicle_cc_uploads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();