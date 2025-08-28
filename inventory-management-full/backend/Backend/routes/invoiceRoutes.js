const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require("../middleware/checkPermission");

// router.post('/add',authMiddleware,checkPermission , invoiceController.addInvoice);
// router.get('/search', authMiddleware, checkPermission, invoiceController.searchInvoices);
// router.get('/',authMiddleware,checkPermission , invoiceController.getInvoices);
// router.get('/:id',authMiddleware,checkPermission , invoiceController.getInvoiceById);
// router.put('/:id',authMiddleware,checkPermission , invoiceController.updateInvoice);
// router.delete('/:id',authMiddleware,checkPermission , invoiceController.deleteInvoice);


// Add a new invoice
router.post('/add', invoiceController.addInvoice);

// Search invoices
router.get('/search', invoiceController.searchInvoices); 


// Get all invoices
router.get('/', invoiceController.getInvoices);

// Get a single invoice by ID
router.get('/:id', invoiceController.getInvoiceById);

// Update an invoice by ID
router.put('/:id', invoiceController.updateInvoice);

// Delete an invoice by ID
router.delete('/:id', invoiceController.deleteInvoice);
module.exports = router;
