"use client";

export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search clothes..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
