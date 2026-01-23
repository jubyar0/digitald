'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSettings } from '@/providers/settings-provider';
import { SidebarHeader } from './sidebar-header';
import { SidebarMenu } from './sidebar-menu';
import { SidebarFooter } from './sidebar-footer';

export function Sidebar() {
  const { settings } = useSettings();
  const pathname = usePathname();

  // Only show sidebar footer for seller pages
  const showFooter = pathname.startsWith('/seller');

  return (
    <div
      className={cn(
        'sidebar bg-background lg:border-e lg:border-border lg:fixed lg:top-0 lg:bottom-0 lg:z-20 lg:flex flex-col items-stretch shrink-0 overflow-visible',
        (settings.layouts.demo1.sidebarTheme === 'dark' ||
          pathname.includes('dark-sidebar')) &&
        'dark',
      )}
    >
      <SidebarHeader />
      <div className="overflow-hidden flex-1 flex flex-col">
        <div className="w-(--sidebar-default-width) flex-1">
          <SidebarMenu />
        </div>
      </div>
      {showFooter && <SidebarFooter />}
    </div>
  );
}
