'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Hardcoded admin credentials (can be fetched from JSON in a real app)
    const adminPassword = "admin123"; // This should ideally be stored in a secure place like an API

    if (password === adminPassword) {
      // Store the admin session in localStorage or sessionStorage (for demo purposes)
      if (typeof window !== "undefined") {
        localStorage.setItem("userRole", "admin");
      }
      // Redirect to the admin page (with navigation bar)
      router.push("/");
    } else {
      setError("Invalid password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="space-y-6 p-6 bg-gray-900 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold text-center text-white">Admin Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="password" className="text-white">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
              required
            />
          </div>

          {error && <div className="text-red-500 text-center">{error}</div>}

          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
