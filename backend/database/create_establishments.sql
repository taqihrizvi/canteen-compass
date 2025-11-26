-- Create establishments table
CREATE TABLE IF NOT EXISTS establishments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Active',
    capacity INTEGER,
    daily_orders INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0.00,
    manager VARCHAR(255),
    rating DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial establishments data
INSERT INTO establishments (name, location, status, capacity, daily_orders, revenue, manager, rating)
VALUES 
    ('Riverside Academy', 'Building A, Floor 1', 'Active', 250, 342, 1847.50, 'Sarah Johnson', 4.6),
    ('Oakwood High School', 'Building B, Floor 2', 'Active', 120, 187, 1023.80, 'Michael Chen', 4.4),
    ('Greenfield College', 'Library, Ground Floor', 'Active', 80, 156, 845.60, 'Emma Williams', 4.7),
    ('Hillcrest Secondary School', 'Sports Complex', 'Inactive', 60, 0, 0.00, 'James Brown', 4.3)
ON CONFLICT DO NOTHING;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_establishments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_establishments_updated_at_trigger
    BEFORE UPDATE ON establishments
    FOR EACH ROW
    EXECUTE FUNCTION update_establishments_updated_at();
