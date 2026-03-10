import dynamic from 'next/dynamic';

const MainProviders = dynamic(() => import('./MainProviders'), { ssr: false });

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainProviders>{children}</MainProviders>;
}
