import { useState } from 'react';
import { Lightbulb, Sun, Wind } from 'lucide-react';
import { BuildSlotPlaceholder, ClickableHotspot, type SimProps } from './SimShared';

export function WindSim({ builtParts, onBuildPart, onDiscover }: SimProps) {
  // User controls how much the Sun heats / changes sea-land temperature difference
  const [sunSeaHeat, setSunSeaHeat] = useState(70);
  const [barnLightOn, setBarnLightOn] = useState(true);

  const hasTower = Boolean(builtParts.torre);
  const hasAlternator = Boolean(builtParts.alternatore);
  const hasBarn = Boolean(builtParts.stalla);
  const allBuilt = hasTower && hasAlternator && hasBarn;

  // Sea temperature stays cooler (14°C - 26°C) while land warms faster (18°C - 40°C)
  const seaTemp = Math.round(14 + (sunSeaHeat / 100) * 10);
  const landTemp = Math.round(16 + (sunSeaHeat / 100) * 24);
  const tempDiff = Math.max(0, landTemp - seaTemp); // 2°C up to 16°C contrast!
  const windKmh = Math.round(4 + (sunSeaHeat / 100) * 52);
  const powerKw = hasTower && hasAlternator && windKmh >= 12 ? Math.round((windKmh / 56) * 240) : 0;
  const barnLit = allBuilt && powerKw > 0 && barnLightOn;
  const spinDuration = hasTower && windKmh >= 8 ? Math.max(0.35, 3.0 - (windKmh / 56) * 2.6) : 0;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
      <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-semibold text-cyan-800">
            Sole + Mare/Terra → Correnti d’Aria (Vento) → Pale Eoliche → Elettricità nella Stalla
          </div>
          <span className="text-xs font-medium text-slate-500">
            Clicca sugli oggetti con <strong className="text-slate-900">?</strong> per scoprire gli inventori
          </span>
        </div>

        <svg
          viewBox="0 0 760 430"
          className="w-full h-auto rounded-xl border border-slate-200"
          role="img"
          aria-label="Simulazione energia eolica con correnti di aria fredda dal mare verso la terra"
        >
          <defs>
            <linearGradient id="windSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#ecfeff" />
            </linearGradient>
          </defs>

          {/* Sky */}
          <rect x="0" y="0" width="760" height="335" fill="url(#windSky)" />

          {/* Sun warming the scene */}
          <g transform={`translate(95, ${135 - (sunSeaHeat / 100) * 55})`}>
            <circle r={24 + (sunSeaHeat / 100) * 14} fill="#facc15" opacity="0.28" />
            <circle r={20 + (sunSeaHeat / 100) * 6} fill="#fde047" stroke="#f59e0b" strokeWidth="2.5" />
          </g>

          {/* Left: Cool Sea */}
          <ClickableHotspot
            x={160}
            y={305}
            label="Mare e Correnti d'Aria"
            badgeColor="#0284c7"
            onClick={() => onDiscover('correnti_vento')}
          >
            <g>
              <path d="M0 325 Q90 315 180 328 L235 340 L235 430 L0 430 Z" fill="#0284c7" />
              <path d="M15 352 Q55 344 95 352 T175 352" fill="none" stroke="#7dd3fc" strokeWidth="3" />
              <text x="85" y="395" textAnchor="middle" fill="#e0f2fe" fontSize="13" fontWeight="700">
                MARE ({seaTemp}°C)
              </text>
            </g>
          </ClickableHotspot>

          {/* Right: Green Field */}
          <path d="M210 335 Q360 308 760 322 L760 430 L210 430 Z" fill="#4ade80" />
          <text x="410" y="405" textAnchor="middle" fill="#14532d" fontSize="12" fontWeight="700">
            PRATO RISCALDATO ({landTemp}°C)
          </text>

          {/* Thermal Air Convection Arrows: Cold air over sea rushing onto land, warm air rising! */}
          <g>
            {/* Cold air sitting over sea & moving right */}
            <path
              d="M55 280 C130 285, 220 272, 315 245"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth={3 + (sunSeaHeat / 100) * 4}
              strokeDasharray="12 10"
              className={windKmh > 30 ? 'animate-flow-fast' : 'animate-flow'}
            />
            <path
              d="M75 235 C165 240, 245 228, 330 198"
              fill="none"
              stroke="#38bdf8"
              strokeWidth={2.5 + (sunSeaHeat / 100) * 3.5}
              strokeDasharray="12 10"
              className={windKmh > 30 ? 'animate-flow-fast' : 'animate-flow'}
            />
            <rect x="28" y="200" width="132" height="24" rx="6" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
            <text x="94" y="216" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#0369a1">
              ARIA FREDDA SUL MARE
            </text>

            {/* Warm air rising over land */}
            {sunSeaHeat > 20 && (
              <g>
                <path
                  d="M495 310 C505 260, 488 215, 502 165"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="3.5"
                  strokeDasharray="8 8"
                  className="animate-flow"
                />
                <rect x="440" y="135" width="122" height="22" rx="6" fill="#ffedd5" stroke="#ea580c" strokeWidth="1.5" />
                <text x="501" y="150" textAnchor="middle" fontSize="10" fontWeight="700" fill="#c2410c">
                  ARIA CALDA SALE ↑
                </text>
              </g>
            )}
          </g>

          {/* 1. WIND TURBINE TOWER & BLADES */}
          {!hasTower ? (
            <BuildSlotPlaceholder
              x={310}
              y={135}
              width={130}
              height={185}
              label="Pale Eoliche"
              stepNumber={1}
              onClick={() => onBuildPart('torre')}
            />
          ) : (
            <ClickableHotspot
              x={398}
              y={145}
              label="Pale Eoliche"
              badgeColor="#0284c7"
              onClick={() => onDiscover('pala_eolica')}
            >
              <g>
                {/* Second smaller turbine in background */}
                <line x1="275" y1="225" x2="275" y2="332" stroke="#cbd5e1" strokeWidth="6" />
                <g transform="translate(275, 225)">
                  <g
                    style={{
                      animation: spinDuration > 0 ? `spin-smooth ${spinDuration * 1.15}s linear infinite` : 'none',
                    }}
                  >
                    {[0, 120, 240].map((deg) => (
                      <polygon
                        key={deg}
                        points="-3,0 3,0 1,-42 -1,-42"
                        fill="#f8fafc"
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    <circle r="5" fill="#475569" />
                  </g>
                </g>

                {/* Primary foreground wind turbine */}
                <polygon points="369,185 381,185 388,332 362,332" fill="#f8fafc" stroke="#64748b" strokeWidth="2.5" />
                <g transform="translate(375, 185)">
                  <g
                    style={{
                      animation: spinDuration > 0 ? `spin-smooth ${spinDuration}s linear infinite` : 'none',
                    }}
                  >
                    {[0, 120, 240].map((deg) => (
                      <polygon
                        key={deg}
                        points="-5,0 5,0 2,-68 -2,-68"
                        fill="#ffffff"
                        stroke="#475569"
                        strokeWidth="2"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    <circle r="9" fill="#0f172a" />
                  </g>
                </g>
              </g>
            </ClickableHotspot>
          )}

          {/* 2. ALTERNATOR / TRANSFORMER BOX */}
          {!hasAlternator ? (
            <BuildSlotPlaceholder
              x={435}
              y={260}
              width={105}
              height={75}
              label="Generatore"
              stepNumber={2}
              onClick={() => onBuildPart('alternatore')}
            />
          ) : (
            <ClickableHotspot
              x={526}
              y={266}
              label="Alternatore e Motore Elettrico"
              badgeColor="#0f172a"
              onClick={() => onDiscover('motore_elettrico')}
            >
              <g>
                <rect x="445" y="275" width="84" height="58" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2.5" />
                <circle cx="472" cy="304" r="10" fill={powerKw > 0 ? '#facc15' : '#475569'} />
                <text x="502" y="308" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="700">
                  GEN
                </text>
              </g>
            </ClickableHotspot>
          )}

          {/* Cable to Barn */}
          {hasAlternator && hasBarn && (
            <g>
              <path d="M529 312 L585 312" stroke={powerKw > 0 ? '#f59e0b' : '#64748b'} strokeWidth="5" />
              {barnLit && (
                <path
                  d="M529 312 L585 312"
                  stroke="#fef08a"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  className="animate-flow-fast"
                />
              )}
            </g>
          )}

          {/* 3. BARN ("STALLA") */}
          {!hasBarn ? (
            <BuildSlotPlaceholder
              x={580}
              y={205}
              width={155}
              height={132}
              label="Stalla"
              stepNumber={3}
              onClick={() => onBuildPart('stalla')}
            />
          ) : (
            <g>
              {/* Red wooden barn */}
              <polygon points="582,250 660,192 738,250" fill="#991b1b" stroke="#7f1d1d" strokeWidth="3" />
              <rect x="590" y="250" width="140" height="86" fill="#dc2626" stroke="#7f1d1d" strokeWidth="3" />
              {/* Barn cross doors */}
              <rect x="610" y="280" width="44" height="56" fill="#78350f" stroke="#451a03" strokeWidth="2" />
              <line x1="610" y1="280" x2="654" y2="336" stroke="#b45309" strokeWidth="2" />
              <line x1="654" y1="280" x2="610" y2="336" stroke="#b45309" strokeWidth="2" />

              {/* Barn lit window + lantern */}
              <rect
                x="672"
                y="268"
                width="42"
                height="38"
                rx="4"
                fill={barnLit ? '#fde047' : '#1e293b'}
                stroke="#ffffff"
                strokeWidth="3"
              />
              {barnLit && <circle cx="693" cy="287" r="28" fill="#fde047" opacity="0.35" />}
              {/* Hayloft lamp */}
              <circle cx="660" cy="230" r="8" fill={barnLit ? '#fef08a' : '#475569'} stroke="#0f172a" strokeWidth="2" />
              <text x="660" y="356" textAnchor="middle" fill="#14532d" fontSize="12" fontWeight="700">
                STALLA FATTORIA
              </text>
            </g>
          )}

          {/* Telemetry */}
          <g transform="translate(510, 18)">
            <rect width="232" height="56" rx="10" fill="#ffffff" fillOpacity="0.94" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="12" y="22" fontSize="11" fontWeight="600" fill="#475569">
              VENTO · POTENZA EOLICA
            </text>
            <text
              x="12"
              y="43"
              fontSize="16"
              fontWeight="700"
              fill="#0f172a"
              fontFamily="JetBrains Mono, monospace"
            >
              {windKmh} km/h · {powerKw} kW
            </text>
          </g>
        </svg>
      </div>

      {/* Controls */}
      <div className="lg:col-span-4 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base font-bold text-slate-900">Controlla Clima e Vento</h4>
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                barnLit
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {!allBuilt ? 'IN COSTRUZIONE' : barnLit ? 'STALLA ILLUMINATA' : 'CALMA DI VENTO'}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                <label htmlFor="sea-sun-slider" className="inline-flex items-center gap-1.5">
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span>Sole & Contrasto Mare/Terra</span>
                </label>
                <span className="font-mono tabular-nums text-cyan-700">+{tempDiff}°C</span>
              </div>
              <input
                id="sea-sun-slider"
                type="range"
                min={0}
                max={100}
                value={sunSeaHeat}
                onChange={(e) => setSunSeaHeat(Number(e.target.value))}
                className="mt-2 h-2.5 w-full cursor-pointer accent-cyan-600"
              />
              <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                <span>Poca differenza ({seaTemp}°C/{landTemp}°C)</span>
                <span>Forte brezza ({windKmh} km/h)</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-2">
                <Lightbulb className={`h-5 w-5 ${barnLit ? 'text-amber-500' : 'text-slate-400'}`} />
                <div>
                  <div className="text-sm font-semibold text-slate-900">Luci della Stalla</div>
                  <div className="text-xs text-slate-500">
                    {barnLit ? 'Stalla calda e illuminata' : 'Spente'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBarnLightOn((v) => !v)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  barnLightOn
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {barnLightOn ? 'SPEGNI' : 'ACCENDI'}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Wind className="h-4 w-4 text-cyan-600" />
            <span>Perché soffia il vento?</span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            {!allBuilt
              ? 'Monta le pale eoliche, il generatore e la stalla per trasformare le correnti d’aria in elettricità!'
              : `Il Sole scalda il prato a ${landTemp}°C mentre il mare resta più fresco (${seaTemp}°C): l’aria fredda sul mare corre verso la terra a ${windKmh} km/h facendo girare le pale e accendendo la stalla!`}
          </p>
        </div>
      </div>
    </div>
  );
}
