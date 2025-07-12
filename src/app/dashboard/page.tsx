// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ItemCard, { Item } from "@/components/common/ItemCard"; // We will reuse our ItemCard!

// A simple spinner component
const Spinner = () => (
  <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
);

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth(); // Get user and loading state from context

  const [dashboardData, setDashboardData] = useState<{
    myListings: Item[];
    myPurchases: Item[];
  } | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // --- Authentication and Data Fetching Logic ---
  useEffect(() => {
    // This effect handles protecting the route
    if (!isAuthLoading && !user) {
      router.push("/login");
    }

    // This effect fetches the data once we know a user is logged in
    if (user) {
      const fetchDashboardData = async () => {
        try {
          const response = await fetch("/api/v1/dashboard");
          if (!response.ok) throw new Error("Failed to fetch dashboard data");
          const data = await response.json();
          setDashboardData(data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchDashboardData();
    }
  }, [user, isAuthLoading, router]);

  // --- Render States ---
  if (isAuthLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // This state will be hit if the redirect hasn't happened yet, but there's no user
  if (!user) {
    return null;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
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
          <h2 className="text-2xl font-bold mb-4">My Listings</h2>
          {dashboardData?.myListings && dashboardData.myListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {dashboardData.myListings.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg text-center text-gray-500">
              <p>You haven't listed any items yet.</p>
              <Link
                href="/items/add"
                className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                List an Item
              </Link>
            </div>
          )}
        </section>

        {/* My Purchases Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">My Purchases</h2>
          {dashboardData?.myPurchases &&
          dashboardData.myPurchases.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {dashboardData.myPurchases.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg text-center text-gray-500">
              <p>You haven't acquired any items yet.</p>
              <Link
                href="/browse"
                className="inline-block mt-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                Browse Items
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
