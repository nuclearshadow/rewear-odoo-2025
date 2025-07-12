"use client";

import React, { useState } from "react";
import ImageUploader from "@/components/common/ImageUploader";
import { useRouter } from "next/navigation";

const clothingCategories = [
  "Men's Clothing",
  "Women's Clothing",
  "Kids",
  "Accessories",
];

const clothingTypes = [
  "Shirt",
  "T-Shirt",
  "Jeans",
  "Dress",
  "Sweater",
  "Jacket",
  "Kurta",
  "Blazer",
];

const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL"];

const clothingConditions = ["New", "Like New", "Used", "Heavily Used"];

const AddItemPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    size: "",
    condition: "",
    tags: "",
    type: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { title, description, category, size, condition, tags, type } = form;

    if (!title || !description || !category || !size || !condition || !type) {
      setError("Please fill in all required fields.");
      return;
    }

    const imageBase64 = await Promise.all(images.map(fileToBase64));

    const payload = {
      title,
      description,
      category,
      size,
      condition,
      tags,
      type,
      images: imageBase64,
    };

    try {
      const res = await fetch("/api/v1/items", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit");

      router.push("/dashboard");
    } catch (err) {
      setError("Failed to add item.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">Add New Item</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g., Blue Denim Jacket"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select category</option>
            {clothingCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Size</label>
          <select
            name="size"
            value={form.size}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select size</option>
            {clothingSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Condition</label>
          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select condition</option>
            {clothingConditions.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Write a short description of the item..."
            className="w-full border p-2 rounded"
            rows={3}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Tags</label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="e.g., casual, denim, branded"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select type</option>
            {clothingTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <ImageUploader label="Upload Images" onChange={setImages} />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItemPage;

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
