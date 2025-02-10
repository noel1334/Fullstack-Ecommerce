import React, { createContext, useState, useEffect, useMemo } from "react";
import axiosInstance from "../utils/axiosInstance";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "$";
  const delivery_fees = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products, categories, and subcategories
  const fetchProducts = async () => {
    try {
      const [productsResponse, categoriesResponse, subcategoriesResponse] =
        await Promise.all([
          axiosInstance.get("products"),
          axiosInstance.get("categories"),
          axiosInstance.get("subcategories"),
        ]);

      // Sort products by createdAt in descending order (most recent first)
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
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to handle product deletion
  const handleProductDelete = async (id) => {
    const updatedProducts = products.filter((product) => product._id !== id);
    setProducts(updatedProducts);

    try {
      await axiosInstance.delete(`products/delete/${id}`);
    } catch (err) {
      console.error(
        "Error deleting product:",
        err.response?.data || err.message
      );
      setError(err.message || "Failed to delete product.");

      // Rollback the UI update in case of error
      setProducts((prevProducts) => [
        ...prevProducts,
        products.find((p) => p._id === id),
      ]);
    }
  };
  // Function to handle Categories deletion
  const handleCategoriesDelete = async (id) => {
    const updatedCategories = categories.filter(
      (category) => category._id !== id
    );
    setCategories(updatedCategories);

    try {
      await axiosInstance.delete(`categories/delete/${id}`);
    } catch (err) {
      console.error(
        "Error deleting product:",
        err.response?.data || err.message
      );
      setError(err.message || "Failed to delete product.");

      // Rollback the UI update in case of error
      setProducts((prevProducts) => [
        ...prevProducts,
        products.find((p) => p._id === id),
      ]);
    }
  };

  // Handle adding a product to the list
  const handleProductAdd = (newProduct) => {
    setProducts((prevProducts) => [newProduct, ...prevProducts]);
    fetchProducts((fetchedProducts) => {
      setProducts(fetchedProducts);
    });
  };

  // Memoize the context value to avoid unnecessary re-renders
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
      handleCategoriesDelete,
    }),
    [products, categories, subcategories, search, showSearch, isLoading, error]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
