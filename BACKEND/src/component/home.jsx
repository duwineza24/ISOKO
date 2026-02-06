import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaSearch,
  FaShoppingCart,
  FaStore,
  FaTruck,
  FaShieldAlt,
  FaStar,
} from "react-icons/fa";
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:2000';
export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`${API_URL}/api/product`);
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleOrder = (product) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= HERO ================= */}
     <section
  className="min-h-[80vh] flex flex-col justify-center items-center text-center px-3
             bg-cover bg-center relative"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=80')",
  }}
>
  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/60"></div>

  {/* Content */}
  <div className="relative z-10">
    <h1 className="text-5xl md:text-6xl font-extrabold text-white">
      Everything You Need, In One Place
    </h1>

    <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
      Buy quality products from trusted sellers or start selling your own
      products today. Fast delivery. Secure payments. Real people.
    </p>

    <div className="flex gap-4 mt-8 flex-wrap justify-center">
      <button
        onClick={() => window.scrollTo({ top: 900, behavior: "smooth" })}
        className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition"
      >
        Start Shopping
      </button>

      <button
        onClick={() => navigate("/register")}
        className="bg-white text-black px-8 py-3 rounded-full shadow hover:bg-gray-200 transition"
      >
        Become a Seller
      </button>
    </div>
  </div>
</section>


   

      {/* ================= PRODUCTS ================= */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold mb-8">Popular Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading &&
            [...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white h-64 rounded-xl animate-pulse"
              ></div>
            ))}

          {!loading &&
            products.slice(0, 8).map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow p-3 hover:scale-105 transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-40 w-full object-cover rounded-lg"
                />
                <h3 className="mt-3 font-bold">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>

                <button
                  onClick={() => handleOrder(product)}
                  className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
                >
                  Order Now
                </button>
              </div>
            ))}
        </div>
      </section>
   {/* ================= HOW IT WORKS ================= */}
      <section className="max-w-6xl mx-auto px-3 mb-10 ">
        <h2 className="text-4xl font-bold text-center mb-14">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              icon: <FaUserPlus />,
              title: "Create Account",
              desc: "Sign up as a buyer or seller in just a few steps.",
            },
            {
              icon: <FaSearch />,
              title: "Find Products",
              desc: "Browse products from multiple categories easily.",
            },
            {
              icon: <FaShoppingCart />,
              title: "Place Order",
              desc: "Add to cart and checkout securely.",
            },
            {
              icon: <FaTruck />,
              title: "Fast Delivery",
              desc: "Receive your order quickly at your location.",
            },
          ].map((step, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-6 text-center hover:scale-105 transition"
            >
              <div className="text-3xl mb-4 flex justify-center">
                {step.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <FaShieldAlt className="text-4xl mx-auto mb-4" />
            <h3 className="font-bold">Secure Payments</h3>
            <p className="text-gray-600 text-sm mt-2">
              All transactions are protected and encrypted.
            </p>
          </div>

          <div className="text-center">
            <FaStar className="text-4xl mx-auto mb-4" />
            <h3 className="font-bold">Trusted Sellers</h3>
            <p className="text-gray-600 text-sm mt-2">
              Only verified sellers are allowed to sell.
            </p>
          </div>

          <div className="text-center">
            <FaStore className="text-4xl mx-auto mb-4" />
            <h3 className="font-bold">Sell With Us</h3>
            <p className="text-gray-600 text-sm mt-2">
              Start your online business without any technical skills.
            </p>
          </div>
        </div>
      </section>
      {/* ================= SELLER CTA ================= */}
      <section className="bg-black text-white py-20 text-center">
        <h2 className="text-4xl font-bold">Ready to Grow Your Business?</h2>
        <p className="text-gray-300 mt-4 max-w-xl mx-auto">
          Create a seller account, upload products, and start earning today.
        </p>

        <button
          onClick={() => navigate("/register")}
          className="mt-6 bg-white text-black px-10 py-3 rounded-full hover:bg-gray-200 transition"
        >
          Start Selling
        </button>
      </section>

      {/* ================= FINAL GUIDE ================= */}
      <section className="py-16 text-center">
        <p className="text-gray-500">
          ✔ No hidden fees &nbsp; ✔ Easy checkout &nbsp; ✔ Real support
        </p>
      </section>
    </div>
  );
}
