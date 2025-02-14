import React, { useContext, useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { ShopContext } from "../Context/ShopContext";
import { toast } from "react-toastify";
import { UserContext } from "../Context/UserContext";
import axios from "axios";

const SubcategoryForm = ({
  onClose,
  onSubcategoryAdded,
  subcategoryToEdit,
  setSubcategoryToEdit,
}) => {
  const { categories } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const { BASE_URL } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subcategoryToEdit) {
      setName(subcategoryToEdit.name);
      setCategoryId(subcategoryToEdit.categoryId);
    } else {
      setName("");
      setCategoryId("");
    }
  }, [subcategoryToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (subcategoryToEdit) {
        // Update subcategory
        response = await axios.put(
          `${BASE_URL}/api/subcategories/${subcategoryToEdit._id}`,
          { name, categoryId }
        );
        toast.success("Subcategory updated successfully!", {
          position: "bottom-right",
          theme: "dark",
        });
        onClose();
      } else {
        // Add new subcategory
        response = await axios.post(`${BASE_URL}/api/subcategories/create`, {
          name,
          categoryId,
        });
        toast.success("Subcategory added successfully!", {
          position: "bottom-right",
          theme: "dark",
        });
      }

      // Update UI
      onSubcategoryAdded(response.data);

      // Reset form and close
      setName("");
      setCategoryId("");
      setSubcategoryToEdit(null);
    } catch (error) {
      console.error("Error saving subcategory:", error);
      toast.error("Failed to save subcategory.", {
        position: "bottom-right",
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4 bg-gray-200 dark:bg-gray-700 p-4 rounded-md">
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-semibold">
          {subcategoryToEdit ? "Edit Subcategory" : "Add Subcategory"}
        </span>
        <AiOutlineClose
          size={20}
          className="cursor-pointer bg-red-500 text-white rounded-full p-1"
          onClick={onClose}
        />
      </div>
      <form className="flex flex-col space-y-2" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Subcategory Name"
          className="w-full p-2 mb-2 border rounded-md dark:bg-gray-600 dark:text-gray-300"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
        >
          {subcategoryToEdit ? (
            <option value={subcategoryToEdit._id}>
              {subcategoryToEdit.name}
            </option>
          ) : (
            <option value="">Select Category</option>
          )}
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full p-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default SubcategoryForm;
