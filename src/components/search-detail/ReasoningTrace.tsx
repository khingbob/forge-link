import { useState } from 'react';
import { ReasoningStep } from '../../types';
import { Cpu, ChevronDown, ChevronUp } from 'lucide-react';

interface ReasoningTraceProps {
  steps: ReasoningStep[];
}

export function ReasoningTrace({ steps }: ReasoningTraceProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-800/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <Cpu size={14} className="text-amber-400" />
          <span className="text-sm font-medium text-zinc-200">AI Reasoning Trace</span>
          <span className="text-xs text-zinc-600 bg-zinc-800 border border-zinc-700 rounded-full px-2 py-0.5">
            {steps.length} steps
          </span>
        </div>
        {open ? (
          <ChevronUp size={14} className="text-zinc-500" />
        ) : (
          <ChevronDown size={14} className="text-zinc-500" />
        )}
      </button>

      {open && (
        <div className="border-t border-zinc-800 divide-y divide-zinc-800/60">
          {steps.map((step) => (
            <div key={step.id} className="px-5 py-4 flex gap-4">
              <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold mt-0.5">
                {step.step}
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-300 mb-1">{step.title}</p>
                <p className="text-xs text-zinc-500 font-mono leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
