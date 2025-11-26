-- Create order_feedback table
CREATE TABLE IF NOT EXISTS order_feedback (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(order_id)
);

-- Create index on order_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_order_feedback_order_id ON order_feedback(order_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_order_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_order_feedback_updated_at_trigger
    BEFORE UPDATE ON order_feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_order_feedback_updated_at();
