import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaMusic } from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "btn-primary" : "btn-ghost";

  return (
    <div className="fixed z-10 top-0 left-0 right-0 navbar bg-base-100 border-b border-base-300 px-4 md:px-8">
      {/* Logo */}
      <div className="flex-1">
        <Link
          to="/"
          x
          className="flex items-center text-2xl font-bold tracking-wide"
        >
          <FaMusic className="text-primary text-3xl mr-2" />
          <span className="text-primary">Sync</span>
          <span className="text-base-content">Beats</span>
        </Link>
      </div>

      {/* Desktop Menu */}
      {user && (
        <div className="hidden md:flex items-center gap-2">
          <Link to="/" className={`btn btn-sm ${isActive("/")}`}>
            Home
          </Link>

          <Link to="/rooms" className={`btn btn-sm ${isActive("/rooms")}`}>
            Rooms
          </Link>

          <Link
            to="/join-requests"
            className={`btn btn-sm ${isActive("/join-requests")}`}
          >
            Requests
          </Link>

          {user.role === "admin" && (
            <Link to="/admin" className="btn btn-sm btn-warning">
              Admin
            </Link>
          )}

          {/* Profile Dropdown */}
          <div className="dropdown dropdown-end ml-2">
            <label tabIndex={0} className="btn btn-sm btn-circle">
              <FaUserCircle className="text-3xl" />
            </label>

            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-44"
            >
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button onClick={logout} className="text-error">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {user && (
        <div className="md:hidden dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-sm btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>

          <ul
            tabIndex={0}
            className="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-48"
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/rooms">Rooms</Link>
            </li>
            <li>
              <Link to="/join-requests">Requests</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            {user.role === "admin" && (
              <li>
                <Link to="/admin">Admin</Link>
              </li>
            )}
            <li>
              <button onClick={logout} className="text-error">
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
