import React, { useContext } from "react";
import Title from "./Title";
import { ShopContext } from "../Context/ShopContext";

const TotalCart = ({ cart, currency, isWishCart = false }) => {
  const { delivery_fees } = useContext(ShopContext);

  // Calculate the subtotal price of the cart
  const getSubtotalPrice = () => {
    return cart.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  // Calculate the total price including delivery fees
  const getTotalPrice = () => {
    return getSubtotalPrice() + delivery_fees;
  };

  return (
    cart.length > 0 && (
      <div className="w-full">
        <div className="text-2xl">
          <Title
            text1={isWishCart ? "YOUR FAVORITE" : "CART"}
            text2={isWishCart ? "TOTAL PRODUCTS" : "TOTALS"}
          />
        </div>
        <div className="flex flex-col gap-2 mt-2 text-sm">
          {/* Subtotal */}
          <div className="flex justify-between">
            <p>SubTotals</p>
            <p className="">
              {currency}
              {getSubtotalPrice().toFixed(2)}
            </p>
          </div>
          <hr />
          {/* Delivery Fees */}
          <div className="flex justify-between">
            <p>Shipping Fee</p>
            <p className="">
              {currency}
              {delivery_fees.toFixed(2)}
            </p>
          </div>
          <hr />
          {/* Total */}
          <div className="flex justify-between">
            <b>Total</b>
            <b className="">
              {currency}
              {getTotalPrice().toFixed(2)}
            </b>
          </div>
        </div>
      </div>
    )
  );
};

export default TotalCart;
