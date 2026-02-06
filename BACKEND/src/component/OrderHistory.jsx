import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaShoppingBag } from "react-icons/fa";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:2000';
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token || user.role !== "customer") {
      navigate("/login");
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/order/user/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        // ✅ HISTORY = delivered orders only
        const deliveredOrders = data.filter(
          (order) => order.orderStatus?.toLowerCase() === "delivered"
        );

        setOrders(deliveredOrders);
      } catch (err) {
        alert("Failed to load order history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="h-12 w-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (!orders.length) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-6">
        <FaShoppingBag size={48} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700">
          No completed orders yet
        </h2>
        <p className="text-gray-500 mt-2">
          Once your orders are delivered, they will appear here.
        </p>

        <button
          onClick={() => navigate("/customer/orders")}
          className="mt-6 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
        >
          View Active Orders
        </button>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 py-10 text-gray-200">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Order History</h1>
          <p className="text-gray-400 mt-1">
            Completed and delivered purchases
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-sm"
        >
          ← Back
        </button>
      </div>

      {/* HISTORY GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-gray-800/80 backdrop-blur rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            {/* CARD HEADER */}
            <div className="p-5 border-b border-gray-700 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400 uppercase">Order ID</p>
                <p className="font-semibold text-white">
                  #{order._id.slice(-8).toUpperCase()}
                </p>
              </div>

              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                <FaCheckCircle size={12} />
                Delivered
              </span>
            </div>

            {/* CARD BODY */}
            <div className="p-5 space-y-5">
              {/* TOTAL */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Total Paid</span>
                <span className="text-lg font-semibold text-white">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>

              {/* ITEMS */}
              <div>
                <p className="text-xs uppercase text-gray-400 mb-3">
                  Purchased Items
                </p>

                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-gray-700/50 rounded-xl p-3"
                    >
                      <img
                        src={item.productId?.image}
                        alt={item.productId?.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />

                      <div className="flex-1 text-sm">
                        <p className="font-medium text-white">
                          {item.productId?.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Qty {item.quantity} × ${item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SHIPPING */}
              <div className="text-sm text-gray-400 border-t border-gray-700 pt-3">
                Delivered to{" "}
                <span className="text-gray-200 font-medium">
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.country}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
