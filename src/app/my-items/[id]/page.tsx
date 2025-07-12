'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ImageCarousel from '@/components/common/ImageCarousel';

const ItemDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      const res = await fetch(`/api/v1/items/${id}`);
      const data = await res.json();
      if (!data.error) setItem(data);
    };
    if (id) fetchItem();
  }, [id]);

  if (!item) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="rounded-xl shadow-lg bg-white p-6">
        <div className="mb-6">
          {item.images?.length > 0 && (
            <ImageCarousel images={item.images} />
          )}
        </div>

        <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
        <p className="text-gray-600 mb-4">{item.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <span className="font-semibold">Category:</span> {item.category}
          </div>
          <div>
            <span className="font-semibold">Type:</span> {item.type}
          </div>
          <div>
            <span className="font-semibold">Size:</span> {item.size}
          </div>
          <div>
            <span className="font-semibold">Condition:</span> {item.condition}
          </div>
          <div className="sm:col-span-2">
            <span className="font-semibold">Tags:</span>{' '}
            {item.tags?.length ? item.tags.join(', ') : 'None'}
          </div>
        </div>

        {/* Static Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
            Request Swap
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            Redeem with Points
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;
