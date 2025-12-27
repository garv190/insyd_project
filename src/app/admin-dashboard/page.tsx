'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is an admin
    if (typeof window !== "undefined") {
      const userRole = localStorage.getItem("userRole");
      if (userRole !== "admin") {
        router.push("/admin-login"); // Redirect to login if not an admin
      } else {
        setIsAdmin(true);
      }
    }
  }, [router]);

  if (!isAdmin) {
    return <div>Loading...</div>; // Show loading while checking role
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <h1 className="text-3xl text-center py-10">Welcome to the Admin Dashboard</h1>
      <nav className="flex justify-center gap-10 pb-10">
        <a href="/leaderboard" className="bg-blue-600 px-6 py-3 rounded-md hover:bg-blue-700">
          Leaderboard
        </a>
        <a href="/admin-verification" className="bg-green-600 px-6 py-3 rounded-md hover:bg-green-700">
          Verification
        </a>
      </nav>
    </div>
  );
};

export default AdminDashboard;
