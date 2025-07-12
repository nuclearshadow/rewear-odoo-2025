// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ItemCard, { Item } from "@/components/common/ItemCard"; // We will reuse our ItemCard!
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ImageUploader from "@/components/common/ImageUploader";
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
  } | null>({ myListings: [], myPurchases: [] });  
  const [isLoadingData, setIsLoadingData] = useState(true);

  // --- Authentication and Data Fetching Logic ---
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
    }
  
    if (user) {
      const fetchMyListings = async () => {
        try {
          const res = await fetch("/api/v1/items/mine");
          if (!res.ok) throw new Error("Failed to fetch listings");
          const items: Item[] = await res.json();
          setDashboardData({
            myListings: items,
            myPurchases: [] // keep empty for now
          });
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchMyListings();
    }
  }, [user, isAuthLoading, router]);
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', avatarFile);

      const res = await fetch('/api/v1/users/avatar', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setUploadSuccess("Avatar updated!");
        // Optionally: update user avatar_url in context or refetch user
      } else {
        const data = await res.json();
        setUploadError(data.error || 'Upload failed');
      }
    } catch (err) {
      setUploadError('Upload error');
    } finally {
      setUploading(false);
    }
  };

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
    <ProtectedRoute>
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto p-4 md:p-8">
          {/* Profile Section */}
          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex items-center space-x-4">
              <ImageUploader
                label="Avatar"
                onChange={(files) => setAvatarFile(files?.[0] ?? null)}
                maxImages={1}
                initialImages={user.avatar_url ? [user.avatar_url] : undefined}
              />
              <div>
                <h1 className="text-3xl font-bold">{user.username}</h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-lg font-semibold text-blue-600 mt-1">
                  {user.points_balance || 0} Points
                </p>

                {avatarFile && (
                  <button
                    onClick={handleUploadAvatar}
                    disabled={uploading}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {uploading ? "Uploading..." : "Upload Avatar"}
                  </button>
                )}
                {uploadSuccess && <p className="text-green-600 text-sm">{uploadSuccess}</p>}
                {uploadError && <p className="text-red-600 text-sm">{uploadError}</p>}
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
    </ProtectedRoute>
  );
}
