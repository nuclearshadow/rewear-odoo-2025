'use client';

import React, { useEffect, useState } from 'react';
import ItemCard from '@/components/ui/ItemCard';
import Pagination from '@/components/ui/Pagination';
import { useRouter } from 'next/navigation';

const MyItemsPage = () => {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch('/api/v1/items/mine');
      const data = await res.json();
      if (!data.error) {
        setItems(data);
        setFiltered(data);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const s = search.toLowerCase();
    const filteredData = items.filter(item =>
      item.title.toLowerCase().includes(s) ||
      item.description.toLowerCase().includes(s) ||
      item.category.toLowerCase().includes(s)
    );
    setFiltered(filteredData);
    setPage(1); // reset to first page
  }, [search, items]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />
      </div>

      {paginated.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map(item => (
            <div
              key={item.id}
              onClick={() => router.push(`/my-items/${item.id}`)}
              className="cursor-pointer hover:scale-[1.01] transition"
            >
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Pagination
          currentPage={page}
          totalItems={filtered.length}
          itemsPerPage={perPage}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default MyItemsPage;
