export default function Logo({ size = 42 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="logo-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="logo-navy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#0B132B" />
        </linearGradient>
        <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#F59E0B" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Outer Golden Border & Base */}
      <circle cx="24" cy="24" r="22.5" fill="url(#logo-navy)" stroke="url(#logo-gold)" strokeWidth="2" />
      
      {/* Decorative Inner Ring */}
      <circle cx="24" cy="24" r="19" stroke="url(#logo-gold)" strokeWidth="0.75" strokeDasharray="2 2" strokeOpacity="0.7" />

      {/* Flower Petals (Daffodil Bloom) */}
      <g filter="url(#logo-glow)">
        {/* Cardinal Petals */}
        <path
          d="M24 10C22.2 14.5 22.2 17.5 24 20C25.8 17.5 25.8 14.5 24 10Z"
          fill="url(#logo-gold)"
        />
        <path
          d="M24 38C22.2 33.5 22.2 30.5 24 28C25.8 30.5 25.8 33.5 24 38Z"
          fill="url(#logo-gold)"
        />
        <path
          d="M10 24C14.5 22.2 17.5 22.2 20 24C17.5 25.8 14.5 25.8 10 24Z"
          fill="url(#logo-gold)"
        />
        <path
          d="M38 24C33.5 22.2 30.5 22.2 28 24C30.5 25.8 33.5 25.8 38 24Z"
          fill="url(#logo-gold)"
        />

        {/* Diagonal Petals */}
        <path
          d="M14 14C17.5 17 19.5 18.5 21 21C18.5 19.5 17 17.5 14 14Z"
          fill="url(#logo-gold)"
          opacity="0.95"
        />
        <path
          d="M34 14C30.5 17 28.5 18.5 27 21C29.5 19.5 31 17.5 34 14Z"
          fill="url(#logo-gold)"
          opacity="0.95"
        />
        <path
          d="M14 34C17.5 31 19.5 29.5 21 27C18.5 28.5 17 30.5 14 34Z"
          fill="url(#logo-gold)"
          opacity="0.95"
        />
        <path
          d="M34 34C30.5 31 28.5 29.5 27 27C29.5 28.5 31 30.5 34 34Z"
          fill="url(#logo-gold)"
          opacity="0.95"
        />
      </g>

      {/* Central Corona / Sun Cup */}
      <circle cx="24" cy="24" r="5.5" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
      <circle cx="24" cy="24" r="3" fill="#D97706" />
      <circle cx="24" cy="24" r="1.2" fill="#FFFBEB" />
    </svg>
  );
}
