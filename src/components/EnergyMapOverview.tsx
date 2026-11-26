import { useState } from 'react';
import {
  Atom,
  CheckCircle2,
  Droplets,
  Flame,
  Fuel,
  Gauge,
  Image as ImageIcon,
  Mountain,
  Play,
  Recycle,
  Sun,
  Wind,
  Zap,
} from 'lucide-react';
import { ENERGY_SOURCES, type EnergyId } from '../data/energyData';

interface EnergyMapOverviewProps {
  completedLabs: Record<EnergyId, boolean>;
  onSelectSource: (id: EnergyId) => void;
  activeFilter: 'tutte' | 'rinnovabile' | 'esauribile' | 'nuova';
  onFilterChange: (filter: 'tutte' | 'rinnovabile' | 'esauribile' | 'nuova') => void;
}

const SOURCE_ICONS: Record<EnergyId, typeof Sun> = {
  sole: Sun,
  acqua: Droplets,
  atomo: Atom,
  vento: Wind,
  carbone: Flame,
  petrolio: Fuel,
  metano: Gauge,
  geotermico: Mountain,
  rifiuti: Recycle,
  idrogeno: Zap,
};

export function EnergyMapOverview({
  completedLabs,
  onSelectSource,
  activeFilter,
  onFilterChange,
}: EnergyMapOverviewProps) {
  const [showOriginalMap, setShowOriginalMap] = useState(false);

  const filteredSources =
    activeFilter === 'tutte'
      ? ENERGY_SOURCES
      : ENERGY_SOURCES.filter((s) => s.category === activeFilter);

  const completedCount = Object.values(completedLabs).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Intro Hero & Concept Filter */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold text-slate-500">
              Dalla Fonte alla Forma fino all’Elettricità · {completedCount}/{ENERGY_SOURCES.length} impianti costruiti
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              Scegli una Fonte di Energia, costruisci la centrale e gioca!
            </h1>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600">
              Le <strong>Fonti</strong> sono gli elementi naturali da cui ricaviamo energia; le <strong>Forme</strong> sono il modo in cui l’energia si trasforma (luminosa, termica, eolica, nucleare, chimica) fino a diventare corrente elettrica.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowOriginalMap((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-100 whitespace-nowrap shrink-0"
            >
              <ImageIcon className="h-4 w-4 text-slate-600" />
              <span>{showOriginalMap ? 'Nascondi Mappa Schema' : 'Vedi Mappa Schema'}</span>
            </button>
          </div>
        </div>

        {showOriginalMap && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col items-center">
            <img
              src={`${import.meta.env.BASE_URL}assets/aistudio/image_75f81d69.png`}
              alt="Mappa concettuale delle Fonti e Forme di Energia"
              className="max-h-[520px] w-auto rounded-lg border border-slate-200 bg-white shadow-xs"
            />
            <p className="mt-2 text-xs text-slate-500">
              Schema di riferimento: tutte le 10 fonti della mappa hanno il proprio laboratorio interattivo qui sotto.
            </p>
          </div>
        )}

        {/* Filter Bar */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-100 p-1">
            {[
              { id: 'tutte', label: 'Tutte le Fonti (10)' },
              { id: 'rinnovabile', label: 'Rinnovabili (4)' },
              { id: 'esauribile', label: 'Esauribili / Minerali (4)' },
              { id: 'nuova', label: 'Recupero & Nuove Fonti (2)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFilterChange(tab.id as typeof activeFilter)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  activeFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredSources.map((source) => {
          const Icon = SOURCE_ICONS[source.id];
          const isCompleted = Boolean(completedLabs[source.id]);

          return (
            <button
              key={source.id}
              type="button"
              onClick={() => onSelectSource(source.id)}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left transition-all hover:border-slate-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 transition-transform group-hover:scale-105"
                    style={{ color: source.accentColor }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Costruito</span>
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <span>{source.categoryLabel}</span>
                  {source.dependsOnSun && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-700">Dipende dal Sole</span>
                    </>
                  )}
                </div>

                <h2 className="mt-1 text-xl font-bold text-slate-900">{source.name}</h2>
                <p className="mt-1 text-sm text-slate-600">{source.subtitle}</p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5">
                <div className="text-xs font-medium text-slate-500 truncate max-w-[180px]">
                  {source.forms.slice(0, 3).join(' → ')}
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:translate-x-0.5 transition-transform whitespace-nowrap shrink-0">
                  <span>Gioca</span>
                  <Play className="h-3.5 w-3.5 fill-current" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
