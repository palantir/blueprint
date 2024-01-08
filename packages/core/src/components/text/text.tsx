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
import * as React from "react";

import { Classes, mergeRefs } from "../../common";
import { DISPLAYNAME_PREFIX, type Props } from "../../common/props";

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
    tagName?: keyof JSX.IntrinsicElements;

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
export const Text: React.FC<TextProps> = React.forwardRef<HTMLElement, TextProps>(
    ({ children, tagName = "div", title, className, ellipsize, ...htmlProps }, forwardedRef) => {
        const contentMeasuringRef = React.useRef<HTMLElement>();
        const textRef = React.useMemo(() => mergeRefs(contentMeasuringRef, forwardedRef), [forwardedRef]);
        const [textContent, setTextContent] = React.useState<string>("");
        const [isContentOverflowing, setIsContentOverflowing] = React.useState<boolean>();

        // try to be conservative about running this effect, since querying scrollWidth causes the browser to reflow / recalculate styles,
        // which can be very expensive for long lists (for example, in long Menus)
        React.useLayoutEffect(() => {
            if (contentMeasuringRef.current?.textContent != null) {
                setIsContentOverflowing(
                    ellipsize! && contentMeasuringRef.current.scrollWidth > contentMeasuringRef.current.clientWidth,
                );
                setTextContent(contentMeasuringRef.current.textContent);
            }
        }, [contentMeasuringRef, children, ellipsize]);

        return React.createElement(
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
                title: title ?? (isContentOverflowing ? textContent : undefined),
            },
            children,
        );
    },
);
Text.defaultProps = {
    ellipsize: false,
};
Text.displayName = `${DISPLAYNAME_PREFIX}.Text`;
