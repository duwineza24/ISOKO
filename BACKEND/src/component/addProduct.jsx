import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:2000';
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    rating: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/api/product/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Product created!");

      setFormData({
        name: "",
        price: "",
        image: "",
        category: "",
        rating: "",
        description: "",
      });

      navigate("/seller/dashboard");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-gray-800/80 backdrop-blur rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Add New Product</h1>
            <p className="text-gray-400 mt-1">
              Fill in the details below to list your product
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Product Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Wireless Headphones"
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Price & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Price ($)
              </label>
              <input
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 49.99"
                type="number"
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Rating</label>
              <input
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="e.g. 4.5"
                type="number"
                step="0.1"
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Category</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Electronics"
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Product Image URL
            </label>
            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://image-url.com/product.jpg"
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product clearly..."
              rows={4}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-6 bg-blue-400 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold tracking-wide transition"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
