import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import Loading from "./Loading";
import ProductCard from "./ProductCard";
import Title from "./Title";

const RelatedProducts = ({ category, subcategory, onClick }) => {
  const { products, isLoading, error } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter(
        (item) => subcategory === item.subcategory
      );
      setRelated(productsCopy.slice(0, 10));
    }
  }, [products, category, subcategory]);

  return (
    <div className="mt-10 flex flex-col py-8 gap-4">
      <div className="text-center text-3xl py-2">
        <Title text1={`RELATED`} text2={`PRODUCTS`} />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3 justify-center items-center">
          <p>Loading...</p>
          <Loading />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {related.map((item, index) => (
            <ProductCard
              key={index}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              onClick={onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
