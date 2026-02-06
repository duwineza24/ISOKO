import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    rating: "",
    description: "",
  });
 
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:2000';
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/product/seller/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error loading seller products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdateProduct = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/product/${editingProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (res.ok) {
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`${API_URL}/api/product/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData(product);
  };

  const viewOrders = (productId) => {
    navigate(`/seller/orders/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-8 py-10 text-gray-200">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold">My Products</h1>
        </div>
        <p className="text-gray-400 mt-2 max-w-2xl">
          Manage all products in your store. Edit details, remove items, or view
          customer orders for each product.
        </p>
      </div>

      {/* PRODUCTS GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 overflow-hidden"
          >
            {/* IMAGE */}
            <div className="relative">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-48 object-cover"
              />

              {/* PRICE BADGE */}
              <span className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                ${p.price}
              </span>
            </div>

            {/* CONTENT */}
            <div className="p-5 space-y-3">
              {/* TITLE ROW */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-100">
                    {p.name}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {p.category} · ⭐ {p.rating || 4}
                  </p>
                </div>
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-400 line-clamp-2">
                {p.description}
              </p>
            </div>

            {/* ACTION BAR */}
            <div className="px-4 pb-4">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => viewOrders(p._id)}
                  className="bg-green-600/80 hover:bg-green-700 py-2 rounded-xl text-sm flex items-center justify-center gap-1 transition"
                >
                  <FaShoppingCart /> Orders
                </button>

                <button
                  onClick={() => openEditModal(p)}
                  className="bg-blue-600/80 hover:bg-blue-700 py-2 rounded-xl text-sm flex items-center justify-center gap-1 transition"
                >
                  <FaEdit /> Edit
                </button>

                <button
                  onClick={() => handleDeleteProduct(p._id)}
                  className="bg-red-600/70 hover:bg-red-700 py-2 rounded-xl text-sm flex items-center justify-center gap-1 transition"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 text-gray-200 p-6 rounded-3xl w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Update Product</h2>

            <div className="grid gap-3">
              {["name", "price", "category", "image", "rating"].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field}
                  className="p-3 rounded-xl bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ))}

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                rows={4}
                className="p-3 rounded-xl bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-gray-700 rounded-xl hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProduct}
                className="px-4 py-2 bg-green-600 rounded-xl hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
