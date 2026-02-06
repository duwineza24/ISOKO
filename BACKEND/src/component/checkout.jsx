import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Checkout() {
  const { state } = useLocation();
  const { product } = state || {};
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [quantity, setQuantity] = useState(1);
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:2000';
  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/login");
    if (!product?._id) return alert("Product ID missing");

    const orderData = {
      userId: user._id,
      items: [{ productId: product._id, quantity, price: product.price }],
      shippingAddress: { fullName, address, city, country },
    };

    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Order placed successfully!");
      navigate("/customer/orders");
    } else {
      alert(data.message || "Failed to place order");
    }
  };

  if (!product)
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-semibold text-red-600">
          No product selected
        </h2>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
        Checkout
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-xl space-y-6">
        {/* Step 1: Product Info */}
        <section className="flex flex-col md:flex-row gap-6 items-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-48 h-48 object-cover rounded-xl shadow-md"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className="text-gray-700 mt-2">{product.description}</p>
            <p className="text-xl font-semibold mt-2 text-gray-900">
              Price per item: ${product.price}
            </p>
          </div>
        </section>

        {/* Step 2: Quantity */}
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Step 1: Choose Quantity
          </h3>
          <input
            type="number"
            min="1"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <p className="text-gray-600 mt-2 text-sm">
            Total amount:{" "}
            <span className="font-bold">${product.price * quantity}</span>
          </p>
        </section>

        {/* Step 3: Shipping Info */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">
            Step 2: Shipping Information
          </h3>
          <p className="text-gray-600 text-sm mb-2">
            Please fill in the details where you want your order to be
            delivered.
          </p>

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Address"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="City"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="text"
              placeholder="Country"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
        </section>

        {/* Step 4: Tips / Guidance */}
        <section className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-600 flex items-start gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-600 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m0-4h.01M12 19c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"
            />
          </svg>
          <div className="text-gray-700 text-sm">
            <ul className="list-disc list-inside space-y-1">
              <li>Double-check the shipping information to avoid delays.</li>
              <li>
                Confirm the quantity and total amount before placing the order.
              </li>
              <li>Contact support if you face any issues with your order.</li>
              <li>
                You can view your orders in the "My Orders" page after checkout.
              </li>
            </ul>
          </div>
        </section>

        {/* Step 5: Confirm Order */}
        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
