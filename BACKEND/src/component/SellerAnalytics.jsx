import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaShoppingBag,
  FaMoneyBillWave,
  FaArrowLeft,
} from "react-icons/fa";
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:2000';
const SellerAnalytics = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [data, setData] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
  });

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // PRODUCTS
        const productRes = await fetch(
          `${API_URL}/api/product/seller/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const products = await productRes.json();

        // ORDERS
        const orderRes = await fetch(`${API_URL}/api/order/seller`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ordersData = await orderRes.json();

        const orders = ordersData.orders || [];

        // CALCULATE REVENUE
        const totalRevenue = orders.reduce(
          (sum, o) => sum + (o.totalAmount || 0),
          0
        );

        setData({
          products: products.length,
          orders: orders.length,
          revenue: totalRevenue,
        });
      } catch (err) {
        console.error("Analytics error:", err);
      }
    };

    loadAnalytics();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200 px-8 py-10">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        <h1 className="text-4xl font-extrabold">Store Analytics</h1>
        <p className="text-gray-400 mt-2 max-w-2xl">
          Understand how your store is performing and identify areas for growth.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          icon={<FaBoxOpen />}
          label="Total Products"
          value={data.products}
          hint="Items currently listed in your store"
          color="blue"
        />

        <StatCard
          icon={<FaShoppingBag />}
          label="Total Orders"
          value={data.orders}
          hint="Orders placed by customers"
          color="green"
        />

        <StatCard
          icon={<FaMoneyBillWave />}
          label="Total Revenue"
          value={`$${data.revenue.toFixed(2)}`}
          hint="Total earnings from completed orders"
          color="yellow"
        />
      </div>

      {/* INSIGHT SECTION */}
      <div className="max-w-7xl mx-auto mt-14 bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-3">Performance Insights</h2>
        <p className="text-gray-400 leading-relaxed max-w-3xl">
          Your store performance is based on product availability, order
          fulfillment speed, and customer satisfaction. Adding more quality
          products and responding quickly to orders can significantly improve
          your sales and visibility.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <span className="px-4 py-2 rounded-full bg-blue-600/20 text-blue-400">
            📦 Product Growth
          </span>
          <span className="px-4 py-2 rounded-full bg-green-600/20 text-green-400">
            🚚 Order Management
          </span>
          <span className="px-4 py-2 rounded-full bg-yellow-600/20 text-yellow-400">
            💰 Revenue Tracking
          </span>
        </div>
      </div>
    </div>
  );
};

export default SellerAnalytics;

/* STAT CARD COMPONENT */
function StatCard({ icon, label, value, hint, color }) {
  const colors = {
    blue: "text-blue-400",
    green: "text-green-400",
    yellow: "text-yellow-400",
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition border border-gray-700">
      <div className={`text-4xl mb-4 ${colors[color]}`}>{icon}</div>
      <h3 className="text-lg text-gray-400">{label}</h3>
      <p className="text-3xl font-extrabold text-white mt-1">{value}</p>
      <p className="text-gray-500 text-sm mt-3">{hint}</p>
    </div>
  );
}
