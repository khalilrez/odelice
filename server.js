// app.js

const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Sequelize Connection
const sequelize = new Sequelize('your_database', 'your_username', 'your_password', {
    host: 'localhost',
    dialect: 'mysql',
});

// Models
const Order = sequelize.define('Order', {
    orderId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    orderTotal: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    // Include customer information
    customerName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    customerAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    customerPhone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

const MenuItem = sequelize.define('MenuItem', {
    itemId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    itemName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
});

const MenuCategory = sequelize.define('MenuCategory', {
    categoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

const OrderItem = sequelize.define('OrderItem', {
    notes: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

// Associations
Customer.hasMany(Order);
Order.belongsTo(Customer);

Order.belongsToMany(MenuItem, { through: 'OrderItem' });
MenuItem.belongsToMany(Order, { through: 'OrderItem' });

MenuCategory.hasMany(MenuItem);
MenuItem.belongsTo(MenuCategory);


// Sync the models with the database
sequelize.sync()
    .then(() => {
        console.log('Models synchronized with the database');
    })
    .catch((err) => {
        console.error('Error synchronizing models with the database:', err);
    });

// Routes

// Create an order with menu items and notes
app.post('/orders', async (req, res) => {
    try {
        const { orderTotal, orderItems, customerName, customerAddress, customerPhone } = req.body;

        // Create the order with customer information
        const newOrder = await Order.create({
          orderTotal,
          customerName,
          customerAddress,
          customerPhone,
        });
    
        // Add menu items to the order with notes
        await Promise.all(orderItems.map(async (orderItem) => {
            const { menuItemId, notes } = orderItem;
            await newOrder.addMenuItem(menuItemId, { through: { notes } });
        }));

        // Fetch the order with associated menu items and notes
        const orderWithItemsAndNotes = await Order.findByPk(newOrder.orderId, {
            include: [
                {
                    model: MenuItem,
                    through: { attributes: ['notes'] },
                },
            ],
        });

        res.json(orderWithItemsAndNotes);
    } catch (err) {
        console.error('Error creating order with menu items and notes:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all orders with associated menu items and notes
app.get('/orders', async (req, res) => {
    try {
        const ordersWithItems = await Order.findAll({
            include: [
                {
                    model: MenuItem,
                    through: { attributes: ['notes'] },
                },
            ],
        });
        res.json(ordersWithItems);
    } catch (err) {
        console.error('Error fetching orders with menu items:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a specific order with associated menu items and notes by ID
app.get('/orders/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    try {
        const orderWithItems = await Order.findByPk(orderId, {
            include: [
                {
                    model: MenuItem,
                    through: { attributes: ['notes'] },
                },
            ],
        });
        if (!orderWithItems) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(orderWithItems);
    } catch (err) {
        console.error('Error fetching order with menu items:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/menuItems', async (req, res) => {
    try {
        const { itemName, description, price, categoryId } = req.body;
        const newItem = await MenuItem.create({ itemName, description, price, categoryId });
        res.json(newItem);
    } catch (err) {
        console.error('Error creating menu item:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/menuCategories', async (req, res) => {
    try {
        const { categoryName } = req.body;
        const newCategory = await MenuCategory.create({ categoryName });
        res.json(newCategory);
    } catch (err) {
        console.error('Error creating menu category:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
