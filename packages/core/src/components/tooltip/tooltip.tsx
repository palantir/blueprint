/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IIntentProps } from "../../common/props";
import { Popover, PopoverInteractionKind } from "../popover/popover";
import { IPopoverSharedProps } from "../popover/popoverSharedProps";

export interface ITooltipProps extends IPopoverSharedProps, IIntentProps {
    /**
     * The content that will be displayed inside of the tooltip.
     */
    content: JSX.Element | string;

    /**
     * The amount of time in milliseconds the tooltip should remain open after
     * the user hovers off the trigger. The timer is canceled if the user mouses
     * over the target before it expires.
     * @default 0
     */
    hoverCloseDelay?: number;

    /**
     * The amount of time in milliseconds the tooltip should wait before opening
     * after the user hovers over the trigger. The timer is canceled if the user
     * mouses away from the target before it expires.
     * @default 100
     */
    hoverOpenDelay?: number;

    /**
     * Indicates how long (in milliseconds) the tooltip's appear/disappear
     * transition takes. This is used by React `CSSTransition` to know when a
     * transition completes and must match the duration of the animation in CSS.
     * Only set this prop if you override Blueprint's default transitions with
     * new transitions of a different length.
     * @default 100
     */
    transitionDuration?: number;
}

export class Tooltip extends React.PureComponent<ITooltipProps, {}> {
    public static displayName = "Blueprint2.Tooltip";

    public static defaultProps: Partial<ITooltipProps> = {
        hoverCloseDelay: 0,
        hoverOpenDelay: 100,
        transitionDuration: 100,
    };

    public render() {
        const { children, intent, popoverClassName, ...restProps } = this.props;
        const classes = classNames(Classes.TOOLTIP, Classes.intentClass(intent), popoverClassName);

        return (
            <Popover
                {...restProps}
                autoFocus={false}
                canEscapeKeyClose={false}
                enforceFocus={false}
                interactionKind={PopoverInteractionKind.HOVER_TARGET_ONLY}
                lazy={true}
                popoverClassName={classes}
            >
                {children}
            </Popover>
        );
    }
}
