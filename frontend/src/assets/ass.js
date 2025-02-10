import { createContext, useState, useEffect, useMemo } from "react";
import productsData from "../assets/dummyData";
import categoryData from "../assets/dummyCat";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fees = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage during initialization
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save the cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (Math.random() > 0.8) {
        throw new Error("Failed to fetch products.");
      }

      setProducts(productsData);
      setCategories(categoryData.categories);
      setTypes(categoryData.types);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product, selectedColor, selectedSize) => {
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

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
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
          quantity: 1,
        },
      ];
    });
  };

  const handleQuantityChange = (id, operation, selectedColor, selectedSize) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (
          (item.id === id || item._id === id) &&
          (item.selectedColor || "") === (selectedColor || "") &&
          (item.selectedSize || "") === (selectedSize || "")
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

  const removeItem = (id, selectedColor, selectedSize) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.id === id &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
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
    products,
    categories,
    types,
    currency,
    delivery_fees,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    isLoading,
    error,
    fetchProducts,
    addToCart,
    handleQuantityChange,
    removeItem,
    cart,
    setCart,
    totalCartItems,
    totalUniqueProducts,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
