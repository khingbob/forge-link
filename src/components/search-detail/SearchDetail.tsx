import { useState } from 'react';
import { Search, ResultStatus, CompanyProfile } from '@/types';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/separator';
import { ReasoningTrace } from './ReasoningTrace';
import { ResultCard } from './ResultCard';
import { ArrowLeft, MapPin, Users, Factory, CalendarDays, RotateCcw, Hash, LucideIcon, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export function SearchDetail({ search, profile, onBack, onUpdateResult, onResetResult, onRestartSearch }: SearchDetailProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const [restarting, setRestarting] = useState(false);
  const [outreaching, setOutreaching] = useState(false);
  const [outreachStatus, setOutreachStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [outreachError, setOutreachError] = useState('');

  async function handleRestart() {
    setRestarting(true);
    try { await onRestartSearch(); } finally { setRestarting(false); }
  }

  async function handleOutreach() {
    const firstResult = search.results[0];
    setOutreaching(true);
    setOutreachStatus('idle');
    try {
      const payload = {
        startups: firstResult ? [{ name: firstResult.companyName, description: firstResult.description, 'matching reason': firstResult.fitExplanation }] : [],
        'company-data': { 'company-name': profile.companyName, description: profile.description, 'manager-name': 'Max Mustermann', address: 'Leopoldstraße 145, 80804 Munich, Germany' },
        'search-input': search.description,
      };
      const res = await fetch(OUTREACH_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      if (firstResult) {
        fetch('/api/track-outreach', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ startupName: firstResult.companyName, emailContext: `We reached out 2 weeks ago about: ${search.description.slice(0, 300)}. We are looking for a pilot partner.` }) }).catch(() => {});
      }
      setOutreachStatus('success');
    } catch (err) {
      setOutreachStatus('error');
      setOutreachError(err instanceof Error ? err.message : 'Outreach failed');
    } finally {
      setOutreaching(false);
    }
  }

  const collabLabel: Record<string, string> = { online: 'Online', offline: 'On-site', both: 'Online & On-site' };
  const createdDate = new Date(search.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const counts = {
    all: search.results.length,
    pending:   search.results.filter((r) => r.status === 'pending').length,
    accepted:  search.results.filter((r) => r.status === 'accepted').length,
    rejected:  search.results.filter((r) => r.status === 'rejected').length,
    cant_reach:search.results.filter((r) => r.status === 'cant_reach').length,
  };

  const filtered = filter === 'all' ? search.results : search.results.filter((r) => r.status === filter);
  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: `All (${counts.all})` },
    { key: 'accepted', label: `Accepted (${counts.accepted})` },
    { key: 'pending', label: `Pending (${counts.pending})` },
    { key: 'rejected', label: `Rejected (${counts.rejected})` },
    { key: 'cant_reach', label: `Can't Reach (${counts.cant_reach})` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="cursor-pointer">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleOutreach} disabled={outreaching || search.results.length === 0} className="cursor-pointer">
            {outreaching ? <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" /> Sending…</> : <><Send className="h-3.5 w-3.5" /> Start Outreach</>}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRestart} disabled={restarting} className="cursor-pointer">
            <RotateCcw className={cn('h-3.5 w-3.5', restarting && 'animate-spin')} />
            {restarting ? 'Restarting…' : 'Restart Search'}
          </Button>
        </div>
      </div>

      {outreachStatus === 'success' && (
        <div className="flex items-center gap-2 mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <p className="text-sm text-emerald-400">Outreach triggered successfully for {counts.all} startup{counts.all !== 1 ? 's' : ''}.</p>
        </div>
      )}
      {outreachStatus === 'error' && (
        <div className="flex items-center gap-2 mb-4 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
          <p className="text-sm text-destructive">{outreachError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h1 className="text-base font-semibold leading-snug">{search.name}</h1>
              <span className={cn('shrink-0 text-xs font-medium border rounded-full px-2 py-0.5', search.status === 'active' ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' : 'bg-secondary text-muted-foreground border-border')}>
                {search.status === 'active' ? 'Active' : 'Finished'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-5">{search.description}</p>
            <Separator className="mb-4" />
            <div className="space-y-2.5">
              <MetaRow icon={Factory} label="Industry" value={search.industry} />
              <MetaRow icon={MapPin} label="Location" value={search.location} />
              <MetaRow icon={Users} label="Collaboration" value={collabLabel[search.collaborationType]} />
              <MetaRow icon={Hash} label="Target" value={`${search.numberOfResults} results`} />
              <MetaRow icon={CalendarDays} label="Created" value={createdDate} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs font-medium text-muted-foreground mb-3">Results summary</p>
            <div className="space-y-2">
              <SummaryRow label="Accepted"   value={counts.accepted}   color="text-emerald-400" bar="bg-emerald-500"    total={counts.all} />
              <SummaryRow label="Pending"    value={counts.pending}    color="text-amber-400"   bar="bg-amber-500"      total={counts.all} />
              <SummaryRow label="Rejected"   value={counts.rejected}   color="text-destructive" bar="bg-destructive/70" total={counts.all} />
              <SummaryRow label="Can't Reach" value={counts.cant_reach} color="text-muted-foreground" bar="bg-muted-foreground/40" total={counts.all} />
            </div>
          </div>

          <ReasoningTrace steps={search.reasoningTrace} />
        </div>

        {/* Results */}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {FILTERS.map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)} className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border',
                filter === f.key ? 'bg-secondary text-foreground border-muted-foreground/40' : 'bg-transparent text-muted-foreground border-border hover:border-muted-foreground/40 hover:text-foreground',
              )}>
                {f.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="border border-dashed border-border rounded-xl px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">No results in this category.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((result) => (
                <ResultCard key={result.id} result={result} onStatusChange={(status, callDate) => onUpdateResult(result.id, status, callDate)} onRestart={() => onResetResult(result.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetaRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="h-3 w-3 text-muted-foreground shrink-0" />
      <span className="text-xs text-muted-foreground w-20 shrink-0">{label}</span>
      <span className="text-xs font-medium truncate">{value}</span>
    </div>
  );
}

function SummaryRow({ label, value, color, bar, total }: { label: string; value: number; color: string; bar: string; total: number }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-20 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', bar)} style={{ width: `${pct}%` }} />
      </div>
      <span className={cn('text-xs font-semibold w-4 text-right', color)}>{value}</span>
    </div>
  );
}
