'use client';

import { useState } from 'react';
import { WalletButton } from '@/components/WalletButton';
import { LanguageSelector } from '@/components/LanguageSelector';
import { GMButtons } from '@/components/GMButtons';
import { GlobalCounters } from '@/components/GlobalCounters';
import { MessageFeed } from '@/components/MessageFeed';
import { LanguageRanking } from '@/components/LanguageRanking';
import { LANGUAGES, type Language } from '@/lib/languages';

export default function HomeContent() {
  const [language, setLanguage] = useState<Language>(LANGUAGES[0]);

  return (
    <main className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800/50 sticky top-0 z-40 bg-zinc-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">GM World</h1>
          <WalletButton />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        <section className="text-center space-y-6">
          <p className="text-zinc-400 text-lg">
            Say Good Morning or Good Night on-chain. On Base.
          </p>
          <div className="flex justify-center">
            <LanguageSelector value={language} onChange={setLanguage} />
          </div>
          <GMButtons language={language} />
          <GlobalCounters />
        </section>

        <section>
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">
            Dil sıralaması (GM / GN)
          </h2>
          <LanguageRanking />
        </section>

        <section>
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">
            Live Feed
          </h2>
          <MessageFeed />
        </section>
      </div>

      <footer className="border-t border-zinc-800/50 mt-24 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-zinc-500 text-sm">
          GM World · Built on Base
        </div>
      </footer>
    </main>
  );
}
