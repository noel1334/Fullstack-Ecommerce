import Subcategory from '../models/Subcategory.js';
import mongoose from 'mongoose';

// Create a subcategory
export const createSubcategory = async (req, res) => {
  try {
    const { name, categoryId :category } = req.body;
    console.log(category, name)

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const subcategory = new Subcategory({ name, category });
    const savedSubcategory = await subcategory.save();

    res.status(201).json({ message: 'Subcategory created successfully', subcategory: savedSubcategory });
  } catch (error) {
    console.error(`Error creating subcategory: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all subcategories
export const getSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({}).populate('category', 'name');
    res.json(subcategories);
  } catch (error) {
    console.error(`Error fetching subcategories: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSubcategoriesByCategoryId = async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Fetch subcategories from the database using the category ID
    const subcategories = await Subcategory.find({ category: categoryId });
    if (!subcategories.length) {
      return res.status(404).json({ message: "No subcategories found" });
    }
    res.status(200).json(subcategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Update a subcategory
export const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params; 
    const { name, categoryId: category } = req.body; 

    // Validate subcategory ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid subcategory ID' });
    }

    // Validate category ID if provided
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    // Find and update the subcategory
    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      id,
      { name, category },
      { new: true, runValidators: true } 
    );

    if (!updatedSubcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.status(200).json({ message: 'Subcategory updated successfully', subcategory: updatedSubcategory });
  } catch (error) {
    console.error(`Error updating subcategory: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a subcategory
export const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid subcategory ID' });
    }

    const deletedSubcategory = await Subcategory.findByIdAndDelete(id);

    if (!deletedSubcategory) return res.status(404).json({ message: 'Subcategory not found' });

    res.json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    console.error(`Error deleting subcategory: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};
