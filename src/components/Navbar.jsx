// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Logout from "./Logout";

const Navbar = () => {
  const { state } = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl">PassOnThoseBooks</h1>
        <div className="flex space-x-4">
          {state.user ? (
            <>
              <Link to="/" className="text-white">
                Home
              </Link>
              <Logout />
            </>
          ) : (
            <>
              <Link to="/signup" className="text-white">
                Sign Up
              </Link>
              <Link to="/login" className="text-white">
                Log In
              </Link>
              <Link to="/forgot-password" className="text-white">
                Forgot Password
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
