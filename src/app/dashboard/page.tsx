// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ItemCard, { Item } from "@/components/common/ItemCard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MyItemsPage from "@/components/ui/MyItemsComponent";
import ImageUploader from "@/components/common/ImageUploader";
// A simple spinner component
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
      <div className="min-h-[90vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="bg-gray-100 min-h-[90vh]">
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
          <section>
            <h2 className="text-2xl font-bold mb-4">My Purchases</h2>
              <div className="bg-white p-6 rounded-lg text-center text-gray-500">
                <p>You haven't acquired any items yet.</p>
                <Link
                  href="/browse"
                  className="inline-block mt-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                  Browse Items
                </Link>
              </div>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
