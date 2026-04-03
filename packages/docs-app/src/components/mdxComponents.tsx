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

import { createElement, useContext } from "react";

import { AnchorButton, Classes, Intent, Pre } from "@blueprintjs/core";
import { Classes as DocsClasses, MdxPageRouteContext, TypescriptExample } from "@blueprintjs/docs-theme";
import { Code, Link } from "@blueprintjs/icons";

import { reactExamples } from "../tags/reactExamples";

/**
 * Slugify a heading value to match the route generation in navHelpers.mts.
 */
function slugify(value: string): string {
    return value
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-{2,}/g, "-")
        .replace(/^-|-$/g, "");
}

/**
 * Extract plain text from React children (handles strings and nested elements).
 */
function childrenToString(children: React.ReactNode): string {
    if (typeof children === "string") {
        return children;
    }
    if (Array.isArray(children)) {
        return children.map(childrenToString).join("");
    }
    if (children != null && typeof children === "object" && "props" in children) {
        return childrenToString((children as React.ReactElement).props.children);
    }
    return "";
}

function MdxHeading({ level, children }: { level: number; children?: React.ReactNode }) {
    const pageRoute = useContext(MdxPageRouteContext);
    const text = childrenToString(children);
    const route = level === 1 ? pageRoute : `${pageRoute}.${slugify(text)}`;

    return createElement(
        `h${level}`,
        { className: `${Classes.HEADING} docs-title` },
        <a className="docs-anchor" data-route={route} key="anchor" aria-hidden={true} tabIndex={-1} />,
        <a className="docs-anchor-link" href={`#${route}`} key="link" aria-hidden={true} tabIndex={-1}>
            <Link />
        </a>,
        children,
    );
}

function MdxPre({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
    // MDX wraps code blocks in <pre><code className="language-xx">...</code></pre>
    // Extract the language from the code child's className
    let lang: string | undefined;
    if (children != null && typeof children === "object" && "props" in children) {
        const codeProps = (children as React.ReactElement).props as { className?: string; children?: React.ReactNode };
        const match = codeProps.className?.match(/language-(\w+)/);
        if (match) {
            lang = match[1];
        }
    }

    return (
        <Pre className={`${Classes.CODE_BLOCK} ${DocsClasses.DOCS_CODE_BLOCK}`} data-lang={lang} {...props}>
            {children}
        </Pre>
    );
}

function ReactExample({ name }: { name: string }) {
    const example = reactExamples[name];
    if (example == null) {
        throw new Error(`Unknown @reactExample component: ${name}`);
    }

    return (
        <>
            {example.render({ id: name })}
            <AnchorButton
                className="docs-example-view-source"
                fill={true}
                href={example.sourceUrl}
                icon={<Code />}
                intent={Intent.PRIMARY}
                target="_blank"
                text="View source on GitHub"
                variant="minimal"
            />
        </>
    );
}

function MdxInterfaceTable({ name }: { name: string }) {
    return <TypescriptExample tag="interface" value={name} />;
}

export function getMdxComponents(): Record<string, React.ComponentType<any>> {
    return {
        InterfaceTable: MdxInterfaceTable,
        ReactExample,
        h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <MdxHeading level={1} {...props} />,
        h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <MdxHeading level={2} {...props} />,
        h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <MdxHeading level={3} {...props} />,
        pre: MdxPre,
    };
}
