export default function ProgressRing({ percent }) {
  const clamped = Math.max(0, Math.min(100, Number(percent) || 0));
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="w-14 h-14 rounded-full shrink-0 flex items-center justify-center relative bg-[rgba(55,138,221,0.08)] ring-1 ring-[#85b7eb]/35">
      <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true" className="absolute inset-0">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="rgba(55,138,221,0.18)" strokeWidth="4" />
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="#378add"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 28 28)"
        />
      </svg>
      <span className="text-xs font-semibold relative z-1 text-white">{clamped}%</span>
    </div>
  );
}

