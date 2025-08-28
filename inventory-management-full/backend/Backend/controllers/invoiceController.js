const Inventory = require("../models/inventoryModel");
const Invoice = require("../models/invoiceModel");
const Product = require("../models/productModel");

// -------------------- Add Invoice --------------------
// -------------------- Add Invoice --------------------
// exports.addInvoice = async (req, res) => {
//   try {
//     // Find the last invoice number
//     const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
//     let newInvoiceNumber = "INV-1001"; // default starting point

//     if (lastInvoice?.invoiceNumber) {
//       const lastNumber = parseInt(lastInvoice.invoiceNumber.replace("INV-", ""), 10);
//       newInvoiceNumber = `INV-${lastNumber + 1}`;
//     }

//     const invoice = new Invoice({
//       ...req.body,
//       invoiceNumber: newInvoiceNumber, // ✅ auto-generated here
//     });

//     await invoice.save();
//     res.status(201).json(invoice);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to create invoice" });
//   }
// };

// -------------------- Add Invoice --------------------
exports.addInvoice = async (req, res) => {
  try {
    // Find the last invoice number
    const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
    let newInvoiceNumber = "INV-1001"; // default starting point

    if (lastInvoice?.invoiceNumber) {
      const lastNumber = parseInt(lastInvoice.invoiceNumber.replace("INV-", ""), 10);
      newInvoiceNumber = `INV-${lastNumber + 1}`;
    }

    // const { items, tax = 0, discount = 0, ...rest } = req.body;
    const { items, tax = 0, discountPercent: discountPercentRaw, discount, ...rest } = req.body;

// Normalize % values
const taxPercent = Number(tax) || 0;
const discountPercent = Number(discountPercentRaw ?? discount ?? 0) || 0;


    let subTotal = 0;

    // ✅ Check & deduct stock
    for (const item of items) {
      const inventoryItem = await Inventory.findOne({ product: item.productId });
      if (!inventoryItem) {
        return res
          .status(404)
          .json({ error: `Inventory not found for product ${item.productId}` });
      }

      if (inventoryItem.quantity < item.quantity) {
        return res.status(400).json({
          error: `Not enough stock for product ${item.productId}. Available: ${inventoryItem.quantity}`,
        });
      }

      // Deduct stock
      inventoryItem.quantity -= item.quantity;
      await inventoryItem.save();

      subTotal += item.quantity * item.unitPrice;
    }

    // ✅ Recalculate totals
    // const taxPercent = Number(tax) || 0;
    // const discountPercent = Number(discount) || 0;

    const taxAmount = (subTotal * taxPercent) / 100;
    const discountAmount = (subTotal * discountPercent) / 100;
    const grandTotal = subTotal + taxAmount - discountAmount;

    // ✅ Create invoice
    const invoice = new Invoice({
      ...rest,
      items,
      invoiceNumber: newInvoiceNumber,
      subTotal: subTotal.toFixed(2),
      tax: taxPercent,
      discountPercent: discountPercent,
      grandTotal: grandTotal.toFixed(2),
    });

    await invoice.save();

    res.status(201).json({
      message: "Invoice created successfully, stock updated",
      invoice,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create invoice" });
  }
};

// -------------------- Get Invoices --------------------
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate("items.productId", "name");
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate(
      "items.productId",
      "name"
    );
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.status(200).json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- Update Invoice --------------------
exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    // const { items, tax = 0, discount = 0, ...rest } = req.body;
    const { items, tax = 0, discountPercent: discountPercentRaw, discount, ...rest } = req.body;

// Normalize % values
// const taxPercent = Number(tax) || 0;
// const discountPercent = Number(discountPercentRaw ?? discount ?? 0) || 0;


    const existingInvoice = await Invoice.findById(id);
    if (!existingInvoice)
      return res.status(404).json({ error: "Invoice not found" });

    // 1. Restore previous stock
    for (const item of existingInvoice.items) {
      const inventoryItem = await Inventory.findOne({ product: item.productId });
      if (inventoryItem) {
        inventoryItem.quantity += item.quantity;
        await inventoryItem.save();
      }
    }

    // 2. Deduct new stock
    let subTotal = 0;
    for (const item of items) {
      const inventoryItem = await Inventory.findOne({ product: item.productId });
      if (!inventoryItem) {
        return res
          .status(404)
          .json({ error: `Inventory not found for product ${item.productId}` });
      }

      if (inventoryItem.quantity < item.quantity) {
        return res.status(400).json({
          error: `Not enough stock for product ${item.productId}. Available: ${inventoryItem.quantity}`,
        });
      }

      inventoryItem.quantity -= item.quantity;
      await inventoryItem.save();

      subTotal += item.quantity * item.unitPrice;
    }

    // ✅ Recalculate tax & discount as %
    const taxPercent = Number(tax) || 0;
    // const discountPercent = Number(discount) || 0;
    const discountPercent = Number(discountPercentRaw ?? discount ?? 0) || 0;

    const taxAmount = (subTotal * taxPercent) / 100;
    const discountAmount = (subTotal * discountPercent) / 100;

    const grandTotal = subTotal + taxAmount - discountAmount;

    existingInvoice.items = items;
    existingInvoice.subTotal = subTotal.toFixed(2);
    existingInvoice.tax = taxPercent;               // store % only
    existingInvoice.discountPercent = discountPercent; // store % only
    existingInvoice.grandTotal = grandTotal.toFixed(2);

    Object.assign(existingInvoice, rest);

    await existingInvoice.save();

    res.json({
      message: "Invoice updated successfully",
      invoice: existingInvoice,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- Delete Invoice --------------------
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    // Restore stock quantities on delete
    for (const item of invoice.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: item.quantity },
      });
    }

    await invoice.deleteOne();
    res.status(200).json({ message: "Invoice deleted and stock updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- Search Invoices --------------------
exports.searchInvoices = async (req, res) => {
  const { q, startDate, endDate } = req.query;

  try {
    let filter = {};

    // Text filter
    if (q) {
      filter.customerName = { $regex: q, $options: "i" };
    }

    // Date filter
    if (startDate) {
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : start;
      end.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: start, $lte: end };
    }

    const invoices = await Invoice.find(filter).sort({ createdAt: -1 });
    res.json({ invoices });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
