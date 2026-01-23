// Server component wrapper that fetches tree and passes to client
import type { ReactNode } from "react";
import type { TableOfContents } from "fumadocs-core/server";
import { source } from "@/lib/source";
import { DocsLayoutClient } from "./DocsLayoutClient";

interface DocsLayoutWrapperProps {
    children: ReactNode;
    toc?: TableOfContents;
}

export function DocsLayoutWrapper({ children, toc }: DocsLayoutWrapperProps) {
    const tree = source.pageTree;

    return (
        <DocsLayoutClient toc={toc} tree={tree}>
            {children}
        </DocsLayoutClient>
    );
}
