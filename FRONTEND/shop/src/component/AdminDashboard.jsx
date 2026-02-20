import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaUserShield,
  FaChartLine,
  FaSignOutAlt,
  FaTrash,
  FaEdit,
  FaBars,
  FaTimes,
  FaImage,
  FaCheckCircle,
  FaTruck,
  FaHourglassHalf,
  FaTimesCircle,
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:2000';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [view, setView] = useState("dashboard");
  const [stats, setStats] = useState({
    users: 0,
    sellers: 0,
    products: 0,
    orders: 0,
  });

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/login");
  }, [navigate, user]);

  useEffect(() => {
    if (token) fetchStats();
  }, [token]);

  const fetchStats = async () => {
    try {
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/admin/products`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const usersData = await usersRes.json();
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();

      setStats({
        users: usersData.length,
        sellers: usersData.filter((u) => u.role === "seller").length,
        products: productsData.length,
        orders: ordersData.length,
      });
    } catch {
      setError("Failed to load dashboard stats");
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/api/admin/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  const handleView = (section) => {
    setError("");
    setView(section);
    setSidebarOpen(false);
    if (section === "users") fetchUsers();
    if (section === "products") fetchProducts();
    if (section === "orders") fetchOrders();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ================= ACTIONS =================

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await fetch(`${API_URL}/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setUsers(users.filter((u) => u._id !== id));
    setStats((prev) => ({ ...prev, users: prev.users - 1 }));
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await fetch(`${API_URL}/api/admin/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setProducts(products.filter((p) => p._id !== id));
    setStats((prev) => ({ ...prev, products: prev.products - 1 }));
  };

  const updateProduct = async (id, product) => {
    const newPrice = prompt("Enter new price:", product.price);
    if (!newPrice) return;

    const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ price: newPrice }),
    });

    const updated = await res.json();
    setProducts(products.map((p) => (p._id === id ? updated : p)));
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    await fetch(`${API_URL}/api/admin/orders/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setOrders(orders.filter((o) => o._id !== id));
    setStats((prev) => ({ ...prev, orders: prev.orders - 1 }));
  };

  const updateOrderStatus = async (id, status) => {
    const res = await fetch(`${API_URL}/api/admin/orders/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const updated = await res.json();
    setOrders(orders.map((o) => (o._id === id ? updated : o)));
  };

  // ================= UI =================

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-lg shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
      >
        {sidebarOpen ? <FaTimes size={18} className="text-slate-700" /> : <FaBars size={18} className="text-slate-700" />}
      </button>

      {/* SIDEBAR */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-6 transition-transform duration-300 z-40 h-screen overflow-y-auto shadow-2xl`}
      >
        <div className="mb-10 pt-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <FaUserShield size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Admin Panel</h2>
              <p className="text-xs text-slate-400">Management System</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <NavButton
            onClick={() => handleView("dashboard")}
            active={view === "dashboard"}
            icon={<FaChartLine />}
            label="Dashboard"
            color="blue"
          />

          <NavButton
            onClick={() => handleView("users")}
            active={view === "users"}
            icon={<FaUsers />}
            label="Users"
            color="purple"
          />

          <NavButton
            onClick={() => handleView("products")}
            active={view === "products"}
            icon={<FaBoxOpen />}
            label="Products"
            color="green"
          />

          <NavButton
            onClick={() => handleView("orders")}
            active={view === "orders"}
            icon={<FaShoppingCart />}
            label="Orders"
            color="orange"
          />
        </div>

        <div className="pt-6 mt-6 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-red-600/20 rounded-lg transition-all duration-200 border border-transparent hover:border-red-500/30"
          >
            <FaSignOutAlt size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black bg-opacity-40 z-30 backdrop-blur-sm"
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 md:p-8 overflow-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg shadow-sm flex items-center gap-3">
            <FaTimesCircle className="text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Stat 
                title="Total Users" 
                value={stats.users} 
                icon={<FaUsers />} 
                gradient="from-blue-500 to-blue-600"
                lightBg="bg-blue-50"
                textColor="text-blue-600"
              />
              <Stat 
                title="Sellers" 
                value={stats.sellers} 
                icon={<FaUserShield />} 
                gradient="from-purple-500 to-purple-600"
                lightBg="bg-purple-50"
                textColor="text-purple-600"
              />
              <Stat 
                title="Products" 
                value={stats.products} 
                icon={<FaBoxOpen />} 
                gradient="from-green-500 to-green-600"
                lightBg="bg-green-50"
                textColor="text-green-600"
              />
              <Stat 
                title="Orders" 
                value={stats.orders} 
                icon={<FaShoppingCart />} 
                gradient="from-orange-500 to-orange-600"
                lightBg="bg-orange-50"
                textColor="text-orange-600"
              />
            </div>
          </div>
        )}

        {/* USERS */}
        {view === "users" && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaUsers className="text-white" size={20} />
              </div>
              <h1 className="text-3xl font-bold text-slate-800">Manage Users</h1>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <Table
                headers={["Name", "Email", "Role", "Actions"]}
                data={users.map((u) => [
                  <div className="font-medium text-slate-800">{u.name}</div>,
                  <div className="text-slate-600">{u.email}</div>,
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    u.role === 'admin' ? 'bg-red-100 text-red-700' :
                    u.role === 'seller' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {u.role}
                  </span>,
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="p-2 text-slate-600 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                    title="Delete user"
                  >
                    <FaTrash size={14} />
                  </button>,
                ])}
              />
            )}
          </div>
        )}

        {/* PRODUCTS */}
        {view === "products" && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaBoxOpen className="text-white" size={20} />
              </div>
              <h1 className="text-3xl font-bold text-slate-800">Manage Products</h1>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <Table
                headers={["Product", "Price", "Category", "Actions"]}
                data={products.map((p) => [
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-slate-200 shadow-sm">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <FaImage className="text-slate-400" size={16} />
                      )}
                    </div>
                    <span className="font-medium text-slate-800">{p.name}</span>
                  </div>,
                  <span className="font-bold text-green-600">${p.price}</span>,
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full">
                    {p.category}
                  </span>,
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateProduct(p._id, p)}
                      className="p-2 text-slate-600 hover:text-white hover:bg-blue-500 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                      title="Edit product"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="p-2 text-slate-600 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                      title="Delete product"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>,
                ])}
              />
            )}
          </div>
        )}

        {/* ORDERS */}
        {view === "orders" && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaShoppingCart className="text-white" size={20} />
              </div>
              <h1 className="text-3xl font-bold text-slate-800">Manage Orders</h1>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              </div>
            ) : (
              <Table
                headers={["Customer", "Total", "Status", "Actions"]}
                data={orders.map((o) => [
                  <div className="font-medium text-slate-800">{o.userId?.name || "Unknown"}</div>,
                  <span className="font-bold text-green-600">${o.totalAmount}</span>,
                  <select
                    value={o.orderStatus}
                    onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                    className="px-3 py-2 text-sm border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white font-medium transition-all"
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>,
                  <button
                    onClick={() => deleteOrder(o._id)}
                    className="p-2 text-slate-600 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                    title="Delete order"
                  >
                    <FaTrash size={14} />
                  </button>,
                ])}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ================= SMALL COMPONENTS =================

const NavButton = ({ onClick, active, icon, label, color }) => {
  const colorClasses = {
    blue: active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50' : 'text-slate-300 hover:bg-slate-700/50',
    purple: active ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' : 'text-slate-300 hover:bg-slate-700/50',
    green: active ? 'bg-green-600 text-white shadow-lg shadow-green-500/50' : 'text-slate-300 hover:bg-slate-700/50',
    orange: active ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/50' : 'text-slate-300 hover:bg-slate-700/50',
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 text-sm rounded-xl transition-all duration-200 ${colorClasses[color]}`}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
};

const Stat = ({ title, value, icon, gradient, lightBg, textColor }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:scale-105">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
        <span className="text-white text-2xl">{icon}</span>
      </div>
    </div>
    <p className="text-sm text-slate-600 mb-1 font-medium">{title}</p>
    <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
  </div>
);

const Table = ({ headers, data }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
    <table className="w-full">
      <thead>
        <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
          {headers.map((h, i) => (
            <th key={i} className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.length === 0 ? (
          <tr>
            <td colSpan={headers.length} className="px-6 py-12 text-center text-slate-500 text-sm">
              No data available
            </td>
          </tr>
        ) : (
          data.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-6 py-4 text-sm">
                  {cell}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default AdminDashboard;