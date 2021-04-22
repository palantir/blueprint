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
import React, { useLayoutEffect, useRef, useState } from "react";

import { Classes } from "../../common";
import { DISPLAYNAME_PREFIX, Props } from "../../common/props";

export interface TextProps extends Props {
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

export const Text: React.FC<TextProps> = ({ children, tagName, title, className, ellipsize }) => {
    const textRef = useRef<HTMLElement>();
    const [textContent, setTextContent] = useState<string>("");
    const [isContentOverflowing, setIsContentOverflowing] = useState<boolean>();

    // try to be conservative about running this effect, since querying scrollWidth causes the browser to reflow / recalculate styles,
    // which can be very expensive for long lists (for example, in long Menus)
    useLayoutEffect(() => {
        if (textRef.current?.textContent != null) {
            setIsContentOverflowing(ellipsize! && textRef.current.scrollWidth > textRef.current.clientWidth);
            setTextContent(textRef.current.textContent);
        }
    }, [textRef, children, ellipsize]);

    return React.createElement(
        tagName!,
        {
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
};
Text.defaultProps = {
    ellipsize: false,
    tagName: "div",
};
Text.displayName = `${DISPLAYNAME_PREFIX}.Text`;
