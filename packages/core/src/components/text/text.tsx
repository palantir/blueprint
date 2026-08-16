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
import { createElement, forwardRef, useMemo, useRef, useState } from "react";

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
     * The `title` attribute will also be added when content overflows to show the full text of the children on hover.
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
    ({ children, tagName = "div", title, className, ellipsize = false, ...htmlProps }, forwardedRef) => {
        const contentMeasuringRef = useRef<HTMLElement>();
        const textRef = useMemo(() => mergeRefs(contentMeasuringRef, forwardedRef), [forwardedRef]);
        // Auto title when ellipsized content overflows. `undefined` means no auto title.
        const [overflowTitle, setOverflowTitle] = useState<string | undefined>(undefined);
        const overflowTitleRef = useRef(overflowTitle);
        overflowTitleRef.current = overflowTitle;

        // try to be conservative about running this effect, since querying scrollWidth causes the browser to reflow / recalculate styles,
        // which can be very expensive for long lists (for example, in long Menus)
        useIsomorphicLayoutEffect(() => {
            const element = contentMeasuringRef.current;
            if (element == null) {
                return;
            }
            // Explicit title prop wins; drop any auto title so we don't fight the caller.
            if (title !== undefined) {
                if (overflowTitleRef.current !== undefined) {
                    overflowTitleRef.current = undefined;
                    setOverflowTitle(undefined);
                }
                return;
            }
            const isOverflowing = Boolean(ellipsize && element.scrollWidth > element.clientWidth);
            const next = isOverflowing ? element.textContent || undefined : undefined;
            // Only setState when the derived title actually changes. Always updating from this
            // layout effect can nest past React 19's update-depth limit when many Text nodes
            // measure in one commit, or when children identity changes re-run the effect.
            if (next !== overflowTitleRef.current) {
                overflowTitleRef.current = next;
                setOverflowTitle(next);
            }
        }, [children, ellipsize, title]);

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
                ref: textRef,
                title: title ?? overflowTitle,
            },
            children,
        );
    },
);
Text.displayName = `${DISPLAYNAME_PREFIX}.Text`;
