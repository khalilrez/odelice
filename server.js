// app.js

const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Specify the path where you want to store uploaded images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Use a unique filename
    },
});
const upload = multer({ storage: storage });


const app = express();
const port = 3000;
app.use('/uploads', express.static('public/uploads'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Serve static files from the 'public' directory
app.use(express.static('public'));

// Sequelize Connection
const sequelize = new Sequelize('odelice', 'odelice', 'odelice', {
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

    // New fields for order status and completion time
    status: {
        type: DataTypes.ENUM('pending', 'done'),
        defaultValue: 'pending',
    },
    completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
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
    image: {
        type: DataTypes.STRING,
        allowNull: true,
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

// Define a route to get all menu items
app.get('/', async (req, res) => {
    try {
        const menuItems = await MenuItem.findAll({ include: [MenuCategory] });
        const menuCategories = await MenuCategory.findAll();


        res.render('index', { pageTitle: 'Homepage', menuItems, menuCategories });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/cart', async (req, res) => {
    res.render('cart', { pageTitle: 'Cart' });
});

// Define Menu Page
app.get('/menu', async (req, res) => {
    try {
        const menuItems = await MenuItem.findAll({ include: [MenuCategory] });
        const menuCategories = await MenuCategory.findAll();
        res.render('menu', { pageTitle: 'Menu', menuItems, menuCategories });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Show all Orders Page
app.get('/admin/orders', async (req, res) => {
    try {
        // Fetch orders with associated menu items and notes
        const orders = await Order.findAll({
            include: [
                {
                    model: MenuItem,
                    through: { model: OrderItem, attributes: ['notes'] },
                },
            ],
        });

        res.render('admin/orders', { orders });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Create OrderItem
app.get('/order/:itemId', async (req, res) => {
    try {
        // Fetch the menuItem based on the itemId from the URL parameter
        const menuItem = await MenuItem.findByPk(req.params.itemId);

        // Render the order page with the menuItem details
        res.render('create-orderItem', { menuItem });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Create Menu Item Page
app.get('/admin/createMenuItem', async (req, res) => {
    try {
        // Fetch categories from the database
        const categories = await MenuCategory.findAll();

        // Render the page with the categories
        res.render('admin/create-item', { categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Internal Server Error');
    }
});





// Create an order with menu items and notes
app.post('/api/orders', async (req, res) => {
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

// Handle Create Menu Item Form
app.post('/api/menuItems', upload.single('image'), async (req, res) => {
    // Handle the uploaded image and other form data
    const { itemName, description, price, categoryId } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        // Create a new MenuItem with the image path
        const menuItem = await MenuItem.create({
            itemName,
            description,
            price,
            image: imagePath,
            MenuCategoryCategoryId: categoryId,
        });

        // Respond with the created MenuItem
        res.json(menuItem);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Handle Create Menu category Form
app.post('/api/menuCategories', async (req, res) => {
    try {
        const { categoryName } = req.body;
        const newCategory = await MenuCategory.create({ categoryName });
        res.json(newCategory);
    } catch (err) {
        console.error('Error creating menu category:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.put('/api/orders/:orderId/markAsDone', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        // Implement logic to update the order status to "done" in the database
        await Order.update({ status: 'done' }, { where: { orderId } });
        res.json({ message: `Order ${orderId} marked as done` });
    } catch (err) {
        console.error(`Error marking order as done: ${err}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete order
app.delete('/api/orders/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        // Implement logic to delete the order and associated order items from the database
        await Order.destroy({ where: { orderId } });
        res.json({ message: `Order ${orderId} deleted` });
    } catch (err) {
        console.error(`Error deleting order: ${err}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete all orders
app.delete('/api/orders', async (req, res) => {
    try {
        // Implement logic to delete all orders and associated order items from the database
        await Order.destroy({ where: { status: 'done' } });
        res.json({ message: 'All done orders deleted' });
    } catch (err) {
        console.error(`Error deleting all orders: ${err}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get order status
app.get('/api/order-status', async (req, res) => {
    try {
        const phoneNumber = req.query.phone;

        // Fetch orders by phone number
        const orders = await Order.findAll({
            where: { customerPhone: phoneNumber },
            include: [{ model: MenuItem, through: { attributes: ['notes'] } }],
        });

        res.json(orders);
    } catch (err) {
        console.error(`Error fetching orders by phone number: ${err}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
