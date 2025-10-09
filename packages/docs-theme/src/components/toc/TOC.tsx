/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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
import { forwardRef, type PropsWithChildren, useCallback, useMemo } from "react";

import { Classes } from "@blueprintjs/core";

import { type HeadingData, useHeadingRegistry } from "./headingRegistry";
import { useTOCActiveItem } from "./useTOCActiveItem";

export const TOCContainer = forwardRef<
    HTMLDivElement,
    PropsWithChildren<{
        className?: string;
        title?: React.ReactNode;
        isDarkThemeEnabled?: boolean;
    }>
>(({ title = "On this page", children, isDarkThemeEnabled, className }, ref) => {
    return (
        <aside
            ref={ref}
            className={classNames("docs-toc-container", { [Classes.DARK]: isDarkThemeEnabled, className })}
            aria-label="Table of contents"
            role="navigation"
        >
            <div className="docs-toc">
                {title && (
                    <div className="docs-toc-header" aria-hidden="true">
                        {title}
                    </div>
                )}
                {children}
            </div>
        </aside>
    );
});

TOCContainer.displayName = "TOCContainer";

export const TOCContent = forwardRef<HTMLDivElement, PropsWithChildren>(({ children }, ref) => {
    return (
        <div ref={ref} className={"docs-toc-scroll-area"}>
            {children}
        </div>
    );
});

TOCContent.displayName = "TOCContent";

// TOC Items Component

export const TOCItems = () => {
    const { headings } = useHeadingRegistry();

    const sortedHeadings = useMemo(() => {
        return [...headings].sort((a, b) => {
            const position = a.element.compareDocumentPosition(b.element);
            // eslint-disable-next-line no-bitwise
            if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
                return -1;
            }
            // eslint-disable-next-line no-bitwise
            if (position & Node.DOCUMENT_POSITION_PRECEDING) {
                return 1;
            }
            return 0;
        });
    }, [headings]);

    const routes = useMemo(() => sortedHeadings.map(h => h.route), [sortedHeadings]);
    const { activeAnchor, handleTocItemClick } = useTOCActiveItem(routes);

    if (sortedHeadings.length === 0) {
        return (
            <div className={classNames("docs-toc-empty", Classes.TEXT_MUTED)} role="status">
                No headings
            </div>
        );
    }

    return (
        <nav className="docs-toc-items" aria-label="Page sections">
            {sortedHeadings.map((heading, index) => (
                <TOCItem
                    key={heading.route}
                    heading={heading}
                    isActive={activeAnchor == null ? index === 0 : activeAnchor === heading.route}
                    onItemClick={handleTocItemClick}
                />
            ))}
        </nav>
    );
};

TOCItems.displayName = "TOCItems";

const TOCItem: React.FC<{
    heading: HeadingData;
    isActive: boolean;
    onItemClick: (route: string) => void;
}> = ({ heading, isActive, onItemClick }) => {
    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            onItemClick(heading.route);
        },
        [heading.route, onItemClick],
    );

    return (
        <a
            href={heading.url}
            className={classNames("docs-toc-item", {
                "docs-toc-active": isActive,
                "docs-toc-level-1": heading.depth <= 1,
                "docs-toc-level-2": heading.depth === 2,
                "docs-toc-level-3": heading.depth === 3,
                "docs-toc-level-4": heading.depth >= 4,
            })}
            aria-current={isActive ? "location" : undefined}
            aria-level={heading.depth}
            data-active={isActive}
            data-route={heading.route}
            onClick={handleClick}
        >
            {heading.title}
        </a>
    );
};
