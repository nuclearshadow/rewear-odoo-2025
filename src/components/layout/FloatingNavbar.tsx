// src/components/layout/FloatingNavbar.tsx
"use client";

import Link from "next/link";
import { Home, LayoutDashboard, PlusSquare, Shirt } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Reusable NavLink component for consistent styling and animation
const NavLink = ({
  href,
  icon: Icon,
  text,
}: {
  href: string;
  icon: React.ElementType;
  text: string;
}) => (
  <Link
    href={href}
    className="group relative flex items-center justify-center h-14 w-14 rounded-full transition-all duration-300 ease-in-out
                   text-gray-500 hover:bg-blue-500/10 hover:rounded-xl hover:text-blue-600"
  >
    <Icon className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
    {/* Tooltip that appears on hover */}
    <span
      className="absolute left-full ml-4 w-auto min-w-max p-2 px-3 text-sm font-medium
                       bg-gray-900 text-white rounded-md shadow-lg
                       scale-0 group-hover:scale-100 transition-all origin-left duration-200"
    >
      {text}
    </span>
  </Link>
);

export default function FloatingNavbar() {
  const { user, isLoading } = useAuth();

  return (
    <aside
      // --- This is the Glassmorphism and Floating Logic ---
      className="fixed top-1/2 left-4 -translate-y-1/2 flex flex-col items-center
                       p-4 space-y-4 z-50 rounded-2xl border border-white/20
                       bg-white/60 backdrop-blur-xl shadow-lg
                       transition-all duration-300 ease-in-out"
    >
      {/* Logo */}
      <div className="h-14 w-14 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-2xl shadow-md">
        R
      </div>

      <div className="w-full h-[1px] bg-black/10 my-2"></div>

      <nav className="flex flex-col items-center gap-2">
        <NavLink href="/" icon={Home} text="Home" />
        <NavLink href="/browse" icon={Shirt} text="Browse Items" />

        {/* Conditional links that appear smoothly */}
        {!isLoading && user && (
          <>
            <NavLink
              href="/dashboard"
              icon={LayoutDashboard}
              text="Dashboard"
            />
            <NavLink href="/items/add" icon={PlusSquare} text="List an Item" />
          </>
        )}
      </nav>
    </aside>
  );
}
