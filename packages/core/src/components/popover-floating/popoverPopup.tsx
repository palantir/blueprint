/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import classNames from "classnames";
import React from "react";

import { Classes, type HTMLDivProps, mergeRefs, Utils } from "../../common";
import { Overlay2 } from "../overlay2/overlay2";
import { PopoverArrow } from "../popover/popoverArrow";
import { PopoverInteractionKind, type PopoverProps } from "../popover/popoverProps";
import { getBasePlacement, getTransformOrigin } from "../popover/popperUtils";

import { type usePopover } from "./usePopover";

interface PopoverPopupProps extends PopoverProps {
    context: ReturnType<typeof usePopover>;
    handleMouseEnter: (event: React.MouseEvent<HTMLElement>) => void;
    handleMouseLeave: (event: React.MouseEvent<HTMLElement>) => void;
    handleOverlayClose: (event?: React.SyntheticEvent<HTMLElement>) => void;
    handlePopoverClick: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
    hasDarkParent: boolean;
    isClosingViaEscapeKeypress: boolean;
    isHoverInteractionKind: boolean;
}

export function PopoverPopup(props: PopoverPopupProps) {
    const {
        autoFocus = true,
        backdropProps,
        canEscapeKeyClose,
        captureDismiss = false,
        content,
        context,
        enforceFocus = true,
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
        minimal = false,
        modifiers,
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

    const transitionContainerElement = React.useRef<HTMLDivElement>(null);

    const isArrowEnabled = !minimal && modifiers?.arrow?.enabled !== false;

    const arrowStyle: React.CSSProperties = {
        left: context.middlewareData.arrow?.x,
        position: "absolute",
        top: context.middlewareData.arrow?.y,
    };

    const isReferenceHidden = context.context.middlewareData.hide?.referenceHidden ?? false;
    const hasPopperEscaped = context.context.middlewareData.hide?.escaped ?? false;

    const transformOrigin = getTransformOrigin(
        context.placement,
        isArrowEnabled
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

    const basePlacement = getBasePlacement(context.placement);
    const popoverClasses = classNames(
        Classes.POPOVER,
        {
            [Classes.DARK]: inheritDarkTheme && hasDarkParent,
            [Classes.MINIMAL]: minimal,
            [Classes.POPOVER_CAPTURING_DISMISS]: captureDismiss,
            [Classes.POPOVER_MATCH_TARGET_WIDTH]: matchTargetWidth,
            [Classes.POPOVER_REFERENCE_HIDDEN]: isReferenceHidden,
            [Classes.POPOVER_POPPER_ESCAPED]: hasPopperEscaped,
        },
        `${Classes.POPOVER_CONTENT_PLACEMENT}-${basePlacement}`,
        popoverClassName,
    );

    const defaultAutoFocus = isHoverInteractionKind ? false : undefined;
    // if hover interaction, it doesn't make sense to take over focus control
    const shouldReturnFocusOnClose = isHoverInteractionKind
        ? false
        : isClosingViaEscapeKeypress
          ? true
          : props.shouldReturnFocusOnClose;

    return (
        <Overlay2
            autoFocus={autoFocus ?? defaultAutoFocus}
            backdropClassName={Classes.POPOVER_BACKDROP}
            backdropProps={backdropProps}
            canEscapeKeyClose={canEscapeKeyClose}
            canOutsideClickClose={interactionKind === PopoverInteractionKind.CLICK}
            childRef={transitionContainerElement}
            enforceFocus={enforceFocus}
            hasBackdrop={hasBackdrop}
            isOpen={context.isOpen}
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
                style={context.floatingStyles}
                ref={mergeRefs(context.refs.setFloating, transitionContainerElement)}
                {...popoverHandlers}
            >
                <div className={popoverClasses} style={{ transformOrigin }}>
                    {isArrowEnabled && (
                        <PopoverArrow
                            arrowProps={{ ref: context.arrowRef, style: arrowStyle }}
                            placement={context.placement}
                        />
                    )}
                    <div className={Classes.POPOVER_CONTENT}>{content}</div>
                </div>
            </div>
        </Overlay2>
    );
}

function cssPropertyToString(value: string | number | undefined): string {
    return value != null && !isNaN(Number(value)) ? `${value}px` : "";
}
