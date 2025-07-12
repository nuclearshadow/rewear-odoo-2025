'use client';

import React from 'react';
import ImageCarousel from '@/components/common/ImageCarousel';

type Item = {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  size: string;
  condition: string;
  tags: string[];
  images: string[];
  created_at?: string;
};

type Props = {
  item: Item;
};

const ItemCard: React.FC<Props> = ({ item }) => {
  return (
    <div className="rounded-xl shadow bg-white dark:bg-zinc-900 p-3 space-y-2">
  <ImageCarousel images={item.images} />

  <h2 className="text-lg font-semibold">{item.title}</h2>

  <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
    <p><strong>Category:</strong> {item.category}</p>
    <p><strong>Type:</strong> {item.type}</p>
    <p><strong>Size:</strong> {item.size}</p>
    <p><strong>Condition:</strong> {item.condition}</p>
    {item.tags?.length > 0 && (
      <p><strong>Tags:</strong> {item.tags.join(', ')}</p>
    )}
  </div>

  <p className="text-gray-700 dark:text-gray-200 text-xs line-clamp-3">
    {item.description}
  </p>
</div>

  );
};

export default ItemCard;
