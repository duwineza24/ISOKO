import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaStore,
  FaShoppingBag,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:2000';
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("customer");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return setError(data.message || "Registration failed.");
      }

      setSuccess("Account created successfully!");
      setLoading(false);

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50">
      {/* ================= LEFT CONTENT ================= */}
      <div className="hidden md:flex flex-col justify-center px-14 bg-gradient-to-br from-black to-gray-900 text-white">
        <h1 className="text-4xl font-extrabold mb-4">Join Our Marketplace</h1>

        <p className="text-gray-300 mb-10 max-w-md">
          Create an account to start buying amazing products or selling your own
          items to thousands of customers.
        </p>

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <FaShoppingBag className="text-green-400" />
            <span>Shop from trusted sellers</span>
          </div>

          <div className="flex items-center gap-3">
            <FaStore className="text-yellow-400" />
            <span>Sell products & manage orders</span>
          </div>

          <div className="flex items-center gap-3">
            <FaCheckCircle className="text-blue-400" />
            <span>Fast, secure & free registration</span>
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-400">
          Already a member? Log in to continue.
        </div>
      </div>

      {/* ================= REGISTER FORM (UNCHANGED LOGIC) ================= */}
      <div className="flex items-center justify-center px-4">
        <form
          onSubmit={handleRegister}
          className="w-full max-w-md bg-white/60 backdrop-blur-md border p-8 rounded-2xl shadow-xl"
        >
          <h2 className="text-3xl font-bold text-center mb-2">
            Create Your Account
          </h2>

          <p className="text-center text-gray-600 mb-6 text-sm">
            It takes less than a minute to get started
          </p>

          {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
          {success && (
            <p className="text-green-500 mb-2 text-center">{success}</p>
          )}

          <div className="relative mb-4">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full pl-10 p-3 bg-white/80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div className="relative mb-4">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full pl-10 p-3 bg-white/80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div className="relative mb-4">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 p-3 bg-white/80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          {/* ================= ROLE SELECTION ================= */}
          <div className="mb-6">
            <p className="text-sm font-semibold mb-2 text-gray-700">
              Choose account type
            </p>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={role === "customer"}
                  onChange={(e) => setRole(e.target.value)}
                  className="accent-gray-600 scale-125"
                />
                Customer
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  checked={role === "seller"}
                  onChange={(e) => setRole(e.target.value)}
                  className="accent-gray-600 scale-125"
                />
                Seller
              </label>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Sellers can add products and manage orders
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-semibold text-white bg-gray-700 rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>

          {/* ================= NAV LINKS ================= */}
          <div className="mt-6 text-center text-sm space-y-2">
            <p>
              Already have an account?
              <span
                onClick={() => navigate("/login")}
                className="font-semibold cursor-pointer hover:underline ml-1"
              >
                Login
              </span>
            </p>

            <p>
              <span
                onClick={() => navigate("/")}
                className="cursor-pointer hover:underline"
              >
                Back to Home
              </span>
            </p>
          </div>

          {/* ================= TRUST NOTE ================= */}
          <p className="mt-6 text-xs text-center text-gray-500">
            🔒 Your data is safe. We never share your information.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
