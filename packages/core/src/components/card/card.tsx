/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as React from "react";
import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";

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
     * hovering over the card will increase the card's elevation
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

export enum Elevation {
    ZERO = 0,
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
}

const ELEVATION_CLASSES = [
    Classes.ELEVATION_0,
    Classes.ELEVATION_1,
    Classes.ELEVATION_2,
    Classes.ELEVATION_3,
    Classes.ELEVATION_4,
];

export class Card extends React.PureComponent<ICardProps, {}> {
    public static displayName = "Blueprint2.Card";
    public static defaultProps: ICardProps = {
        elevation: Elevation.ZERO,
        interactive: false,
    };

    public render() {
        return (
            <div className={this.getClassName()} onClick={this.props.onClick}>
                {this.props.children}
            </div>
        );
    }

    private getClassName() {
        const { elevation, interactive, className } = this.props;
        return classNames(
            Classes.CARD,
            { [Classes.INTERACTIVE]: interactive },
            ELEVATION_CLASSES[elevation],
            className,
        );
    }
}
