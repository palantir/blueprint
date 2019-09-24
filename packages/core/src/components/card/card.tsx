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
import { polyfill } from "react-lifecycles-compat";
import { AbstractPureComponent2, Classes, Elevation } from "../../common";
import { DISPLAYNAME_PREFIX, HTMLDivProps, IProps } from "../../common/props";

export interface ICardProps extends IProps, HTMLDivProps {
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

@polyfill
export class Card extends AbstractPureComponent2<ICardProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Card`;
    public static defaultProps: ICardProps = {
        elevation: Elevation.ZERO,
        interactive: false,
    };

    public render() {
        const { className, elevation, interactive, ...htmlProps } = this.props;
        const classes = classNames(
            Classes.CARD,
            { [Classes.INTERACTIVE]: interactive },
            Classes.elevationClass(elevation),
            className,
        );
        return <div className={classes} {...htmlProps} />;
    }
}
