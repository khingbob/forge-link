import { useState } from 'react';
import { NewSearchFormData, CollabType, INDUSTRIES } from '@/types';
import { Button } from '@/components/ui/Button';
import { Search, MapPin, Users, Hash, FileText, Factory, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewSearchFormProps {
  onSubmit: (data: NewSearchFormData) => Promise<void>;
}

export function NewSearchForm({ onSubmit }: NewSearchFormProps) {
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [numberOfResults, setNumberOfResults] = useState(5);
  const [collaborationType, setCollaborationType] = useState<CollabType>('both');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  function validate() {
    const e: Record<string, string> = {};
    if (!description.trim()) e.description = 'Search description is required.';
    else if (description.trim().length < 20) e.description = 'Please provide at least 20 characters.';
    if (!industry) e.industry = 'Please select an industry.';
    if (!location.trim()) e.location = 'Location is required.';
    if (numberOfResults < 1 || numberOfResults > 50) e.numberOfResults = 'Must be between 1 and 50.';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setApiError(null);
    try {
      await onSubmit({ description: description.trim(), industry, location: location.trim(), numberOfResults, collaborationType });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong.');
      setSubmitting(false);
    }
  }

  const fieldCls = (hasError: boolean) => cn(
    'w-full bg-input border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors',
    hasError ? 'border-destructive' : 'border-border focus:border-ring',
  );

  const collabOptions: { value: CollabType; label: string; desc: string }[] = [
    { value: 'online', label: 'Online', desc: 'Remote only' },
    { value: 'offline', label: 'On-site', desc: 'Physical presence' },
    { value: 'both', label: 'Both', desc: 'Either format' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Search className="h-5 w-5 text-muted-foreground" />
        <div>
          <h1 className="text-lg font-semibold">New Search</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Define your scouting parameters</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-7">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Search description" icon={FileText} required error={errors.description} hint="Describe what you're looking for — technology, capabilities, or partnership goals.">
            <textarea value={description} onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors((p) => ({ ...p, description: '' })); }} rows={4} placeholder="e.g. Seeking companies with IoT sensor expertise for integration into hydraulic control systems…" className={cn(fieldCls(!!errors.description), 'resize-none')} />
          </Field>

          <Field label="Industry" icon={Factory} required error={errors.industry}>
            <select value={industry} onChange={(e) => { setIndustry(e.target.value); if (errors.industry) setErrors((p) => ({ ...p, industry: '' })); }} className={cn(fieldCls(!!errors.industry), 'appearance-none cursor-pointer', !industry ? 'text-muted-foreground' : '')}>
              <option value="" disabled>Select target industry</option>
              {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </Field>

          <Field label="Location" icon={MapPin} required error={errors.location} hint="Countries, regions, or 'Worldwide'.">
            <input type="text" value={location} onChange={(e) => { setLocation(e.target.value); if (errors.location) setErrors((p) => ({ ...p, location: '' })); }} placeholder="e.g. Germany, Austria, Switzerland" className={fieldCls(!!errors.location)} />
          </Field>

          <Field label={`Number of results — ${numberOfResults}`} icon={Hash} required error={errors.numberOfResults} hint="Max 25 — Apollo API limit.">
            <div className="flex items-center gap-4">
              <input type="range" min={1} max={25} value={numberOfResults} onChange={(e) => setNumberOfResults(Number(e.target.value))} className="flex-1 accent-primary cursor-pointer" />
              <input type="number" min={1} max={25} value={numberOfResults} onChange={(e) => { setNumberOfResults(Math.min(25, Math.max(1, Number(e.target.value)))); }} className="w-20 bg-input border border-border rounded-lg px-2.5 py-2 text-sm text-center text-foreground outline-none focus:border-ring" />
            </div>
          </Field>

          <Field label="Collaboration type" icon={Users} required>
            <div className="grid grid-cols-3 gap-3">
              {collabOptions.map((opt) => (
                <button key={opt.value} type="button" onClick={() => setCollaborationType(opt.value)}
                  className={cn('p-3 rounded-lg border text-left transition-all cursor-pointer',
                    collaborationType === opt.value
                      ? 'border-foreground bg-secondary text-foreground'
                      : 'border-border bg-card text-muted-foreground hover:border-muted-foreground hover:text-foreground',
                  )}>
                  <p className="text-xs font-semibold mb-0.5">{opt.label}</p>
                  <p className="text-xs opacity-70">{opt.desc}</p>
                </button>
              ))}
            </div>
          </Field>

          {apiError && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3">
              <p className="text-xs text-destructive">{apiError}</p>
            </div>
          )}

          <div className="pt-2">
            <Button type="submit" className="w-full cursor-pointer" disabled={submitting}>
              {submitting ? (
                <><span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" /> Scouting startups…</>
              ) : (
                <><Search className="h-4 w-4" /> Launch Search</>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-3">
              {submitting ? 'Querying OpenAI → Apollo.io — this may take 5–10 seconds' : 'The agent will scout companies matching your criteria.'}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, required, error, hint, children }: {
  label: string; icon: LucideIcon; required?: boolean; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
        <Icon className="h-3 w-3" />{label}{required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
