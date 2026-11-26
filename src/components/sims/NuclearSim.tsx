import { useState } from 'react';
import { Atom, Flame, Power } from 'lucide-react';
import { BuildSlotPlaceholder, ClickableHotspot, type SimProps } from './SimShared';

export function NuclearSim({ builtParts, onBuildPart, onDiscover }: SimProps) {
  const [reactorOn, setReactorOn] = useState(true);
  const [controlRodsRaised, setControlRodsRaised] = useState(75); // 0 = all inserted (off), 100 = max power

  const hasReactor = Boolean(builtParts.reattore);
  const hasBoiler = Boolean(builtParts.caldaia);
  const hasCity = Boolean(builtParts.citta);
  const allBuilt = hasReactor && hasBoiler && hasCity;

  const effectivePower = hasReactor && reactorOn ? controlRodsRaised : 0;
  const coreTemp = Math.round(30 + (effectivePower / 100) * 290); // up to 320°C
  const isBoiling = coreTemp >= 100;
  const steamPressure = isBoiling ? Math.round(((coreTemp - 100) / 220) * 100) : 0;
  const outputMw = hasReactor && hasBoiler && isBoiling ? Math.round((steamPressure / 100) * 1100) : 0;
  const cityLit = allBuilt && outputMw > 40;
  const spinDuration = outputMw > 0 ? Math.max(0.22, 1.8 - (steamPressure / 100) * 1.55) : 0;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
      <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-semibold text-teal-800">
            Energia Nucleare → Termica (Acqua che bolle) → Meccanica → Elettrica
          </div>
          <span className="text-xs font-medium text-slate-500">
            Clicca sugli oggetti con <strong className="text-slate-900">?</strong> per scoprire gli inventori
          </span>
        </div>

        <svg
          viewBox="0 0 760 430"
          className="w-full h-auto rounded-xl border border-slate-200"
          role="img"
          aria-label="Simulazione centrale nucleare a fissione dell'uranio"
        >
          <defs>
            <linearGradient id="nucSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={cityLit ? '#0f172a' : '#1e293b'} />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>

          {/* Evening Sky so City lights shine clearly */}
          <rect x="0" y="0" width="760" height="335" fill="url(#nucSky)" />
          <rect x="0" y="335" width="760" height="95" fill="#1e293b" />
          <rect x="0" y="335" width="760" height="8" fill="#475569" />

          {/* 1. REACTOR CORE WITH URANIUM + WATER */}
          {!hasReactor ? (
            <BuildSlotPlaceholder
              x={30}
              y={140}
              width={185}
              height={190}
              label="Reattore ad Uranio"
              stepNumber={1}
              onClick={() => onBuildPart('reattore')}
            />
          ) : (
            <ClickableHotspot
              x={198}
              y={148}
              label="Barre di Uranio"
              badgeColor="#0d9488"
              onClick={() => onDiscover('fissione_uranio')}
            >
              <g>
                {/* Concrete containment dome */}
                <path
                  d="M35 335 L35 190 A88 80 0 0 1 211 190 L211 335 Z"
                  fill="#cbd5e1"
                  stroke="#64748b"
                  strokeWidth="4"
                />
                {/* Reactor pressure vessel filled with water */}
                <rect x="64" y="185" width="118" height="135" rx="18" fill="#0f172a" stroke="#475569" strokeWidth="4" />
                {/* Water inside vessel */}
                <rect
                  x="70"
                  y="200"
                  width="106"
                  height="114"
                  rx="12"
                  fill={isBoiling ? '#f97316' : effectivePower > 0 ? '#0ea5e9' : '#0284c7'}
                  opacity="0.78"
                />

                {/* Glowing Uranium Fuel Rods */}
                {[88, 118, 148].map((rx) => (
                  <g key={rx}>
                    <rect
                      x={rx}
                      y="235"
                      width="10"
                      height="68"
                      rx="3"
                      fill={effectivePower > 0 ? '#2dd4bf' : '#115e59'}
                      stroke="#99f6e4"
                      strokeWidth="1.5"
                    />
                    {effectivePower > 10 && (
                      <rect
                        x={rx - 3}
                        y="232"
                        width="16"
                        height="74"
                        rx="6"
                        fill="#2dd4bf"
                        opacity={(effectivePower / 100) * 0.35}
                      />
                    )}
                  </g>
                ))}

                {/* Movable Control Rods (lowered when OFF or low slider) */}
                {[102, 132].map((cx) => (
                  <rect
                    key={cx}
                    x={cx}
                    y={165 + (1 - effectivePower / 100) * 65}
                    width="9"
                    height="64"
                    rx="2"
                    fill="#334155"
                    stroke="#e2e8f0"
                    strokeWidth="1.5"
                  />
                ))}

                {/* Boiling Bubbles */}
                {isBoiling &&
                  [84, 108, 134, 158].map((bx, i) => (
                    <circle
                      key={bx}
                      cx={bx}
                      cy={265 - i * 10}
                      r="4"
                      fill="#ffffff"
                      className="animate-float-up"
                      style={{ animationDelay: `${i * 0.35}s` }}
                    />
                  ))}
              </g>
            </ClickableHotspot>
          )}

          {/* Hot water loop connecting Reactor to Boiler */}
          {hasReactor && hasBoiler && (
            <g>
              <path d="M182 225 L265 225" stroke="#ef4444" strokeWidth="10" />
              <path d="M265 295 L182 295" stroke="#0284c7" strokeWidth="10" />
              {effectivePower > 0 && (
                <path
                  d="M182 225 L265 225"
                  stroke="#fde047"
                  strokeWidth="4"
                  strokeDasharray="8 8"
                  className={effectivePower > 50 ? 'animate-flow-fast' : 'animate-flow'}
                />
              )}
            </g>
          )}

          {/* 2. STEAM BOILER & TURBINE */}
          {!hasBoiler ? (
            <BuildSlotPlaceholder
              x={255}
              y={155}
              width={180}
              height={175}
              label="Caldaia & Turbina"
              stepNumber={2}
              onClick={() => onBuildPart('caldaia')}
            />
          ) : (
            <ClickableHotspot
              x={418}
              y={162}
              label="Caldaia & Barre di Controllo"
              badgeColor="#ea580c"
              onClick={() => onDiscover('barre_controllo')}
            >
              <g>
                {/* Boiler tank */}
                <rect x="260" y="190" width="76" height="135" rx="14" fill="#e2e8f0" stroke="#64748b" strokeWidth="3" />
                <rect
                  x="266"
                  y="240"
                  width="64"
                  height="78"
                  rx="8"
                  fill={isBoiling ? '#38bdf8' : '#0284c7'}
                />
                {/* Boiling bubbles in boiler */}
                {isBoiling &&
                  [280, 298, 315].map((bx, idx) => (
                    <circle
                      key={bx}
                      cx={bx}
                      cy="265"
                      r="4.5"
                      fill="#ffffff"
                      className="animate-float-up"
                      style={{ animationDelay: `${idx * 0.4}s` }}
                    />
                  ))}

                {/* Steam pipe from Boiler to Turbine */}
                <path d="M298 190 L298 168 L378 168 L378 212" fill="none" stroke="#94a3b8" strokeWidth="12" strokeLinejoin="round" />
                {isBoiling && (
                  <path
                    d="M298 190 L298 168 L378 168 L378 212"
                    fill="none"
                    stroke="#f8fafc"
                    strokeWidth="5"
                    strokeDasharray="10 8"
                    className={steamPressure > 50 ? 'animate-flow-fast' : 'animate-flow'}
                  />
                )}

                {/* Turbine + Generator housing */}
                <rect x="348" y="212" width="90" height="82" rx="10" fill="#cbd5e1" stroke="#475569" strokeWidth="3" />
                <g transform="translate(382, 253)">
                  <g
                    style={{
                      animation: spinDuration > 0 ? `spin-smooth ${spinDuration}s linear infinite` : 'none',
                    }}
                  >
                    {[0, 60, 120, 180, 240, 300].map((deg) => (
                      <line
                        key={deg}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="-22"
                        stroke="#0f766e"
                        strokeWidth="5"
                        strokeLinecap="round"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    <circle r="8" fill="#0f172a" />
                  </g>
                </g>
                <circle cx="422" cy="253" r="10" fill={outputMw > 0 ? '#facc15' : '#475569'} />
              </g>
            </ClickableHotspot>
          )}

          {/* Power Line from Turbine to City */}
          {hasBoiler && hasCity && (
            <g>
              <path d="M438 250 L540 250" stroke={outputMw > 0 ? '#facc15' : '#64748b'} strokeWidth="4" />
              {cityLit && (
                <path
                  d="M438 250 L540 250"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                  className="animate-flow-fast"
                />
              )}
            </g>
          )}

          {/* 3. COOLING TOWER & CITY */}
          {!hasCity ? (
            <BuildSlotPlaceholder
              x={475}
              y={135}
              width={255}
              height={195}
              label="Torre & Città"
              stepNumber={3}
              onClick={() => onBuildPart('citta')}
            />
          ) : (
            <ClickableHotspot
              x={518}
              y={132}
              label="Torre di Raffreddamento e Città"
              badgeColor="#0f172a"
              onClick={() => onDiscover('torre_vapore')}
            >
              <g>
                {/* Cooling Tower releasing clean steam */}
                <path
                  d="M460 335 Q475 245 470 185 L525 185 Q520 245 535 335 Z"
                  fill="#e2e8f0"
                  stroke="#64748b"
                  strokeWidth="3"
                />
                {isBoiling && (
                  <g fill="#f8fafc" opacity="0.82">
                    <circle cx="495" cy="160" r="16" className="animate-float-up" />
                    <circle cx="512" cy="145" r="20" className="animate-float-up" style={{ animationDelay: '0.5s' }} />
                    <circle cx="486" cy="135" r="14" className="animate-float-up" style={{ animationDelay: '1s' }} />
                  </g>
                )}

                {/* City Skyline */}
                <g transform="translate(550, 0)">
                  {/* Building 1 */}
                  <rect x="0" y="210" width="54" height="125" fill="#334155" stroke="#475569" strokeWidth="2" />
                  {[225, 250, 275, 300].map((wy) =>
                    [10, 32].map((wx) => (
                      <rect
                        key={`${wx}-${wy}`}
                        x={wx}
                        y={wy}
                        width="12"
                        height="14"
                        rx="2"
                        fill={cityLit ? '#fde047' : '#0f172a'}
                      />
                    ))
                  )}

                  {/* Building 2 (tall) */}
                  <rect x="60" y="155" width="64" height="180" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                  {[172, 198, 224, 250, 276, 302].map((wy) =>
                    [72, 98].map((wx) => (
                      <rect
                        key={`${wx}-${wy}`}
                        x={wx}
                        y={wy}
                        width="14"
                        height="15"
                        rx="2"
                        fill={cityLit ? '#fef08a' : '#0f172a'}
                      />
                    ))
                  )}

                  {/* Building 3 */}
                  <rect x="130" y="230" width="56" height="105" fill="#334155" stroke="#475569" strokeWidth="2" />
                  {[245, 272, 299].map((wy) =>
                    [140, 162].map((wx) => (
                      <rect
                        key={`${wx}-${wy}`}
                        x={wx}
                        y={wy}
                        width="12"
                        height="14"
                        rx="2"
                        fill={cityLit ? '#fde047' : '#0f172a'}
                      />
                    ))
                  )}
                </g>
              </g>
            </ClickableHotspot>
          )}

          {/* Telemetry */}
          <g transform="translate(18, 18)">
            <rect width="250" height="54" rx="10" fill="#ffffff" fillOpacity="0.94" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="12" y="22" fontSize="11" fontWeight="600" fill="#475569">
              TEMPERATURA ACQUA · POTENZA
            </text>
            <text
              x="12"
              y="43"
              fontSize="16"
              fontWeight="700"
              fill={isBoiling ? '#dc2626' : '#0f172a'}
              fontFamily="JetBrains Mono, monospace"
            >
              {coreTemp} °C · {outputMw} MW
            </text>
          </g>
        </svg>
      </div>

      {/* Control Panel */}
      <div className="lg:col-span-4 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base font-bold text-slate-900">Sala Controllo Reattore</h4>
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                !allBuilt
                  ? 'bg-slate-100 text-slate-700'
                  : reactorOn && isBoiling
                  ? 'bg-emerald-50 text-emerald-800'
                  : reactorOn
                  ? 'bg-amber-50 text-amber-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {!allBuilt ? 'IN COSTRUZIONE' : reactorOn ? (isBoiling ? 'IN FUNZIONE' : 'RISCALDAMENTO') : 'CENTRALE SPENTA'}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <button
              type="button"
              onClick={() => setReactorOn((v) => !v)}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                reactorOn
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <Power className="h-4 w-4" />
              <span>{reactorOn ? 'Spegni Centrale Nucleare' : 'Accendi Centrale Nucleare'}</span>
            </button>

            <div>
              <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                <label htmlFor="rods-slider" className="inline-flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-teal-600" />
                  <span>Potenza Fissione Uranio</span>
                </label>
                <span className="font-mono tabular-nums text-teal-700">
                  {reactorOn ? `${controlRodsRaised}%` : '0%'}
                </span>
              </div>
              <input
                id="rods-slider"
                type="range"
                min={0}
                max={100}
                disabled={!reactorOn}
                value={controlRodsRaised}
                onChange={(e) => setControlRodsRaised(Number(e.target.value))}
                className="mt-2 h-2.5 w-full cursor-pointer accent-teal-600 disabled:opacity-40"
              />
              <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                <span>Barre inserite (freddo)</span>
                <span>Massima ebollizione</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Atom className="h-4 w-4 text-teal-600" />
            <span>Cosa succede nel reattore?</span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            {!allBuilt
              ? 'Monta il reattore ad uranio, la caldaia con la turbina e la città per avviare la centrale.'
              : !reactorOn
              ? 'Le barre di controllo sono tutte abbassate: assorbono i neutroni e fermano la fissione. La centrale è spenta e la città è al buio.'
              : isBoiling
              ? `L’uranio scalda l’acqua a ${coreTemp} °C! L’acqua bolle trasformandosi in vapore ad alta pressione che fa girare le turbine e illumina la città (${outputMw} MW).`
              : `L’acqua è a ${coreTemp} °C: alza ancora la potenza sopra i 100 °C per farla bollire e produrre vapore!`}
          </p>
        </div>
      </div>
    </div>
  );
}
