/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { Tooltip } from "@base-ui-components/react/tooltip";
import classNames from "classnames";
import { createElement, forwardRef, useCallback } from "react";

import type { IntentProps } from "../../common";
import * as Classes from "../../common/classes";
import type { PopoverInteractionKind } from "../popover/popoverProps";
import type { DefaultPopoverTargetHTMLProps, PopoverSharedProps } from "../popover/popoverSharedProps";

export interface TooltipHeadlessBaseUIProps<
    TProps extends DefaultPopoverTargetHTMLProps = DefaultPopoverTargetHTMLProps,
> extends Omit<PopoverSharedProps<TProps>, "shouldReturnFocusOnClose">,
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
 * TooltipHeadlessBaseUI component - a headless tooltip implementation using Base UI.
 *
 * @see https://blueprintjs.com/docs/#core/components/tooltip
 */
export const TooltipHeadlessBaseUI = forwardRef<HTMLDivElement, TooltipHeadlessBaseUIProps>(
    function TooltipHeadlessBaseUI(
        {
            children,
            className,
            compact = false,
            content,
            defaultIsOpen = false,
            disabled = false,
            hoverCloseDelay = 0,
            hoverOpenDelay = 100,
            intent,
            interactionKind = "hover-target",
            isOpen,
            minimal = false,
            onInteraction,
            placement = "auto",
            popoverClassName,
            targetTagName = "span",
            transitionDuration = 100,
            usePortal = true,
            ...props
        },
        ref,
    ) {
        // Convert Blueprint placement/position to Base UI side and alignment
        const placementParts = placement !== "auto" ? placement.split("-") : ["top"];
        const side = placementParts[0] as "top" | "bottom" | "left" | "right";
        const align = placementParts[1] as "start" | "end" | undefined;
        const basePlacement = side; // Use this for CSS classes

        // Generate class names for the tooltip (matches Blueprint's DOM structure)
        const tooltipClasses = classNames(
            Classes.TOOLTIP,
            Classes.POPOVER,
            Classes.intentClass(intent),
            {
                [Classes.COMPACT]: compact,
                [Classes.MINIMAL]: minimal,
            },
            `${Classes.POPOVER_CONTENT_PLACEMENT}-${basePlacement}`,
            popoverClassName,
        );

        const renderPopup = () => {
            return (
                <Tooltip.Popup className={tooltipClasses} ref={ref}>
                    {!minimal && <Tooltip.Arrow className={Classes.POPOVER_ARROW} />}
                    <div className={Classes.POPOVER_CONTENT}>{content}</div>
                </Tooltip.Popup>
            );
        };

        const handleOpenChange = useCallback(
            (open: boolean) => {
                onInteraction?.(open);
            },
            [onInteraction],
        );

        const renderTrigger = useCallback(
            (triggerProps: any) => {
                return createElement(
                    targetTagName,
                    {
                        ...triggerProps,
                        className: classNames(className, triggerProps.className),
                    },
                    children,
                );
            },
            [targetTagName, className, children],
        );

        return (
            <Tooltip.Root defaultOpen={defaultIsOpen} open={isOpen} onOpenChange={handleOpenChange} {...props}>
                <Tooltip.Trigger
                    closeDelay={hoverCloseDelay}
                    delay={hoverOpenDelay}
                    disabled={disabled}
                    render={renderTrigger}
                />
                <Tooltip.Portal>
                    <Tooltip.Positioner
                        align={align}
                        className={Classes.POPOVER_TRANSITION_CONTAINER}
                        side={side}
                        sideOffset={minimal ? 0 : 10}
                    >
                        {renderPopup()}
                    </Tooltip.Positioner>
                </Tooltip.Portal>
            </Tooltip.Root>
        );
    },
);
