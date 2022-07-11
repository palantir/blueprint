/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { AbstractPureComponent2, Classes } from "../../common";
import { DISPLAYNAME_PREFIX, IntentProps } from "../../common/props";
// eslint-disable-next-line import/no-cycle
import { Popover, PopoverInteractionKind } from "../popover/popover";
import { IPopoverSharedProps } from "../popover/popoverSharedProps";

/** @deprecated migrate to Tooltip2, use Tooltip2Props */
export type TooltipProps = ITooltipProps; // eslint-disable-line deprecation/deprecation
/** @deprecated migrate to Tooltip2, use Tooltip2Props */
export interface ITooltipProps extends IPopoverSharedProps, IntentProps {
    /**
     * The content that will be displayed inside of the tooltip.
     */
    content: JSX.Element | string;

    /**
     * The amount of time in milliseconds the tooltip should remain open after
     * the user hovers off the trigger. The timer is canceled if the user mouses
     * over the target before it expires.
     *
     * @default 0
     */
    hoverCloseDelay?: number;

    /**
     * The amount of time in milliseconds the tooltip should wait before opening
     * after the user hovers over the trigger. The timer is canceled if the user
     * mouses away from the target before it expires.
     *
     * @default 100
     */
    hoverOpenDelay?: number;

    /**
     * The kind of hover interaction that triggers the display of the tooltip.
     * Tooltips do not support click interactions.
     *
     * @default PopoverInteractionKind.HOVER_TARGET_ONLY
     */
    interactionKind?: typeof PopoverInteractionKind.HOVER | typeof PopoverInteractionKind.HOVER_TARGET_ONLY;

    /**
     * Indicates how long (in milliseconds) the tooltip's appear/disappear
     * transition takes. This is used by React `CSSTransition` to know when a
     * transition completes and must match the duration of the animation in CSS.
     * Only set this prop if you override Blueprint's default transitions with
     * new transitions of a different length.
     *
     * @default 100
     */
    transitionDuration?: number;
}

/** @deprecated use { Tooltip2 } from "@blueprintjs/popover2" */
// eslint-disable-next-line deprecation/deprecation
export class Tooltip extends AbstractPureComponent2<TooltipProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Tooltip`;

    // eslint-disable-next-line deprecation/deprecation
    public static defaultProps: Partial<TooltipProps> = {
        hoverCloseDelay: 0,
        hoverOpenDelay: 100,
        minimal: false,
        transitionDuration: 100,
    };

    // eslint-disable-next-line deprecation/deprecation
    private popover: Popover | null = null;

    public render() {
        const { children, intent, popoverClassName, ...restProps } = this.props;
        const classes = classNames(
            Classes.TOOLTIP,
            { [Classes.MINIMAL]: this.props.minimal },
            Classes.intentClass(intent),
            popoverClassName,
        );

        return (
            /* eslint-disable deprecation/deprecation */
            <Popover
                interactionKind={PopoverInteractionKind.HOVER_TARGET_ONLY}
                modifiers={{ arrow: { enabled: !this.props.minimal } }}
                {...restProps}
                autoFocus={false}
                canEscapeKeyClose={false}
                enforceFocus={false}
                lazy={true}
                popoverClassName={classes}
                portalContainer={this.props.portalContainer}
                ref={ref => (this.popover = ref)}
            >
                {children}
            </Popover>
        );
    }

    public reposition() {
        if (this.popover != null) {
            this.popover.reposition();
        }
    }
}
