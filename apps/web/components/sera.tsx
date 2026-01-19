import React from 'react';

export const FadeIn = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={className}>{children}</div>
);

export const SlideIn = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={className}>{children}</div>
);

export const AnimatedButton = ({ children, className, ...props }: any) => (
    <button className={className} {...props}>{children}</button>
);

export const StaggerContainer = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={className}>{children}</div>
);

export const StaggerItem = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={className}>{children}</div>
);
