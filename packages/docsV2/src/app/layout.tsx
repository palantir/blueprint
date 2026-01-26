import { ReactNode } from 'react';
import { Sidebar } from '@/components/sidebar';
import { pageTree } from '@/lib/page-tree';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bp5-dark">
      <body className="bp5-dark">
        <div className="docs-container">
          <Sidebar tree={pageTree} />
          <main className="docs-main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
