// import { useEffect, useState } from "react";
// import { AlertTriangle } from "lucide-react";

// export default function LowStockBanner() {
//   const [lowStockItems, setLowStockItems] = useState([]);

// useEffect(() => {
// const fetchLowStock = async () => {
//   try {
//     const res = await fetch("http://localhost:5000/api/lowstock");
//     if (!res.ok) throw new Error("Failed to fetch");
//     const data = await res.json();
//     setLowStockItems(data); // ✅ no .data
//   } catch (err) {
//     console.error("Error fetching low stock items:", err);
//   }
// };


//   fetchLowStock();
// }, []);

//   if (lowStockItems.length === 0) return null;

//   return (
//     <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-md mb-4">
//       <div className="flex items-center gap-2 mb-2 font-semibold">
//         <AlertTriangle size={18} />
//         Low Stock Alert
//       </div>

//       <div className="flex flex-wrap gap-2">
//         {lowStockItems.map(item => (
//           <span
//             key={item._id}
//             className="bg-red-200 text-red-800 px-2 py-1 rounded-md text-sm font-medium"
//           >
//             {item.name} ({item.quantity} left)
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }
import { AlertTriangle } from "lucide-react";

export default function LowStockBanner({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-md mb-4">
      <div className="flex items-center gap-2 mb-2 font-semibold">
        <AlertTriangle size={18} />
        Low Stock Alert
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <span
            key={item._id || item.id}
            className="bg-red-200 text-red-800 px-2 py-1 rounded-md text-sm font-medium"
          >
            {item.name} ({item.quantity} left)
          </span>
        ))}
      </div>
    </div>
  );
}
