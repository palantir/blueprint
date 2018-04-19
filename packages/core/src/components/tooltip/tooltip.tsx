/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { Position } from "../../common/position";
import { IIntentProps, IProps } from "../../common/props";
import { Popover, PopoverInteractionKind, PopperModifiers } from "../popover/popover";

export interface ITooltipProps extends IProps, IIntentProps {
    /**
     * The content that will be displayed inside of the tooltip.
     */
    content: JSX.Element | string;

    /**
     * Initial opened state when uncontrolled.
     * @default false
     */
    defaultIsOpen?: boolean;

    /**
     * Prevents the popover from appearing when `true`.
     * @default false
     */
    disabled?: boolean;

    /**
     * The amount of time in milliseconds the tooltip should remain open after the
     * user hovers off the trigger. The timer is canceled if the user mouses over the
     * target before it expires.
     * @default 0
     */
    hoverCloseDelay?: number;

    /**
     * The amount of time in milliseconds the tooltip should wait before opening after the
     * user hovers over the trigger. The timer is canceled if the user mouses away from the
     * target before it expires.
     * @default 100
     */
    hoverOpenDelay?: number;

    /**
     * Whether a tooltip that uses a `Portal` should automatically inherit the dark theme from its parent.
     * @default true
     */
    inheritDarkTheme?: boolean;

    /**
     * Whether the popover is visible. Passing this prop puts the popover in
     * controlled mode, where the only way to change visibility is by updating this property.
     * @default undefined
     */
    isOpen?: boolean;

    /**
     * Popper modifier options, passed directly to internal Popper instance.
     * See https://popper.js.org/popper-documentation.html#modifiers for complete details.
     */
    modifiers?: PopperModifiers;

    /**
     * Callback invoked in controlled mode when the tooltip open state *would* change due to
     * user interaction.
     */
    onInteraction?: (nextOpenState: boolean) => void;

    /**
     * Whether the tooltip should open when its target is focused.
     * If `true`, target will render with `tabindex="0"` to make it focusable via keyboard navigation.
     * @default true
     */
    openOnTargetFocus?: boolean;

    /**
     * Space-delimited string of class names applied to the
     * portal which holds the tooltip if `usePortal={true}`.
     */
    portalClassName?: string;

    /**
     * The position (relative to the target) at which the popover should appear.
     *
     * The default value of `"auto"` will choose the best position when opened
     * and will allow the popover to reposition itself to remain onscreen as the
     * user scrolls around.
     * @default "auto"
     */
    position?: Position | "auto";

    /**
     * The name of the HTML tag to use when rendering the popover target wrapper element (`Classes.POPOVER_WRAPPER`).
     * @default "span"
     */
    rootElementTag?: string;

    /**
     * The name of the HTML tag to use when rendering the popover target element.
     * @default "div"
     */
    targetElementTag?: string;

    /**
     * A space-delimited string of class names that are applied to the tooltip.
     */
    tooltipClassName?: string;

    /**
     * Indicates how long (in milliseconds) the tooltip's appear/disappear transition takes.
     * This is used by React `CSSTransition` to know when a transition completes
     * and must match the duration of the animation in CSS.
     * Only set this prop if you override Blueprint's default transitions with new transitions of a different length.
     * @default 100
     */
    transitionDuration?: number;

    /**
     * Whether the tooltip is rendered inside a `Portal` so it can escape the usual DOM flow.
     * If `false`, it is rendered as a sibling of the target element.
     * @default true
     */
    usePortal?: boolean;
}

export class Tooltip extends React.PureComponent<ITooltipProps, {}> {
    public static displayName = "Blueprint2.Tooltip";

    public static defaultProps: Partial<ITooltipProps> = {
        defaultIsOpen: false,
        disabled: false,
        hoverCloseDelay: 0,
        hoverOpenDelay: 100,
        openOnTargetFocus: true,
        transitionDuration: 100,
    };

    public render() {
        const { children, intent, tooltipClassName, ...restProps } = this.props;
        const classes = classNames(Classes.TOOLTIP, Classes.intentClass(intent), tooltipClassName);

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
