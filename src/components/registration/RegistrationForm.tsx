import { useState } from 'react';
import { CompanyProfile, INDUSTRIES } from '../../types';
import { Button } from '../ui/Button';
import { ArrowRight, Factory } from 'lucide-react';

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
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit({
      companyName: companyName.trim(),
      industry,
      description: description.trim(),
      managerName: managerName.trim(),
      address: address.trim(),
    });
  }

  const inputCls = (hasError: boolean) =>
    `w-full bg-zinc-800 border rounded-lg px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors
    ${hasError ? 'border-red-500 focus:border-red-400' : 'border-zinc-700 focus:border-amber-500'}`;

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-10 h-10 bg-amber-500 rounded-xl">
            <Factory size={20} className="text-black" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-50 leading-none">ForgeLink</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Strategic Scout</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-zinc-50 mb-1">Register your company</h2>
          <p className="text-sm text-zinc-500 mb-6">
            Tell us about your organisation so we can tailor the scouting results to your context.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Company name */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Company name <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  if (errors.companyName) setErrors((prev) => ({ ...prev, companyName: '' }));
                }}
                placeholder="e.g. Vestner Industries"
                className={inputCls(!!errors.companyName)}
              />
              {errors.companyName && <p className="mt-1 text-xs text-red-400">{errors.companyName}</p>}
            </div>

            {/* Industry */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Industry <span className="text-amber-500">*</span>
              </label>
              <select
                value={industry}
                onChange={(e) => {
                  setIndustry(e.target.value);
                  if (errors.industry) setErrors((prev) => ({ ...prev, industry: '' }));
                }}
                className={`${inputCls(!!errors.industry)} appearance-none cursor-pointer ${!industry ? 'text-zinc-600' : 'text-zinc-100'}`}
              >
                <option value="" disabled>Select your industry</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind} className="text-zinc-100 bg-zinc-800">
                    {ind}
                  </option>
                ))}
              </select>
              {errors.industry && <p className="mt-1 text-xs text-red-400">{errors.industry}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Company description <span className="text-amber-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                }}
                rows={4}
                placeholder="Describe what your company does, what you manufacture, and what kind of partnerships you are looking for…"
                className={`${inputCls(!!errors.description)} resize-none`}
              />
              {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
            </div>

            {/* Manager name */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Manager name <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                value={managerName}
                onChange={(e) => {
                  setManagerName(e.target.value);
                  if (errors.managerName) setErrors((prev) => ({ ...prev, managerName: '' }));
                }}
                placeholder="e.g. Sofia Keller"
                className={inputCls(!!errors.managerName)}
              />
              {errors.managerName && <p className="mt-1 text-xs text-red-400">{errors.managerName}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Company address <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                }}
                placeholder="e.g. Leopoldstraße 145, 80804 Munich, Germany"
                className={inputCls(!!errors.address)}
              />
              {errors.address && <p className="mt-1 text-xs text-red-400">{errors.address}</p>}
            </div>

            <Button type="submit" variant="primary" size="lg" icon={ArrowRight} iconPosition="right" className="w-full mt-2">
              Get Started
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-5">
          All data is stored locally in your browser. No account required.
        </p>
      </div>
    </div>
  );
}
