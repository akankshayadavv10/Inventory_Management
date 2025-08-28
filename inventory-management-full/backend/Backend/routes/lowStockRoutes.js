// routes/lowStockRoutes.js
const express = require("express");
const router = express.Router();
const { getLowStockItems } = require("../controllers/lowStockController");

router.get("/", getLowStockItems);

module.exports = router;
