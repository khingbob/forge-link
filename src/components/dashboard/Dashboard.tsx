import { Search } from '@/types';
import { SearchCard } from './SearchCard';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/separator';
// Button kept for EmptyState action
import { TrendingUp, TrendingDown, Zap, CheckCircle2, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardProps {
  activeSearches: Search[];
  finishedSearches: Search[];
  onOpenSearch: (id: string) => void;
  onNewSearch: () => void;
}

export function Dashboard({ activeSearches, finishedSearches, onOpenSearch, onNewSearch }: DashboardProps) {
  const allSearches = [...activeSearches, ...finishedSearches];
  const totalResults = allSearches.reduce((s, search) => s + search.results.length, 0);
  const totalAccepted = allSearches.reduce((s, search) => s + search.results.filter((r) => r.status === 'accepted').length, 0);
  const totalPending = allSearches.reduce((s, search) => s + search.results.filter((r) => r.status === 'pending').length, 0);
  const acceptRate = totalResults > 0 ? Math.round((totalAccepted / totalResults) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Searches"
          value={allSearches.length}
          trend={activeSearches.length > 0 ? `${activeSearches.length} currently active` : 'No active searches'}
          trendUp={activeSearches.length > 0}
          sub="All scouting searches"
        />
        <StatCard
          title="Active Searches"
          value={activeSearches.length}
          trend={activeSearches.length > 0 ? 'Agents running now' : 'All searches completed'}
          trendUp={activeSearches.length > 0}
          sub="In progress right now"
        />
        <StatCard
          title="Accepted Leads"
          value={totalAccepted}
          badge={totalResults > 0 ? `${acceptRate}%` : undefined}
          badgeUp={acceptRate >= 30}
          trend={totalAccepted > 0 ? 'Partnerships confirmed' : 'No acceptances yet'}
          trendUp={totalAccepted > 0}
          sub={`Out of ${totalResults} scouted`}
        />
        <StatCard
          title="Awaiting Reply"
          value={totalPending}
          trend={totalPending > 0 ? 'Outreach in progress' : 'All contacted'}
          trendUp={false}
          sub="Pending agent outreach"
        />
      </div>

      {/* Active searches */}
      <section>
        <SectionHeader icon={Zap} title="Active Searches" count={activeSearches.length} />
        {activeSearches.length === 0 ? (
          <EmptyState message="No active searches." actionLabel="Create one" onAction={onNewSearch} />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {activeSearches.map((s) => <SearchCard key={s.id} search={s} onClick={() => onOpenSearch(s.id)} />)}
          </div>
        )}
      </section>

      <Separator />

      {/* Finished searches */}
      <section>
        <SectionHeader icon={CheckCircle2} title="Finished Searches" count={finishedSearches.length} />
        {finishedSearches.length === 0 ? (
          <EmptyState message="No finished searches yet." />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {finishedSearches.map((s) => <SearchCard key={s.id} search={s} onClick={() => onOpenSearch(s.id)} />)}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ title, value, badge, badgeUp, trend, trendUp, sub }: {
  title: string; value: number; badge?: string; badgeUp?: boolean;
  trend: string; trendUp: boolean; sub: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{title}</span>
        {badge && (
          <span className={cn(
            'inline-flex items-center gap-1 text-xs font-medium border rounded-full px-2.5 py-0.5',
            badgeUp ? 'border-border text-foreground' : 'border-border text-muted-foreground',
          )}>
            {badgeUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {badge}
          </span>
        )}
      </div>
      <div className="text-4xl font-bold tracking-tight tabular-nums">{value}</div>
      <div className="flex items-center gap-1.5 text-sm font-semibold">
        {trendUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        {trend}
      </div>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, count, children }: {
  icon: LucideIcon; title: string; count: number; children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 font-medium">{count}</span>
      </div>
      {children}
    </div>
  );
}

function EmptyState({ message, actionLabel, onAction }: {
  message: string; actionLabel?: string; onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 text-center">
      <p className="text-sm text-muted-foreground mb-3">{message}</p>
      {onAction && actionLabel && (
        <Button size="sm" variant="outline" onClick={onAction} className="cursor-pointer">{actionLabel}</Button>
      )}
    </div>
  );
}
