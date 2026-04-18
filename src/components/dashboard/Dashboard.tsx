import { Search } from '../../types';
import { SearchCard } from './SearchCard';
import { Button } from '../ui/Button';
import { Zap, CheckCircle2, Plus, LayoutDashboard, LucideIcon } from 'lucide-react';

interface DashboardProps {
  activeSearches: Search[];
  finishedSearches: Search[];
  onOpenSearch: (id: string) => void;
  onNewSearch: () => void;
}

export function Dashboard({ activeSearches, finishedSearches, onOpenSearch, onNewSearch }: DashboardProps) {
  const totalResults = [...activeSearches, ...finishedSearches].reduce(
    (sum, s) => sum + s.results.length,
    0,
  );
  const totalAccepted = [...activeSearches, ...finishedSearches].reduce(
    (sum, s) => sum + s.results.filter((r) => r.status === 'accepted').length,
    0,
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={20} className="text-zinc-500" />
          <div>
            <h1 className="text-lg font-semibold text-zinc-50">Dashboard</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Monitor your scouting searches</p>
          </div>
        </div>
        <Button variant="primary" icon={Plus} onClick={onNewSearch} size="md">
          New Search
        </Button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Searches" value={activeSearches.length + finishedSearches.length} />
        <StatCard label="Active" value={activeSearches.length} accent="blue" />
        <StatCard label="Finished" value={finishedSearches.length} accent="zinc" />
        <StatCard label="Accepted Leads" value={totalAccepted} sub={`of ${totalResults} scouted`} accent="green" />
      </div>

      {/* Active searches */}
      <Section
        title="Active Searches"
        icon={Zap}
        count={activeSearches.length}
        iconColor="text-amber-400"
        emptyText="No active searches. Start one above."
      >
        {activeSearches.map((s) => (
          <SearchCard key={s.id} search={s} onClick={() => onOpenSearch(s.id)} />
        ))}
      </Section>

      {/* Finished searches */}
      <Section
        title="Finished Searches"
        icon={CheckCircle2}
        count={finishedSearches.length}
        iconColor="text-zinc-500"
        emptyText="No finished searches yet."
      >
        {finishedSearches.map((s) => (
          <SearchCard key={s.id} search={s} onClick={() => onOpenSearch(s.id)} />
        ))}
      </Section>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent = 'default',
}: {
  label: string;
  value: number;
  sub?: string;
  accent?: 'default' | 'blue' | 'zinc' | 'green';
}) {
  const valueColor: Record<string, string> = {
    default: 'text-zinc-50',
    blue: 'text-blue-400',
    zinc: 'text-zinc-400',
    green: 'text-emerald-400',
  };
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${valueColor[accent]}`}>{value}</p>
      {sub && <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>}
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  count,
  iconColor,
  emptyText,
  children,
}: {
  title: string;
  icon: LucideIcon;
  count: number;
  iconColor: string;
  emptyText: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2.5 mb-4">
        <Icon size={15} className={iconColor} />
        <h2 className="text-sm font-semibold text-zinc-300">{title}</h2>
        <span className="text-xs text-zinc-600 bg-zinc-800 border border-zinc-700 rounded-full px-2 py-0.5">
          {count}
        </span>
      </div>
      {count === 0 ? (
        <div className="border border-dashed border-zinc-800 rounded-xl px-6 py-10 text-center">
          <p className="text-sm text-zinc-600">{emptyText}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{children}</div>
      )}
    </div>
  );
}
