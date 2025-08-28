import { Search } from 'lucide-react'
export default function SearchBar({ value, onChange }){
  return (
    <div className="relative">
      <input value={value} onChange={(e)=>onChange(e.target.value)} className="input pl-9" placeholder="Search by name, category or supplier..." />
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    </div>
  )
}