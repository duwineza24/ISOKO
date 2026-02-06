const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProduct,
  getOneProduct,
  getProductBySeller,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, createProduct);
router.get("/", getProduct);
router.get("/:id", protect, getOneProduct);
router.get("/seller/me", protect, getProductBySeller);

router.delete("/:id", protect, deleteProduct);
router.put("/:id", protect, updateProduct);
module.exports = router;
