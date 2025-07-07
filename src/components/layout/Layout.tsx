
import { ReactNode } from 'react';
import { NavBar } from './NavBar';

interface LayoutProps {
  children: ReactNode;
  fullscreen?: boolean;
}

export function Layout({ children, fullscreen = false }: LayoutProps) {
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-x-hidden w-full max-w-full">
      <NavBar />
      {fullscreen ? (
        <main className="flex-1 overflow-hidden w-full relative">
          {children}
        </main>
      ) : (
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      )}
    </div>
  );
}
