const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// Load environment variables first
dotenv.config();

// Initialize Express
const app = express();
app.use(express.json());


app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");
const orderRouter = require("./routes/orderRoute");
const adminRouter = require("./routes/adminRoutes");

app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Start server
const PORT = process.env.PORT || 2000;
app.listen(PORT, (err) => {
  if (err) console.error(err);
  else console.log(`Server running on port ${PORT}`);
});