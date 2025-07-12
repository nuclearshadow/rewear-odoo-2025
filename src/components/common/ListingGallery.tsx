// src/components/common/ListingGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

// Define the shape of the image object
type ImageType = {
  image_url: string;
};

type ListingGalleryProps = {
  images: ImageType[];
  title: string;
};

export default function ListingGallery({ images, title }: ListingGalleryProps) {
  // If there are no images, show a placeholder
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No Image</span>
      </div>
    );
  }

  // Use the first image as the default main image
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="aspect-square w-full relative rounded-lg overflow-hidden border">
        <Image
          src={mainImage.image_url}
          alt={`Main image of ${title}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setMainImage(image)}
              className={`relative aspect-square w-full rounded-md overflow-hidden border-2 transition-all ${
                mainImage.image_url === image.image_url
                  ? "border-blue-500 ring-2 ring-blue-500" // Highlight the active thumbnail
                  : "border-transparent hover:border-blue-400"
              }`}
            >
              <Image
                src={image.image_url}
                alt={`Thumbnail ${index + 1} of ${title}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
