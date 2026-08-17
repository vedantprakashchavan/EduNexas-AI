import { useState } from 'react';
import { BookOpen, Search, Plus, BookCopy, Users, AlertTriangle, Check, Clock, X } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { cn } from '../../lib/utils';

const mockBooks = [
  { id: '1', title: 'NCERT Mathematics Class 10', author: 'NCERT', isbn: '978-81-7450-000-1', category: 'textbook', totalCopies: 50, availableCopies: 42, location: 'Shelf A-1' },
  { id: '2', title: 'HC Verma — Concepts of Physics Vol 1', author: 'H.C. Verma', isbn: '978-81-7709-187-2', category: 'reference', totalCopies: 30, availableCopies: 18, location: 'Shelf B-2' },
  { id: '3', title: 'RD Sharma Mathematics', author: 'R.D. Sharma', isbn: '978-93-5253-069-3', category: 'reference', totalCopies: 25, availableCopies: 5, location: 'Shelf A-3' },
  { id: '4', title: 'The Diary of a Young Girl', author: 'Anne Frank', isbn: '978-0-14-118868-4', category: 'fiction', totalCopies: 10, availableCopies: 7, location: 'Shelf D-1' },
  { id: '5', title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', isbn: '978-81-7371-146-5', category: 'non_fiction', totalCopies: 15, availableCopies: 3, location: 'Shelf D-2' },
  { id: '6', title: 'NCERT Science Class 10', author: 'NCERT', isbn: '978-81-7450-100-6', category: 'textbook', totalCopies: 50, availableCopies: 45, location: 'Shelf A-2' },
  { id: '7', title: 'Lakhmir Singh Chemistry', author: 'Lakhmir Singh', isbn: '978-93-5253-170-7', category: 'reference', totalCopies: 20, availableCopies: 0, location: 'Shelf B-4' },
  { id: '8', title: 'India After Gandhi', author: 'Ramachandra Guha', isbn: '978-93-5029-785-8', category: 'non_fiction', totalCopies: 8, availableCopies: 6, location: 'Shelf E-1' },
];

const categoryColors: Record<string, string> = { textbook: 'bg-indigo-500', reference: 'bg-violet-500', fiction: 'bg-emerald-500', non_fiction: 'bg-amber-500', journal: 'bg-cyan-500', magazine: 'bg-rose-500' };

export default function LibraryPage() {
  const [search, setSearch] = useState('');
  const filtered = mockBooks.filter(b => !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));
  const totalBooks = mockBooks.reduce((s, b) => s + b.totalCopies, 0);
  const issued = mockBooks.reduce((s, b) => s + (b.totalCopies - b.availableCopies), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] flex items-center gap-2"><BookOpen className="w-7 h-7 text-[#666666]" /> Library</h1>
          <p className="text-sm text-[#666666] mt-1">Manage book catalog, issue, and returns</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-[#1A1A1A] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all"><Plus className="w-4 h-4" /> Add Book</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Books" value={totalBooks.toString()} trend={12} trendLabel="titles" icon={<BookCopy className="w-6 h-6" />} color="indigo" delay={0} />
        <StatCard title="Books Issued" value={issued.toString()} trend={-2} trendLabel="this week" icon={<Users className="w-6 h-6" />} color="violet" delay={100} />
        <StatCard title="Available" value={(totalBooks - issued).toString()} trend={0} trendLabel="copies" icon={<Check className="w-6 h-6" />} color="emerald" delay={200} />
        <StatCard title="Low Stock" value={mockBooks.filter(b => b.availableCopies <= 5 && b.availableCopies > 0).length.toString()} trend={-1} trendLabel="books" icon={<AlertTriangle className="w-6 h-6" />} color="amber" delay={300} />
      </div>

      <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" /><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title or author..." className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm bg-white border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]" /></div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {filtered.map(b => (
          <div key={b.id} className="rounded-2xl border border-[#EAEAEA] bg-white p-5 hover:border-[#DCDCDC] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className={cn('w-2 h-8 rounded-full', categoryColors[b.category] || 'bg-[#EAEAEA]')} />
              <span className="text-[10px] text-[#8A8A8A] font-mono">{b.isbn.slice(-4)}</span>
            </div>
            <h3 className="text-sm font-bold text-[#111111] mb-1 line-clamp-2 group-hover:text-[#333333] transition-colors">{b.title}</h3>
            <p className="text-xs text-[#666666] mb-3">{b.author}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-full h-1.5 rounded-full bg-[#EAEAEA] overflow-hidden" style={{ width: 60 }}>
                  <div className={cn('h-full rounded-full', b.availableCopies === 0 ? 'bg-red-500' : b.availableCopies <= 5 ? 'bg-amber-500' : 'bg-emerald-500')} style={{ width: `${(b.availableCopies / b.totalCopies) * 100}%` }} />
                </div>
                <span className={cn('text-[10px] font-medium', b.availableCopies === 0 ? 'text-red-600' : 'text-[#666666]')}>{b.availableCopies}/{b.totalCopies}</span>
              </div>
              <span className="text-[10px] text-[#8A8A8A]">{b.location}</span>
            </div>
            {b.availableCopies > 0 ? (
              <button className="mt-3 w-full py-1.5 rounded-lg text-xs font-medium bg-[#F7F7F7] text-[#111111] border border-[#EAEAEA] hover:bg-[#EAEAEA] transition-all">Issue Book</button>
            ) : (
              <div className="mt-3 w-full py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 border border-red-100 text-center">All Copies Issued</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
