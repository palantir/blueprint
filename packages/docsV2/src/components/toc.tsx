'use client';

import { useRef } from 'react';
import { AnchorProvider, ScrollProvider, TOCItem } from 'fumadocs-core/toc';

// Define locally since TOCItemType is not exported from fumadocs-core/toc in v14.x
interface TOCItemType {
  title: string;
  url: string;
  depth: number;
}

interface TOCProps {
  items: TOCItemType[];
}

export function TableOfContents({ items }: TOCProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <AnchorProvider toc={items}>
      <nav className="docs-toc" ref={containerRef}>
        <h4>On this page</h4>
        <ScrollProvider containerRef={containerRef}>
          {items.map((item) => (
            <TOCItem
              key={item.url}
              href={item.url}
              className="toc-item"
              style={{ paddingLeft: `${(item.depth - 2) * 12}px` }}
            >
              {item.title}
            </TOCItem>
          ))}
        </ScrollProvider>
      </nav>
    </AnchorProvider>
  );
}
