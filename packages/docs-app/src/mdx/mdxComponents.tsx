/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import classNames from "classnames";
import { createContext, createElement, useContext } from "react";

import { Classes, Code } from "@blueprintjs/core";
import { propsRegistry } from "@blueprintjs/docs-data";
import { PropsTable } from "@blueprintjs/docs-theme";
import { Link } from "@blueprintjs/icons";

import * as ReactDocsComponents from "../tags/reactDocs";
// ---------------------------------------------------------------------------
// Page route context — used by MdxHeading to construct data-route attributes
// ---------------------------------------------------------------------------

export const PageRouteContext = createContext<string>("");

// ---------------------------------------------------------------------------
// Bridge components
// ---------------------------------------------------------------------------

/**
 * Bridge component: looks up propsRegistry by name and renders a PropsTable.
 */
function InterfaceTable({ name }: { name: string }) {
    const info = propsRegistry[name];
    if (info == null) {
        return (
            <div className="bp5-callout bp5-intent-warning">
                <Code>{name}</Code> not found in propsRegistry.
            </div>
        );
    }
    return <PropsTable name={info.name} description={info.description} filePath={info.filePath} props={info.props} />;
}

/**
 * Bridge component: renders a @reactDocs component by name.
 */
function ReactDocs({ name }: { name: string }) {
    const Component = (ReactDocsComponents as any)[name] as React.ComponentType | undefined;
    if (Component == null) {
        return (
            <div className="bp5-callout bp5-intent-warning">
                Unknown reactDocs component: <Code>{name}</Code>
            </div>
        );
    }
    return <Component />;
}

// placeholder
const CssExample: React.FC<{ reference: string }> = () => null;

/** Placeholder for MethodTable. */
const MethodTable: React.FC<{ name: string }> = () => null;

// ---------------------------------------------------------------------------
// Heading overrides — replicate docs-theme Heading tag renderer DOM structure
// ---------------------------------------------------------------------------

/**
 * Slugify a heading string to match documentalist's slugification:
 * lowercase, replace non-[a-z0-9-] chars with hyphens.
 */
function slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

/**
 * Extract plain text from React children (handles strings and nested elements).
 */
function childrenToText(children: React.ReactNode): string {
    if (typeof children === "string") {
        return children;
    }
    if (Array.isArray(children)) {
        return children.map(childrenToText).join("");
    }
    if (children != null && typeof children === "object" && "props" in children) {
        return childrenToText((children as React.ReactElement).props.children);
    }
    return "";
}

function MdxHeading({ level, children }: { level: number; children?: React.ReactNode }) {
    const pageRoute = useContext(PageRouteContext);
    const text = childrenToText(children);
    const slug = slugify(text);
    const route = level === 1 ? pageRoute : `${pageRoute}.${slug}`;

    return createElement(
        `h${level}`,
        { className: classNames(Classes.HEADING, "docs-title") },
        <a className="docs-anchor" data-route={route} key="anchor" aria-hidden={true} tabIndex={-1} />,
        <a className="docs-anchor-link" href={`#${route}`} key="link" aria-hidden={true} tabIndex={-1}>
            <Link />
        </a>,
        children,
    );
}

// ---------------------------------------------------------------------------
// Component map for MDXProvider
// ---------------------------------------------------------------------------

/** Component map for MDXProvider. */
export const mdxComponents = {
    // Custom component tags (sorted alphabetically)
    CssExample,
    InterfaceTable,
    MethodTable,
    ReactDocs,
    // Heading overrides for scroll/nav integration
    h1: ({ children }: { children?: React.ReactNode }) => <MdxHeading level={1}>{children}</MdxHeading>,
    h2: ({ children }: { children?: React.ReactNode }) => <MdxHeading level={2}>{children}</MdxHeading>,
    h3: ({ children }: { children?: React.ReactNode }) => <MdxHeading level={3}>{children}</MdxHeading>,
    h4: ({ children }: { children?: React.ReactNode }) => <MdxHeading level={4}>{children}</MdxHeading>,
    h5: ({ children }: { children?: React.ReactNode }) => <MdxHeading level={5}>{children}</MdxHeading>,
    h6: ({ children }: { children?: React.ReactNode }) => <MdxHeading level={6}>{children}</MdxHeading>,
};
