-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'seller', 'buyer');

-- Create user roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create vehicle categories enum
CREATE TYPE public.vehicle_category AS ENUM ('tractor', 'other_vehicle');

-- Create ownership type enum  
CREATE TYPE public.ownership_type AS ENUM ('kamtha', 'third_party');

-- Create stock status enum
CREATE TYPE public.stock_status AS ENUM ('available', 'pending', 'sold', 'archived');

-- Create vehicles/stock table
CREATE TABLE public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES auth.users(id) NOT NULL,
    category vehicle_category NOT NULL,
    ownership_type ownership_type NOT NULL,
    
    -- Vehicle details
    model_name TEXT NOT NULL,
    model_year INTEGER,
    registration_number TEXT,
    engine_number TEXT,
    
    -- Pricing
    deal_value DECIMAL(10,2) NOT NULL,
    slab_amount DECIMAL(10,2),
    
    -- RC Owner details
    rc_owner_name TEXT,
    rc_owner_address TEXT,
    rc_owner_contact TEXT,
    
    -- Documents status
    has_original_rc BOOLEAN DEFAULT false,
    has_duplicate_rc BOOLEAN DEFAULT false,
    has_insurance BOOLEAN DEFAULT false,
    has_form_29 BOOLEAN DEFAULT false,
    has_form_30 BOOLEAN DEFAULT false,
    has_noc BOOLEAN DEFAULT false,
    
    -- Status
    status stock_status DEFAULT 'available',
    sold_date TIMESTAMP WITH TIME ZONE,
    buyer_id UUID REFERENCES auth.users(id),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Constraint for minimum deal value
    CONSTRAINT min_deal_value CHECK (deal_value >= 250000)
);

-- Enable RLS
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Create documents table for file uploads
CREATE TABLE public.vehicle_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
    document_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vehicle_documents ENABLE ROW LEVEL SECURITY;

-- Create buyer interests table for analytics
CREATE TABLE public.buyer_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES auth.users(id) NOT NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
    search_query TEXT,
    contacted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.buyer_interests ENABLE ROW LEVEL SECURITY;

-- Create agreements table
CREATE TABLE public.agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
    seller_name TEXT NOT NULL,
    seller_father_name TEXT,
    seller_address TEXT NOT NULL,
    seller_pincode TEXT,
    seller_contact TEXT NOT NULL,
    seller_aadhaar TEXT,
    
    buyer_name TEXT NOT NULL,
    buyer_father_name TEXT,
    buyer_address TEXT NOT NULL,
    buyer_contact TEXT NOT NULL,
    
    vehicle_number TEXT,
    jersey_number TEXT,
    serial_number TEXT,
    insurance_number TEXT,
    rc_number TEXT,
    
    witness_signature TEXT,
    agreement_date DATE DEFAULT CURRENT_DATE,
    pdf_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Enable RLS
ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;

-- Create search analytics table
CREATE TABLE public.search_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    search_term TEXT NOT NULL,
    category vehicle_category,
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    results_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    vehicle_id UUID REFERENCES public.vehicles(id),
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vehicles table
CREATE TRIGGER update_vehicles_updated_at
BEFORE UPDATE ON public.vehicles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for vehicles
CREATE POLICY "Anyone can view available vehicles"
ON public.vehicles FOR SELECT
USING (status = 'available' OR seller_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Sellers can create vehicles"
ON public.vehicles FOR INSERT
WITH CHECK (auth.uid() = seller_id AND (public.has_role(auth.uid(), 'seller') OR public.has_role(auth.uid(), 'admin')));

CREATE POLICY "Sellers can update their own vehicles"
ON public.vehicles FOR UPDATE
USING (auth.uid() = seller_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete vehicles"
ON public.vehicles FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for vehicle_documents
CREATE POLICY "Users can view documents for accessible vehicles"
ON public.vehicle_documents FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.vehicles
        WHERE vehicles.id = vehicle_documents.vehicle_id
        AND (vehicles.seller_id = auth.uid() OR vehicles.buyer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
);

CREATE POLICY "Users can upload documents for their vehicles"
ON public.vehicle_documents FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.vehicles
        WHERE vehicles.id = vehicle_documents.vehicle_id
        AND (vehicles.seller_id = auth.uid() OR vehicles.buyer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
);

-- RLS Policies for buyer_interests
CREATE POLICY "Buyers can view their own interests"
ON public.buyer_interests FOR SELECT
USING (buyer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Buyers can create interests"
ON public.buyer_interests FOR INSERT
WITH CHECK (buyer_id = auth.uid());

-- RLS Policies for agreements
CREATE POLICY "Parties can view their agreements"
ON public.agreements FOR SELECT
USING (
    public.has_role(auth.uid(), 'admin') OR
    EXISTS (
        SELECT 1 FROM public.vehicles
        WHERE vehicles.id = agreements.vehicle_id
        AND (vehicles.seller_id = auth.uid() OR vehicles.buyer_id = auth.uid())
    )
);

CREATE POLICY "Admins can create agreements"
ON public.agreements FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for search_analytics
CREATE POLICY "Admins can view all analytics"
ON public.search_analytics FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create search analytics"
ON public.search_analytics FOR INSERT
WITH CHECK (true);

-- RLS Policies for notifications
CREATE POLICY "Users can view their notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid());

-- Create storage buckets for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('vehicle-images', 'vehicle-images', true),
    ('vehicle-documents', 'vehicle-documents', false),
    ('agreements', 'agreements', false);

-- Storage policies for vehicle images
CREATE POLICY "Anyone can view vehicle images"
ON storage.objects FOR SELECT
USING (bucket_id = 'vehicle-images');

CREATE POLICY "Authenticated users can upload vehicle images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'vehicle-images' AND auth.uid() IS NOT NULL);

-- Storage policies for vehicle documents
CREATE POLICY "Authorized users can view documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'vehicle-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'vehicle-documents' AND auth.uid() IS NOT NULL);

-- Storage policies for agreements
CREATE POLICY "Authorized users can view agreements"
ON storage.objects FOR SELECT
USING (bucket_id = 'agreements' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can upload agreements"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'agreements' AND public.has_role(auth.uid(), 'admin'));