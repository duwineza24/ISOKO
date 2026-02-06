import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

const SellerDashboard = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
 
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
  });
 const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:2000';
  useEffect(() => {
    const loadData = async () => {
      try {
        const productRes = await fetch(
          `${API_URL}/api/product/seller/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const products = await productRes.json();

        const orderRes = await fetch(`${API_URL}/api/order/seller`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const orderData = await orderRes.json();

        setStats({
          products: products.length || 0,
          orders: orderData.orders?.length || 0,
        });
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };

    loadData();
  }, [token]);

  const productPercent = Math.min(stats.products * 10, 100);
  const orderPercent = Math.min(stats.orders * 10, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200 px-8 py-10">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Seller Dashboard
        </h1>
        <p className="text-gray-400 mt-2 max-w-2xl">
          Monitor your store performance, manage products, and track customer
          orders — all from one place.
        </p>
      </div>

      {/* STATS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* PRODUCTS */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition">
          <h2 className="text-xl font-semibold mb-1">Products Listed</h2>
          <p className="text-gray-400 text-sm mb-6">
            Total items currently available in your store
          </p>

          <div className="w-36 h-36 mx-auto">
            <CircularProgressbar
              value={productPercent}
              text={`${stats.products}`}
              styles={buildStyles({
                pathColor: "#3b82f6",
                textColor: "#ffffff",
                trailColor: "rgba(255,255,255,0.1)",
                strokeLinecap: "round",
              })}
            />
          </div>

          <p className="text-center text-gray-400 text-sm mt-6">
            Keep adding quality products to attract more customers.
          </p>
        </div>

        {/* ORDERS */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition">
          <h2 className="text-xl font-semibold mb-1">Orders Received</h2>
          <p className="text-gray-400 text-sm mb-6">
            Customer orders waiting for processing
          </p>

          <div className="w-36 h-36 mx-auto">
            <CircularProgressbar
              value={orderPercent}
              text={`${stats.orders}`}
              styles={buildStyles({
                pathColor: "#10b981",
                textColor: "#ffffff",
                trailColor: "rgba(255,255,255,0.1)",
                strokeLinecap: "round",
              })}
            />
          </div>

          <p className="text-center text-gray-400 text-sm mt-6">
            Respond quickly to orders to maintain high seller ratings.
          </p>
        </div>
      </div>

      {/* ACTION SECTION */}
      <div className="max-w-7xl mx-auto mt-14">
        <h3 className="text-2xl font-bold mb-2">Quick Actions</h3>
        <p className="text-gray-400 mb-6">
          Take action to grow your store and manage your sales efficiently.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <button
            onClick={() => navigate("/seller/add-product")}
            className="py-4 rounded-2xl bg-blue-600/90 hover:bg-blue-700 transition font-semibold shadow-lg"
          >
            ➕ Add New Product
          </button>

          <button
            onClick={() => navigate("/seller/orders")}
            className="py-4 rounded-2xl bg-green-600/90 hover:bg-green-700 transition font-semibold shadow-lg"
          >
            📦 Manage Orders
          </button>

          <button
            onClick={() => navigate("/seller/analytics")}
            className="py-4 rounded-2xl bg-purple-600/90 hover:bg-purple-700 transition font-semibold shadow-lg"
          >
            📊 View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
