const Invoice = require("../models/invoiceModel");
const Counter = require("../models/counterModel");

// Create new invoice
// Create new invoice
exports.addInvoice = async (req, res) => {
  try {
    const invoiceData = req.body;

    // ✅ This is correct
    const counter = await Counter.findOneAndUpdate(
      { name: "gstInvoice" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    invoiceData.gstInvoiceNo = `GSTInv-${String(counter.seq).padStart(3, "0")}`;
    console.log("Generated Invoice No:", invoiceData.gstInvoiceNo);

    // Check required fields
    if (
      !invoiceData.consignee?.name ||
      !invoiceData.consignee?.address ||
      !invoiceData.billTo?.name ||
      !invoiceData.billTo?.address
    ) {
      return res.status(400).json({ error: "Missing required invoice fields" });
    }

    // Ensure totals
    let subTotal = 0;
    invoiceData.items.forEach((item) => {
      item.totalPrice = Number(item.totalPrice) || (Number(item.quantity) * Number(item.unitPrice)) || 0;
      subTotal += item.totalPrice;
    });

    const gstRate = invoiceData.items.length
      ? parseFloat(invoiceData.items[0].gstPercent.replace("%", "")) || 0
      : 0;

    const cgst = (subTotal * gstRate) / 200;
    const sgst = (subTotal * gstRate) / 200;
    const grandTotal = subTotal + cgst + sgst;

    invoiceData.subTotal = subTotal;
    invoiceData.cgst = cgst;
    invoiceData.sgst = sgst;
    invoiceData.grandTotal = grandTotal;

    // Save
    const invoice = new Invoice(invoiceData);
    await invoice.save();

    res.status(201).json({ message: "Invoice created successfully", invoice });
  } catch (error) {
    console.error("Error creating invoice:", error);

    if (error.code === 11000) {
      return res.status(400).json({ error: "GST Invoice No must be unique" });
    }

    res.status(500).json({ error: "Failed to create invoice" });
  }
};

// Get all invoices (optional filters)
exports.getInvoices = async (req, res) => {
  try {
    const { customerName, gstInvoiceNo } = req.query;
    let query = {};

    if (customerName) query["consignee.name"] = { $regex: customerName, $options: "i" };
    if (gstInvoiceNo) query.gstInvoiceNo = gstInvoiceNo;

    const invoices = await Invoice.find(query).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};

// Get single invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ error: "Failed to fetch invoice" });
  }
};

// Update invoice
exports.updateInvoice = async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedInvoice) return res.status(404).json({ error: "Invoice not found" });

    res.json({ message: "Invoice updated successfully", invoice: updatedInvoice });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({ error: "Failed to update invoice" });
  }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const deleted = await Invoice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Invoice not found" });

    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({ error: "Failed to delete invoice" });
  }
};
// Get next invoice number
// Get next invoice number (preview only)
exports.getNextInvoiceNo = async (req, res) => {
  try {
    const counter = await Counter.findOne({ name: "gstInvoice" });
    const nextSeq = counter ? counter.seq : 0; // don't +1
    const nextInvoiceNo = `GSTInv-${String(nextSeq + 1).padStart(3, "0")}`;
    res.json({ nextInvoiceNo });
  } catch (error) {
    console.error("Error generating invoice number:", error);
    res.status(500).json({ error: "Failed to generate invoice number" });
  }
};

