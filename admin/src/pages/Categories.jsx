import React, { useContext, useState, useEffect, useRef } from "react";
import Title from "../Component/Title";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import CategoryForm from "../Component/CategoryForm";
import SubcategoryForm from "../Component/SubcategoryForm";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { UserContext } from "../Context/UserContext";

const Categories = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [subcategorySearchTerm, setSubcategorySearchTerm] = useState("");
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSubcategoryForm, setShowSubcategoryForm] = useState(false);
  const [subcategoryToEdit, setSubcategoryToEdit] = useState(null);
  const { categories, setCategories, handleCategoriesDelete } =
    useContext(ShopContext);
  const { BASE_URL } = useContext(UserContext);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const listRef = useRef(null);

  const confirmAndDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Category ?")) {
      handleCategoriesDelete(id);
      toast.success("Categories deleted successfully!", {
        position: "bottom-right",
        theme: "dark",
      });
    }
  };
  const handleSubCategoriesDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/api/subcategories/delete/${id}`);
      // Re-fetch the latest subcategories
      if (selectedCategory) {
        const response = await axios.get(
          `${BASE_URL}/api/subcategories/${selectedCategory._id}`
        );
        setSubcategories(response.data);
      }
    } catch (err) {
      console.error(
        "Error deleting subcategory:",
        err.response?.data || err.message
      );
      // setError(err.message || "Failed to delete subcategory.");
    } finally {
      setLoading(false);
    }
  };

  const confirmAndDeleteSub = (id) => {
    if (window.confirm("Are you sure you want to delete this SubCategory ?")) {
      handleSubCategoriesDelete(id);
      toast.success("Categories deleted successfully!", {
        position: "bottom-right",
        theme: "dark",
      });
    }
  };
  // Function to scroll to top
  const scrollToTop = () => {
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  const filteredSubcategories = subcategories.filter((subcategory) =>
    subcategory.name
      ?.toLowerCase()
      .includes(subcategorySearchTerm.toLowerCase())
  );

  const handleCategoryAdded = (newCategory) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  const handleSubcategoryAdded = async () => {
    if (selectedCategory) {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/subcategories/${selectedCategory._id}`
        );
        setSubcategories(response.data);
      } catch (error) {
        console.error("Error fetching updated subcategories:", error);
      }
    }
  };

  // Fetch subcategories when category is selected
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (selectedCategory) {
        setSubcategories([]);
        try {
          // Fetch subcategories by category ID
          const response = await axios.get(
            `${BASE_URL}/api/subcategories/${selectedCategory._id}`
          );
          setSubcategories(response.data);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };

    fetchSubcategories();
  }, [selectedCategory]);

  return (
    <div
      ref={listRef}
      className="flex flex-col md:flex-row bg-gray-100 dark:bg-gray-800 min-h-screen p-4"
    >
      {/* Categories List */}
      <div className="md:w-1/2 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4">
        <div className="text-2xl mb-3 flex flex-col md:flex-row md:justify-between">
          <Title text1={"Categories"} text2={"List"} />
        </div>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            placeholder="Search Categories"
            className="flex-grow p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300 sm:w-48" // ADD sm:w-48 or another width
            value={categorySearchTerm}
            onChange={(e) => setCategorySearchTerm(e.target.value)}
          />
          <button
            className="p-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 flex items-center justify-center"
            onClick={() => {
              setShowCategoryForm((prev) => !prev);
              setCategoryToEdit(null);
            }}
          >
            {showCategoryForm ? (
              <AiOutlineClose size={20} />
            ) : (
              <AiOutlinePlus size={20} />
            )}
          </button>
        </div>
        {showCategoryForm && (
          <CategoryForm
            onClose={() => setShowCategoryForm(false)}
            onCategoryAdded={handleCategoryAdded}
            categoryToEdit={categoryToEdit}
            setCategoryToEdit={setCategoryToEdit}
          />
        )}
        <ul>
          {filteredCategories.map((category) => (
            <div
              className="flex w-full justify-between items-center"
              key={category._id}
            >
              <li
                onClick={() => setSelectedCategory(category)}
                className={`w-full flex items-center justify-between gap-6 cursor-pointer p-2 rounded-md mb-2 mr-2  ${
                  selectedCategory?.id === category.id
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {category.name}
              </li>
              <div className="flex items-start gap-2 justify-center">
                <span
                  onClick={() => {
                    setShowCategoryForm(true);
                    setCategoryToEdit(category);
                    scrollToTop();
                  }}
                  className="bg-lime-600 rounded-full p-1 cursor-pointer"
                >
                  <FaEdit />
                </span>
                <span
                  onClick={() => confirmAndDelete(category._id)}
                  className="bg-red-600 rounded-full p-1 cursor-pointer"
                >
                  <FaTrash />
                </span>
              </div>
            </div>
          ))}
        </ul>
      </div>

      {/* Subcategories */}
      <div className="mt-4 md:mt-0 md:w-2/3 md:ml-4 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4">
        <div className="text-2xl mb-3 dark:text-white flex flex-col md:flex-row md:justify-between">
          <Title
            text1={
              selectedCategory
                ? `${selectedCategory.name} - Subcategories`
                : "Select a Category"
            }
            text2={"List"}
          />
        </div>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            placeholder="Search Subcategories"
            className="flex-grow p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300 sm:w-48" // ADD sm:w-48 or another width
            value={subcategorySearchTerm}
            onChange={(e) => setSubcategorySearchTerm(e.target.value)}
          />
          <button
            className="p-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 flex items-center justify-center"
            onClick={() => {
              setShowSubcategoryForm((prev) => {
                if (!prev) setSubcategoryToEdit(null);
                return !prev;
              });
            }}
          >
            {showSubcategoryForm ? (
              <AiOutlineClose size={20} />
            ) : (
              <AiOutlinePlus size={20} />
            )}
          </button>
        </div>
        {showSubcategoryForm && (
          <SubcategoryForm
            onClose={() => setShowSubcategoryForm(false)}
            onSubcategoryAdded={handleSubcategoryAdded}
            subcategoryToEdit={subcategoryToEdit}
            setSubcategoryToEdit={setSubcategoryToEdit}
          />
        )}

        <ul>
          {selectedCategory ? (
            filteredSubcategories.length > 0 ? (
              filteredSubcategories.map((subcategory) => (
                <div
                  className="flex w-full justify-between items-center"
                  key={subcategory._id}
                >
                  <li className="w-full p-2 rounded-md mb-2 mr-2 flex items-center justify-between gap-6 bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
                    {subcategory.name}
                  </li>
                  <div className="flex items-start gap-2 justify-center">
                    <span
                      onClick={() => {
                        setShowSubcategoryForm(true);
                        setSubcategoryToEdit(subcategory);
                        scrollToTop();
                      }}
                      className="bg-lime-600 rounded-full p-1 cursor-pointer"
                    >
                      <FaEdit />
                    </span>

                    <span
                      onClick={() => confirmAndDeleteSub(subcategory._id)}
                      className="bg-red-600 rounded-full p-1 cursor-pointer"
                      disabled={loading}
                    >
                      <FaTrash />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No subcategories under this category selected.
              </p>
            )
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No category selected.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Categories;
