const Product = require("../model/product");

const createProduct = async (req, res) => {
  try {
    const { name, price, image, category, rating, description } = req.body;
    const sellerId = req.user._id;

    const product = new Product({
      name,
      price,
      image,
      category,
      rating,
      description,
      sellerId,
    });

    await product.save();

    res.status(201).json({ message: "Product created", product });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.find();
    res.status(200).json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getOneProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};
const getProductBySeller = async (req, res) => {
  try {
    const sellerId = req.user._id; // FIXED

    const products = await Product.find({ sellerId }).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const sellerId = req.user._id;

    const { name, price, image, category, rating, description } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.sellerId.toString() !== sellerId.toString()) {
      return res
        .status(403)
        .json({ message: "You do not have permission to update this product" });
    }

    // Update product details
    product.name = name || product.name;
    product.price = price || product.price;
    product.image = image || product.image;
    product.category = category || product.category;
    product.rating = rating || product.rating;
    product.description = description || product.description;

    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const sellerId = req.user._id;

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.sellerId.toString() !== sellerId.toString()) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this product" });
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

module.exports = {
  createProduct,
  getProduct,
  getOneProduct,
  getProductBySeller,
  updateProduct,
  deleteProduct,
};
