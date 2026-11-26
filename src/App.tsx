import { useState } from 'react';
import {
  Atom,
  BookOpen,
  Droplets,
  Flame,
  Fuel,
  Gauge,
  LayoutGrid,
  Mountain,
  Recycle,
  Sun,
  Volume2,
  VolumeX,
  Wind,
  Zap,
} from 'lucide-react';
import { BuildStageChecklist } from './components/BuildStageChecklist';
import { DiscoveryModal } from './components/DiscoveryModal';
import { EnergyMapOverview } from './components/EnergyMapOverview';
import { QuizModal } from './components/QuizModal';
import { CoalSim, MethaneSim, OilSim } from './components/sims/FossilSims';
import { HydroSim } from './components/sims/HydroSim';
import { GeoSim, HydrogenSim, WasteSim } from './components/sims/NewEnergySims';
import { NuclearSim } from './components/sims/NuclearSim';
import { SolarSim } from './components/sims/SolarSim';
import { WindSim } from './components/sims/WindSim';
import { ENERGY_SOURCES, type DiscoveryFact, type EnergyId } from './data/energyData';
import { playBuildSnapSound, playDiscoveryPopSound, playPowerCompleteSound } from './utils/soundEffects';

const NAV_ICONS: Record<EnergyId, typeof Sun> = {
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

function createInitialBuiltState(): Record<EnergyId, Record<string, boolean>> {
  const initial = {} as Record<EnergyId, Record<string, boolean>>;
  for (const src of ENERGY_SOURCES) {
    const parts: Record<string, boolean> = {};
    for (const p of src.buildParts) {
      parts[p.id] = true;
    }
    initial[src.id] = parts;
  }
  return initial;
}

export default function App() {
  const [viewMode, setViewMode] = useState<'lab' | 'mappa'>('lab');
  const [activeEnergyId, setActiveEnergyId] = useState<EnergyId>('sole');
  const [mapFilter, setMapFilter] = useState<'tutte' | 'rinnovabile' | 'esauribile' | 'nuova'>('tutte');
  const [builtBySource, setBuiltBySource] = useState<Record<EnergyId, Record<string, boolean>>>(
    createInitialBuiltState
  );
  const [activeDiscovery, setActiveDiscovery] = useState<DiscoveryFact | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const currentSource = ENERGY_SOURCES.find((s) => s.id === activeEnergyId) ?? ENERGY_SOURCES[0];
  const currentBuiltParts = builtBySource[currentSource.id];

  const completedLabs = ENERGY_SOURCES.reduce(
    (acc, src) => {
      acc[src.id] = src.buildParts.every((p) => builtBySource[src.id]?.[p.id]);
      return acc;
    },
    {} as Record<EnergyId, boolean>
  );

  const handleTogglePart = (partId: string) => {
    setBuiltBySource((prev) => {
      const prevParts = prev[currentSource.id];
      const nextVal = !prevParts[partId];
      const nextParts = { ...prevParts, [partId]: nextVal };

      if (nextVal) {
        const nowComplete = currentSource.buildParts.every((p) => nextParts[p.id]);
        if (nowComplete) {
          playPowerCompleteSound(soundEnabled);
        } else {
          playBuildSnapSound(soundEnabled);
        }
      }

      return {
        ...prev,
        [currentSource.id]: nextParts,
      };
    });
  };

  const handleBuildPartFromStage = (partId: string) => {
    setBuiltBySource((prev) => {
      const prevParts = prev[currentSource.id];
      if (prevParts[partId]) return prev;
      const nextParts = { ...prevParts, [partId]: true };
      const nowComplete = currentSource.buildParts.every((p) => nextParts[p.id]);
      if (nowComplete) {
        playPowerCompleteSound(soundEnabled);
      } else {
        playBuildSnapSound(soundEnabled);
      }
      return {
        ...prev,
        [currentSource.id]: nextParts,
      };
    });
  };

  const handleBuildAll = () => {
    const all: Record<string, boolean> = {};
    for (const p of currentSource.buildParts) {
      all[p.id] = true;
    }
    setBuiltBySource((prev) => ({ ...prev, [currentSource.id]: all }));
    playPowerCompleteSound(soundEnabled);
  };

  const handleResetBuild = () => {
    const none: Record<string, boolean> = {};
    for (const p of currentSource.buildParts) {
      none[p.id] = false;
    }
    setBuiltBySource((prev) => ({ ...prev, [currentSource.id]: none }));
    playBuildSnapSound(soundEnabled);
  };

  const handleOpenDiscovery = (discoveryId: string) => {
    const fact = currentSource.discoveries[discoveryId];
    if (fact) {
      playDiscoveryPopSound(soundEnabled);
      setActiveDiscovery(fact);
    }
  };

  const handleSelectFromMap = (id: EnergyId) => {
    setActiveEnergyId(id);
    setViewMode('lab');
  };

  const openFilteredMap = (filter: 'tutte' | 'rinnovabile' | 'esauribile' | 'nuova') => {
    setMapFilter(filter);
    setViewMode('mappa');
  };

  const simProps = {
    builtParts: currentBuiltParts,
    onBuildPart: handleBuildPartFromStage,
    onDiscover: handleOpenDiscovery,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => setViewMode('mappa')}
            className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer hover:text-amber-700 transition-colors"
          >
            Laboratorio Energia
          </button>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => openFilteredMap('tutte')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'mappa' && mapFilter === 'tutte' ? 'text-slate-900 underline underline-offset-4' : ''
              }`}
            >
              Mappa Fonti
            </button>
            <button
              type="button"
              onClick={() => openFilteredMap('rinnovabile')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'mappa' && mapFilter === 'rinnovabile' ? 'text-slate-900 underline underline-offset-4' : ''
              }`}
            >
              Rinnovabili
            </button>
            <button
              type="button"
              onClick={() => openFilteredMap('esauribile')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'mappa' && mapFilter === 'esauribile' ? 'text-slate-900 underline underline-offset-4' : ''
              }`}
            >
              Fossili & Atomo
            </button>
            <button
              type="button"
              onClick={() => openFilteredMap('nuova')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'mappa' && mapFilter === 'nuova' ? 'text-slate-900 underline underline-offset-4' : ''
              }`}
            >
              Nuove Fonti
            </button>
          </nav>

          {/* Zone 3: 1 primary CTA */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setQuizOpen(true)}
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sfida Quiz
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1360px] flex-1 px-4 sm:px-6 py-6 space-y-5">
        {viewMode === 'mappa' ? (
          <EnergyMapOverview
            completedLabs={completedLabs}
            onSelectSource={handleSelectFromMap}
            activeFilter={mapFilter}
            onFilterChange={setMapFilter}
          />
        ) : (
          <>
            {/* Workspace Toolbar: 10 Energy Source Tabs + Map/Sound controls */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3">
              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <button
                  type="button"
                  onClick={() => openFilteredMap('tutte')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 whitespace-nowrap shrink-0"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>Tutte le Fonti (Mappa)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSoundEnabled((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 whitespace-nowrap shrink-0"
                  aria-label={soundEnabled ? 'Disattiva effetti sonori' : 'Attiva effetti sonori'}
                >
                  {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-emerald-600" /> : <VolumeX className="h-3.5 w-3.5" />}
                  <span>{soundEnabled ? 'Suoni Attivi' : 'Suoni Spenti'}</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {ENERGY_SOURCES.map((source) => {
                  const Icon = NAV_ICONS[source.id];
                  const isActive = source.id === activeEnergyId;
                  return (
                    <button
                      key={source.id}
                      type="button"
                      onClick={() => setActiveEnergyId(source.id)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                      }`}
                    >
                      <Icon
                        className="h-3.5 w-3.5"
                        style={{ color: isActive ? '#fde047' : source.accentColor }}
                      />
                      <span>{source.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Simulation Header */}
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                  <span>{currentSource.categoryLabel}</span>
                  {currentSource.dependsOnSun && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-700">Fonte dipendente dal Sole</span>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <span>Forme: {currentSource.forms.join(' → ')}</span>
                </div>
                <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
                  {currentSource.name}: {currentSource.subtitle}
                </h1>
              </div>
            </div>

            {/* Interactive Assembly Checklist */}
            <BuildStageChecklist
              parts={currentSource.buildParts}
              builtParts={currentBuiltParts}
              onTogglePart={handleTogglePart}
              onBuildAll={handleBuildAll}
              onResetBuild={handleResetBuild}
            />

            {/* Active Simulation Interactive Stage + Controls */}
            {activeEnergyId === 'sole' && <SolarSim {...simProps} />}
            {activeEnergyId === 'acqua' && <HydroSim {...simProps} />}
            {activeEnergyId === 'atomo' && <NuclearSim {...simProps} />}
            {activeEnergyId === 'vento' && <WindSim {...simProps} />}
            {activeEnergyId === 'carbone' && <CoalSim {...simProps} />}
            {activeEnergyId === 'petrolio' && <OilSim {...simProps} />}
            {activeEnergyId === 'metano' && <MethaneSim {...simProps} />}
            {activeEnergyId === 'geotermico' && <GeoSim {...simProps} />}
            {activeEnergyId === 'rifiuti' && <WasteSim {...simProps} />}
            {activeEnergyId === 'idrogeno' && <HydrogenSim {...simProps} />}

            {/* Quick Discovery Cards Bar (accessible alongside SVG hotspots) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-600" aria-hidden="true" />
                <h3 className="text-sm font-bold text-slate-900">
                  Scoperte e Inventori in questo laboratorio (clicca per aprire la scheda)
                </h3>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                {Object.values(currentSource.discoveries).map((fact) => (
                  <button
                    key={fact.id}
                    type="button"
                    onClick={() => handleOpenDiscovery(fact.id)}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-left transition-colors hover:border-amber-300 hover:bg-amber-50/50 cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-medium text-amber-800">{fact.objectName}</div>
                      <div className="mt-0.5 text-sm font-bold text-slate-900 leading-snug">{fact.title}</div>
                    </div>
                    <div className="mt-2 text-xs font-medium text-slate-600">{fact.inventors}</div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        Laboratorio Interattivo dell’Energia · Costruisci, sperimenta e scopri le scienze
      </footer>

      <DiscoveryModal fact={activeDiscovery} onClose={() => setActiveDiscovery(null)} />
      <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} />
    </div>
  );
}
