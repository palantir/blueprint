/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import classNames from "classnames";
import { Children, cloneElement, createElement, forwardRef, useCallback } from "react";

import { Classes, DISPLAYNAME_PREFIX, mergeRefs, Utils } from "../../common";
import { PopoverInteractionKind } from "../popover/popoverProps";
import type { PopoverClickTargetHandlers, PopoverHoverTargetHandlers } from "../popover/popoverSharedProps";

import type { PopoverTargetProps } from "./popoverNextProps";

export const PopoverTarget = forwardRef<HTMLElement, PopoverTargetProps>((props, targetRef) => {
    const {
        children,
        className,
        floatingData,
        disabled = false,
        fill = false,
        handleMouseEnter,
        handleMouseLeave,
        handleTargetBlur,
        handleTargetContextMenu,
        handleTargetFocus,
        interactionKind,
        isContentEmpty,
        isControlled,
        isHoverInteractionKind,
        openOnTargetFocus = true,
        popupKind,
        renderTarget = undefined,
        targetProps,
        targetTagName = "span",
    } = props;

    const tagName = fill ? "div" : targetTagName;
    const { isOpen } = floatingData;

    const ref = mergeRefs(floatingData.refs.setReference, targetRef);

    // Custom keyboard click handler for the reference element. Floating UI's useClick hook
    // has its keyboardHandlers disabled because it calls `preventDefault()` on Space keydown,
    // which prevents space characters from being typed in <input>/<textarea> target children.
    // This handler replicates keyboard-to-click behavior while preserving typeable element input.
    const handleReferenceKeyDown = useCallback((event: React.KeyboardEvent<HTMLElement>) => {
        if (!Utils.isKeyboardClick(event) || event.repeat) {
            return;
        }

        const eventTarget = event.target as HTMLElement;

        // Don't intercept keyboard events on typeable elements — let them handle
        // Space (character input) and Enter (form submission) normally
        if (isTypeableElement(eventTarget)) {
            return;
        }

        if (event.key === " ") {
            // Buttons handle Space natively (fire click on keyup), skip to avoid double-toggle
            if (eventTarget.closest("button") != null) {
                return;
            }
            // Prevent page scroll for non-typeable, non-button targets
            event.preventDefault();
        } else if (event.key === "Enter") {
            // Buttons and anchors fire native click on Enter, skip to avoid double-toggle
            if (eventTarget.closest("button, a") != null) {
                return;
            }
        }

        // For non-typeable, non-natively-clickable targets (e.g. <span>, <div>),
        // simulate a click so that useClick's onClick handler toggles the popover
        event.currentTarget.click();
    }, []);

    const targetEventHandlers: PopoverHoverTargetHandlers | PopoverClickTargetHandlers = isHoverInteractionKind
        ? {
              onBlur: handleTargetBlur,
              onContextMenu: handleTargetContextMenu,
              onFocus: handleTargetFocus,
              onMouseEnter: handleMouseEnter,
              onMouseLeave: handleMouseLeave,
          }
        : {};

    // Ensure target is focusable if relevant prop enabled
    const targetTabIndex = !isContentEmpty && !disabled && openOnTargetFocus && isHoverInteractionKind ? 0 : undefined;

    const ownTargetProps = {
        // N.B. this.props.className is passed along to renderTarget even though the user would have access to it.
        // If, instead, renderTarget is undefined and the target is provided as a child, props.className is
        // applied to the generated target wrapper element.
        className: classNames(className, Classes.POPOVER_TARGET, {
            [Classes.POPOVER_OPEN]: isOpen,
            // this class is mainly useful for button targets
            [Classes.ACTIVE]: isOpen && !isControlled && !isHoverInteractionKind,
            [Classes.FILL]: fill,
        }),
        ref,
        ...targetEventHandlers,
    } satisfies React.HTMLProps<HTMLElement>;
    const childTargetProps = {
        "aria-expanded": isHoverInteractionKind ? undefined : isOpen,
        "aria-haspopup":
            interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY ? undefined : (popupKind ?? "menu"),
    } satisfies React.HTMLProps<HTMLElement>;

    const targetModifierClasses = {
        // this class is mainly useful for Blueprint <Button> targets; we should only apply it for
        // uncontrolled popovers when they are opened by a user interaction
        [Classes.ACTIVE]: isOpen && !isControlled && !isHoverInteractionKind,
        // similarly, this class is mainly useful for targets like <Button>, <InputGroup>, etc.
        [Classes.FILL]: fill,
    };

    let target: React.JSX.Element | undefined;

    if (renderTarget !== undefined) {
        const floatingProps = floatingData.getReferenceProps({
            onKeyDown: handleReferenceKeyDown,
        });

        // When using renderTarget, if the consumer renders a tooltip target, it's their responsibility
        // to disable that tooltip when this popover is open
        target = renderTarget({
            ...ownTargetProps,
            ...childTargetProps,
            // Apply Floating UI's interaction props for renderTarget case
            ...floatingProps,
            className: classNames(ownTargetProps.className, targetModifierClasses),
            isOpen,
            tabIndex: targetTabIndex,
        });
    } else {
        const childTarget = Utils.ensureElement(Children.toArray(children)[0]);

        if (childTarget === undefined) {
            return null;
        }

        const clonedTarget = cloneElement(childTarget, {
            ...childTargetProps,
            className: classNames(childTarget.props.className, targetModifierClasses),
            disabled: (isOpen && isTooltipElement(childTarget)) || childTarget.props.disabled,
            tabIndex: childTarget.props.tabIndex ?? targetTabIndex,
        });
        const wrappedTarget = createElement(
            tagName,
            {
                ...ownTargetProps,
                ...targetProps,
                // Apply Floating UI's interaction props to the wrapper element (same element that has the ref)
                ...floatingData.getReferenceProps({
                    onKeyDown: handleReferenceKeyDown,
                }),
            },
            clonedTarget,
        );
        target = wrappedTarget;
    }

    return target;
});

PopoverTarget.displayName = `${DISPLAYNAME_PREFIX}.PopoverTarget`;

/**
 * Check if a React element is a Tooltip component by comparing its displayName.
 * This avoids importing the Tooltip component directly, which would create a dependency cycle.
 */
function isTooltipElement(element: React.ReactElement): boolean {
    return (
        element?.type != null &&
        typeof element.type !== "string" &&
        typeof element.type === "function" &&
        "displayName" in element.type &&
        element.type.displayName === `${DISPLAYNAME_PREFIX}.Tooltip`
    );
}

/**
 * Check if an element accepts keyboard text input (i.e., Space should insert a character,
 * not be interpreted as a click).
 */
function isTypeableElement(element: HTMLElement): boolean {
    const tagName = element.tagName;
    return tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT" || element.isContentEditable;
}
