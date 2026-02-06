// import { NavLink, useNavigate } from "react-router-dom";
// import {
//   FaHome,
//   FaShoppingBag,
//   FaStore,
//   FaHistory,
//   FaSignOutAlt,
// } from "react-icons/fa";

// export default function CustomerNav() {
//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const linkClass = ({ isActive }) =>
//     `flex items-center gap-3 px-4 py-3 rounded-xl transition-all
//      ${
//        isActive
//          ? "bg-slate-800 text-white shadow-md"
//          : "text-slate-400 hover:bg-slate-800 hover:text-white"
//      }`;

//   return (
//     <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col">
//       {/* LOGO */}
//       <div className="px-6 py-6 border-b border-slate-800">
//         <h1 className="text-2xl font-extrabold tracking-wide">
//           Shopper<span className="text-slate-400">Ease</span>
//         </h1>
//         <p className="text-xs text-slate-500 mt-1">Smart shopping dashboard</p>
//       </div>

//       {/* NAV LINKS */}
//       <nav className="flex-1 px-4 py-6 space-y-2">
//         <NavLink to="/customer/dashboard" className={linkClass}>
//           <FaHome /> Dashboard
//         </NavLink>

//         <NavLink to="/customer/products" className={linkClass}>
//           <FaStore /> Products
//         </NavLink>

//         <NavLink to="/customer/orders" className={linkClass}>
//           <FaShoppingBag /> My Orders
//         </NavLink>

//         <NavLink to="/customer/history" className={linkClass}>
//           <FaHistory /> Order History
//         </NavLink>
//       </nav>

//       {/* LOGOUT */}
//       <div className="px-4 py-4 border-t border-slate-800">
//         <button
//           onClick={logout}
//           className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
//         >
//           <FaSignOutAlt /> Logout
//         </button>
//       </div>
//     </aside>
//   );
// }
