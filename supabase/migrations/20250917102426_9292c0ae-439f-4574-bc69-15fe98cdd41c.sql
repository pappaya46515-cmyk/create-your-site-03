-- Update the category enum to include more options
ALTER TYPE vehicle_category ADD VALUE IF NOT EXISTS 'commercial' AFTER 'tractor';
ALTER TYPE vehicle_category ADD VALUE IF NOT EXISTS 'agriculture' AFTER 'commercial';