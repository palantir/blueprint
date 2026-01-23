import type { MDXComponents } from "mdx/types";
import { Callout, Pre, Code } from "@blueprintjs/core";
import { CodeExample } from "@/components/fumadocs/CodeExample";
import { PropsTable } from "@/components/fumadocs/PropsTable";
import { LivePlayground } from "@/components/fumadocs/LivePlayground";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        // Custom components for MDX
        CodeExample,
        PropsTable,
        LivePlayground,
        Callout,

        // Override HTML elements with Blueprint styling
        pre: ({ children, ...props }) => (
            <Pre className="docs-code-block" {...props}>
                {children}
            </Pre>
        ),
        code: ({ children, ...props }) => {
            // Inline code vs code blocks
            const isInline = typeof children === "string" && !children.includes("\n");
            if (isInline) {
                return <Code {...props}>{children}</Code>;
            }
            return <code {...props}>{children}</code>;
        },
        h1: ({ children, ...props }) => (
            <h1 className="bp5-heading" {...props}>
                {children}
            </h1>
        ),
        h2: ({ children, id, ...props }) => (
            <h2 className="bp5-heading" id={id} {...props}>
                {children}
            </h2>
        ),
        h3: ({ children, id, ...props }) => (
            <h3 className="bp5-heading" id={id} {...props}>
                {children}
            </h3>
        ),
        p: ({ children, ...props }) => (
            <p className="bp5-running-text" {...props}>
                {children}
            </p>
        ),
        ul: ({ children, ...props }) => (
            <ul className="bp5-list" {...props}>
                {children}
            </ul>
        ),
        ol: ({ children, ...props }) => (
            <ol className="bp5-list" {...props}>
                {children}
            </ol>
        ),
        a: ({ children, href, ...props }) => (
            <a href={href} className="bp5-link" {...props}>
                {children}
            </a>
        ),
        blockquote: ({ children, ...props }) => (
            <Callout {...props}>{children}</Callout>
        ),
        table: ({ children, ...props }) => (
            <table className="bp5-html-table bp5-html-table-bordered bp5-html-table-striped" {...props}>
                {children}
            </table>
        ),

        // Pass through any additional components
        ...components,
    };
}
