import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTruck, FaShieldAlt, FaStar, FaShoppingCart } from "react-icons/fa";

export default function CustomerProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const navigate = useNavigate();
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:2000';
  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || user.role !== "customer") {
      navigate("/login");
    }
  }, []);

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/product`);
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOrder = (product) => {
    navigate(`/customer/product/${product._id}`);
  };

  /* ================= FILTER & PAGINATION ================= */
  const filteredProducts = products.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || item.category === category)
  );

  const indexStart = (page - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    indexStart,
    indexStart + itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      {/* ================= NAVBAR ================= */}
      <nav className="px-6 py-4 flex justify-between items-center border-b border-gray-700">
        <h1 className="text-xl font-bold tracking-wide text-white">
          ShopperEase
        </h1>

        <div className="flex gap-6 text-sm">
          <button
            onClick={() => navigate("/customer")}
            className="hover:text-white transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/customer/orders")}
            className="hover:text-white transition"
          >
            My Orders
          </button>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="text-center py-20 px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white">
          Discover Quality Products
        </h2>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          Browse verified products, order with confidence, and enjoy a smooth
          shopping experience.
        </p>

        <button
          onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
          className="mt-8 px-8 py-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition"
        >
          Start Browsing
        </button>
      </section>

      {/* ================= TRUST ================= */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            icon: <FaTruck size={28} />,
            title: "Fast Delivery",
            text: "Quick and reliable delivery service",
          },
          {
            icon: <FaShieldAlt size={28} />,
            title: "Secure Payments",
            text: "Protected and trusted transactions",
          },
          {
            icon: <FaStar size={28} />,
            title: "Trusted Sellers",
            text: "Verified sellers and quality products",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-gray-800/80 backdrop-blur rounded-2xl p-6 text-center shadow-md"
          >
            <div className="flex justify-center text-gray-300 mb-3">
              {item.icon}
            </div>
            <h3 className="font-semibold text-white">{item.title}</h3>
            <p className="text-sm text-gray-400 mt-1">{item.text}</p>
          </div>
        ))}
      </section>

      {/* ================= SEARCH ================= */}
      <div className="max-w-4xl mx-auto mt-16 px-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All</option>
            <option>Electronics</option>
            <option>Clothes</option>
            <option>Food</option>
            <option>Beauty</option>
          </select>
        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 mt-12 pb-16">
        {loading &&
          [...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-800 rounded-2xl animate-pulse"
            />
          ))}

        {!loading &&
          paginatedProducts.map((product) => (
            <div
              key={product._id}
              className="bg-gray-800/80 backdrop-blur rounded-2xl p-4 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition cursor-pointer"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-40 w-full object-cover rounded-xl"
              />

              <h3 className="mt-4 font-semibold text-white">{product.name}</h3>
              <p className="text-gray-400 text-sm">${product.price}</p>

              <div className="text-yellow-400 text-sm mt-1">
                {"⭐".repeat(product.rating || 4)}
              </div>

              <button
                onClick={() => handleOrder(product)}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition"
              >
                <FaShoppingCart size={14} />
                View Product
              </button>
            </div>
          ))}
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center items-center gap-4 pb-12">
        <button
          onClick={() => page > 1 && setPage(page - 1)}
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
        >
          Prev
        </button>

        <span className="text-sm text-gray-300">
          {page} / {totalPages}
        </span>

        <button
          onClick={() => page < totalPages && setPage(page + 1)}
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
        >
          Next
        </button>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-gray-700 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} ShopperEase — Shop with confidence
      </footer>
    </div>
  );
}
