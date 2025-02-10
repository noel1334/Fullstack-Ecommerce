import React, { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../Context/ShopContext.jsx";
import Title from "./Title.jsx";
import ProductCard from "./ProductCard.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Loading from "./Loading.jsx";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const BestSeller = () => {
  const { products, isLoading, error } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const swiperRef = useRef(null);

  useEffect(() => {
    const bestProducts = products.filter((item) => item.bestSeller === true);
    const limitedBestProducts = bestProducts.slice(0, 15);
    // console.log(limitedBestProducts);
    setBestSeller(limitedBestProducts);
  }, [products]);

  const handlePrev = () => {
    swiperRef.current.swiper.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current.swiper.slideNext();
  };

  return (
    <div className="py-10">
      <div className="text-center text-3xl py-8">
        <Title text1={`BEST`} text2={`SELLERS`} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover our most popular products loved by customers worldwide.
        </p>
      </div>
      {isLoading ? (
        <div className="flex flex-col gap-3 justify-center items-center ">
          <p>Loading...</p>
          <Loading />
        </div>
      ) : error ? (
        // Show error message if there's an error
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
        </div>
      ) : (
        <div className="relative">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination, Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{
              clickable: true,
              renderBullet: (index, className) =>
                `<span class="${className} bg-gray-300 w-3 h-3 rounded-full mx-1"></span>`,
            }}
            loop
            spaceBetween={20}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
            className="w-full"
          >
            {bestSeller.map((item) => (
              <SwiperSlide key={item._id}>
                <ProductCard
                  id={item._id}
                  name={item.name}
                  image={item.image}
                  price={item.price}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="custom-prev absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-600 opacity-[0.7]  p-4 hover:opacity-[1] hover:bg-gray-800 rounded-full text-white hover:text-white cursor-pointer z-10 text-lg"
          >
            <FaAngleLeft size={22} />
          </button>
          <button
            onClick={handleNext}
            className="custom-next absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-600 opacity-[0.7]  p-4 hover:opacity-[1] hover:bg-gray-800 rounded-full text-white hover:text-white cursor-pointer z-10 text-lg"
          >
            <FaAngleRight size={22} />
          </button>
        </div>
      )}
    </div>
  );
};

export default BestSeller;
