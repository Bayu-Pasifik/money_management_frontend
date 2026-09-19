type IconProps = {
  className?: string;
};

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function IconHome({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 10.5 12 4l8.5 6.5" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M9.5 20v-6h5v6" />
    </svg>
  );
}

export function IconReceipt({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 3.5h12v17l-2.5-1.5L13 20.5 10.5 19 8 20.5 5.5 19V3.5" />
      <path d="M8.5 8h7M8.5 11.5h7M8.5 15h4.5" />
    </svg>
  );
}

export function IconTag({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M11.5 3.5H5a1.5 1.5 0 0 0-1.5 1.5v6.5l9.6 9.6a1.5 1.5 0 0 0 2.12 0l5.88-5.88a1.5 1.5 0 0 0 0-2.12L11.5 3.5Z" />
      <circle cx="8.25" cy="8.25" r="1.5" />
    </svg>
  );
}

export function IconTelegram({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M7 12.2 16 8l-1.7 8.5-3.2-2.4-1.6 1.6-.3-2.7L7 12.2Z" />
    </svg>
  );
}

export function IconCard({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="6" width="17" height="12" rx="2" />
      <path d="M3.5 10h17" />
      <path d="M7 14.5h4" />
    </svg>
  );
}

export function IconWallet({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h11a2 2 0 0 1 2 2v1h-2v-1h-11v11h13v-3.5h2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-9.5Z" />
      <path d="M16 11.5h3.5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H16a2 2 0 0 1 0-4Z" />
    </svg>
  );
}
