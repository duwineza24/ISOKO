const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrdersByUser,
  getOrdersForSeller,
  updateOrderStatus,
  updatePaymentStatus,
  updateOrder,
  deleteOrder,
  getOrdersByProduct,
} = require("../controller/orderController");

const protect = require("../middleware/authMiddleware"); // if you have it

router.post("/", protect, createOrder);
router.get("/user/:userId", protect, getOrdersByUser);
router.get("/seller", protect, getOrdersForSeller);
// Get all orders for a product
router.get("/product/:productId", protect, getOrdersByProduct);

router.put("/:orderId/status", protect, updateOrderStatus);
router.put("/:orderId/payment", protect, updatePaymentStatus);
router.put("/:orderId", protect, updateOrder);
router.delete("/:orderId", protect, deleteOrder);

module.exports = router;
