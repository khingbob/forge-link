import { useState } from 'react';
import { SearchResult, ResultStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { Globe, Mail, Factory, CalendarDays, CheckCircle2, XCircle, PhoneOff, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultCardProps {
  result: SearchResult;
  onStatusChange: (status: ResultStatus, callDate?: string | null) => void;
  onRestart: () => void;
}

const STATUS_BADGE: Record<ResultStatus, string> = {
  pending:   'bg-secondary text-muted-foreground border-border',
  accepted:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  rejected:  'bg-destructive/15 text-destructive border-destructive/30',
  cant_reach:'bg-secondary text-muted-foreground border-border',
};
const STATUS_LABEL: Record<ResultStatus, string> = {
  pending: 'Pending', accepted: 'Accepted', rejected: 'Rejected', cant_reach: "Can't Reach",
};
const CARD_BORDER: Record<ResultStatus, string> = {
  pending: 'border-border', accepted: 'border-emerald-500/30', rejected: 'border-destructive/20', cant_reach: 'border-border',
};

export function ResultCard({ result, onStatusChange, onRestart }: ResultCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [callDate, setCallDate] = useState(result.agreedCallDate ?? '');

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const d = e.target.value;
    setCallDate(d);
    if (result.status === 'accepted') onStatusChange('accepted', d || null);
  }

  return (
    <div className={cn('bg-card border rounded-xl overflow-hidden', CARD_BORDER[result.status])}>
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold truncate">{result.companyName}</h3>
              <span className={cn('shrink-0 text-xs font-medium border rounded-full px-2 py-0.5', STATUS_BADGE[result.status])}>
                {STATUS_LABEL[result.status]}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{result.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Factory className="h-3 w-3" />{result.industry}</span>
          <a href={`https://${result.website}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Globe className="h-3 w-3" />{result.website}
          </a>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="h-3 w-3" />{result.contact}</span>
          {result.agreedCallDate && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
              <CalendarDays className="h-3 w-3" />
              Call: {new Date(result.agreedCallDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      <button onClick={() => setExpanded((v) => !v)} className="w-full flex items-center gap-2 px-5 py-2.5 border-t border-border hover:bg-accent/40 transition-colors text-left cursor-pointer">
        <span className="text-xs text-muted-foreground flex-1">Fit explanation</span>
        {expanded ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="px-5 py-3 border-t border-border bg-secondary/30">
          <p className="text-xs text-muted-foreground leading-relaxed">{result.fitExplanation}</p>
        </div>
      )}

      <div className="px-5 py-3 border-t border-border flex flex-wrap items-center gap-2">
        {result.status !== 'accepted' && (
          <Button variant="outline" size="sm" className="text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300 cursor-pointer" onClick={() => onStatusChange('accepted', callDate || null)}>
            <CheckCircle2 className="h-3.5 w-3.5" /> Accept
          </Button>
        )}
        {result.status !== 'rejected' && (
          <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10 cursor-pointer" onClick={() => onStatusChange('rejected', null)}>
            <XCircle className="h-3.5 w-3.5" /> Reject
          </Button>
        )}
        {result.status !== 'cant_reach' && (
          <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => onStatusChange('cant_reach', null)}>
            <PhoneOff className="h-3.5 w-3.5" /> Can't Reach
          </Button>
        )}
        {result.status !== 'pending' && (
          <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => { setCallDate(''); onRestart(); }}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
        )}
        {result.status === 'accepted' && (
          <div className="ml-auto flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <input type="date" value={callDate} onChange={handleDateChange} className="bg-input border border-border rounded-md px-2.5 py-1 text-xs text-foreground outline-none focus:border-ring cursor-pointer" />
          </div>
        )}
      </div>
    </div>
  );
}
