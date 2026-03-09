import type { NextPageContext } from 'next';

function Error({ statusCode }: { statusCode?: number }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">
          {statusCode ? `Error ${statusCode}` : 'Something went wrong'}
        </h1>
        <p className="text-zinc-400 mb-4">
          Try refreshing the page or restarting the dev server.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-400 hover:bg-teal-500/30"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
