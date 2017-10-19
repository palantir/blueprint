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

@PureRender
export class Card extends React.Component<ICardProps, {}> {
    public static displayName = "Blueprint.Card";

    public static readonly ELEVATION_ZERO = 0 as 0;
    public static readonly ELEVATION_ONE = 1 as 1;
    public static readonly ELEVATION_TWO = 2 as 2;
    public static readonly ELEVATION_THREE = 3 as 3;
    public static readonly ELEVATION_FOUR = 4 as 4;

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

    private getClassName = () => {
        const { elevation, interactive } = this.props;
        return classNames(
            Classes.CARD,
            {
                [Classes.INTERACTIVE]: interactive,
                [Classes.ELEVATION_0]: elevation === Card.ELEVATION_ZERO,
                [Classes.ELEVATION_1]: elevation === Card.ELEVATION_ONE,
                [Classes.ELEVATION_2]: elevation === Card.ELEVATION_TWO,
                [Classes.ELEVATION_3]: elevation === Card.ELEVATION_THREE,
                [Classes.ELEVATION_4]: elevation === Card.ELEVATION_FOUR,
            },
            this.props.className,
        );
    };
}
