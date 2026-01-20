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

import { isHeadingTag, type PageData } from "@documentalist/client";
import classNames from "classnames";

import { COMPONENT_DISPLAY_NAMESPACE } from "../common";

export interface TocHeading {
    level: number;
    route: string;
    value: string;
}

export interface TableOfContentsProps {
    /** The current page data containing headings */
    page: PageData;
    /** The currently active section ID (route) */
    activeSectionId: string;
}

/**
 * Extracts h2 and h3 headings from a PageData object.
 */
function extractHeadings(page: PageData): TocHeading[] {
    const headings: TocHeading[] = [];

    for (const node of page.contents) {
        if (typeof node !== "string" && isHeadingTag(node)) {
            // Only include h2 and h3 headings
            if (node.level === 2 || node.level === 3) {
                headings.push({
                    level: node.level,
                    route: node.route,
                    value: node.value,
                });
            }
        }
    }

    return headings;
}

/**
 * A table of contents sidebar component that displays the document structure
 * and highlights the current section based on scroll position.
 */
export const TableOfContents: React.FC<TableOfContentsProps> = ({ page, activeSectionId }) => {
    const headings = extractHeadings(page);

    // Don't render if there are no headings
    if (headings.length === 0) {
        return null;
    }

    return (
        <nav className="docs-toc" aria-label="Table of contents">
            <div className="docs-toc-header">On this page</div>
            <ul className="docs-toc-list">
                {headings.map(heading => {
                    const isActive = activeSectionId === heading.route;
                    const itemClass = classNames("docs-toc-item", `docs-toc-level-${heading.level}`, {
                        "docs-toc-item-active": isActive,
                    });

                    return (
                        <li key={heading.route} className={itemClass}>
                            <a href={`#${heading.route}`}>{heading.value}</a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};
TableOfContents.displayName = `${COMPONENT_DISPLAY_NAMESPACE}.TableOfContents`;
