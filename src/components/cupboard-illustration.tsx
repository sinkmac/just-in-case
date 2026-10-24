"use client";

export function CupboardIllustration({ className }: { className?: string }) {
  return (
    <svg
      width="340"
      height="260"
      viewBox="0 0 340 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className ?? "w-full h-auto max-w-md"}
      aria-label="Cupboard"
      role="img"
    >
      <defs>
        <filter id="cupboard-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.15" />
        </filter>
      </defs>
      {/* Cupboard body */}
      <rect x="24" y="32" width="292" height="184" fill="#FFF8EC" stroke="#5A4636" strokeWidth="3" rx="6" />
      {/* Shelf lines */}
      <line x1="24" y1="104" x2="316" y2="104" stroke="#5A4636" strokeWidth="2" />
      <line x1="24" y1="168" x2="316" y2="168" stroke="#5A4636" strokeWidth="2" />
      {/* Door gap lines */}
      <line x1="114" y1="32" x2="114" y2="216" stroke="#5A4636" strokeWidth="2" />
      <line x1="226" y1="32" x2="226" y2="216" stroke="#5A4636" strokeWidth="2" />
      {/* Handle */}
      <circle cx="200" cy="124" r="5" fill="#A63D1C" />
    </svg>
  );
}
