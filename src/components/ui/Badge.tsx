import { ResultStatus, SearchStatus } from '../../types';

type BadgeStatus = ResultStatus | SearchStatus;

const CONFIG: Record<BadgeStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  },
  accepted: {
    label: 'Accepted',
    className: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-500/15 text-red-400 border border-red-500/30',
  },
  cant_reach: {
    label: "Can't Reach",
    className: 'bg-zinc-700/60 text-zinc-400 border border-zinc-600',
  },
  active: {
    label: 'Active',
    className: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  },
  finished: {
    label: 'Finished',
    className: 'bg-zinc-700/60 text-zinc-400 border border-zinc-600',
  },
};

interface BadgeProps {
  status: BadgeStatus;
  size?: 'sm' | 'md';
}

export function Badge({ status, size = 'md' }: BadgeProps) {
  const { label, className } = CONFIG[status];
  const sizeClass = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${className}`}>
      {label}
    </span>
  );
}
