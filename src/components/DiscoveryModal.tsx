import { BookOpen, Sparkles, X, ArrowRight } from 'lucide-react';
import type { DiscoveryFact } from '../data/energyData';

interface DiscoveryModalProps {
  fact: DiscoveryFact | null;
  onClose: () => void;
}

export function DiscoveryModal({ fact, onClose }: DiscoveryModalProps) {
  if (!fact) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="discovery-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-700">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{fact.objectName}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{fact.year}</span>
            </div>
            <h3 id="discovery-modal-title" className="text-xl font-bold text-slate-900">
              {fact.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            aria-label="Chiudi scheda"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="text-xs font-medium text-slate-500">Scienziati e Inventori</div>
          <div className="mt-0.5 text-sm font-semibold text-slate-900">{fact.inventors}</div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-700">{fact.summary}</p>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
            <Sparkles className="h-4 w-4 text-amber-600" aria-hidden="true" />
            <span>Lo sapevi che?</span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-amber-950">{fact.funFact}</p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span>{fact.transformation}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 whitespace-nowrap shrink-0"
          >
            Ho capito!
          </button>
        </div>
      </div>
    </div>
  );
}
