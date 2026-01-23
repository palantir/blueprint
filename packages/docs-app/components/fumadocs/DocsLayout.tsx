"use client";

import type { ReactNode } from "react";
import type { TableOfContents } from "fumadocs-core/server";
import { Button } from "@blueprintjs/core";
import { Sidebar } from "./Sidebar";
import { TOC } from "./TOC";
import { useTheme } from "./ThemeProvider";

interface DocsLayoutProps {
    children: ReactNode;
    toc?: TableOfContents;
}

export function DocsLayout({ children, toc }: DocsLayoutProps) {
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="docs-root">
            <div className="docs-nav-wrapper">
                <div className="docs-sidebar-header">
                    <h2 className="bp5-heading" style={{ margin: 0, fontSize: "18px" }}>
                        Blueprint
                    </h2>
                </div>
                <Sidebar />
            </div>

            <div className="docs-header">
                <Button
                    icon={isDark ? "flash" : "moon"}
                    minimal
                    onClick={toggleTheme}
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                />
            </div>

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
