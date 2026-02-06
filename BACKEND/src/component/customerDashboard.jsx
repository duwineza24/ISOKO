import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingBag,
  FaUserCircle,
  FaHistory,
  FaStore,
  FaSignOutAlt,
  FaHeart,
  FaTruck,
  FaStar,
  FaMoon,
  FaSun,
} from "react-icons/fa";



const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:2000';
export default function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    inDelivery: 0,
    wishlist: 0,
    reviews: 0,
  });
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("customer-theme") === "dark"
  );

  const navigate = useNavigate();

  // ================= THEME =================
  useEffect(() => {
    localStorage.setItem("customer-theme", darkMode ? "dark" : "light");
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // ================= USER =================
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!savedUser || !token) {
      navigate("/login");
      return;
    }
    const userObj = JSON.parse(savedUser);
    setUser(userObj);

    // Fetch orders for stats
    fetch(`${API_URL}/api/order/user/${userObj._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((orders) => {
        const inDeliveryCount = orders.filter(
          (o) => o.orderStatus === "processing" || o.orderStatus === "pending"
        ).length;
        const reviews= orders.filter(
          (o) => o.orderStatus === "delivered" 
        ).length;
         const wishlist = orders.filter(
          (o) => o.orderStatus === "pending" 
        ).length;

        setStats({
          totalOrders: orders.length,
          inDelivery: inDeliveryCount,
          wishlist: wishlist, 
          reviews: reviews,  
        });
      })
      .catch((err) => console.error("Failed to fetch orders:", err));
  }, [navigate]);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ================= DASHBOARD ACTION CARDS =================
  const dashboardCards = [
    {
      title: "Browse Products",
      desc: "Explore products from trusted sellers and find what fits your needs.",
      icon: <FaStore size={36} />,
      action: () => navigate("/customer/products"),
    },
    {
      title: "My Orders",
      desc: "View active orders, delivery status, and order details.",
      icon: <FaShoppingBag size={36} />,
      action: () => navigate("/customer/orders"),
    },
    {
      title: "Order History",
      desc: "Track everything you have purchased before.",
      icon: <FaHistory size={36} />,
      action: () => navigate("/customer/history"),
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300
      ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"}`}
    >
      {/* ================= HEADER ================= */}
      <header
        className={`shadow-md px-8 py-5 flex justify-between items-center rounded-b-xl
        ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div>
          <h1 className="text-2xl font-bold">
            ShopperEase
            <span className="ml-2 font-medium opacity-70">
              | Smart Shopping Made Easy
            </span>
          </h1>
          <p className="mt-1 text-sm opacity-70">Welcome back, {user?.name}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* THEME TOGGLE */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition hover:scale-110
            ${darkMode ? "bg-gray-700 text-yellow-400" : "bg-gray-200 text-gray-700"}`}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full
            ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
          >
            <FaUserCircle size={28} />
            <span className="font-medium">{user?.name}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      {/* ================= WELCOME BANNER ================= */}
      <section className="px-8 mt-4">
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-2">Your Shopping Dashboard</h2>
          <p className="max-w-2xl text-gray-200">
            Discover products, track your deliveries, and manage all your
            purchases from one simple dashboard built just for you.
          </p>

          <button
            onClick={() => navigate("/customer/products")}
            className="mt-5 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Start Shopping
          </button>
        </div>
      </section>

      {/* ================= QUICK STATS ================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-8 mt-10">
        {[
          { icon: <FaShoppingBag />, label: "Total Orders", value: stats.totalOrders },
          { icon: <FaTruck />, label: "In Delivery (Processing)", value: stats.inDelivery },
          { icon: <FaHeart />, label: "Wishlist (Pending)", value: stats.wishlist },
          { icon: <FaStar />, label: "Reviews Given (Delivered)", value: stats.reviews },
        ].map((item, i) => (
          <div
            key={i}
            className={`p-6 rounded-xl shadow flex items-center gap-4
            ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-sm opacity-70">{item.label}</p>
              <h3 className="text-xl font-bold">{item.value}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* ================= DASHBOARD ACTIONS ================= */}
      <section className="px-8 mt-12">
        <h3 className="text-2xl font-bold mb-4">What would you like to do?</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {dashboardCards.map((card) => (
            <div
              key={card.title}
              onClick={card.action}
              className={`rounded-xl shadow-md p-6 cursor-pointer transform hover:scale-105 transition-all
              ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-200 mb-4 text-gray-800">
                {card.icon}
              </div>
              <h4 className="text-xl font-semibold">{card.title}</h4>
              <p className="mt-2 text-sm opacity-70">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="mt-16 px-8 pb-10 text-center text-sm opacity-70">
        <p>Need help? Our support team is always ready to assist you.</p>
        <p className="mt-1">
          © {new Date().getFullYear()} ShopperEase. Happy Shopping 🛒
        </p>
      </footer>
    </div>
  );
}
