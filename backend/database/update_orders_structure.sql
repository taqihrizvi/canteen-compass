-- Update orders table structure to support multiple items per order

-- Drop the view that depends on orders.menu_id
DROP VIEW IF EXISTS sales_reports;

-- Drop the old foreign key constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_menu_id_fkey;

-- Modify orders table to remove menu_id and quantity (these will be in order_items)
ALTER TABLE orders DROP COLUMN IF EXISTS menu_id;
ALTER TABLE orders DROP COLUMN IF EXISTS quantity;

-- Add payment method column
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'cash';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS service_fee DECIMAL(10, 2) DEFAULT 0.50;

-- Create order_items table for line items
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_id INTEGER REFERENCES menus(id) ON DELETE SET NULL,
    menu_name VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
