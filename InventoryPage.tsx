import { useState } from 'react';
import { Package, Search, Plus, AlertTriangle, Check, TrendingDown } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { cn } from '../../lib/utils';

const mockItems = [
  { id: '1', name: 'Student Desk', category: 'furniture', quantity: 200, unit: 'pieces', minStock: 20, location: 'Warehouse A', condition: 'good', status: 'in_stock', price: 3500 },
  { id: '2', name: 'Projector', category: 'electronics', quantity: 12, unit: 'pieces', minStock: 3, location: 'IT Room', condition: 'good', status: 'in_stock', price: 45000 },
  { id: '3', name: 'Whiteboard Marker (Box)', category: 'stationery', quantity: 8, unit: 'boxes', minStock: 10, location: 'Store Room', condition: 'new', status: 'low_stock', price: 500 },
  { id: '4', name: 'Football', category: 'sports', quantity: 15, unit: 'pieces', minStock: 5, location: 'Sports Room', condition: 'fair', status: 'in_stock', price: 1200 },
  { id: '5', name: 'Microscope', category: 'lab_equipment', quantity: 3, unit: 'pieces', minStock: 5, location: 'Bio Lab', condition: 'good', status: 'low_stock', price: 15000 },
  { id: '6', name: 'Chalk (Box)', category: 'stationery', quantity: 0, unit: 'boxes', minStock: 15, location: 'Store Room', condition: 'new', status: 'out_of_stock', price: 200 },
  { id: '7', name: 'Chemistry Beakers', category: 'lab_equipment', quantity: 30, unit: 'pieces', minStock: 10, location: 'Chem Lab', condition: 'good', status: 'in_stock', price: 350 },
  { id: '8', name: 'Mop & Bucket Set', category: 'cleaning', quantity: 4, unit: 'sets', minStock: 5, location: 'Janitor Room', condition: 'fair', status: 'low_stock', price: 800 },
  { id: '9', name: 'AC Unit (1.5 Ton)', category: 'electronics', quantity: 18, unit: 'pieces', minStock: 2, location: 'Various', condition: 'good', status: 'in_stock', price: 35000 },
  { id: '10', name: 'Library Chair', category: 'furniture', quantity: 60, unit: 'pieces', minStock: 10, location: 'Library', condition: 'good', status: 'in_stock', price: 2500 },
];

const categoryConfig: Record<string, { color: string; label: string }> = {
  furniture: { color: 'bg-[#F7F7F7] text-[#111111]', label: 'Furniture' },
  electronics: { color: 'bg-[#F7F7F7] text-[#111111]', label: 'Electronics' },
  stationery: { color: 'bg-[#F7F7F7] text-[#111111]', label: 'Stationery' },
  sports: { color: 'bg-[#F7F7F7] text-[#111111]', label: 'Sports' },
  lab_equipment: { color: 'bg-[#F7F7F7] text-[#111111]', label: 'Lab Equipment' },
  cleaning: { color: 'bg-[#F7F7F7] text-[#111111]', label: 'Cleaning' },
  other: { color: 'bg-[#F7F7F7] text-[#666666]', label: 'Other' },
};

const statusStyle: Record<string, string> = {
  in_stock: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  low_stock: 'text-amber-600 bg-amber-50 border-amber-100',
  out_of_stock: 'text-red-600 bg-red-50 border-red-100',
};

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const filtered = mockItems.filter(i => {
    if (catFilter !== 'all' && i.category !== catFilter) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalValue = mockItems.reduce((s, i) => s + i.quantity * i.price, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] flex items-center gap-2"><Package className="w-7 h-7 text-[#666666]" /> Inventory</h1>
          <p className="text-sm text-[#666666] mt-1">Track school assets and supplies</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-[#1A1A1A] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all"><Plus className="w-4 h-4" /> Add Item</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Items" value={mockItems.length.toString()} trend={0} trendLabel="categories" icon={<Package className="w-6 h-6" />} color="indigo" delay={0} />
        <StatCard title="In Stock" value={mockItems.filter(i => i.status === 'in_stock').length.toString()} trend={0} trendLabel="items" icon={<Check className="w-6 h-6" />} color="emerald" delay={100} />
        <StatCard title="Low Stock" value={mockItems.filter(i => i.status === 'low_stock').length.toString()} trend={-3} trendLabel="attention" icon={<TrendingDown className="w-6 h-6" />} color="amber" delay={200} />
        <StatCard title="Total Value" value={`₹${(totalValue / 100000).toFixed(1)}L`} trend={0} trendLabel="assets" icon={<AlertTriangle className="w-6 h-6" />} color="violet" delay={300} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" /><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..." className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]" /></div>
        <div className="flex gap-1.5 overflow-x-auto">
          {['all', ...Object.keys(categoryConfig)].map(c => (
            <button key={c} onClick={() => setCatFilter(c)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border whitespace-nowrap transition-all', catFilter === c ? 'bg-[#F7F7F7] text-[#111111] border-[#DCDCDC]' : 'bg-[#F7F7F7] text-[#666666] border-[#EAEAEA] hover:text-[#111111]')}>
              {c === 'all' ? 'All' : categoryConfig[c]?.label || c}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#EAEAEA] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FAFAFA]"><tr className="border-b border-[#EAEAEA]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase">Item</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[#666666] uppercase">Category</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[#666666] uppercase">Qty</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[#666666] uppercase">Location</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[#666666] uppercase">Condition</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[#666666] uppercase">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-4 py-3"><p className="text-sm font-medium text-[#111111]">{item.name}</p><p className="text-[10px] text-[#8A8A8A]">₹{item.price.toLocaleString()} per {item.unit.replace(/s$/, '')}</p></td>
                  <td className="px-4 py-3 text-center"><span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium', categoryConfig[item.category]?.color)}>{categoryConfig[item.category]?.label}</span></td>
                  <td className="px-4 py-3 text-center"><span className={cn('text-sm font-semibold', item.quantity <= item.minStock ? 'text-red-600' : 'text-[#111111]')}>{item.quantity}</span><span className="text-[10px] text-[#8A8A8A] ml-1">{item.unit}</span></td>
                  <td className="px-4 py-3 text-center text-xs text-[#666666]">{item.location}</td>
                  <td className="px-4 py-3 text-center text-xs text-[#666666] capitalize">{item.condition}</td>
                  <td className="px-4 py-3 text-center"><span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium border', statusStyle[item.status])}>{item.status.replace(/_/g, ' ')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
