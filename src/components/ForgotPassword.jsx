// src/components/ForgotPassword.jsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { resetPassword, state } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await resetPassword(email);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 border border-gray-300 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Reset Password</h2>
        {state.error && <p className="text-red-500 text-center">{state.error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded" required />
          </div>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
