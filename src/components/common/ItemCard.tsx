// src/components/common/ItemCard.tsx

import Image from "next/image";
import Link from "next/link";

// First, we define a "type" for the data this component expects.
// This is great for TypeScript to catch errors.
// It must match the mock data we created in page.tsx
export type Item = {
  id: string;
  title: string;
  points_cost: number;
  item_images: { image_url: string }[];
};

// Next, we define the props for our component
type ItemCardProps = {
  item: Item;
};

// Finally, we define the component itself.
export default function ItemCard({ item }: ItemCardProps) {
  // Use a fallback image in case an item has no images.
  // The "?." is "optional chaining" - it prevents an error if item_images is missing.
  const imageUrl = item.item_images?.[0]?.image_url || "/placeholder.svg";

  return (
    // The entire card is a link to the item's detail page.
    // The `group` class allows us to style children on hover (e.g., zoom the image).
    <Link
      href={`/items/${item.id}`}
      className="border rounded-lg overflow-hidden shadow-sm group hover:shadow-lg transition-shadow duration-300"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-gray-100">
        <Image
          src={imageUrl}
          alt={item.title}
          fill // This makes the image fill the container div
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
        />
      </div>

      {/* Info Container */}
      <div className="p-4 bg-white">
        <h3 className="font-semibold text-gray-800 truncate" title={item.title}>
          {item.title}
        </h3>
        <p className="text-gray-500 mt-1">{item.points_cost} Points</p>
      </div>
    </Link>
  );
}
