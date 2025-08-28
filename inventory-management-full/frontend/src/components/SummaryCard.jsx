export default function SummaryCard({ title, value, hint }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between"><div className="text-sm font-medium text-gray-600">{title}</div><div className="text-gray-400">⚙</div></div>
      <div className="mt-2 kpi">{value}</div>
      {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
    </div>
  )
}