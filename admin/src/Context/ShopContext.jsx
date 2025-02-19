import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { UserContext } from "./UserContext";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "NGN";
  const delivery_fees = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { BASE_URL } = useContext(UserContext);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [productsResponse, categoriesResponse, subcategoriesResponse] =
        await Promise.all([
          axios.get(`${BASE_URL}/api/products`),
          axios.get(`${BASE_URL}/api/categories`),
          axios.get(`${BASE_URL}/api/subcategories`),
        ]);

      const sortedProducts = productsResponse.data
        ? productsResponse.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        : [];

      setProducts(sortedProducts);
      setCategories(categoriesResponse.data || []);
      setSubcategories(subcategoriesResponse.data || []);
    } catch (err) {
      console.error("Error fetching data:", err.response?.data || err.message);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleProductDelete = async (id) => {
    const originalProducts = [...products];
    const updatedProducts = products.filter((product) => product._id !== id);
    setProducts(updatedProducts);

    try {
      await axios.delete(`${BASE_URL}/api/products/delete/${id}`);
      toast.success("Product deleted successfully!", {
        position: "bottom-right",
        theme: "dark",
      });
    } catch (err) {
      console.error(
        "Error deleting product:",
        err.response?.data || err.message
      );
      setError(err.message || "Failed to delete product.");

      // Rollback the UI update in case of error.  Use a function update to avoid stale state issues.
      setProducts(() => originalProducts);
      toast.error("Failed to delete product!", {
        position: "bottom-right",
        theme: "dark",
      });
    }
  };

  const handleCategoriesDelete = async (id) => {
    const originalCategories = [...categories];
    const updatedCategories = categories.filter(
      (category) => category._id !== id
    );
    setCategories(updatedCategories);

    try {
      await axios.delete(`${BASE_URL}/api/categories/delete/${id}`);
      toast.success("Category deleted successfully!", {
        position: "bottom-right",
        theme: "dark",
      });
    } catch (err) {
      console.error(
        "Error deleting product:",
        err.response?.data || err.message
      );
      setError(err.message || "Failed to delete category.");

      // Rollback the UI update in case of error
      setCategories(() => originalCategories);
      toast.error("Failed to delete category!", {
        position: "bottom-right",
        theme: "dark",
      });
    }
  };

  const handleProductAdd = (newProduct) => {
    setProducts((prevProducts) => [newProduct, ...prevProducts]);
    setTimeout(() => {
      fetchProducts();
    }, 1000);

    toast.success("Product added successfully!", {
      position: "bottom-right",
      theme: "dark",
    });
    // No need to call fetchProducts here; optimistic update is sufficient.  If you DO want to refresh, be careful about infinite loops.
  };

  const handleProductUpdate = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
    setTimeout(() => {
      fetchProducts();
    }, 1000);
    toast.success("Product updated successfully!", {
      position: "bottom-right",
      theme: "dark",
    });
  };

  const value = useMemo(
    () => ({
      products,
      categories,
      subcategories,
      setCategories,
      currency,
      delivery_fees,
      search,
      setSearch,
      showSearch,
      setShowSearch,
      isLoading,
      error,
      fetchProducts,
      handleProductDelete,
      handleProductAdd,
      handleProductUpdate,
      handleCategoriesDelete,
    }),
    [products, categories, subcategories, search, showSearch, isLoading, error]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
