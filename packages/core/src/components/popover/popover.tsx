/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import { ModifierFn } from "popper.js";
import * as React from "react";
import { Manager, Popper, PopperChildrenProps, Reference, ReferenceChildrenProps } from "react-popper";

import { AbstractPureComponent } from "../../common/abstractPureComponent";
import * as Classes from "../../common/classes";
import * as Errors from "../../common/errors";
import { DISPLAYNAME_PREFIX, HTMLDivProps } from "../../common/props";
import * as Utils from "../../common/utils";
import { Overlay } from "../overlay/overlay";
import { ResizeSensor } from "../resize-sensor/resizeSensor";
import { Tooltip } from "../tooltip/tooltip";
import { PopoverArrow } from "./popoverArrow";
import { positionToPlacement } from "./popoverMigrationUtils";
import { IPopoverSharedProps, PopperModifiers } from "./popoverSharedProps";
import { arrowOffsetModifier, getTransformOrigin } from "./popperUtils";

export const PopoverInteractionKind = {
    CLICK: "click" as "click",
    CLICK_TARGET_ONLY: "click-target" as "click-target",
    HOVER: "hover" as "hover",
    HOVER_TARGET_ONLY: "hover-target" as "hover-target",
};
export type PopoverInteractionKind = typeof PopoverInteractionKind[keyof typeof PopoverInteractionKind];

export interface IPopoverProps extends IPopoverSharedProps {
    /** HTML props for the backdrop element. Can be combined with `backdropClassName`. */
    backdropProps?: React.HTMLProps<HTMLDivElement>;

    /**
     * The content displayed inside the popover. This can instead be provided as
     * the _second_ element in `children` (first is `target`).
     */
    content?: string | JSX.Element;

    /**
     * The kind of interaction that triggers the display of the popover.
     * @default PopoverInteractionKind.CLICK
     */
    interactionKind?: PopoverInteractionKind;

    /**
     * Enables an invisible overlay beneath the popover that captures clicks and
     * prevents interaction with the rest of the document until the popover is
     * closed. This prop is only available when `interactionKind` is
     * `PopoverInteractionKind.CLICK`. When popovers with backdrop are opened,
     * they become focused.
     * @default false
     */
    hasBackdrop?: boolean;

    /**
     * Whether to apply minimal styles to this popover, which includes removing
     * the arrow and adding `Classes.MINIMAL` to minimize and accelerate the
     * transitions.
     * @default false
     */
    minimal?: boolean;

    /**
     * Ref supplied to the `Classes.POPOVER` element.
     */
    popoverRef?: (ref: HTMLDivElement | null) => void;

    /**
     * The target to which the popover content is attached. This can instead be
     * provided as the _first_ element in `children`.
     */
    target?: string | JSX.Element;
}

export interface IPopoverState {
    transformOrigin: string;
    isOpen: boolean;
    hasDarkParent: boolean;
}

export class Popover extends AbstractPureComponent<IPopoverProps, IPopoverState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Popover`;

    public static defaultProps: IPopoverProps = {
        captureDismiss: false,
        defaultIsOpen: false,
        disabled: false,
        hasBackdrop: false,
        hoverCloseDelay: 300,
        hoverOpenDelay: 150,
        inheritDarkTheme: true,
        interactionKind: PopoverInteractionKind.CLICK,
        minimal: false,
        modifiers: {},
        openOnTargetFocus: true,
        position: "auto",
        targetTagName: "span",
        transitionDuration: 300,
        usePortal: true,
        wrapperTagName: "span",
    };

    /**
     * DOM element that contains the popover.
     * When `usePortal={true}`, this element will be portaled outside the usual DOM flow,
     * so this reference can be very useful for testing.
     */
    public popoverElement: HTMLElement;
    /** DOM element that contains the target. */
    public targetElement: HTMLElement;

    public state: IPopoverState = {
        hasDarkParent: false,
        isOpen: this.getIsOpen(this.props),
        transformOrigin: "",
    };

    private cancelOpenTimeout: () => void;

    // a flag that lets us detect mouse movement between the target and popover,
    // now that mouseleave is triggered when you cross the gap between the two.
    private isMouseInTargetOrPopover = false;

    // a flag that indicates whether the target previously lost focus to another
    // element on the same page.
    private lostFocusOnSamePage = true;

    // Reference to the Poppper.scheduleUpdate() function, this changes every time the popper is mounted
    private popperScheduleUpdate: () => void;

    private refHandlers = {
        popover: (ref: HTMLElement) => {
            this.popoverElement = ref;
            Utils.safeInvoke(this.props.popoverRef, ref);
        },
        target: (ref: HTMLElement) => (this.targetElement = ref),
    };

    public render() {
        // rename wrapper tag to begin with uppercase letter so it's recognized
        // as JSX component instead of intrinsic element. but because of its
        // type, tsc actually recognizes that it is _any_ intrinsic element, so
        // it can typecheck the HTML props!!
        const { className, disabled, modifiers, wrapperTagName: WrapperTagName } = this.props;
        const { isOpen } = this.state;

        const isContentEmpty = Utils.ensureElement(this.understandChildren().content) == null;
        // need to do this check in render(), because `isOpen` is derived from
        // state, and state can't necessarily be accessed in validateProps.
        if (isContentEmpty && !disabled && isOpen !== false && !Utils.isNodeEnv("production")) {
            console.warn(Errors.POPOVER_WARN_EMPTY_CONTENT);
        }
        const allModifiers: PopperModifiers = {
            ...modifiers,
            arrowOffset: {
                enabled: this.isArrowEnabled(),
                fn: arrowOffsetModifier,
                order: 510, // arrow is 500
            },
            updatePopoverState: {
                enabled: true,
                fn: this.updatePopoverState,
                order: 900,
            },
        };

        return (
            <Manager>
                <WrapperTagName className={classNames(Classes.POPOVER_WRAPPER, className)}>
                    <Reference innerRef={this.refHandlers.target}>{this.renderTarget}</Reference>
                    <Overlay
                        autoFocus={this.props.autoFocus}
                        backdropClassName={Classes.POPOVER_BACKDROP}
                        backdropProps={this.props.backdropProps}
                        canEscapeKeyClose={this.props.canEscapeKeyClose}
                        canOutsideClickClose={this.props.interactionKind === PopoverInteractionKind.CLICK}
                        className={this.props.portalClassName}
                        enforceFocus={this.props.enforceFocus}
                        hasBackdrop={this.props.hasBackdrop}
                        isOpen={isOpen && !isContentEmpty}
                        onClose={this.handleOverlayClose}
                        onClosed={this.props.onClosed}
                        onClosing={this.props.onClosing}
                        onOpened={this.props.onOpened}
                        onOpening={this.props.onOpening}
                        transitionDuration={this.props.transitionDuration}
                        transitionName={Classes.POPOVER}
                        usePortal={this.props.usePortal}
                    >
                        <Popper
                            innerRef={this.refHandlers.popover}
                            placement={positionToPlacement(this.props.position)}
                            modifiers={allModifiers}
                        >
                            {this.renderPopover}
                        </Popper>
                    </Overlay>
                </WrapperTagName>
            </Manager>
        );
    }

    public componentDidMount() {
        this.updateDarkParent();
    }

    public componentWillReceiveProps(nextProps: IPopoverProps) {
        super.componentWillReceiveProps(nextProps);

        const nextIsOpen = this.getIsOpen(nextProps);

        if (nextProps.isOpen != null && nextIsOpen !== this.state.isOpen) {
            this.setOpenState(nextIsOpen);
            // tricky: setOpenState calls setState only if this.props.isOpen is
            // not controlled, so we need to invoke setState manually here.
            this.setState({ isOpen: nextIsOpen });
        } else if (this.state.isOpen && nextProps.isOpen == null && nextProps.disabled) {
            // special case: close an uncontrolled popover when disabled is set to true
            this.setOpenState(false);
        }
    }

    public componentDidUpdate() {
        this.updateDarkParent();
    }

    protected validateProps(props: IPopoverProps & { children?: React.ReactNode }) {
        if (props.isOpen == null && props.onInteraction != null) {
            console.warn(Errors.POPOVER_WARN_UNCONTROLLED_ONINTERACTION);
        }
        if (props.hasBackdrop && !props.usePortal) {
            console.warn(Errors.POPOVER_WARN_HAS_BACKDROP_INLINE);
        }
        if (props.hasBackdrop && props.interactionKind !== PopoverInteractionKind.CLICK) {
            throw new Error(Errors.POPOVER_HAS_BACKDROP_INTERACTION);
        }

        const childrenCount = React.Children.count(props.children);
        const hasContentProp = props.content !== undefined;
        const hasTargetProp = props.target !== undefined;

        if (childrenCount === 0 && !hasTargetProp) {
            throw new Error(Errors.POPOVER_REQUIRES_TARGET);
        }
        if (childrenCount > 2) {
            console.warn(Errors.POPOVER_WARN_TOO_MANY_CHILDREN);
        }
        if (childrenCount > 0 && hasTargetProp) {
            console.warn(Errors.POPOVER_WARN_DOUBLE_TARGET);
        }
        if (childrenCount === 2 && hasContentProp) {
            console.warn(Errors.POPOVER_WARN_DOUBLE_CONTENT);
        }
    }

    private updateDarkParent() {
        if (this.props.usePortal && this.state.isOpen) {
            const hasDarkParent = this.targetElement != null && this.targetElement.closest(`.${Classes.DARK}`) != null;
            this.setState({ hasDarkParent });
        }
    }

    private renderPopover = (popperProps: PopperChildrenProps) => {
        const { usePortal, interactionKind } = this.props;
        const { transformOrigin } = this.state;

        // Need to update our reference to this on every render as it will change.
        this.popperScheduleUpdate = popperProps.scheduleUpdate;

        const popoverHandlers: HTMLDivProps = {
            // always check popover clicks for dismiss class
            onClick: this.handlePopoverClick,
        };
        if (
            interactionKind === PopoverInteractionKind.HOVER ||
            (!usePortal && interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY)
        ) {
            popoverHandlers.onMouseEnter = this.handleMouseEnter;
            popoverHandlers.onMouseLeave = this.handleMouseLeave;
        }

        const popoverClasses = classNames(
            Classes.POPOVER,
            {
                [Classes.DARK]: this.props.inheritDarkTheme && this.state.hasDarkParent,
                [Classes.MINIMAL]: this.props.minimal,
            },
            this.props.popoverClassName,
        );

        return (
            <div className={Classes.TRANSITION_CONTAINER} ref={popperProps.ref} style={popperProps.style}>
                <ResizeSensor onResize={this.handlePopoverResize}>
                    <div className={popoverClasses} style={{ transformOrigin }} {...popoverHandlers}>
                        {this.isArrowEnabled() && (
                            <PopoverArrow arrowProps={popperProps.arrowProps} placement={popperProps.placement} />
                        )}
                        <div className={Classes.POPOVER_CONTENT}>{this.understandChildren().content}</div>
                    </div>
                </ResizeSensor>
            </div>
        );
    };

    private renderTarget = (referenceProps: ReferenceChildrenProps) => {
        const { targetClassName, targetTagName: TagName } = this.props;
        const { isOpen } = this.state;
        const isHoverInteractionKind = this.isHoverInteractionKind();

        const targetProps: React.HTMLProps<HTMLElement> = isHoverInteractionKind
            ? {
                  // HOVER handlers
                  onBlur: this.handleTargetBlur,
                  onFocus: this.handleTargetFocus,
                  onMouseEnter: this.handleMouseEnter,
                  onMouseLeave: this.handleMouseLeave,
              }
            : {
                  // CLICK needs only one handler
                  onClick: this.handleTargetClick,
              };
        targetProps.className = classNames(Classes.POPOVER_TARGET, { [Classes.POPOVER_OPEN]: isOpen }, targetClassName);
        targetProps.ref = referenceProps.ref;

        const rawTarget = Utils.ensureElement(this.understandChildren().target);
        const { tabIndex = 0 } = rawTarget.props;
        const clonedTarget: JSX.Element = React.cloneElement(rawTarget, {
            className: classNames(rawTarget.props.className, {
                [Classes.ACTIVE]: isOpen && !isHoverInteractionKind,
            }),
            // force disable single Tooltip child when popover is open (BLUEPRINT-552)
            disabled: isOpen && Utils.isElementOfType(rawTarget, Tooltip) ? true : rawTarget.props.disabled,
            tabIndex: this.props.openOnTargetFocus && isHoverInteractionKind ? tabIndex : undefined,
        });
        return (
            <ResizeSensor onResize={this.handlePopoverResize}>
                <TagName {...targetProps}>{clonedTarget}</TagName>
            </ResizeSensor>
        );
    };

    // content and target can be specified as props or as children. this method
    // normalizes the two approaches, preferring child over prop.
    private understandChildren() {
        const { children, content: contentProp, target: targetProp } = this.props;
        // #validateProps asserts that 1 <= children.length <= 2 so content is optional
        const [targetChild, contentChild] = React.Children.toArray(children);
        return {
            content: contentChild == null ? contentProp : contentChild,
            target: targetChild == null ? targetProp : targetChild,
        };
    }

    private getIsOpen(props: IPopoverProps) {
        // disabled popovers should never be allowed to open.
        if (props.disabled) {
            return false;
        } else if (props.isOpen != null) {
            return props.isOpen;
        } else {
            return props.defaultIsOpen;
        }
    }

    private handleTargetFocus = (e: React.FocusEvent<HTMLElement>) => {
        if (this.props.openOnTargetFocus && this.isHoverInteractionKind()) {
            if (e.relatedTarget == null && !this.lostFocusOnSamePage) {
                // ignore this focus event -- the target was already focused but the page itself
                // lost focus (e.g. due to switching tabs).
                return;
            }
            this.handleMouseEnter(e);
        }
    };

    private handleTargetBlur = (e: React.FocusEvent<HTMLElement>) => {
        if (this.props.openOnTargetFocus && this.isHoverInteractionKind()) {
            // if the next element to receive focus is within the popover, we'll want to leave the
            // popover open.
            if (!this.isElementInPopover(e.relatedTarget as HTMLElement)) {
                this.handleMouseLeave(e);
            }
        }
        this.lostFocusOnSamePage = e.relatedTarget != null;
    };

    private handleMouseEnter = (e: React.SyntheticEvent<HTMLElement>) => {
        this.isMouseInTargetOrPopover = true;

        // if we're entering the popover, and the mode is set to be HOVER_TARGET_ONLY, we want to manually
        // trigger the mouse leave event, as hovering over the popover shouldn't count.
        if (
            !this.props.usePortal &&
            this.isElementInPopover(e.target as Element) &&
            this.props.interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY &&
            !this.props.openOnTargetFocus
        ) {
            this.handleMouseLeave(e);
        } else if (!this.props.disabled) {
            // only begin opening popover when it is enabled
            this.setOpenState(true, e, this.props.hoverOpenDelay);
        }
    };

    private handleMouseLeave = (e: React.SyntheticEvent<HTMLElement>) => {
        this.isMouseInTargetOrPopover = false;

        // wait until the event queue is flushed, because we want to leave the
        // popover open if the mouse entered the popover immediately after
        // leaving the target (or vice versa).
        this.setTimeout(() => {
            if (this.isMouseInTargetOrPopover) {
                return;
            }
            // user-configurable closing delay is helpful when moving mouse from target to popover
            this.setOpenState(false, e, this.props.hoverCloseDelay);
        });
    };

    private handlePopoverClick = (e: React.MouseEvent<HTMLElement>) => {
        const eventTarget = e.target as HTMLElement;
        // an OVERRIDE inside a DISMISS does not dismiss, and a DISMISS inside an OVERRIDE will dismiss.
        const dismissElement = eventTarget.closest(`.${Classes.POPOVER_DISMISS}, .${Classes.POPOVER_DISMISS_OVERRIDE}`);
        const shouldDismiss = dismissElement != null && dismissElement.classList.contains(Classes.POPOVER_DISMISS);
        const isDisabled = eventTarget.closest(`:disabled, .${Classes.DISABLED}`) != null;
        if (shouldDismiss && !isDisabled && !e.isDefaultPrevented()) {
            this.setOpenState(false, e);
            if (this.props.captureDismiss) {
                e.preventDefault();
            }
        }
    };

    private handlePopoverResize = () => Utils.safeInvoke(this.popperScheduleUpdate);

    private handleOverlayClose = (e: React.SyntheticEvent<HTMLElement>) => {
        const eventTarget = e.target as HTMLElement;
        // if click was in target, target event listener will handle things, so don't close
        if (!Utils.elementIsOrContains(this.targetElement, eventTarget) || e.nativeEvent instanceof KeyboardEvent) {
            this.setOpenState(false, e);
        }
    };

    private handleTargetClick = (e: React.MouseEvent<HTMLElement>) => {
        // ensure click did not originate from within inline popover before closing
        if (!this.props.disabled && !this.isElementInPopover(e.target as HTMLElement)) {
            if (this.props.isOpen == null) {
                this.setState(prevState => ({ isOpen: !prevState.isOpen }));
            } else {
                this.setOpenState(!this.props.isOpen, e);
            }
        }
    };

    // a wrapper around setState({isOpen}) that will call props.onInteraction instead when in controlled mode.
    // starts a timeout to delay changing the state if a non-zero duration is provided.
    private setOpenState(isOpen: boolean, e?: React.SyntheticEvent<HTMLElement>, timeout?: number) {
        // cancel any existing timeout because we have new state
        Utils.safeInvoke(this.cancelOpenTimeout);
        if (timeout > 0) {
            this.cancelOpenTimeout = this.setTimeout(() => this.setOpenState(isOpen, e), timeout);
        } else {
            if (this.props.isOpen == null) {
                this.setState({ isOpen });
            } else {
                Utils.safeInvoke(this.props.onInteraction, isOpen, e);
            }
            if (!isOpen) {
                Utils.safeInvoke(this.props.onClose, e);
            }
        }
    }

    private isArrowEnabled() {
        const { minimal, modifiers: { arrow } } = this.props;
        // omitting `arrow` from `modifiers` uses Popper default, which does show an arrow.
        return !minimal && (arrow == null || arrow.enabled);
    }

    private isElementInPopover(element: Element) {
        return this.popoverElement != null && this.popoverElement.contains(element);
    }

    private isHoverInteractionKind() {
        return (
            this.props.interactionKind === PopoverInteractionKind.HOVER ||
            this.props.interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY
        );
    }

    /** Popper modifier that updates React state (for style properties) based on latest data. */
    private updatePopoverState: ModifierFn = data => {
        // always set string; let shouldComponentUpdate determine if update is necessary
        this.setState({ transformOrigin: getTransformOrigin(data) });
        return data;
    };
}
