import { useState } from 'react';
import { Droplets, Lightbulb, Waves } from 'lucide-react';
import { BuildSlotPlaceholder, ClickableHotspot, type SimProps } from './SimShared';

export function HydroSim({ builtParts, onBuildPart, onDiscover }: SimProps) {
  const [damFlow, setDamFlow] = useState(65);
  const [houseLightOn, setHouseLightOn] = useState(true);

  const hasDiga = Boolean(builtParts.diga);
  const hasTurbine = Boolean(builtParts.turbina);
  const hasHouse = Boolean(builtParts.casa);
  const allBuilt = hasDiga && hasTurbine && hasHouse;

  const isFlowing = hasDiga && damFlow > 0;
  const turbineRpm = hasDiga && hasTurbine ? Math.round((damFlow / 100) * 600) : 0;
  const powerKw = hasDiga && hasTurbine ? Math.round((damFlow / 100) * 450) : 0;
  const houseLit = allBuilt && damFlow >= 10 && houseLightOn;

  const spinDuration = turbineRpm > 0 ? Math.max(0.25, 2.2 - (damFlow / 100) * 1.9) : 0;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
      <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-semibold text-sky-800">
            Energia Potenziale → Cinetica → Meccanica → Elettrica
          </div>
          <span className="text-xs font-medium text-slate-500">
            Clicca sugli oggetti con <strong className="text-slate-900">?</strong> per scoprire gli inventori
          </span>
        </div>

        <svg
          viewBox="0 0 760 430"
          className="w-full h-auto rounded-xl border border-slate-200"
          role="img"
          aria-label="Simulazione diga e centrale idroelettrica"
        >
          <defs>
            <linearGradient id="hydroSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#f0f9ff" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="760" height="430" fill="url(#hydroSky)" />
          {/* Mountains */}
          <polygon points="0,330 110,95 270,330" fill="#64748b" />
          <polygon points="95,128 110,95 145,150 118,142" fill="#f8fafc" />
          {/* Ground */}
          <rect x="0" y="330" width="760" height="100" fill="#4ade80" />
          {/* River exit */}
          <path d="M295 360 Q450 355 760 365 L760 410 L295 410 Z" fill="#0ea5e9" opacity="0.65" />

          {/* 1. DAM & RESERVOIR */}
          {!hasDiga ? (
            <BuildSlotPlaceholder
              x={35}
              y={145}
              width={220}
              height={175}
              label="Diga e Condotta"
              stepNumber={1}
              onClick={() => onBuildPart('diga')}
            />
          ) : (
            <ClickableHotspot
              x={185}
              y={162}
              label="Diga e Bacino Idrico"
              badgeColor="#0284c7"
              onClick={() => onDiscover('diga_potenziale')}
            >
              <g>
                {/* High reservoir water */}
                <path d="M0 175 L180 175 L180 285 L0 285 Z" fill="#0284c7" opacity="0.88" />
                <path
                  d="M0 175 Q45 169 90 175 T180 175"
                  fill="none"
                  stroke="#bae6fd"
                  strokeWidth="3"
                />
                {/* Concrete Dam wall */}
                <polygon points="172,150 220,150 245,335 172,335" fill="#94a3b8" stroke="#475569" strokeWidth="3" />
                {/* Sluice gate opening */}
                <rect x="200" y="255" width="38" height="36" fill="#0f172a" />
                {/* Movable gate */}
                <rect
                  x="202"
                  y={255 - (damFlow / 100) * 28}
                  width="34"
                  height="32"
                  fill="#475569"
                  stroke="#e2e8f0"
                  strokeWidth="2"
                />
                {/* Penstock pipe to turbine */}
                <path d="M235 275 L310 315" stroke="#334155" strokeWidth="20" strokeLinecap="round" />
                {isFlowing && (
                  <path
                    d="M225 270 L312 316"
                    stroke="#38bdf8"
                    strokeWidth={Math.max(4, (damFlow / 100) * 14)}
                    strokeDasharray="12 10"
                    className={damFlow > 50 ? 'animate-flow-fast' : 'animate-flow'}
                  />
                )}
              </g>
            </ClickableHotspot>
          )}

          {/* 2. TURBINE & GENERATOR */}
          {!hasTurbine ? (
            <BuildSlotPlaceholder
              x={290}
              y={245}
              width={150}
              height={110}
              label="Turbina & Dinamo"
              stepNumber={2}
              onClick={() => onBuildPart('turbina')}
            />
          ) : (
            <ClickableHotspot
              x={415}
              y={252}
              label="Turbina Pelton & Generatore"
              badgeColor="#0369a1"
              onClick={() => onDiscover('turbina_pelton')}
            >
              <g>
                {/* Power station housing */}
                <rect x="295" y="250" width="135" height="95" rx="10" fill="#e2e8f0" stroke="#475569" strokeWidth="3" />
                {/* Spinning Pelton wheel */}
                <g transform="translate(340, 305)">
                  <g
                    style={{
                      animation: spinDuration > 0 ? `spin-smooth ${spinDuration}s linear infinite` : 'none',
                    }}
                  >
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                      <line
                        key={deg}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="-24"
                        stroke="#0284c7"
                        strokeWidth="5"
                        strokeLinecap="round"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    <circle r="10" fill="#0f172a" />
                  </g>
                </g>

                {/* Generator Dynamo block */}
                <rect x="378" y="278" width="40" height="48" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                <circle
                  cx="398"
                  cy="302"
                  r="9"
                  fill={powerKw > 0 ? '#facc15' : '#475569'}
                />
              </g>
            </ClickableHotspot>
          )}

          {/* Power Line from Generator to House */}
          {hasTurbine && hasHouse && (
            <g>
              {/* Pylon */}
              <line x1="485" y1="220" x2="485" y2="335" stroke="#475569" strokeWidth="5" />
              <line x1="468" y1="232" x2="502" y2="232" stroke="#475569" strokeWidth="4" />
              <path
                d="M418 282 L485 232 L595 258"
                fill="none"
                stroke={powerKw > 0 ? '#f59e0b' : '#64748b'}
                strokeWidth="4"
              />
              {houseLit && (
                <path
                  d="M418 282 L485 232 L595 258"
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth="3"
                  strokeDasharray="8 10"
                  className={damFlow > 50 ? 'animate-flow-fast' : 'animate-flow'}
                />
              )}
            </g>
          )}

          {/* 3. HOUSE */}
          {!hasHouse ? (
            <BuildSlotPlaceholder
              x={575}
              y={215}
              width={150}
              height={130}
              label="Rete & Casa"
              stepNumber={3}
              onClick={() => onBuildPart('casa')}
            />
          ) : (
            <ClickableHotspot
              x={710}
              y={220}
              label="Generatore & Rete di Casa"
              badgeColor="#0f172a"
              onClick={() => onDiscover('generatore_faraday')}
            >
              <g>
                <rect x="585" y="245" width="136" height="100" rx="6" fill="#fff7ed" stroke="#9a3412" strokeWidth="3" />
                <polygon points="574,250 653,190 732,250" fill="#b45309" stroke="#7c2d12" strokeWidth="3" />
                <rect x="606" y="290" width="32" height="55" rx="3" fill="#7c2d12" />

                {/* Interactive window + switch inside house */}
                <rect
                  x="652"
                  y="266"
                  width="50"
                  height="46"
                  rx="6"
                  fill={houseLit ? '#fde047' : '#1e293b'}
                  stroke="#7c2d12"
                  strokeWidth="3"
                />
                {houseLit && <circle cx="677" cy="289" r="34" fill="#fde047" opacity="0.32" />}
                <line x1="677" y1="266" x2="677" y2="312" stroke="#7c2d12" strokeWidth="2" />
                <line x1="652" y1="289" x2="702" y2="289" stroke="#7c2d12" strokeWidth="2" />
              </g>
            </ClickableHotspot>
          )}

          {/* Live Readout Box */}
          <g transform="translate(530, 18)">
            <rect width="212" height="56" rx="10" fill="#ffffff" fillOpacity="0.92" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="12" y="22" fontSize="11" fontWeight="600" fill="#475569">
              TURBINA & ENERGIA PRODOTTA
            </text>
            <text
              x="12"
              y="43"
              fontSize="16"
              fontWeight="700"
              fill="#0f172a"
              fontFamily="JetBrains Mono, monospace"
            >
              {turbineRpm} RPM · {powerKw} kW
            </text>
          </g>
        </svg>
      </div>

      {/* Control Panel */}
      <div className="lg:col-span-4 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base font-bold text-slate-900">Pannello di Controllo</h4>
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                houseLit
                  ? 'bg-emerald-50 text-emerald-800'
                  : powerKw > 0
                  ? 'bg-sky-50 text-sky-800'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {!allBuilt ? 'IN COSTRUZIONE' : houseLit ? 'LUCE ACCESA' : powerKw > 0 ? 'CENTRALE PRONTA' : 'DIGA CHIUSA'}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                <label htmlFor="dam-slider" className="inline-flex items-center gap-1.5">
                  <Waves className="h-4 w-4 text-sky-600" />
                  <span>Flusso della Diga</span>
                </label>
                <span className="font-mono tabular-nums text-sky-700">{damFlow}%</span>
              </div>
              <input
                id="dam-slider"
                type="range"
                min={0}
                max={100}
                value={damFlow}
                onChange={(e) => setDamFlow(Number(e.target.value))}
                className="mt-2 h-2.5 w-full cursor-pointer accent-sky-600"
              />
              <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                <span>Chiusa (0 L/s)</span>
                <span>Massima portata</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-2">
                <Lightbulb className={`h-5 w-5 ${houseLit ? 'text-amber-500' : 'text-slate-400'}`} />
                <div>
                  <div className="text-sm font-semibold text-slate-900">Interruttore Casa</div>
                  <div className="text-xs text-slate-500">
                    {!allBuilt
                      ? 'Completa la centrale'
                      : damFlow < 10
                      ? 'Apri la diga per avere corrente!'
                      : houseLightOn
                      ? 'Luce accesa in casa'
                      : 'Interruttore spento'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHouseLightOn((v) => !v)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  houseLightOn
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {houseLightOn ? 'SPEGNI' : 'ACCENDI'}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Droplets className="h-4 w-4 text-sky-600" />
            <span>Come funziona?</span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            {!allBuilt
              ? 'Monta diga, turbina e casa per collegare il circuito idroelettrico.'
              : damFlow === 0
              ? 'La diga trattiene l’acqua in alto (Energia Potenziale). Apri la paratoia per farla scendere!'
              : `L’acqua scende veloce, fa girare la turbina Pelton a ${turbineRpm} giri/min e il generatore produce ${powerKw} kW per illuminare la casa!`}
          </p>
        </div>
      </div>
    </div>
  );
}
