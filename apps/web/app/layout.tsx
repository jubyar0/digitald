import { Suspense } from "react";
import "./styles/globals.css";
// import "fumadocs-ui/style.css";

import { cn } from "@/lib/utils";
import { Inter, Space_Grotesk } from "next/font/google";
import type { Metadata } from 'next';
import { AuthProvider } from "@/providers/auth-provider";
import { SettingsProvider } from "@/providers/settings-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { NavigationProgress } from "@/components/navigation-progress";
import { QueryProvider } from "@/providers/query-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";
import LiveChatWidget from "@/components/livechat/livechat-widget";

// Inter font for body text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  preload: false,
  fallback: ['system-ui', 'arial'],
});

// Space Grotesk font for headings
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  preload: false,
});

export const metadata: Metadata = {
  title: 'Digital Marketplace',
  description: 'A digital marketplace platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('nextjs-theme');
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                const activeTheme = theme === 'system' || !theme ? systemTheme : theme;
                
                if (activeTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased demo1 sidebar-fixed header-fixed",
          inter.variable,
          spaceGrotesk.variable
        )}
      >

        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <AuthProvider>
          <QueryProvider>
            <SettingsProvider>
              <ThemeProvider>
                {children}
                <Toaster richColors position="top-center" />
                <SpeedInsights />
                <LiveChatWidget />
              </ThemeProvider>
            </SettingsProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}