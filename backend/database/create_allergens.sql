-- Create allergens table
CREATE TABLE IF NOT EXISTS allergens (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS idx_allergens_name ON allergens(name);

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_allergens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_allergens_updated_at
    BEFORE UPDATE ON allergens
    FOR EACH ROW
    EXECUTE FUNCTION update_allergens_updated_at();

-- Insert the 14 major allergens
INSERT INTO allergens (name, description) VALUES
    ('Celery', 'Includes celery stalks, leaves, seeds and celeriac'),
    ('Cereals containing gluten', 'Wheat, rye, barley, oats and their derivatives'),
    ('Crustaceans', 'Prawns, crabs, lobsters, crayfish and their derivatives'),
    ('Eggs', 'Eggs and egg products'),
    ('Fish', 'All fish including cod, haddock, salmon, tuna and their derivatives'),
    ('Lupin', 'Lupin seeds and flour, often found in baked goods'),
    ('Milk', 'Milk and dairy products including lactose'),
    ('Molluscs', 'Mussels, oysters, squid, snails and their derivatives'),
    ('Mustard', 'Mustard seeds, powder, and prepared mustard'),
    ('Peanuts', 'Peanuts and peanut products'),
    ('Sesame', 'Sesame seeds and sesame oil'),
    ('Soybeans', 'Soybeans and soy products'),
    ('Sulphur dioxide and sulphites', 'Preservatives found in dried fruits, wine, and processed foods (above 10 ppm)'),
    ('Tree nuts', 'Almonds, hazelnuts, walnuts, cashews, pecans, pistachios, macadamia nuts')
ON CONFLICT (name) DO NOTHING;
