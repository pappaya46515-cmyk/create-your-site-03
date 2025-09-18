-- Create tractor makes table
CREATE TABLE public.tractor_makes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tractor models table
CREATE TABLE public.tractor_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  make_id UUID NOT NULL REFERENCES public.tractor_makes(id) ON DELETE CASCADE,
  model_name TEXT NOT NULL,
  hp INTEGER,
  hp_range TEXT CHECK (hp_range IN ('0-30', '31-40', '41-50', '50+')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(make_id, model_name)
);

-- Create tractor price matrix table for historical pricing
CREATE TABLE public.tractor_price_matrix (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id UUID NOT NULL REFERENCES public.tractor_models(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  price NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(model_id, year)
);

-- Create indexes for better performance
CREATE INDEX idx_tractor_models_make_id ON public.tractor_models(make_id);
CREATE INDEX idx_tractor_models_hp_range ON public.tractor_models(hp_range);
CREATE INDEX idx_tractor_price_matrix_model_id ON public.tractor_price_matrix(model_id);
CREATE INDEX idx_tractor_price_matrix_year ON public.tractor_price_matrix(year);

-- Enable RLS
ALTER TABLE public.tractor_makes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tractor_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tractor_price_matrix ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tractor_makes
CREATE POLICY "Anyone can view tractor makes" 
ON public.tractor_makes 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage tractor makes" 
ON public.tractor_makes 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for tractor_models
CREATE POLICY "Anyone can view tractor models" 
ON public.tractor_models 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage tractor models" 
ON public.tractor_models 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for tractor_price_matrix
CREATE POLICY "Anyone can view price matrix" 
ON public.tractor_price_matrix 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage price matrix" 
ON public.tractor_price_matrix 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_tractor_makes_updated_at
BEFORE UPDATE ON public.tractor_makes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tractor_models_updated_at
BEFORE UPDATE ON public.tractor_models
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tractor_price_matrix_updated_at
BEFORE UPDATE ON public.tractor_price_matrix
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data from the Excel sheet
-- Starting with some major makes
INSERT INTO public.tractor_makes (name) VALUES 
  ('TAFE'),
  ('M&M'),
  ('ESCORTS'),
  ('SWARAJ'),
  ('JOHNDEERE'),
  ('EICHER'),
  ('HMT'),
  ('INDO FARM'),
  ('SONALIKA'),
  ('KUBOTA'),
  ('BALWAN'),
  ('PREET'),
  ('ACE'),
  ('SAME'),
  ('STANDARD'),
  ('NEWHOLLAND')
ON CONFLICT (name) DO NOTHING;

-- Insert some sample models for TAFE
INSERT INTO public.tractor_models (make_id, model_name, hp, hp_range)
SELECT 
  m.id,
  model.model_name,
  model.hp,
  model.hp_range
FROM public.tractor_makes m
CROSS JOIN (VALUES
  ('6028', 28, '0-30'),
  ('ORCHARD', 30, '0-30'),
  ('MF 1035 MS', 39, '31-40'),
  ('MF 241 PM', 42, '41-50'),
  ('MF 241 PD', 42, '41-50'),
  ('MF 245', 45, '41-50'),
  ('MF 5245 PLANETARY', 50, '50+'),
  ('MF 7250', 50, '50+')
) AS model(model_name, hp, hp_range)
WHERE m.name = 'TAFE'
ON CONFLICT (make_id, model_name) DO NOTHING;

-- Insert models for M&M (Mahindra)
INSERT INTO public.tractor_models (make_id, model_name, hp, hp_range)
SELECT 
  m.id,
  model.model_name,
  model.hp,
  model.hp_range
FROM public.tractor_makes m
CROSS JOIN (VALUES
  ('MAHINDRA 475 DI', 42, '41-50'),
  ('MAHINDRA 575 DI', 45, '41-50'),
  ('MAHINDRA 555 DI ARJUN', 52, '50+')
) AS model(model_name, hp, hp_range)
WHERE m.name = 'M&M'
ON CONFLICT (make_id, model_name) DO NOTHING;

-- Insert models for ESCORTS
INSERT INTO public.tractor_models (make_id, model_name, hp, hp_range)
SELECT 
  m.id,
  model.model_name,
  model.hp,
  model.hp_range
FROM public.tractor_makes m
CROSS JOIN (VALUES
  ('FARMTRAC 45', 42, '41-50'),
  ('POWERTRAC 439', 35, '31-40'),
  ('FARMTRAC 60', 47, '41-50'),
  ('POWERTRAC 450', 50, '41-50')
) AS model(model_name, hp, hp_range)
WHERE m.name = 'ESCORTS'
ON CONFLICT (make_id, model_name) DO NOTHING;

-- Insert models for SWARAJ
INSERT INTO public.tractor_models (make_id, model_name, hp, hp_range)
SELECT 
  m.id,
  model.model_name,
  model.hp,
  model.hp_range
FROM public.tractor_makes m
CROSS JOIN (VALUES
  ('SWARAJ 735 FE', 39, '31-40'),
  ('SWARAJ 744 FE', 48, '41-50'),
  ('SWARAJ 855 FE', 55, '50+'),
  ('SWARAJ 724 FE', 26, '0-30')
) AS model(model_name, hp, hp_range)
WHERE m.name = 'SWARAJ'
ON CONFLICT (make_id, model_name) DO NOTHING;

-- Insert models for JOHNDEERE
INSERT INTO public.tractor_models (make_id, model_name, hp, hp_range)
SELECT 
  m.id,
  model.model_name,
  model.hp,
  model.hp_range
FROM public.tractor_makes m
CROSS JOIN (VALUES
  ('JOHN DEERE 5036 C', 35, '31-40'),
  ('JOHN DEERE 5038 D', 38, '31-40'),
  ('JOHN DEERE 5042 D', 42, '41-50'),
  ('JOHN DEERE 5045 D', 45, '41-50'),
  ('JOHN DEERE 5050 D', 50, '41-50'),
  ('JOHN DEERE 5055 E', 55, '50+'),
  ('JOHN DEERE 5310', 55, '50+')
) AS model(model_name, hp, hp_range)
WHERE m.name = 'JOHNDEERE'
ON CONFLICT (make_id, model_name) DO NOTHING;