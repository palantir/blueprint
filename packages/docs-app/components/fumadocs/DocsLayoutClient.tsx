"use client";

import type { ReactNode } from "react";
import type { TableOfContents, PageTree } from "fumadocs-core/server";
import { Sidebar } from "./Sidebar";
import { TOC } from "./TOC";
import { DocsHeader } from "./DocsHeader";

interface DocsLayoutClientProps {
    children: ReactNode;
    toc?: TableOfContents;
    tree: PageTree.Root;
}

export function DocsLayoutClient({ children, toc, tree }: DocsLayoutClientProps) {
    return (
        <div className="docs-root">
            <div className="docs-nav-wrapper">
                <div className="docs-sidebar-header">
                    <h2 className="bp5-heading" style={{ margin: 0, fontSize: "18px" }}>
                        Blueprint
                    </h2>
                </div>
                <Sidebar tree={tree} />
            </div>

            <DocsHeader />

            <main className="docs-content-wrapper" style={{ paddingTop: "70px" }}>
                {children}
            </main>

            {toc && toc.length > 0 && (
                <div className="docs-toc-wrapper" style={{ paddingTop: "70px" }}>
                    <TOC items={toc} />
                </div>
            )}
        </div>
    );
}
