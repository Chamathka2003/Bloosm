-- Sample data for flowers
INSERT IGNORE INTO flowers (name, description, price, stock_quantity, image_url, category, color, available) VALUES
('Red Roses', 'Beautiful red roses expressing love and feelings', 1350.00, 50, 'images/r1.avif', 'Roses', 'Red', TRUE),
('White Roses', 'Pure white roses symbolizing peace', 1500.00, 40, 'images/whiterose.jpg', 'Roses', 'White', TRUE),
('Premium Red Rose Bouquet', 'Stunning bouquet of fresh red roses perfect for special occasions', 1800.00, 15, 'images/cat1rose.webp', 'Roses', 'Red', TRUE),
('Pink Roses', 'Lovely pink roses for any occasion', 3000.00, 35, 'images/PInkrose.jpg', 'Roses', 'Pink', TRUE),
('Elegant Red Roses', 'Premium quality red roses', 4000.00, 45, 'images/r2.jpg', 'Roses', 'Red', TRUE),
('Special Rose Collection', 'Exquisite rose collection', 195.00, 30, 'images/R6.webp', 'Roses', 'Mixed', TRUE),
('Classic Rose Bouquet', 'Beautiful bouquet with 12 roses', 1500.00, 20, 'images/m1.webp', 'Bouquets', 'Mixed', TRUE),
('Spring Tulips', 'Fresh spring tulips in vibrant colors', 200.00, 30, 'images/t1.webp', 'Tulips', 'Yellow', TRUE),
('Pink Tulips', 'Lovely pink tulips perfect for any occasion', 220.00, 25, 'images/t2.jpg', 'Tulips', 'Pink', TRUE),
('Purple Tulips', 'Elegant purple tulips', 210.00, 28, 'images/t3.webp', 'Tulips', 'Purple', TRUE),
('Red Tulips', 'Stunning red tulips', 230.00, 22, 'images/t4.jpg', 'Tulips', 'Red', TRUE),
('White Tulips', 'Pure white tulips symbolizing elegance', 215.00, 26, 'images/t5.jpg', 'Tulips', 'White', TRUE),
('White Orchids', 'Elegant and exotic white orchids', 500.00, 15, 'images/o2.jpg', 'Orchids', 'White', TRUE),
('Purple Orchids', 'Stunning purple orchids', 520.00, 12, 'images/o3.webp', 'Orchids', 'Purple', TRUE),
('Pink Orchids', 'Beautiful pink orchids', 510.00, 14, 'images/o4.webp', 'Orchids', 'Pink', TRUE),
('Yellow Orchids', 'Vibrant yellow orchids', 530.00, 10, 'images/o5.webp', 'Orchids', 'Yellow', TRUE),
('Mixed Orchids', 'Premium mixed color orchids', 550.00, 8, 'images/o6.webp', 'Orchids', 'Mixed', TRUE),
('Blue Orchids', 'Rare blue orchids collection', 580.00, 6, 'images/o6.jpg', 'Orchids', 'Blue', TRUE),
('Premium Mixed Bouquet', 'Elegant mixed flower bouquet', 2000.00, 10, 'images/m2.webp', 'Bouquets', 'Mixed', TRUE),
('Luxury Rose Arrangement', 'Luxurious rose arrangement for special moments', 2500.00, 12, 'images/m4.webp', 'Bouquets', 'Mixed', TRUE),
('Garden Fresh Bouquet', 'Fresh garden flowers beautifully arranged', 1800.00, 15, 'images/m5.webp', 'Bouquets', 'Mixed', TRUE),
('Deluxe Flower Collection', 'Premium deluxe flower collection', 3000.00, 8, 'images/m6.webp', 'Bouquets', 'Mixed', TRUE),
('Jasmine Flowers', 'Fragrant jasmine flowers', 100.00, 60, NULL, 'Other', 'White', TRUE);

-- Sample users (password is same as username for demo)
INSERT IGNORE INTO users (username, email, password, role, active, created_date) VALUES
('admin', 'admin@bloosm.lk', 'admin', 'ADMIN', TRUE, CURRENT_TIMESTAMP);

INSERT IGNORE INTO users (username, email, password, role, active, created_date) VALUES
('user', 'user@bloosm.lk', 'user', 'USER', TRUE, CURRENT_TIMESTAMP);

INSERT IGNORE INTO users (username, email, password, role, active, created_date) VALUES
('john', 'john@example.com', 'john123', 'USER', TRUE, CURRENT_TIMESTAMP);

-- Sample customer for guest/default cart
INSERT IGNORE INTO customers (name, email, phone, address, registered_date) VALUES
('Guest Customer', 'guest@bloosm.lk', '0771234567', 'Colombo, Sri Lanka', CURRENT_TIMESTAMP);