import { useState, useEffect } from "react";
import CategoryFilter from "./CategoryFilter.jsx"; // <-- use your existing component

export default function AddItemModal({ item = null, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: 0,
    minQuantity: 0,
    price: 0,
    supplier: "",
    location: "",
    description: "",
  });

  const [categories, setCategories] = useState([]);

  // Fetch categories from backend
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data.map((c) => c.name)); // assuming { _id, name }
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    })();
  }, []);

  // Populate form if editing
  useEffect(() => {
    if (item) setForm({ ...item });
  }, [item]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <form
        onSubmit={save}
        className="bg-white rounded-xl shadow-lg w-full max-w-lg p-4 space-y-3 text-sm"
      >
        <div className="text-md font-semibold">
          {item ? "Edit Item" : "Add Item"}
        </div>

        {/* First two rows with 2 columns */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Item Name</label>
            <input
              className="border rounded-md px-2 py-1 w-full text-sm"
              placeholder="Enter item name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Category</label>
            <CategoryFilter
              value={form.category}
              onChange={(val) => set("category", val)}
              options={["All Categories", ...categories]}
              onAdd={async (newCat) => {
                try {
                  const res = await fetch("http://localhost:5000/api/categories", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: newCat }),
                  });
                  const data = await res.json();
                  if (!res.ok) return alert(data.error);

                  // update selected category and categories list
                  set("category", data.name);
                  setCategories((prev) => [...prev, data.name]);
                } catch (err) {
                  console.error(err);
                  alert("Failed to add category");
                }
              }}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Current Quantity</label>
            <input
              type="number"
              className="border rounded-md px-2 py-1 w-full text-sm"
              placeholder="Enter current quantity"
              value={form.quantity}
              onChange={(e) => set("quantity", e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Minimum Stock</label>
            <input
              type="number"
              className="border rounded-md px-2 py-1 w-full text-sm"
              placeholder="Enter minimum stock"
              value={form.minQuantity}
              onChange={(e) => set("minQuantity", e.target.value)}
              required
            />
          </div>
        </div>

        {/* Single column fields */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Unit Price</label>
          <input
            type="number"
            className="border rounded-md px-2 py-1 w-full text-sm"
            placeholder="Enter unit price"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Supplier</label>
          <input
            className="border rounded-md px-2 py-1 w-full text-sm"
            placeholder="Enter supplier name"
            value={form.supplier}
            onChange={(e) => set("supplier", e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Storage Location</label>
          <input
            className="border rounded-md px-2 py-1 w-full text-sm"
            placeholder="Enter storage location"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Description</label>
          <textarea
            className="border rounded-md px-2 py-1 w-full text-sm"
            placeholder="Enter description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            className="px-3 py-1 rounded-md border text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 rounded-md bg-black text-white text-sm"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
