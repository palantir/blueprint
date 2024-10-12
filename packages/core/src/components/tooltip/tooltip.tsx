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
import * as React from "react";

import { AbstractPureComponent, DISPLAYNAME_PREFIX, type IntentProps, Utils } from "../../common";
import * as Classes from "../../common/classes";
import * as Errors from "../../common/errors";
// eslint-disable-next-line import/no-cycle
import { isContentEmpty, Popover, type PopoverInteractionKind } from "../popover/popover";
import { TOOLTIP_ARROW_SVG_SIZE } from "../popover/popoverArrow";
import type {
    DefaultPopoverTargetHTMLProps,
    PopoverRenderTargetProps,
    PopoverSharedProps,
} from "../popover/popoverSharedProps";
import { TooltipContext, type TooltipContextState, TooltipProvider } from "../popover/tooltipContext";

export interface TooltipProps<TProps extends DefaultPopoverTargetHTMLProps = DefaultPopoverTargetHTMLProps>
    extends Omit<PopoverSharedProps<TProps>, "shouldReturnFocusOnClose" | "renderTarget">,
        IntentProps {
    /**
     * The content that will be displayed inside of the tooltip.
     */
    content: React.JSX.Element | string;

    /**
     * Whether to use a compact appearance, which reduces the visual padding around
     * tooltip content.
     *
     * @default false
     */
    compact?: boolean;

    /**
     * Target renderer which receives props injected by Popover which should be spread onto
     * the rendered element. This function should return a single React node.
     *
     * Mutually exclusive with `children` and `targetTagName` props.
     */
    renderTarget?: (props: PopoverRenderTargetProps<TProps> & { tooltipId: string }) => React.JSX.Element;

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

/**
 * Tooltip component.
 *
 * @see https://blueprintjs.com/docs/#core/components/tooltip
 */
export class Tooltip<
    T extends DefaultPopoverTargetHTMLProps = DefaultPopoverTargetHTMLProps,
> extends AbstractPureComponent<TooltipProps<T>> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Tooltip`;

    public static defaultProps: Partial<TooltipProps> = {
        compact: false,
        hoverCloseDelay: 0,
        hoverOpenDelay: 100,
        interactionKind: "hover-target",
        minimal: false,
        transitionDuration: 100,
    };

    private popoverRef = React.createRef<Popover<T>>();

    public render() {
        // if we have an ancestor TooltipContext, we should take its state into account in this render path,
        // it was likely created by a parent ContextMenu
        return (
            <TooltipContext.Consumer>
                {([state]) => <TooltipProvider {...state}>{this.renderPopover}</TooltipProvider>}
            </TooltipContext.Consumer>
        );
    }

    public reposition() {
        this.popoverRef.current?.reposition();
    }

    protected validateProps(props: TooltipProps<T>) {
        const childrenCount = React.Children.count(props.children);
        if (childrenCount > 1) {
            console.warn(Errors.POPOVER_WARN_TOO_MANY_CHILDREN);
        }
        // all other warnings should occur in Popover, not here.
    }

    // any descendant ContextMenus may update this ctxState
    private renderPopover = (ctxState: TooltipContextState) => {
        const { children, content, renderTarget, compact, disabled, intent, popoverClassName, ...restProps } =
            this.props;

        const popoverClasses = classNames(Classes.TOOLTIP, Classes.intentClass(intent), popoverClassName, {
            [Classes.COMPACT]: compact,
        });

        const contentElement = Utils.ensureElement(content);
        const tooltipId = contentElement?.props?.id ?? React.useMemo(() => Utils.uniqueId("tooltip"), []);
        const tooltipRole = contentElement?.props?.role ?? "tooltip";
        const clonedContent =
            contentElement &&
            React.cloneElement(contentElement, {
                role: tooltipRole,
                id: tooltipId,
            });

        const childTarget = Utils.ensureElement(React.Children.toArray(children)[0]);
        const clonedTarget =
            childTarget &&
            React.cloneElement(childTarget, {
                // aria-describedby can have multiple values, space separated. Use Set to ensure unique.
                "aria-describedby": Array.from(new Set([childTarget.props["aria-describedby"], tooltipId]))
                    .filter(Boolean)
                    .join(" "),
            });

        return (
            <Popover
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
                renderTarget={
                    renderTarget &&
                    React.useCallback(props => renderTarget({ ...props, tooltipId }), [renderTarget, tooltipId])
                }
                content={
                    // want Popover to warn if empty, so don't provide the element if so.
                    isContentEmpty(content) ? content : clonedContent
                }
                autoFocus={false}
                canEscapeKeyClose={false}
                disabled={ctxState.forceDisabled ?? disabled}
                enforceFocus={false}
                lazy={true}
                popoverClassName={popoverClasses}
                portalContainer={this.props.portalContainer}
                ref={this.popoverRef}
            >
                {clonedTarget}
            </Popover>
        );
    };
}
