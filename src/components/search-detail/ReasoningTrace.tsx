import { useState } from 'react';
import { ReasoningStep } from '@/types';
import { Cpu, ChevronDown, ChevronUp } from 'lucide-react';

interface ReasoningTraceProps {
  steps: ReasoningStep[];
}

export function ReasoningTrace({ steps }: ReasoningTraceProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-accent/50 transition-colors cursor-pointer">
        <div className="flex items-center gap-2.5">
          <Cpu className="h-4 w-4 text-foreground" />
          <span className="text-sm font-medium">AI Reasoning Trace</span>
          <span className="text-xs text-muted-foreground bg-secondary border border-border rounded-full px-2 py-0.5">{steps.length} steps</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="border-t border-border divide-y divide-border/60">
          {steps.map((step) => (
            <div key={step.id} className="px-5 py-4 flex gap-4">
              <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-secondary border border-border text-foreground text-xs font-bold mt-0.5">
                {step.step}
              </div>
              <div>
                <p className="text-xs font-semibold mb-1">{step.title}</p>
                <p className="text-xs text-muted-foreground font-mono leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
