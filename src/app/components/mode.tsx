// mode.tsx
'use client';

import { useRouter } from "next/navigation";

export default function ModePage() {
  const router = useRouter();

  const handleCardClick = (role: string) => {
    if (role === 'admin') {
      sessionStorage.setItem('userRole', 'admin');
      router.push('/leaderboard'); // Redirect to leaderboard for admin
    } else if (role === 'user') {
      sessionStorage.setItem('userRole', 'user');
      router.push('/'); // Redirect to home for user
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-xl font-bold text-center">Choose Your Mode</h2>
        
        <div className="flex space-x-4 justify-center">
          <div
            className="p-6 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
            onClick={() => handleCardClick('admin')}
          >
            <h3 className="text-lg font-semibold">Admin</h3>
            <p>Access the admin panel and leaderboard.</p>
          </div>

          <div
            className="p-6 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700"
            onClick={() => handleCardClick('user')}
          >
            <h3 className="text-lg font-semibold">User</h3>
            <p>Access the regular homepage and events.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
