"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <nav className="bg-gray-900 text-white py-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          JobAutoFill
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          {user && (
            <>
              <Link href="/dashboard" className="hover:text-gray-300">
                Dashboard
              </Link>
              <Link href="/profile" className="hover:text-gray-300">
                Profile
              </Link>
              <Link href="/tracker" className="hover:text-gray-300">
                Application Tracker
              </Link>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="flex space-x-4">
          {user ? (
            <>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-sm font-medium">
                Login
              </Link>
              <Link href="/auth/signup" className="border border-blue-500 px-4 py-2 rounded text-sm font-medium hover:bg-blue-500">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
