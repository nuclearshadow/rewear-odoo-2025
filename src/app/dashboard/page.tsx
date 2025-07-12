// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ItemCard, { Item } from "@/components/common/ItemCard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MyItemsPage from "@/components/ui/MyItemsComponent";

const Spinner = () => (
  <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
);

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
    }

    if (user) {
      const fetchMyItems = async () => {
        try {
          const res = await fetch("/api/v1/items/mine", {
            method: "GET",
            credentials: "include",
          });
          if (!res.ok) throw new Error("Failed to fetch items");
          const data = await res.json();
          setMyItems(data);
        } catch (error) {
          console.error("Error fetching items:", error);
        } finally {
          setIsLoadingData(false);
        }
      };

      fetchMyItems();
    }
  }, [user, isAuthLoading, router]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isAuthLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-end p-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="container mx-auto p-4 md:p-8">
          {/* Profile Section */}
          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user.username}</h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-lg font-semibold text-blue-600 mt-1">
                  {user.points_balance || 0} Points
                </p>
              </div>
            </div>
          </section>

          {/* My Listings Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">My Listings</h2>
              <button
                onClick={() => router.push("/add-item")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Add Item
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <MyItemsPage />
            </div>
          </section>

          {/* My Purchases Section (Optional for future) */}
        </div>
      </div>
    </ProtectedRoute>
  );
}
