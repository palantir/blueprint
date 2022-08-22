/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import classNames from "classnames";
import { ModifierFn } from "popper.js";
import * as React from "react";
import { Manager, Popper, PopperChildrenProps, Reference, ReferenceChildrenProps } from "react-popper";

import { AbstractPureComponent2, Classes, refHandler, setRef } from "../../common";
import * as Errors from "../../common/errors";
import { DISPLAYNAME_PREFIX, HTMLDivProps } from "../../common/props";
import * as Utils from "../../common/utils";
import { Overlay } from "../overlay/overlay";
import { ResizeSensor } from "../resize-sensor/resizeSensor";
// eslint-disable-next-line import/no-cycle
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
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PopoverInteractionKind = typeof PopoverInteractionKind[keyof typeof PopoverInteractionKind];

/** @deprecated migrate to Popover2, use Popover2Props */
export interface IPopoverProps extends IPopoverSharedProps {
    /** HTML props for the backdrop element. Can be combined with `backdropClassName`. */
    backdropProps?: React.HTMLProps<HTMLDivElement>;

    /**
     * The content displayed inside the popover. This can instead be provided as
     * the _second_ element in `children` (first is `target`).
     */
    content?: string | JSX.Element;

    /**
     * Whether the wrapper and target should take up the full width of their container.
     * Note that supplying `true` for this prop will force  `targetTagName="div"` and
     * `wrapperTagName="div"`.
     */
    fill?: boolean;

    /**
     * The kind of interaction that triggers the display of the popover.
     *
     * @default PopoverInteractionKind.CLICK
     */
    interactionKind?: PopoverInteractionKind;

    /**
     * Enables an invisible overlay beneath the popover that captures clicks and
     * prevents interaction with the rest of the document until the popover is
     * closed. This prop is only available when `interactionKind` is
     * `PopoverInteractionKind.CLICK`. When popovers with backdrop are opened,
     * they become focused.
     *
     * @default false
     */
    hasBackdrop?: boolean;

    /**
     * Whether the application should return focus to the last active element in the
     * document after this popover closes.
     *
     * This is automatically set to `false` if this is a hover interaction popover.
     *
     * If you are attaching a popover _and_ a tooltip to the same target, you must take
     * care to either disable this prop for the popover _or_ disable the tooltip's
     * `openOnTargetFocus` prop.
     *
     * @default false
     */
    shouldReturnFocusOnClose?: boolean;

    /**
     * Ref supplied to the `Classes.POPOVER` element.
     */
    popoverRef?: React.Ref<HTMLElement>;

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

/** @deprecated use { Popover2 } from "@blueprintjs/popover2" */
// eslint-disable-next-line deprecation/deprecation
export class Popover extends AbstractPureComponent2<IPopoverProps, IPopoverState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Popover`;

    private popoverRef = React.createRef<HTMLDivElement>();

    // eslint-disable-next-line deprecation/deprecation
    public static defaultProps: IPopoverProps = {
        boundary: "scrollParent",
        captureDismiss: false,
        defaultIsOpen: false,
        disabled: false,
        fill: false,
        hasBackdrop: false,
        hoverCloseDelay: 300,
        hoverOpenDelay: 150,
        inheritDarkTheme: true,
        interactionKind: PopoverInteractionKind.CLICK,
        minimal: false,
        modifiers: {},
        openOnTargetFocus: true,
        shouldReturnFocusOnClose: false,
        // N.B. we don't set a default for `placement` or `position` here because that would trigger
        // a warning in validateProps if the other prop is specified by a user of this component
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
    public popoverElement: HTMLElement | null = null;

    /** DOM element that contains the target. */
    public targetElement: HTMLElement | null = null;

    public state: IPopoverState = {
        hasDarkParent: false,
        isOpen: this.getIsOpen(this.props),
        transformOrigin: "",
    };

    private cancelOpenTimeout?: () => void;

    // a flag that lets us detect mouse movement between the target and popover,
    // now that mouseleave is triggered when you cross the gap between the two.
    private isMouseInTargetOrPopover = false;

    // a flag that indicates whether the target previously lost focus to another
    // element on the same page.
    private lostFocusOnSamePage = true;

    // Reference to the Poppper.scheduleUpdate() function, this changes every time the popper is mounted
    private popperScheduleUpdate?: () => void;

    private handlePopoverRef: React.Ref<HTMLElement> = refHandler(this, "popoverElement", this.props.popoverRef);

    private handleTargetRef = (ref: HTMLElement | null) => (this.targetElement = ref);

    public render() {
        // rename wrapper tag to begin with uppercase letter so it's recognized
        // as JSX component instead of intrinsic element. but because of its
        // type, tsc actually recognizes that it is _any_ intrinsic element, so
        // it can typecheck the HTML props!!
        const { className, disabled, fill, placement, position = "auto", shouldReturnFocusOnClose } = this.props;
        const { isOpen } = this.state;
        let { wrapperTagName } = this.props;
        if (fill) {
            wrapperTagName = "div";
        }

        const isContentEmpty = Utils.ensureElement(this.understandChildren().content) == null;
        // need to do this check in render(), because `isOpen` is derived from
        // state, and state can't necessarily be accessed in validateProps.
        if (isContentEmpty && !disabled && isOpen !== false && !Utils.isNodeEnv("production")) {
            console.warn(Errors.POPOVER_WARN_EMPTY_CONTENT);
        }

        const wrapperClasses = classNames(Classes.POPOVER_WRAPPER, className, {
            [Classes.FILL]: fill,
        });

        const defaultAutoFocus = this.isHoverInteractionKind() ? false : undefined;

        const wrapper = React.createElement(
            wrapperTagName!,
            { className: wrapperClasses },
            <Reference innerRef={this.handleTargetRef}>{this.renderTarget}</Reference>,
            <Overlay
                autoFocus={this.props.autoFocus ?? defaultAutoFocus}
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
                portalContainer={this.props.portalContainer}
                // if hover interaciton, it doesn't make sense to take over focus control
                shouldReturnFocusOnClose={this.isHoverInteractionKind() ? false : shouldReturnFocusOnClose}
            >
                <Popper
                    innerRef={this.handlePopoverRef}
                    placement={placement ?? positionToPlacement(position)}
                    modifiers={this.getPopperModifiers()}
                >
                    {this.renderPopover}
                </Popper>
            </Overlay>,
        );

        return <Manager>{wrapper}</Manager>;
    }

    public componentDidMount() {
        this.updateDarkParent();
    }

    // eslint-disable-next-line deprecation/deprecation
    public componentDidUpdate(prevProps: IPopoverProps, prevState: IPopoverState) {
        super.componentDidUpdate(prevProps, prevState);

        if (prevProps.popoverRef !== this.props.popoverRef) {
            setRef(prevProps.popoverRef, null);
            this.handlePopoverRef = refHandler(this, "popoverElement", this.props.popoverRef);
            setRef(this.props.popoverRef, this.popoverElement);
        }

        this.updateDarkParent();

        const nextIsOpen = this.getIsOpen(this.props);

        if (this.props.isOpen != null && nextIsOpen !== this.state.isOpen) {
            this.setOpenState(nextIsOpen);
            // tricky: setOpenState calls setState only if this.props.isOpen is
            // not controlled, so we need to invoke setState manually here.
            this.setState({ isOpen: nextIsOpen });
        } else if (this.props.disabled && this.state.isOpen && this.props.isOpen == null) {
            // special case: close an uncontrolled popover when disabled is set to true
            this.setOpenState(false);
        }
    }

    /**
     * Instance method to instruct the `Popover` to recompute its position.
     *
     * This method should only be used if you are updating the target in a way
     * that does not cause it to re-render, such as changing its _position_
     * without changing its _size_ (since `Popover` already repositions when it
     * detects a resize).
     */
    public reposition = () => this.popperScheduleUpdate?.();

    // eslint-disable-next-line deprecation/deprecation
    protected validateProps(props: IPopoverProps & { children?: React.ReactNode }) {
        if (props.isOpen == null && props.onInteraction != null) {
            console.warn(Errors.POPOVER_WARN_UNCONTROLLED_ONINTERACTION);
        }
        if (props.hasBackdrop && !props.usePortal) {
            console.warn(Errors.POPOVER_WARN_HAS_BACKDROP_INLINE);
        }
        if (props.hasBackdrop && props.interactionKind !== PopoverInteractionKind.CLICK) {
            console.error(Errors.POPOVER_HAS_BACKDROP_INTERACTION);
        }
        if (props.placement !== undefined && props.position !== undefined) {
            console.warn(Errors.POPOVER_WARN_PLACEMENT_AND_POSITION_MUTEX);
        }

        const childrenCount = React.Children.count(props.children);
        const hasContentProp = props.content !== undefined;
        const hasTargetProp = props.target !== undefined;

        if (childrenCount === 0 && !hasTargetProp) {
            console.error(Errors.POPOVER_REQUIRES_TARGET);
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
        const { interactionKind, usePortal } = this.props;
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
                [Classes.POPOVER_CAPTURING_DISMISS]: this.props.captureDismiss,
                [Classes.POPOVER_OUT_OF_BOUNDARIES]: popperProps.outOfBoundaries === true,
            },
            this.props.popoverClassName,
        );

        return (
            <div className={Classes.TRANSITION_CONTAINER} ref={popperProps.ref} style={popperProps.style}>
                <ResizeSensor onResize={this.reposition}>
                    <div
                        className={popoverClasses}
                        style={{ transformOrigin }}
                        ref={this.popoverRef}
                        {...popoverHandlers}
                    >
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
        const { fill, openOnTargetFocus, targetClassName, targetProps = {} } = this.props;
        const { isOpen } = this.state;
        const isControlled = this.isControlled();
        const isHoverInteractionKind = this.isHoverInteractionKind();
        let { targetTagName } = this.props;
        if (fill) {
            targetTagName = "div";
        }

        const finalTargetProps: React.HTMLProps<HTMLElement> = isHoverInteractionKind
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
        finalTargetProps["aria-haspopup"] = "true";
        finalTargetProps.className = classNames(
            Classes.POPOVER_TARGET,
            { [Classes.POPOVER_OPEN]: isOpen },
            targetProps.className,
            targetClassName,
        );
        finalTargetProps.ref = referenceProps.ref;

        const rawTarget = Utils.ensureElement(this.understandChildren().target);

        if (rawTarget === undefined) {
            return null;
        }

        const rawTabIndex = rawTarget.props.tabIndex;
        // ensure target is focusable if relevant prop enabled
        const tabIndex = rawTabIndex == null && openOnTargetFocus && isHoverInteractionKind ? 0 : rawTabIndex;
        const clonedTarget: JSX.Element = React.cloneElement(rawTarget, {
            className: classNames(rawTarget.props.className, {
                // this class is mainly useful for button targets; we should only apply it for uncontrolled popovers
                // when they are opened by a user interaction
                [Classes.ACTIVE]: isOpen && !isControlled && !isHoverInteractionKind,
            }),
            // force disable single Tooltip child when popover is open (BLUEPRINT-552)
            /* eslint-disable-next-line deprecation/deprecation */
            disabled: isOpen && Utils.isElementOfType(rawTarget, Tooltip) ? true : rawTarget.props.disabled,
            tabIndex,
        });
        const target = React.createElement(
            targetTagName!,
            {
                ...targetProps,
                ...finalTargetProps,
            },
            clonedTarget,
        );

        return <ResizeSensor onResize={this.reposition}>{target}</ResizeSensor>;
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

    private isControlled = () => this.props.isOpen !== undefined;

    // eslint-disable-next-line deprecation/deprecation
    private getIsOpen(props: IPopoverProps) {
        // disabled popovers should never be allowed to open.
        if (props.disabled) {
            return false;
        } else if (props.isOpen != null) {
            return props.isOpen;
        } else {
            return props.defaultIsOpen!;
        }
    }

    private getPopperModifiers(): PopperModifiers {
        const { boundary, modifiers } = this.props;
        const { flip = {}, preventOverflow = {} } = modifiers!;
        return {
            ...modifiers,
            arrowOffset: {
                enabled: this.isArrowEnabled(),
                fn: arrowOffsetModifier,
                order: 510,
            },
            flip: { boundariesElement: boundary, ...flip },
            preventOverflow: { boundariesElement: boundary, ...preventOverflow },
            updatePopoverState: {
                enabled: true,
                fn: this.updatePopoverState,
                order: 900,
            },
        };
    }

    private handleTargetFocus = (e: React.FocusEvent<HTMLElement>) => {
        if (this.props.openOnTargetFocus && this.isHoverInteractionKind()) {
            if (e.relatedTarget == null && !this.lostFocusOnSamePage) {
                // ignore this focus event -- the target was already focused but the page itself
                // lost focus (e.g. due to switching tabs).
                return;
            }
            this.handleMouseEnter(e as unknown as React.MouseEvent<HTMLElement>);
        }
        this.props.targetProps?.onFocus?.(e);
    };

    private handleTargetBlur = (e: React.FocusEvent<HTMLElement>) => {
        if (this.props.openOnTargetFocus && this.isHoverInteractionKind()) {
            // if the next element to receive focus is within the popover, we'll want to leave the
            // popover open. e.relatedTarget ought to tell us the next element to receive focus, but if the user just
            // clicked on an element which is not focusable (either by default or with a tabIndex attribute),
            // it won't be set. So, we filter those out here and assume that a click handler somewhere else will
            // close the popover if necessary.
            if (e.relatedTarget != null && !this.isElementInPopover(e.relatedTarget as HTMLElement)) {
                this.handleMouseLeave(e as unknown as React.MouseEvent<HTMLElement>);
            }
        }
        this.lostFocusOnSamePage = e.relatedTarget != null;
        this.props.targetProps?.onBlur?.(e);
    };

    private handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
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
        this.props.targetProps?.onMouseEnter?.(e);
    };

    private handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
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
        this.props.targetProps?.onMouseLeave?.(e);
    };

    private handlePopoverClick = (e: React.MouseEvent<HTMLElement>) => {
        const eventTarget = e.target as HTMLElement;
        const eventPopover = eventTarget.closest(`.${Classes.POPOVER}`);
        const isEventFromSelf = eventPopover === this.popoverRef.current;
        const isEventPopoverCapturing = eventPopover?.classList.contains(Classes.POPOVER_CAPTURING_DISMISS);
        // an OVERRIDE inside a DISMISS does not dismiss, and a DISMISS inside an OVERRIDE will dismiss.
        const dismissElement = eventTarget.closest(`.${Classes.POPOVER_DISMISS}, .${Classes.POPOVER_DISMISS_OVERRIDE}`);
        const shouldDismiss = dismissElement != null && dismissElement.classList.contains(Classes.POPOVER_DISMISS);
        const isDisabled = eventTarget.closest(`:disabled, .${Classes.DISABLED}`) != null;
        if (shouldDismiss && !isDisabled && (!isEventPopoverCapturing || isEventFromSelf)) {
            this.setOpenState(false, e);
        }
    };

    private handleOverlayClose = (e?: React.SyntheticEvent<HTMLElement>) => {
        if (this.targetElement === null || e === undefined) {
            return;
        }

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
        this.props.targetProps?.onClick?.(e);
    };

    // a wrapper around setState({isOpen}) that will call props.onInteraction instead when in controlled mode.
    // starts a timeout to delay changing the state if a non-zero duration is provided.
    private setOpenState(isOpen: boolean, e?: React.SyntheticEvent<HTMLElement>, timeout?: number) {
        // cancel any existing timeout because we have new state
        this.cancelOpenTimeout?.();
        if (timeout !== undefined && timeout > 0) {
            this.cancelOpenTimeout = this.setTimeout(() => this.setOpenState(isOpen, e), timeout);
        } else {
            if (this.props.isOpen == null) {
                this.setState({ isOpen });
            } else {
                this.props.onInteraction?.(isOpen, e);
            }
            if (!isOpen) {
                // non-null assertion because the only time `e` is undefined is when in controlled mode
                // or the rare special case in uncontrolled mode when the `disabled` flag is toggled true
                this.props.onClose?.(e!);
            }
        }
    }

    private isArrowEnabled() {
        const { minimal, modifiers } = this.props;
        // omitting `arrow` from `modifiers` uses Popper default, which does show an arrow.
        return !minimal && (modifiers?.arrow == null || modifiers.arrow.enabled);
    }

    private isElementInPopover(element: Element) {
        return this.popoverElement?.contains(element);
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
