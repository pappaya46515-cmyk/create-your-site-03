-- Create table for leadership team members
CREATE TABLE IF NOT EXISTS public.leadership_team (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leadership_team ENABLE ROW LEVEL SECURITY;

-- Create policies for leadership team
CREATE POLICY "Anyone can view leadership team" 
ON public.leadership_team 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage leadership team" 
ON public.leadership_team 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create table for company awards
CREATE TABLE IF NOT EXISTS public.company_awards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  year TEXT,
  organization TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_awards ENABLE ROW LEVEL SECURITY;

-- Create policies for awards
CREATE POLICY "Anyone can view awards" 
ON public.company_awards 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage awards" 
ON public.company_awards 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create table for branch locations
CREATE TABLE IF NOT EXISTS public.branch_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  address TEXT,
  contact TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.branch_locations ENABLE ROW LEVEL SECURITY;

-- Create policies for branches
CREATE POLICY "Anyone can view branches" 
ON public.branch_locations 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage branches" 
ON public.branch_locations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create table for company info
CREATE TABLE IF NOT EXISTS public.company_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tagline TEXT,
  mission TEXT,
  vision TEXT,
  values TEXT,
  kannada_tagline TEXT,
  hero_image_url TEXT,
  team_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_info ENABLE ROW LEVEL SECURITY;

-- Create policies for company info
CREATE POLICY "Anyone can view company info" 
ON public.company_info 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage company info" 
ON public.company_info 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default company info row if not exists
INSERT INTO public.company_info (
  tagline,
  mission,
  vision,
  values,
  kannada_tagline
) 
SELECT 
  '38 Years of Excellence in Agricultural Equipment & Services',
  'To provide transparent and reliable agricultural equipment services',
  'To be the most trusted platform for agricultural equipment',
  'Integrity, transparency, and farmer-first approach',
  'ಕರ್ನಾಟಕದಾದ್ಯಂತ 11,000+ ರೈತರಿಗೆ ಪಾರದರ್ಶಕತೆಯಿಂದ ಉಪಯೋಗಿಸಿದ ರೈತ ಉಪಕರಣಗಳ ಮಾರಾಟದ ವ್ಯವಸ್ಥೆ'
WHERE NOT EXISTS (SELECT 1 FROM public.company_info);

-- Create trigger for updating timestamps
CREATE TRIGGER update_leadership_team_updated_at
BEFORE UPDATE ON public.leadership_team
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_info_updated_at
BEFORE UPDATE ON public.company_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();