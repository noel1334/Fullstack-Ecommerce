import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";

const ProductCard = ({ id, image, name, price, onClick }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link
      to={`/product/${id}`}
      className="flex flex-col justify-between bg-white border border-gray-200 rounded-lg p-4 text-gray-700 hover:shadow-lg transition-shadow duration-200 h-full"
      onClick={onClick} // Trigger the onClick function when the card is clicked
    >
      <div className="overflow-hidden h-40 flex items-center border rounded justify-center">
        <img
          src={image[0]}
          alt={name}
          className="hover:scale-110 transition-transform duration-300 ease-in-out object-cover h-full w-full"
        />
      </div>
      <div className="mt-4">
        <p className="text-sm font-semibold mb-2">{name}</p>
        <p className="text-sm font-medium">
          {currency}
          {price}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
