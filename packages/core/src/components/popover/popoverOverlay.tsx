/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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

import type { Placement } from "@popperjs/core";
import classNames from "classnames";
import * as React from "react";
import type { PopperChildrenProps } from "react-popper";

import { Classes, DISPLAYNAME_PREFIX, type HTMLDivProps, mergeRefs, Utils } from "../../common";
import { Overlay2, type Overlay2Props } from "../overlay2/overlay2";
import { ResizeSensor } from "../resize-sensor/resizeSensor";

import { PopoverInteractionKind } from "./popoverInteractionKind";
import type { DefaultPopoverTargetHTMLProps, PopoverSharedProps } from "./popoverSharedProps";
import { getBasePlacement } from "./popperUtils";

export interface PopoverOverlayProps<TProps extends DefaultPopoverTargetHTMLProps>
    extends PopoverSharedProps<TProps>,
        Pick<Overlay2Props, "canOutsideClickClose" | "backdropProps" | "backdropClassName" | "hasBackdrop">,
        Pick<PopperChildrenProps, "isReferenceHidden" | "hasPopperEscaped" | "style"> {
    /**
     * Optional arrow element for the popover.
     */
    arrowElement?: React.ReactElement;

    /**
     * Ref attached to the Overlay2 child element (transition container). This is similar to, but slightly
     * different from, `ref`, since the latter will be a ref callback (provided by popper.js) while Overlay2
     * needs a ref object (to pass to `CSSTransition`). Yes, it's a confusing implementation quirk.
     */
    containerRef: React.RefObject<HTMLElement>;

    /**
     * Ref attached to the Overlay2 child element (transition container). Popper.js needs to attach
     * this ref for its positioning logic in the `<Popover>` component.
     */
    ref?: React.Ref<HTMLDivElement>;

    /**
     * The content displayed inside the popover.
     */
    content?: string | React.JSX.Element;

    /** Popover click handler */
    onClick?: (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;

    /** Popover mouse enter handler */
    onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void;

    /** Popover mouse leave handler */
    onMouseLeave?: (e: React.MouseEvent<HTMLElement>) => void;

    /** Optional - provide this if your target may move and you need to reposition the popover */
    onResize?: () => void;

    /** Popover interaction kind */
    interactionKind?: PopoverInteractionKind;

    /**
     * Whether the popover is currently closing due to an 'Escape' key press.
     */
    isClosingViaEscapeKeypress?: boolean;

    /**
     * Controlled open state.
     */
    isOpen: boolean;

    /**
     * Popover placement.
     */
    placement: Placement;

    /**
     * Ref attached to the `Classes.POPOVER` element (deeper in the DOM than the transition container).
     */
    popoverRef: React.Ref<HTMLDivElement>;

    /**
     * CSS transition transform origin used to scale animations relative to the popover target.
     */
    transformOrigin: string;

    /**
     * Whether to use the dark theme.
     */
    useDarkTheme?: boolean;
}

function isHoverInteraction(interactionKind: PopoverInteractionKind | undefined) {
    return (
        interactionKind === PopoverInteractionKind.HOVER || interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY
    );
}

/**
 * Popover overlay component.
 *
 * This component encapsulates the presentational behavior of a popover rendered inside an overlay.
 * It does not position the popover on the page; that must be done explicitly using the `style` prop.
 *
 * This component may be used with (see `Popover`) or without (see `ContextMenu`) the help of popper.js
 * positioning logic.
 */
export const PopoverOverlay = React.forwardRef<HTMLDivElement, PopoverOverlayProps<any>>((props, ref) => {
    const { autoFocus, enforceFocus, backdropProps, canEscapeKeyClose, hasBackdrop, transformOrigin, usePortal } =
        props;

    const popoverHandlers: HTMLDivProps = {
        // always check popover clicks for dismiss class
        onClick: props.onClick,
        // treat ENTER/SPACE keys the same as a click for accessibility
        onKeyDown: event => Utils.isKeyboardClick(event) && props.onClick?.(event),
    };
    if (
        props.interactionKind === PopoverInteractionKind.HOVER ||
        (!usePortal && props.interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY)
    ) {
        popoverHandlers.onMouseEnter = props.onMouseEnter;
        popoverHandlers.onMouseLeave = props.onMouseLeave;
    }

    const basePlacement = getBasePlacement(props.placement);
    const popoverClasses = classNames(
        Classes.POPOVER,
        {
            [Classes.DARK]: props.useDarkTheme,
            [Classes.MINIMAL]: props.minimal,
            [Classes.POPOVER_CAPTURING_DISMISS]: props.captureDismiss,
            [Classes.POPOVER_MATCH_TARGET_WIDTH]: props.matchTargetWidth,
            [Classes.POPOVER_REFERENCE_HIDDEN]: props.isReferenceHidden === true,
            [Classes.POPOVER_POPPER_ESCAPED]: props.hasPopperEscaped === true,
        },
        `${Classes.POPOVER_CONTENT_PLACEMENT}-${basePlacement}`,
        props.popoverClassName,
    );

    const defaultAutoFocus = isHoverInteraction(props.interactionKind) ? false : undefined;
    // if hover interaction, it doesn't make sense to take over focus control
    const shouldReturnFocusOnClose = isHoverInteraction(props.interactionKind)
        ? false
        : props.isClosingViaEscapeKeypress
          ? true
          : props.shouldReturnFocusOnClose;

    const popoverElement = (
        <div className={popoverClasses} style={{ transformOrigin }} ref={props.popoverRef} {...popoverHandlers}>
            {props.arrowElement}
            <div className={Classes.POPOVER_CONTENT}>{props.content}</div>
        </div>
    );

    return (
        <Overlay2
            autoFocus={autoFocus ?? defaultAutoFocus}
            backdropClassName={Classes.POPOVER_BACKDROP}
            backdropProps={backdropProps}
            canEscapeKeyClose={canEscapeKeyClose}
            canOutsideClickClose={props.interactionKind === PopoverInteractionKind.CLICK}
            childRef={props.containerRef}
            enforceFocus={enforceFocus}
            hasBackdrop={hasBackdrop}
            isOpen={props.isOpen}
            lazy={props.lazy}
            onClose={props.onClose}
            onClosed={props.onClosed}
            onClosing={props.onClosing}
            onOpened={props.onOpened}
            onOpening={props.onOpening}
            transitionDuration={props.transitionDuration}
            transitionName={Classes.POPOVER}
            usePortal={usePortal}
            portalClassName={props.portalClassName}
            portalContainer={props.portalContainer}
            // eslint-disable-next-line deprecation/deprecation
            portalStopPropagationEvents={props.portalStopPropagationEvents}
            shouldReturnFocusOnClose={shouldReturnFocusOnClose}
        >
            <div
                className={Classes.POPOVER_TRANSITION_CONTAINER}
                // We need to attach a ref that notifies both react-popper and our Popover component about the DOM
                // element inside the Overlay2. We cannot re-use `PopperChildrenProps.ref` because Overlay2 only
                // accepts a ref object (not a callback) due to a CSSTransition API limitation.
                // N.B. react-popper has a wide type for this ref, but we can narrow it based on the source,
                // see https://github.com/floating-ui/react-popper/blob/beac280d61082852c4efc302be902911ce2d424c/src/Popper.js#L94
                ref={mergeRefs(ref as React.RefCallback<HTMLElement>, props.containerRef)}
                style={props.style}
            >
                {/* only wrap the contents in a Resize sensor if we have a reposition handler */}
                {props.onResize == null ? (
                    popoverElement
                ) : (
                    <ResizeSensor onResize={props.onResize}>{popoverElement}</ResizeSensor>
                )}
            </div>
        </Overlay2>
    );
});
PopoverOverlay.displayName = `${DISPLAYNAME_PREFIX}.PopoverOverlay`;
