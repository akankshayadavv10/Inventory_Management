// import { Pencil, Trash2 } from 'lucide-react'
// import StatusBadge from './StatusBadge.jsx'

// export default function InventoryTable({ items, onEdit, onDelete }){
//   return (
//     <div className="overflow-x-auto">
//       <table className="table w-full">
//         <thead className="bg-gray-50">
//           <tr>
//             <th>Name</th><th>Category</th><th>Quantity</th><th>Status</th><th>Price</th><th>Supplier</th><th>Location</th><th>Last Updated</th><th className="text-right">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="bg-white">
//           {items.map(it=>(
//             <tr key={it.id ?? it._id} className="row-hover">
//               <td><div className="font-medium">{it.name}</div><div className="text-xs text-gray-500">{it.description ?? ''}</div></td>
//               <td><span className="badge badge-muted">{it.category}</span></td>
//               <td><div className="flex items-center gap-2"><span>{it.quantity}</span><span className="text-xs text-gray-500">(min: {it.minQuantity})</span></div></td>
//               <td><StatusBadge quantity={it.quantity} min={it.minQuantity} /></td>
//               <td>{Number(it.price).toLocaleString('en-US',{style:'currency',currency:'USD'})}</td>
//               <td>{it.supplier}</td><td>{it.location}</td><td>{it.lastUpdated}</td>
//               <td className="text-right"><div className="flex justify-end gap-2">
//                 <button className="btn" onClick={()=>onEdit(it)} title="Edit"><Pencil size={16}/></button>
//                 <button className="btn" onClick={()=>onDelete(it.id ?? it._id)} title="Delete"><Trash2 size={16}/></button>
//               </div></td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }



import { Pencil, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

export default function InventoryTable({ items, onEdit, onDelete }) {
  // Helper to format the date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead className="bg-gray-50">
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Price</th>
            <th>Supplier</th>
            <th>Location</th>
            <th>Last Updated</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {items.map((item) => (
            <tr key={item._id} className="row-hover">
              <td>
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-500">{item.description || ''}</div>
              </td>
              <td>
                <span className="badge badge-muted">{item.category}</span>
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <span>{item.quantity}</span>
                  <span className="text-xs text-gray-500">(min: {item.minQuantity})</span>
                </div>
              </td>
              <td>
                <StatusBadge quantity={item.quantity} min={item.minQuantity} />
              </td>
              <td>
                {Number(item.price).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </td>
              <td>{item.supplier || '-'}</td>
              <td>{item.location || '-'}</td>
              <td>{formatDate(item.updatedAt)}</td>
              <td className="text-right">
                <div className="flex justify-end gap-2">
                  <button className="btn" onClick={() => onEdit(item)} title="Edit">
                    <Pencil size={16} />
                  </button>
                  <button className="btn" onClick={() => onDelete(item._id)} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
