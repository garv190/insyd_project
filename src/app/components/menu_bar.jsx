
'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { getProviders, signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export function Sidebar() {
  const { data: session } = useSession();
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [providers, setProviders] = useState(null);

  // Fetch providers for authentication
  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };

    setUpProviders();
  }, []);

  // Role-based navigation
  const userRole = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
  const isAdmin = userRole === "admin";

  // Menu items based on role
  const commonMenuItems = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/?scrollTo=events" },
    { name: "Mode", href: "/mode" }, // Mode Page for Role Selection
  ];
  const userMenuItems = [{ name: "Tickets", href: "/payment" }];
  const adminMenuItems = [
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Verification", href: "/tickets" },
  ];
  const menuItems = isAdmin ? [...commonMenuItems, ...adminMenuItems] : [...commonMenuItems, ...userMenuItems];

  // Copy to clipboard logic
  const [copied, setCopied] = useState("");
  const handleCopy = () => {
    if (session?.user?.scoutId) {
      setCopied(session.user.scoutId);
      navigator.clipboard.writeText(session.user.scoutId);
      setTimeout(() => setCopied(""), 5000);
    }
  };

  const handleToggle = () => {
    setSideBarOpen((prev) => !prev);
  };

  return (
    <>
      {/* Toggle Button for Sidebar */}
      <button
        onClick={handleToggle}
        className={`${!sideBarOpen ? "block" : "hidden"} fixed top-4 left-4 z-50 px-4 py-2 sm:hidden`}
      >
        <img
          className="w-[40px] h-[30px] object-cover"
          src="/assets/menu-removebg-preview.png"
          alt="Menu"
        />
      </button>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full bg-black text-white w-40 transform ${
          sideBarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        {/* Header */}
        <div className="p-4 text-[20px] flex justify-between">
          ESummit
          <button onClick={handleToggle} className="text-red-400 focus:outline-none">
            X
          </button>
        </div>

        {/* Navigation Links */}
        <ul className="mt-6">
          {menuItems.map((item, index) => (
            <li key={index} className="text-[20px] p-4 hover:bg-neutral-700">
              <Link href={item.href}>{item.name}</Link>
            </li>
          ))}
        </ul>

        {/* User Authentication and Info */}
        <div className="ml-2 h-screen flex flex-col">
          {session?.user ? (
            <div className="flex flex-col justify-between h-full">
              {/* Sign Out Button */}
              <div className="pb-4">
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  as="button"
                  onClick={signOut}
                  className="bg-white text-black dark:bg-black dark:text-white flex items-center space-x-2"
                >
                  <span>Sign Out</span>
                </HoverBorderGradient>
              </div>

              {/* User Info */}
              <div className="mt-auto pb-4 absolute bottom-0 w-full">
                <div className="flex flex-col items-center">
                  <img
                    src={session?.user.image || "/assets/default-profile.png"}
                    className="w-[50px] h-[50px] rounded-full"
                    alt="User Profile"
                  />
                  <div className="mt-2">
                    <p>Your referral ID:</p>
                    <div className="flex gap-x-2">
                      <p className="text-blue-400">{session?.user.scoutId}</p>
                      <div
                        className="w-7 h-7 rounded-full bg-white/10 shadow-[inset_10px_-50px_94px_0_rgba(199,199,199,0.2)] backdrop-blur flex justify-center items-center cursor-pointer"
                        onClick={handleCopy}
                      >
                        <Image
                          src={copied === session?.user.scoutId ? "/assets/tick.svg" : "/assets/copy.svg"}
                          width={12}
                          height={12}
                          alt="Copy Icon"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Sign In Button
            <>
              {providers &&
                Object.values(providers).map((provider) => (
                  <div key={provider.id} className="flex mt-auto">
                    <HoverBorderGradient
                      containerClassName="rounded-full"
                      as="button"
                      onClick={() => signIn(provider.id)}
                      className="bg-white text-black dark:bg-black dark:text-white flex items-center space-x-2"
                    >
                      <span>Sign In</span>
                    </HoverBorderGradient>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
