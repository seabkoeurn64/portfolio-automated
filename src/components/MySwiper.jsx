import React from "react";
import { Swiper, SwiperSlide } from "swiper/react"; // Swiper & SwiperSlide come from react
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Only import modules from 'swiper/modules'
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const slides = [
  { id: 1, title: "Slide 1", description: "This is the first slide." },
  { id: 2, title: "Slide 2", description: "This is the second slide." },
  { id: 3, title: "Slide 3", description: "This is the third slide." },
];

const MySwiper = () => (
  <div className="w-full max-w-4xl mx-auto mt-10">
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl flex flex-col items-center justify-center h-64">
            <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
            <p className="text-gray-200">{slide.description}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);

export default MySwiper;
