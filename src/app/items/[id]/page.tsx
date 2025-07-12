// src/app/items/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ListingGallery from "@/components/common/ListingGallery";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Define the detailed shape of our item object based on the new API response
type UploaderProfile = {
  id: string;
  username: string;
};

type ItemImage = {
  id: string;
  image_url: string;
};

type DetailedItem = {
  id: string;
  title: string;
  description: string;
  category_id: number;
  size: string;
  condition: string;
  points_cost: number;
  status: string;
  profiles: UploaderProfile;
  item_images: ItemImage[];
};

const Spinner = () => (
  <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
);

// The `params` prop is automatically passed to dynamic pages
export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const { id: itemId } = params;
  const { user } = useAuth(); // Get the currently logged-in user

  const [item, setItem] = useState<DetailedItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/v1/items/${itemId}`);
        if (!response.ok) {
          throw new Error(
            "Item not found. It may have been swapped or removed."
          );
        }
        const data = await response.json();
        setItem(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (itemId) {
      fetchItem();
    }
  }, [itemId]);

  // Handle loading and error states first
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="text-gray-600 mt-2">
          {error || "Could not load the item details."}
        </p>
        <Link
          href="/"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Go to Homepage
        </Link>
      </div>
    );
  }

  // The main component render
  return (
    <>
      <Header />
      <main className="container mx-auto max-w-6xl p-4 md:p-8 my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column: Image Gallery */}
          <div>
            <ListingGallery images={item.item_images} title={item.title} />
          </div>

          {/* Right Column: Item Details */}
          <div className="flex flex-col">
            {/* Uploader Info */}
            <div className="mb-4">
              <span className="text-sm text-gray-500">Listed by</span>
              <p className="font-semibold text-lg text-gray-800">
                {item.profiles.username}
              </p>
            </div>

            {/* Title and Price */}
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {item.title}
            </h1>
            <p className="text-3xl font-light text-blue-600 mb-6">
              {item.points_cost} Points
            </p>

            {/* Item Specifics */}
            <div className="space-y-4 border-t pt-6 mb-8">
              <div className="grid grid-cols-3 gap-4">
                <span className="font-semibold text-gray-700">Condition:</span>
                <span className="col-span-2 text-gray-800">
                  {item.condition}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span className="font-semibold text-gray-700">Size:</span>
                <span className="col-span-2 text-gray-800">{item.size}</span>
              </div>
            </div>

            {/* Description */}
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {item.description}
            </p>

            {/* Action Buttons */}
            <div className="mt-auto pt-8">
              {user && user.id === item.profiles.id ? (
                <p className="text-center p-3 bg-gray-100 text-gray-600 rounded-md">
                  This is your listing.
                </p>
              ) : user ? (
                <button className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg text-lg hover:bg-blue-700 transition-colors">
                  Request Swap
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block text-center w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg text-lg hover:bg-gray-700 transition-colors"
                >
                  Login to Request Swap
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}