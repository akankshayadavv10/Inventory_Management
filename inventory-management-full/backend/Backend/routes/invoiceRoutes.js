const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

// ✅ Create new invoice
// ✅ Create new invoice
router.post("/add", invoiceController.addInvoice);

// ✅ Get next invoice number (put this BEFORE :id)
router.get("/next-no", invoiceController.getNextInvoiceNo);

// ✅ Get all invoices
router.get("/", invoiceController.getInvoices);

// ✅ Get single invoice by ID
router.get("/:id", invoiceController.getInvoiceById);

// ✅ Update invoice
router.put("/:id", invoiceController.updateInvoice);

// ✅ Delete invoice
router.delete("/:id", invoiceController.deleteInvoice);




module.exports = router;
