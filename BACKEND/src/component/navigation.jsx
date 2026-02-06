import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar({ dark }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
 
  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-500 font-semibold"
      : dark
      ? "text-gray-300 hover:text-white"
      : "text-gray-700 hover:text-black";

  return (
    <nav
      className={`w-full px-6 md:px-10 py-4 flex justify-between items-center transition ${
        dark ? "bg-gray-900 text-white" : "bg-white text-black"
      } shadow-md`}
    >
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-extrabold tracking-wide hover:opacity-80 transition"
      >
        Shopper<span className="text-blue-500">Ease</span>
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-8 text-base font-medium">
        <li>
          <Link className={isActive("/")} to="/">
            Home
          </Link>
        </li>

        <li>
          <Link className={isActive("/login")} to="/login">
            Login
          </Link>
        </li>

        <li>
          <Link
            to="/register"
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Register
          </Link>
        </li>
      </ul>

      {/* Mobile Toggle */}
      <button
        className="md:hidden text-2xl focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu */}
      {open && (
        <div
          className={`absolute top-[72px] left-0 w-full ${
            dark ? "bg-gray-900 text-white" : "bg-white text-black"
          } py-6 shadow-lg flex flex-col gap-4 md:hidden z-50`}
        >
          <Link
            className={`px-6 text-lg ${isActive("/")}`}
            to="/"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          <Link
            className={`px-6 text-lg ${isActive("/login")}`}
            to="/login"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>

          <Link
            className="mx-6 text-center py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            to="/register"
            onClick={() => setOpen(false)}
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
