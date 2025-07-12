// src/components/layout/Header.tsx
"use client"; // This is now a client component to use hooks

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const router = useRouter();
  const { user, setUser, isLoading } = useAuth(); // Get user, setUser, and loading state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- Logout Handler ---
  const handleLogout = async () => {
    setIsMenuOpen(false); // Close the menu
    try {
      // Call our new API endpoint
      await fetch("/api/v1/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Failed to logout on server", error);
    } finally {
      // In any case, clear the user state on the client and redirect
      setUser(null);
      router.push("/");
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          ReWear
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link
            href="/browse"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Browse Items
          </Link>
          <Link
            href="/about"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            About Us
          </Link>
        </nav>

        {/* --- DYNAMIC AUTH SECTION --- */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            // Show a simple placeholder while we check auth status
            <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
          ) : user ? (
            // ---- Logged-in State ----
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2"
              >
                <span className="hidden sm:inline font-medium text-gray-700">
                  {user.username}
                </span>
                {/* Avatar */}
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/items/add"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    List an Item
                  </Link>
                  <div className="border-t my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // ---- Logged-out State ----
            <>
              <Link
                href="/login"
                className="hidden sm:inline-block text-gray-600 font-medium hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
        {/* --- END OF DYNAMIC AUTH SECTION --- */}
      </div>
    </header>
  );
}
