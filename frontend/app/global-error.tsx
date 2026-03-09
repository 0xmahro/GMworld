'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-zinc-950 text-zinc-100 min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-xl font-bold mb-2">Application error</h1>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-teal-500 text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
