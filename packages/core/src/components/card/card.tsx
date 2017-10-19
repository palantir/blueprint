/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";
import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";
import { safeInvoke } from "../../common/utils";

export type Elevation = 0 | 1 | 2 | 3 | 4;

export interface ICardProps extends IProps {
    /**
     * Controls the intensity of the drop shadow beneath the card: the higher
     * the elevation, the higher the drop shadow. At elevation `0`, no drop
     * shadow is applied.
     * 
     * @default 0
     */
    elevation?: Elevation;

    /**
     * Whether the card should respond to user interactions. If set to `true`,
     * hovering over the card will increase the card's elevation by two levels
     * and change the mouse cursor to a pointer.
     *
     * Recommended when `onClick` is also defined.
     * 
     * @default false
     */
    interactive?: boolean;

    /**
     * Callback invoked when the card is clicked.
     * Recommended when `interactive` is `true`.
     */
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/* tslint:disable:object-literal-sort-keys */
export const Elevation = {
    ZERO: 0,
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
};
/* tslint:enable:object-literal-sort-keys */

const ELEVATION_CLASSES = [
    Classes.ELEVATION_0,
    Classes.ELEVATION_1,
    Classes.ELEVATION_2,
    Classes.ELEVATION_3,
    Classes.ELEVATION_4,
];

@PureRender
export class Card extends React.Component<ICardProps, {}> {
    public static displayName = "Blueprint.Card";

    public render() {
        return (
            <div className={this.getClassName()} onClick={this.handleClick}>
                {this.props.children}
            </div>
        );
    }

    private handleClick = (e: React.MouseEvent<HTMLElement>) => {
        safeInvoke(this.props.onClick, e);
    };

    private getClassName() {
        const { elevation, interactive } = this.props;
        return classNames(
            Classes.CARD,
            { [Classes.INTERACTIVE]: interactive },
            ELEVATION_CLASSES[elevation],
            this.props.className,
        );
    }
}
