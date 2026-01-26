import { ReactNode } from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bp5-dark">
      <body className="bp5-dark">{children}</body>
    </html>
  );
}
