import React from "react";

const LowStockAlert = ({ lowStockItems }) => {
  if (!lowStockItems || lowStockItems.length === 0) {
    return null; // don't show alert if no low stock
  }

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 w-full">
      <p className="font-semibold">⚠️ Low Stock Alert!</p>
      <ul className="list-disc list-inside text-sm">
        {lowStockItems.map((item, index) => (
          <li key={index}>
            {item.name} — Only {item.quantity} left
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LowStockAlert;
