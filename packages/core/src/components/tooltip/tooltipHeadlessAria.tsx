/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import classNames from "classnames";
import { forwardRef, useRef } from "react";
import { mergeProps, useOverlayPosition, useTooltip, useTooltipTrigger } from "react-aria";
import { Tooltip as AriaTooltip, Button, TooltipTrigger } from "react-aria-components";
import { useTooltipTriggerState } from "react-stately";

import type { IntentProps } from "../../common";
import * as Classes from "../../common/classes";
import type { PopoverInteractionKind } from "../popover/popoverProps";
import type { DefaultPopoverTargetHTMLProps, PopoverSharedProps } from "../popover/popoverSharedProps";

export interface TooltipHeadlessAriaProps<TProps extends DefaultPopoverTargetHTMLProps = DefaultPopoverTargetHTMLProps>
    extends Omit<PopoverSharedProps<TProps>, "shouldReturnFocusOnClose">,
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
 * TooltipHeadlessAria component - a headless tooltip implementation using React Aria hooks.
 *
 * @see https://blueprintjs.com/docs/#core/components/tooltip
 */
export const TooltipHeadlessAria = forwardRef<HTMLDivElement, TooltipHeadlessAriaProps>(function TooltipHeadlessAria(
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
        // interactionKind is accepted but React Aria doesn't have an equivalent
        interactionKind: _interactionKind = "hover-target",
        isOpen,
        minimal = false,
        onInteraction,
        placement = "top",
        popoverClassName,
        // transitionDuration is accepted but React Aria handles transitions
        transitionDuration: _transitionDuration = 100,
        // usePortal is accepted for API compatibility
        usePortal: _usePortal = true,
    },
    ref,
) {
    const triggerRef = useRef<HTMLSpanElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    // Convert Blueprint placement to React Aria placement format
    // Blueprint: "top-start" -> React Aria: "top start"
    // Also handle "auto" placement
    const ariaPlacement = placement === "auto" ? "top" : placement.replace("-", " ");

    // Set up tooltip trigger state
    const state = useTooltipTriggerState({
        closeDelay: hoverCloseDelay,
        defaultOpen: defaultIsOpen,
        delay: hoverOpenDelay,
        isDisabled: disabled,
        isOpen,
        onOpenChange: onInteraction,
    });

    // Get props for the trigger and tooltip
    const { triggerProps, tooltipProps } = useTooltipTrigger({ isDisabled: disabled }, state, triggerRef);

    // Get props for the tooltip content
    const { tooltipProps: tooltipContentProps } = useTooltip(tooltipProps, state);

    // Get positioning props for the overlay
    const { overlayProps, placement: actualPlacement } = useOverlayPosition({
        isOpen: state.isOpen,
        offset: minimal ? 0 : 10,
        overlayRef,
        // React Aria uses "start"/"end" suffix format: "top", "top start", "top end", etc.
        placement: ariaPlacement as
            | "bottom"
            | "bottom left"
            | "bottom right"
            | "bottom start"
            | "bottom end"
            | "top"
            | "top left"
            | "top right"
            | "top start"
            | "top end"
            | "left"
            | "left top"
            | "left bottom"
            | "right"
            | "right top"
            | "right bottom"
            | "start"
            | "start top"
            | "start bottom"
            | "end"
            | "end top"
            | "end bottom",
        targetRef: triggerRef,
    });

    // Extract base placement for CSS class (e.g., "top start" -> "top")
    const basePlacement = actualPlacement?.split(" ")[0] ?? placement.split("-")[0];

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

    return (
        <>
            <span {...triggerProps} className={className} ref={triggerRef}>
                {children}
            </span>
            {state.isOpen && (
                <div
                    {...mergeProps(tooltipProps, tooltipContentProps, overlayProps)}
                    className={tooltipClasses}
                    ref={mergeRefs(overlayRef, ref)}
                >
                    <div className={Classes.POPOVER_CONTENT}>{content}</div>
                </div>
            )}
        </>
    );
});

/**
 * TooltipHeadlessAriaComponent - a headless tooltip using React Aria Components.
 *
 * This version uses the component-based API from react-aria-components.
 * The trigger must be a focusable element (uses Button internally).
 *
 * @see https://blueprintjs.com/docs/#core/components/tooltip
 */
export const TooltipHeadlessAriaComponent = forwardRef<HTMLDivElement, TooltipHeadlessAriaProps>(
    function TooltipHeadlessAriaComponent(
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
            // interactionKind is accepted but React Aria doesn't have an equivalent
            interactionKind: _interactionKind = "hover-target",
            isOpen,
            minimal = false,
            onInteraction,
            placement = "top",
            popoverClassName,
            // transitionDuration is accepted but React Aria handles transitions
            transitionDuration: _transitionDuration = 100,
            // usePortal is accepted for API compatibility (always uses portal)
            usePortal: _usePortal = true,
        },
        ref,
    ) {
        // Convert Blueprint placement to React Aria format
        // Blueprint: "top-start" -> React Aria: "top start"
        const ariaPlacement = placement === "auto" ? "top" : placement.replace("-", " ");

        // Generate class names for the tooltip
        const tooltipClasses = classNames(
            Classes.TOOLTIP,
            Classes.POPOVER,
            Classes.intentClass(intent),
            {
                [Classes.COMPACT]: compact,
                [Classes.MINIMAL]: minimal,
            },
            `${Classes.POPOVER_CONTENT_PLACEMENT}-${placement.split("-")[0]}`,
            popoverClassName,
        );

        return (
            <TooltipTrigger
                closeDelay={hoverCloseDelay}
                defaultOpen={defaultIsOpen}
                delay={hoverOpenDelay}
                isDisabled={disabled}
                isOpen={isOpen}
                onOpenChange={onInteraction}
            >
                <Button className={className} style={{ all: "unset", cursor: "inherit", display: "inline" }}>
                    {children}
                </Button>
                <AriaTooltip
                    className={tooltipClasses}
                    offset={minimal ? 0 : 10}
                    placement={ariaPlacement as "top" | "bottom" | "left" | "right"}
                    ref={ref}
                >
                    <div className={Classes.POPOVER_CONTENT}>{content}</div>
                </AriaTooltip>
            </TooltipTrigger>
        );
    },
);

// Helper to merge refs
function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> {
    return (value: T) => {
        refs.forEach(ref => {
            if (typeof ref === "function") {
                ref(value);
            } else if (ref != null) {
                (ref as React.MutableRefObject<T | null>).current = value;
            }
        });
    };
}
