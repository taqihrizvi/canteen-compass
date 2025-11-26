-- Create ENUM types
CREATE TYPE user_role AS ENUM ('admin', 'student', 'canteen_manager');
CREATE TYPE order_status AS ENUM ('pending', 'preparing', 'ready', 'completed', 'cancelled');

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Menus table
CREATE TABLE menus (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    image_url TEXT,
    allergens JSONB DEFAULT '[]'::jsonb,
    stock INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    menu_id INTEGER REFERENCES menus(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 1,
    total_price DECIMAL(10, 2) NOT NULL,
    status order_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales reports view (auto-calculated from orders)
CREATE OR REPLACE VIEW sales_reports AS
SELECT 
    DATE(o.created_at) as report_date,
    COUNT(o.id) as total_orders,
    SUM(o.total_price) as total_revenue,
    COUNT(DISTINCT o.student_id) as unique_customers,
    m.title as popular_item,
    COUNT(o.menu_id) as item_count
FROM orders o
LEFT JOIN menus m ON o.menu_id = m.id
WHERE o.status = 'completed'
GROUP BY DATE(o.created_at), m.title
ORDER BY report_date DESC, item_count DESC;

-- Food suggestions table (AI-based recommendations)
CREATE TABLE food_suggestions (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    menu_id INTEGER REFERENCES menus(id) ON DELETE CASCADE,
    suggestion_date DATE DEFAULT CURRENT_DATE,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_orders_student_id ON orders(student_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_menus_is_available ON menus(is_available);
CREATE INDEX idx_food_suggestions_student_id ON food_suggestions(student_id);
CREATE INDEX idx_food_suggestions_date ON food_suggestions(suggestion_date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menus_updated_at BEFORE UPDATE ON menus
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
