// controllers/categoryController.js
import Category from "../models/categoryModel.js";

// Get all categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add new category
export const addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "Name is required" });

        const existing = await Category.findOne({ name });
        if (existing) return res.status(400).json({ error: "Category already exists" });

        const newCategory = await Category.create({ name });
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
