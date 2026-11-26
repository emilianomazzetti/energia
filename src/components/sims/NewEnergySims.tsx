import { useEffect, useState } from 'react';
import { Bus, Droplets, Flame, Leaf, Recycle, ShieldCheck, Zap } from 'lucide-react';
import { BuildSlotPlaceholder, ClickableHotspot, type SimProps } from './SimShared';

/* ============================================================================
   1. GEOTERMICO (Calore della Terra -> Vapore -> Turbina -> Serra)
   ============================================================================ */
export function GeoSim({ builtParts, onBuildPart, onDiscover }: SimProps) {
  const [pumpRate, setPumpRate] = useState(75);
  const [greenhouseHeatOn, setGreenhouseHeatOn] = useState(true);

  const hasWell = Boolean(builtParts.pozzo);
  const hasTurbine = Boolean(builtParts.turbina_geo);
  const hasGreenhouse = Boolean(builtParts.serra);
  const allBuilt = hasWell && hasTurbine && hasGreenhouse;

  const isActive = hasWell && pumpRate > 5;
  const outputKw = isActive && hasTurbine ? Math.round((pumpRate / 100) * 420) : 0;
  const greenhouseTemp = allBuilt && isActive && greenhouseHeatOn ? Math.round(14 + (pumpRate / 100) * 14) : 10;
  const spinDuration = outputKw > 0 ? Math.max(0.28, 2.0 - (pumpRate / 100) * 1.7) : 0;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
      <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-semibold text-red-800">
            Calore della Terra (Termica) → Vapore → Meccanica → Elettrica & Serra Calda
          </div>
          <span className="text-xs font-medium text-slate-500">
            Clicca sugli oggetti con <strong className="text-slate-900">?</strong> per scoprire gli inventori
          </span>
        </div>

        <svg
          viewBox="0 0 760 430"
          className="w-full h-auto rounded-xl border border-slate-200"
          role="img"
          aria-label="Simulazione centrale geotermica"
        >
          <rect x="0" y="0" width="760" height="235" fill="#e0f2fe" />
          {/* Soil & Crust layers */}
          <rect x="0" y="235" width="760" height="35" fill="#4ade80" />
          <rect x="0" y="270" width="760" height="85" fill="#78350f" />
          {/* Hot Magma deep layer */}
          <ClickableHotspot
            x={160}
            y={380}
            label="Magma Terrestre"
            badgeColor="#dc2626"
            onClick={() => onDiscover('magma_terra')}
          >
            <g>
              <rect x="0" y="355" width="760" height="75" fill="#dc2626" />
              <path d="M0 355 Q120 335 240 355 T480 355 T760 355 L760 430 L0 430 Z" fill="#ea580c" opacity="0.7" />
              <text x="115" y="405" textAnchor="middle" fill="#fef08a" fontSize="13" fontWeight="700">
                ROCCE ROVENTI (260°C)
              </text>
            </g>
          </ClickableHotspot>

          {/* 1. GEOTHERMAL INJECTION & STEAM WELLS */}
          {!hasWell ? (
            <BuildSlotPlaceholder
              x={55}
              y={175}
              width={195}
              height={170}
              label="Pozzi Geotermici"
              stepNumber={1}
              onClick={() => onBuildPart('pozzo')}
            />
          ) : (
            <g>
              {/* Cold water pipe down */}
              <path d="M90 215 L90 362 L180 362" fill="none" stroke="#0284c7" strokeWidth="14" strokeLinejoin="round" />
              {isActive && (
                <path
                  d="M90 215 L90 362 L180 362"
                  fill="none"
                  stroke="#bae6fd"
                  strokeWidth="6"
                  strokeDasharray="10 8"
                  className={pumpRate > 55 ? 'animate-flow-fast' : 'animate-flow'}
                />
              )}
              {/* Hot steam pipe up */}
              <path d="M180 362 L215 362 L215 185" fill="none" stroke="#ef4444" strokeWidth="14" strokeLinejoin="round" />
              {isActive && (
                <path
                  d="M180 362 L215 362 L215 185"
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth="6"
                  strokeDasharray="10 8"
                  className={pumpRate > 55 ? 'animate-flow-fast' : 'animate-flow'}
                />
              )}
              <rect x="65" y="190" width="52" height="45" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              <text x="91" y="217" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">
                POMPA
              </text>
            </g>
          )}

          {/* Pipe to turbine */}
          {hasWell && hasTurbine && (
            <g>
              <path d="M215 185 L315 185" stroke="#dc2626" strokeWidth="12" />
              {isActive && (
                <path
                  d="M215 185 L315 185"
                  stroke="#ffffff"
                  strokeWidth="5"
                  strokeDasharray="8 8"
                  className="animate-flow-fast"
                />
              )}
            </g>
          )}

          {/* 2. GEOTHERMAL TURBINE (LARDERELLO) */}
          {!hasTurbine ? (
            <BuildSlotPlaceholder
              x={310}
              y={135}
              width={165}
              height={110}
              label="Turbina Geotermica"
              stepNumber={2}
              onClick={() => onBuildPart('turbina_geo')}
            />
          ) : (
            <ClickableHotspot
              x={455}
              y={144}
              label="Centrale Geotermica di Larderello"
              badgeColor="#dc2626"
              onClick={() => onDiscover('larderello')}
            >
              <g>
                <rect x="315" y="140" width="150" height="98" rx="12" fill="#f8fafc" stroke="#475569" strokeWidth="3" />
                <g transform="translate(365, 190)">
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
                        y2="-24"
                        stroke="#dc2626"
                        strokeWidth="5"
                        strokeLinecap="round"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    <circle r="9" fill="#0f172a" />
                  </g>
                </g>
                <circle cx="428" cy="190" r="11" fill={outputKw > 0 ? '#facc15' : '#64748b'} />
              </g>
            </ClickableHotspot>
          )}

          {/* Wire/heat to Greenhouse */}
          {hasTurbine && hasGreenhouse && (
            <g>
              <path d="M465 190 L545 190" stroke={outputKw > 0 ? '#f59e0b' : '#64748b'} strokeWidth="5" />
              {allBuilt && isActive && greenhouseHeatOn && (
                <path
                  d="M465 190 L545 190"
                  stroke="#fef08a"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                  className="animate-flow-fast"
                />
              )}
            </g>
          )}

          {/* 3. GLASS GREENHOUSE */}
          {!hasGreenhouse ? (
            <BuildSlotPlaceholder
              x={545}
              y={115}
              width={185}
              height={125}
              label="Serra Botanica"
              stepNumber={3}
              onClick={() => onBuildPart('serra')}
            />
          ) : (
            <g>
              <polygon
                points="550,235 550,155 638,108 725,155 725,235"
                fill={greenhouseTemp >= 18 ? '#fef9c3' : '#e0f2fe'}
                fillOpacity="0.85"
                stroke="#0284c7"
                strokeWidth="3"
              />
              {/* Plants thriving inside */}
              {[575, 615, 655, 695].map((px) => (
                <g key={px}>
                  <rect x={px - 10} y="218" width="20" height="16" rx="3" fill="#b45309" />
                  <circle cx={px} cy="204" r={greenhouseTemp >= 18 ? 14 : 9} fill="#16a34a" />
                  {greenhouseTemp >= 20 && <circle cx={px + 4} cy="201" r="3.5" fill="#ef4444" />}
                </g>
              ))}
              {/* Grow light inside greenhouse */}
              <circle
                cx="638"
                cy="132"
                r="8"
                fill={allBuilt && isActive && greenhouseHeatOn ? '#fde047' : '#64748b'}
              />
              <text x="638" y="255" textAnchor="middle" fill="#14532d" fontSize="11" fontWeight="700">
                SERRA CALDA: {greenhouseTemp}°C
              </text>
            </g>
          )}

          <g transform="translate(18, 18)">
            <rect width="235" height="54" rx="10" fill="#ffffff" fillOpacity="0.94" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="12" y="22" fontSize="11" fontWeight="600" fill="#475569">
              POTENZA GEOTERMICA
            </text>
            <text x="12" y="43" fontSize="16" fontWeight="700" fill="#0f172a" fontFamily="JetBrains Mono, monospace">
              {outputKw} kW · Serra {greenhouseTemp}°C
            </text>
          </g>
        </svg>
      </div>

      {/* Controls */}
      <div className="lg:col-span-4 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base font-bold text-slate-900">Pompa Geotermica</h4>
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                isActive ? 'bg-red-50 text-red-800' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {!allBuilt ? 'IN COSTRUZIONE' : isActive ? 'VAPORE ATTIVO' : 'POMPA FERMA'}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                <label htmlFor="geo-slider" className="inline-flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-red-600" />
                  <span>Acqua Pompata nel Sottosuolo</span>
                </label>
                <span className="font-mono tabular-nums text-red-700">{pumpRate}%</span>
              </div>
              <input
                id="geo-slider"
                type="range"
                min={0}
                max={100}
                value={pumpRate}
                onChange={(e) => setPumpRate(Number(e.target.value))}
                className="mt-2 h-2.5 w-full cursor-pointer accent-red-600"
              />
            </div>

            <button
              type="button"
              onClick={() => setGreenhouseHeatOn((v) => !v)}
              className={`w-full rounded-xl px-4 py-2.5 text-xs font-bold transition-colors ${
                greenhouseHeatOn ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {greenhouseHeatOn ? 'Spegni Riscaldamento Serra' : 'Accendi Riscaldamento Serra'}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h5 className="text-sm font-bold text-slate-900">Energia 24 ore su 24!</h5>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            A differenza di Sole e Vento, il calore interno della Terra è sempre attivo giorno e notte, anche quando fuori nevica!
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   2. RIFIUTI (Biogas Organico + Termovalorizzatore con Filtri)
   ============================================================================ */
export function WasteSim({ builtParts, onBuildPart, onDiscover }: SimProps) {
  const [wasteMode, setWasteMode] = useState<'organico' | 'indifferenziato'>('organico');
  const [feedRate, setFeedRate] = useState(75);
  const [filterOn, setFilterOn] = useState(true);

  const hasPlant = Boolean(builtParts.impianto);
  const hasFilter = Boolean(builtParts.filtro);
  const hasNeighborhood = Boolean(builtParts.quartiere);
  const allBuilt = hasPlant && hasFilter && hasNeighborhood;

  const isRunning = hasPlant && feedRate > 5;
  const outputKw = isRunning && hasFilter ? Math.round((feedRate / 100) * 340) : 0;
  const neighborhoodLit = allBuilt && outputKw > 15;
  const spinDuration = outputKw > 0 ? Math.max(0.3, 2.0 - (feedRate / 100) * 1.65) : 0;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
      <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setWasteMode('organico')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                wasteMode === 'organico' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Leaf className="h-3.5 w-3.5 text-emerald-600" />
              <span>Organico (Biogas)</span>
            </button>
            <button
              type="button"
              onClick={() => setWasteMode('indifferenziato')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                wasteMode === 'indifferenziato' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Recycle className="h-3.5 w-3.5 text-amber-600" />
              <span>Non Riciclabile (Termovalorizzatore)</span>
            </button>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Clicca sugli oggetti con <strong className="text-slate-900">?</strong>
          </span>
        </div>

        <svg
          viewBox="0 0 760 430"
          className="w-full h-auto rounded-xl border border-slate-200"
          role="img"
          aria-label="Simulazione energia dai rifiuti"
        >
          <rect x="0" y="0" width="760" height="330" fill="#ecfdf5" />
          <rect x="0" y="330" width="760" height="100" fill="#4ade80" />

          {/* Input conveyor */}
          <rect x="20" y="290" width="110" height="16" rx="6" fill="#334155" />
          <text x="75" y="280" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="700">
            {wasteMode === 'organico' ? 'BUCCE & SCARTI' : 'SECCO RESIDUO'}
          </text>

          {/* 1. DIGESTER / INCINERATOR PLANT */}
          {!hasPlant ? (
            <BuildSlotPlaceholder
              x={110}
              y={155}
              width={185}
              height={170}
              label="Digestore & Caldaia"
              stepNumber={1}
              onClick={() => onBuildPart('impianto')}
            />
          ) : (
            <ClickableHotspot
              x={276}
              y={166}
              label={wasteMode === 'organico' ? 'Digestore Biogas' : 'Termovalorizzatore'}
              badgeColor="#16a34a"
              onClick={() => onDiscover(wasteMode === 'organico' ? 'biogas_batteri' : 'termovalorizzatore')}
            >
              <g>
                <rect x="115" y="165" width="170" height="165" rx="16" fill="#f8fafc" stroke="#475569" strokeWidth="3" />
                {wasteMode === 'organico' ? (
                  <g>
                    <ellipse cx="200" cy="245" rx="64" ry="52" fill="#15803d" opacity="0.88" />
                    <text x="200" y="242" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">
                      BATTERI BIOGAS
                    </text>
                    {isRunning &&
                      [175, 200, 225].map((bx, i) => (
                        <circle
                          key={bx}
                          cx={bx}
                          cy="275"
                          r="5"
                          fill="#bbf7d0"
                          className="animate-float-up"
                          style={{ animationDelay: `${i * 0.35}s` }}
                        />
                      ))}
                  </g>
                ) : (
                  <g>
                    <rect x="140" y="220" width="120" height="88" rx="8" fill="#0f172a" />
                    {isRunning && (
                      <path d="M155 296 Q175 245 195 296 Q215 240 245 296 Z" fill="#f97316" />
                    )}
                    <text x="200" y="198" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="700">
                      CALDAIA 900°C
                    </text>
                  </g>
                )}
              </g>
            </ClickableHotspot>
          )}

          {/* Pipe to filter/turbine */}
          {hasPlant && hasFilter && (
            <g>
              <path d="M285 235 L350 235" stroke="#64748b" strokeWidth="10" />
              {isRunning && (
                <path
                  d="M285 235 L350 235"
                  stroke={wasteMode === 'organico' ? '#4ade80' : '#fb923c'}
                  strokeWidth="5"
                  strokeDasharray="8 8"
                  className="animate-flow-fast"
                />
              )}
            </g>
          )}

          {/* 2. FILTERS & TURBINE */}
          {!hasFilter ? (
            <BuildSlotPlaceholder
              x={345}
              y={145}
              width={165}
              height={180}
              label="Filtri & Turbina"
              stepNumber={2}
              onClick={() => onBuildPart('filtro')}
            />
          ) : (
            <ClickableHotspot
              x={495}
              y={155}
              label="Filtri Ecologici & Turbina"
              badgeColor="#0f172a"
              onClick={() => onDiscover('termovalorizzatore')}
            >
              <g>
                {/* Chimney with filter box */}
                <rect x="370" y="95" width="34" height="105" fill="#94a3b8" stroke="#475569" strokeWidth="2.5" />
                <rect
                  x="362"
                  y="140"
                  width="50"
                  height="28"
                  rx="5"
                  fill={filterOn ? '#10b981' : '#ef4444'}
                  stroke="#0f172a"
                  strokeWidth="2"
                />
                <text x="387" y="158" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="700">
                  {filterOn ? 'FILTRO OK' : 'NO FILTRO'}
                </text>

                {isRunning && (
                  <g fill={filterOn ? '#f8fafc' : '#475569'} opacity={filterOn ? '0.65' : '0.85'}>
                    <circle cx="387" cy="76" r="11" className="animate-float-up" />
                    <circle cx="400" cy="60" r="14" className="animate-float-up" style={{ animationDelay: '0.5s' }} />
                  </g>
                )}

                {/* Turbine housing */}
                <rect x="350" y="195" width="150" height="130" rx="12" fill="#e2e8f0" stroke="#475569" strokeWidth="3" />
                <g transform="translate(415, 260)">
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
                        y2="-28"
                        stroke="#16a34a"
                        strokeWidth="5"
                        strokeLinecap="round"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    <circle r="9" fill="#0f172a" />
                  </g>
                </g>
              </g>
            </ClickableHotspot>
          )}

          {/* Wire to neighborhood */}
          {hasFilter && hasNeighborhood && (
            <g>
              <path d="M500 260 L565 260" stroke={outputKw > 0 ? '#f59e0b' : '#64748b'} strokeWidth="5" />
              {neighborhoodLit && (
                <path
                  d="M500 260 L565 260"
                  stroke="#fef08a"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                  className="animate-flow-fast"
                />
              )}
            </g>
          )}

          {/* 3. NEIGHBORHOOD */}
          {!hasNeighborhood ? (
            <BuildSlotPlaceholder
              x={565}
              y={175}
              width={165}
              height={150}
              label="Quartiere"
              stepNumber={3}
              onClick={() => onBuildPart('quartiere')}
            />
          ) : (
            <g>
              {/* Two cute houses */}
              {[570, 650].map((hx, idx) => (
                <g key={hx}>
                  <rect x={hx} y="242" width="68" height="86" rx="4" fill="#fffbeb" stroke="#78350f" strokeWidth="2.5" />
                  <polygon points={`${hx - 5},244 ${hx + 34},204 ${hx + 73},244`} fill={idx === 0 ? '#0284c7' : '#dc2626'} />
                  <rect
                    x={hx + 20}
                    y="262"
                    width="28"
                    height="30"
                    rx="4"
                    fill={neighborhoodLit ? '#fde047' : '#1e293b'}
                    stroke="#78350f"
                    strokeWidth="2"
                  />
                </g>
              ))}
              <text x="645" y="352" textAnchor="middle" fill="#14532d" fontSize="11" fontWeight="700">
                QUARTIERE ILLUMINATO
              </text>
            </g>
          )}

          <g transform="translate(18, 18)">
            <rect width="230" height="54" rx="10" fill="#ffffff" fillOpacity="0.94" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="12" y="22" fontSize="11" fontWeight="600" fill="#475569">
              ENERGIA DAI RIFIUTI
            </text>
            <text x="12" y="43" fontSize="16" fontWeight="700" fill="#0f172a" fontFamily="JetBrains Mono, monospace">
              {outputKw} kW · {filterOn ? 'Aria Pulita' : 'Senza Filtro!'}
            </text>
          </g>
        </svg>
      </div>

      {/* Controls */}
      <div className="lg:col-span-4 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base font-bold text-slate-900">Controllo Impianto</h4>
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                isRunning ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {!allBuilt ? 'IN COSTRUZIONE' : isRunning ? 'ATTIVO' : 'FERMO'}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                <label htmlFor="waste-slider" className="inline-flex items-center gap-1.5">
                  <Recycle className="h-4 w-4 text-emerald-600" />
                  <span>Quantità di Scarti</span>
                </label>
                <span className="font-mono tabular-nums text-emerald-700">{feedRate}%</span>
              </div>
              <input
                id="waste-slider"
                type="range"
                min={0}
                max={100}
                value={feedRate}
                onChange={(e) => setFeedRate(Number(e.target.value))}
                className="mt-2 h-2.5 w-full cursor-pointer accent-emerald-600"
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className={`h-5 w-5 ${filterOn ? 'text-emerald-600' : 'text-red-500'}`} />
                <div>
                  <div className="text-sm font-semibold text-slate-900">Filtro Fumi</div>
                  <div className="text-xs text-slate-500">{filterOn ? 'Polveri catturate' : 'Fumo sporco!'}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFilterOn((v) => !v)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  filterOn ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {filterOn ? 'ATTIVO' : 'ATTIVA'}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h5 className="text-sm font-bold text-slate-900">Prima si Ricicla!</h5>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            Carta, vetro, plastica e lattine vanno sempre riciclati! Solo gli avanzi organici (biogas) o ciò che non è riciclabile diventano elettricità.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   3. IDROGENO (Elettrolisi H2O -> Serbatoio H2 -> Cella a Combustibile Bus)
   ============================================================================ */
export function HydrogenSim({ builtParts, onBuildPart, onDiscover }: SimProps) {
  const [electrolyzerOn, setElectrolyzerOn] = useState(true);
  const [busSpeed, setBusSpeed] = useState(65);
  const [h2Tank, setH2Tank] = useState(64);

  const hasElectrolyzer = Boolean(builtParts.elettrolizzatore);
  const hasTank = Boolean(builtParts.serbatoio);
  const hasBus = Boolean(builtParts.bus);
  const allBuilt = hasElectrolyzer && hasTank && hasBus;

  const isProducingH2 = hasElectrolyzer && electrolyzerOn;
  const busMoving = allBuilt && busSpeed > 5 && h2Tank > 0;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setH2Tank((prev) => {
        const gain = isProducingH2 && hasTank ? 2.4 : 0;
        const drain = busMoving ? (busSpeed / 100) * 1.9 : 0;
        return Math.max(0, Math.min(100, Math.round((prev + gain - drain) * 10) / 10));
      });
    }, 350);
    return () => window.clearInterval(timer);
  }, [isProducingH2, hasTank, busMoving, busSpeed]);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
      <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-semibold text-indigo-800">
            Nuova Fonte: Acqua (H₂O) + Elettricità → Idrogeno (H₂) → Cella a Combustibile → Bus (Solo Acqua!)
          </div>
          <span className="text-xs font-medium text-slate-500">
            Clicca sugli oggetti con <strong className="text-slate-900">?</strong>
          </span>
        </div>

        <svg
          viewBox="0 0 760 430"
          className="w-full h-auto rounded-xl border border-slate-200"
          role="img"
          aria-label="Simulazione idrogeno verde ed elettrolisi"
        >
          <rect x="0" y="0" width="760" height="325" fill="#eef2ff" />
          <rect x="0" y="325" width="760" height="105" fill="#cbd5e1" />
          <line x1="0" y1="365" x2="760" y2="365" stroke="#ffffff" strokeWidth="4" strokeDasharray="24 18" />

          {/* Small solar panel feeding green electricity to electrolyzer */}
          <polygon points="35,145 105,128 118,168 48,185" fill="#1e3a8a" stroke="#e2e8f0" strokeWidth="2.5" />
          <line x1="76" y1="175" x2="76" y2="215" stroke="#475569" strokeWidth="5" />
          <path d="M98 168 L135 210" stroke={isProducingH2 ? '#facc15' : '#64748b'} strokeWidth="4" />

          {/* 1. ELECTROLYZER */}
          {!hasElectrolyzer ? (
            <BuildSlotPlaceholder
              x={105}
              y={175}
              width={175}
              height={145}
              label="Elettrolizzatore"
              stepNumber={1}
              onClick={() => onBuildPart('elettrolizzatore')}
            />
          ) : (
            <ClickableHotspot
              x={264}
              y={182}
              label="Elettrolizzatore dell'Acqua"
              badgeColor="#4f46e5"
              onClick={() => onDiscover('elettrolisi')}
            >
              <g>
                <rect x="115" y="185" width="155" height="135" rx="14" fill="#ffffff" stroke="#4f46e5" strokeWidth="3" />
                <rect x="125" y="218" width="135" height="90" rx="8" fill="#bae6fd" />
                <text x="192" y="206" textAnchor="middle" fill="#312e81" fontSize="11" fontWeight="700">
                  ELETTROLISI H₂O
                </text>
                {/* Electrodes */}
                <rect x="150" y="226" width="10" height="68" rx="3" fill="#334155" />
                <rect x="225" y="226" width="10" height="68" rx="3" fill="#334155" />
                {isProducingH2 &&
                  [155, 168, 222, 234].map((bx, i) => (
                    <circle
                      key={bx}
                      cx={bx}
                      cy="280"
                      r="4.5"
                      fill={i < 2 ? '#6366f1' : '#ffffff'}
                      className="animate-float-up"
                      style={{ animationDelay: `${i * 0.25}s` }}
                    />
                  ))}
              </g>
            </ClickableHotspot>
          )}

          {/* Pipe H2 -> Tank */}
          {hasElectrolyzer && hasTank && (
            <g>
              <path d="M270 250 L335 250" stroke="#4f46e5" strokeWidth="8" />
              {isProducingH2 && (
                <path
                  d="M270 250 L335 250"
                  stroke="#c7d2fe"
                  strokeWidth="4"
                  strokeDasharray="8 8"
                  className="animate-flow-fast"
                />
              )}
            </g>
          )}

          {/* 2. HYDROGEN TANK */}
          {!hasTank ? (
            <BuildSlotPlaceholder
              x={335}
              y={175}
              width={115}
              height={145}
              label="Serbatoio H₂"
              stepNumber={2}
              onClick={() => onBuildPart('serbatoio')}
            />
          ) : (
            <g>
              <rect x="340" y="185" width="105" height="135" rx="28" fill="#1e1b4b" stroke="#6366f1" strokeWidth="3.5" />
              <rect x="352" y="200" width="81" height="105" rx="18" fill="#312e81" />
              <rect
                x="352"
                y={200 + (105 - (105 * h2Tank) / 100)}
                width="81"
                height={(105 * h2Tank) / 100}
                rx="14"
                fill="#6366f1"
              />
              <text x="392" y="250" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                H₂ {Math.round(h2Tank)}%
              </text>
            </g>
          )}

          {/* H2 pipe to Bus */}
          {hasTank && hasBus && (
            <g>
              <path d="M445 270 L510 270" stroke="#4f46e5" strokeWidth="7" />
              {busMoving && (
                <path
                  d="M445 270 L510 270"
                  stroke="#e0e7ff"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  className="animate-flow-fast"
                />
              )}
            </g>
          )}

          {/* 3. HYDROGEN FUEL CELL BUS */}
          {!hasBus ? (
            <BuildSlotPlaceholder
              x={510}
              y={180}
              width={220}
              height={145}
              label="Bus Cella H₂"
              stepNumber={3}
              onClick={() => onBuildPart('bus')}
            />
          ) : (
            <ClickableHotspot
              x={710}
              y={192}
              label="Cella a Combustibile"
              badgeColor="#4f46e5"
              onClick={() => onDiscover('cella_combustibile')}
            >
              <g>
                {/* Clean Bus body */}
                <rect x="515" y="195" width="205" height="105" rx="18" fill="#4f46e5" stroke="#312e81" strokeWidth="3" />
                {/* Bus windows */}
                {[535, 582, 629, 676].map((wx) => (
                  <rect key={wx} x={wx} y="212" width="34" height="36" rx="6" fill="#e0f2fe" />
                ))}
                <text x="618" y="274" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">
                  BUS IDROGENO ZERO CO₂
                </text>
                {/* Spinning wheels */}
                {[562, 676].map((wx) => (
                  <g key={wx} transform={`translate(${wx}, 306)`}>
                    <g
                      style={{
                        animation: busMoving ? `spin-smooth ${Math.max(0.25, 1.4 - busSpeed / 100)}s linear infinite` : 'none',
                      }}
                    >
                      <circle r="21" fill="#0f172a" />
                      <circle r="10" fill="#e2e8f0" />
                      <line x1="-10" y1="0" x2="10" y2="0" stroke="#475569" strokeWidth="2.5" />
                      <line x1="0" y1="-10" x2="0" y2="10" stroke="#475569" strokeWidth="2.5" />
                    </g>
                  </g>
                ))}
                {/* Clean Water Droplets from exhaust! */}
                {busMoving && (
                  <g fill="#38bdf8">
                    <circle cx="502" cy="296" r="5" className="animate-float-up" />
                    <circle cx="490" cy="288" r="4" className="animate-float-up" style={{ animationDelay: '0.4s' }} />
                    <text x="478" y="316" textAnchor="middle" fill="#0284c7" fontSize="10" fontWeight="700">
                      SOLO H₂O!
                    </text>
                  </g>
                )}
              </g>
            </ClickableHotspot>
          )}

          <g transform="translate(18, 18)">
            <rect width="248" height="54" rx="10" fill="#ffffff" fillOpacity="0.94" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="12" y="22" fontSize="11" fontWeight="600" fill="#475569">
              SERBATOIO H₂ · BUS ELETTRICO
            </text>
            <text x="12" y="43" fontSize="16" fontWeight="700" fill="#0f172a" fontFamily="JetBrains Mono, monospace">
              {Math.round(h2Tank)}% H₂ · {busMoving ? `${busSpeed} km/h` : 'Fermo'}
            </text>
          </g>
        </svg>
      </div>

      {/* Controls */}
      <div className="lg:col-span-4 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base font-bold text-slate-900">Controllo Idrogeno</h4>
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                busMoving ? 'bg-indigo-50 text-indigo-800' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {!allBuilt ? 'IN COSTRUZIONE' : busMoving ? 'BUS IN MARCIA' : 'IN SOSTA'}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <button
              type="button"
              onClick={() => setElectrolyzerOn((v) => !v)}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors ${
                electrolyzerOn
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>{electrolyzerOn ? 'Elettrolisi Attiva (Produce H₂)' : 'Avvia Elettrolizzatore H₂O'}</span>
            </button>

            <div>
              <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                <label htmlFor="h2-bus-slider" className="inline-flex items-center gap-1.5">
                  <Bus className="h-4 w-4 text-indigo-600" />
                  <span>Velocità Bus a Idrogeno</span>
                </label>
                <span className="font-mono tabular-nums text-indigo-700">{busSpeed} km/h</span>
              </div>
              <input
                id="h2-bus-slider"
                type="range"
                min={0}
                max={100}
                value={busSpeed}
                onChange={(e) => setBusSpeed(Number(e.target.value))}
                className="mt-2 h-2.5 w-full cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Droplets className="h-4 w-4 text-sky-600" />
            <span>Un Cerchio Perfetto</span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            Usiamo elettricità verde per dividere l’acqua in idrogeno; poi la cella a combustibile usa l’idrogeno per muovere il bus rilasciando solo gocce di acqua pulita!
          </p>
        </div>
      </div>
    </div>
  );
}
