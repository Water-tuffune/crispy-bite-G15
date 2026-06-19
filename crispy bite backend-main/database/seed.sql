-- Active: 1772003182664@@127.0.0.1@3306@crispybite_db
CREATE DATABASE IF NOT EXISTS crispybite_db;
USE crispybite_db;

INSERT INTO users (id, full_name, email, phone, password, role, status) VALUES
(1, 'Amina Admin', 'admin@crispybite.test', '+256700000001', '$2b$12$fRUPVWQt3GwmsOnI2KotCOGN4BcDrv.Wmq7byu6C72ogoh.fUoHO.', 'admin', 'active'),
(2, 'Caleb Customer', 'customer@crispybite.test', '+256700000002', '$2b$12$fRUPVWQt3GwmsOnI2KotCOGN4BcDrv.Wmq7byu6C72ogoh.fUoHO.', 'customer', 'active'),
(3, 'Diana Diner', 'diana@crispybite.test', '+256700000003', '$2b$12$fRUPVWQt3GwmsOnI2KotCOGN4BcDrv.Wmq7byu6C72ogoh.fUoHO.', 'customer', 'active'),
(4, 'Brian Buyer', 'brian@crispybite.test', '+256700000004', '$2b$12$fRUPVWQt3GwmsOnI2KotCOGN4BcDrv.Wmq7byu6C72ogoh.fUoHO.', 'customer', 'active'),
(5, 'Stella Staff', 'staff@crispybite.test', '+256700000005', '$2b$12$fRUPVWQt3GwmsOnI2KotCOGN4BcDrv.Wmq7byu6C72ogoh.fUoHO.', 'staff', 'active'),
(6, 'Samuel Server', 'samuel@crispybite.test', '+256700000006', '$2b$12$fRUPVWQt3GwmsOnI2KotCOGN4BcDrv.Wmq7byu6C72ogoh.fUoHO.', 'staff', 'active'),
(7, 'Rita Rider', 'rider@crispybite.test', '+256700000007', '$2b$12$fRUPVWQt3GwmsOnI2KotCOGN4BcDrv.Wmq7byu6C72ogoh.fUoHO.', 'rider', 'active'),
(8, 'Ronald Runner', 'ronald@crispybite.test', '+256700000008', '$2b$12$fRUPVWQt3GwmsOnI2KotCOGN4BcDrv.Wmq7byu6C72ogoh.fUoHO.', 'rider', 'active');

INSERT INTO menu_categories (id, name, description, status) VALUES
(1, 'Chicken Meals', 'Crispy chicken plates and combos.', 'active'),
(2, 'Burgers', 'Stacked chicken burgers and sandwiches.', 'active'),
(3, 'Wraps', 'Quick wraps with sauces and crunchy fillings.', 'active'),
(4, 'Drinks', 'Cold soft drinks and juices.', 'active'),
(5, 'Sides', 'Fries, slaw, and extra bites.', 'active'),
(6, 'Family Buckets', 'Large sharing meals for groups.', 'active');

INSERT INTO menu_items (id, category_id, item_name, description, price, image, availability_status, preparation_time_minutes) VALUES
(1, 1, 'Classic Crispy Chicken Meal', 'Two crispy chicken pieces with fries and a drink.', 34000, 'https://placehold.co/600x400/cc1f1a/ffffff?text=Classic+Chicken', 'available', 18),
(2, 1, 'Spicy Crunch Chicken Meal', 'Spicy chicken pieces served with fries.', 19990, 'https://placehold.co/600x400/111111/ffffff?text=Spicy+Crunch', 'available', 20),
(3, 1, 'Herb Roast Chicken Plate', 'Juicy roast-style chicken with herbs and slaw.', 15490, 'https://placehold.co/600x400/e8b923/111111?text=Herb+Chicken', 'available', 22),
(4, 2, 'Crispy Bite Burger', 'Crispy chicken fillet, lettuce, tomato, and house sauce.', 30000, 'https://placehold.co/600x400/cc1f1a/ffffff?text=Crispy+Burger', 'available', 14),
(5, 2, 'Double Stack Burger', 'Two chicken fillets with cheese and pickles.', 29400, 'https://placehold.co/600x400/111111/ffffff?text=Double+Stack', 'available', 16),
(6, 2, 'Mini Crunch Slider', 'Small crispy slider for a quick snack.', 31000, 'https://placehold.co/600x400/f7f7f7/111111?text=Slider', 'available', 10),
(7, 3, 'Spicy Chicken Wrap', 'Chicken strips wrapped with salad and spicy sauce.', 29000, 'https://placehold.co/600x400/cc1f1a/ffffff?text=Spicy+Wrap', 'available', 12),
(8, 3, 'Garden Crunch Wrap', 'Crunchy chicken, vegetables, and creamy dressing.', 16490, 'https://placehold.co/600x400/e8b923/111111?text=Garden+Wrap', 'available', 12),
(9, 4, 'Fresh Lemonade', 'Chilled lemonade with a bright citrus taste.', 22000, 'https://placehold.co/600x400/f7f7f7/111111?text=Lemonade', 'available', 3),
(10, 4, 'Berry Cooler', 'Sweet berry drink served cold.', 17000, 'https://placehold.co/600x400/cc1f1a/ffffff?text=Berry+Cooler', 'available', 3),
(11, 5, 'Golden Fries', 'Crisp fries with light seasoning.', 20000, 'https://placehold.co/600x400/e8b923/111111?text=Fries', 'available', 8),
(12, 5, 'Creamy Coleslaw', 'Fresh cabbage slaw with creamy dressing.', 10000, 'https://placehold.co/600x400/f7f7f7/111111?text=Coleslaw', 'available', 4),
(13, 5, 'Crispy Nuggets', 'Six crunchy chicken nuggets with dipping sauce.', 23000, 'https://placehold.co/600x400/e8b923/111111?text=Nuggets', 'available', 10),
(14, 6, 'Family Feast Bucket', 'Eight chicken pieces, four fries, and four drinks.', 22000, 'https://placehold.co/600x400/cc1f1a/ffffff?text=Family+Feast', 'available', 28),
(15, 6, 'Party Crunch Bucket', 'Twelve chicken pieces with sides for sharing.', 38000, 'https://placehold.co/600x400/111111/ffffff?text=Party+Bucket', 'unavailable', 35);

INSERT INTO carts (id, customer_id) VALUES
(1, 2),
(2, 3),
(3, 4);

INSERT INTO cart_items (cart_id, menu_item_id, quantity) VALUES
(1, 4, 1),
(1, 11, 2),
(2, 7, 2),
(3, 14, 1);

INSERT INTO delivery_addresses (id, customer_id, district, area, street, landmark, phone) VALUES
(1, 2, 'Kampala', 'Ntinda', 'Market Road', 'Near the taxi stage', '+256700000002'),
(2, 3, 'Kampala', 'Kololo', 'Hill Lane', 'Blue gate', '+256700000003');

INSERT INTO orders (id, customer_id, rider_id, order_number, order_type, delivery_address_id, total_amount, payment_method, payment_status, order_status, customer_notes) VALUES
(1, 2, NULL, 'QB-SEED-1001', 'pickup', NULL, 13.24, 'cash', 'pending', 'Pending', 'Please add extra napkins.'),
(2, 3, 7, 'QB-SEED-1002', 'delivery', 2, 21.98, 'mobile_money', 'paid', 'On the Way', 'Call when nearby.'),
(3, 2, 8, 'QB-SEED-1003', 'delivery', 1, 27.99, 'cash', 'pending', 'Accepted', 'No spicy sauce.');

INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal) VALUES
(1, 4, 1, 7.99, 7.99),
(1, 11, 1, 3.25, 3.25),
(1, 9, 1, 2.50, 2.50),
(2, 2, 2, 10.99, 21.98),
(3, 14, 1, 27.99, 27.99);

INSERT INTO order_tracking (order_id, status, description, updated_by) VALUES
(1, 'Pending', 'Order placed by customer.', 2),
(2, 'Pending', 'Order placed by customer.', 3),
(2, 'Accepted', 'Restaurant accepted the order.', 5),
(2, 'Preparing', 'Kitchen started preparing the food.', 5),
(2, 'Ready for Pickup', 'Order is ready for pickup.', 6),
(2, 'Assigned to Rider', 'Delivery rider assigned.', 6),
(2, 'Picked Up', 'Rider picked up the order from the restaurant.', 7),
(2, 'On the Way', 'Rider is on the way to the customer.', 7),
(3, 'Pending', 'Order placed by customer.', 2),
(3, 'Accepted', 'Restaurant accepted the order.', 5);

INSERT INTO payments (order_id, amount, payment_method, payment_status, transaction_reference) VALUES
(1, 13.24, 'cash', 'pending', 'PAY-SEED-1001'),
(2, 21.98, 'mobile_money', 'paid', 'PAY-SEED-1002'),
(3, 27.99, 'cash', 'pending', 'PAY-SEED-1003');

INSERT INTO notifications (user_id, title, message, status) VALUES
(2, 'Order received', 'Your order QB-SEED-1001 was received.', 'unread'),
(3, 'Delivery update', 'Your order is on the way.', 'unread'),
(7, 'New delivery assigned', 'Order QB-SEED-1002 is assigned to you.', 'read');

INSERT INTO reviews (order_id, customer_id, rating, comment) VALUES
(2, 3, 5, 'Food was hot and delivery was smooth.');
