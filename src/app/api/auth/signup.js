// import { useState } from "react";
// import { useRouter } from "next/router";
// import { signIn } from "next-auth/react";
// import Link from "next/link";

// const SignupPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     const res = await fetch("/api/auth/signup", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password }),
//     });

//     if (res.ok) {
//       await signIn("credentials", {
//         email,
//         password,
//         callbackUrl: "/",
//       });
//     } else {
//       setError("Error creating account");
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Create Account</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Confirm Password</label>
//           <input
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//         </div>
//         {error && <p style={{ color: "red" }}>{error}</p>}
//         <button type="submit">Sign Up</button>
//       </form>
//       <p>
//         Already have an account? <Link href="/auth/login">Login</Link>
//       </p>
//     </div>
//   );
// };

// export default SignupPage;



// 'use client'
// import { useState } from "react";
// import { useRouter } from "next/router";
// import bcrypt from "bcrypt";
// import { registerUser } from "@/app/api/auth/signup"; // Call an API endpoint to handle registration

// const SignUp = () => {
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleSignUp = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     try {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const response = await registerUser({ email, username, password: hashedPassword });

//       if (response.success) {
//         router.push("/auth/login");
//       } else {
//         setError(response.message);
//       }
//     } catch (error) {
//       setError("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div className="form-container">
//       <h1>Sign Up</h1>
//       {error && <p>{error}</p>}
//       <form onSubmit={handleSignUp}>
//         <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
//         <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
//         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
//         <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required />
//         <button type="submit">Sign Up</button>
//       </form>
//     </div>
//   );
// };

// export default SignUp;


import { registerUser } from "@/app/utils/user"; // Utility function
import { NextApiRequest, NextApiResponse } from "next";

// API route to handle sign-up
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, username } = req.body;
    try {
      const newUser = await registerUser(email, password, username);
      res.status(201).json({ user: newUser });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
