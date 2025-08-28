import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import SummaryCard from './components/SummaryCard.jsx'
import LowStockBanner from './components/LowStockBanner.jsx'
import InventoryTable from './components/InventoryTable.jsx'
import SearchBar from './components/SearchBar.jsx'
import LowStockAlert from './components/LowStockAlert.jsx'
import CategoryFilter from './components/CategoryFilter.jsx'
import AddItemModal from './components/AddItemModal.jsx'
import EditItemModal from './components/EditItemModal.jsx'
// import { getInventory, addItem, updateItem, deleteItem } from './api/inventory.js'
import { getProducts, addProduct, updateProduct, deleteProduct } from './api/product.js'


export default function App() {
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState(null)

useEffect(() => { 
  (async () => { 
    const d = await getProducts(); 
    setItems(d) 
  })() 
}, [])


  const filtered = useMemo(() => {
    let list = [...items]
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(it =>
        it.name.toLowerCase().includes(q) ||
        it.category.toLowerCase().includes(q) ||
        (it.supplier || '').toLowerCase().includes(q)
      )
    }
    if (category && category !== 'All Categories') {
      list = list.filter(it => it.category === category)
    }
    return list
  }, [items, query, category])

  const totalItems = items.reduce((a, b) => a + (Number(b.quantity) || 0), 0)
  const totalValue = items.reduce((a, b) => a + (Number(b.price || 0) * Number(b.quantity || 0)), 0)
  const lowStock = items.filter(it => Number(it.quantity) < Number(it.minQuantity))
  const categories = Array.from(new Set(items.map(it => it.category))).sort()

  // const handleAdd = async (payload) => {
  //   const newItem = await addItem(payload)
  //   setItems(prev => [newItem, ...prev])
  //   setShowAdd(false)
  // }
  // const handleUpdate = async (id, payload) => {
  //   const updated = await updateItem(id, payload)
  //   setItems(prev => prev.map(it => (it.id == id || it._id == id) ? updated : it))
  //   setEditItem(null)
  // }
  // const handleDelete = async (id) => {
  //   await deleteItem(id)
  //   setItems(prev => prev.filter(it => (it.id ?? it._id) !== id))
  // }
const handleAdd = async (payload) => {
  const formattedPayload = {
    ...payload,
    quantity: Number(payload.quantity),
    minQuantity: Number(payload.minQuantity),
    price: Number(payload.price),
  };

  console.log("Sending payload:", formattedPayload);

  const newItem = await addProduct(formattedPayload);
  setItems(prev => [newItem, ...prev]);
  setShowAdd(false);
};

const handleUpdate = async (id, payload) => {
  const updated = await updateProduct(id, payload)
  setItems(prev => prev.map(it => (it.id === id || it._id === id) ? updated : it))
  setEditItem(null)
}

const handleDelete = async (id) => {
  if (!id) return alert("Item ID missing!");
  await deleteProduct(id);
  setItems(prev => prev.filter(it => (it.id ?? it._id) !== id));
};

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">⌂</div>
            <div>
              <h1 className="text-2xl font-semibold">Inventory Management</h1>
              <p className="text-sm text-gray-500">Track and manage your goods inventory</p>
            </div>
          </div>
          <button 
            className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2" 
            onClick={() => setShowAdd(true)}
          >
            <Plus size={16}/> Add New Item
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="w-full space-y-6 p-6">
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard title="Total Items" value={totalItems} hint={`Across ${categories.length} products`} />
          <SummaryCard title="Total Value" value={totalValue.toLocaleString('en-US',{style:'currency',currency:'USD'})} hint="Current inventory value" />
          <SummaryCard title="Low Stock Items" value={lowStock.length} hint="Need restocking" />
          <SummaryCard title="Categories" value={categories.length} hint="Product categories" />
        </div>

        {/* Search + Filter */}
             {/* Search + Filter */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[260px]">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <div>
<CategoryFilter 
  value={category} 
  onChange={setCategory} 
  options={['All Categories', ...categories]} 
  onAdd={async (newCat) => {
    try {
      // Call backend to add new category
      const res = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCat })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error);

      // Set the selected category to the new category
      setCategory(data.name);

      // Update the categories list (so dropdown includes the new category)
      setItems(prev => {
        // Optionally, add a dummy item to reflect category
        if (!prev.find(i => i.category === data.name)) {
          return [...prev, { name: "", category: data.name, quantity: 0, minQuantity: 0, price: 0, supplier: "", location: "", description: "" }];
        }
        return prev;
      });

    } catch (err) {
      console.error(err);
      alert("Failed to add category");
    }
  }}
/>


          </div>
        </div>

        {/* Low Stock Banner - directly under search bar */}
        {/* {lowStock.length > 0 && ( */}
           <LowStockAlert items={lowStock} />
        {/* )} */}

        {/* Low Stock Banner */}
        {/* {lowStock.length > 0 && <LowStockBanner items={lowStock} />} */}


        {/* Low Stock Banner - directly under search bar */}
{lowStock.length > 0 && <LowStockBanner items={lowStock} />}



        {/* Table */}
        <div className="overflow-hidden border rounded-md">
          <InventoryTable items={filtered} onEdit={setEditItem} onDelete={handleDelete} />
        </div>
      </main>

      {/* Modals */}
      {showAdd && <AddItemModal onClose={() => setShowAdd(false)} onSubmit={handleAdd} />}
      {editItem && <EditItemModal item={editItem} onClose={() => setEditItem(null)} onSubmit={(payload)=>handleUpdate(editItem.id ?? editItem._id, payload)} />}
    </div>
  )
}
