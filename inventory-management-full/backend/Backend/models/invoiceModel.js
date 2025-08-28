
// const mongoose = require('mongoose');

// const invoiceSchema = new mongoose.Schema({
//   invoiceNumber: {
//     type: String,
//     required: [true, 'Invoice number is required'],
//     // unique: true,
//     trim: true
//   },
//   customerName: {
//     type: String,
//     required: [true, 'Customer name is required']
//   },
//   customerContact: {
//     type: String
//   },
//   items: [
//     {
//       productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product',
//         required: [true, 'Product ID is required']
//       },
//       quantity: {
//         type: Number,
//         required: [true, 'Quantity is required']
//       },
//       unitPrice: {
//         type: Number,
//         required: [true, 'Unit price is required']
//       },
//       totalPrice: {
//         type: Number,
//         required: [true, 'Total price is required']
//       }
//     }
//   ],
//   subTotal: {
//     type: Number,
//     required: [true, 'Subtotal is required']
//   },
//   tax: {
//     type: Number,
//     required: [true, 'Tax is required']
//   },
//   discount: {
//     type: Number,
//     default: 0
//   },
//   grandTotal: {
//     type: Number,
//     required: [true, 'Grand total is required']
//   },
//   paymentStatus: {
//     type: String,
//     enum: ['Paid', 'Pending', 'Partial'],
//     default: 'Pending'
//   }
// }, { timestamps: true }); // replaces createdAt manually

// module.exports = mongoose.model('Invoice', invoiceSchema);

const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: [true, 'Invoice number is required'],
    trim: true,
    unique: true   // better to enforce unique invoices
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required']
  },
  customerContact: {
    type: String
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required']
      },
      quantity: {
        type: Number,
        required: [true, 'Quantity is required']
      },
      unitPrice: {
        type: Number,
        required: [true, 'Unit price is required']
      },
      totalPrice: {
        type: Number,
        required: [true, 'Total price is required']
      }
    }
  ],
  subTotal: {
    type: Number,
    required: [true, 'Subtotal is required']
  },
  tax: {
    type: Number,   // ✅ percentage OR fixed, coming from frontend
    default: 0
  },
  discountPercent: {
    type: Number,   // ✅ percentage from frontend
    default: 0
  },
  discountAmount: {   // ✅ NEW FIELD (calculated from discountPercent)
    type: Number,
    default: 0
  },
  grandTotal: {
    type: Number,
    required: [true, 'Grand total is required']
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Partial'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
