-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    current_stock INTEGER NOT NULL DEFAULT 0,
    optimal_stock INTEGER NOT NULL DEFAULT 0,
    unit VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'good',
    usage_rate VARCHAR(50) DEFAULT 'Medium',
    last_restocked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    supplier VARCHAR(255),
    cost_per_unit DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reorder_suggestions table
CREATE TABLE IF NOT EXISTS reorder_suggestions (
    id SERIAL PRIMARY KEY,
    inventory_id INTEGER REFERENCES inventory(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    quantity_needed VARCHAR(100) NOT NULL,
    urgency VARCHAR(50) NOT NULL,
    reason TEXT,
    estimated_cost DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);
CREATE INDEX IF NOT EXISTS idx_inventory_item_name ON inventory(item_name);
CREATE INDEX IF NOT EXISTS idx_reorder_urgency ON reorder_suggestions(urgency);
CREATE INDEX IF NOT EXISTS idx_reorder_status ON reorder_suggestions(status);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER inventory_updated_at BEFORE UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION update_inventory_updated_at();

CREATE TRIGGER reorder_suggestions_updated_at BEFORE UPDATE ON reorder_suggestions
    FOR EACH ROW EXECUTE FUNCTION update_inventory_updated_at();

-- Insert sample inventory data
INSERT INTO inventory (item_name, current_stock, optimal_stock, unit, status, usage_rate, supplier, cost_per_unit) VALUES
('Chicken Breast', 45, 120, 'kg', 'critical', 'High', 'Fresh Meats Ltd', 2.40),
('Lettuce', 28, 50, 'heads', 'low', 'Medium', 'Green Farms Co', 1.50),
('Pasta', 85, 100, 'kg', 'good', 'High', 'Italian Supplies', 1.20),
('Tomato Sauce', 15, 30, 'L', 'low', 'Medium', 'Sauce Masters', 1.90),
('Cheddar Cheese', 32, 40, 'kg', 'good', 'High', 'Dairy Delights', 4.50),
('Rice', 95, 80, 'kg', 'overstock', 'Medium', 'Grain Traders', 0.90);

-- Insert sample reorder suggestions
INSERT INTO reorder_suggestions (inventory_id, item_name, quantity_needed, urgency, reason, estimated_cost, status) VALUES
(1, 'Chicken Breast', '75 kg', 'Critical', 'Current stock covers only 1.5 days at current usage rate', 180.00, 'pending'),
(2, 'Lettuce', '30 heads', 'High', 'Forecast shows 35% increase in salad demand this week', 45.00, 'pending'),
(4, 'Tomato Sauce', '20 L', 'Medium', 'Stock running low, reorder to maintain buffer', 38.00, 'pending');
