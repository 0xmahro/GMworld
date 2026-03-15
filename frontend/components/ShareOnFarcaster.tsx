'use client';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://worldgm.xyz';
const WARPCAST_COMPOSE = 'https://warpcast.com/~/compose';

function buildShareUrl(text: string): string {
  const params = new URLSearchParams();
  params.set('text', text);
  params.set('embeds[]', APP_URL);
  return `${WARPCAST_COMPOSE}?${params.toString()}`;
}

const DEFAULT_SHARE_TEXT = `Just said GM on GM World ☀️\n${APP_URL}`;

interface ShareOnFarcasterProps {
  /** Pre-filled cast text. If not set, uses default app share message. */
  text?: string;
  /** Button label */
  label?: string;
  /** Optional class for the button */
  className?: string;
  /** Compact style (icon + short label) */
  compact?: boolean;
}

export function ShareOnFarcaster({
  text = DEFAULT_SHARE_TEXT,
  label = 'Share on Farcaster',
  className = '',
  compact = false,
}: ShareOnFarcasterProps) {
  const url = buildShareUrl(text);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ||
        'inline-flex items-center justify-center gap-2 rounded-xl border border-purple-500/40 bg-purple-500/10 px-4 py-2.5 text-sm font-medium text-purple-300 hover:bg-purple-500/20 hover:border-purple-400/50 transition-colors'
      }
    >
      {compact ? (
        <>
          <FarcasterIcon className="h-4 w-4" />
          <span>Share</span>
        </>
      ) : (
        <>
          <FarcasterIcon className="h-4 w-4" />
          <span>{label}</span>
        </>
      )}
    </a>
  );
}

function FarcasterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-4.5H8v-2h3V8.5h2v4.5h3v2h-3v4.5h-2z" />
    </svg>
  );
}
