// src/app/admin/page.tsx
// This page is a "Server Component" by default.
// We will build the interactive parts later.

export default async function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-500">
            Items Pending Approval
          </h2>
          <p className="text-4xl font-bold mt-2">12</p>{" "}
          {/* This will be dynamic */}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-500">Total Users</h2>
          <p className="text-4xl font-bold mt-2">152</p>{" "}
          {/* This will be dynamic */}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-500">
            Completed Swaps
          </h2>
          <p className="text-4xl font-bold mt-2">48</p>{" "}
          {/* This will be dynamic */}
        </div>
      </div>
      {/* You can add more sections here, like recent activity logs */}
    </div>
  );
}
