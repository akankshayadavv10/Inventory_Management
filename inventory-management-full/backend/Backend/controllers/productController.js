// // const Product = require("../models/Product");
// import Product from "../models/productModel.js";
// import Inventory from "../models/inventoryModel.js";


// // Create new product
// exports.createProduct = async (req, res) => {
//   try {
//     const newProduct = await Product.create(req.body);
//     res.status(201).json(newProduct);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Get all products
// exports.getProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get single product by ID
// exports.getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ error: "Product not found" });
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Update product
// exports.updateProduct = async (req, res) => {
//   try {
//     const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true
//     });
//     if (!updated) return res.status(404).json({ error: "Product not found" });
//     res.json(updated);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Delete product
// export const deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Delete product
//     const deletedProduct = await Product.findByIdAndDelete(id);
//     if (!deletedProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Delete inventory linked to this product
//     await Inventory.deleteMany({ productId: id });

//     res.json({ message: "Product and related inventory deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
// exports.searchProducts = async (req, res) => {
//   const { q } = req.query;

//   if (!q || q.length < 3) {
//     return res.status(400).json({ error: "Query must be at least 3 characters long" });
//   }

//   try {
//     const products = await Product.find({
//       name: { $regex: q, $options: "i" } // case-insensitive partial match
//     });

//     res.json({ count: products.length, products });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };








// import Product from "../models/productModel.js";
// import Inventory from "../models/inventoryModel.js";

// // Create new product
// export const createProduct = async (req, res) => {
//   try {
//     const newProduct = await Product.create(req.body);
//     res.status(201).json(newProduct);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Get all products
// export const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get single product by ID
// export const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ error: "Product not found" });
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Update product
// export const updateProduct = async (req, res) => {
//   try {
//     const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true
//     });
//     if (!updated) return res.status(404).json({ error: "Product not found" });
//     res.json(updated);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Delete product + cascade delete inventory
// // Delete product + cascade delete inventory
// export const deleteProduct = async (req, res) => {
//   try {
//     const productId = req.params.id;

//     // 1. Delete the product
//     const deletedProduct = await Product.findByIdAndDelete(productId);
//     if (!deletedProduct) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // 2. Delete related inventory records
//     await Inventory.deleteMany({ product: productId });

//     res.json({ message: 'Product and related inventory deleted successfully' });
//   } catch (err) {
//     console.error('Error deleting product:', err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// // Search products
// export const searchProducts = async (req, res) => {
//   const { q, startDate, endDate } = req.query;

//   if (q && q.length < 3) {
//     return res.status(400).json({ error: "Query must be at least 3 characters long" });
//   }

//   try {
//     let filter = {};

//     // Name filter
//     if (q) {
//       filter = {
//         ...filter,
//         name: { $regex: q, $options: "i" } // case-insensitive partial match
//       };
//     }

//     // Date filter
//     if (startDate) {
//       const start = new Date(startDate);
//       const end = endDate ? new Date(endDate) : start; // single date if endDate not provided
//       // Include full day for end date
//       end.setHours(23, 59, 59, 999);

//       filter = {
//         ...filter,
//         createdAt: { $gte: start, $lte: end } // assuming Product has createdAt
//       };
//     }

//     const products = await Product.find(filter).sort({ createdAt: -1 });

//     res.json({ count: products.length, products });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };





import Product from "../models/productModel.js";
import Inventory from "../models/inventoryModel.js";

// Create new product
export const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete product + cascade delete inventory
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Delete the product
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

    // Delete related inventory records
    await Inventory.deleteMany({ product: productId });

    res.json({ message: 'Product and related inventory deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Search products
export const searchProducts = async (req, res) => {
  const { q, startDate, endDate } = req.query;

  if (q && q.length < 3) {
    return res.status(400).json({ error: "Query must be at least 3 characters long" });
  }

  try {
    let filter = {};

    // Name filter
    if (q) {
      filter = {
        ...filter,
        name: { $regex: q, $options: "i" }
      };
    }

    // Date filter
    if (startDate) {
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : start;
      end.setHours(23, 59, 59, 999);

      filter = {
        ...filter,
        createdAt: { $gte: start, $lte: end }
      };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json({ count: products.length, products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
