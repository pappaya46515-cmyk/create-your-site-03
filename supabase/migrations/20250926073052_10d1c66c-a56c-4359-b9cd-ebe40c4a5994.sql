-- Drop the existing constraint
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS min_deal_value;

-- Add new constraint with minimum value of 150000
ALTER TABLE vehicles ADD CONSTRAINT min_deal_value CHECK (deal_value >= 150000);