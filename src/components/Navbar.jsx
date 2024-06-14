// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { state, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-semibold">
          PassOnThoseBooks
        </Link>
        <div className="flex items-center">
          {state.user ? (
            <>
              <span className="text-white mr-4">Welcome, {state.user.email}</span>
              <button onClick={logout} className="bg-gray-800 text-white px-4 py-2 rounded border border-white">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white mr-4">
                Log In
              </Link>
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
