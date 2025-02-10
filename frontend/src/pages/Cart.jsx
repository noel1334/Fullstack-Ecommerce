import React, { useContext, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { ShopContext } from "../Context/ShopContext";
import Title from "../Component/Title";
import TotalCart from "../Component/TotalCart";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import { UserContext } from "../Context/UserContext";

const Cart = () => {
  const { currency } = useContext(ShopContext);
  const { cart, handleQuantityChange, removeItem, setCart, fetchCart } =
    useContext(CartContext);
  const { currentUser, handleLinkClick } = useContext(UserContext);

  const navigate = useNavigate();

  const clearCart = () => {
    setCart([]);
  };

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [fetchCart, currentUser]);

  return (
    <div className="border-t pt-14 text-xs px-1 sm:px-8 lg:px-1">
      {/* Title */}
      <div className="text-2xl mb-6">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {cart.length > 0 ? (
        <>
          {/* Cart Items */}
          <div className="space-y-2">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.selectedColor}-${item.selectedSize}-${item.selectedImage}`}
                className="py-4 border-t border-b text-gray-700 grid grid-cols-[3fr_1fr_1fr] sm:grid-cols-[4fr_2fr_1fr] lg:grid-cols-[5fr_1.5fr_1fr] items-center gap-4"
              >
                {/* Product Details */}
                <div className="flex items-center gap-4 sm:gap-6">
                  <Link to={`/product/${item._id}`}>
                    <img
                      src={item.selectedImage}
                      alt={item.name}
                      className="w-16 h-20 sm:w-20 lg:w-24 object-cover rounded"
                    />
                  </Link>
                  <div>
                    <Link to={`/product/${item._id}`}>
                      <p className="text-sm sm:text-lg font-medium">
                        {item.name}
                      </p>
                    </Link>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 mt-2">
                      <p className="text-sm sm:text-lg">
                        {currency}
                        {item.price.toFixed(2)}
                      </p>
                      <div className="flex gap-3">
                        <p className="text-xs sm:text-sm lg:text-base font-medium px-3 py-1 border bg-slate-50 uppercase flex items-center justify-center">
                          {item.selectedSize || ""}
                        </p>
                        <p
                          className="text-xs text-gray-300 sm:text-sm lg:text-base font-medium px-3 py-1 border bg-slate-50 flex items-center justify-center rounded-full"
                          style={{ backgroundColor: item.selectedColor }}
                        >
                          {item.selectedColor || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center gap-2 sm:gap-4">
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item._id,
                        "decrease",
                        item.selectedColor,
                        item.selectedSize,
                        item.selectedImage
                      )
                    }
                    className="bg-gray-200 px-2 py-1 rounded-md hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-sm sm:text-lg">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item._id,
                        "increase",
                        item.selectedColor,
                        item.selectedSize,
                        item.selectedImage
                      )
                    }
                    className="bg-gray-200 px-2 py-1 rounded-md hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                {/* Total Price & Remove */}
                <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
                  <p className="text-sm sm:text-lg font-medium">
                    {currency}
                    {(item.quantity * item.price).toFixed(2)}
                  </p>
                  <button
                    onClick={() =>
                      removeItem(
                        item.id,
                        item.selectedColor,
                        item.selectedSize,
                        item.selectedImage
                      )
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Clear Cart Button */}

          {/* Total Cart Section */}
          <div className="flex justify-end my-10">
            <div className="w-full sm:w-[450px]">
              <TotalCart cart={cart} currency={currency} />
              <div className="w-full flex items-center justify-between">
                <button
                  onClick={clearCart}
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700"
                >
                  Clear Cart
                </button>

                <button
                  onClick={() => {
                    navigate("/place-order", { state: { cart } });
                    handleLinkClick();
                  }}
                  className="bg-black text-white text-sm my-8 px-8 py-3 cursor-pointer hover:bg-gray-700 active:bg-black rounded-md"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Empty Cart Message
        <div className="text-center py-10">
          <p className="text-gray-700 text-lg">Your cart is currently empty.</p>
          <button
            onClick={() => {
              navigate("/products");
              handleLinkClick();
            }}
            className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Go to Shop
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
