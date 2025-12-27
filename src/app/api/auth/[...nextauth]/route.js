import User from "@/app/models/user";
import { connectToDB } from "@/app/utils/database";
import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';

// Generate a unique referral ID
const generateUniqueId = (length = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// NextAuth configuration
const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      // Connect to DB and fetch user
      await connectToDB();
      const sessionUser = await User.findOne({
        email: session.user.email,
      });

      // Set session data
      if (sessionUser) {
        session.user.scoutId = sessionUser.scoutId;
        session.user.referralUsers = sessionUser.referralUsers.length;
        session.user.id = sessionUser._id.toString();
        session.user.username = sessionUser.username;
      }

      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        await connectToDB();

        // Check if the user exists
        const userExists = await User.findOne({
          email: profile.email,
        });

        // Create a new user if not already exists
        if (!userExists) {
          const random = generateUniqueId();
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
            scoutId: random,
            referralUsers: [],
            referralCount: 0,
          });
        }

        return true;
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false;
      }
    },
  },
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);



// import bcrypt from "bcryptjs"; // Use bcryptjs instead of bcrypt
// import User from "@/app/models/user";
// import { connectToDB } from "@/app/utils/database";
// import NextAuth from "next-auth/next";
// import CredentialsProvider from "next-auth/providers/credentials";

// // Generate a unique referral ID
// const generateUniqueId = (length = 8) => {
//   const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   let result = "";
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return result;
// };

// // NextAuth configuration
// const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         await connectToDB();

//         // Find user by email
//         const user = await User.findOne({ email: credentials.email });

//         if (user && (await bcrypt.compare(credentials.password, user.password))) {
//           return {
//             id: user._id.toString(),
//             email: user.email,
//             username: user.username,
//             role: user.role || "user", 
//             scoutId: user.scoutId,
//           };
//         } else {
//           return null;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async session({ session, user }) {
//       session.user.id = user.id;
//       session.user.username = user.username;
//       session.user.scoutId = user.scoutId;
//       session.user.role = user.role || "user"; 
//       return session;
//     },
//     async signIn({ account, profile, user }) {
//       await connectToDB();

//       // Check if user exists, create new if not
//       const existingUser = await User.findOne({ email: profile.email });

//       if (!existingUser) {
//         const random = generateUniqueId();
//         await User.create({
//           email: profile.email,
//           username: profile.name.replace(" ", "").toLowerCase(),
//           image: profile.picture,
//           scoutId: random,
//           referralUsers: [],
//           referralCount: 0,
//           role: "user", // Default to 'user'
//         });
//       }
//       return true;
//     },
//   },
// };

// export const GET = NextAuth(authOptions);
// export const POST = NextAuth(authOptions);


// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { connectToDB } from "@/app/utils/database";
// import User from "@/app/models/user";
// import bcrypt from "bcryptjs";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         await connectToDB();
        
//         const user = await User.findOne({ email: credentials.email });
//         if (user && bcrypt.compareSync(credentials.password, user.password)) {
//           return { id: user._id, email: user.email, username: user.username, role: user.role || "user" };
//         } else {
//           return null;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       session.user.id = token.id;
//       session.user.role = token.role;
//       return session;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;
//       }
//       return token;
//     },
//   },
//   secret: process.env.JWT_SECRET,
//   session: {
//     jwt: true,
//   },
// };

// export const GET = (req, res) => {
//   return NextAuth(req, res, authOptions);
// };

// export const POST = (req, res) => {
//   return NextAuth(req, res, authOptions);
// };




// import bcrypt from "bcryptjs"; // For password hashing
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// // Mock Admin Data (JSON-based)
// const adminData = [
//   {
//     email: "admin@example.com",
//     password: "$2a$10$abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef", // Hashed password
//     role: "admin",
//   },
// ];

// // Mock User Data (can replace with database connection)
// const userData = [
//   {
//     email: "user@example.com",
//     password: "$2a$10$123456123456123456123456123456123456123456123456", // Hashed password
//     role: "user",
//   },
// ];

// // Helper to find user by email
// const findUserByEmail = (email) =>
//   [...adminData, ...userData].find((user) => user.email === email);

// const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         const user = findUserByEmail(credentials.email);

//         if (!user) {
//           throw new Error("User not found");
//         }

//         // Verify password
//         const isValidPassword = await bcrypt.compare(credentials.password, user.password);
//         if (!isValidPassword) {
//           throw new Error("Invalid credentials");
//         }

//         return {
//           id: user.email,
//           email: user.email,
//           role: user.role,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       session.user = token.user; // Store user info in session
//       return session;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.user = user; // Add user info to JWT token
//       }
//       return token;
//     },
//   },
//   pages: {
//     signIn: "/auth/login", // Redirect to custom login page
//   },
// };

// export const GET = NextAuth(authOptions);
// export const POST = NextAuth(authOptions);



// import NextAuth from "next-auth";
// import Providers from "next-auth/providers";

// // Configure NextAuth.js
// export const authOptions = {
//   providers: [
//     Providers.Google({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     Providers.Credentials({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       authorize: async (credentials) => {
//         // Your authorization logic here (check user credentials)
//         const user = { id: "123", name: "John Doe", email: credentials.email }; // Mock user for demonstration
//         if (user) {
//           return user;
//         } else {
//           return null;
//         }
//       },
//     }),
//   ],
//   session: {
//     jwt: true,
//   },
//   pages: {
//     signIn: "/auth/signin",  // Custom sign-in page
//   },
// };

// export const GET = async (req) => {
//   const session = await NextAuth(req, res, authOptions);
//   return new Response(JSON.stringify(session), { status: 200 });
// };

// export const POST = async (req) => {
//   const session = await NextAuth(req, res, authOptions);
//   return new Response(JSON.stringify(session), { status: 200 });
// };



// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google"; // Import Google provider directly
// import CredentialsProvider from "next-auth/providers/credentials"; // Import Credentials provider directly

// // Configure NextAuth.js
// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         // Your authorization logic here (check user credentials)
//         const user = { id: "123", name: "John Doe", email: credentials.email }; // Mock user for demonstration
//         if (user) {
//           return user;
//         } else {
//           return null;
//         }
//       },
//     }),
//   ],
//   session: {
//     jwt: true,
//   },
//   pages: {
//     signIn: "/auth/signin",  // Custom sign-in page
//   },
// };

// export const GET = async (req, res) => {
//   const session = await NextAuth(req, res, authOptions);
//   return new Response(JSON.stringify(session), { status: 200 });
// };

// export const POST = async (req, res) => {
//   const session = await NextAuth(req, res, authOptions);
//   return new Response(JSON.stringify(session), { status: 200 });
// };
