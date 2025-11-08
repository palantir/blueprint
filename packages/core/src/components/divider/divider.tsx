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
import { createElement } from "react";

import { Classes } from "../../common";
import { DISPLAYNAME_PREFIX, type Props } from "../../common/props";

export interface DividerProps extends Props, React.HTMLAttributes<HTMLElement> {
    /**
     * Optional text content to display centered within the divider.
     * When provided, the divider will render with the text in the center
     * and lines on both sides.
     */
    children?: React.ReactNode;

    /**
     * If true, makes the Divider flush with adjacent content.
     *
     * @default false
     */
    compact?: boolean;

    /**
     * HTML tag to use for element.
     *
     * @default "div"
     */
    tagName?: keyof React.JSX.IntrinsicElements;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */

/**
 * Divider component.
 *
 * @see https://blueprintjs.com/docs/#core/components/divider
 */
export const Divider: React.FC<DividerProps> = ({
    children,
    className,
    compact = false,
    tagName = "div",
    ...htmlProps
}) => {
    const classes = classNames(Classes.DIVIDER, { [Classes.COMPACT]: compact }, className);

    if (children != null) {
        // Render divider with text content
        return createElement(
            tagName,
            {
                ...htmlProps,
                className: classes,
            },
            createElement("span", { className: Classes.DIVIDER_CONTENT }, children),
        );
    }

    // Render simple divider without text
    return createElement(tagName, {
        ...htmlProps,
        className: classes,
    });
};

Divider.displayName = `${DISPLAYNAME_PREFIX}.Divider`;
