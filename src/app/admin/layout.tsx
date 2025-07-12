// src/app/admin/layout.tsx
"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Spinner = () => (
  <div className="w-16 h-16 border-4 border-blue-600 border-dashed rounded-full animate-spin"></div>
);

// The main layout component for the entire admin section
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // This effect handles the protection logic
  useEffect(() => {
    // If auth state is done loading AND...
    if (!isLoading) {
      // ...the user is not logged in OR is not an admin, redirect them.
      if (!user || user.role !== "admin") {
        router.push("/"); // Redirect to homepage
      }
    }
  }, [user, isLoading, router]);

  // While we check the user's role, show a loading spinner.
  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <Spinner />
      </div>
    );
  }

  // If the user is an admin, show the admin UI.
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 bg-gray-800 text-white p-4">
        <div className="mb-8">
          <Link href="/admin" className="text-2xl font-bold">
            ReWear Admin
          </Link>
        </div>
        <nav className="flex flex-col space-y-2">
          <Link
            href="/admin"
            className="px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/listings"
            className="px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Manage Listings
          </Link>
          <Link
            href="/admin/users"
            className="px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Manage Users
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
