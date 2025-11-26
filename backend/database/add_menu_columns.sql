-- Add allergens and stock columns to menus table
ALTER TABLE menus 
ADD COLUMN IF NOT EXISTS allergens JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;
