import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save the cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, selectedColor, selectedSize, selectedImage) => {
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

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize &&
          item.selectedImage === selectedImage
      );

      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;

        toast.success("Product quantity increased in the cart!", {
          position: "bottom-right",
        });

        return updatedCart;
      }

      toast.success("Product added to cart successfully!", {
        position: "bottom-right",
      });

      return [
        ...prevCart,
        {
          ...product,
          selectedColor,
          selectedSize,
          selectedImage,
          quantity: 1,
        },
      ];
    });
  };

  const handleQuantityChange = (
    id,
    operation,
    selectedColor,
    selectedSize,
    selectedImage
  ) => {
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
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
