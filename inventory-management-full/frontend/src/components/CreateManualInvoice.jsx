import React, { useState, useEffect} from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  IconButton,
  Checkbox,
  Divider,
  Box,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

export default function CreateManualInvoice({ open, onClose }) {
  const [invoice, setInvoice] = useState({
    consignee: { name: "", address: "", gstin: "", state: "", stateCode: "" },
    billTo: { name: "", address: "", gstin: "", state: "", stateCode: "" },
    sameAsConsignee: true,
    gstInvoiceNo: "",
    eWayBillNo: "",
    transportation: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    poNumber: "",
    poDate: new Date().toISOString().split("T")[0],
    items: [
      {
        productId: "",
        description: "",
        quantity: 0,
        unitPrice: 0,
        gstPercent: "18%",
        totalPrice: 0,
      },
    ],
  });
const [invoiceNo, setInvoiceNo] = useState("");

  const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchInvoiceNo = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/invoices/next-no");
      setInvoiceNo(res.data.nextInvoiceNo); // use backend response
    } catch (err) {
      console.error("Error fetching invoice no:", err);
    }
  };

  fetchInvoiceNo();
}, []);



  // Add Item
  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { productId: "", description: "", quantity: 0, unitPrice: 0, gstPercent: "18%", totalPrice: 0 },
      ],
    }));
  };

  // Remove Item
  const removeItem = (index) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Update Item
  const handleItemChange = (index, field, value) => {
    setInvoice((prev) => {
      const items = [...prev.items];
      items[index][field] = value;

      const qty = Number(items[index].quantity) || 0;
      const rate = Number(items[index].unitPrice) || 0;
      items[index].totalPrice = qty * rate;

      return { ...prev, items };
    });
  };

  // Totals
  const subtotal = invoice.items.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0);
  const gstRate = invoice.items.length
    ? parseFloat(invoice.items[0].gstPercent.replace("%", "")) || 0
    : 0;
  const cgst = (subtotal * gstRate) / 200;
  const sgst = (subtotal * gstRate) / 200;
  const grandTotal = subtotal + cgst + sgst;

  // Amount in words
  const numberToWords = (num) => (num ? num.toLocaleString("en-IN") + " Rupees" : "Zero Rupees");

  // Save Invoice
 const handleSave = async () => {
  try {
    setLoading(true);

    // Ensure Bill To is valid
    const billToData = invoice.sameAsConsignee
      ? { ...invoice.consignee }
      : {
          name: invoice.billTo.name || "",
          address: invoice.billTo.address || "",
          gstin: invoice.billTo.gstin || "",
          state: invoice.billTo.state || "",
          stateCode: invoice.billTo.stateCode || "",
        };

    // Validate required fields
    if (!invoice.consignee.name || !invoice.consignee.address || !billToData.name || !billToData.address) {
      alert("Consignee and Bill To Name & Address are required!");
      setLoading(false);
      return;
    }

    const payload = {
      ...invoice,
      billTo: billToData,
      items: invoice.items.map((item) => ({
        productId: item.productId || "",
        description: item.description?.trim() || "N/A",
        quantity: Number(item.quantity) || 1,
        unitPrice: Number(item.unitPrice) || 0,
        gstPercent: item.gstPercent || "18%",
        totalPrice: Number(item.totalPrice) || 0,
      })),
      subTotal: subtotal,
      cgst,
      sgst,
      grandTotal,
    };

    // ❌ Remove gstInvoiceNo, backend generates it
// remove gstInvoiceNo before sending
// remove gstInvoiceNo before sending
delete payload.gstInvoiceNo;

const response = await axios.post(
  "http://localhost:5000/api/invoices/add",
  payload
);

// update local form with the actual saved invoice number (so user sees final number)
if (response?.data?.invoice?.gstInvoiceNo) {
  setInvoice(prev => ({ ...prev, gstInvoiceNo: response.data.invoice.gstInvoiceNo }));
}

console.log("Invoice saved:", response.data);
alert("Invoice created successfully!");

    setLoading(false);
    onClose();
  } catch (error) {
    alert(error.response?.data?.error || "Failed to save invoice!");
    setLoading(false);
  }
};




    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { maxHeight: "95vh" } }}
      >
        <DialogTitle>Manual Invoice</DialogTitle>
        <DialogContent dividers>
          {/* Company Header */}
          <Typography variant="h6" align="center">
            AKSHAY ENTERPRISES AND LAND DEVELOPERS
          </Typography>
          <Typography align="center">akshay@example.com | 7774899641</Typography>
          <Typography align="center" gutterBottom>
            Gat No-1771, Jakate Mala, Mali Mala, Talegaon Dhamdere, Tal-Shirur,
            Dist, Pune - 412208 <br />
            GSTIN: 27AARPA1234F1Z5
          </Typography>
          <Typography align="center" fontWeight="bold" gutterBottom>
            TAX INVOICE
          </Typography>

          {/* Consignee / Bill To */}
       <Grid container spacing={2} wrap="nowrap">
  {/* Consignee Section */}
  <Grid item xs={6}>
    <Typography variant="subtitle2" gutterBottom>
      Consignee (Ship To)
    </Typography>
    <TextField
      label="Name"
      fullWidth
      size="small"
      value={invoice.consignee.name}
      onChange={(e) =>
        setInvoice({
          ...invoice,
          consignee: { ...invoice.consignee, name: e.target.value },
        })
      }
    />
    <TextField
      label="Address"
      fullWidth
      size="small"
      sx={{ mt: 1 }}
      value={invoice.consignee.address}
      onChange={(e) =>
        setInvoice({
          ...invoice,
          consignee: { ...invoice.consignee, address: e.target.value },
        })
      }
    />
    <TextField
      label="GSTIN"
      fullWidth
      size="small"
      sx={{ mt: 1 }}
      value={invoice.consignee.gstin}
      onChange={(e) =>
        setInvoice({
          ...invoice,
          consignee: { ...invoice.consignee, gstin: e.target.value },
        })
      }
    />
    <TextField
      label="State"
      fullWidth
      size="small"
      sx={{ mt: 1 }}
      value={invoice.consignee.state}
      onChange={(e) =>
        setInvoice({
          ...invoice,
          consignee: { ...invoice.consignee, state: e.target.value },
        })
      }
    />
    <TextField
      label="State Code"
      fullWidth
      size="small"
      sx={{ mt: 1 }}
      value={invoice.consignee.stateCode}
      onChange={(e) =>
        setInvoice({
          ...invoice,
          consignee: { ...invoice.consignee, stateCode: e.target.value },
        })
      }
    />
  </Grid>

  {/* Bill To Section */}
  <Grid item xs={6}>
    <Box display="flex" alignItems="center" mb={1}>
      <Checkbox
        checked={invoice.sameAsConsignee}
        onChange={(e) =>
          setInvoice({
            ...invoice,
            sameAsConsignee: e.target.checked,
            billTo: e.target.checked ? { ...invoice.consignee } : {},
          })
        }
      />
      <Typography variant="subtitle2">Bill To (Same as Consignee)</Typography>
    </Box>

    <TextField
      label="Name"
      fullWidth
      size="small"
      value={invoice.billTo.name || ""}
      onChange={(e) =>
        setInvoice({
          ...invoice,
          billTo: { ...invoice.billTo, name: e.target.value },
        })
      }
    />
    <TextField
      label="Address"
      fullWidth
      size="small"
      sx={{ mt: 1 }}
      value={invoice.billTo.address || ""}
      onChange={(e) =>
        setInvoice({
          ...invoice,
          billTo: { ...invoice.billTo, address: e.target.value },
        })
      }
    />
    <TextField
      label="GSTIN"
      fullWidth
      size="small"
      sx={{ mt: 1 }}
      value={invoice.billTo.gstin || ""}
      onChange={(e) =>
        setInvoice({
          ...invoice,
          billTo: { ...invoice.billTo, gstin: e.target.value },
        })
      }
    />
    <TextField
      label="State"
      fullWidth
      size="small"
      sx={{ mt: 1 }}
      value={invoice.billTo.state || ""}
      onChange={(e) =>
        setInvoice({
          ...invoice,
          billTo: { ...invoice.billTo, state: e.target.value },
        })
      }
    />
    <TextField
      label="State Code"
      fullWidth
      size="small"
      sx={{ mt: 1 }}
      value={invoice.billTo.stateCode || ""}
      onChange={(e) =>
        setInvoice({
          ...invoice,
          billTo: { ...invoice.billTo, stateCode: e.target.value },
        })
      }
    />
  </Grid>
</Grid>


          {/* Invoice Details */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={3}>
  <TextField
  label="Invoice No"
  value={invoiceNo}
  fullWidth
  margin="normal"
  InputProps={{ readOnly: true }}
/>


            </Grid>

            <Grid item xs={3}>
              <TextField
                label="Invoice Date"
                type="date"
                fullWidth
                size="small"
                value={invoice.invoiceDate}
                onChange={(e) =>
                  setInvoice({ ...invoice, invoiceDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          {/* Items Table */}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Sr. No.</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>GST%</TableCell>
                <TableCell>Total</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoice.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <TextField
                      value={item.productId}
                      onChange={(e) =>
                        handleItemChange(index, "productId", e.target.value)
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(index, "unitPrice", e.target.value)
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={item.gstPercent}
                      onChange={(e) =>
                        handleItemChange(index, "gstPercent", e.target.value)
                      }
                      size="small"
                    />
                  </TableCell>
                  {/* <TableCell>{(item.TotalPrice || 0).toFixed(2)}</TableCell> */}
                  <TableCell>{(item.totalPrice || 0).toFixed(2)}</TableCell>

                  <TableCell>
                    <IconButton onClick={() => removeItem(index)}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={7}>
                  <Button startIcon={<Add />} onClick={addItem} variant="outlined">
                    Add Item
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Totals */}
          <Divider sx={{ my: 2 }} />
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Typography>Subtotal: ₹{subtotal.toFixed(2)}</Typography>
              <Typography>CGST: ₹{cgst.toFixed(2)}</Typography>
              <Typography>SGST: ₹{sgst.toFixed(2)}</Typography>
              <Typography variant="h6">
                Grand Total: ₹{grandTotal.toFixed(2)}
              </Typography>
              <Typography variant="subtitle2">
                Amount in Words: {numberToWords(grandTotal)}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Invoice"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
