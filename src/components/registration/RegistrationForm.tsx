import { useState } from 'react';
import { CompanyProfile, INDUSTRIES } from '@/types';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Link } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RegistrationFormProps {
  onSubmit: (profile: Omit<CompanyProfile, 'id' | 'registeredAt'>) => void;
}

export function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [managerName, setManagerName] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!companyName.trim()) e.companyName = 'Company name is required.';
    if (!industry) e.industry = 'Please select an industry.';
    if (!description.trim()) e.description = 'Description is required.';
    else if (description.trim().length < 20) e.description = 'Please provide at least 20 characters.';
    if (!managerName.trim()) e.managerName = 'Manager name is required.';
    if (!address.trim()) e.address = 'Address is required.';
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({ companyName: companyName.trim(), industry, description: description.trim(), managerName: managerName.trim(), address: address.trim() });
  }

  const fieldCls = (hasError: boolean) => cn(
    'w-full bg-input border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors',
    hasError ? 'border-destructive focus:border-destructive' : 'border-border focus:border-ring',
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-secondary">
            <Link className="h-3.5 w-3.5" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold">ForgeLink</span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-1">Register your company</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Tell us about your organisation so we can tailor scouting results.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Company name" error={errors.companyName}>
              <input type="text" value={companyName} onChange={(e) => { setCompanyName(e.target.value); setErrors((p) => ({ ...p, companyName: '' })); }} placeholder="e.g. Vestner Industries" className={fieldCls(!!errors.companyName)} />
            </Field>

            <Field label="Industry" error={errors.industry}>
              <select value={industry} onChange={(e) => { setIndustry(e.target.value); setErrors((p) => ({ ...p, industry: '' })); }} className={cn(fieldCls(!!errors.industry), 'appearance-none cursor-pointer', !industry ? 'text-muted-foreground' : '')}>
                <option value="" disabled>Select your industry</option>
                {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </Field>

            <Field label="Company description" error={errors.description}>
              <textarea value={description} onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: '' })); }} rows={4} placeholder="Describe what your company does and what partnerships you are looking for…" className={cn(fieldCls(!!errors.description), 'resize-none')} />
            </Field>

            <Field label="Manager name" error={errors.managerName}>
              <input type="text" value={managerName} onChange={(e) => { setManagerName(e.target.value); setErrors((p) => ({ ...p, managerName: '' })); }} placeholder="e.g. Sofia Keller" className={fieldCls(!!errors.managerName)} />
            </Field>

            <Field label="Company address" error={errors.address}>
              <input type="text" value={address} onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: '' })); }} placeholder="e.g. Leopoldstraße 145, 80804 Munich, Germany" className={fieldCls(!!errors.address)} />
            </Field>

            <Button type="submit" className="w-full mt-2 cursor-pointer">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-5">
          All data is stored locally in your browser. No account required.
        </p>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label} <span className="text-destructive">*</span></label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
