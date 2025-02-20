import React, { useState, useEffect, useContext } from "react";
import Title from "./Title";
import { FaImages } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { ShopContext } from "../Context/ShopContext";
import { UserContext } from "../Context/UserContext";

const AddProduct = ({ productToEdit, setProductToEdit, handleClose }) => {
  const { handleProductAdd, handleProductUpdate, fetchProducts } =
    useContext(ShopContext);
  const { BASE_URL } = useContext(UserContext);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    size: "",
    color: "",
    bestSeller: false,
    images: [],
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories and subcategories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (productToEdit) {
      setFormValues({
        name: productToEdit.name || "",
        description: productToEdit.description || "",
        price: productToEdit.price || "",
        category: productToEdit.category._id || "",
        subcategory: productToEdit.subcategory._id || "",
        size: productToEdit.size.join(", ") || "",
        color: productToEdit.color.join(", ") || "",
        bestSeller: productToEdit.bestSeller || false,
        images: [],
      });
      setImagePreviews(productToEdit.image || []);
    } else {
      setFormValues({
        name: "",
        description: "",
        price: "",
        category: "",
        subcategory: "",
        size: "",
        color: "",
        bestSeller: false,
        images: [],
      });
      setImagePreviews([]);
    }
  }, [productToEdit]);

  // Handle category change to update subcategories
  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setFormValues({ ...formValues, category: categoryId, subcategory: "" }); // Reset subcategory
    if (categoryId) {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/subcategories/${categoryId}`
        );
        setSubcategories(response.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    } else {
      setSubcategories([]); // Clear subcategories if no category selected
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const validImages = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    setFormValues({ ...formValues, images: validImages });

    // Create image previews
    const previews = validImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((file) => formData.append("image", file));
      } else if (key === "size" || key === "color") {
        formData.append(key, value.split(","));
      } else {
        formData.append(key, value);
      }
    });

    try {
      let response;
      if (productToEdit) {
        response = await axios.put(
          `${BASE_URL}/api/products/update/${productToEdit._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        handleProductUpdate(response.data);
        toast.success("Product updated successfully!");
        setImagePreviews([]);
      } else {
        response = await axios.post(
          `${BASE_URL}/api/products/create`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        handleProductAdd(response.data);
        toast.success("Product added successfully!", {
          position: "bottom-right",
        });
        setImagePreviews([]);
      }
      handleClose();
      // Clear form after submission
      setFormValues({
        name: "",
        description: "",
        price: "",
        category: "",
        subcategory: "",
        size: "",
        color: "",
        bestSeller: false,
        images: [],
      });
      setImagePreviews([]);
      setProductToEdit(null);
    } catch (error) {
      console.error(
        "Error adding product:",
        error.response?.data || error.message
      );
      toast.error(
        "Error adding product:",
        error.response?.data || error.message,
        {
          position: "bottom-right",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-slate-200 p-2">
      <div className="text-3xl">
        <Title text1={productToEdit ? "Edit" : "Add"} text2={"PRODUCT"} />
      </div>
      <form onSubmit={handleSubmit} className="space-y-1 max-w-l mx-auto">
        {/* Name and Price in horizontal layout */}
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label
              htmlFor="name"
              className="block font-medium mb-2 cursor-pointer"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
            />
          </div>
          <div className="w-1/2">
            <label
              htmlFor="price"
              className="block font-medium mb-2 cursor-pointer"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formValues.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
            />
          </div>
        </div>

        {/* Description (Full width) */}
        <div>
          <label
            htmlFor="description"
            className="block font-medium mb-2 cursor-pointer"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            required
            className="w-full min-h-28 px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
          ></textarea>
        </div>

        {/* Category and Subcategory in horizontal layout */}
        <div className="flex flex-col md:flex-row space-x-0 md:space-x-4">
          <div className="mb-4 md:mb-0 md:w-1/2">
            <label
              htmlFor="category"
              className="block font-medium mb-2 cursor-pointer"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formValues.category || productToEdit?.category?._id}
              onChange={handleCategoryChange}
              required
              className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
            >
              {productToEdit ? (
                <option value={productToEdit.category._id}>
                  {productToEdit.category.name}
                </option>
              ) : (
                <option value="">Select a category</option>
              )}
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:w-1/2">
            <label
              htmlFor="subcategory"
              className="block font-medium mb-2 cursor-pointer"
            >
              Subcategory
            </label>
            <select
              id="subcategory"
              name="subcategory"
              value={formValues.subcategory || productToEdit?.subcategory?._id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
              disabled={!formValues.category}
            >
              <option value="">Select a subcategory</option>{" "}
              {/* Ensures the default state is correct */}
              {subcategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Size and Color in horizontal layout */}
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label
              htmlFor="size"
              className="block font-medium mb-2 cursor-pointer"
            >
              Size
            </label>
            <input
              type="text"
              id="size"
              name="size"
              value={formValues.size}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
              placeholder="Enter sizes separated by commas (e.g., S,M,L)"
            />
          </div>
          <div className="w-1/2">
            <label
              htmlFor="color"
              className="block font-medium mb-2 cursor-pointer"
            >
              Color
            </label>
            <input
              type="text"
              id="color"
              name="color"
              value={formValues.color}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
              placeholder="Enter colors separated by commas (e.g., red,blue,green)"
            />
          </div>
        </div>

        {/* Best Seller Checkbox */}
        <div className="flex items-center space-x-4">
          <div className="w-1/2">
            <label
              htmlFor="bestSeller"
              className="block font-medium mb-2 cursor-pointer"
            >
              Best Seller
            </label>
            <input
              type="checkbox"
              id="bestSeller"
              name="bestSeller"
              checked={formValues.bestSeller}
              onChange={handleChange}
              className="w-4 h-4 text-blue-500 border-gray-700 rounded focus:ring-blue-500"
            />
          </div>
          {/* Images */}
          <div className="flex items-center w-1/2">
            <label
              htmlFor="images"
              className="block font-medium mb-2 cursor-pointer"
            >
              Choose Images
              <FaImages size={34} />
            </label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              onChange={handleFileChange}
              className="hidden w-full text-gray-700 border border-gray-700 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        {/* Display selected image previews */}
        {imagePreviews.length > 0 && (
          <div className="mt-4 mb-5">
            <h3 className="text-xl font-medium text-end">Selected Images:</h3>
            <div className="flex justify-end  flex-wrap space-x-2 overflow-x-auto">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`preview-${index}`}
                  className="w-16 h-16 mb-3 object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={`max-w-max bg-blue-600 text-white p-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            loading && "cursor-not-allowed"
          }`}
          disabled={loading}
        >
          {loading ? "Saving Product..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
