'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { PageTree } from 'fumadocs-core/server';

interface SidebarProps {
  tree: PageTree.Root;
}

export function Sidebar({ tree }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav className="docs-sidebar">
      <div className="sidebar-header">
        <h3>Blueprint</h3>
      </div>
      <div className="sidebar-content">
        {tree.children.map((node) => {
          if (node.type === 'page') {
            const isActive = pathname === node.url;
            return (
              <Link
                key={node.url}
                href={node.url}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
              >
                {node.name}
              </Link>
            );
          }
          return null;
        })}
      </div>
    </nav>
  );
}
