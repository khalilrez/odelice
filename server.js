// app.js

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
const multer = require("multer");
const uuid = require('uuid');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Specify the path where you want to store uploaded images
  },
  filename: function (req, file, cb) {
    const randomFileName = uuid.v4(); // Generate a random string
    cb(null, randomFileName + file.originalname.substring(file.originalname.lastIndexOf('.'))); // Use a unique filename
  },
});
const upload = multer({ storage: storage });

const app = express();
const port = 3000;
app.use("/uploads", express.static("public/uploads"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Serve static files from the 'public' directory
app.use(express.static("public"));

// Sequelize Connection
const sequelize = new Sequelize(
  "gohardnu_odelice",
  "gohardnu_odelice",
  "Odelice123",
  {
    host: "localhost",
    dialect: "mysql",
  }
);

// Models
const User = sequelize.define("User", {
  customerId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
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
    unique: true,
  },
  customerPassword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Order = sequelize.define("Order", {
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
  deliveryOption: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  numberOfDrinks: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // New fields for order status and completion time
  status: {
    type: DataTypes.ENUM("pending", "done"),
    defaultValue: "pending",
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

const MenuItem = sequelize.define("MenuItem", {
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
    allowNull: true,
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

const MenuCategory = sequelize.define("MenuCategory", {
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

const OrderItem = sequelize.define("OrderItem", {
  notes: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Associations

Order.belongsToMany(MenuItem, { through: "OrderItem" });
MenuItem.belongsToMany(Order, { through: "OrderItem" });

MenuCategory.hasMany(MenuItem);
MenuItem.belongsTo(MenuCategory);

// Sync the models with the database
sequelize
  .sync()
  .then(() => {
    console.log("Models synchronized with the database");
  })
  .catch((err) => {
    console.error("Error synchronizing models with the database:", err);
  });

// MIDDLEWARE
const checkAdminCredentials = (req, res, next) => {
  const { user } = req.session;

  // Check if user has admin credentials
  if (
    user &&
    user.customerName === "admin" &&
    user.customerPhone === "00000000"
  ) {
    // User has admin credentials, proceed to the next middleware or route
    next();
  } else {
    // User does not have admin credentials, redirect or send an unauthorized response
    res.status(403).send("Forbidden");
  }
};

const createDefaultAdminUser = async () => {
  try {
    const adminUser = await User.findOrCreate({
      where: {
        customerName: "admin",
        customerPhone: "00000000",
      },
      defaults: {
        customerAddress: "Admin Address", // Add default address if needed
        customerPassword: "adminPassword", // Set a secure default password
      },
    });

    console.log("Default admin user created:", adminUser[0].get());
  } catch (error) {
    console.error("Error creating default admin user:", error);
  }
};
// Routes
createDefaultAdminUser();
app.get("/", async (req, res) => {
  try {
    const menuItems = await MenuItem.findAll({
      include: [MenuCategory],
      order: Sequelize.literal("rand()"),
      limit: 9,
    });

    res.render("index", { pageTitle: "Homepage", menuItems });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/cart", async (req, res) => {
  res.render("cart", { pageTitle: "Cart", user: req.session.user });
});

// Define Menu Page
app.get("/menu", async (req, res) => {
  try {
    const menuItems = await MenuItem.findAll({ include: [MenuCategory] });
    const menuCategories = await MenuCategory.findAll();
    res.render("menu", { pageTitle: "Menu", menuItems, menuCategories });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Show all Orders Page
app.get("/admin/orders", checkAdminCredentials, async (req, res) => {
  try {
    // Fetch orders with associated menu items and notes
    const orders = await Order.findAll({
      include: [
        {
          model: MenuItem,
          through: { model: OrderItem, attributes: ["notes"] },
        },
      ],
    });

    res.render("admin/orders", { orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/admin", async (req, res) => {
  res.redirect("/admin/orders");
});

// Create Menu Item Page
app.get("/admin/createMenuItem", checkAdminCredentials, async (req, res) => {
  try {
    // Fetch categories from the database
    const categories = await MenuCategory.findAll();

    // Render the page with the categories
    res.render("admin/create-item", { categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Create Menu Category Page
app.get("/admin/createCategory", checkAdminCredentials, (req, res) => {
  res.render("admin/create-category");
});

// Create OrderItem
app.get("/order/:itemId", async (req, res) => {
  try {
    // Fetch the menuItem based on the itemId from the URL parameter
    const menuItem = await MenuItem.findByPk(req.params.itemId);

    // Render the order page with the menuItem details
    res.render("create-orderItem", { menuItem });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
// List Menu Items
app.get("/admin/menuItems", checkAdminCredentials, async (req, res) => {
  const menuItems = await MenuItem.findAll();
  res.render("admin/menuItems", { menuItems });
});

// Add New Menu Item
app.get("/admin/menuItems/new", checkAdminCredentials, (req, res) => {
  res.render("admin/menuItemForm", { action: "new" });
});


// Edit Menu Item
app.get("/admin/menuItems/:itemId/edit", checkAdminCredentials, async (req, res) => {
  const categories = await MenuCategory.findAll();
  const item = await MenuItem.findByPk(req.params.itemId);
  res.render("admin/menuItemForm", { action: "Edit", item, categories });
});

app.post("/admin/menuItems/:itemId/edit", upload.single("image"), async (req, res) => {
  // Handle the uploaded image and other form data
  const { itemName, description, price, categoryId } = req.body;
  const randomFileName = req.file ? req.file.filename : null;
  const imagePath = randomFileName ? `/uploads/${randomFileName}` : null;

  try {
    // Find the MenuItem by ID
    const menuItem = await MenuItem.findByPk(req.params.itemId);

    // Update the MenuItem properties
    menuItem.itemName = itemName;
    menuItem.description = description;
    menuItem.price = price;

    // Update the image path only if a new image is uploaded
    if (imagePath) {
      menuItem.image = imagePath;
    }

    menuItem.MenuCategoryCategoryId = categoryId;

    // Save the changes
    await menuItem.save();

    // Redirect to the menu items page or another appropriate route
    res.redirect("/admin/menuItems");
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Delete Menu Item
app.get("/admin/menuItems/:itemId/delete", checkAdminCredentials, async (req, res) => {
  await MenuItem.destroy({ where: { itemId: req.params.itemId } });
  res.redirect("/admin/menuItems");
});

// List Menu Categories
app.get("/admin/menuCategories", checkAdminCredentials, async (req, res) => {
  const menuCategories = await MenuCategory.findAll();
  res.render("admin/menuCategories", { menuCategories });
});

// Add New Menu Category
app.get("/admin/menuCategories/new", checkAdminCredentials, (req, res) => {
  res.render("admin/menuCategoryForm", { action: "Add" });
});

app.post("/admin/menuCategories/new", checkAdminCredentials, async (req, res) => {
  await MenuCategory.create(req.body);
  res.redirect("/admin/menuCategories");
});

// Edit Menu Category
app.get("/admin/menuCategories/:categoryId/edit", checkAdminCredentials, async (req, res) => {
  const category = await MenuCategory.findByPk(req.params.categoryId);
  res.render("admin/menuCategoryForm", { action: "Edit", category });
});

app.post("/admin/menuCategories/:categoryId/edit", checkAdminCredentials, async (req, res) => {
  await MenuCategory.update(req.body, {
    where: { categoryId: req.params.categoryId },
  });
  res.redirect("/admin/menuCategories");
});

// Delete Menu Category
app.get("/admin/menuCategories/:categoryId/delete", checkAdminCredentials, async (req, res) => {
  await MenuCategory.destroy({ where: { categoryId: req.params.categoryId } });
  res.redirect("/admin/menuCategories");
});

// Create an order with menu items and notes
app.post("/api/orders", async (req, res) => {
  try {
    const {
      orderTotal,
      orderItems,
      customerName,
      customerAddress,
      customerPhone,
      numberOfDrinks,
      deliveryOption
    } = req.body;

    // Create the order with customer information
    const newOrder = await Order.create({
      orderTotal,
      customerName,
      customerAddress,
      customerPhone,
      numberOfDrinks,
      deliveryOption
    });

    // Add menu items to the order with notes
    await Promise.all(
      orderItems.map(async (orderItem) => {
        const { menuItemId, notes } = orderItem;
        await newOrder.addMenuItem(menuItemId, { through: { notes } });
      })
    );

    // Fetch the order with associated menu items and notes
    const orderWithItemsAndNotes = await Order.findByPk(newOrder.orderId, {
      include: [
        {
          model: MenuItem,
          through: { attributes: ["notes"] },
        },
      ],
    });

    res.json(orderWithItemsAndNotes);
  } catch (err) {
    console.error("Error creating order with menu items and notes:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Handle Create Menu Item Form
app.post("/api/menuItems", upload.single("image"), async (req, res) => {
  // Handle the uploaded image and other form data
  const { itemName, description, price, categoryId } = req.body;

  const randomFileName = req.file ? req.file.filename : null;
  const imagePath = randomFileName ? `/uploads/${randomFileName}` : null;

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
    res.redirect("/admin/menuItems");
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Handle Create Menu category Form
app.post("/api/menuCategories", async (req, res) => {
  try {
    const { categoryName } = req.body;
    const newCategory = await MenuCategory.create({ categoryName });
    res.redirect("/admin/createCategory");
  } catch (err) {
    console.error("Error creating menu category:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/orders/:orderId/markAsDone", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    // Implement logic to update the order status to "done" in the database
    await Order.update({ status: "done" }, { where: { orderId } });
    res.json({ message: `Order ${orderId} marked as done` });
  } catch (err) {
    console.error(`Error marking order as done: ${err}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete order
app.delete("/api/orders/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    // Implement logic to delete the order and associated order items from the database
    await Order.destroy({ where: { orderId } });
    res.json({ message: `Order ${orderId} deleted` });
  } catch (err) {
    console.error(`Error deleting order: ${err}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete all orders
app.delete("/api/orders", async (req, res) => {
  try {
    // Implement logic to delete all orders and associated order items from the database
    await Order.destroy({ where: { status: "done" } });
    res.json({ message: "All done orders deleted" });
  } catch (err) {
    console.error(`Error deleting all orders: ${err}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get order status
app.get("/api/order-status", async (req, res) => {
  try {
    const phoneNumber = req.query.phone;

    // Fetch orders by phone number
    const orders = await Order.findAll({
      where: { customerPhone: phoneNumber },
      include: [{ model: MenuItem, through: { attributes: ["notes"] } }],
    });

    res.json(orders);
  } catch (err) {
    console.error(`Error fetching orders by phone number: ${err}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// AUTH ROUTES

app.get("/login", (req, res) => {
  if (!req.session.user) {
    res.render("login");
  } else {
    res.redirect("/profile");
  }
});
app.get("/profile", (req, res) => {
  // Check if the user is logged in
  if (req.session.user) {
    res.render("profile", { user: req.session.user });
  } else {
    // If not logged in, redirect to the login page
    res.redirect("/login");
  }
});
// Handle form submission for updating profile
app.post("/profile", async (req, res) => {
  // Check if the user is logged in
  if (req.session.user) {
    const { customerName, customerAddress, customerPhone } = req.body;

    // Update user information in the session

    try {
      // Update user information in the database
      await User.update(
        {
          customerName: customerName,
          customerAddress: customerAddress,
          customerPhone: customerPhone,
        },
        {
          where: { customerId: req.session.user.customerId },
        }
      );
      req.session.user.customerName = customerName;
      req.session.user.customerAddress = customerAddress;
      req.session.user.customerPhone = customerPhone;
      // Redirect back to the profile page
      res.redirect("/profile", { error: "Téléphone déja utilisé" });
    } catch (error) {
      console.error("Error updating user in the database:", error);
      res.render("profile", {
        user: req.session.user,
        error: "Erreur lors de la modification du profil..",
      });
    }
  } else {
    // If not logged in, redirect to the login page
    res.redirect("/login");
  }
});
app.post("/login", async (req, res) => {
  const { customerPhone, customerPassword } = req.body;

  try {
    const user = await User.findOne({
      where: {
        customerPhone: customerPhone,
        customerPassword: customerPassword,
      },
    });

    if (user) {
      req.session.user = user;
      res.redirect("/");
    } else {
      res.render("login", { error: "Téléphone ou mot de passe incorrect" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.render("login", { error: "Internal Server Error" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { customerName, customerAddress, customerPhone, customerPassword } =
    req.body;

  try {
    const newUser = await User.create({
      customerName,
      customerAddress,
      customerPhone,
      customerPassword,
    });

    req.session.user = newUser;
    res.redirect("/");
  } catch (error) {
    console.error("Error during registration:", error);
    res.render("register", {
      locals: { error: "Erreur d'inscription. veuillez réessayer" },
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
