-- Add calories and tags fields to menus table
ALTER TABLE menus 
ADD COLUMN IF NOT EXISTS calories INTEGER,
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;
