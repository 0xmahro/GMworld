export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-300">
      <h1 className="text-4xl font-bold text-zinc-100 mb-2">404</h1>
      <p className="text-zinc-500 mb-6">Page not found</p>
      <a
        href="/"
        className="px-4 py-2 rounded-lg bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 transition"
      >
        Back to GM World
      </a>
    </div>
  );
}
