import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  trend: number;
  icon: ReactNode;
  trendLabel?: string;
  color?: 'indigo' | 'emerald' | 'amber' | 'violet' | 'rose';
  delay?: number;
}

function AnimatedNumber({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * eased);
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    return () => { start = end; };
  }, [value, duration]);

  return <>{display.toLocaleString('en-IN')}</>;
}

export default function StatCard({ title, value, trend, icon, trendLabel, color = 'indigo', delay = 0 }: StatCardProps) {
  const isPositive = trend >= 0;
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
  const prefix = typeof value === 'string' ? value.replace(/[0-9.,]/g, '').trim() : '';
  const suffix = typeof value === 'string' && value.includes('%') ? '%' : '';

  return (
    <div
      className="group relative rounded-2xl border border-[#EAEAEA] bg-white p-5 transition-all duration-200 ease-out hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:border-[#DCDCDC]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2.5">
          <p className="text-[13px] font-medium text-[#8A8A8A] uppercase tracking-wide">{title}</p>
          <p className="text-[28px] font-bold text-[#111111] tracking-tight leading-none">
            {prefix && <span className="text-lg mr-0.5">{prefix}</span>}
            {!isNaN(numericValue) ? <AnimatedNumber value={numericValue} /> : value}
            {suffix}
          </p>
          <div className="flex items-center gap-1.5">
            <span className={cn(
              'inline-flex items-center gap-0.5 text-xs font-medium',
              isPositive ? 'text-emerald-600' : 'text-red-500'
            )}>
              {isPositive ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
            <span className="text-xs text-[#8A8A8A]">{trendLabel || 'vs last month'}</span>
          </div>
        </div>
        <div className="rounded-xl p-2.5 bg-[#F7F7F7] text-[#666666]">
          {icon}
        </div>
      </div>
    </div>
  );
}
