import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { slides } from "../assets/slide";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const Hero = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const swiper = document.querySelector(".mySwiper").swiper;
    if (swiper) {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, []);

  const heroSlides = slides;

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        pagination={{
          clickable: true,
          renderBullet: (index, className) =>
            `<span class="${className} bg-gray-300 w-3 h-3 rounded-full mx-1"></span>`,
        }}
        autoplay={{ delay: 5000 }}
        loop
        className="mySwiper"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="flex flex-col sm:flex-row mt-4 border border-gray-300">
              {/* Hero Left side */}
              <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
                <div className="text-[#414141]">
                  <div className="flex items-center gap-2">
                    <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
                    <p className="font-medium text-sm md:text-base">
                      {slide.subtitle}
                    </p>
                  </div>
                  <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">
                    {slide.title}
                  </h1>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm md:text-base">
                      {slide.buttonText}
                    </p>
                    <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
                  </div>
                </div>
              </div>
              {/* Hero Right side */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full sm:w-1/2"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button
        ref={prevRef}
        className="custom-prev absolute top-1/2 left-4 -translate-y-1/2 bg-gray-600 opacity-[0.7]  p-4 hover:opacity-[1] hover:bg-gray-800 rounded-full text-white hover:text-white cursor-pointer z-10 text-lg"
      >
        <FaAngleLeft size={30} />
      </button>
      <button
        ref={nextRef}
        className="custom-next absolute top-1/2 right-4 -translate-y-1/2 bg-gray-600 opacity-[0.7]  p-4 hover:opacity-[1] hover:bg-gray-800 rounded-full text-white hover:text-white cursor-pointer z-10 text-lg"
      >
        <FaAngleRight size={30} />
      </button>
    </div>
  );
};

export default Hero;
