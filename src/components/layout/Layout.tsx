
import { ReactNode } from 'react';
import { NavBar } from './NavBar';

interface LayoutProps {
  children: ReactNode;
  fullscreen?: boolean;
}

export function Layout({ children, fullscreen = false }: LayoutProps) {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <NavBar />
      {fullscreen ? (
        <main className="flex-1 overflow-hidden h-full">
          {children}
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      )}
    </div>
  );
}
