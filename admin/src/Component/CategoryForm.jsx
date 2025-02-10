import React, { useContext, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../Context/UserContext";

const CategoryForm = ({ onClose, onCategoryAdded, categoryToEdit }) => {
  const { BASE_URL } = useContext(UserContext);
  const [input, setInput] = useState({ name: "" });
  const [err, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    setError(null);
  };

  useEffect(() => {
    if (categoryToEdit) {
      setInput({
        name: categoryToEdit.name || "",
      });
    } else {
      setInput({
        name: "",
      });
    }
  }, [categoryToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (categoryToEdit) {
        // Update existing category
        await axios.put(
          `${BASE_URL}/api/categories/update/${categoryToEdit._id}`,
          input
        );
        toast.success("Category updated successfully!", {
          position: "bottom-right",
        });
      } else {
        // Create new category
        const response = await axios.post(
          `${BASE_URL}/api/categories/create`,
          input
        );
        const newCategory = response.data.category;
        toast.success("Category added successfully!", {
          position: "bottom-right",
        });
        onCategoryAdded(newCategory);
      }
      onClose(); // Close the form
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during submission."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4 bg-gray-200 dark:bg-gray-700 p-4 rounded-md">
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-semibold">
          {categoryToEdit ? "Edit Category" : "Add Category"}
        </span>

        <AiOutlineClose
          size={20}
          className="cursor-pointer bg-red-500 text-white rounded-full p-1"
          onClick={onClose}
        />
      </div>
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          type="text"
          name="name"
          value={input.name}
          placeholder="Category Name"
          className="w-full p-2 mb-2 border rounded-md dark:bg-gray-600 dark:text-gray-300"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        {err && <p className="text-center py-3 text-red-500">{err}</p>}
      </form>
    </div>
  );
};

export default CategoryForm;
