"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/ui/SearchBar";
import Pagination from "@/components/ui/Pagination";
import ItemCard from "@/components/ui/ItemCard";
import { useRouter } from 'next/navigation';

const categories = [
    "All",
  "Men's Clothing",
  "Women's Clothing",
  "Kids",
  "Accessories",
];

const types = [
    "All",
  "Shirt",
  "T-Shirt",
  "Jeans",
  "Dress",
  "Sweater",
  "Jacket",
  "Kurta",
  "Blazer",
];

const sizes = ["All","XS", "S", "M", "L", "XL", "XXL"];

const conditions = ["All","New", "Like New", "Used", "Heavily Used"];
const itemsPerPage = 4;

export default function BrowsePage() {
  const [clothes, setClothes] = useState([]);
  const [filteredClothes, setFilteredClothes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // ✅ Fetch clothes from Next.js API route
  useEffect(() => {
    async function fetchClothes() {
      try {
        const res = await fetch("/api/v1/items"); // ✅ THIS is correct for Next.js API route
        const data = await res.json();
        setClothes(data);
        console.log(data)
        setFilteredClothes(data);
      } catch (error) {
        console.error("Error fetching clothes:", error);
      }
    }

    fetchClothes();
  }, []);
  const router = useRouter();

  // ✅ Filter logic
  useEffect(() => {
    let result = clothes;

    if (selectedCategory !== "All") result = result.filter(item => item.category === selectedCategory);
    if (selectedType !== "All") result = result.filter(item => item.type === selectedType);
    if (selectedSize !== "All") result = result.filter(item => item.size === selectedSize);
    if (selectedCondition !== "All") result = result.filter(item => item.condition === selectedCondition);

    if (searchQuery.trim()) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredClothes(result);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedType, selectedSize, selectedCondition, clothes]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredClothes.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-[90vh] bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Browse Clothes</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <button
          className="text-sm text-blue-600 underline sm:hidden"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters */}
      <div className={`grid gap-4 sm:grid-cols-4 ${showFilters ? "block" : "hidden"} sm:block mb-6`}>
        <select className="p-2 border rounded" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <select className="p-2 border rounded" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select className="p-2 border rounded" value={selectedSize} onChange={e => setSelectedSize(e.target.value)}>
          {sizes.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select className="p-2 border rounded" value={selectedCondition} onChange={e => setSelectedCondition(e.target.value)}>
          {conditions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Item List */}
    {currentItems.length > 0 ? (
  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {currentItems.map(item => (
      <div key={item.id}>
        <ItemCard item={item} onClick={() => router.push(`/my-items/${item.id}`)} />
        <div className="mt-2 text-center">
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
            onClick={() => router.push(`/my-items/${item.id}`)}
          >
            View Item
          </button>
        </div>
      </div>
    ))}
  </div>
) : (
  <p className="text-center text-gray-500 text-lg mt-12">No clothes found matching your criteria.</p>
)}

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalItems={filteredClothes.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
