// Inline SVG logo — theme-aware via `color` prop (defaults to T.GREEN where used).
// Renders the three-bar mark: two solid bars (small, medium) + one outlined tall bar
// with a partial fill, representing "tracking in progress."

export default function Logo({ size = 24, color = "#3fb950", className }) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="14" y="36" width="8" height="18" rx="2" fill={color} />
      <rect x="28" y="24" width="8" height="30" rx="2" fill={color} />
      <rect x="42" y="12" width="8" height="42" rx="2" fill="none" stroke={color} strokeWidth="2.5" />
      <rect x="42" y="31" width="8" height="23" rx="2" fill={color} />
    </svg>
  );
}
