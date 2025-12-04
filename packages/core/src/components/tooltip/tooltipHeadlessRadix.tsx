/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import classNames from "classnames";
import { Tooltip } from "radix-ui";
import { createElement, forwardRef, useCallback, useEffect, useRef, useState } from "react";

import type { IntentProps } from "../../common";
import * as Classes from "../../common/classes";
import { SVG_ARROW_PATH, SVG_SHADOW_PATH, TOOLTIP_ARROW_SVG_SIZE } from "../popover/popoverArrow";
import type { PopoverInteractionKind } from "../popover/popoverProps";
import type { DefaultPopoverTargetHTMLProps, PopoverSharedProps } from "../popover/popoverSharedProps";

/** Get arrow rotation angle based on placement side */
function getArrowAngle(side: "top" | "bottom" | "left" | "right"): number {
    switch (side) {
        case "top":
            return -90;
        case "left":
            return 180;
        case "bottom":
            return 90;
        case "right":
        default:
            return 0;
    }
}

interface BlueprintArrowProps {
    side: "top" | "bottom" | "left" | "right";
}

/** Custom Blueprint-styled arrow component for Radix tooltips */
const BlueprintArrow: React.FC<BlueprintArrowProps> = ({ side }) => (
    <Tooltip.Arrow asChild={true} height={TOOLTIP_ARROW_SVG_SIZE / 2} width={TOOLTIP_ARROW_SVG_SIZE}>
        <div aria-hidden="true" className={Classes.POPOVER_ARROW}>
            <svg
                height={TOOLTIP_ARROW_SVG_SIZE}
                style={{ transform: `rotate(${getArrowAngle(side)}deg)` }}
                viewBox={`0 0 ${TOOLTIP_ARROW_SVG_SIZE} ${TOOLTIP_ARROW_SVG_SIZE}`}
                width={TOOLTIP_ARROW_SVG_SIZE}
            >
                <path className={Classes.POPOVER_ARROW + "-border"} d={SVG_SHADOW_PATH} />
                <path className={Classes.POPOVER_ARROW + "-fill"} d={SVG_ARROW_PATH} />
            </svg>
        </div>
    </Tooltip.Arrow>
);

export interface TooltipHeadlessRadixProps<TProps extends DefaultPopoverTargetHTMLProps = DefaultPopoverTargetHTMLProps>
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
 * TooltipHeadlessRadix component - a headless tooltip implementation using Radix UI.
 *
 * @see https://blueprintjs.com/docs/#core/components/tooltip
 */
export const TooltipHeadlessRadix = forwardRef<HTMLDivElement, TooltipHeadlessRadixProps>(function TooltipHeadlessRadix(
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
        isOpen: isOpenProp,
        minimal = false,
        onInteraction,
        placement = "auto",
        popoverClassName,
        targetTagName = "span",
        // transitionDuration is accepted but not used (Radix handles transitions)
        transitionDuration: _transitionDuration = 100,
        usePortal = true,
    },
    ref,
) {
    // Internal state for managing close delay (only used when isOpenProp is undefined)
    const [isOpenInternal, setIsOpenInternal] = useState(defaultIsOpen);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Determine if component is controlled or uncontrolled
    const isControlled = isOpenProp !== undefined;
    const isOpen = isControlled ? isOpenProp : isOpenInternal;

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current !== null) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    // Convert Blueprint placement/position to Radix side and alignment
    const placementParts = placement !== "auto" ? placement.split("-") : ["top"];
    const side = placementParts[0] as "top" | "bottom" | "left" | "right";
    const align = placementParts[1] as "start" | "center" | "end" | undefined;

    // Generate class names for the tooltip (matches Blueprint's DOM structure)
    const tooltipClasses = classNames(
        Classes.TOOLTIP,
        Classes.POPOVER,
        Classes.intentClass(intent),
        {
            [Classes.COMPACT]: compact,
            [Classes.MINIMAL]: minimal,
        },
        `${Classes.POPOVER_CONTENT_PLACEMENT}-${side}`,
        popoverClassName,
    );

    const handleOpenChange = useCallback(
        (open: boolean) => {
            // Clear any pending close timeout
            if (closeTimeoutRef.current !== null) {
                clearTimeout(closeTimeoutRef.current);
                closeTimeoutRef.current = null;
            }

            if (open) {
                // Opening: update immediately
                if (!isControlled) {
                    setIsOpenInternal(true);
                }
                onInteraction?.(true);
            } else {
                // Closing: apply delay if specified
                if (hoverCloseDelay > 0) {
                    closeTimeoutRef.current = setTimeout(() => {
                        if (!isControlled) {
                            setIsOpenInternal(false);
                        }
                        onInteraction?.(false);
                        closeTimeoutRef.current = null;
                    }, hoverCloseDelay);
                } else {
                    if (!isControlled) {
                        setIsOpenInternal(false);
                    }
                    onInteraction?.(false);
                }
            }
        },
        [hoverCloseDelay, isControlled, onInteraction],
    );

    const renderContent = () => (
        <>
            <div className={Classes.POPOVER_CONTENT}>{content}</div>
            {!minimal && <BlueprintArrow side={side} />}
        </>
    );

    const triggerElement = createElement(targetTagName, { className }, children);

    return (
        <Tooltip.Provider>
            <Tooltip.Root
                delayDuration={hoverOpenDelay}
                disableHoverableContent={interactionKind === "hover-target"}
                onOpenChange={handleOpenChange}
                open={isOpen}
            >
                <Tooltip.Trigger asChild={true} disabled={disabled}>
                    {triggerElement}
                </Tooltip.Trigger>
                {usePortal ? (
                    <Tooltip.Portal>
                        <Tooltip.Content
                            align={align ?? "center"}
                            className={tooltipClasses}
                            ref={ref}
                            side={side}
                            sideOffset={minimal ? 0 : 10}
                        >
                            {renderContent()}
                        </Tooltip.Content>
                    </Tooltip.Portal>
                ) : (
                    <Tooltip.Content
                        align={align ?? "center"}
                        className={tooltipClasses}
                        ref={ref}
                        side={side}
                        sideOffset={minimal ? 0 : 10}
                    >
                        {renderContent()}
                    </Tooltip.Content>
                )}
            </Tooltip.Root>
        </Tooltip.Provider>
    );
});
