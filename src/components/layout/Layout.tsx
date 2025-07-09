
import { ReactNode } from 'react';
import { NavBar } from './NavBar';
import { MultiPanelLayout } from './MultiPanelLayout';
import { useShouldUseDesktopLayout } from '@/hooks/useLayoutState';

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
  const shouldUseDesktopLayout = useShouldUseDesktopLayout(useDesktopLayout);
  
  // Show loading skeleton during hydration
  if (!shouldUseDesktopLayout && typeof window === 'undefined') {
    return (
      <div className={`layout-container ${fullscreen ? 'layout-fullscreen' : 'layout-default'} layout-loading`}>
        <div className="layout-skeleton">
          <div className="skeleton-nav"></div>
          <div className="skeleton-content"></div>
        </div>
      </div>
    );
  }

  // Mobile-first layout with CSS-first responsive classes
  const MobileLayout = () => (
    <div className={`layout-container layout-mobile ${fullscreen ? 'layout-fullscreen' : 'layout-default'}`}>
      <NavBar />
      {fullscreen ? (
        <main className="layout-main layout-main-fullscreen">
          {children}
        </main>
      ) : (
        <main className="layout-main layout-main-default">
          <div className="layout-content">
            {children}
          </div>
        </main>
      )}
    </div>
  );

  // Desktop layout with CSS-first responsive classes
  const DesktopLayout = () => (
    <div className="layout-container layout-desktop">
      <div className="layout-panels">
        <MultiPanelLayout 
          contextPanel={contextPanel}
          layoutType={layoutType}
        >
          {children}
        </MultiPanelLayout>
      </div>
    </div>
  );

  // Return appropriate layout with smooth transition
  return (
    <div className="layout-transition">
      {shouldUseDesktopLayout ? <DesktopLayout /> : <MobileLayout />}
    </div>
  );
}
