import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext.jsx";
import Title from "./Title.jsx";
import ProductCard from "./ProductCard.jsx";
import Loading from "./Loading.jsx";

const LatestCollection = () => {
  const { products, isLoading, error } = useContext(ShopContext);

  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={`LATEST`} text2={`COLLECTIONS`} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsum non
          facere obcaecati. Illum rerum aliquam doloribus, nobis modi sapiente
          recusandae accusamus necessitatibus inventore voluptatum officiis vel
          cum? Magnam, blanditiis quisquam?
        </p>
      </div>
      {/* Rendering product */}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {latestProducts.map((item, index) => (
            <ProductCard
              key={index}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestCollection;
