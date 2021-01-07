/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
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

import {
    AbstractPureComponent2,
    Classes as CoreClasses,
    DISPLAYNAME_PREFIX,
    HTMLDivProps,
    Overlay,
    // ResizeSensor,
    isRefCallback,
    combineRefs,
    Utils,
} from "@blueprintjs/core";
import { State as PopperState } from "@popperjs/core";
import classNames from "classnames";
import * as React from "react";
import { Manager, Modifier, Popper, PopperChildrenProps, Reference, ReferenceChildrenProps } from "react-popper";

import * as Classes from "./classes";
import { Popover2Arrow } from "./popover2Arrow";
import { IPopover2SharedProps } from "./popover2SharedProps";
import { getTransformOrigin, ARROW_SVG_SIZE } from "./utils";

export const Popover2InteractionKind = {
    CLICK: "click" as "click",
    CLICK_TARGET_ONLY: "click-target" as "click-target",
    HOVER: "hover" as "hover",
    HOVER_TARGET_ONLY: "hover-target" as "hover-target",
};
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Popover2InteractionKind = typeof Popover2InteractionKind[keyof typeof Popover2InteractionKind];

export interface IPopover2Props<TProps = React.HTMLProps<HTMLElement>> extends IPopover2SharedProps<TProps> {
    /** HTML props for the backdrop element. Can be combined with `backdropClassName`. */
    backdropProps?: React.HTMLProps<HTMLDivElement>;
    /**
     * The content displayed inside the popover. This can instead be provided as
     * the _second_ element in `children` (first is `target`).
     */
    content?: string | JSX.Element;

    /**
     * The kind of interaction that triggers the display of the popover.
     *
     * @default "click"
     */
    interactionKind?: Popover2InteractionKind;

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
     * Ref supplied to the `Classes.POPOVER` element.
     */
    popoverRef?: (ref: HTMLElement | null) => void;
}

export interface IPopover2State {
    transformOrigin: string;
    isOpen: boolean;
    hasDarkParent: boolean;
}

/**
 * T: target props inteface
 */
export class Popover2<T> extends AbstractPureComponent2<IPopover2Props<T>, IPopover2State> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Popover2`;

    private popoverRef = Utils.createReactRef<HTMLDivElement>();

    public static defaultProps: IPopover2Props = {
        // boundary: "scrollParent",
        captureDismiss: false,
        defaultIsOpen: false,
        disabled: false,
        // fill: false,
        hasBackdrop: false,
        hoverCloseDelay: 300,
        hoverOpenDelay: 150,
        inheritDarkTheme: true,
        interactionKind: Popover2InteractionKind.CLICK,
        minimal: false,
        // modifiers: {},
        openOnTargetFocus: true,
        placement: "auto",
        renderTarget: undefined as any,
        transitionDuration: 300,
        usePortal: true,
    };

    public state: IPopover2State = {
        hasDarkParent: false,
        isOpen: this.getIsOpen(this.props),
        transformOrigin: "",
    };

    /**
     * DOM element that contains the popover.
     * When `usePortal={true}`, this element will be portaled outside the usual DOM flow,
     * so this reference can be very useful for testing.
     */
    public popoverElement: HTMLElement | null = null;

    /** DOM element that contains the target. */
    public targetElement: HTMLElement | null = null;

    private refHandlers = {
        popover: (ref: HTMLElement) => {
            this.popoverElement = ref;
            this.props.popoverRef?.(ref);
        },
        target: (ref: HTMLElement) => (this.targetElement = ref),
    };

    private cancelOpenTimeout?: () => void;

    // a flag that lets us detect mouse movement between the target and popover,
    // now that mouseleave is triggered when you cross the gap between the two.
    private isMouseInTargetOrPopover = false;

    // a flag that indicates whether the target previously lost focus to another
    // element on the same page.
    private lostFocusOnSamePage = true;

    // Reference to the Poppper.scheduleUpdate() function, this changes every time the popper is mounted
    private popperScheduleUpdate?: () => Promise<Partial<PopperState>>;

    private isControlled = () => this.props.isOpen !== undefined;

    private isArrowEnabled = () => {
        // TODO(adahiya)
        // const { minimal, modifiers } = this.props;
        // // omitting `arrow` from `modifiers` uses Popper default, which does show an arrow.
        // return !minimal && (modifiers?.arrow == null || modifiers.arrow.enabled);
        return true;
    };

    private isHoverInteractionKind = () => {
        return (
            this.props.interactionKind === Popover2InteractionKind.HOVER ||
            this.props.interactionKind === Popover2InteractionKind.HOVER_TARGET_ONLY
        );
    };

    private getIsOpen(props: IPopover2Props<T>) {
        // disabled popovers should never be allowed to open.
        if (props.disabled) {
            return false;
        } else if (props.isOpen != null) {
            return props.isOpen;
        } else {
            return props.defaultIsOpen!;
        }
    }

    public render() {
        const { isOpen } = this.state;

        return (
            <Manager>
                <Reference>{this.renderTarget}</Reference>
                <Overlay
                    autoFocus={this.props.autoFocus}
                    backdropClassName={Classes.POPOVER2_BACKDROP}
                    backdropProps={this.props.backdropProps}
                    canEscapeKeyClose={this.props.canEscapeKeyClose}
                    canOutsideClickClose={this.props.interactionKind === Popover2InteractionKind.CLICK}
                    className={this.props.portalClassName}
                    enforceFocus={this.props.enforceFocus}
                    hasBackdrop={this.props.hasBackdrop}
                    isOpen={isOpen}
                    onClose={this.handleOverlayClose}
                    onClosed={this.props.onClosed}
                    onClosing={this.props.onClosing}
                    onOpened={this.props.onOpened}
                    onOpening={this.props.onOpening}
                    transitionDuration={this.props.transitionDuration}
                    transitionName={Classes.POPOVER2}
                    usePortal={this.props.usePortal}
                    portalContainer={this.props.portalContainer}
                >
                    <Popper
                        innerRef={this.refHandlers.popover}
                        placement={this.props.placement}
                        strategy="fixed"
                        modifiers={this.getPopperModifiers()}
                    >
                        {this.renderPopover}
                    </Popper>
                </Overlay>
            </Manager>
        );
    }

    public componentDidMount() {
        this.updateDarkParent();
    }

    public componentDidUpdate(props: IPopover2Props<T>, state: IPopover2State) {
        super.componentDidUpdate(props, state);
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

    private renderTarget = ({ ref }: ReferenceChildrenProps) => {
        const { renderTarget } = this.props;
        const { isOpen } = this.state;
        const isControlled = this.isControlled();
        const isHoverInteractionKind = this.isHoverInteractionKind();
        if (isRefCallback(ref)) {
            ref = combineRefs(ref, this.refHandlers.target);
        }

        const targetEventHandlers = isHoverInteractionKind
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

        const target = renderTarget({
            className: classNames(Classes.POPOVER2_TARGET, {
                [Classes.POPOVER2_OPEN]: isOpen,
                // this class is mainly useful for button targets; we should only apply it for uncontrolled popovers
                // when they are opened by a user interaction
                [CoreClasses.ACTIVE]: isOpen && !isControlled && !isHoverInteractionKind,
            }),
            // force disable single Tooltip child when popover is open (BLUEPRINT-552)
            // TODO(adahiya)
            // disabled: isOpen && Utils.isElementOfType(rawTarget, Tooltip) ? true : rawTarget.props.disabled,
            ref,
            ...((targetEventHandlers as unknown) as T),
        });

        // return <ResizeSensor onResize={this.reposition}>{target}</ResizeSensor>;
        return target;
    };

    private renderPopover = (popperProps: PopperChildrenProps) => {
        const { usePortal, interactionKind } = this.props;
        // const { transformOrigin } = this.state;
        const transformOrigin = getTransformOrigin(
            popperProps.placement,
            this.isArrowEnabled() ? (popperProps.arrowProps.style as any) : undefined,
        );

        // Need to update our reference to this on every render as it will change.
        this.popperScheduleUpdate = popperProps.update;

        const popoverHandlers: HTMLDivProps = {
            // always check popover clicks for dismiss class
            onClick: this.handlePopoverClick,
        };
        if (
            interactionKind === Popover2InteractionKind.HOVER ||
            (!usePortal && interactionKind === Popover2InteractionKind.HOVER_TARGET_ONLY)
        ) {
            popoverHandlers.onMouseEnter = this.handleMouseEnter;
            popoverHandlers.onMouseLeave = this.handleMouseLeave;
        }

        const popoverClasses = classNames(
            Classes.POPOVER2,
            {
                [CoreClasses.DARK]: this.props.inheritDarkTheme && this.state.hasDarkParent,
                [CoreClasses.MINIMAL]: this.props.minimal,
                [Classes.POPOVER2_CAPTURING_DISMISS]: this.props.captureDismiss,
            },
            this.props.popoverClassName,
        );

        return (
            <div className={Classes.POPOVER2_TRANSITION_CONTAINER} ref={popperProps.ref} style={popperProps.style}>
                {/* <ResizeSensor onResize={this.handleContentResize}> */}
                <div className={popoverClasses} style={{ transformOrigin }} ref={this.popoverRef} {...popoverHandlers}>
                    {this.isArrowEnabled() && (
                        <Popover2Arrow arrowProps={popperProps.arrowProps} placement={popperProps.placement} />
                    )}
                    <div className={Classes.POPOVER2_CONTENT}>{this.renderContent()}</div>
                </div>
                {/* </ResizeSensor> */}
            </div>
        );
    };

    private renderContent = () => {
        // TODO(adahiya)
        return <div>Content</div>;
    };

    private getPopperModifiers(): Array<
        Modifier<"computeStyles" | "offset" | "flip" | "preventOverflow" | "updatePopoverState">
    > {
        // TODO(adahiya)
        // const { boundary /* , modifiers */ } = this.props;
        // const { flip = {}, preventOverflow = {} } = modifiers!;
        return [
            {
                name: "computeStyles",
                options: {
                    adaptive: true,
                    // We disable the built-in gpuAcceleration so that
                    // Popper.js will return us easy to interpolate values
                    // (top, left instead of transform: translate3d)
                    // We'll then use these values to generate the needed
                    // css transform values blended with the react-spring values
                    gpuAcceleration: false,
                },
            },
            {
                enabled: this.isArrowEnabled(),
                name: "offset",
                options: {
                    offset: [0, ARROW_SVG_SIZE / 2],
                },
            },
            {
                name: "flip",
                options: { boundary: this.props.boundary },
            },
            {
                name: "preventOverflow",
                options: { boundary: this.props.boundary },
            },
            // {
            //     name: "updatePopoverState",
            //     options: {
            //         enabled: true,
            //         fn: this.updatePopoverState,
            //         order: 900,
            //     },
            // },
        ];
    }

    private handleTargetFocus = (e: React.FocusEvent<HTMLElement>) => {
        if (this.props.openOnTargetFocus && this.isHoverInteractionKind()) {
            if (e.relatedTarget == null && !this.lostFocusOnSamePage) {
                // ignore this focus event -- the target was already focused but the page itself
                // lost focus (e.g. due to switching tabs).
                return;
            }
            this.handleMouseEnter((e as unknown) as React.MouseEvent<HTMLElement>);
        }
    };

    private handleTargetBlur = (e: React.FocusEvent<HTMLElement>) => {
        if (this.props.openOnTargetFocus && this.isHoverInteractionKind()) {
            // if the next element to receive focus is within the popover, we'll want to leave the
            // popover open. e.relatedTarget ought to tell us the next element to receive focus, but if the user just
            // clicked on an element which is not focusable (either by default or with a tabIndex attribute),
            // it won't be set. So, we filter those out here and assume that a click handler somewhere else will
            // close the popover if necessary.
            if (e.relatedTarget != null && !this.isElementInPopover(e.relatedTarget as HTMLElement)) {
                this.handleMouseLeave((e as unknown) as React.MouseEvent<HTMLElement>);
            }
        }
        this.lostFocusOnSamePage = e.relatedTarget != null;
    };

    private handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
        this.isMouseInTargetOrPopover = true;

        // if we're entering the popover, and the mode is set to be HOVER_TARGET_ONLY, we want to manually
        // trigger the mouse leave event, as hovering over the popover shouldn't count.
        if (
            !this.props.usePortal &&
            this.isElementInPopover(e.target as Element) &&
            this.props.interactionKind === Popover2InteractionKind.HOVER_TARGET_ONLY &&
            !this.props.openOnTargetFocus
        ) {
            this.handleMouseLeave(e);
        } else if (!this.props.disabled) {
            // only begin opening popover when it is enabled
            this.setOpenState(true, e, this.props.hoverOpenDelay);
        }
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
    };

    private handlePopoverClick = (e: React.MouseEvent<HTMLElement>) => {
        const eventTarget = e.target as HTMLElement;
        const eventPopover = eventTarget.closest(`.${Classes.POPOVER2}`);
        const isEventFromSelf = eventPopover === this.popoverRef.current;
        const isEventPopoverCapturing = eventPopover?.classList.contains(Classes.POPOVER2_CAPTURING_DISMISS);
        // an OVERRIDE inside a DISMISS does not dismiss, and a DISMISS inside an OVERRIDE will dismiss.
        const dismissElement = eventTarget.closest(
            `.${Classes.POPOVER2_DISMISS}, .${Classes.POPOVER2_DISMISS_OVERRIDE}`,
        );
        const shouldDismiss = dismissElement != null && dismissElement.classList.contains(Classes.POPOVER2_DISMISS);
        const isDisabled = eventTarget.closest(`:disabled, .${CoreClasses.DISABLED}`) != null;
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
    };

    private handleContentResize = () => {
        // TODO(adahiya)
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

    private updateDarkParent() {
        if (this.props.usePortal && this.state.isOpen) {
            // TODO(adahiya)
            // const hasDarkParent = this.targetElement != null && this.targetElement.closest(`.${Classes.DARK}`) != null;
            // this.setState({ hasDarkParent });
        }
    }

    private isElementInPopover(element: Element) {
        return this.popoverElement != null && this.popoverElement.contains(element);
    }

    /** Popper modifier that updates React state (for style properties) based on latest data. */
    // private updatePopoverState: (state: PopperState) => PopperState = state => {
    //     // always set string; let shouldComponentUpdate determine if update is necessary
    //     console.log("got popper state", state);
    //     this.setState({ transformOrigin: getTransformOrigin(state) });
    //     return state;
    // };
}
