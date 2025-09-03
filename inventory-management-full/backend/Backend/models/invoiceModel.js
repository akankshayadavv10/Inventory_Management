const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    consignee: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      gstin: { type: String, default: "" },
      state: { type: String, default: "" },
      stateCode: { type: String, default: "" },
    },
    billTo: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      gstin: { type: String, default: "" },
      state: { type: String, default: "" },
      stateCode: { type: String, default: "" },
    },
    sameAsConsignee: { type: Boolean, default: true },

    gstInvoiceNo: { type: String, required: true, unique: true },
    eWayBillNo: { type: String, default: "" },
    transportation: { type: String, default: "" },

    invoiceDate: { type: Date, required: true },
    poNumber: { type: String, default: "" },
    poDate: { type: Date },

    items: [
      {
        productId: { type: String, default: "" },
        description: { type: String, required: true },
        quantity: { type: Number, required: true, min: 0 },
        unitPrice: { type: Number, required: true, min: 0 },
        gstPercent: { type: String, default: "18%" },
        totalPrice: { type: Number, required: true, min: 0 }, // lowercase t
      },
    ],

    subTotal: { type: Number, required: true, min: 0 },
    cgst: { type: Number, required: true, min: 0 },
    sgst: { type: Number, required: true, min: 0 },
    grandTotal: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["Pending", "Paid", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
