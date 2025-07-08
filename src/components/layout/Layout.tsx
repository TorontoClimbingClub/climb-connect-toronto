
import { ReactNode, useState, useEffect } from 'react';
import { NavBar } from './NavBar';
import { MultiPanelLayout } from './MultiPanelLayout';

interface LayoutProps {
  children: ReactNode;
  fullscreen?: boolean;
  useDesktopLayout?: boolean;
  contextPanel?: ReactNode;
  layoutType?: 'two-panel' | 'three-panel' | 'four-panel';
}

export function Layout({ 
  children, 
  fullscreen = false, 
  useDesktopLayout = false,
  contextPanel,
  layoutType = 'two-panel'
}: LayoutProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Auto-detect layout: use desktop layout only if requested AND on desktop screen
  const shouldUseDesktopLayout = useDesktopLayout && isDesktop;
  // Mobile-first layout (original behavior)
  const MobileLayout = () => (
    <div className={`${fullscreen ? 'h-screen' : 'min-h-screen'} bg-gray-50 flex flex-col overflow-x-hidden w-full max-w-full`}>
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

  // Desktop-centric layout (only used on desktop screens)
  const DesktopLayout = () => (
    <div className="h-screen bg-gray-50 flex flex-col overflow-x-hidden w-full max-w-full">
      {/* Desktop multi-panel layout */}
      <div className="flex-1 overflow-hidden">
        <MultiPanelLayout 
          contextPanel={contextPanel}
          layoutType={layoutType}
        >
          {children}
        </MultiPanelLayout>
      </div>
    </div>
  );

  // Return appropriate layout based on screen size detection
  return shouldUseDesktopLayout ? <DesktopLayout /> : <MobileLayout />;
}
