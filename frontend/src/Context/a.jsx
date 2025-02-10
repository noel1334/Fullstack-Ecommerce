import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { toast } from "react-toastify";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import { UserContext } from "./UserContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { BASE_URL } = useContext(UserContext);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save the cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (
    product,
    selectedColor,
    selectedSize,
    selectedImage
  ) => {
    if (product.color.length > 0 && !selectedColor) {
      toast.error("Please select a color before adding to the cart.", {
        position: "bottom-right",
      });
      return;
    }

    if (product.size.length > 0 && !selectedSize) {
      toast.error("Please select a size before adding to the cart.", {
        position: "bottom-right",
      });
      return;
    }

    if (!selectedImage) {
      toast.error("Please select an image before adding to the cart.", {
        position: "bottom-right",
      });
      return;
    }

    const quantity = 1; // Default quantity to 1

    // Log the data being sent to the backend
    console.log("Sending to backend:", {
      productId: product._id,
      selectedColor,
      selectedSize,
      selectedImage,
      price: product.price,
      quantity,
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/api/cart/add`,
        {
          productId: product._id,
          selectedColor,
          selectedSize,
          selectedImage,
          price: product.price,
          quantity,
        },
        { withCredentials: true }
      );

      toast.success(response.data.message, { position: "bottom-right" });

      // Update the cart state with the response data (cart returned from backend)
      setCart(response.data.cart);
    } catch (error) {
      console.error(
        "Error adding to cart:",
        error.response ? error.response.data : error.message
      ); // Log error response
      toast.error("Failed to add product to cart.", {
        position: "bottom-right",
      });
    }
  };
  const handleQuantityChange = async (
    id,
    operation,
    selectedColor,
    selectedSize,
    selectedImage
  ) => {
    console.log("Operation:", operation);
    console.log("ID:", id);
    console.log("Selected Color:", selectedColor);
    console.log("Selected Size:", selectedSize);
    console.log("Selected Image:", selectedImage);

    try {
      // Optimistically update the UI
      setCart((prevCart) =>
        prevCart.map((item) => {
          if (
            (item.id === id || item._id === id) &&
            (item.selectedColor || "") === (selectedColor || "") &&
            (item.selectedSize || "") === (selectedSize || "") &&
            (item.selectedImage || "") === (selectedImage || "")
          ) {
            const updatedQuantity =
              operation === "increase"
                ? item.quantity + 1
                : Math.max(1, item.quantity - 1);

            return { ...item, quantity: updatedQuantity };
          }
          return item;
        })
      );

      const response = await axiosInstance.put(
        `${BASE_URL}/api/cart/update-quantity`,
        {
          productId: id,
          selectedColor,
          selectedSize,
          selectedImage,
          operation, // Ensure the operation is sent
        },
        { withCredentials: true }
      );

      console.log("API response:", response);
      setCart(response.data.cart);
      toast.success("Cart quantity updated.", { position: "bottom-right" });
    } catch (error) {
      console.error(
        "Failed to update cart quantity:",
        error.response?.data || error.message
      );

      // Revert the optimistic UI update on error
      setCart((prevCart) =>
        prevCart.map((item) => {
          if (
            (item.id === id || item._id === id) &&
            (item.selectedColor || "") === (selectedColor || "") &&
            (item.selectedSize || "") === (selectedSize || "") &&
            (item.selectedImage || "") === (selectedImage || "")
          ) {
            const revertedQuantity =
              operation === "increase"
                ? Math.max(1, item.quantity - 1)
                : item.quantity + 1;

            return { ...item, quantity: revertedQuantity };
          }
          return item;
        })
      );

      toast.error("Failed to update quantity. Please try again.", {
        position: "bottom-right",
      });
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get("/cart", {
        withCredentials: true,
      });
      setCart(response.data.cart);
    } catch (error) {
      console.error(
        "Failed to fetch cart:",
        error.response?.data || error.message
      );
    }
  };

  const removeItem = (id, selectedColor, selectedSize, selectedImage) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.id === id &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize &&
            item.selectedImage === selectedImage
          )
      )
    );
    toast.success("Product removed from cart.", {
      position: "bottom-right",
    });
  };

  const totalCartItems = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const totalUniqueProducts = useMemo(() => cart.length, [cart]);

  const value = {
    cart,
    setCart,
    addToCart,
    handleQuantityChange,
    removeItem,
    totalCartItems,
    totalUniqueProducts,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
