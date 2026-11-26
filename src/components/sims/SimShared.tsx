import type { ReactNode } from 'react';

export interface SimProps {
  builtParts: Record<string, boolean>;
  onBuildPart: (partId: string) => void;
  onDiscover: (discoveryId: string) => void;
}

interface ClickableHotspotProps {
  onClick: () => void;
  label: string;
  children: ReactNode;
  x: number;
  y: number;
  badgeColor?: string;
}

/**
 * Wraps an SVG assembly with an accessible click handler and a subtle "?" info badge
 * so children immediately know they can click objects to read inventor pop-ups.
 */
export function ClickableHotspot({
  onClick,
  label,
  children,
  x,
  y,
  badgeColor = '#0f172a',
}: ClickableHotspotProps) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`Scopri di più su: ${label}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="cursor-pointer group focus:outline-none"
    >
      {children}
      <g transform={`translate(${x}, ${y})`} className="transition-transform group-hover:scale-110">
        <circle r="13" fill={badgeColor} opacity="0.16" className="hotspot-pulse" />
        <circle
          r="10"
          fill="#ffffff"
          stroke={badgeColor}
          strokeWidth="2"
          className="transition-colors group-hover:fill-amber-50"
        />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="11"
          fontWeight="700"
          fill={badgeColor}
          fontFamily="Outfit, sans-serif"
        >
          ?
        </text>
      </g>
    </g>
  );
}

interface BuildSlotPlaceholderProps {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  stepNumber: number;
  onClick: () => void;
}

export function BuildSlotPlaceholder({
  x,
  y,
  width,
  height,
  label,
  stepNumber,
  onClick,
}: BuildSlotPlaceholderProps) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`Monta componente ${stepNumber}: ${label}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="cursor-pointer group focus:outline-none"
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="14"
        fill="#f8fafc"
        fillOpacity="0.88"
        stroke="#64748b"
        strokeWidth="2.5"
        strokeDasharray="7 5"
        className="transition-colors group-hover:fill-amber-50 group-hover:stroke-amber-600"
      />
      <circle
        cx={x + width / 2}
        cy={y + height / 2 - 12}
        r="14"
        fill="#0f172a"
        className="transition-colors group-hover:fill-amber-600"
      />
      <text
        x={x + width / 2}
        y={y + height / 2 - 11}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#ffffff"
        fontSize="13"
        fontWeight="700"
      >
        +{stepNumber}
      </text>
      <text
        x={x + width / 2}
        y={y + height / 2 + 14}
        textAnchor="middle"
        fill="#0f172a"
        fontSize="12"
        fontWeight="700"
        fontFamily="Outfit, sans-serif"
      >
        Monta {label}
      </text>
    </g>
  );
}
