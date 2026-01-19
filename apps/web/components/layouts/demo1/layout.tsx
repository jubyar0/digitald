'use client';

import dynamic from 'next/dynamic';
import { ReactNode, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSettings } from '@/providers/settings-provider';

// Loading skeleton components for better UX
const SidebarSkeleton = () => (
  <div className="fixed top-0 bottom-0 left-0 z-20 w-[280px] h-screen bg-background animate-pulse border-r" />
);

const HeaderSkeleton = () => (
  <div className="fixed top-0 left-0 right-0 z-10 h-16 w-full bg-background animate-pulse border-b" />
);

// Dynamic imports with SSR disabled and loading states
const Sidebar = dynamic(() => import('./components/sidebar').then(mod => ({ default: mod.Sidebar })), {
  loading: () => <SidebarSkeleton />,
  ssr: false, // Disable SSR for faster initial render
});

const Header = dynamic(() => import('./components/header').then(mod => ({ default: mod.Header })), {
  loading: () => <HeaderSkeleton />,
  ssr: false,
});

const SellerHeader = dynamic(() => import('./components/seller-header').then(mod => ({ default: mod.SellerHeader })), {
  loading: () => <HeaderSkeleton />,
  ssr: false,
});

const AdminHeader = dynamic(() => import('./components/admin-header').then(mod => ({ default: mod.AdminHeader })), {
  loading: () => <HeaderSkeleton />,
  ssr: false,
});

interface Demo1LayoutProps {
  children: ReactNode;
  layoutRole?: 'admin' | 'seller' | 'user' | 'developer';
}

export function Demo1Layout({ children, layoutRole = 'admin' }: Demo1LayoutProps) {
  const isMobile = useIsMobile();
  const { settings, setOption } = useSettings();
  const isInitialized = useRef(false);

  // Single optimized useEffect for all body class operations
  useEffect(() => {
    const bodyClass = document.body.classList;

    // Initial setup (runs once)
    if (!isInitialized.current) {
      bodyClass.add('demo1', 'sidebar-fixed', 'header-fixed', 'layout-initialized');
      setOption('layout', 'demo1');
      isInitialized.current = true;
    }

    // Sidebar collapse toggle
    if (settings.layouts.demo1.sidebarCollapse) {
      bodyClass.add('sidebar-collapse');
    } else {
      bodyClass.remove('sidebar-collapse');
    }

    // Cleanup on unmount
    return () => {
      bodyClass.remove('demo1', 'sidebar-fixed', 'sidebar-collapse', 'header-fixed', 'layout-initialized');
    };
  }, [settings.layouts.demo1.sidebarCollapse, setOption]);

  // Select header component based on role
  const HeaderComponent = layoutRole === 'seller' ? SellerHeader : (layoutRole === 'admin' ? AdminHeader : Header);

  return (
    <>
      {!isMobile && <Sidebar />}

      <div className="wrapper flex grow flex-col min-h-screen" suppressHydrationWarning>
        <HeaderComponent />

        <main className="grow pt-[calc(var(--header-height)+1.25rem)]">
          {children}
        </main>
      </div>
    </>
  );
}
