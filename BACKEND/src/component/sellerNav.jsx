import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaPlus,
  FaList,
  FaHome,
  FaCartArrowDown,
  FaSignOutAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:2000';
const SellerNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
 
  /* ================= THEME ================= */
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("seller-theme") !== "light"
  );

  useEffect(() => {
    localStorage.setItem("seller-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* ================= ORDERS BADGE ================= */
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Example API – adjust if needed
    fetch(`${API_URL}/api/order/seller/new`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrderCount(data?.count || 0))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { path: "/seller/home", label: "Home", icon: <FaHome /> },
    { path: "/seller/dashboard", label: "Dashboard", icon: <FaHome /> },

    { path: "/seller/add-product", label: "Add Product", icon: <FaPlus /> },
    { path: "/seller/products", label: "My Products", icon: <FaList /> },
    {
      path: "/seller/orders",
      label: "Orders",
      icon: <FaCartArrowDown />,
      badge: orderCount,
    },
  ];

  return (
    <div
      className={`min-h-screen flex transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "bg-gradient-to-br from-gray-100 via-white to-gray-200"
      }`}
    >
      {/* SIDEBAR */}
      <aside
        className={`w-72 flex flex-col shadow-2xl transition-colors duration-500
        ${darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-700"}`}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-gray-700/20 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-extrabold">Seller Panel</h2>
            <p className="text-sm opacity-70">Control your store</p>
          </div>

          {/* THEME TOGGLE */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition hover:scale-110
            ${
              darkMode
                ? "bg-gray-800 text-yellow-400"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-4 px-4 py-3 rounded-xl
                  transition-all duration-300 group
                  ${
                    isActive
                      ? darkMode
                        ? "bg-white/10 text-white"
                        : "bg-gray-200 text-gray-900"
                      : "opacity-80 hover:opacity-100"
                  }
                `}
              >
                {/* ACTIVE BAR */}
                <span
                  className={`absolute left-0 top-0 h-full w-1 rounded-r
                    ${isActive ? "bg-blue-500" : "bg-transparent"}`}
                />

                {/* ICON */}
                <span className="text-lg group-hover:scale-110 transition">
                  {item.icon}
                </span>

                {/* LABEL */}
                <span className="font-medium">{item.label}</span>

                {/* BADGE */}
                {item.badge > 0 && (
                  <span
                    className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5
                    rounded-full animate-pulse"
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-gray-700/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
            bg-red-500/10 text-red-500 hover:bg-red-500/20 transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerNav;
