"use client";

import type { TableOfContents, PageTree } from "fumadocs-core/server";
import type { MDXContent } from "@content-collections/mdx/react";
import { Sidebar } from "./Sidebar";
import { TOC } from "./TOC";
import { DocsHeader } from "./DocsHeader";
import { useMDXComponents } from "@/mdx-components";

interface DocsPageClientProps {
    page: {
        title: string;
        description?: string;
        toc: TableOfContents;
        body: MDXContent;
    };
    tree: PageTree.Root;
}

export function DocsPageClient({ page, tree }: DocsPageClientProps) {
    const MDX = page.body;
    const components = useMDXComponents({});

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
                <h1>{page.title}</h1>
                {page.description && (
                    <p className="docs-description">{page.description}</p>
                )}
                <MDX components={components} />
            </main>

            {page.toc && page.toc.length > 0 && (
                <div className="docs-toc-wrapper" style={{ paddingTop: "70px" }}>
                    <TOC items={page.toc} />
                </div>
            )}
        </div>
    );
}
