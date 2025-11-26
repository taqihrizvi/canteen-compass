-- Add allergen preferences and dietary preferences to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS allergen_ids INTEGER[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS dietary_preferences TEXT[] DEFAULT '{}';

-- Create index for allergen queries
CREATE INDEX IF NOT EXISTS idx_users_allergen_ids ON users USING GIN (allergen_ids);

-- Add comment for documentation
COMMENT ON COLUMN users.allergen_ids IS 'Array of allergen IDs the user needs to avoid';
COMMENT ON COLUMN users.dietary_preferences IS 'Array of dietary preference strings (vegetarian, vegan, etc.)';
