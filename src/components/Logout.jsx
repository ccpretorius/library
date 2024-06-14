// src/components/Logout.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Logout = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <button onClick={handleLogout} className="w-full p-2 bg-blue-500 text-white rounded">
      Logout
    </button>
  );
};

export default Logout;
