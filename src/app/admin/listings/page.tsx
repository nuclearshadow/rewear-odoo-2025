// src/app/admin/listings/page.tsx
"use client";

import { useEffect, useState } from "react";
// import StatusBadge from "@/components/ui/StatusBadge"; // Make sure this component exists
// import { useToast } from "@/hooks/useToast"; // Import the toast hook

// Define the shape of our listing data from the API
type Listing = {
  id: string;
  title: string;
  created_at: string;
  status: "pending_approval" | "available" | "rejected" | "swapped";
  profiles: {
    username: string;
  } | null;
};

export default function ManageListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const { addToast } = useToast();

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/admin/listings");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setListings(data);
    } catch (err) {
      // addToast("Failed to load listings", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleUpdateStatus = async (
    id: string,
    status: "available" | "rejected"
  ) => {
    try {
      const res = await fetch(`/api/v1/admin/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const updatedItem = await res.json();
      if (!res.ok) throw new Error(updatedItem.error);

      // Update the state locally to reflect the change immediately
      setListings((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: updatedItem.status } : item
        )
      );
      // addToast(
      //   `Item ${status === "available" ? "approved" : "rejected"}.`,
      //   "success"
      // );
    } catch (err: any) {
      // addToast(err.message, "error");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Listings</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font--medium text-gray-500 uppercase">
                Uploader
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="relative px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            )}
            {!isLoading &&
              listings.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {item.profiles?.username || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {/* <StatusBadge status={item.status} /> */}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {item.status === "pending_approval" && (
                      <>
                        <button
                          onClick={() =>
                            handleUpdateStatus(item.id, "available")
                          }
                          className="text-green-600 hover:text-green-900 font-semibold"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(item.id, "rejected")
                          }
                          className="text-red-600 hover:text-red-900 font-semibold"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
