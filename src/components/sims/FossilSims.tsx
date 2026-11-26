import { useEffect, useState } from 'react';
import { Flame, Fuel, Gauge, RotateCcw } from 'lucide-react';
import { BuildSlotPlaceholder, ClickableHotspot, type SimProps } from './SimShared';

/* ============================================================================
   1. CARBONE (Centrale Termoelettrica a Vapore + Riserva Esauribile)
   ============================================================================ */
export function CoalSim({ builtParts, onBuildPart, onDiscover }: SimProps) {
  const [airDraft, setAirDraft] = useState(70);
  const [coalReserve, setCoalReserve] = useState(85);
  const [furnaceLit, setFurnaceLit] = useState(true);

  const hasFurnace = Boolean(builtParts.fornace);
  const hasTurbine = Boolean(builtParts.turbina_vapore);
  const hasFactory = Boolean(builtParts.fabbrica);
  const allBuilt = hasFurnace && hasTurbine && hasFactory;

  const isBurning = hasFurnace && furnaceLit && coalReserve > 0 && airDraft > 5;
  const outputKw = isBurning && hasTurbine ? Math.round((airDraft / 100) * 520) : 0;
  const factoryLit = allBuilt && outputKw > 20;
  const spinDuration = outputKw > 0 ? Math.max(0.28, 2.0 - (airDraft / 100) * 1.7) : 0;

  useEffect(() => {
    if (!isBurning) return;
    const timer = window.setInterval(() => {
      setCoalReserve((prev) => Math.max(0, Math.round((prev - (airDraft / 100) * 1.1) * 10) / 10));
    }, 450);
    return () => window.clearInterval(timer);
  }, [isBurning, airDraft]);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
      <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-semibold text-slate-700">
            Fonte Esauribile: Energia Chimica (Carbone) → Termica → Meccanica → Elettrica
          </div>
          <span className="text-xs font-medium text-slate-500">
            Clicca sugli oggetti con <strong className="text-slate-900">?</strong> per scoprire gli inventori
          </span>
        </div>

        <svg
          viewBox="0 0 760 430"
          className="w-full h-auto rounded-xl border border-slate-200"
          role="img"
          aria-label="Simulazione centrale termoelettrica a carbone"
        >
          <rect x="0" y="0" width="760" height="335" fill="#e2e8f0" />
          <rect x="0" y="335" width="760" height="95" fill="#475569" />

          {/* Underground coal seam */}
          <ClickableHotspot
            x={108}
            y={368}
            label="Giacimento di Carbone"
            badgeColor="#1e293b"
            onClick={() => onDiscover('carbone_origine')}
          >
            <g>
              <rect x="18" y="346" width="160" height="72" rx="10" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
              <rect
                x="26"
                y="374"
                width={(144 * coalReserve) / 100}
                height="26"
                rx="5"
                fill="#020617"
              />
              <text x="98" y="366" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="700">
                RISERVA CARBONE: {Math.round(coalReserve)}%
              </text>
            </g>
          </ClickableHotspot>

          {/* 1. FURNACE & BOILER */}
          {!hasFurnace ? (
            <BuildSlotPlaceholder
              x={55}
              y={140}
              width={195}
              height={190}
              label="Fornace & Caldaia"
              stepNumber={1}
              onClick={() => onBuildPart('fornace')}
            />
          ) : (
            <ClickableHotspot
              x={230}
              y={148}
              label="Caldaia a Vapore"
              badgeColor="#ea580c"
              onClick={() => onDiscover('macchina_vapore')}
            >
              <g>
                {/* Smokestack with CO2 clouds */}
                <rect x="70" y="95" width="32" height="115" fill="#64748b" stroke="#334155" strokeWidth="2.5" />
                {isBurning && (
                  <g fill="#475569" opacity="0.65">
                    <circle cx="86" cy="75" r={10 + (airDraft / 100) * 10} className="animate-float-up" />
                    <circle cx="102" cy="58" r={12 + (airDraft / 100) * 12} className="animate-float-up" style={{ animationDelay: '0.6s' }} />
                  </g>
                )}

                {/* Boiler body */}
                <rect x="65" y="175" width="175" height="160" rx="14" fill="#cbd5e1" stroke="#475569" strokeWidth="3" />
                {/* Water tank upper half */}
                <rect x="78" y="188" width="149" height="68" rx="8" fill={isBurning ? '#38bdf8' : '#0284c7'} />
                {isBurning &&
                  [98, 128, 158, 188].map((bx, i) => (
                    <circle
                      key={bx}
                      cx={bx}
                      cy="238"
                      r="4"
                      fill="#ffffff"
                      className="animate-float-up"
                      style={{ animationDelay: `${i * 0.3}s` }}
                    />
                  ))}

                {/* Furnace fire chamber */}
                <rect x="82" y="268" width="141" height="56" rx="8" fill="#0f172a" />
                {/* Coal lumps */}
                {coalReserve > 0 && (
                  <g fill="#334155">
                    <circle cx="110" cy="312" r="10" />
                    <circle cx="132" cy="310" r="12" />
                    <circle cx="155" cy="312" r="11" />
                    <circle cx="178" cy="311" r="10" />
                  </g>
                )}
                {isBurning && (
                  <g>
                    <path d="M100 310 Q114 275 128 310 Q142 268 156 310 Q172 278 188 310 Z" fill="#f97316" />
                    <path d="M112 310 Q126 286 140 310 Q154 282 168 310 Z" fill="#fde047" />
                  </g>
                )}
              </g>
            </ClickableHotspot>
          )}

          {/* Steam pipe */}
          {hasFurnace && hasTurbine && (
            <g>
              <path d="M240 205 L335 205" stroke="#64748b" strokeWidth="14" />
              {isBurning && (
                <path
                  d="M240 205 L335 205"
                  stroke="#f8fafc"
                  strokeWidth="6"
                  strokeDasharray="10 8"
                  className="animate-flow-fast"
                />
              )}
            </g>
          )}

          {/* 2. STEAM TURBINE */}
          {!hasTurbine ? (
            <BuildSlotPlaceholder
              x={330}
              y={175}
              width={145}
              height={150}
              label="Turbina a Vapore"
              stepNumber={2}
              onClick={() => onBuildPart('turbina_vapore')}
            />
          ) : (
            <g>
              <rect x="335" y="185" width="135" height="145" rx="12" fill="#f1f5f9" stroke="#475569" strokeWidth="3" />
              <g transform="translate(390, 255)">
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
                      y2="-32"
                      stroke="#ea580c"
                      strokeWidth="5"
                      strokeLinecap="round"
                      transform={`rotate(${deg})`}
                    />
                  ))}
                  <circle r="11" fill="#0f172a" />
                </g>
              </g>
              <circle cx="445" cy="255" r="10" fill={outputKw > 0 ? '#facc15' : '#64748b'} />
            </g>
          )}

          {/* Power line to workshop */}
          {hasTurbine && hasFactory && (
            <g>
              <path d="M470 255 L560 255" stroke={outputKw > 0 ? '#f59e0b' : '#64748b'} strokeWidth="5" />
              {factoryLit && (
                <path
                  d="M470 255 L560 255"
                  stroke="#fef08a"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                  className="animate-flow-fast"
                />
              )}
            </g>
          )}

          {/* 3. WORKSHOP / FACTORY */}
          {!hasFactory ? (
            <BuildSlotPlaceholder
              x={555}
              y={185}
              width={175}
              height={150}
              label="Officina Elettrica"
              stepNumber={3}
              onClick={() => onBuildPart('fabbrica')}
            />
          ) : (
            <g>
              <polygon points="560,235 605,195 605,235 650,195 650,235 725,235 725,335 560,335" fill="#9a3412" stroke="#7c2d12" strokeWidth="3" />
              {[580, 628, 676].map((wx) => (
                <rect
                  key={wx}
                  x={wx}
                  y="258"
                  width="32"
                  height="34"
                  rx="4"
                  fill={factoryLit ? '#fde047' : '#1e293b'}
                  stroke="#451a03"
                  strokeWidth="2.5"
                />
              ))}
              <text x="642" y="320" textAnchor="middle" fill="#ffedd5" fontSize="12" fontWeight="700">
                OFFICINA
              </text>
            </g>
          )}

          <g transform="translate(500, 18)">
            <rect width="242" height="56" rx="10" fill="#ffffff" fillOpacity="0.94" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="12" y="22" fontSize="11" fontWeight="600" fill="#475569">
              POTENZA · RISERVA MINIERA
            </text>
            <text x="12" y="43" fontSize="16" fontWeight="700" fill="#0f172a" fontFamily="JetBrains Mono, monospace">
              {outputKw} kW · {Math.round(coalReserve)}%
            </text>
          </g>
        </svg>
      </div>

      {/* Controls */}
      <div className="lg:col-span-4 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base font-bold text-slate-900">Controllo Fornace</h4>
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                coalReserve <= 0
                  ? 'bg-red-50 text-red-800'
                  : isBurning
                  ? 'bg-amber-50 text-amber-800'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {coalReserve <= 0 ? 'RISERVA ESAURITA' : isBurning ? 'COMBUSTIONE' : 'SPENTA'}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                <label htmlFor="coal-draft" className="inline-flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-orange-600" />
                  <span>Tiraggio Fuoco</span>
                </label>
                <span className="font-mono tabular-nums text-orange-700">{airDraft}%</span>
              </div>
              <input
                id="coal-draft"
                type="range"
                min={0}
                max={100}
                value={airDraft}
                onChange={(e) => setAirDraft(Number(e.target.value))}
                className="mt-2 h-2.5 w-full cursor-pointer accent-orange-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFurnaceLit((v) => !v)}
                className={`rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${
                  furnaceLit ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {furnaceLit ? 'Spegni Fuoco' : 'Accendi Fuoco'}
              </button>
              <button
                type="button"
                onClick={() => setCoalReserve(100)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Nuovo Carbone</span>
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h5 className="text-sm font-bold text-slate-900">Perché si dice "Esauribile"?</h5>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            Guarda la barra in basso a sinistra: mentre la fornace brucia il carbone per produrre vapore e fumo di CO₂, il giacimento diminuisce fino a finire!
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   2. PETROLIO (Pozzo + Torre di Raffinazione + Motore/Auto)
   ============================================================================ */
export function OilSim({ builtParts, onBuildPart, onDiscover }: SimProps) {
  const [pumpSpeed, setPumpSpeed] = useState(65);
  const [engineOn, setEngineOn] = useState(true);
  const [oilReserve, setOilReserve] = useState(88);

  const hasPump = Boolean(builtParts.pompa);
  const hasRefinery = Boolean(builtParts.raffineria);
  const hasEngine = Boolean(builtParts.motore);
  const allBuilt = hasPump && hasRefinery && hasEngine;

  const isPumping = hasPump && pumpSpeed > 5 && oilReserve > 0;
  const engineRunning = allBuilt && engineOn && isPumping;
  const outputPower = engineRunning ? Math.round((pumpSpeed / 100) * 380) : 0;

  useEffect(() => {
    if (!isPumping) return;
    const timer = window.setInterval(() => {
      setOilReserve((prev) => Math.max(0, Math.round((prev - (pumpSpeed / 100) * 0.9) * 10) / 10));
    }, 500);
    return () => window.clearInterval(timer);
  }, [isPumping, pumpSpeed]);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
      <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-semibold text-amber-900">
            Fonte Esauribile: Petrolio Grezzo → Distillazione → Carburante & Motore
          </div>
          <span className="text-xs font-medium text-slate-500">
            Clicca sugli oggetti con <strong className="text-slate-900">?</strong> per scoprire gli inventori
          </span>
        </div>

        <svg
          viewBox="0 0 760 430"
          className="w-full h-auto rounded-xl border border-slate-200"
          role="img"
          aria-label="Simulazione estrazione e raffinazione del petrolio"
        >
          <rect x="0" y="0" width="760" height="310" fill="#fef3c7" />
          <rect x="0" y="310" width="760" height="120" fill="#92400e" />

          {/* Underground oil pocket */}
          <ellipse cx="145" cy="378" rx="115" ry="34" fill="#0f172a" />
          <ellipse
            cx="145"
            cy="378"
            rx={Math.max(10, (105 * oilReserve) / 100)}
            ry={Math.max(4, (28 * oilReserve) / 100)}
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="2"
          />
          <text x="145" y="382" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="700">
            PETROLIO: {Math.round(oilReserve)}%
          </text>

          {/* 1. OIL PUMP */}
          {!hasPump ? (
            <BuildSlotPlaceholder
              x={55}
              y={165}
              width={175}
              height={140}
              label="Pompa Petrolio"
              stepNumber={1}
              onClick={() => onBuildPart('pompa')}
            />
          ) : (
            <ClickableHotspot
              x={210}
              y={175}
              label="Pozzo di Petrolio"
              badgeColor="#92400e"
              onClick={() => onDiscover('pozzo_drake')}
            >
              <g>
                {/* Drill pipe down to oil */}
                <line x1="88" y1="220" x2="88" y2="365" stroke="#0f172a" strokeWidth="8" />
                {isPumping && (
                  <line
                    x1="88"
                    y1="365"
                    x2="88"
                    y2="220"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeDasharray="8 8"
                    className="animate-flow-fast"
                  />
                )}
                {/* A-frame support */}
                <polygon points="128,310 155,215 182,310" fill="none" stroke="#334155" strokeWidth="6" />
                {/* Nodding beam */}
                <g transform={`translate(155, 218) rotate(${isPumping ? -10 : 5})`}>
                  <line x1="-68" y1="0" x2="55" y2="0" stroke="#b45309" strokeWidth="10" strokeLinecap="round" />
                  <path d="M-76 -16 Q-62 0 -76 16" fill="none" stroke="#0f172a" strokeWidth="8" />
                </g>
              </g>
            </ClickableHotspot>
          )}

          {/* Crude pipeline */}
          {hasPump && hasRefinery && (
            <g>
              <path d="M180 295 L295 295" stroke="#1e293b" strokeWidth="10" />
              {isPumping && (
                <path
                  d="M180 295 L295 295"
                  stroke="#fbbf24"
                  strokeWidth="4"
                  strokeDasharray="8 8"
                  className="animate-flow"
                />
              )}
            </g>
          )}

          {/* 2. REFINERY DISTILLATION TOWER */}
          {!hasRefinery ? (
            <BuildSlotPlaceholder
              x={290}
              y={105}
              width={165}
              height={200}
              label="Raffineria"
              stepNumber={2}
              onClick={() => onBuildPart('raffineria')}
            />
          ) : (
            <ClickableHotspot
              x={434}
              y={120}
              label="Torre di Raffinazione"
              badgeColor="#b45309"
              onClick={() => onDiscover('raffineria_petrolio')}
            >
              <g>
                <rect x="315" y="110" width="90" height="200" rx="22" fill="#e2e8f0" stroke="#475569" strokeWidth="3.5" />
                {/* Distillation bands */}
                <rect x="323" y="135" width="74" height="32" rx="6" fill="#fef08a" />
                <text x="360" y="155" textAnchor="middle" fontSize="10" fontWeight="700" fill="#713f12">
                  GAS
                </text>
                <rect x="323" y="176" width="74" height="38" rx="6" fill="#fb923c" />
                <text x="360" y="199" textAnchor="middle" fontSize="10" fontWeight="700" fill="#7c2d12">
                  BENZINA
                </text>
                <rect x="323" y="224" width="74" height="38" rx="6" fill="#b45309" />
                <text x="360" y="247" textAnchor="middle" fontSize="10" fontWeight="700" fill="#ffffff">
                  GASOLIO
                </text>
                <rect x="323" y="270" width="74" height="28" rx="6" fill="#1e293b" />
                <text x="360" y="288" textAnchor="middle" fontSize="10" fontWeight="700" fill="#e2e8f0">
                  BITUME
                </text>
              </g>
            </ClickableHotspot>
          )}

          {/* Fuel pipe */}
          {hasRefinery && hasEngine && (
            <g>
              <path d="M405 195 L515 245" stroke="#ea580c" strokeWidth="7" />
              {engineRunning && (
                <path
                  d="M405 195 L515 245"
                  stroke="#fde047"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                  className="animate-flow-fast"
                />
              )}
            </g>
          )}

          {/* 3. INTERNAL COMBUSTION ENGINE + VEHICLE */}
          {!hasEngine ? (
            <BuildSlotPlaceholder
              x={510}
              y={190}
              width={210}
              height={120}
              label="Motore & Veicolo"
              stepNumber={3}
              onClick={() => onBuildPart('motore')}
            />
          ) : (
            <ClickableHotspot
              x={702}
              y={202}
              label="Motore a Scoppio"
              badgeColor="#dc2626"
              onClick={() => onDiscover('motore_scoppio')}
            >
              <g>
                {/* Car / Generator Truck */}
                <rect x="520" y="242" width="185" height="50" rx="14" fill="#dc2626" stroke="#7f1d1d" strokeWidth="3" />
                <path d="M552 242 L575 202 L655 202 L680 242 Z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="3" />
                <rect x="582" y="210" width="32" height="24" rx="4" fill="#bae6fd" />
                <rect x="622" y="210" width="30" height="24" rx="4" fill="#bae6fd" />
                {/* Spinning wheels */}
                {[560, 665].map((wx) => (
                  <g key={wx} transform={`translate(${wx}, 294)`}>
                    <g
                      style={{
                        animation: engineRunning ? `spin-smooth ${Math.max(0.3, 1.5 - pumpSpeed / 100)}s linear infinite` : 'none',
                      }}
                    >
                      <circle r="20" fill="#0f172a" />
                      <circle r="10" fill="#cbd5e1" />
                      <line x1="-10" y1="0" x2="10" y2="0" stroke="#475569" strokeWidth="2.5" />
                      <line x1="0" y1="-10" x2="0" y2="10" stroke="#475569" strokeWidth="2.5" />
                    </g>
                  </g>
                ))}
                {/* Exhaust puff */}
                {engineRunning && (
                  <circle cx="505" cy="285" r="8" fill="#64748b" opacity="0.55" className="animate-float-up" />
                )}
              </g>
            </ClickableHotspot>
          )}

          <g transform="translate(510, 18)">
            <rect width="232" height="56" rx="10" fill="#ffffff" fillOpacity="0.94" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="12" y="22" fontSize="11" fontWeight="600" fill="#475569">
              POTENZA MOTORE · RISERVA
            </text>
            <text x="12" y="43" fontSize="16" fontWeight="700" fill="#0f172a" fontFamily="JetBrains Mono, monospace">
              {outputPower} CV · {Math.round(oilReserve)}%
            </text>
          </g>
        </svg>
      </div>

      {/* Controls */}
      <div className="lg:col-span-4 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base font-bold text-slate-900">Controllo Estrazione</h4>
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                oilReserve <= 0
                  ? 'bg-red-50 text-red-800'
                  : engineRunning
                  ? 'bg-amber-50 text-amber-900'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {oilReserve <= 0 ? 'POZZO VUOTO' : engineRunning ? 'MOTORE ATTIVO' : 'IN PAUSA'}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                <label htmlFor="oil-slider" className="inline-flex items-center gap-1.5">
                  <Fuel className="h-4 w-4 text-amber-700" />
                  <span>Velocità Pompa & Motore</span>
                </label>
                <span className="font-mono tabular-nums text-amber-800">{pumpSpeed}%</span>
              </div>
              <input
                id="oil-slider"
                type="range"
                min={0}
                max={100}
                value={pumpSpeed}
                onChange={(e) => setPumpSpeed(Number(e.target.value))}
                className="mt-2 h-2.5 w-full cursor-pointer accent-amber-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEngineOn((v) => !v)}
                className={`rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${
                  engineOn ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {engineOn ? 'Spegni Motore' : 'Avvia Motore'}
              </button>
              <button
                type="button"
                onClick={() => setOilReserve(100)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Nuovo Pozzo</span>
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h5 className="text-sm font-bold text-slate-900">Dal Grezzo alla Benzina</h5>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            Il petrolio estratto dal sottosuolo è denso e scuro: nella torre di raffinazione viene scaldato e diviso in gas, benzina, gasolio e bitume!
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   3. METANO (Gasdotto + Turbogas Fiamma Blu + Condominio)
   ============================================================================ */
export function MethaneSim({ builtParts, onBuildPart, onDiscover }: SimProps) {
  const [valveOpen, setValveOpen] = useState(75);
  const [heatingOn, setHeatingOn] = useState(true);

  const hasPipe = Boolean(builtParts.gasdotto);
  const hasTurbogas = Boolean(builtParts.turbogas);
  const hasCondo = Boolean(builtParts.condominio);
  const allBuilt = hasPipe && hasTurbogas && hasCondo;

  const isFlowing = hasPipe && valveOpen > 5;
  const outputKw = isFlowing && hasTurbogas ? Math.round((valveOpen / 100) * 600) : 0;
  const condoWarm = allBuilt && outputKw > 20 && heatingOn;
  const spinDuration = outputKw > 0 ? Math.max(0.25, 1.8 - (valveOpen / 100) * 1.5) : 0;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
      <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-semibold text-blue-800">
            Fonte Esauribile: Gas Metano (Chimica) → Fiamma Blu (Termica) → Turbogas → Elettricità & Calore
          </div>
          <span className="text-xs font-medium text-slate-500">
            Clicca sugli oggetti con <strong className="text-slate-900">?</strong> per scoprire gli inventori
          </span>
        </div>

        <svg
          viewBox="0 0 760 430"
          className="w-full h-auto rounded-xl border border-slate-200"
          role="img"
          aria-label="Simulazione centrale a gas metano"
        >
          <rect x="0" y="0" width="760" height="325" fill="#e0f2fe" />
          <rect x="0" y="325" width="760" height="105" fill="#86efac" />

          {/* 1. GAS PIPELINE & VALVE */}
          {!hasPipe ? (
            <BuildSlotPlaceholder
              x={35}
              y={215}
              width={180}
              height={115}
              label="Gasdotto & Valvola"
              stepNumber={1}
              onClick={() => onBuildPart('gasdotto')}
            />
          ) : (
            <ClickableHotspot
              x={196}
              y={222}
              label="Gasdotto Metano"
              badgeColor="#2563eb"
              onClick={() => onDiscover('gas_volta')}
            >
              <g>
                <rect x="25" y="295" width="190" height="22" rx="6" fill="#eab308" stroke="#854d0e" strokeWidth="2.5" />
                {isFlowing && (
                  <line
                    x1="32"
                    y1="306"
                    x2="210"
                    y2="306"
                    stroke="#38bdf8"
                    strokeWidth="6"
                    strokeDasharray="10 8"
                    className={valveOpen > 55 ? 'animate-flow-fast' : 'animate-flow'}
                  />
                )}
                {/* Rotary valve wheel */}
                <line x1="120" y1="265" x2="120" y2="295" stroke="#475569" strokeWidth="7" />
                <circle
                  cx="120"
                  cy="262"
                  r="22"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="6"
                  transform={`rotate(${valveOpen * 1.8} 120 262)`}
                />
                <text x="120" y="344" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="700">
                  VALVOLA METANO: {valveOpen}%
                </text>
              </g>
            </ClickableHotspot>
          )}

          {/* 2. TURBOGAS COMBUSTOR */}
          {!hasTurbogas ? (
            <BuildSlotPlaceholder
              x={255}
              y={170}
              width={215}
              height={155}
              label="Bruciatore & Turbogas"
              stepNumber={2}
              onClick={() => onBuildPart('turbogas')}
            />
          ) : (
            <ClickableHotspot
              x={448}
              y={178}
              label="Centrale Turbogas"
              badgeColor="#0284c7"
              onClick={() => onDiscover('turbina_gas')}
            >
              <g>
                <rect x="255" y="195" width="210" height="128" rx="14" fill="#f8fafc" stroke="#475569" strokeWidth="3" />
                {/* Combustion chamber with clean BLUE methane flame */}
                <rect x="270" y="218" width="90" height="82" rx="8" fill="#0f172a" />
                {isFlowing && (
                  <g>
                    <path
                      d={`M285 260 Q315 ${240 - (valveOpen / 100) * 14} 348 260 Q315 ${280 + (valveOpen / 100) * 14} 285 260 Z`}
                      fill="#3b82f6"
                    />
                    <path d="M292 260 Q315 248 338 260 Q315 272 292 260 Z" fill="#93c5fd" />
                  </g>
                )}

                {/* Gas Turbine spinning */}
                <g transform="translate(405, 259)">
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
                        stroke="#2563eb"
                        strokeWidth="5"
                        strokeLinecap="round"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    <circle r="10" fill="#0f172a" />
                  </g>
                </g>
              </g>
            </ClickableHotspot>
          )}

          {/* Pipe/wire to condo */}
          {hasTurbogas && hasCondo && (
            <g>
              <path d="M465 258 L545 258" stroke={outputKw > 0 ? '#f59e0b' : '#64748b'} strokeWidth="5" />
              {condoWarm && (
                <path
                  d="M465 258 L545 258"
                  stroke="#fef08a"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                  className="animate-flow-fast"
                />
              )}
            </g>
          )}

          {/* 3. APARTMENT BUILDING ("CONDOMINIO") */}
          {!hasCondo ? (
            <BuildSlotPlaceholder
              x={545}
              y={135}
              width={175}
              height={195}
              label="Condominio"
              stepNumber={3}
              onClick={() => onBuildPart('condominio')}
            />
          ) : (
            <g>
              <rect x="550" y="140" width="165" height="190" rx="8" fill="#fef9c3" stroke="#854d0e" strokeWidth="3" />
              <rect x="542" y="128" width="181" height="18" rx="4" fill="#b45309" />
              {[162, 212, 262].map((wy) =>
                [570, 620, 670].map((wx) => (
                  <rect
                    key={`${wx}-${wy}`}
                    x={wx}
                    y={wy}
                    width="30"
                    height="32"
                    rx="4"
                    fill={condoWarm ? '#fde047' : '#334155'}
                    stroke="#854d0e"
                    strokeWidth="2"
                  />
                ))
              )}
              <text x="632" y="318" textAnchor="middle" fill="#713f12" fontSize="11" fontWeight="700">
                CONDOMINIO CALDO
              </text>
            </g>
          )}

          <g transform="translate(18, 18)">
            <rect width="230" height="54" rx="10" fill="#ffffff" fillOpacity="0.94" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="12" y="22" fontSize="11" fontWeight="600" fill="#475569">
              POTENZA TURBOGAS
            </text>
            <text x="12" y="43" fontSize="16" fontWeight="700" fill="#0f172a" fontFamily="JetBrains Mono, monospace">
              {outputKw} kW · Fiamma Blu
            </text>
          </g>
        </svg>
      </div>

      {/* Controls */}
      <div className="lg:col-span-4 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base font-bold text-slate-900">Controllo Valvola Gas</h4>
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                condoWarm ? 'bg-blue-50 text-blue-800' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {!allBuilt ? 'IN COSTRUZIONE' : condoWarm ? 'ATTIVO' : 'VALVOLA CHIUSA'}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                <label htmlFor="methane-slider" className="inline-flex items-center gap-1.5">
                  <Gauge className="h-4 w-4 text-blue-600" />
                  <span>Apertura Valvola Metano</span>
                </label>
                <span className="font-mono tabular-nums text-blue-700">{valveOpen}%</span>
              </div>
              <input
                id="methane-slider"
                type="range"
                min={0}
                max={100}
                value={valveOpen}
                onChange={(e) => setValveOpen(Number(e.target.value))}
                className="mt-2 h-2.5 w-full cursor-pointer accent-blue-600"
              />
            </div>

            <button
              type="button"
              onClick={() => setHeatingOn((v) => !v)}
              className={`w-full rounded-xl px-4 py-2.5 text-xs font-bold transition-colors ${
                heatingOn ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {heatingOn ? 'Spegni Luci & Termosifoni' : 'Accendi Luci & Termosifoni'}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h5 className="text-sm font-bold text-slate-900">Fiamma Azzurra</h5>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            Il metano brucia con una fiamma blu molto pulita rispetto a carbone e petrolio, ma resta comunque una fonte fossile esauribile!
          </p>
        </div>
      </div>
    </div>
  );
}
