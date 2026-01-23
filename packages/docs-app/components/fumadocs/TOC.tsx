"use client";

import { useRef } from "react";
import {
    AnchorProvider,
    ScrollProvider,
    TOCItem,
    type TOCItemType,
} from "fumadocs-core/toc";

interface TOCProps {
    items: TOCItemType[];
}

export function TOC({ items }: TOCProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    if (items.length === 0) {
        return null;
    }

    return (
        <AnchorProvider toc={items}>
            <div className="docs-toc">
                <div className="docs-toc-title">On this page</div>
                <div ref={containerRef} className="docs-toc-items">
                    <ScrollProvider containerRef={containerRef}>
                        {items.map(item => (
                            <TOCItem
                                key={item.url}
                                href={item.url}
                                className="docs-toc-item"
                                data-level={item.depth}
                            >
                                {item.title}
                            </TOCItem>
                        ))}
                    </ScrollProvider>
                </div>
            </div>
        </AnchorProvider>
    );
}
