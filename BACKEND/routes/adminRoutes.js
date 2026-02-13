const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const adminController = require("../controller/adminController");


// Protect all admin routes
router.use(verifyToken, adminMiddleware);


// 📊 Dashboard
router.get("/dashboard", adminController.getDashboardStats);


// 👥 Users
router.get("/users", adminController.getAllUsers);
router.delete("/users/:id", adminController.deleteUser);


// 📦 Products
router.get("/products", adminController.getAllProducts);
router.delete("/products/:id", adminController.deleteProduct);


// 🛒 Orders
router.get("/orders", adminController.getAllOrders);
router.put("/orders/:id/status", adminController.updateOrderStatus);


module.exports = router;
