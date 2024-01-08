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
import * as React from "react";

import { Classes, DISPLAYNAME_PREFIX, Elevation, type HTMLDivProps, type Props } from "../../common";
import { Card } from "../card/card";

export interface CardListProps extends Props, HTMLDivProps, React.RefAttributes<HTMLDivElement> {
    /**
     * Whether this container element should have a visual border.
     *
     * Set this to `false` to remove elevation and border radius styles, which allows this element to be a child of
     * another bordered container element without padding (like SectionCard). Note that this also sets a 1px margin
     * _in dark theme_ to account for inset box shadows in that theme used across the design system. Be sure to test
     * your UI in both light and dark theme if you modify this prop value.
     *
     * @default true
     */
    bordered?: boolean;

    /**
     * Whether this component should use compact styles with reduced visual padding.
     *
     * Note that this prop affects styling for all Cards within this CardList and you do not need to set the
     * `compact` prop individually on those child Cards.
     *
     * @default false
     */
    compact?: boolean;
}

export const CardList: React.FC<CardListProps> = React.forwardRef((props, ref) => {
    const { bordered, className, children, compact, ...htmlProps } = props;

    const classes = classNames(className, Classes.CARD_LIST, {
        [Classes.CARD_LIST_BORDERED]: bordered,
        [Classes.COMPACT]: compact,
    });

    return (
        <Card role="list" elevation={Elevation.ZERO} className={classes} {...htmlProps} ref={ref}>
            {children}
        </Card>
    );
});
CardList.defaultProps = {
    bordered: true,
    compact: false,
};
CardList.displayName = `${DISPLAYNAME_PREFIX}.CardList`;
