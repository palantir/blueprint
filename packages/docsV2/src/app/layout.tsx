import { ReactNode } from 'react';

import { AppShell } from '@/components/AppShell';
import { source } from '@/lib/source';

import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <AppShell pageTree={source.pageTree}>
                    {children}
                </AppShell>
            </body>
        </html>
    );
}
