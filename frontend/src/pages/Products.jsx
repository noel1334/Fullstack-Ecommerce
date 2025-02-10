import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import { FaAngleRight } from "react-icons/fa";
import Title from "../Component/Title";
import ProductCard from "../Component/ProductCard";
import Loading from "../Component/Loading";
import { UserContext } from "../Context/UserContext";

const Products = () => {
  const {
    products,
    categories = [],
    subcategories = [],
    isLoading,
    error,
    search,
    setSearch,
  } = useContext(ShopContext);
  const { handleLinkClick } = useContext(UserContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortOption, setSortOption] = useState("relevant");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    let filtered = [...products];

    // Apply category filter if selected categories exist
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        (product) =>
          product.category?.name &&
          selectedCategories.includes(product.category.name)
      );
    }

    // Apply type filter if selected types exist
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(
        (product) =>
          product.subcategory?.name &&
          selectedTypes.includes(product.subcategory.name)
      );
    }

    // Apply sorting based on price
    if (sortOption === "low-high") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "high-low") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }

    // Apply search filter
    if (search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Update filtered products
    setFilterProducts(filtered);
  }, [products, selectedCategories, selectedTypes, sortOption, search]);

  // Pagination Logic
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filterProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Calculate total pages
  const totalPages = Math.ceil(filterProducts.length / itemsPerPage);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((item) => item !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleTypeChange = (type) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((item) => item !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 top-10 bg-slate-200 bg-opacity-50 z-50 flex justify-center items-center cursor-not-allowed">
          <div className="opacity-100">
            <Loading />
          </div>
        </div>
      )}

      <div
        className={`flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t ${
          isLoading ? "opacity-70 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="min-w-60 relative sm:sticky sm:top-20 bg-white z-20 sm:h-screen ">
          <p
            onClick={() => setShowFilter(!showFilter)}
            className="my-2 text-xl flex items-center cursor-pointer gap-2"
          >
            FILTERS
            <FaAngleRight
              size={10}
              className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            />
          </p>

          <div
            className={`border border-gray-300 pl-5 py-3 mt-6 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">CATEGORIES</p>
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
              <div className="flex flex-col gap-2 text-sm font-light text-gray-700 custom-scrollbar overflow-auto max-h-52">
                {categories &&
                  categories.length > 0 &&
                  categories.map((category) => (
                    <label
                      key={category._id}
                      className="flex gap-2 items-center cursor-pointer"
                    >
                      <input
                        className="w-3 cursor-pointer"
                        type="checkbox"
                        value={category.name}
                        checked={selectedCategories.includes(category.name)}
                        onChange={() => handleCategoryChange(category.name)}
                      />
                      {category.name}
                    </label>
                  ))}
              </div>
            )}
          </div>

          <div
            className={`border border-gray-300 pl-5 py-3 my-5 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">TYPE</p>
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
              <div className="flex flex-col gap-2 text-sm font-light text-gray-700 custom-scrollbar overflow-auto max-h-52">
                {subcategories &&
                  subcategories.length > 0 &&
                  subcategories.map((type) => (
                    <label
                      key={type._id}
                      className="flex gap-2 items-center cursor-pointer"
                    >
                      <input
                        className="w-3 cursor-pointer"
                        type="checkbox"
                        value={type.name}
                        checked={selectedTypes.includes(type.name)}
                        onChange={() => handleTypeChange(type.name)}
                      />
                      {type.name}
                    </label>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between text-base relative sm:sticky sm:top-20 bg-white z-20 sm:text-2xl mb-4">
            <Title text1={"ALL"} text2={"PRODUCTS"} />
            <input
              type="text"
              className="border-2 border-gray-300 px-2 py-1 text-sm hidden sm:hidden md:hidden lg:block"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="border-2 border-gray-300 text-sm px-2"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low-High</option>
              <option value="high-low">Sort by: High-Low</option>
            </select>
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
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gapy-6">
                {currentProducts.map((item, index) => (
                  <ProductCard
                    onClick={() => handleLinkClick()}
                    key={index}
                    id={item._id}
                    name={item.name}
                    image={item.image}
                    price={item.price}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center gap-4 mt-6">
                <button
                  onClick={() => {
                    handlePageChange(currentPage - 1);
                    handleLinkClick();
                  }}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md text-gray-700"
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => {
                    handlePageChange(currentPage + 1);
                    handleLinkClick();
                  }}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-md text-gray-700"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
