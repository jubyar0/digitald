import type { MDXComponents } from 'mdx/types';
import { cn } from '@/lib/utils';

// Callout component for MDX
function Callout({
    type = 'info',
    children,
}: {
    type?: 'info' | 'warn' | 'error';
    children: React.ReactNode;
}) {
    const styles = {
        info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
        warn: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
        error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
    };

    const icons = {
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
    };

    return (
        <div className={cn('p-4 my-4 rounded-lg border', styles[type])}>
            <span className="mr-2">{icons[type]}</span>
            {children}
        </div>
    );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...components,
        Callout,
    };
}

export function getMDXComponents(): MDXComponents {
    return {
        Callout,
    };
}
