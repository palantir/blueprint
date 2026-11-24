/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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
import { createElement, forwardRef, useCallback, useMemo, useRef } from "react";

import { Classes, mergeRefs } from "../../common";
import { DISPLAYNAME_PREFIX, type Props } from "../../common/props";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";

export interface TextProps
    extends Props,
        React.RefAttributes<HTMLElement>,
        Omit<React.HTMLAttributes<HTMLElement>, "title"> {
    children?: React.ReactNode;

    /**
     * Indicates that this component should be truncated with an ellipsis if it overflows its container.
     * When the content overflows, the `title` attribute is set on hover to show the full text of the children.
     *
     * @default false
     */
    ellipsize?: boolean;

    /**
     * HTML tag name to use for rendered element.
     *
     * @default "div"
     */
    tagName?: keyof React.JSX.IntrinsicElements;

    /**
     * HTML title of the element
     */
    title?: string;
}

/**
 * Text component.
 *
 * @see https://blueprintjs.com/docs/#core/components/text
 */
export const Text: React.FC<TextProps> = forwardRef<HTMLElement, TextProps>(
    (
        { children, tagName = "div", title, className, ellipsize = false, onMouseEnter, onMouseLeave, ...htmlProps },
        forwardedRef,
    ) => {
        const elementRef = useRef<HTMLElement | null>(null);
        const ref = useMemo(() => mergeRefs(elementRef, forwardedRef), [forwardedRef]);
        const isHoveredRef = useRef(false);

        // Measure overflow lazily on hover rather than in a layout effect on every render. Reading scrollWidth forces
        // a synchronous reflow, which is very expensive for long lists (e.g. Menus with many items). Measuring on
        // hover also means the title stays accurate when the container is resized after mount.
        const updateTitle = useCallback(() => {
            const element = elementRef.current;
            // when a title is provided, React owns the attribute and we must not touch it
            if (element == null || title != null) {
                return;
            }
            const isContentOverflowing = ellipsize && element.scrollWidth > element.clientWidth;
            if (isContentOverflowing) {
                element.title = element.textContent ?? "";
            } else {
                element.removeAttribute("title");
            }
        }, [ellipsize, title]);

        // Keep the title current if the content changes while the user is hovering, without making every
        // non-hovered instance read layout.
        useIsomorphicLayoutEffect(() => {
            if (isHoveredRef.current) {
                updateTitle();
            }
        }, [children, updateTitle]);

        const handleMouseEnter = useCallback(
            (event: React.MouseEvent<HTMLElement>) => {
                isHoveredRef.current = true;
                updateTitle();
                onMouseEnter?.(event);
            },
            [onMouseEnter, updateTitle],
        );

        const handleMouseLeave = useCallback(
            (event: React.MouseEvent<HTMLElement>) => {
                isHoveredRef.current = false;
                onMouseLeave?.(event);
            },
            [onMouseLeave],
        );

        return createElement(
            tagName,
            {
                ...htmlProps,
                className: classNames(
                    {
                        [Classes.TEXT_OVERFLOW_ELLIPSIS]: ellipsize,
                    },
                    className,
                ),
                onMouseEnter: handleMouseEnter,
                onMouseLeave: handleMouseLeave,
                ref,
                title,
            },
            children,
        );
    },
);
Text.displayName = `${DISPLAYNAME_PREFIX}.Text`;
