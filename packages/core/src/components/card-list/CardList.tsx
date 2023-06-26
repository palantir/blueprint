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
import React from "react";

import { AbstractPureComponent2, Classes, DISPLAYNAME_PREFIX, Elevation, HTMLDivProps, Props } from "../../common";

// eslint-disable-next-line deprecation/deprecation
export type CardListProps = ICardListProps;
/** @deprecated use CardProps */
export interface ICardListProps extends Props, HTMLDivProps {
    // Set true if the list is in a container without padding
    contained?: boolean;
}

export class CardList extends AbstractPureComponent2<CardListProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.CardList`;

    public render() {
        const { className, contained, children, ...htmlProps } = this.props;
        const renderableChildren = React.Children.toArray(children); // .filter(isRenderable);
        const classes = classNames(
            Classes.CARD_LIST,
            { [Classes.CONTAINED]: contained },
            { [Classes.ELEVATION_0]: !contained },
            className,
        );

        return renderableChildren.length > 0 ? (
            <div className={classes} {...htmlProps}>
                {renderableChildren.map((child, index) => (
                    <div key={index}>{child}</div>
                ))}
            </div>
        ) : null;
    }
}

// const isRenderable = <T>(o: T | undefined | null | boolean) => isNonNullable(o) && isNotBoolean(o);
