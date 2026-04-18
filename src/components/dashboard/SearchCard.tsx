import { Search } from '../../types';
import { Badge } from '../ui/Badge';
import { MapPin, Users, Factory, CalendarDays, ChevronRight } from 'lucide-react';

interface SearchCardProps {
  search: Search;
  onClick: () => void;
}

export function SearchCard({ search, onClick }: SearchCardProps) {
  const accepted = search.results.filter((r) => r.status === 'accepted').length;
  const pending = search.results.filter((r) => r.status === 'pending').length;
  const rejected = search.results.filter((r) => r.status === 'rejected').length;
  const cantReach = search.results.filter((r) => r.status === 'cant_reach').length;
  const total = search.results.length;

  const createdDate = new Date(search.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const collabLabel: Record<string, string> = {
    online: 'Online',
    offline: 'On-site',
    both: 'Online & On-site',
  };

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all duration-150 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-zinc-100 leading-snug group-hover:text-white transition-colors line-clamp-2">
          {search.name}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          <Badge status={search.status} size="sm" />
          <ChevronRight size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-zinc-500 line-clamp-2 mb-4 leading-relaxed">{search.description}</p>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Factory size={11} className="text-zinc-600" />
          {search.industry}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <MapPin size={11} className="text-zinc-600" />
          {search.location}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Users size={11} className="text-zinc-600" />
          {collabLabel[search.collaborationType]}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <CalendarDays size={11} className="text-zinc-600" />
          {createdDate}
        </span>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="mb-3">
          <div className="flex h-1.5 rounded-full overflow-hidden bg-zinc-800 gap-0.5">
            {accepted > 0 && (
              <div
                className="bg-emerald-500 rounded-full transition-all"
                style={{ width: `${(accepted / total) * 100}%` }}
              />
            )}
            {pending > 0 && (
              <div
                className="bg-amber-500 rounded-full transition-all"
                style={{ width: `${(pending / total) * 100}%` }}
              />
            )}
            {rejected > 0 && (
              <div
                className="bg-red-500/60 rounded-full transition-all"
                style={{ width: `${(rejected / total) * 100}%` }}
              />
            )}
            {cantReach > 0 && (
              <div
                className="bg-zinc-600 rounded-full transition-all"
                style={{ width: `${(cantReach / total) * 100}%` }}
              />
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-zinc-500">
          <span className="font-semibold text-zinc-300">{total}</span> results
        </span>
        {accepted > 0 && (
          <span className="text-xs text-emerald-500 font-medium">{accepted} accepted</span>
        )}
        {pending > 0 && (
          <span className="text-xs text-amber-500 font-medium">{pending} pending</span>
        )}
        {rejected > 0 && (
          <span className="text-xs text-red-400/80">{rejected} rejected</span>
        )}
        {cantReach > 0 && (
          <span className="text-xs text-zinc-500">{cantReach} no reply</span>
        )}
      </div>
    </button>
  );
}
