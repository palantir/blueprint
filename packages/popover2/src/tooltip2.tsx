/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import { Classes as CoreClasses, DISPLAYNAME_PREFIX, IntentProps } from "@blueprintjs/core";

import * as Classes from "./classes";
// eslint-disable-next-line import/no-cycle
import { Popover2, Popover2InteractionKind } from "./popover2";
import { TOOLTIP_ARROW_SVG_SIZE } from "./popover2Arrow";
import { Popover2SharedProps } from "./popover2SharedProps";

export interface Tooltip2Props<TProps = React.HTMLProps<HTMLElement>> extends Popover2SharedProps<TProps>, IntentProps {
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
    interactionKind?: typeof Popover2InteractionKind.HOVER | typeof Popover2InteractionKind.HOVER_TARGET_ONLY;

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

export class Tooltip2<T> extends React.PureComponent<Tooltip2Props<T>> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Tooltip2`;

    public static defaultProps: Partial<Tooltip2Props> = {
        hoverCloseDelay: 0,
        hoverOpenDelay: 100,
        minimal: false,
        transitionDuration: 100,
    };

    private popover: Popover2<T> | null = null;

    public render() {
        const { children, intent, popoverClassName, ...restProps } = this.props;
        const classes = classNames(
            Classes.TOOLTIP2,
            { [CoreClasses.MINIMAL]: this.props.minimal },
            CoreClasses.intentClass(intent),
            popoverClassName,
        );

        return (
            <Popover2
                interactionKind={Popover2InteractionKind.HOVER_TARGET_ONLY}
                modifiers={{
                    arrow: {
                        enabled: !this.props.minimal,
                    },
                    offset: {
                        options: {
                            offset: [0, TOOLTIP_ARROW_SVG_SIZE / 2],
                        },
                    },
                }}
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
            </Popover2>
        );
    }

    public reposition() {
        if (this.popover != null) {
            this.popover.reposition();
        }
    }
}
