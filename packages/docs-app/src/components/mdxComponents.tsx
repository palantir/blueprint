/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import { createElement } from "react";

import { Classes } from "@blueprintjs/core";
import { Link } from "@blueprintjs/icons";

function slugify(value: string): string {
    return value
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-{2,}/g, "-")
        .replace(/^-|-$/g, "");
}

function extractTextContent(children: React.ReactNode): string {
    if (typeof children === "string") {
        return children;
    }
    if (Array.isArray(children)) {
        return children.map(extractTextContent).join("");
    }
    if (children != null && typeof children === "object" && "props" in children) {
        return extractTextContent((children as React.ReactElement).props.children);
    }
    return "";
}

/**
 * Creates a heading component matching the DOM structure from docs-theme's heading.tsx.
 * Produces `.docs-title` elements with `data-route` anchors for scroll spy compatibility.
 */
function createHeadingComponent(level: 1 | 2 | 3) {
    return function MdxHeading({ children }: { children?: React.ReactNode }) {
        const text = extractTextContent(children);
        const route = slugify(text);
        return createElement(
            `h${level}`,
            { className: `${Classes.HEADING} docs-title` },
            <a className="docs-anchor" data-route={route} key="anchor" aria-hidden={true} tabIndex={-1} />,
            <a className="docs-anchor-link" href={`#${route}`} key="link" aria-hidden={true} tabIndex={-1}>
                <Link />
            </a>,
            children,
        );
    };
}

export const mdxComponents: Record<string, React.ComponentType<any>> = {
    h1: createHeadingComponent(1),
    h2: createHeadingComponent(2),
    h3: createHeadingComponent(3),
};
