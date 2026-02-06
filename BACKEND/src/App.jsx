import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./component/navigation";
import Home from "./component/home";
import Login from "./component/login";
import Register from "./component/register";
import CustomerDashboard from "./component/customerDashboard";
import CustomerProduct from "./component/customerProducts";
import ProductDetails from "./component/productDetail";
import Checkout from "./component/checkout";
import CustomerOrders from "./component/customerOrders";
import SellerNav from "./component/sellerNav";
import SellerDashboard from "./component/sellerDashboard";
import AddProduct from "./component/addProduct";
import SellerProducts from "./component/sellerProduct";
import SellerOrder from "./component/sellerOrder";
import SellerOrders from "./component/sellerOrders";
import SellerWelcome from "./component/sellerWelcome";
import SellerAnalytics from "./component/SellerAnalytics";
import OrderHistory from "./component/OrderHistory";
// import ForgotPassword from "./component/ForgotPassword";
// import ResetPassword from "./component/ResetPassword";

function App() {
  return (
    <div className="min-h-screen w-full m-0 p-0">
      <main className="w-full m-0 p-0">
        <Routes>
          <Route
            element={
              <>
                <Navbar />
                <Outlet />
              </>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>x

          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/customer/products" element={<CustomerProduct />} />
          <Route path="/customer/history" element={<OrderHistory />} />
          <Route path="/customer/product/:id" element={<ProductDetails />} />
          <Route path="/customer/product/checkout/:id" element={<Checkout />} />
          <Route path="/customer/orders" element={<CustomerOrders />} />

          <Route path="/seller/" element={<SellerNav />}>
            <Route index element={<SellerWelcome />} />
            <Route path="/seller/home" element={<SellerWelcome />} />
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/seller/add-product" element={<AddProduct />} />
            <Route path="/seller/products" element={<SellerProducts />} />
            <Route path="/seller/analytics" element={<SellerAnalytics />} />
            <Route path="/seller/orders/:productId" element={<SellerOrder />} />
            <Route path="/seller/orders" element={<SellerOrders />} />

       

          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
