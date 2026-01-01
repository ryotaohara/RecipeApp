CREATE TABLE IF NOT EXISTS ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(255),
    calories_per_g FLOAT NOT NULL,
    price_per_g FLOAT NOT NULL
);

-- Pre-seed data for your V-Model Verification
INSERT INTO ingredients (name, calories_per_g, price_per_g) VALUES 
('Chicken Breast', '', 1.65, 0.01),
('Broccoli', '', 0.34, 0.005),
('Olive Oil', '', 8.84, 0.02)
ON CONFLICT (name) DO NOTHING;