// src/components/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, state } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, password);
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 border border-gray-300 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
        {state.error && <p className="text-red-500 text-center">{state.error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded" required />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded" required />
          </div>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
