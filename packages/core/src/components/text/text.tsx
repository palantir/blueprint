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
import { createElement, forwardRef, useCallback } from "react";

import { Classes } from "../../common";
import { DISPLAYNAME_PREFIX, type Props } from "../../common/props";

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
    ({ children, tagName = "div", title, className, ellipsize = false, onMouseEnter, ...htmlProps }, ref) => {
        // Measure overflow lazily on hover rather than in a layout effect on every render. Reading scrollWidth forces
        // a synchronous reflow, which is very expensive for long lists (e.g. Menus with many items). Measuring on
        // hover also means the title stays accurate when the container is resized after mount.
        const handleMouseEnter = useCallback(
            (event: React.MouseEvent<HTMLElement>) => {
                // when a title is provided, React owns the attribute and we must not touch it
                if (title == null) {
                    const element = event.currentTarget;
                    const isContentOverflowing = ellipsize && element.scrollWidth > element.clientWidth;
                    if (isContentOverflowing) {
                        element.title = element.textContent ?? "";
                    } else {
                        element.removeAttribute("title");
                    }
                }
                onMouseEnter?.(event);
            },
            [ellipsize, onMouseEnter, title],
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
                ref,
                title,
            },
            children,
        );
    },
);
Text.displayName = `${DISPLAYNAME_PREFIX}.Text`;
