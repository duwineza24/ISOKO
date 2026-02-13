const User = require("../model/user");
const Product = require("../model/product");
const Order = require("../model/order");


// 📊 Dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const totalSellers = await User.countDocuments({ role: "seller" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenue = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    res.json({
      totalCustomers,
      totalSellers,
      totalAdmins,
      totalProducts,
      totalOrders,
      totalRevenue: revenue[0]?.totalRevenue || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 👥 Get All Users
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};



// ❌ Delete User
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted successfully" });
};



// 📦 Get All Products
exports.getAllProducts = async (req, res) => {
  const products = await Product.find()
    .populate("sellerId", "name email");

  res.json(products);
};



// ❌ Delete Product (Admin CANNOT update product)
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted successfully" });
};



// 🛒 Get All Orders
exports.getAllOrders = async (req, res) => {
  
  try {
    const orders = await Order.find()
      .populate("userId", "name email") // get user name and email
      .populate("items.productId", "name image price"); // get product info

    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// 🔄 Update Order Status Only
exports.updateOrderStatus = async (req, res) => {
  const { orderStatus } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order)
    return res.status(404).json({ message: "Order not found" });

  order.orderStatus = orderStatus;
  await order.save();

  res.json({ message: "Order status updated", order });
};
