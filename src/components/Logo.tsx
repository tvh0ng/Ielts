export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 whitespace-nowrap ${className}`}>
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#1f8a70" />
        <path d="M8 22.5 13.5 9h2.6l5.5 13.5h-2.9l-1.2-3.1h-5.6l-1.2 3.1H8Zm5-5.4h3.9l-1.95-5.2L13 17.1Z" fill="#fff" />
        <circle cx="24" cy="10" r="3" fill="#e0a040" />
      </svg>
      <span className="title-display text-lg leading-none">IELTS<span className="text-brand-500"> Master</span></span>
    </span>
  );
}
