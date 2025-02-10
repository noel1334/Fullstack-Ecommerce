import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { toast } from "react-toastify";

export const WishCartContext = createContext();

export const WishCartProvider = ({ children }) => {
  const [wishCart, setWishCart] = useState(() => {
    const savedCart = localStorage.getItem("wishCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save the cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishCart", JSON.stringify(wishCart));
  }, [wishCart]);

  const addToWishCart = (
    product,
    selectedColor,
    selectedSize,
    selectedImage
  ) => {
    if (product.color.length > 0 && !selectedColor) {
      toast.error(
        "Please select a color before adding to the wish cart list.",
        {
          position: "bottom-right",
        }
      );
      return;
    }

    if (product.size.length > 0 && !selectedSize) {
      toast.error("Please select a size before adding to the wish cart list.", {
        position: "bottom-right",
      });
      return;
    }

    if (!selectedImage) {
      toast.error(
        "Please select an image before adding to the wish cart list..",
        {
          position: "bottom-right",
        }
      );
      return;
    }

    setWishCart((prevCart) => {
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

        toast.success("Product quantity increased in the wish cart List!", {
          position: "bottom-right",
        });

        return updatedCart;
      }

      toast.success("Product added to wish cart list successfully!", {
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
    setWishCart((prevCart) =>
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
    setWishCart((prevCart) =>
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
    toast.success("Product removed from Wish cart List.", {
      position: "bottom-right",
    });
  };

  const totalWishCartItems = useMemo(() => {
    return wishCart.reduce((total, item) => total + item.quantity, 0);
  }, [wishCart]);

  const totalWishUniqueProducts = useMemo(() => wishCart.length, [wishCart]);

  const value = {
    wishCart,
    setWishCart,
    addToWishCart,
    handleQuantityChange,
    removeItem,
    totalWishCartItems,
    totalWishUniqueProducts,
  };

  return (
    <WishCartContext.Provider value={value}>
      {children}
    </WishCartContext.Provider>
  );
};

export const useWishCart = () => useContext(WishCartContext);
