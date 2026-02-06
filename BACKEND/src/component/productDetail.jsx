import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
 const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:2000';
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/api/product/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch product");
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading)
    return (
      <h2 className="text-center text-xl mt-16 font-semibold text-gray-700">
        Loading Product...
      </h2>
    );

  if (error)
    return (
      <div className="text-center mt-16 text-red-600 font-bold">{error}</div>
    );

  const handleOrder = () => {
    navigate(`/customer/product/checkout/${product._id}`, {
      state: { product },
    });
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-5 py-2 bg-gray-900 text-white rounded-lg shadow hover:bg-gray-800 transition"
      >
        ← Back
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 flex flex-col md:flex-row gap-8">
        {/* Left: Product Image */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src={product.image}
            alt={product.name}
            className="rounded-2xl w-full max-w-md h-96 object-cover shadow-lg"
          />
        </div>

        {/* Right: Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Product Title & Badge */}
            <div className="flex items-center gap-3">
              <h2 className="text-4xl font-extrabold text-gray-900">
                {product.name}
              </h2>
              <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full font-semibold">
                Bestseller
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center mt-3">
              <div className="text-yellow-500 text-lg mr-2">
                {"⭐".repeat(product.rating || 4)}
              </div>
              <span className="text-gray-500 text-sm">
                {product.rating || 4} Reviews
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-700 mt-5 leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <p className="text-3xl font-bold mt-6 text-gray-900">
              ${product.price}
            </p>

            {/* Features */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border-l-4 border-blue-600 shadow-sm">
                <span className="text-blue-600 font-bold">✓</span>
                <p className="text-gray-700 text-sm">High Quality & Durable</p>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border-l-4 border-green-600 shadow-sm">
                <span className="text-green-600 font-bold">✓</span>
                <p className="text-gray-700 text-sm">Fast & Secure Shipping</p>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border-l-4 border-yellow-600 shadow-sm">
                <span className="text-yellow-600 font-bold">✓</span>
                <p className="text-gray-700 text-sm">Best Value for Money</p>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border-l-4 border-purple-600 shadow-sm">
                <span className="text-purple-600 font-bold">✓</span>
                <p className="text-gray-700 text-sm">Satisfaction Guaranteed</p>
              </div>
            </div>
          </div>

          {/* Order Button */}
          <button
            onClick={handleOrder}
            className="mt-8 w-full bg-black text-white text-lg py-4 rounded-xl hover:bg-gray-800 transition font-semibold shadow-lg"
          >
            Order Now
          </button>
        </div>
      </div>

      {/* Tips Section */}
      {/* Tips Section */}
      <div className="mt-10 bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-2xl shadow-lg border-l-8 border-blue-600 flex flex-col md:flex-row items-start gap-6">
        {/* Icon */}
        <div className="flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-blue-600"
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
        </div>

        {/* Tips Content */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            Helpful Tips Before Ordering
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Double-check product images and description for accuracy.</li>
            <li>
              Confirm your shipping address before checkout to avoid delays.
            </li>
            <li>
              Read reviews from other customers to make informed decisions.
            </li>
            <li>Contact support if you have any questions or concerns.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
