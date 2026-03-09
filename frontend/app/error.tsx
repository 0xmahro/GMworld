'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-xl font-bold text-zinc-100 mb-2">Something went wrong</h1>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-400"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
