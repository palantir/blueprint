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

import { Classes, DISPLAYNAME_PREFIX, Elevation, HTMLDivProps, Props } from "../../common";
import { Card } from "../card/card";

export interface CardListProps extends Props, HTMLDivProps, React.RefAttributes<HTMLDivElement> {
    /**
     * Set true if the list is in a container without padding.
     * Elevation and border radius will be removed.
     *
     * @default false
     */
    contained?: boolean;

    /**
     * Whether this component should use compact styles.
     *
     * @default false
     */
    compact?: boolean;
}

export const CardList: React.FC<CardListProps> = React.forwardRef((props, ref) => {
    const { className, contained, children, compact, ...htmlProps } = props;

    const classes = classNames(Classes.CARD_LIST, className, {
        [Classes.COMPACT]: compact,
        [Classes.CONTAINED]: contained,
    });

    return (
        <Card role="list" elevation={Elevation.ZERO} className={classes} {...htmlProps} ref={ref}>
            {children}
        </Card>
    );
});
CardList.defaultProps = {
    compact: false,
    contained: false,
};
CardList.displayName = `${DISPLAYNAME_PREFIX}.CardList`;
