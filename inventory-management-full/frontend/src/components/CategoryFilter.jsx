import React, { useState } from 'react';
import { Filter } from 'lucide-react';

export default function CategoryFilter({ value, onChange, options=[], onAdd }) {
  const [showInput, setShowInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const handleAdd = async () => {
    if (!newCategory.trim()) return;
    await onAdd(newCategory);  // <-- this will now exist
    setNewCategory('');
    setShowInput(false);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-xl border border-gray-300 flex items-center justify-center text-gray-500">
        <Filter size={16}/>
      </div>
      <select
        className="select"
        value={value}
        onChange={(e)=>onChange(e.target.value)}
      >
        {options.map(opt=>(<option key={opt} value={opt}>{opt}</option>))}
      </select>
      <button onClick={()=>setShowInput(!showInput)}>Add Category</button>
      {showInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e)=>setNewCategory(e.target.value)}
            placeholder="New category"
            className="border rounded-md px-2 py-1"
          />
          <button onClick={handleAdd} className="px-2 py-1 bg-black text-white rounded-md">Save</button>
        </div>
      )}
    </div>
  );
}
