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
     */
    contained?: boolean;
}

export const CardList: React.FC<CardListProps> = React.forwardRef((props, ref) => {
    const { className, contained, children, ...htmlProps } = props;

    const renderableChildren = React.Children.toArray(children); // .filter(isRenderable);
    const classes = classNames(Classes.CARD_LIST, { [Classes.CONTAINED]: contained }, className);

    return renderableChildren.length > 0 ? (
        <Card role="list" elevation={Elevation.ZERO} className={classes} {...htmlProps} ref={ref}>
            {renderableChildren.map((child, index) => (
                <div role="list-item" className={Classes.CARD_LIST_ITEM} key={index}>
                    {child}
                </div>
            ))}
        </Card>
    ) : null;
});

CardList.defaultProps = {
    contained: false,
};
CardList.displayName = `${DISPLAYNAME_PREFIX}.CardList`;

// const isRenderable = <T>(o: T | undefined | null | boolean) => isNonNullable(o) && isNotBoolean(o);
