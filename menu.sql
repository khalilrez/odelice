INSERT INTO menuCategories (categoryName, createdAt, updatedAt) VALUES
('Sandwich', NOW(), NOW()),
('Panini', NOW(), NOW()),
('Hamburger', NOW(), NOW()),
('Crepe Salee', NOW(), NOW()),
('Crepe Sucree', NOW(), NOW()),
('Frites', NOW(), NOW()),
('Boissons', NOW(), NOW());

INSERT INTO menuItems (itemName, description, price, createdAt, updatedAt, MenuCategoryCategoryId) VALUES
('Sandwich Thon', 'Thon + salade + oeuf cuite + sauce au choix', '4.000', NOW(), NOW(), 1),
('Sandwich Anglais', 'Jambon fume + salade + oeuf cuite + sauce au choix', '4.000', NOW(), NOW(), 1),
('Sandwich Chicken', 'Poulet Curry + salade + oeuf cuite + sauce au choix', '5.300', NOW(), NOW(), 1),
('Sandwich Fermier', 'Poulet Curry + gruyere + salade + Omelette + sauce au choix', '6.500', NOW(), NOW(), 1),
('Sandwich Double Cheese', 'Poulet curry + oeuf cuite + mozzarella + gruyere, salade + sauce au choix', '7.000', NOW(), NOW(), 1),
('Sandwich Merguez', 'Merguez + Omelette + Salade + Sauce au choix', '5.000', NOW(), NOW(), 1),
('Sandwich Royal', 'Viande Hachee + Salade + Oeuf Cuite + Slice + Sauce au choix', '5.500', NOW(), NOW(), 1),
('Sandwich Steak', 'Steak + Salade + Oeuf Cuite + Slice + sauce au choix', '5.500', NOW(), NOW(), 1),
('Sandwich La Casa', 'Viande Hachee + Bacon + Raclette + Gruyere + Salade + Oeuf Cuite + Sauce au choix', '9.000', NOW(), NOW(), 1);

INSERT INTO menuItems (itemName, description, price, createdAt, updatedAt, MenuCategoryCategoryId) VALUES
('Panini Thon', 'Thon + Mozzarella + Laittue + Oignon + Mayo + Ketchup', '3.800', NOW(), NOW(), 2),
('Panini Jambon Fume', 'Jambon fume + Mozzarella + Laittue + Oignon + Mayo + Ketchup', '3.800', NOW(), NOW(), 2),
('Panini Omelette', 'Omelette fromage + Mozzarella + Laittue + Oignon + Mayo + Ketchup', '4.000', NOW(), NOW(), 2),
('Panini Poulet Curry', 'Poulet Curry  + Mozzarella + Laittue + Oignon + Mayo + Ketchup', '4.300', NOW(), NOW(), 2),
('Panini Viande Hachee', 'Viande Hachee  + Mozzarella + Laittue + Oignon + Mayo + Ketchup', '5.000', NOW(), NOW(), 2);

INSERT INTO menuItems (itemName, price, createdAt, updatedAt, MenuCategoryCategoryId) VALUES
('Cheese Burger', '6.000', NOW(), NOW(), 3),
('Double Cheese', '7.000', NOW(), NOW(), 3),
('Double burger cheese', '9.000', NOW(), NOW(), 3);

INSERT INTO menuItems (itemName, description, price, createdAt, updatedAt, MenuCategoryCategoryId) VALUES
('Classique', 'Mozarella + Salade', '3.500', NOW(), NOW(), 4),
('Normande', 'Jambon fume + mozzarella + legumes saute + salade verte', '5.000', NOW(), NOW(), 4),
('Ocean', 'Thon + Mozzarella + Legume saute + salade verte', '5.000', NOW(), NOW(), 4),
('Pizza', 'Thon + Mozzarella + Sauce tomate + Olive + Salade verte', '5.500', NOW(), NOW(), 4),
('Tunisienne', 'Thon + Mozzarella + oeuf + salade verte', '5.500', NOW(), NOW(), 4),
('Supreme Fermier', 'Poulet Curry + Mozzarella + Legume saute + Salade verte', '6.000', NOW(), NOW(), 4),
('Mexicaine', 'Viande hachee + Mozzarella + Legume saute + salade verte', '6.000', NOW(), NOW(), 4),
('4 Fromages', 'Mozzarella, Edam, Gruyere, Raclette, Sauce fromage, Salade verte', '8.500', NOW(), NOW(), 4);

INSERT INTO menuItems (itemName,description, price, createdAt, updatedAt, MenuCategoryCategoryId) VALUES
('Chocolat Said',NULL, '2.500', NOW(), NOW(), 5),
('Nutella',NULL, '6.000', NOW(), NOW(), 5),
('Delight', 'Nutella + Banane', '7.500', NOW(), NOW(), 5),
('Memory', 'Nutella + Amande', '6.700', NOW(), NOW(), 5),
('Alldry', 'Nutella + Noisette + Amande + Pistache', '8.500', NOW(), NOW(), 5),
('Chocolat plenty', 'Nutella + Noisette + Amande filet + Pistache + banane', '9.000', NOW(), NOW(), 5);

INSERT INTO menuItems (itemName, price, createdAt, updatedAt, MenuCategoryCategoryId) VALUES
('Eau 0.5', '1.000', NOW(), NOW(), 6),
('Eau 1.5', '1.500', NOW(), NOW(), 6),
('Boisson Gazeuze', '1.700', NOW(), NOW(), 6);

INSERT INTO menuItems (itemName, price, createdAt, updatedAt, MenuCategoryCategoryId) VALUES
('Assiette Frites', '1.000', NOW(), NOW(), 7);
