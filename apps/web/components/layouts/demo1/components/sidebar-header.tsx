'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronFirst } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useSettings } from '@/providers/settings-provider';
import { Button } from '@/components/dashboard/ui/button';

export function SidebarHeader() {
  const { settings, storeOption } = useSettings();

  const handleToggleClick = () => {
    storeOption(
      'layouts.demo1.sidebarCollapse',
      !settings.layouts.demo1.sidebarCollapse,
    );
  };

  return (
    <div className="sidebar-header hidden lg:flex items-center relative justify-between px-3 lg:px-6 shrink-0 overflow-visible">
      <Link href="/" prefetch={true}>
        {settings.layouts.demo1.sidebarCollapse ? (
          /* Collapsed State - Show Mini Logo */
          <>
            <div className="dark:hidden">
              <Image
                src={toAbsoluteUrl('/media/app/mini-logo.svg')}
                className="small-logo h-[22px] w-auto max-w-none"
                alt="Mini Logo"
                width={22}
                height={22}
                priority
                style={{ height: 'auto' }}
              />
            </div>
            <div className="hidden dark:block">
              <Image
                src={toAbsoluteUrl('/media/app/mini-logo.svg')}
                className="small-logo h-[22px] w-auto max-w-none"
                alt="Mini Logo"
                width={22}
                height={22}
                priority
                style={{ height: 'auto' }}
              />
            </div>
          </>
        ) : (
          /* Expanded State - Show Default Logo */
          <>
            <div className="dark:hidden">
              <Image
                src={toAbsoluteUrl('/media/app/default-logo.svg')}
                className="default-logo h-[22px] w-auto max-w-none"
                alt="Default Logo"
                width={150}
                height={22}
                priority
                style={{ height: 'auto' }}
              />
            </div>
            <div className="hidden dark:block">
              <Image
                src={toAbsoluteUrl('/media/app/default-logo-dark.svg')}
                className="default-logo h-[22px] w-auto max-w-none"
                alt="Default Dark Logo"
                width={150}
                height={22}
                priority
                style={{ height: 'auto' }}
              />
            </div>
          </>
        )}
      </Link>
      <Button
        onClick={handleToggleClick}
        size="sm"
        mode="icon"
        variant="outline"
        className={cn(
          'size-7 absolute left-full rtl:left-auto rtl:right-full top-2/4 rtl:translate-x-2/4 -translate-x-2/4 -translate-y-2/4 z-50 bg-background shadow-sm border border-border rounded-full flex items-center justify-center',
          settings.layouts.demo1.sidebarCollapse
            ? 'ltr:rotate-180'
            : 'rtl:rotate-180',
        )}
      >
        <ChevronFirst className="size-4!" />
      </Button>
    </div>
  );
}
