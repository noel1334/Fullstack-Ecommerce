import Category from "../models/Category.js";
import mongoose from "mongoose";

// Create a category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = new Category({ name });
    const savedCategory = await category.save();
    res.status(201).json({
      message: "Category created successfully",
      category: savedCategory,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error for unique constraint
      res.status(400).json({ message: "Category already exists" });
    } else {
      console.error(`Error creating category: ${error.message}`);
      res.status(500).json({ message: "Server error" });
    }
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    console.error(`Error fetching categories: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params; 
    const { name } = req.body; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true } 
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error(`Error updating category: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(`Error deleting category: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
