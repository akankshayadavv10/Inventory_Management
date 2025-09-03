import { useEffect, useState } from "react";
import { Trash2, FileText } from "lucide-react"; 
import axios from "axios";
import { generatePDFManualInvoice } from "./GeneratePDFManualInvoice.jsx";

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/invoices");
        setInvoices(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch invoices");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // Delete invoice
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/invoices/${id}`);
      setInvoices((prev) => prev.filter((inv) => inv._id !== id));
      alert("Invoice deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete invoice");
    }
  };

  // Generate PDF
  const handleGeneratePDF = (invoice) => {
    generatePDFManualInvoice(invoice, null, "download");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Invoice List</h2>

      {loading ? (
        <p>Loading invoices...</p>
      ) : invoices.length === 0 ? (
        <p>No invoices found</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2">Invoice No</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Items</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{inv.gstInvoiceNo}</td>
                  <td className="px-4 py-2">{inv.consignee?.name}</td>
                  <td className="px-4 py-2">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {inv.items.map((item) => (
                      <div key={item._id}>
                        {item.description} ({item.quantity})
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2 font-semibold">
                    ₹ {inv.grandTotal?.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 flex justify-center gap-3">
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(inv._id)}
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleGeneratePDF(inv)}
                    >
                      <FileText size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
