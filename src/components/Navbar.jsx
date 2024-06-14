// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { state, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-gray-800 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-2">
        <Link to="/" className="text-white text-lg font-semibold">
          Book Library
        </Link>
        <div className="flex items-center">
          {state.user ? (
            <>
              <Link to="/my-library" className="text-white mr-4">
                My Library
              </Link>
              <span className="text-white mr-4">Welcome, {state.user.email}</span>
              <button onClick={logout} className="text-white px-4 py-2 rounded bg-gray-800 border border-white">
                Logout
              </button>
            </>
          ) : (
            <>
              {location.pathname !== "/login" && (
                <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded mr-4">
                  Log In
                </Link>
              )}
              <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
