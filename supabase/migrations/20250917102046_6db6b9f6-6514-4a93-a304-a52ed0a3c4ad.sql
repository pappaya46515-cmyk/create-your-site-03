-- Add new columns to vehicles table for stock type and ownership
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS stock_type TEXT CHECK (stock_type IN ('tractor', 'others')),
ADD COLUMN IF NOT EXISTS property_owner TEXT CHECK (property_owner IN ('kamtha', 'party')),
ADD COLUMN IF NOT EXISTS new_buyer_name TEXT,
ADD COLUMN IF NOT EXISTS new_buyer_address TEXT,
ADD COLUMN IF NOT EXISTS new_buyer_contact TEXT;

-- Update vehicles table to ensure RC owner fields are captured
-- These columns already exist but let's make sure they're properly named
COMMENT ON COLUMN public.vehicles.rc_owner_name IS 'RC Owner Name from registration certificate';
COMMENT ON COLUMN public.vehicles.rc_owner_address IS 'RC Owner Address from registration certificate';
COMMENT ON COLUMN public.vehicles.rc_owner_contact IS 'RC Owner Contact Number';