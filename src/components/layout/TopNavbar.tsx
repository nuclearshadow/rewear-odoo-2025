// src/components/layout/TopNavbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, LogOut, PlusSquare, ShieldCheck } from "lucide-react";

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

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div
        className="w-full max-w-5xl flex items-center justify-between px-4 py-2
                           rounded-full border border-black/10 shadow-lg
                           bg-white/60 backdrop-blur-xl"
      >
        {/* ... Left Side and other sections remain exactly the same ... */}
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
                <div className="absolute right-0 mt-3 w-56 p-2 rounded-2xl border border-black/10 shadow-xl bg-white backdrop-blur-xl animate-fade-in-down">
                  <div className="px-2 py-2 border-b border-black/10 mb-2">
                    <p className="text-sm text-gray-600">Signed in as</p>
                    <p className="font-semibold text-gray-900 truncate">
                      {user.username}
                    </p>
                  </div>
                  <nav className="flex flex-col gap-1">
                    {/* --- THIS IS THE NEW LOGIC --- */}
                    {/* If the user is an admin, show the special admin button */}
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-red-700 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors font-semibold"
                      >
                        <ShieldCheck className="h-4 w-4" /> Admin Panel
                      </Link>
                    )}

                    {/* Regular user dashboard link, visible to everyone (including admins) */}
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-800 rounded-lg hover:bg-black/5 transition-colors font-medium"
                    >
                      <LayoutDashboard className="h-4 w-4 text-gray-600" />{" "}
                      Dashboard
                    </Link>

                    {/* List an Item link */}
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
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // ... Logged-out state ...
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
