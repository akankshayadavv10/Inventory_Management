export default function StatusBadge({ quantity, min }){
  const isLow = Number(quantity) < Number(min)
  return isLow ? <span className="status-low">Low Stock</span> : <span className="status-in">In Stock</span>
}