
// 'use client'

// import { useRouter } from "next/navigation";

// const ModePage = () => {
//   const router = useRouter();

//   const handleRoleSelection = (role: string) => {
//     // Store the role in localStorage
//     if (typeof window !== "undefined") {
//       localStorage.setItem("userRole", role); // Store the role as 'admin' or 'user'
//     }

//     // Redirect the user to the appropriate page
//     if (role === 'admin') {
//       router.push('/admin-login'); // Admin will be redirected to the login page
//     } else {
//       router.push('/'); // User will be redirected to the homepage
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-black">
//       <div className="space-y-4">
//         <h2 className="text-xl font-bold text-center text-white">Choose Your Mode</h2>
//         <button 
//           onClick={() => handleRoleSelection('admin')} 
//           className="px-4 py-2 bg-blue-600 text-white rounded-md">
//           Access the admin panel <br /> and leaderboard.
//         </button>
//         <button 
//           onClick={() => handleRoleSelection('user')} 
//           className="px-4 py-2 bg-green-600 text-white rounded-md">
//           Access the regular homepage <br /> and events.
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ModePage;


'use client'

import { useRouter } from "next/navigation";

const ModePage = () => {
  const router = useRouter();

  const handleRoleSelection = (role: string) => {
    // Store the role in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("userRole", role); // Store the role as 'admin' or 'user'
    }

    // Redirect the user to the appropriate page
    if (role === 'admin') {
      router.push('/admin-login'); // Admin will be redirected to the login page
    } else {
      router.push('/'); // User will be redirected to the homepage
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="space-y-6 max-w-md w-full px-6 py-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white">Choose Your Mode</h2>
        
        <button 
          onClick={() => handleRoleSelection('admin')} 
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 transition duration-300"
        >
          Access the Admin Panel <br /> and Leaderboard.
        </button>

        <button 
          onClick={() => handleRoleSelection('user')} 
          className="w-full px-4 py-3 bg-green-600 text-white rounded-md text-lg hover:bg-green-700 transition duration-300"
        >
          Access the Regular Homepage <br /> and Events.
        </button>
      </div>
    </div>
  );
};

export default ModePage;

