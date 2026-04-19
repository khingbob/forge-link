import { Search } from '@/types';
import { MapPin, Users, Factory, CalendarDays, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchCardProps {
  search: Search;
  onClick: () => void;
}

const STATUS_STYLE = {
  active:   'bg-blue-500/15 text-blue-400 border-blue-500/30',
  finished: 'bg-secondary text-muted-foreground border-border',
};

export function SearchCard({ search, onClick }: SearchCardProps) {
  const accepted  = search.results.filter((r) => r.status === 'accepted').length;
  const pending   = search.results.filter((r) => r.status === 'pending').length;
  const rejected  = search.results.filter((r) => r.status === 'rejected').length;
  const cantReach = search.results.filter((r) => r.status === 'cant_reach').length;
  const total     = search.results.length;

  const createdDate = new Date(search.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const collabLabel: Record<string, string> = {
    online: 'Online', offline: 'On-site', both: 'Online & On-site',
  };

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-card border border-border rounded-xl p-5 hover:border-muted-foreground/40 hover:bg-accent/30 transition-all duration-150 cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-sm font-semibold leading-snug line-clamp-2 flex-1 group-hover:text-foreground transition-colors">
          {search.name}
        </h3>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={cn('text-xs font-medium border rounded-full px-2 py-0.5', STATUS_STYLE[search.status])}>
            {search.status === 'active' ? 'Active' : 'Finished'}
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{search.description}</p>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Factory className="h-3 w-3" />{search.industry}</span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{search.location}</span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Users className="h-3 w-3" />{collabLabel[search.collaborationType]}</span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays className="h-3 w-3" />{createdDate}</span>
      </div>

      {total > 0 && (
        <>
          <div className="flex h-1.5 overflow-hidden rounded-full bg-secondary gap-px mb-3">
            {accepted  > 0 && <div className="bg-emerald-500" style={{ width: `${(accepted  / total) * 100}%` }} />}
            {pending   > 0 && <div className="bg-amber-500"   style={{ width: `${(pending   / total) * 100}%` }} />}
            {rejected  > 0 && <div className="bg-destructive/50" style={{ width: `${(rejected  / total) * 100}%` }} />}
            {cantReach > 0 && <div className="bg-muted-foreground/30" style={{ width: `${(cantReach / total) * 100}%` }} />}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span><span className="font-semibold text-foreground">{total}</span> results</span>
            {accepted  > 0 && <span className="text-emerald-500 font-medium">{accepted} accepted</span>}
            {pending   > 0 && <span className="text-amber-500 font-medium">{pending} pending</span>}
            {rejected  > 0 && <span className="text-destructive/80">{rejected} rejected</span>}
            {cantReach > 0 && <span>{cantReach} no reply</span>}
          </div>
        </>
      )}
    </button>
  );
}
