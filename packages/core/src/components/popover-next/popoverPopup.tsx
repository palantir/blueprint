/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import classNames from "classnames";
import { useRef } from "react";

import { Classes, type HTMLDivProps, mergeRefs, Utils } from "../../common";
import { Overlay2 } from "../overlay2/overlay2";
import { PopoverArrow } from "../popover/popoverArrow";
import { PopoverAnimation, PopoverInteractionKind } from "../popover/popoverProps";
import { getBasePlacement, getTransformOrigin } from "../popover/popperUtils";

import type { PopoverPopupProps } from "./popoverNextProps";

export function PopoverPopup(props: PopoverPopupProps) {
    const {
        animation = PopoverAnimation.SCALE,
        arrow = true,
        arrowRef,
        autoFocus = true,
        backdropProps,
        canEscapeKeyClose,
        captureDismiss = false,
        content,
        enforceFocus = true,
        floatingData,
        handleMouseEnter,
        handleMouseLeave,
        handleOverlayClose,
        handlePopoverClick,
        hasBackdrop = false,
        hasDarkParent,
        inheritDarkTheme = true,
        interactionKind = PopoverInteractionKind.CLICK,
        isClosingViaEscapeKeypress,
        isHoverInteractionKind,
        lazy = false,
        matchTargetWidth = false,
        onClosed,
        onClosing,
        onOpened,
        onOpening,
        popoverClassName,
        portalClassName,
        portalContainer,
        transitionDuration = 300,
        usePortal = true,
    } = props;

    const transitionContainerElement = useRef<HTMLDivElement>(null);

    const arrowStyle: React.CSSProperties = {
        left: floatingData.middlewareData.arrow?.x,
        position: "absolute",
        top: floatingData.middlewareData.arrow?.y,
    };

    const isReferenceHidden = floatingData.context.middlewareData.hide?.referenceHidden ?? false;
    const hasPopperEscaped = floatingData.context.middlewareData.hide?.escaped ?? false;

    const transformOrigin = getTransformOrigin(
        floatingData.placement,
        arrow
            ? {
                  left: cssPropertyToString(arrowStyle.left),
                  top: cssPropertyToString(arrowStyle.top),
              }
            : undefined,
    );

    const popoverHandlers: HTMLDivProps = {
        // always check popover clicks for dismiss class
        onClick: handlePopoverClick,
        // treat ENTER/SPACE keys the same as a click for accessibility
        onKeyDown: event => Utils.isKeyboardClick(event) && handlePopoverClick(event),
    };
    if (
        interactionKind === PopoverInteractionKind.HOVER ||
        (!usePortal && interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY)
    ) {
        popoverHandlers.onMouseEnter = handleMouseEnter;
        popoverHandlers.onMouseLeave = handleMouseLeave;
    }

    const basePlacement = getBasePlacement(floatingData.placement);
    const popoverClasses = classNames(
        Classes.POPOVER,
        {
            [Classes.DARK]: inheritDarkTheme && hasDarkParent,
            [Classes.POPOVER_MINIMAL_ANIMATION]: animation === PopoverAnimation.MINIMAL,
            [Classes.POPOVER_CAPTURING_DISMISS]: captureDismiss,
            [Classes.POPOVER_MATCH_TARGET_WIDTH]: matchTargetWidth,
            [Classes.POPOVER_REFERENCE_HIDDEN]: isReferenceHidden,
            [Classes.POPOVER_POPPER_ESCAPED]: hasPopperEscaped,
        },
        `${Classes.POPOVER_CONTENT_PLACEMENT}-${basePlacement}`,
        popoverClassName,
    );

    const defaultAutoFocus = isHoverInteractionKind ? false : undefined;

    // Override shouldReturnFocusOnClose based on interaction type:
    // - Hover interactions: always false (focus should stay on trigger per WCAG)
    // - ESC keypress: always true (keyboard users need focus returned)
    // - Otherwise: use prop value (defaults to true)
    const shouldReturnFocusOnClose = isHoverInteractionKind
        ? false
        : isClosingViaEscapeKeypress || props.shouldReturnFocusOnClose;

    return (
        <Overlay2
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autoFocus ?? defaultAutoFocus}
            backdropClassName={Classes.POPOVER_BACKDROP}
            backdropProps={backdropProps}
            canEscapeKeyClose={canEscapeKeyClose}
            canOutsideClickClose={interactionKind === PopoverInteractionKind.CLICK && hasBackdrop}
            childRef={transitionContainerElement}
            enforceFocus={enforceFocus}
            hasBackdrop={hasBackdrop}
            isOpen={floatingData.isOpen}
            lazy={lazy}
            onClose={handleOverlayClose}
            onClosed={onClosed}
            onClosing={onClosing}
            onOpened={onOpened}
            onOpening={onOpening}
            portalClassName={portalClassName}
            portalContainer={portalContainer}
            shouldReturnFocusOnClose={shouldReturnFocusOnClose}
            transitionDuration={transitionDuration}
            transitionName={Classes.POPOVER}
            usePortal={usePortal}
        >
            <div
                className={Classes.POPOVER_TRANSITION_CONTAINER}
                style={floatingData.floatingStyles}
                ref={mergeRefs(floatingData.refs.setFloating, transitionContainerElement)}
                {...popoverHandlers}
            >
                <div className={popoverClasses} style={{ transformOrigin }}>
                    {arrow && (
                        <PopoverArrow
                            arrowProps={{ ref: arrowRef, style: arrowStyle }}
                            placement={floatingData.placement}
                        />
                    )}
                    <div className={Classes.POPOVER_CONTENT}>{content}</div>
                </div>
            </div>
        </Overlay2>
    );
}

function cssPropertyToString(value: string | number | undefined): string {
    if (value === "") {
        return value;
    }
    if (value == null || isNaN(Number(value))) {
        return "";
    }
    return `${value}px`;
}
