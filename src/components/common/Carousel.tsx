// components/common/Carousel.tsx
"use client";

import React, { useState } from "react";

type CarouselProps = {
  images: string[];
  altText?: string[];
  height?: string; // e.g., h-64 or h-[300px]
};

export default function Carousel({ images, altText = [], height = "h-64" }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={`relative w-full overflow-hidden rounded-lg ${height}`}>
      {/* Image */}
      <img
        src={images[currentIndex]}
        alt={altText[currentIndex] || `Slide ${currentIndex + 1}`}
        className="w-full object-cover transition-all duration-500"
      />

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60"
        aria-label="Previous Slide"
      >
        ◀
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60"
        aria-label="Next Slide"
      >
        ▶
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              i === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
