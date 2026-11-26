import { Check, Hammer, RotateCcw, Wrench } from 'lucide-react';
import type { BuildablePart } from '../data/energyData';

interface BuildStageChecklistProps {
  parts: BuildablePart[];
  builtParts: Record<string, boolean>;
  onTogglePart: (partId: string) => void;
  onBuildAll: () => void;
  onResetBuild: () => void;
}

export function BuildStageChecklist({
  parts,
  builtParts,
  onTogglePart,
  onBuildAll,
  onResetBuild,
}: BuildStageChecklistProps) {
  const builtCount = parts.filter((p) => builtParts[p.id]).length;
  const allBuilt = builtCount === parts.length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Wrench className="h-4 w-4 text-slate-700" aria-hidden="true" />
          <h4 className="text-sm font-bold text-slate-900">
            Costruisci l’Impianto ({builtCount}/{parts.length})
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {!allBuilt ? (
            <button
              type="button"
              onClick={onBuildAll}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              <Hammer className="h-3.5 w-3.5" />
              <span>Monta tutto</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onResetBuild}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Smonta e ricostruisci</span>
            </button>
          )}
        </div>
      </div>

      <p className="mt-1.5 text-xs text-slate-600">
        {allBuilt
          ? 'Impianto completato! Ora usa i comandi qui sotto o clicca sui macchinari nel disegno per scoprire chi li ha inventati.'
          : 'Clicca sui componenti qui sotto (oppure direttamente sulle sagome tratteggiate nel disegno) per montarli:'}
      </p>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {parts.map((part, idx) => {
          const isBuilt = Boolean(builtParts[part.id]);
          return (
            <button
              key={part.id}
              type="button"
              onClick={() => onTogglePart(part.id)}
              className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-left transition-all ${
                isBuilt
                  ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950'
                  : 'border-dashed border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400 hover:bg-white'
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-xs font-bold tabular-nums ${
                  isBuilt ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {isBuilt ? <Check className="h-3.5 w-3.5" /> : idx + 1}
              </span>
              <div className="min-w-0">
                <div className="text-xs font-bold leading-tight">{part.name}</div>
                <div className="mt-0.5 text-[11px] leading-snug text-slate-600">{part.role}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
