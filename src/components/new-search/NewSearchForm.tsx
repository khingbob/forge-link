import { useState } from 'react';
import { NewSearchFormData, CollabType, INDUSTRIES } from '../../types';
import { Button } from '../ui/Button';
import { Search, MapPin, Users, Hash, FileText, Factory, LucideIcon } from 'lucide-react';

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
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setApiError(null);
    try {
      await onSubmit({
        description: description.trim(),
        industry,
        location: location.trim(),
        numberOfResults,
        collaborationType,
      });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
    // Don't setSubmitting(false) on success — parent navigates away
  }

  const collabOptions: { value: CollabType; label: string; description: string }[] = [
    { value: 'online', label: 'Online', description: 'Remote collaboration only' },
    { value: 'offline', label: 'On-site', description: 'Physical presence required' },
    { value: 'both', label: 'Both', description: 'Open to either format' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <Search size={20} className="text-zinc-500" />
        <div>
          <h1 className="text-lg font-semibold text-zinc-50">New Search</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Define your scouting parameters</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description */}
          <Field
            label="Search description"
            icon={FileText}
            required
            error={errors.description}
            hint="Describe what you're looking for — technology, capabilities, or specific partnership goals."
          >
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((p) => ({ ...p, description: '' }));
              }}
              rows={4}
              placeholder="e.g. Seeking companies with expertise in IoT sensors and edge computing for integration into hydraulic control systems operating in harsh environments…"
              className={inputCls(!!errors.description) + ' resize-none'}
            />
          </Field>

          {/* Industry */}
          <Field label="Industry" icon={Factory} required error={errors.industry}>
            <select
              value={industry}
              onChange={(e) => {
                setIndustry(e.target.value);
                if (errors.industry) setErrors((p) => ({ ...p, industry: '' }));
              }}
              className={inputCls(!!errors.industry) + ` appearance-none cursor-pointer ${!industry ? 'text-zinc-600' : 'text-zinc-100'}`}
            >
              <option value="" disabled>Select target industry</option>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind} className="text-zinc-100 bg-zinc-800">
                  {ind}
                </option>
              ))}
            </select>
          </Field>

          {/* Location */}
          <Field label="Location" icon={MapPin} required error={errors.location} hint="Countries, regions, or 'Worldwide'.">
            <input
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                if (errors.location) setErrors((p) => ({ ...p, location: '' }));
              }}
              placeholder="e.g. Germany, Austria, Switzerland"
              className={inputCls(!!errors.location)}
            />
          </Field>

          {/* Number of results */}
          <Field
            label="Number of results"
            icon={Hash}
            required
            error={errors.numberOfResults}
            hint={`Target number of companies to scout (1–50). Selected: ${numberOfResults}`}
          >
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={50}
                value={numberOfResults}
                onChange={(e) => setNumberOfResults(Number(e.target.value))}
                className="flex-1 accent-amber-500 cursor-pointer"
              />
              <input
                type="number"
                min={1}
                max={50}
                value={numberOfResults}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setNumberOfResults(Math.min(50, Math.max(1, v)));
                  if (errors.numberOfResults) setErrors((p) => ({ ...p, numberOfResults: '' }));
                }}
                className="w-16 bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-2 text-sm text-center text-zinc-100 outline-none focus:border-amber-500"
              />
            </div>
          </Field>

          {/* Collaboration type */}
          <Field label="Collaboration type" icon={Users} required>
            <div className="grid grid-cols-3 gap-3">
              {collabOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCollaborationType(opt.value)}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer
                    ${collaborationType === opt.value
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                      : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                    }`}
                >
                  <p className="text-xs font-semibold mb-0.5">{opt.label}</p>
                  <p className="text-xs opacity-70">{opt.description}</p>
                </button>
              ))}
            </div>
          </Field>

          {/* API error */}
          {apiError && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3">
              <p className="text-xs text-red-400">{apiError}</p>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={submitting ? undefined : Search}
              loading={submitting}
              className="w-full"
              disabled={submitting}
            >
              {submitting ? 'Scouting startups…' : 'Launch Search'}
            </Button>
            {submitting ? (
              <p className="text-center text-xs text-amber-500/70 mt-3 animate-pulse">
                Querying OpenAI → Apollo.io — this may take 5–10 seconds
              </p>
            ) : (
              <p className="text-center text-xs text-zinc-600 mt-3">
                The agent will scout and shortlist companies matching your criteria.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full bg-zinc-800 border rounded-lg px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors
    ${hasError ? 'border-red-500 focus:border-red-400' : 'border-zinc-700 focus:border-amber-500'}`;
}

function Field({
  label,
  icon: Icon,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  icon: LucideIcon;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 mb-2">
        <Icon size={12} className="text-zinc-600" />
        {label}
        {required && <span className="text-amber-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-zinc-600">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
