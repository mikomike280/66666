/*
  # Populate Products Data

  1. Inserts main categories (Women, Men, Unisex)
  2. Inserts subcategories for each main category
  3. Populates all products across all categories

  This migration adds complete product inventory for:
  - Women's Category: Dresses, Two-Piece Sets, Tops, Sweaters, Trousers/Jeans, Jumpsuits, Accessories
  - Men's Category: T-Shirts & Polos, Official Shirts, Casual Shirts, Suits & Blazers, Accessories, Outerwear, Bottoms
  - Unisex Category: Sweaters, Accessories, Casual Wear, Outerwear, Bottoms
*/

-- Insert main categories
INSERT INTO categories (name, description, icon) VALUES
('Women', 'Women''s clothing and accessories', '👚'),
('Men', 'Men''s clothing and accessories', '👔'),
('Unisex', 'Unisex clothing and accessories', '👕')
ON CONFLICT DO NOTHING;

-- Get category IDs for use in product insertion
DO $$
DECLARE
  women_id uuid;
  men_id uuid;
  unisex_id uuid;
BEGIN
  SELECT id INTO women_id FROM categories WHERE name = 'Women';
  SELECT id INTO men_id FROM categories WHERE name = 'Men';
  SELECT id INTO unisex_id FROM categories WHERE name = 'Unisex';

  -- WOMEN'S PRODUCTS
  -- Dresses
  INSERT INTO products (category_id, name, description, color, size) VALUES
  (women_id, 'Bodycon Dress', 'Bodycon Dress', 'Black', NULL),
  (women_id, 'Normal Dress', 'Normal Dress', 'Purple', '46'),
  (women_id, 'Sun Dress', 'Sun Dress', 'Pink', '40'),
  (women_id, 'Maroon Bodycon Dress', 'Maroon Bodycon Dress', 'Maroon', NULL),
  (women_id, 'Mia Perla Normal Dress', 'Mia Perla Normal Dress', 'Navy Blue & White', '46');

  -- Two-Piece Sets
  INSERT INTO products (category_id, name, description, color, size) VALUES
  (women_id, 'Sleeveless Ankara Kimono Set', 'Sleeveless Ankara Kimono Set', 'Multi', NULL),
  (women_id, 'Green Ankara Kimono Set', 'Green Ankara Kimono Set', 'Green', NULL),
  (women_id, 'Two Piece Trouser Set', 'Two Piece Trouser Set', 'Black & White', NULL),
  (women_id, 'Flared Trouser Set', 'Flared Trouser Set', 'White & Yellow', NULL),
  (women_id, 'Skirt Suit', 'Skirt Suit', 'Grey Mixed Colours', '50');

  -- Tops
  INSERT INTO products (category_id, name, description, color, size) VALUES
  (women_id, 'Ankara Mini Tops', 'Ankara Mini Tops', 'Green & Black', NULL),
  (women_id, 'Top Catania', 'Top Catania', 'Pink', '40'),
  (women_id, 'Top Ladies Rosso', 'Top Ladies Rosso', 'White', '44'),
  (women_id, 'Top Striped', 'Top Striped', 'Blue & White', NULL),
  (women_id, 'Ladies Top Sisters', 'Ladies Top Sisters', 'Red & White', NULL);

  -- Sweaters
  INSERT INTO products (category_id, name, description, color, size) VALUES
  (women_id, 'Sleeveless Sweater', 'Sleeveless Sweater', 'Orange', NULL),
  (women_id, 'Long Sleeved Sweater', 'Long Sleeved Sweater', 'Maroon', 'Large'),
  (women_id, 'Short Sleeved Sweater', 'Short Sleeved Sweater', 'Red & Black', NULL),
  (women_id, 'Long Sleeved Sweater', 'Long Sleeved Sweater', 'Cream', NULL),
  (women_id, 'Sweater Oreya', 'Sweater Oreya', 'Green', 'Large');

  -- Trousers / Jeans
  INSERT INTO products (category_id, name, description, color, size) VALUES
  (women_id, 'Flared Jeans', 'Flared Jeans', 'Blue', '24'),
  (women_id, 'Jeans', 'Jeans', 'Black', '44'),
  (women_id, 'Official Pants', 'Official Pants', 'Black', '48'),
  (women_id, 'Jeans Flared', 'Jeans Flared', 'Blue', '46'),
  (women_id, 'Official Trouser', 'Official Trouser', 'Maroon', '44');

  -- Jumpsuits
  INSERT INTO products (category_id, name, description, color, size) VALUES
  (women_id, 'Blue & White Jumpsuit', 'Blue & White Jumpsuit', 'Blue & White', NULL),
  (women_id, 'Black & White Jumpsuit', 'Black & White Jumpsuit', 'Black & White', 'Free Size'),
  (women_id, 'Black & Brown Jumpsuit', 'Black & Brown Jumpsuit', 'Black & Brown', NULL),
  (women_id, 'Maroon Chinese Dress', 'Maroon Chinese Dress', 'Maroon', 'XL'),
  (women_id, 'Maroon Chinese Dress', 'Maroon Chinese Dress', 'Maroon', '2XL');

  -- Accessories
  INSERT INTO products (category_id, name, description, color, size) VALUES
  (women_id, 'Hand Bag', 'Hand Bag', 'Green', NULL),
  (women_id, 'Hand Bag', 'Hand Bag', 'White', NULL),
  (women_id, 'Pantyhose', 'Pantyhose', 'Black', NULL),
  (women_id, 'Panties', 'Panties', 'Black, Beige, Red, Flared', NULL),
  (women_id, 'Ladies Panties Pack', 'Ladies Panties Pack (3 White, 2 Black)', 'Multi', NULL);

  -- MEN'S PRODUCTS
  -- T-Shirts & Polos
  INSERT INTO products (category_id, name, description, color, size) VALUES
  (men_id, 'T-Shirt NGR Sportsline', 'T-Shirt NGR Sportsline', 'Light Grey', 'XL'),
  (men_id, 'T-Shirt NGR Sportsline', 'T-Shirt NGR Sportsline', 'Black', '3XL'),
  (men_id, 'Polo Shirt', 'Polo Shirt', 'Navy Blue', 'Medium'),
  (men_id, 'Polo Shirt Carducci', 'Polo Shirt Carducci', 'Navy Blue', 'Large'),
  (men_id, 'Polo Long Sleeved', 'Polo Long Sleeved', 'Blue', 'Medium');

  -- Official Shirts
  INSERT INTO products (category_id, name, description, color, size) VALUES
  (men_id, 'Official Shirt Simoni', 'Official Shirt Simoni', 'Purple & White Checked', NULL),
  (men_id, 'Official Shirt Dorelli', 'Official Shirt Dorelli', 'Light Blue', '3XL'),
  (men_id, 'Official Shirt Brunello Cucinelli', 'Official Shirt Brunello Cucinelli', 'White', 'Small'),
  (men_id, 'Official Shirt Luca Faloni', 'Official Shirt Luca Faloni', 'Cream', 'Medium'),
  (men_id, 'Official Shirt Brunello Cucinelli', 'Official Shirt Brunello Cucinelli', 'Blue', 'Medium');

  -- Casual Shirts
  INSERT INTO products (category_id, name, description, color, size) VALUES
  (men_id, 'Casual Shirt Casa Baez', 'Casual Shirt Casa Baez', 'Multi', '3XL'),
  (men_id, 'Casual Shirt Cano Nua', 'Casual Shirt Cano Nua', 'Dark Blue', '3XL'),
  (men_id, 'Casual Shirt', 'Casual Shirt', 'Blue & White', 'Medium'),
  (men_id, 'Casual Shirt Casa Baez', 'Casual Shirt Casa Baez', 'White & Mixed', '39/40'),
  (men_id, 'Casual Shirt Battista Vani', 'Casual Shirt Battista Vani', 'Maroon & Blue', NULL);

  -- Suits & Blazers
  INSERT INTO products (category_id, name, description, color, size) VALUES
  (men_id, 'Blazer', 'Blazer', 'Grey Checked', '58'),
  (men_id, '3-Piece Suit', '3-Piece Suit', 'Grey', '50'),
  (men_id, 'Suit Dorelli', 'Suit Dorelli', 'Checked Beige', '50'),
  (men_id, '2-Piece Suit Simoni', '2-Piece Suit Simoni', 'Black', '48'),
  (men_id, 'Zara Blazer', 'Zara Blazer', 'Green', '48');

  -- Accessories
  INSERT INTO products (category_id, name, description, color, size) VALUES
  (men_id, 'Belt', 'Belt', 'Black', '110'),
  (men_id, 'Belt', 'Belt', 'Black & Brown', '130'),
  (men_id, 'Men Cap', 'Men Cap', 'Navy Blue Striped', NULL),
  (men_id, 'Men Cap', 'Men Cap', 'Brown', NULL),
  (men_id, 'Socks', 'Socks - Mixed Colours (Brown, Grey, Navy Blue)', 'Multi', NULL);

  -- Outerwear
  INSERT INTO products (category_id, name, description, color, size) VALUES
  (men_id, 'Jacket Simon', 'Jacket Simon', 'Black & Brown Blend', '2XL'),
  (men_id, 'Men Sweater Vest', 'Men Sweater Vest', 'Cream', 'XL'),
  (men_id, 'Men Sweater Carducci', 'Men Sweater Carducci', 'Multi', NULL),
  (men_id, 'Trench Coat', 'Trench Coat', 'Multi', NULL);

  -- Bottoms
  INSERT INTO products (category_id, name, description, color, size) VALUES
  (men_id, 'Men Jeans', 'Men Jeans', 'Blue', '36'),
  (men_id, 'Official Trousers', 'Official Trousers', 'Multi', NULL),
  (men_id, 'Casual Trousers', 'Casual Trousers', 'Multi', NULL),
  (men_id, 'Denim', 'Denim', 'Blue', NULL);

  -- UNISEX PRODUCTS
  -- Sweaters
  INSERT INTO products (category_id, name, description, color, size) VALUES
  (unisex_id, 'Long Sleeved Sweater', 'Long Sleeved Sweater', 'Multi', NULL),
  (unisex_id, 'Short Sleeved Sweater', 'Short Sleeved Sweater', 'Multi', NULL),
  (unisex_id, 'Sleeveless Sweater', 'Sleeveless Sweater', 'Multi', NULL),
  (unisex_id, 'Heavy Knit Sweater', 'Heavy Knit Sweater', 'Multi', NULL),
  (unisex_id, 'Light Knit Sweater', 'Light Knit Sweater', 'Multi', NULL);

  -- Accessories
  INSERT INTO products (category_id, name, description, color, size) VALUES
  (unisex_id, 'Belt', 'Belt', 'Multi', NULL),
  (unisex_id, 'Socks', 'Socks - Mixed Colours', 'Multi', NULL),
  (unisex_id, 'Cap', 'Cap', 'Brown', NULL),
  (unisex_id, 'Cap', 'Cap', 'Navy', NULL),
  (unisex_id, 'Handbag', 'Handbag - Universal Design', 'Multi', NULL);

  -- Casual Wear
  INSERT INTO products (category_id, name, description, color, size) VALUES
  (unisex_id, 'T-Shirt', 'T-Shirt', 'Grey', NULL),
  (unisex_id, 'T-Shirt', 'T-Shirt', 'Black', NULL),
  (unisex_id, 'Polo T-Shirt', 'Polo T-Shirt', 'Multi', NULL),
  (unisex_id, 'Sweater Vest', 'Sweater Vest', 'Multi', NULL),
  (unisex_id, 'Light Jacket', 'Light Jacket', 'Multi', NULL);

  -- Outerwear
  INSERT INTO products (category_id, name, description, color, size) VALUES
  (unisex_id, 'Trench Coat', 'Trench Coat', 'Multi', NULL),
  (unisex_id, 'Blazer', 'Blazer', 'Neutral', NULL),
  (unisex_id, 'Jacket', 'Jacket', 'Multi', NULL),
  (unisex_id, 'Cardigan', 'Cardigan', 'Multi', NULL),
  (unisex_id, 'Everyday Coat', 'Everyday Coat', 'Multi', NULL);

  -- Bottoms
  INSERT INTO products (category_id, name, description, color, size) VALUES
  (unisex_id, 'Jeans', 'Jeans', 'Black', NULL),
  (unisex_id, 'Jeans', 'Jeans', 'Blue', NULL),
  (unisex_id, 'Leggings', 'Leggings', 'Multi', NULL),
  (unisex_id, 'Casual Trousers', 'Casual Trousers', 'Multi', NULL),
  (unisex_id, 'Free-Size Trousers', 'Free-Size Trousers', 'Multi', NULL);

END $$;