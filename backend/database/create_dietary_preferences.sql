-- Create dietary_preferences table
CREATE TABLE IF NOT EXISTS dietary_preferences (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS idx_dietary_preferences_name ON dietary_preferences(name);

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_dietary_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_dietary_preferences_updated_at
    BEFORE UPDATE ON dietary_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_dietary_preferences_updated_at();

-- Insert common dietary preferences
INSERT INTO dietary_preferences (name, description, icon) VALUES
    ('Vegetarian', 'No meat, poultry, or fish', 'leaf'),
    ('Vegan', 'No animal products including dairy and eggs', 'leaf'),
    ('Gluten-Free', 'No wheat, barley, rye, or gluten-containing grains', 'alert-circle'),
    ('Dairy-Free', 'No milk or dairy products', 'milk'),
    ('Halal', 'Prepared according to Islamic dietary laws', 'star'),
    ('Kosher', 'Prepared according to Jewish dietary laws', 'star'),
    ('Low Calorie', 'Reduced calorie options', 'flame'),
    ('Pescatarian', 'No meat or poultry, but includes fish', 'fish'),
    ('Keto', 'Low carb, high fat diet', 'flame'),
    ('Paleo', 'No processed foods, grains, or dairy', 'leaf'),
    ('Low Sodium', 'Reduced salt content', 'alert-circle'),
    ('Nut-Free', 'No tree nuts or peanuts', 'alert-circle')
ON CONFLICT (name) DO NOTHING;

-- Update users table to use dietary_preference_ids instead of dietary_preferences text array
ALTER TABLE users 
DROP COLUMN IF EXISTS dietary_preferences,
ADD COLUMN IF NOT EXISTS dietary_preference_ids INTEGER[] DEFAULT '{}';

-- Create index for dietary preference queries
CREATE INDEX IF NOT EXISTS idx_users_dietary_preference_ids ON users USING GIN (dietary_preference_ids);

-- Add comment for documentation
COMMENT ON COLUMN users.dietary_preference_ids IS 'Array of dietary preference IDs the user follows';
