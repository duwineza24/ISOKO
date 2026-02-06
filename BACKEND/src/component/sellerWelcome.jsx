import { useNavigate } from "react-router-dom";
import { FaPlus, FaList, FaCartArrowDown, FaChartLine } from "react-icons/fa";

export default function SellerWelcome() {
  const navigate = useNavigate();
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-16">
          <h1 className="text-5xl font-extrabold text-white leading-tight">
            Welcome back <br />
            <span className="text-blue-400">
              Manage your store with confidence
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-gray-400 text-lg">
            This is your seller dashboard. From here you can add products,
            manage inventory, track customer orders, and monitor how your
            business is performing — all in one place.
          </p>
        </div>

        {/* ACTION CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {/* ADD PRODUCT */}
          <DashboardCard
            icon={<FaPlus />}
            title="Add Product"
            description="Create and publish new products with images, pricing, and descriptions."
            onClick={() => navigate("/seller/add-product")}
            accent="blue"
          />

          {/* PRODUCTS */}
          <DashboardCard
            icon={<FaList />}
            title="My Products"
            description="Edit product details, update prices, or remove items from your store."
            onClick={() => navigate("/seller/products")}
            accent="purple"
          />

          {/* ORDERS */}
          <DashboardCard
            icon={<FaCartArrowDown />}
            title="Orders"
            description="View incoming orders, track deliveries, and manage customer requests."
            onClick={() => navigate("/seller/orders")}
            accent="green"
          />

          {/* ANALYTICS */}
          <DashboardCard
            icon={<FaChartLine />}
            title="Store Overview"
            description="Monitor store performance, sales activity, and key insights."
            onClick={() => navigate("/seller/dashboard")}
            accent="orange"
          />
        </div>
      </div>
    </div>
  );
}

/* CARD COMPONENT */
function DashboardCard({ icon, title, description, onClick, accent }) {
  const accentColors = {
    blue: "hover:shadow-blue-500/30 text-blue-400",
    purple: "hover:shadow-purple-500/30 text-purple-400",
    green: "hover:shadow-green-500/30 text-green-400",
    orange: "hover:shadow-orange-500/30 text-orange-400",
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-3xl bg-gray-800/80 backdrop-blur border border-gray-700 p-8 shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl ${accentColors[accent]}`}
    >
      <div className="text-4xl mb-6">{icon}</div>

      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>

      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
