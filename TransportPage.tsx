import { Bus, MapPin, Phone, Users, Wrench, CheckCircle, Plus } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { cn } from '../../lib/utils';

const mockVehicles = [
  { id: '1', number: 'KA-01-AB-1234', type: 'bus', capacity: 50, driver: 'Ramesh Kumar', phone: '9876543210', route: 'Route 1 — Koramangala ↔ School', stops: ['Koramangala', 'BTM Layout', 'JP Nagar', 'Banashankari', 'School'], students: 42, status: 'active' },
  { id: '2', number: 'KA-01-CD-5678', type: 'bus', capacity: 50, driver: 'Sunil Yadav', phone: '9876543211', route: 'Route 2 — Indiranagar ↔ School', stops: ['Indiranagar', 'Domlur', 'MG Road', 'Shivajinagar', 'School'], students: 45, status: 'active' },
  { id: '3', number: 'KA-01-EF-9012', type: 'van', capacity: 20, driver: 'Prakash B.', phone: '9876543212', route: 'Route 3 — Whitefield ↔ School', stops: ['Whitefield', 'ITPL', 'Marathahalli', 'School'], students: 18, status: 'active' },
  { id: '4', number: 'KA-01-GH-3456', type: 'bus', capacity: 50, driver: 'Mohan Das', phone: '9876543213', route: 'Route 4 — Yelahanka ↔ School', stops: ['Yelahanka', 'Hebbal', 'Mekhri Circle', 'School'], students: 38, status: 'maintenance' },
  { id: '5', number: 'KA-01-IJ-7890', type: 'van', capacity: 15, driver: 'Deepak N.', phone: '9876543214', route: 'Route 5 — HSR Layout ↔ School', stops: ['HSR Layout', 'Bommanahalli', 'School'], students: 12, status: 'active' },
];

const typeIcons: Record<string, string> = { bus: '🚌', van: '🚐', auto: '🛺' };
const statusConfig: Record<string, { color: string; label: string }> = {
  active: { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', label: 'Active' },
  maintenance: { color: 'text-amber-600 bg-amber-50 border-amber-100', label: 'Maintenance' },
  inactive: { color: 'text-[#666666] bg-[#F7F7F7] border-[#EAEAEA]', label: 'Inactive' },
};

export default function TransportPage() {
  const totalStudents = mockVehicles.reduce((s, v) => s + v.students, 0);
  const totalCapacity = mockVehicles.reduce((s, v) => s + v.capacity, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] flex items-center gap-2"><Bus className="w-7 h-7 text-[#666666]" /> Transport</h1>
          <p className="text-sm text-[#666666] mt-1">Manage vehicles, routes, and student transport</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-[#1A1A1A] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all"><Plus className="w-4 h-4" /> Add Vehicle</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Vehicles" value={mockVehicles.length.toString()} trend={0} trendLabel="fleet" icon={<Bus className="w-6 h-6" />} color="indigo" delay={0} />
        <StatCard title="Students Using" value={totalStudents.toString()} trend={8} trendLabel="enrolled" icon={<Users className="w-6 h-6" />} color="violet" delay={100} />
        <StatCard title="Capacity Util." value={`${Math.round((totalStudents / totalCapacity) * 100)}%`} trend={3} trendLabel="usage" icon={<CheckCircle className="w-6 h-6" />} color="emerald" delay={200} />
        <StatCard title="In Maintenance" value={mockVehicles.filter(v => v.status === 'maintenance').length.toString()} trend={-1} trendLabel="vehicles" icon={<Wrench className="w-6 h-6" />} color="amber" delay={300} />
      </div>

      <div className="space-y-4">
        {mockVehicles.map(v => {
          const stCfg = statusConfig[v.status];
          return (
            <div key={v.id} className="rounded-2xl border border-[#EAEAEA] bg-white p-5 hover:border-[#DCDCDC] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all">
              <div className="flex items-start gap-4 flex-wrap">
                <div className="text-3xl">{typeIcons[v.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-sm font-bold text-[#111111]">{v.number}</h3>
                    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium border', stCfg.color)}>{stCfg.label}</span>
                  </div>
                  <p className="text-xs text-[#666666] mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {v.route}</p>
                  <p className="text-xs text-[#8A8A8A] mt-1 flex items-center gap-1"><Phone className="w-3 h-3" /> {v.driver} — {v.phone}</p>
                  {/* Stops */}
                  <div className="flex items-center gap-1 mt-3 overflow-x-auto">
                    {v.stops.map((stop, i) => (
                      <div key={stop} className="flex items-center gap-1 flex-shrink-0">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F7F7F7] text-[#666666] border border-[#EAEAEA]">{stop}</span>
                        {i < v.stops.length - 1 && <span className="text-[#999999] text-xs">→</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center flex-shrink-0">
                  <p className="text-xl font-bold text-[#111111]">{v.students}</p>
                  <p className="text-[10px] text-[#8A8A8A]">/ {v.capacity} seats</p>
                  <div className="w-16 h-1.5 rounded-full bg-[#EAEAEA] mt-1 overflow-hidden">
                    <div className={cn('h-full rounded-full', (v.students / v.capacity) > 0.9 ? 'bg-red-500' : 'bg-emerald-500')} style={{ width: `${(v.students / v.capacity) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
