'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Props = {
  images: string[];
};

const ImageCarousel: React.FC<Props> = ({ images }) => {
  if (!images || images.length === 0) {
    return <div className="text-center py-10">No images available</div>;
  }

  return (
    <div className="w-full rounded-xl overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        className="w-full h-[300px] sm:h-[400px] md:h-[500px]"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src}
              alt={`Slide ${index}`}
              className="w-full h-full object-contain bg-black"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageCarousel;
