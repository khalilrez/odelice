INSERT INTO menuCategories (categoryName, createdAt, updatedAt) VALUES
('Sandwich', NOW(), NOW()),
('Panini', NOW(), NOW()),
('Hamburger', NOW(), NOW()),
('Crepe-Salee', NOW(), NOW()),
('Crepe-Sucree', NOW(), NOW()),
('Boissons', NOW(), NOW());

INSERT INTO menuItems (itemName, description, price, createdAt, updatedAt, MenuCategoryCategoryId) VALUES
('Sandwich Thon', 'Thon + Omelette Mozzarella + sauce au choix', '5.000', NOW(), NOW(), 1),
('Sandwich Jambon', 'Jambon + Omelette + sauce au choix', '5.000', NOW(), NOW(), 1),
('Sandwich Chicken', 'Escalope Curry + Omelette Mozzarella + sauce au choix', '6.500', NOW(), NOW(), 1),
('Sandwich Double Cheese', 'Escalope Curry + Omelette Mozzarella + Portion Gruyere + sauce au choix', '8.000', NOW(), NOW(), 1),
('Sandwich Triple Cheese', 'Escalope Curry + Omelette Mozzarella + Portion Gruyere + Edam +  sauce au choix', '9.000', NOW(), NOW(), 1),
('Sandwich Merguez', 'Merguez + Omelette Mozzarella + Sauce au choix', '6.000', NOW(), NOW(), 1),
('Sandwich Royal Viande Hachée', 'Viande Hachee + Omelette Mozzarella + Portion Gruyere + Sauce au choix', '7.500', NOW(), NOW(), 1),
('Sandwich Steak Hachée', 'Steak Hachée + Omelette Mozzarella + Portion Gruyere + sauce au choix', '7.500', NOW(), NOW(), 1),
('Sandwich Kebda', 'Kebda + Tastira + sauce au choix', '7.500', NOW(), NOW(), 1),
('Sandwich La Casa', 'Viande Hachee + Omelette Mozzarella + Bacon + Raclette + Gruyere + Sauce au choix', '11.000', NOW(), NOW(), 1);

INSERT INTO menuItems (itemName, description, price, createdAt, updatedAt, MenuCategoryCategoryId) VALUES
('Panini Thon', 'Thon + Mozzarella', '4.500', NOW(), NOW(), 2),
('Panini Jambon ', 'Jambon + Mozzarella', '4.500', NOW(), NOW(), 2),
('Panini Omelette', 'Omelette fromage + Mozzarella', '4.500', NOW(), NOW(), 2),
('Panini Poulet Curry', 'Escalope Curry  + Mozzarella', '5.500', NOW(), NOW(), 2),
('Panini Royal Viande Hachee', 'Viande Hachee  + Mozzarella4', '6.000', NOW(), NOW(), 2);

INSERT INTO menuItems (itemName, price, createdAt, updatedAt, MenuCategoryCategoryId) VALUES
('Chicken Burger + Frites', '7.000', NOW(), NOW(), 3),
('Cheese Burger + Frites', '8.000', NOW(), NOW(), 3),
('Double Cheese + Frites', '9.000', NOW(), NOW(), 3),
('Double Burger Double Cheese', '13.000', NOW(), NOW(), 3);


INSERT INTO menuItems (itemName, description, price, createdAt, updatedAt, MenuCategoryCategoryId) VALUES
('Classique', 'Mozarella', '4.500', NOW(), NOW(), 4),
('Normande', 'Jambon + mozzarella', '5.500', NOW(), NOW(), 4),
('Ocean', 'Thon + Mozzarella', '6.000', NOW(), NOW(), 4),
('Pizza', 'Thon + Mozzarella + Sauce tomate + Olive', '6.500', NOW(), NOW(), 4),
('Tunisienne', 'Thon + Mozzarella + oeuf ', '6.500', NOW(), NOW(), 4),
('Supreme Fermier', 'Escalope Curry + Mozzarella', '7.000', NOW(), NOW(), 4),
('Mexicaine', 'Viande hachee + Mozzarella + Legume saute', '8.000', NOW(), NOW(), 4),
('4 Fromages', 'Mozzarella + Edam, Gruyere + Raclette', '9.500', NOW(), NOW(), 4);

INSERT INTO menuItems (itemName,description, price, createdAt, updatedAt, MenuCategoryCategoryId) VALUES
('Chocolat Said',NULL, '4.000', NOW(), NOW(), 5),
('Chocolat Said Amande',NULL, '5.500', NOW(), NOW(), 5),
('Chocolat Said Noisette',NULL, '5.500', NOW(), NOW(), 5),
('Chocolat Said Amande et Noisette',NULL, '7.000', NOW(), NOW(), 5),
('Nutella',NULL, '7.000', NOW(), NOW(), 5),
('Memory', 'Nutella + Amande', '8.000', NOW(), NOW(), 5),
('Alldry', 'Nutella + Noisette + Amande + Pistache', '10.000', NOW(), NOW(), 5);

INSERT INTO menuItems (itemName, price, createdAt, updatedAt, MenuCategoryCategoryId) VALUES
('Eau 0.5', '1.000', NOW(), NOW(), 6),
('Eau 1.5', '1.500', NOW(), NOW(), 6),
('Boisson Gazeuze', '2.500', NOW(), NOW(), 6);
