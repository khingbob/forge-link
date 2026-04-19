import { useState } from 'react';
import { Search, ResultStatus, CompanyProfile } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ReasoningTrace } from './ReasoningTrace';
import { ResultCard } from './ResultCard';
import {
  ArrowLeft,
  MapPin,
  Users,
  Factory,
  CalendarDays,
  RotateCcw,
  Hash,
  LucideIcon,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const OUTREACH_URL = 'https://workflows.platform.eu.happyrobot.ai/hooks/l05uxu836lfg';

type Filter = 'all' | ResultStatus;

interface SearchDetailProps {
  search: Search;
  profile: CompanyProfile;
  onBack: () => void;
  onUpdateResult: (resultId: string, status: ResultStatus, callDate?: string | null) => void;
  onResetResult: (resultId: string) => void;
  onRestartSearch: () => Promise<void>;
}

export function SearchDetail({
  search,
  profile,
  onBack,
  onUpdateResult,
  onResetResult,
  onRestartSearch,
}: SearchDetailProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const [restarting, setRestarting] = useState(false);
  const [outreaching, setOutreaching] = useState(false);
  const [outreachStatus, setOutreachStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [outreachError, setOutreachError] = useState('');

  async function handleRestart() {
    setRestarting(true);
    try {
      await onRestartSearch();
    } finally {
      setRestarting(false);
    }
  }

  async function handleOutreach() {
    const firstResult = search.results[0];

    setOutreaching(true);
    setOutreachStatus('idle');

    try {
      const payload = {
        startups: firstResult
          ? [
              {
                name: firstResult.companyName,
                description: firstResult.description,
                'matching reason': firstResult.fitExplanation,
              },
            ]
          : [],
        'company-data': {
          'company-name': profile.companyName,
          description: profile.description,
          'manager-name': 'Max Mustermann',
          address: 'Leopoldstraße 145, 80804 Munich, Germany',
        },
        'search-input': search.description,
      };

      const res = await fetch(OUTREACH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      // Register with server for 14-day follow-up call if no reply
      if (firstResult) {
        fetch('/api/track-outreach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            startupName: firstResult.companyName,
            emailContext: `We reached out 2 weeks ago about: ${search.description.slice(0, 300)}. We are looking for a pilot partner.`,
          }),
        }).catch(() => {/* non-critical, ignore */});
      }

      setOutreachStatus('success');
    } catch (err) {
      setOutreachStatus('error');
      setOutreachError(err instanceof Error ? err.message : 'Outreach failed');
    } finally {
      setOutreaching(false);
    }
  }

  const collabLabel: Record<string, string> = {
    online: 'Online',
    offline: 'On-site',
    both: 'Online & On-site',
  };

  const createdDate = new Date(search.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const counts = {
    all: search.results.length,
    pending: search.results.filter((r) => r.status === 'pending').length,
    accepted: search.results.filter((r) => r.status === 'accepted').length,
    rejected: search.results.filter((r) => r.status === 'rejected').length,
    cant_reach: search.results.filter((r) => r.status === 'cant_reach').length,
  };

  const outreachCount = counts.pending + counts.accepted;

  const filtered =
    filter === 'all' ? search.results : search.results.filter((r) => r.status === filter);

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: `All (${counts.all})` },
    { key: 'accepted', label: `Accepted (${counts.accepted})` },
    { key: 'pending', label: `Pending (${counts.pending})` },
    { key: 'rejected', label: `Rejected (${counts.rejected})` },
    { key: 'cant_reach', label: `Can't Reach (${counts.cant_reach})` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Back + actions */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={onBack}>
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={outreaching ? undefined : Send}
            loading={outreaching}
            disabled={outreaching || outreachCount === 0}
            onClick={handleOutreach}
          >
            {outreaching ? 'Sending…' : `Start Outreach (${outreachCount})`}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={RotateCcw}
            onClick={handleRestart}
            loading={restarting}
            disabled={restarting}
          >
            {restarting ? 'Restarting…' : 'Restart Search'}
          </Button>
        </div>
      </div>

      {/* Outreach status banners */}
      {outreachStatus === 'success' && (
        <div className="flex items-center gap-2 mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-3">
          <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
          <p className="text-sm text-emerald-400">
            Outreach triggered successfully for 1 startup.
          </p>
        </div>
      )}
      {outreachStatus === 'error' && (
        <div className="flex items-center gap-2 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3">
          <AlertCircle size={15} className="text-red-400 shrink-0" />
          <p className="text-sm text-red-400">{outreachError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          {/* Info card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h1 className="text-base font-semibold text-zinc-50 leading-snug">{search.name}</h1>
              <Badge status={search.status} />
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed mb-5">{search.description}</p>

            <div className="space-y-2.5">
              <MetaRow icon={Factory} label="Industry" value={search.industry} />
              <MetaRow icon={MapPin} label="Location" value={search.location} />
              <MetaRow icon={Users} label="Collaboration" value={collabLabel[search.collaborationType]} />
              <MetaRow icon={Hash} label="Target results" value={`${search.numberOfResults}`} />
              <MetaRow icon={CalendarDays} label="Created" value={createdDate} />
            </div>
          </div>

          {/* Summary card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <p className="text-xs font-medium text-zinc-400 mb-3">Results summary</p>
            <div className="space-y-2">
              <SummaryRow label="Accepted" value={counts.accepted} color="text-emerald-400" barColor="bg-emerald-500" total={counts.all} />
              <SummaryRow label="Pending" value={counts.pending} color="text-amber-400" barColor="bg-amber-500" total={counts.all} />
              <SummaryRow label="Rejected" value={counts.rejected} color="text-red-400" barColor="bg-red-500/70" total={counts.all} />
              <SummaryRow label="Can't Reach" value={counts.cant_reach} color="text-zinc-400" barColor="bg-zinc-600" total={counts.all} />
            </div>
          </div>

          {/* Reasoning trace */}
          <ReasoningTrace steps={search.reasoningTrace} />
        </div>

        {/* Results */}
        <div>
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer
                  ${filter === f.key
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-600'
                    : 'bg-transparent text-zinc-500 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Results list */}
          {filtered.length === 0 ? (
            <div className="border border-dashed border-zinc-800 rounded-xl px-6 py-12 text-center">
              <p className="text-sm text-zinc-600">No results in this category.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((result) => (
                <ResultCard
                  key={result.id}
                  result={result}
                  onStatusChange={(status, callDate) => onUpdateResult(result.id, status, callDate)}
                  onRestart={() => onResetResult(result.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon size={12} className="text-zinc-600 shrink-0" />
      <span className="text-xs text-zinc-600 w-20 shrink-0">{label}</span>
      <span className="text-xs text-zinc-300 font-medium truncate">{value}</span>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  color,
  barColor,
  total,
}: {
  label: string;
  value: number;
  color: string;
  barColor: string;
  total: number;
}) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-zinc-500 w-20 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-semibold ${color} w-4 text-right`}>{value}</span>
    </div>
  );
}
