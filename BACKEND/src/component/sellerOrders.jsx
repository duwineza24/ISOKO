import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SellerOrdersAll() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // ✅ FIX
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:2000/api/order/seller", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Failed to load orders");
          return;
        }

        setOrders(data.orders || []);
      } catch (err) {
        console.error("Error loading orders:", err);
        alert("Error loading orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);
 const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:2000';
  // ================= UPDATE PAYMENT STATUS =================
  const updatePaymentStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(
        `${API_URL}/api/order/${orderId}/payment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paymentStatus: status }),
        }
      );

      if (!res.ok) {
        alert("Failed to update payment status");
        return;
      }

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, paymentStatus: status } : o
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error updating payment status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin h-12 w-12 border-4 border-gray-400 border-t-transparent rounded-full"></div>
      </div>
    );

  if (!orders.length)
    return (
      <div className="text-center mt-20">
        <h2 className="text-3xl mt-6 text-gray-800 font-bold">No Orders Yet</h2>
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 py-10">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">All Orders</h1>
        <p className="text-gray-400 mt-1">
          Manage and track all orders for your products
        </p>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-gray-800/80 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-gray-400">Order ID</p>
                <p className="text-lg font-semibold text-white">
                  #{order._id.slice(-8).toUpperCase()}
                </p>
              </div>

              {/* Status Badge */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  order.orderStatus === "Delivered"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {order.orderStatus}
              </span>
            </div>

            {/* Customer & Payment */}
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <span className="text-gray-400">Customer:</span>{" "}
                {order.userId?.name || "Unknown"}
              </p>
              <p>
                <span className="text-gray-400">Email:</span>{" "}
                {order.userId?.email || "Unknown"}
              </p>
              <p>
                <span className="text-gray-400">Total:</span>{" "}
                <span className="text-white font-semibold">
                  ${order.totalAmount?.toFixed(2)}
                </span>
              </p>

              {/* ✅ FIXED PAYMENT JSX */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm font-medium">
                  Payment:
                </span>
                <select
                  value={order.paymentStatus}
                  onChange={(e) =>
                    updatePaymentStatus(order._id, e.target.value)
                  }
                  disabled={updatingId === order._id}
                  className="bg-gray-700 text-white text-sm px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Items */}
            <div className="mt-5 border-t border-gray-700 pt-4">
              <p className="text-sm font-semibold text-gray-300 mb-2">Items</p>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 bg-gray-700/50 rounded-lg p-2"
                  >
                    <img
                      src={item.productId?.image}
                      alt={item.productId?.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                    <div className="text-sm text-gray-200">
                      <p className="font-medium">{item.productId?.name}</p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity} • ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="mt-5 border-t border-gray-700 pt-4 text-sm text-gray-400">
              <p className="font-semibold text-gray-300 mb-1">
                Shipping Address
              </p>
              <p>{order.shippingAddress?.fullName}</p>
              <p>
                {order.shippingAddress?.address},{" "}
                {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.country}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
