import { useEffect, useState } from 'react';
import { BatteryCharging, Droplets, Lightbulb, Sun, Thermometer } from 'lucide-react';
import { BuildSlotPlaceholder, ClickableHotspot, type SimProps } from './SimShared';

type SolarMode = 'elettricita' | 'acqua_calda';

export function SolarSim({ builtParts, onBuildPart, onDiscover }: SimProps) {
  const [sunBrightness, setSunBrightness] = useState(75);
  const [mode, setMode] = useState<SolarMode>('elettricita');
  const [batteryLevel, setBatteryLevel] = useState(52);
  const [houseLightOn, setHouseLightOn] = useState(true);
  const [showerOn, setShowerOn] = useState(true);

  const hasPanel = Boolean(builtParts.pannello);
  const hasStorage = Boolean(builtParts.accumulo);
  const hasHouse = Boolean(builtParts.utenza);
  const allBuilt = hasPanel && hasStorage && hasHouse;

  const generatedWatts = hasPanel ? Math.round((sunBrightness / 100) * 3200) : 0;
  const waterTemp = hasPanel
    ? Math.round(18 + (sunBrightness / 100) * 56 - (showerOn && hasHouse ? 8 : 0))
    : 18;

  useEffect(() => {
    if (mode !== 'elettricita' || !hasStorage) return;
    const interval = window.setInterval(() => {
      setBatteryLevel((prev) => {
        const chargeRate = hasPanel ? (sunBrightness / 100) * 2.4 : 0;
        const drainRate = hasHouse && houseLightOn ? 1.0 : 0;
        const next = prev + chargeRate - drainRate;
        return Math.max(0, Math.min(100, Math.round(next * 10) / 10));
      });
    }, 350);
    return () => window.clearInterval(interval);
  }, [mode, hasPanel, hasStorage, hasHouse, sunBrightness, houseLightOn]);

  const canLightHouse = hasHouse && houseLightOn && ((hasPanel && sunBrightness > 10) || (hasStorage && batteryLevel > 2));
  const skyLightness = 18 + Math.round((sunBrightness / 100) * 76);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
      {/* Interactive Stage */}
      <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMode('elettricita')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                mode === 'elettricita'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BatteryCharging className="h-3.5 w-3.5 text-amber-600" />
              <span>Fotovoltaico (Elettricità)</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('acqua_calda')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                mode === 'acqua_calda'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Droplets className="h-3.5 w-3.5 text-sky-600" />
              <span>Solare Termico (Acqua Calda)</span>
            </button>
          </div>

          <span className="text-xs font-medium text-slate-500">
            Clicca sugli oggetti con <strong className="text-slate-900">?</strong> per scoprire gli inventori
          </span>
        </div>

        <svg
          viewBox="0 0 760 430"
          className="w-full h-auto rounded-xl border border-slate-200"
          role="img"
          aria-label="Simulazione energia solare interattiva"
        >
          <defs>
            <linearGradient id="solarSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`hsl(204, 82%, ${Math.max(20, skyLightness - 15)}%)`} />
              <stop offset="100%" stopColor={`hsl(198, 88%, ${Math.min(95, skyLightness + 8)}%)`} />
            </linearGradient>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fde047" stopOpacity="0.95" />
              <stop offset="65%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Sky & Meadow */}
          <rect x="0" y="0" width="760" height="330" fill="url(#solarSky)" />
          <rect x="0" y="325" width="760" height="105" fill="#86efac" />
          <path d="M0 328 Q180 308 380 326 T760 322 L760 430 L0 430 Z" fill="#4ade80" />

          {/* Interactive Sun */}
          <g transform={`translate(115, ${155 - (sunBrightness / 100) * 75})`}>
            <circle r={42 + (sunBrightness / 100) * 46} fill="url(#sunGlow)" />
            <circle
              r={26 + (sunBrightness / 100) * 10}
              fill={sunBrightness > 15 ? '#facc15' : '#94a3b8'}
              stroke="#f59e0b"
              strokeWidth="3"
            />
            {sunBrightness > 15 &&
              [0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <line
                  key={deg}
                  x1="0"
                  y1="-42"
                  x2="0"
                  y2={-46 - (sunBrightness / 100) * 14}
                  stroke="#fde047"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  transform={`rotate(${deg})`}
                />
              ))}
          </g>

          {/* Animated Sun Rays toward Panel */}
          {sunBrightness > 10 && hasPanel && (
            <g opacity={0.25 + (sunBrightness / 100) * 0.7}>
              {[0, 1, 2].map((i) => (
                <line
                  key={i}
                  x1={140 + i * 18}
                  y1={165 - (sunBrightness / 100) * 65 + i * 12}
                  x2={275 + i * 26}
                  y2={205 + i * 10}
                  stroke="#fde047"
                  strokeWidth="4"
                  strokeDasharray="10 8"
                  className={sunBrightness > 55 ? 'animate-flow-fast' : 'animate-flow'}
                />
              ))}
            </g>
          )}

          {/* Solar Panel Mount Stand */}
          <line x1="295" y1="255" x2="295" y2="335" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
          <line x1="355" y1="265" x2="355" y2="335" stroke="#475569" strokeWidth="8" strokeLinecap="round" />

          {/* 1. SOLAR PANEL */}
          {!hasPanel ? (
            <BuildSlotPlaceholder
              x={235}
              y={185}
              width={170}
              height={85}
              label={mode === 'elettricita' ? 'Pannello Solare' : 'Collettore Termico'}
              stepNumber={1}
              onClick={() => onBuildPart('pannello')}
            />
          ) : (
            <ClickableHotspot
              x={392}
              y={194}
              label={mode === 'elettricita' ? 'Pannello Fotovoltaico' : 'Pannello Solare Termico'}
              badgeColor="#d97706"
              onClick={() =>
                onDiscover(mode === 'elettricita' ? 'pannello_fotovoltaico' : 'collettore_termico')
              }
            >
              {mode === 'elettricita' ? (
                <g>
                  <polygon
                    points="245,205 385,182 405,250 265,273"
                    fill="#1e3a8a"
                    stroke="#e2e8f0"
                    strokeWidth="4"
                  />
                  {/* Photovoltaic grid lines */}
                  <line x1="280" y1="199" x2="300" y2="267" stroke="#60a5fa" strokeWidth="1.5" />
                  <line x1="315" y1="193" x2="335" y2="261" stroke="#60a5fa" strokeWidth="1.5" />
                  <line x1="350" y1="187" x2="370" y2="255" stroke="#60a5fa" strokeWidth="1.5" />
                  <line x1="255" y1="238" x2="395" y2="215" stroke="#60a5fa" strokeWidth="1.5" />
                  {sunBrightness > 20 && (
                    <polygon
                      points="245,205 385,182 405,250 265,273"
                      fill="#fbbf24"
                      opacity={(sunBrightness / 100) * 0.18}
                    />
                  )}
                </g>
              ) : (
                <g>
                  {/* Thermal black collector box with serpentine pipes */}
                  <polygon
                    points="245,205 385,182 405,250 265,273"
                    fill="#0f172a"
                    stroke="#cbd5e1"
                    strokeWidth="4"
                  />
                  <path
                    d="M265 255 L280 208 L302 252 L318 202 L340 245 L356 196 L378 238"
                    fill="none"
                    stroke={sunBrightness > 40 ? '#ef4444' : '#38bdf8'}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              )}
            </ClickableHotspot>
          )}

          {/* Connecting Cables / Pipes from Panel to Storage */}
          {hasPanel && hasStorage && (
            <g>
              <path
                d="M365 268 L365 305 L445 305"
                fill="none"
                stroke={mode === 'elettricita' ? '#f59e0b' : '#ef4444'}
                strokeWidth="6"
                strokeLinecap="round"
              />
              {sunBrightness > 12 && (
                <path
                  d="M365 268 L365 305 L445 305"
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                  className={sunBrightness > 55 ? 'animate-flow-fast' : 'animate-flow'}
                />
              )}
            </g>
          )}

          {/* 2. STORAGE: BATTERY OR HOT WATER TANK */}
          {!hasStorage ? (
            <BuildSlotPlaceholder
              x={440}
              y={235}
              width={110}
              height={105}
              label={mode === 'elettricita' ? 'Batteria' : 'Serbatoio'}
              stepNumber={2}
              onClick={() => onBuildPart('accumulo')}
            />
          ) : mode === 'elettricita' ? (
            <ClickableHotspot
              x={534}
              y={246}
              label="Batteria di Accumulo"
              badgeColor="#0f766e"
              onClick={() => onDiscover('batteria_volta')}
            >
              <g>
                <rect x="445" y="242" width="90" height="94" rx="12" fill="#1e293b" stroke="#475569" strokeWidth="3" />
                <rect x="472" y="232" width="36" height="10" rx="4" fill="#64748b" />
                {/* Charge fill */}
                <rect x="455" y="254" width="70" height="70" rx="6" fill="#0f172a" />
                <rect
                  x="455"
                  y={254 + (70 - (70 * batteryLevel) / 100)}
                  width="70"
                  height={(70 * batteryLevel) / 100}
                  rx="6"
                  fill={batteryLevel > 25 ? '#22c55e' : '#ef4444'}
                />
                <text
                  x="490"
                  y="293"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="14"
                  fontWeight="700"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {Math.round(batteryLevel)}%
                </text>
              </g>
            </ClickableHotspot>
          ) : (
            <ClickableHotspot
              x={534}
              y={246}
              label="Serbatoio Acqua Calda"
              badgeColor="#dc2626"
              onClick={() => onDiscover('collettore_termico')}
            >
              <g>
                <rect x="450" y="240" width="84" height="98" rx="16" fill="#e2e8f0" stroke="#64748b" strokeWidth="3" />
                {/* Water inside tank colored by temperature */}
                <rect
                  x="456"
                  y="250"
                  width="72"
                  height="80"
                  rx="10"
                  fill={waterTemp >= 45 ? '#ef4444' : waterTemp >= 30 ? '#f97316' : '#38bdf8'}
                  opacity="0.88"
                />
                <text
                  x="492"
                  y="295"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="15"
                  fontWeight="700"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {waterTemp}°C
                </text>
              </g>
            </ClickableHotspot>
          )}

          {/* Cable/Pipe from Storage to House */}
          {hasStorage && hasHouse && (
            <g>
              <path
                d="M535 305 L585 305"
                fill="none"
                stroke={mode === 'elettricita' ? '#f59e0b' : waterTemp > 35 ? '#ef4444' : '#38bdf8'}
                strokeWidth="6"
              />
              {((mode === 'elettricita' && canLightHouse) || (mode === 'acqua_calda' && showerOn)) && (
                <path
                  d="M535 305 L585 305"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  className="animate-flow"
                />
              )}
            </g>
          )}

          {/* 3. HOUSE / SHOWER */}
          {!hasHouse ? (
            <BuildSlotPlaceholder
              x={585}
              y={205}
              width={145}
              height={135}
              label="Casa"
              stepNumber={3}
              onClick={() => onBuildPart('utenza')}
            />
          ) : (
            <ClickableHotspot
              x={710}
              y={210}
              label="Casa & Lampadina"
              badgeColor="#0f172a"
              onClick={() => onDiscover('lampadina_edison')}
            >
              <g>
                {/* House body */}
                <rect x="590" y="232" width="132" height="106" rx="6" fill="#fef3c7" stroke="#92400e" strokeWidth="3" />
                <polygon points="578,236 656,178 734,236" fill="#dc2626" stroke="#991b1b" strokeWidth="3" />
                <rect x="612" y="280" width="32" height="58" rx="3" fill="#78350f" />

                {mode === 'elettricita' ? (
                  <g>
                    {/* Lit window */}
                    <rect
                      x="658"
                      y="258"
                      width="48"
                      height="44"
                      rx="6"
                      fill={canLightHouse ? '#fde047' : '#334155'}
                      stroke="#78350f"
                      strokeWidth="3"
                    />
                    {canLightHouse && (
                      <circle cx="682" cy="280" r="30" fill="#fde047" opacity="0.35" />
                    )}
                    <line x1="682" y1="258" x2="682" y2="302" stroke="#78350f" strokeWidth="2" />
                    <line x1="658" y1="280" x2="706" y2="280" stroke="#78350f" strokeWidth="2" />
                  </g>
                ) : (
                  <g>
                    {/* Hot water shower preview inside window */}
                    <rect x="656" y="252" width="52" height="54" rx="6" fill="#e0f2fe" stroke="#0369a1" strokeWidth="2.5" />
                    <path d="M674 260 L692 260 L687 268 L679 268 Z" fill="#475569" />
                    {showerOn && (
                      <g stroke={waterTemp >= 40 ? '#ef4444' : '#0284c7'} strokeWidth="2" strokeDasharray="3 3">
                        <line x1="678" y1="272" x2="674" y2="298" className="animate-flow" />
                        <line x1="683" y1="272" x2="683" y2="298" className="animate-flow" />
                        <line x1="688" y1="272" x2="692" y2="298" className="animate-flow" />
                      </g>
                    )}
                    {showerOn && waterTemp >= 40 && (
                      <text x="682" y="246" textAnchor="middle" fontSize="11" fontWeight="700" fill="#dc2626">
                        VAPORE CALDO
                      </text>
                    )}
                  </g>
                )}
              </g>
            </ClickableHotspot>
          )}

          {/* Status Banner inside SVG */}
          <g transform="translate(18, 18)">
            <rect width="205" height="54" rx="10" fill="#ffffff" fillOpacity="0.92" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="12" y="22" fontSize="11" fontWeight="600" fill="#475569">
              {mode === 'elettricita' ? 'POTENZA FOTOVOLTAICA' : 'TEMPERATURA BOILER'}
            </text>
            <text
              x="12"
              y="43"
              fontSize="18"
              fontWeight="700"
              fill="#0f172a"
              fontFamily="JetBrains Mono, monospace"
            >
              {mode === 'elettricita' ? `${generatedWatts} W` : `${waterTemp} °C`}
            </text>
          </g>
        </svg>
      </div>

      {/* Control & Concept Deck */}
      <div className="lg:col-span-4 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base font-bold text-slate-900">Pannello di Controllo</h4>
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                allBuilt && sunBrightness > 15
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {!allBuilt ? 'IN COSTRUZIONE' : sunBrightness > 15 ? 'ATTIVO' : 'NOTTE / OMBRA'}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                <label htmlFor="sun-slider" className="inline-flex items-center gap-1.5">
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span>Luminosità del Sole</span>
                </label>
                <span className="font-mono tabular-nums text-amber-700">{sunBrightness}%</span>
              </div>
              <input
                id="sun-slider"
                type="range"
                min={0}
                max={100}
                value={sunBrightness}
                onChange={(e) => setSunBrightness(Number(e.target.value))}
                className="mt-2 h-2.5 w-full cursor-pointer accent-amber-500"
              />
              <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                <span>Notte / Nuvoloso</span>
                <span>Mezzogiorno</span>
              </div>
            </div>

            {mode === 'elettricita' ? (
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className={`h-5 w-5 ${canLightHouse ? 'text-amber-500' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Luce in Casa</div>
                    <div className="text-xs text-slate-500">
                      {canLightHouse ? 'Lampada accesa' : 'Lampada spenta'}
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
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-2">
                  <Thermometer className={`h-5 w-5 ${waterTemp >= 40 ? 'text-red-500' : 'text-sky-500'}`} />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Rubinetto Doccia</div>
                    <div className="text-xs text-slate-500">
                      {showerOn ? `Acqua a ${waterTemp}°C` : 'Rubinetto chiuso'}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowerOn((v) => !v)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                    showerOn
                      ? 'bg-sky-600 text-white hover:bg-sky-700'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {showerOn ? 'CHIUDI' : 'APRI'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Telemetry & Learning Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h5 className="text-sm font-bold text-slate-900">Cosa succede ora?</h5>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            {!allBuilt
              ? 'Completa tutti e 3 i pezzi dell’impianto per far arrivare l’energia del Sole fino alla casa!'
              : mode === 'elettricita'
              ? sunBrightness > 15
                ? `I fotoni del Sole colpiscono il silicio producendo ${generatedWatts} W: la batteria si ricarica al ${Math.round(
                    batteryLevel
                  )}% e illumina la casa!`
                : `C’è poca luce solare, ma grazie alla batteria (${Math.round(
                    batteryLevel
                  )}%) la casa resta illuminata finché c’è carica!`
              : `Il pannello scuro assorbe i raggi solari trasformandoli in calore: l’acqua nel serbatoio raggiunge ${waterTemp} °C!`}
          </p>
        </div>
      </div>
    </div>
  );
}
