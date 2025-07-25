/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import React, { useEffect, useImperativeHandle } from "react";

import { Classes, DISPLAYNAME_PREFIX, Utils } from "../../common";
import { PopoverInteractionKind, type PopoverProps } from "../popover/popoverProps";

import { PopoverPopup } from "./popoverPopup";
import { PopoverTarget } from "./popoverTarget";
import { usePopover } from "./usePopover";

export interface PopoverFloatingRef {
    reposition(): void;
}

export const PopoverFloating = React.forwardRef<PopoverFloatingRef, PopoverProps>((props, ref) => {
    const {
        boundary,
        canEscapeKeyClose = true,
        children,
        content,
        defaultIsOpen = false,
        disabled = false,
        hoverCloseDelay = 300,
        hoverOpenDelay = 150,
        interactionKind = PopoverInteractionKind.CLICK,
        matchTargetWidth = false,
        minimal = false,
        modifiers,
        onClose,
        onInteraction,
        openOnTargetFocus = true,
        placement = "auto",
        rootBoundary,
        shouldReturnFocusOnClose = false,
        usePortal = true,
    } = props;

    const [hasDarkParent, setHasDarkParent] = React.useState(false);
    const [isClosingViaEscapeKeypress, setIsClosingViaEscapeKeypress] = React.useState(false);

    const cancelOpenTimeout = React.useRef<(() => void) | undefined>(undefined);
    const isMouseInTargetOrPopover = React.useRef(false);
    const lostFocusOnSamePage = React.useRef(true);
    const targetRef = React.createRef<HTMLElement>();
    const timeoutIds = React.useRef<number[]>([]);

    const context = usePopover({
        boundary,
        canEscapeKeyClose,
        interactionKind,
        isOpen: props.isOpen ?? defaultIsOpen,
        matchTargetWidth,
        minimal,
        modifiers,
        // Always provide onOpenChange for proper state synchronization
        onOpenChange: (nextOpen, event) => {
            // Use our setOpenState logic which handles both controlled and uncontrolled components
            setOpenState(nextOpen, event as unknown as React.SyntheticEvent<HTMLElement>);
        },
        placement,
        rootBoundary,
    });

    useImperativeHandle(
        ref,
        () => ({
            reposition: () => {
                context.update();
            },
        }),
        [context],
    );

    const popoverElement = context.refs.floating.current;

    const isContentEmpty = content == null || Utils.isEmptyString(content);

    const isControlled = props.isOpen !== undefined;

    const isHoverInteractionKind =
        interactionKind === PopoverInteractionKind.HOVER ||
        interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY;

    const getPopoverElement = React.useCallback(() => {
        return popoverElement?.querySelector<HTMLElement>(`.${Classes.POPOVER}`);
    }, [popoverElement]);

    const isElementInPopover = React.useCallback(
        (element: Element) => {
            return getPopoverElement()?.contains(element) ?? false;
        },
        [getPopoverElement],
    );

    const setTimeout = React.useCallback((callback: () => void, timeout?: number) => {
        const handle = window.setTimeout(callback, timeout);
        timeoutIds.current.push(handle);
        return () => window.clearTimeout(handle);
    }, []);

    // a wrapper around setIsOpen that will call props.onInteraction instead when in controlled mode.
    // starts a timeout to delay changing the state if a non-zero duration is provided.
    const setOpenState = React.useCallback(
        (isOpen: boolean, event?: React.SyntheticEvent<HTMLElement>, timeout?: number) => {
            // cancel any existing timeout because we have new state
            cancelOpenTimeout.current?.();
            if (timeout !== undefined && timeout > 0) {
                // Persist the react event since it will be used in a later macrotask.
                event?.persist();
                cancelOpenTimeout.current = setTimeout(() => {
                    setOpenState(isOpen, event);
                }, timeout);
            } else {
                if (props.isOpen == null) {
                    // For uncontrolled popovers, update the usePopover state directly
                    context.setIsOpen(isOpen);
                } else {
                    onInteraction?.(isOpen, event);
                }
                if (!isOpen) {
                    // non-null assertion because the only time `e` is undefined is when in controlled mode
                    // or the rare special case in uncontrolled mode when the `disabled` flag is toggled true
                    onClose?.(event!);
                    setIsClosingViaEscapeKeypress(isEscapeKeypressEvent(event?.nativeEvent));
                }
            }
        },
        [context, props.isOpen, onInteraction, onClose, setTimeout],
    );

    const handleTargetContextMenu = React.useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            // we assume that when someone prevents the default interaction on this event (a browser native context menu),
            // they are showing a custom context menu (as ContextMenu2 does); in this case, we should close this popover/tooltip
            if (event.defaultPrevented) {
                setOpenState(false, event);
            }
        },
        [setOpenState],
    );

    const handleMouseLeave = React.useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            isMouseInTargetOrPopover.current = false;

            event.persist();
            setTimeout(() => {
                if (isMouseInTargetOrPopover.current) {
                    return;
                }
                setOpenState(false, event, hoverCloseDelay);
            });
        },
        [hoverCloseDelay, setOpenState, setTimeout],
    );

    const handleMouseEnter = React.useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            isMouseInTargetOrPopover.current = true;

            // if we're entering the popover, and the mode is set to be HOVER_TARGET_ONLY, we want to manually
            // trigger the mouse leave event, as hovering over the popover shouldn't count.
            if (
                !usePortal &&
                isElementInPopover(event.target as Element) &&
                interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY &&
                !openOnTargetFocus
            ) {
                handleMouseLeave(event);
            } else if (!disabled) {
                // only begin opening popover when it is enabled
                setOpenState(true, event, hoverOpenDelay);
            }
        },
        [
            disabled,
            handleMouseLeave,
            hoverOpenDelay,
            interactionKind,
            isElementInPopover,
            openOnTargetFocus,
            setOpenState,
            usePortal,
        ],
    );

    const handleTargetFocus = React.useCallback(
        (event: React.FocusEvent<HTMLElement>) => {
            if (openOnTargetFocus && isHoverInteractionKind) {
                if (event.relatedTarget == null && !lostFocusOnSamePage.current) {
                    // ignore this focus event -- the target was already focused but the page itself
                    // lost focus (e.g. due to switching tabs).
                    return;
                }
                handleMouseEnter(event as unknown as React.MouseEvent<HTMLElement>);
            }
        },
        [handleMouseEnter, isHoverInteractionKind, openOnTargetFocus],
    );

    const handleTargetBlur = React.useCallback(
        (event: React.FocusEvent<HTMLElement>) => {
            if (openOnTargetFocus && isHoverInteractionKind) {
                if (event.relatedTarget != null) {
                    // if the next element to receive focus is within the popover, we'll want to leave the
                    // popover open.
                    if (
                        event.relatedTarget !== popoverElement &&
                        !isElementInPopover(event.relatedTarget as HTMLElement)
                    ) {
                        handleMouseLeave(event as unknown as React.MouseEvent<HTMLElement>);
                    }
                } else {
                    handleMouseLeave(event as unknown as React.MouseEvent<HTMLElement>);
                }
            }
            lostFocusOnSamePage.current = event.relatedTarget != null;
        },
        [handleMouseLeave, isHoverInteractionKind, isElementInPopover, openOnTargetFocus, popoverElement],
    );

    const handlePopoverClick = React.useCallback(
        (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
            const eventTarget = event.target as HTMLElement;
            const eventPopover = eventTarget.closest(`.${Classes.POPOVER}`);
            const isEventFromSelf = eventPopover === getPopoverElement();
            const isEventPopoverCapturing =
                eventPopover?.classList.contains(Classes.POPOVER_CAPTURING_DISMISS) ?? false;

            // an OVERRIDE inside a DISMISS does not dismiss, and a DISMISS inside an OVERRIDE will dismiss.
            const dismissElement = eventTarget.closest(
                `.${Classes.POPOVER_DISMISS}, .${Classes.POPOVER_DISMISS_OVERRIDE}`,
            );
            const shouldDismiss = dismissElement?.classList.contains(Classes.POPOVER_DISMISS) ?? false;
            const isDisabled = eventTarget.closest(`:disabled, .${Classes.DISABLED}`) != null;

            if (shouldDismiss && !isDisabled && (!isEventPopoverCapturing || isEventFromSelf)) {
                setOpenState(false, event);
            }
        },
        [getPopoverElement, setOpenState],
    );

    const handleOverlayClose = React.useCallback(
        (event?: React.SyntheticEvent<HTMLElement>) => {
            if (targetRef.current == null || event === undefined) {
                return;
            }

            const nativeEvent = (event.nativeEvent ?? event) as Event;
            const eventTarget = (
                nativeEvent.composed ? nativeEvent.composedPath()[0] : nativeEvent.target
            ) as HTMLElement;
            // if click was in target, target event listener will handle things, so don't close
            if (
                !Utils.elementIsOrContains(targetRef.current, eventTarget) ||
                event.nativeEvent instanceof KeyboardEvent
            ) {
                setOpenState(false, event);
            }
        },
        [setOpenState, targetRef],
    );

    const handleTargetClick = React.useCallback(
        (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
            // Target element(s) may fire simulated click event upon pressing ENTER/SPACE, which we should ignore
            // see: https://github.com/palantir/blueprint/issues/5775
            const shouldIgnoreClick = context.isOpen && isSimulatedButtonClick(event);
            if (!shouldIgnoreClick) {
                // ensure click did not originate from within inline popover before closing
                if (!disabled && !isElementInPopover(event.target as HTMLElement)) {
                    setOpenState(!context.isOpen, event);
                }
            }
        },
        [context, disabled, isElementInPopover, setOpenState],
    );

    const handleKeyDown = React.useCallback(() => {
        // Floating UI's useClick hook already handles keyboard interactions (ENTER/SPACE)
        // so we don't need to manually call handleTargetClick here
    }, []);

    const getIsOpen = React.useCallback(() => {
        // disabled popovers should never be allowed to open.
        if (disabled) {
            return false;
        } else {
            return props.isOpen ?? props.defaultIsOpen!;
        }
    }, [disabled, props.defaultIsOpen, props.isOpen]);

    const updateDarkParent = React.useCallback(() => {
        if (usePortal && context.isOpen) {
            setHasDarkParent(targetRef.current?.closest(`.${Classes.DARK}`) != null);
        }
    }, [context.isOpen, targetRef, usePortal]);

    useEffect(() => {
        updateDarkParent();

        const nextIsOpen = getIsOpen();

        if (props.isOpen != null && nextIsOpen !== context.isOpen) {
            setOpenState(nextIsOpen);
        } else if (props.disabled && context.isOpen && props.isOpen == null) {
            // special case: close an uncontrolled popover when disabled is set to true
            setOpenState(false);
        }
    }, [context, getIsOpen, props.disabled, props.isOpen, setOpenState, updateDarkParent]);

    return (
        <>
            <PopoverTarget
                context={context}
                handleKeyDown={handleKeyDown}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handleTargetBlur={handleTargetBlur}
                handleTargetClick={handleTargetClick}
                handleTargetContextMenu={handleTargetContextMenu}
                handleTargetFocus={handleTargetFocus}
                isContentEmpty={isContentEmpty}
                isControlled={isControlled}
                isHoverInteractionKind={isHoverInteractionKind}
                openOnTargetFocus={openOnTargetFocus}
                ref={targetRef}
                {...props}
            >
                {children}
            </PopoverTarget>
            <PopoverPopup
                context={context}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handleOverlayClose={handleOverlayClose}
                handlePopoverClick={handlePopoverClick}
                hasDarkParent={hasDarkParent}
                isClosingViaEscapeKeypress={isClosingViaEscapeKeypress}
                isHoverInteractionKind={isHoverInteractionKind}
                shouldReturnFocusOnClose={shouldReturnFocusOnClose}
                {...props}
            />
        </>
    );
});

PopoverFloating.displayName = `${DISPLAYNAME_PREFIX}.PopoverFloating`;

function isEscapeKeypressEvent(e?: Event) {
    return e instanceof KeyboardEvent && e.key === "Escape";
}

const isSimulatedButtonClick = (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    return !e.isTrusted && (e.target as HTMLElement).matches(`.${Classes.BUTTON}`);
};
