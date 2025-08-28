// controllers/lowStockController.js
const Inventory = require("../models/inventoryModel");

exports.getLowStockItems = async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lt: ["$quantity", "$minQuantity"] }
    });

    res.status(200).json(lowStockItems);
  } catch (error) {
    console.error("Error fetching low stock items:", error);
    res.status(500).json({ message: "Error fetching low stock items", error });
  }
};
