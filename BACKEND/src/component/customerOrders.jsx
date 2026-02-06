import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:2000';
  /* ===================== AUTH + FETCH ===================== */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token || user.role !== "customer") {
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/api/order/user/${user._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setOrders)
      .catch(() => alert("Failed to load orders"))
      .finally(() => setLoading(false));
  }, [navigate]);

  /* ===================== EDIT MODE ===================== */
  const startEdit = (order) => {
    setEditingId(order._id);
    setDrafts((prev) => ({
      ...prev,
      [order._id]: {
        ...order,
        items: order.items.map((i) => ({
          ...i,
          quantity: Number(i.quantity),
        })),
      },
    }));
  };

  const cancelEdit = (id) => {
    setEditingId(null);
    setDrafts((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  /* ===================== UPDATE DRAFT ===================== */
  const setQuantity = (orderId, index, qty) => {
    setDrafts((prev) => {
      const next = { ...prev };
      next[orderId].items[index].quantity = Math.max(1, Number(qty) || 1);
      next[orderId].totalAmount = next[orderId].items.reduce(
        (sum, it) => sum + it.price * it.quantity,
        0
      );
      return next;
    });
  };

  const setShippingField = (orderId, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        shippingAddress: {
          ...prev[orderId].shippingAddress,
          [field]: value,
        },
      },
    }));
  };

  /* ===================== SAVE ===================== */
  const saveOrder = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/order/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(drafts[id]),
    });

    if (!res.ok) return alert("Failed to save changes");

    const updated = await res.json();
    setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
    cancelEdit(id);
  };

  /* ===================== DELETE ===================== */
  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/order/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return alert("Failed to delete");

    setOrders((prev) => prev.filter((o) => o._id !== id));
  };

  /* ===================== STATES ===================== */
  if (loading) {
    return (
      <div className="flex justify-center mt-24">
        <div className="h-12 w-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center mt-24">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-semibold text-gray-600">
          You have no orders yet
        </h2>
      </div>
    );
  }

  /* ===================== UI ===================== */
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 py-10">
      {/* Header */}
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">My Orders</h1>
          <p className="text-gray-400 mt-1">
            Review and manage your recent purchases
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
        >
          ← Back
        </button>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {orders.map((order) => {
          const editing = editingId === order._id;
          const draft = drafts[order._id] || order;

          return (
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

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    draft.orderStatus === "Delivered"
                      ? "bg-green-500/20 text-green-400"
                      : draft.orderStatus === "Pending"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {draft.orderStatus}
                </span>
              </div>

              {/* Order Info */}
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <span className="text-gray-400">Total:</span>{" "}
                  <span className="text-white font-semibold">
                    ${draft.totalAmount.toFixed(2)}
                  </span>
                </p>
                <p>
                  <span className="text-gray-400">Payment:</span>{" "}
                  <span
                    className={`font-medium ${
                      draft.paymentStatus === "Paid"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {draft.paymentStatus}
                  </span>
                </p>
              </div>

              {/* Items */}
              <div className="mt-5 border-t border-gray-700 pt-4">
                <p className="text-sm font-semibold text-gray-300 mb-2">
                  Ordered Items
                </p>

                <div className="space-y-2">
                  {draft.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-gray-700/50 rounded-lg p-2"
                    >
                      <img
                        src={item.productId?.image}
                        alt={item.productId?.name}
                        className="h-10 w-10 rounded object-cover"
                      />

                      <div className="flex-1 text-sm text-gray-200">
                        <p className="font-medium">{item.productId?.name}</p>
                        <p className="text-xs text-gray-400">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>

                      {!editing ? (
                        <span className="text-xs bg-gray-600 px-3 py-1 rounded-full">
                          x{item.quantity}
                        </span>
                      ) : (
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            setQuantity(order._id, i, e.target.value)
                          }
                          className="w-16 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-sm text-center text-white"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping */}
              <div className="mt-5 border-t border-gray-700 pt-4 text-sm text-gray-400">
                <p className="font-semibold text-gray-300 mb-1">
                  Shipping Address
                </p>

                {!editing ? (
                  <>
                    <p>{draft.shippingAddress?.fullName}</p>
                    <p>
                      {draft.shippingAddress?.address},{" "}
                      {draft.shippingAddress?.city},{" "}
                      {draft.shippingAddress?.country}
                    </p>
                  </>
                ) : (
                  <div className="space-y-2">
                    {["fullName", "address", "city", "country"].map((f) => (
                      <input
                        key={f}
                        value={draft.shippingAddress[f]}
                        onChange={(e) =>
                          setShippingField(order._id, f, e.target.value)
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                        placeholder={f}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                {!editing ? (
                  <>
                    <button
                      onClick={() => startEdit(order)}
                      className="flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition"
                    >
                      Edit Order
                    </button>

                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => saveOrder(order._id)}
                      className="flex-1 bg-green-500/20 text-green-400 py-2 rounded-lg hover:bg-green-500/30 transition"
                    >
                      Save Changes
                    </button>

                    <button
                      onClick={() => cancelEdit(order._id)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
