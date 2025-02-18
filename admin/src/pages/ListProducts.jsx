import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaEye,
  FaTimes,
} from "react-icons/fa";
import Title from "../Component/Title";
import AddProduct from "../Component/AddProduct";
import { toast } from "react-toastify";
import { ShopContext } from "../Context/ShopContext";

const ListProducts = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [productToEdit, setProductToEdit] = useState(null);
  const { products, handleProductDelete, isLoading, currency, error } =
    useContext(ShopContext);
  const listRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const newFilteredProducts = products.filter((product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(newFilteredProducts);
  }, [products, searchTerm]);

  useEffect(() => {
    const calculatePaginatation = () => {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const newPaginatedProducts = filteredProducts.slice(start, end);
      setPaginatedProducts(newPaginatedProducts);
    };

    calculatePaginatation();
  }, [currentPage, itemsPerPage, filteredProducts]);

  const confirmAndDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      handleProductDelete(id);
      toast.success("Product deleted successfully!", {
        position: "bottom-right",
        theme: "dark",
      });
    }
  };

  const handleCloseAddProduct = () => {
    setTimeout(() => {
      setShowAddProduct(false);
      setProductToEdit(null);
    }, 2000);
  };

  const scrollToTop = () => {
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-2 flex justify-center items-center">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-2 flex justify-center items-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div ref={listRef} className="min-h-screen bg-gray-900 text-white p-2">
      <div className="pb-4 text-3xl">
        {!showAddProduct && <Title text1={"PRODUCT"} text2={"LIST"} />}
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-72">
          <FaSearch className="absolute top-2 left-2 text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 w-full bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {!showAddProduct ? (
          <button
            onClick={() => {
              setProductToEdit(null);
              setShowAddProduct(true);
            }}
            className="bg-blue-950 px-4 py-1 rounded flex items-center space-x-2 hover:bg-blue-700 transition text-sm sm:text-base"
          >
            <FaPlus className="text-lg sm:text-xl" />
            <span className="hidden sm:block">Add Product</span>
          </button>
        ) : (
          <button
            onClick={() => setShowAddProduct(false)}
            className="bg-red-950 px-4 py-1 rounded flex items-center space-x-2 hover:bg-red-700 transition text-sm sm:text-base"
          >
            <FaTimes className="text-lg sm:text-xl" />
            <span className="hidden sm:block">Close</span>
          </button>
        )}
      </div>

      {showAddProduct && (
        <AddProduct
          productToEdit={productToEdit}
          setProductToEdit={setProductToEdit}
          handleClose={handleCloseAddProduct}
        />
      )}

      <div className="space-y-4">
        {paginatedProducts.length > 0 ? ( // Display only paginated products
          paginatedProducts.map((product) => (
            <div
              key={product._id}
              className="flex items-center bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <Link to={`/product/${product._id}`}>
                {product.image && product.image.length > 0 ? (
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="h-24 w-24 object-cover cursor-pointer"
                  />
                ) : (
                  <div className="h-24 w-24 bg-gray-700">
                    {/* Placeholder for missing image */}
                    No Image
                  </div>
                )}
              </Link>

              <div className="flex-1 p-4">
                <Link to={`/product/${product._id}`}>
                  <h3 className="text-lg font-bold cursor-pointer">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-400">{product.description}</p>
                <div className="mt-2">
                  <p className="text-gray-400 text-sm">
                    <strong>Price: </strong>
                    {currency + " "}
                    {product.price}
                  </p>
                  <p className="text-gray-400 text-sm">
                    <strong>Sizes:</strong>{" "}
                    {product.size ? product.size.join(", ") : "N/A"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    <strong>Colors:</strong>{" "}
                    {product.color
                      ? product.color.map((color, index) => (
                          <span
                            key={index}
                            className="inline-block w-4 h-4 rounded-full border border-gray-700 ml-1"
                            style={{ backgroundColor: color }}
                            title={color}
                          ></span>
                        ))
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-row flex-col space-y-2 sm:space-y-0 sm:space-x-2 p-4">
                <Link to={`/product/${product._id}`}>
                  <button className="bg-blue-900 p-2 rounded hover:bg-blue-700 transition w-full sm:w-auto">
                    <FaEye className="text-white" />
                  </button>
                </Link>
                <button
                  onClick={() => {
                    setProductToEdit(product);
                    setShowAddProduct(true);
                    scrollToTop();
                  }}
                  className="bg-green-900 p-2 rounded hover:bg-green-700 transition w-full sm:w-auto"
                >
                  <FaEdit className="text-white" />
                </button>
                <button
                  onClick={() => confirmAndDelete(product._id)}
                  className="bg-red-900 p-2 rounded hover:bg-red-700 transition w-full sm:w-auto"
                >
                  <FaTrash className="text-white" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No products found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`mx-1 px-3 py-1 text-sm rounded ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListProducts;
