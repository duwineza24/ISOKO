const Order = require("../model/order");
const Product = require("../model/product");
const User = require("../model/user");
const createOrder = async (req, res) => {
  try {
    const userId = req.user._id; // safer than client sending it
    const { items, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    const validatedItems = await Promise.all(
      items.map(async (item) => {
        if (!item.productId) throw new Error("ProductId required");
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        return {
          productId: product._id,
          quantity: item.quantity || 1,
          price: product.price,
        };
      })
    );

    const totalAmount = validatedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const newOrder = new Order({
      userId,
      items: validatedItems,
      shippingAddress,
      totalAmount,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      order: await savedOrder.populate("items.productId", "name price image"),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate(
      "items.productId"
    );

    res.status(200).json(orders);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};
const getOrdersForSeller = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const products = await Product.find({ sellerId }).select("_id");
    const productIds = products.map((p) => p._id);

    const orders = await Order.find({ "items.productId": { $in: productIds } })
      .populate("userId", "name email")
      .populate("items.productId", "name image price");

    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// Get orders for a specific product

const getOrdersByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user._id;

    // 1️⃣ Check if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // 2️⃣ Ensure seller owns this product
    if (product.sellerId.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // 3️⃣ Find all orders that contain this product
    const orders = await Order.find({
      "items.productId": product._id, // ObjectId match
    })
      .populate("userId", "name email") // customer info
      .populate("items.productId", "name price image") // product info
      .sort({ createdAt: -1 });

    res.status(200).json({ product, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );

    res.status(200).json({
      message: "Order status updated",
      order: updatedOrder,
    });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus },
      { new: true }
    );

    res.status(200).json({
      message: "Payment status updated",
      order: updatedOrder,
    });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

// update full order (items, shippingAddress, totalAmount)
const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updates = req.body;

    // optional: validate updates (items array, shippingAddress shape, etc.)
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Ensure only owner can update
    if (req.user && order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Apply updates (simple approach: replace fields provided)
    if (updates.items) order.items = updates.items;
    if (updates.shippingAddress)
      order.shippingAddress = updates.shippingAddress;
    if (updates.totalAmount !== undefined)
      order.totalAmount = updates.totalAmount;
    if (updates.orderStatus) order.orderStatus = updates.orderStatus;
    if (updates.paymentStatus) order.paymentStatus = updates.paymentStatus;

    const saved = await order.save();
    res.status(200).json(saved);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

// delete order
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user && order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Order.findByIdAndDelete(orderId);
    res.status(200).json({ message: "Order deleted" });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

module.exports = {
  createOrder,
  getOrdersByUser,
  getOrdersForSeller,
  updateOrderStatus,
  updatePaymentStatus,
  updateOrder,
  deleteOrder,
  getOrdersByProduct,
};
