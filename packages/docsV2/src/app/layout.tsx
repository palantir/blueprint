import { ReactNode } from 'react';
import { Sidebar } from '@/components/sidebar';
import { source } from '@/lib/source';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bp5-dark">
      <body className="bp5-dark">
        <div className="docs-container">
          <Sidebar tree={source.pageTree} />
          <main className="docs-main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
