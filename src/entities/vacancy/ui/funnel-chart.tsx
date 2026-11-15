import { STATUS_LABELS } from '../model/labels';
import type { FunnelStep } from '../model/stats';

// Pure markup: bar width is relative to the first step; numbers are always printed next to bars.
export const FunnelChart = ({ steps }: { steps: FunnelStep[] }) => {
  const max = Math.max(1, ...steps.map((step) => step.count));

  return (
    <ol className="flex flex-col gap-3">
      {steps.map((step) => (
        <li key={step.status} className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium">{STATUS_LABELS[step.status]}</span>
            <span className="text-slate-600">
              {step.count}
              {step.conversion === null ? '' : ` · ${step.conversion}% of previous`}
            </span>
          </div>
          <div className="h-3 rounded-full bg-slate-100" aria-hidden="true">
            <div
              className="h-3 rounded-full bg-blue-600"
              style={{ width: `${step.count === 0 ? 0 : Math.max(2, (step.count / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
};
