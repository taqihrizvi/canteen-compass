-- Seed initial admin user
-- Password: Admin@123 (hashed with bcrypt)
INSERT INTO users (name, email, password_hash, role) 
VALUES ('System Admin', 'admin@canteen.ai', '$2a$10$gAv7QdALyuCU5w7ml0zEye7ylTfFrEz8sBJWKlMSaUCXlsL1q13ke', 'admin');

-- Seed sample menus
INSERT INTO menus (title, description, price, category, is_available) VALUES
('Grilled Chicken Sandwich', 'Juicy grilled chicken breast with lettuce, tomato, and mayo', 8.99, 'Main Course', true),
('Vegetarian Pasta', 'Penne pasta with mixed vegetables in tomato basil sauce', 7.49, 'Main Course', true),
('Caesar Salad', 'Fresh romaine lettuce with caesar dressing, croutons, and parmesan', 6.99, 'Salad', true),
('Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and fresh basil', 9.99, 'Main Course', true),
('Chicken Biryani', 'Aromatic basmati rice with spiced chicken and herbs', 10.99, 'Main Course', true),
('Fresh Fruit Bowl', 'Seasonal fresh fruits with honey drizzle', 5.49, 'Dessert', true),
('Chocolate Brownie', 'Rich chocolate brownie with vanilla ice cream', 4.99, 'Dessert', true),
('Green Smoothie', 'Healthy blend of spinach, banana, and mango', 4.49, 'Beverage', true),
('Iced Coffee', 'Cold brew coffee with milk and ice', 3.99, 'Beverage', true),
('Fish Tacos', 'Grilled fish with cabbage slaw and chipotle mayo', 9.49, 'Main Course', true);

-- Seed sample student users
INSERT INTO users (name, email, password_hash, role) VALUES
('John Smith', 'john.smith@student.edu', '$2a$10$gAv7QdALyuCU5w7ml0zEye7ylTfFrEz8sBJWKlMSaUCXlsL1q13ke', 'student'),
('Emma Johnson', 'emma.johnson@student.edu', '$2a$10$gAv7QdALyuCU5w7ml0zEye7ylTfFrEz8sBJWKlMSaUCXlsL1q13ke', 'student'),
('Michael Brown', 'michael.brown@student.edu', '$2a$10$gAv7QdALyuCU5w7ml0zEye7ylTfFrEz8sBJWKlMSaUCXlsL1q13ke', 'student');

-- Seed canteen manager
INSERT INTO users (name, email, password_hash, role) VALUES
('Sarah Manager', 'manager@canteen.ai', '$2a$10$gAv7QdALyuCU5w7ml0zEye7ylTfFrEz8sBJWKlMSaUCXlsL1q13ke', 'canteen_manager');

-- Seed some sample orders
-- Student IDs: John Smith (2), Emma Johnson (3), Michael Brown (4)
INSERT INTO orders (student_id, menu_id, quantity, total_price, status) VALUES
(2, 1, 1, 8.99, 'completed'),
(2, 8, 1, 4.49, 'completed'),
(3, 5, 2, 21.98, 'completed'),
(4, 2, 1, 7.49, 'pending'),
(3, 4, 1, 9.99, 'preparing');

-- Seed food suggestions for students
-- Student IDs: John Smith (2), Emma Johnson (3), Michael Brown (4)
INSERT INTO food_suggestions (student_id, menu_id, reason) VALUES
(2, 5, 'Based on your love for spicy food'),
(2, 10, 'Popular choice this week'),
(3, 2, 'Healthy vegetarian option'),
(3, 3, 'Light and nutritious'),
(4, 1, 'High protein meal');
