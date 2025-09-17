-- Create table for hero banners
CREATE TABLE public.hero_banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  show_tractor_pattern BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view hero banners"
ON public.hero_banners
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage hero banners"
ON public.hero_banners
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default hero banners for all pages
INSERT INTO public.hero_banners (page_name, title, subtitle, description, show_tractor_pattern) VALUES
  ('home', 'Welcome to Om Ganesh Tractors', 'MASSEY FERGUSON', 'Your Trusted Partner in Agricultural Excellence', true),
  ('about', 'About Us', 'OM GANESH TRACTORS', '38 Years of Excellence in Agricultural Equipment & Services', true),
  ('services', 'Our Services', 'Complete Agricultural Solutions', 'Sales, Service, and Support for Your Success', true),
  ('buy', 'Buy Quality Tractors', 'MASSEY FERGUSON', 'Find Your Perfect Agricultural Partner', true),
  ('sell', 'Sell Your Tractor', 'Get Best Value', 'Quick and Fair Evaluation Process', true),
  ('contact', 'Contact Us', 'Get in Touch', 'We are here to help you', true);

-- Add trigger for updated_at
CREATE TRIGGER update_hero_banners_updated_at
BEFORE UPDATE ON public.hero_banners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();