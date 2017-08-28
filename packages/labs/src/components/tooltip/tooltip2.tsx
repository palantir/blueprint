/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import { Modifiers as PopperModifiers, Placement } from "popper.js";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { Classes, IIntentProps, IProps, PopoverInteractionKind } from "@blueprintjs/core";

import { Popover2 } from "../popover/popover2";

export interface ITooltip2Props extends IProps, IIntentProps {
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
     * Whether a non-inline tooltip should automatically inherit the dark theme from its parent.
     * @default true
     */
    inheritDarkTheme?: boolean;

    /**
     * Whether the tooltip is rendered inline (as a sibling of the target element).
     * If false, it is attached to a new element appended to `<body>`.
     * @default false
     */
    inline?: boolean;

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
     * portal which holds the tooltip if `inline` is set to `false`.
     */
    portalClassName?: string;

    /**
     * The position (relative to the target) at which the popover should appear.
     * The default value of `"auto"` will choose the best placement when opened and will allow
     * the popover to reposition itself to remain onscreen as the user scrolls around.
     * @default "auto"
     */
    placement?: Placement;

    /**
     * The name of the HTML tag to use when rendering the popover target wrapper element (`.pt-popover-target`).
     * @default "span"
     */
    rootElementTag?: string;

    /**
     * A space-delimited string of class names that are applied to the tooltip.
     */
    tooltipClassName?: string;

    /**
     * Indicates how long (in milliseconds) the tooltip's appear/disappear transition takes.
     * This is used by React `CSSTransitionGroup` to know when a transition completes
     * and must match the duration of the animation in CSS.
     * Only set this prop if you override Blueprint's default transitions with new transitions of a different length.
     * @default 100
     */
    transitionDuration?: number;
}

@PureRender
export class Tooltip2 extends React.Component<ITooltip2Props, {}> {
    public static displayName = "Blueprint.Tooltip2";

    public static defaultProps: Partial<ITooltip2Props> = {
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
            <Popover2
                {...restProps}
                autoFocus={false}
                canEscapeKeyClose={false}
                enforceFocus={false}
                interactionKind={PopoverInteractionKind.HOVER_TARGET_ONLY}
                lazy={true}
                popoverClassName={classes}
            >
                {children}
            </Popover2>
        );
    }
}
