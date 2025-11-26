-- Create combo_deals table
CREATE TABLE IF NOT EXISTS combo_deals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    item_ids INTEGER[] NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    savings DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on active combos for faster queries
CREATE INDEX IF NOT EXISTS idx_combo_deals_active ON combo_deals(is_active);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_combo_deals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_combo_deals_updated_at
    BEFORE UPDATE ON combo_deals
    FOR EACH ROW
    EXECUTE FUNCTION update_combo_deals_updated_at();

-- Insert sample combo deals
INSERT INTO combo_deals (name, description, item_ids, price, savings) VALUES
('Lunch Power Combo', 'Main dish, Side salad, and Drink - Perfect for busy afternoons', ARRAY[1, 2, 3], 9.99, 2.50),
('Healthy Start Bundle', 'Smoothie, Fruit bowl, and Energy bar - Great way to start your day', ARRAY[4, 5], 7.99, 1.80);

COMMENT ON TABLE combo_deals IS 'Stores combo meal deals with associated menu items';
COMMENT ON COLUMN combo_deals.item_ids IS 'Array of menu item IDs included in this combo';
COMMENT ON COLUMN combo_deals.price IS 'Final discounted price of the combo';
COMMENT ON COLUMN combo_deals.savings IS 'Amount saved compared to buying items individually';
