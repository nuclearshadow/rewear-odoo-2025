// src/components/layout/TopNavbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, LogOut, PlusSquare } from "lucide-react";

export default function TopNavbar() {
  const router = useRouter();
  const { user, setUser, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Failed to logout on server", error);
    } finally {
      setUser(null);
      router.push("/");
    }
  };

  // --- THIS IS OUR NEW CONSISTENT STYLE DEFINITION ---
  // Note: The dropdown uses `rounded-2xl` while the main bar is `rounded-full` for a standard nested look.
  const glassStyle =
    "border border-black/10 shadow-lg bg-white/90 backdrop-blur-sm";

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div
        className={`w-full max-w-5xl flex items-center justify-between px-4 py-2 rounded-full ${glassStyle} transition-all duration-300 ease-in-out`}
      >
        {/* Left Side: Logo & Main Navigation */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-bold text-2xl text-gray-800 flex-shrink-0"
          >
            ReWear
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/browse"
              className="px-4 py-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-black/5 transition-colors font-medium"
            >
              Browse Items
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-black/5 transition-colors font-medium"
            >
              About
            </Link>
          </nav>
        </div>

        {/* Right Side: Dynamic Auth Section */}
        <div className="flex items-center">
          {isLoading ? (
            <div className="h-10 w-24 bg-gray-200/80 rounded-full animate-pulse"></div>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-gray-500/10 active:scale-95 transition-all"
              >
                <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline font-semibold text-gray-700">
                  {user.username}
                </span>
              </button>

              {isMenuOpen && (
                <div
                  className={`absolute right-0 mt-3 w-56 p-2 rounded-2xl animate-fade-in-down ${glassStyle}`}
                >
                  <div className="px-2 py-2 border-b border-black/10">
                    <p className="text-sm text-gray-600">Signed in as</p>
                    <p className="font-semibold text-gray-900 truncate">
                      {user.username}
                    </p>
                  </div>
                  <nav className="flex flex-col gap-1 mt-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-800 rounded-lg hover:bg-black/5 transition-colors font-medium"
                    >
                      <LayoutDashboard className="h-4 w-4 text-gray-600" />{" "}
                      Dashboard
                    </Link>
                    <Link
                      href="/items/add"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-800 rounded-lg hover:bg-black/5 transition-colors font-medium"
                    >
                      <PlusSquare className="h-4 w-4 text-gray-600" /> List an
                      Item
                    </Link>
                  </nav>
                  <div className="border-t my-2 border-black/10"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-red-700 rounded-lg hover:bg-red-500/10 transition-colors font-semibold"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Logged-out state
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black rounded-full transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
