/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { Children, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

import { Classes, DISPLAYNAME_PREFIX, Utils } from "../../common";
import * as Errors from "../../common/errors";
import { useValidateProps } from "../../hooks/useValidateProps";
import { POPOVER_ARROW_SVG_SIZE } from "../popover/popoverArrow";
import { PopoverInteractionKind } from "../popover/popoverProps";

import { convertMiddlewareConfigToArray } from "./floatingUtils";
import type { MiddlewareConfig, PopoverNextProps } from "./popoverNextProps";
import { PopoverPopup } from "./popoverPopup";
import { PopoverTarget } from "./popoverTarget";
import { usePopover } from "./usePopover";

export interface PopoverNextRef {
    reposition(): void;
}

export const PopoverNext = forwardRef<PopoverNextRef, PopoverNextProps>((props, ref) => {
    const {
        animation = "scale",
        arrow = true,
        boundary = "clippingAncestors",
        canEscapeKeyClose = true,
        children,
        content,
        defaultIsOpen = false,
        disabled = false,
        hasBackdrop = false,
        hoverCloseDelay = 300,
        hoverOpenDelay = 150,
        interactionKind = PopoverInteractionKind.CLICK,
        isOpen,
        matchTargetWidth = false,
        middleware: middlewareOverrides,
        onClose,
        onInteraction,
        openOnTargetFocus = true,
        placement,
        positioningStrategy = "absolute",
        renderTarget,
        rootBoundary,
        shouldReturnFocusOnClose = true,
        targetProps,
        usePortal = true,
    } = props;

    useValidateProps(() => {
        if (isOpen == null && onInteraction != null) {
            console.warn(Errors.POPOVER_WARN_UNCONTROLLED_ONINTERACTION);
        }
        if (hasBackdrop && !usePortal) {
            console.warn(Errors.POPOVER_WARN_HAS_BACKDROP_INLINE);
        }
        if (hasBackdrop && interactionKind !== PopoverInteractionKind.CLICK) {
            console.warn(Errors.POPOVER_HAS_BACKDROP_INTERACTION);
        }

        const childrenCount = Children.count(children);
        const hasRenderTargetProp = renderTarget !== undefined;
        const hasTargetPropsProp = targetProps !== undefined;

        if (childrenCount === 0 && !hasRenderTargetProp) {
            console.warn(Errors.POPOVER_REQUIRES_TARGET);
        }
        if (childrenCount > 1) {
            console.warn(Errors.POPOVER_WARN_TOO_MANY_CHILDREN);
        }
        if (childrenCount > 0 && hasRenderTargetProp) {
            console.warn(Errors.POPOVER_WARN_DOUBLE_TARGET);
        }
        if (hasRenderTargetProp && hasTargetPropsProp) {
            console.warn(Errors.POPOVER_WARN_TARGET_PROPS_WITH_RENDER_TARGET);
        }
    }, [
        arrow,
        children,
        hasBackdrop,
        interactionKind,
        isOpen,
        onInteraction,
        placement,
        renderTarget,
        targetProps,
        usePortal,
    ]);

    const [hasDarkParent, setHasDarkParent] = useState(false);
    const [isClosingViaEscapeKeypress, setIsClosingViaEscapeKeypress] = useState(false);

    const arrowRef = useRef(null);
    const cancelOpenTimeout = useRef<(() => void) | undefined>(undefined);
    const isMouseInTargetOrPopover = useRef(false);
    const lostFocusOnSamePage = useRef(true);
    const targetRef = useRef<HTMLElement>(null);
    const timeoutIds = useRef<number[]>([]);

    const isControlled = isOpen !== undefined;
    const isContentEmpty = content == null || Utils.isEmptyString(content);

    const computedIsOpen = disabled ? false : (isOpen ?? defaultIsOpen);

    const middleware = useMemo(() => {
        const defaultMiddleware: MiddlewareConfig = {
            ...(placement === undefined
                ? { autoPlacement: { boundary, rootBoundary } }
                : { flip: { boundary, rootBoundary } }),
            ...(arrow
                ? {
                      arrow: { element: arrowRef },
                      offset: { mainAxis: POPOVER_ARROW_SVG_SIZE / 2 },
                  }
                : {}),
            shift: { boundary, rootBoundary },
            size: matchTargetWidth
                ? {
                      apply({ rects, elements }) {
                          Object.assign(elements.floating.style, {
                              width: `${rects.reference.width}px`,
                          });
                      },
                  }
                : undefined,
        };
        const mergedMiddleware: MiddlewareConfig = { ...defaultMiddleware, ...middlewareOverrides };
        return convertMiddlewareConfigToArray(mergedMiddleware);
    }, [placement, boundary, rootBoundary, arrow, arrowRef, matchTargetWidth, middlewareOverrides]);

    const floatingData = usePopover({
        canEscapeKeyClose,
        disabled,
        hasBackdrop,
        interactionKind,
        isControlled,
        isOpen: computedIsOpen,
        middleware,
        onOpenChange: (nextOpen, event) => {
            // Use setOpenState logic which handles both controlled and uncontrolled components
            setOpenState(nextOpen, event as unknown as React.SyntheticEvent<HTMLElement>);
        },
        placement,
        positioningStrategy,
    });

    useImperativeHandle(
        ref,
        () => ({
            reposition: () => {
                floatingData.update();
            },
        }),
        [floatingData],
    );

    const popoverElement = floatingData.refs.floating.current;

    const isHoverInteractionKind =
        interactionKind === PopoverInteractionKind.HOVER ||
        interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY;

    const getPopoverElement = useCallback(() => {
        return popoverElement?.querySelector<HTMLElement>(`.${Classes.POPOVER}`);
    }, [popoverElement]);

    const isElementInPopover = useCallback(
        (element: Element) => {
            return getPopoverElement()?.contains(element) ?? false;
        },
        [getPopoverElement],
    );

    const setTimeout = useCallback((callback: () => void, timeout?: number) => {
        const handle = window.setTimeout(callback, timeout);
        timeoutIds.current.push(handle);
        return () => window.clearTimeout(handle);
    }, []);

    // a wrapper around setIsOpen that will call onInteraction instead when in controlled mode.
    // starts a timeout to delay changing the state if a non-zero duration is provided.
    const setOpenState = useCallback(
        (isOpenState: boolean, event?: React.SyntheticEvent<HTMLElement>, timeout?: number) => {
            // cancel any existing timeout because we have new state
            cancelOpenTimeout.current?.();
            if (timeout !== undefined && timeout > 0) {
                // Persist the react event since it will be used in a later macrotask.
                event?.persist();
                cancelOpenTimeout.current = setTimeout(() => {
                    setOpenState(isOpenState, event);
                }, timeout);
            } else {
                if (isOpen == null) {
                    // For uncontrolled popovers, update the usePopover state directly
                    floatingData.setIsOpen(isOpenState);
                } else {
                    onInteraction?.(isOpenState, event);
                }
                if (!isOpenState) {
                    // non-null assertion because the only time `e` is undefined is when in controlled mode
                    // or the rare special case in uncontrolled mode when the `disabled` flag is toggled true
                    onClose?.(event!);
                    setIsClosingViaEscapeKeypress(isEscapeKeypressEvent(event?.nativeEvent));
                }
            }
        },
        [floatingData, isOpen, onInteraction, onClose, setTimeout],
    );

    const handleTargetContextMenu = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            // we assume that when someone prevents the default interaction on this event (a browser native context menu),
            // they are showing a custom context menu (as ContextMenu2 does); in this case, we should close this popover/tooltip
            if (event.defaultPrevented) {
                setOpenState(false, event);
            }
        },
        [setOpenState],
    );

    const handleMouseLeave = useCallback(
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

    const handleMouseEnter = useCallback(
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

    const handleTargetFocus = useCallback(
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

    const handleTargetBlur = useCallback(
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
        [handleMouseLeave, isElementInPopover, isHoverInteractionKind, openOnTargetFocus, popoverElement],
    );

    const handlePopoverClick = useCallback(
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

    const handleOverlayClose = useCallback(
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

    const updateDarkParent = useCallback(() => {
        if (usePortal && floatingData.isOpen) {
            setHasDarkParent(targetRef.current?.closest(`.${Classes.DARK}`) != null);
        }
    }, [floatingData.isOpen, targetRef, usePortal]);

    useEffect(() => {
        updateDarkParent();

        if (isOpen != null && computedIsOpen !== floatingData.isOpen) {
            setOpenState(computedIsOpen);
        } else if (disabled && floatingData.isOpen && isOpen == null) {
            // special case: close an uncontrolled popover when disabled is set to true
            setOpenState(false);
        }

        // Warn about empty content when trying to open (needs to be in effect to access current state)
        if (isContentEmpty) {
            if (!disabled && computedIsOpen !== false && !Utils.isNodeEnv("production")) {
                console.warn(Errors.POPOVER_WARN_EMPTY_CONTENT);
            }
        }
    }, [computedIsOpen, disabled, floatingData, isContentEmpty, isOpen, setOpenState, updateDarkParent]);

    return (
        <>
            <PopoverTarget
                floatingData={floatingData}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handleTargetBlur={handleTargetBlur}
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
            {!isContentEmpty && (
                <PopoverPopup
                    animation={animation}
                    arrowRef={arrowRef}
                    floatingData={floatingData}
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
            )}
        </>
    );
});

PopoverNext.displayName = `${DISPLAYNAME_PREFIX}.PopoverNext`;

function isEscapeKeypressEvent(e?: Event) {
    return e instanceof KeyboardEvent && e.key === "Escape";
}
