CREATE TABLE IF NOT EXISTS ingredients (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) UNIQUE NOT NULL,
    description     VARCHAR(255),
    calories_per_g  INTEGER NOT NULL,
    price_per_g     INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS recipes (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) UNIQUE NOT NULL,
    prep_time   INTEGER,
    cook_time   INTEGER,
    steps       VARCHAR(1000)
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
    recipe_id       INTEGER PRIMARY KEY REFERENCES recipes(id),
    ingredient_id   INTEGER PRIMARY KEY REFERENCES ingredients(id),
    quantity        FLOAT
);

-- Pre-seed data for your V-Model Verification
INSERT INTO ingredients (name, description, calories_per_g, price_per_g) VALUES 
('Chicken Breast', '', 1.65, 0.01),
('Broccoli', '', 0.34, 0.005),
('Olive Oil', '', 8.84, 0.02)
ON CONFLICT (name) DO NOTHING;