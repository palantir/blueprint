/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import { State as PopperState, PositioningStrategy } from "@popperjs/core";
import classNames from "classnames";
import * as React from "react";
import { Manager, Popper, PopperChildrenProps, Reference, ReferenceChildrenProps, StrictModifier } from "react-popper";

import {
    AbstractPureComponent2,
    Classes as CoreClasses,
    DISPLAYNAME_PREFIX,
    HTMLDivProps,
    isRefCallback,
    mergeRefs,
    Overlay,
    ResizeSensor,
    Utils,
} from "@blueprintjs/core";

import * as Classes from "./classes";
import * as Errors from "./errors";
import { POPOVER_ARROW_SVG_SIZE, Popover2Arrow } from "./popover2Arrow";
import { positionToPlacement } from "./popover2PlacementUtils";
import { IPopover2SharedProps } from "./popover2SharedProps";
// eslint-disable-next-line import/no-cycle
import { Tooltip2 } from "./tooltip2";
import { getBasePlacement, getTransformOrigin } from "./utils";

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
     * The content displayed inside the popover.
     */
    content?: string | JSX.Element;

    /**
     * Whether the wrapper and target should take up the full width of their container.
     * Note that supplying `true` for this prop will force  `targetTagName="div"`.
     */
    fill?: boolean;

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

    /**
     * Popper.js positioning strategy.
     *
     * @see https://popper.js.org/docs/v2/constructors/#strategy
     * @default "absolute"
     */
    positioningStrategy?: PositioningStrategy;
}

export interface IPopover2State {
    isOpen: boolean;
    hasDarkParent: boolean;
}

/**
 * @template T target component props inteface
 */
export class Popover2<T> extends AbstractPureComponent2<IPopover2Props<T>, IPopover2State> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Popover2`;

    private popoverRef = Utils.createReactRef<HTMLDivElement>();

    public static defaultProps: IPopover2Props = {
        boundary: "clippingParents",
        captureDismiss: false,
        defaultIsOpen: false,
        disabled: false,
        fill: false,
        hasBackdrop: false,
        hoverCloseDelay: 300,
        hoverOpenDelay: 150,
        inheritDarkTheme: true,
        interactionKind: Popover2InteractionKind.CLICK,
        minimal: false,
        openOnTargetFocus: true,
        // N.B. we don't set a default for `placement` or `position` here because that would trigger
        // a warning in validateProps if the other prop is specified by a user of this component
        positioningStrategy: "absolute",
        renderTarget: undefined as any,
        targetTagName: "span",
        transitionDuration: 300,
        usePortal: true,
    };

    public state: IPopover2State = {
        hasDarkParent: false,
        isOpen: this.getIsOpen(this.props),
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
        popover: (ref: HTMLElement | null) => {
            this.popoverElement = ref;
            this.props.popoverRef?.(ref);
        },
        target: (ref: HTMLElement | null) => (this.targetElement = ref),
    };

    private cancelOpenTimeout?: () => void;

    // a flag that lets us detect mouse movement between the target and popover,
    // now that mouseleave is triggered when you cross the gap between the two.
    private isMouseInTargetOrPopover = false;

    // a flag that indicates whether the target previously lost focus to another
    // element on the same page.
    private lostFocusOnSamePage = true;

    // Reference to the Poppper.scheduleUpdate() function, this changes every time the popper is mounted
    private popperScheduleUpdate?: () => Promise<Partial<PopperState> | null>;

    private isControlled = () => this.props.isOpen !== undefined;

    // arrow is disabled if minimal, or if the arrow modifier was explicitly disabled
    private isArrowEnabled = () => !this.props.minimal && this.props.modifiers?.arrow?.enabled !== false;

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
        } else {
            return props.isOpen ?? props.defaultIsOpen!;
        }
    }

    public render() {
        const { disabled, content, placement, position = "auto", positioningStrategy } = this.props;
        const { isOpen } = this.state;

        const isContentEmpty = content == null || (typeof content === "string" && content.trim() === "");
        if (isContentEmpty) {
            // need to do this check in render(), because `isOpen` is derived from
            // state, and state can't necessarily be accessed in validateProps.
            if (!disabled && isOpen !== false && !Utils.isNodeEnv("production")) {
                console.warn(Errors.POPOVER2_WARN_EMPTY_CONTENT);
            }
            // just render the target without a content overlay if there is no content to display
            return this.renderTarget({ ref: noop });
        }

        return (
            <Manager>
                <Reference>{this.renderTarget}</Reference>
                <Popper
                    innerRef={this.refHandlers.popover}
                    placement={placement ?? positionToPlacement(position)}
                    strategy={positioningStrategy}
                    modifiers={this.computePopperModifiers()}
                >
                    {this.renderPopover}
                </Popper>
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

    protected validateProps(props: IPopover2Props & { children?: React.ReactNode }) {
        if (props.isOpen == null && props.onInteraction != null) {
            console.warn(Errors.POPOVER2_WARN_UNCONTROLLED_ONINTERACTION);
        }
        if (props.hasBackdrop && !props.usePortal) {
            console.warn(Errors.POPOVER2_WARN_HAS_BACKDROP_INLINE);
        }
        if (props.hasBackdrop && props.interactionKind !== Popover2InteractionKind.CLICK) {
            console.warn(Errors.POPOVER2_HAS_BACKDROP_INTERACTION);
        }
        if (props.placement !== undefined && props.position !== undefined) {
            console.warn(Errors.POPOVER2_WARN_PLACEMENT_AND_POSITION_MUTEX);
        }

        const childrenCount = React.Children.count(props.children);
        const hasRenderTargetPropp = props.renderTarget !== undefined;

        if (childrenCount === 0 && !hasRenderTargetPropp) {
            console.warn(Errors.POPOVER2_REQUIRES_TARGET);
        }
        if (childrenCount > 1) {
            console.warn(Errors.POPOVER2_WARN_TOO_MANY_CHILDREN);
        }
        if (childrenCount > 0 && hasRenderTargetPropp) {
            console.warn(Errors.POPOVER2_WARN_DOUBLE_TARGET);
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
        const { children, className, fill, openOnTargetFocus, renderTarget } = this.props;
        const { isOpen } = this.state;
        const isControlled = this.isControlled();
        const isHoverInteractionKind = this.isHoverInteractionKind();
        let { targetTagName } = this.props;
        if (fill) {
            targetTagName = "div";
        }

        if (isRefCallback(ref)) {
            ref = mergeRefs(ref, this.refHandlers.target);
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
        // Ensure target is focusable if relevant prop enabled
        const targetTabIndex = openOnTargetFocus && isHoverInteractionKind ? 0 : undefined;
        const targetProps = {
            // N.B. this.props.className is passed along to renderTarget even though the user would have access to it.
            // If, instead, renderTarget is undefined and the target is provided as a child, this.props.className is
            // applied to the generated target wrapper element.
            className: classNames(className, Classes.POPOVER2_TARGET, {
                [Classes.POPOVER2_OPEN]: isOpen,
                // this class is mainly useful for button targets
                [CoreClasses.ACTIVE]: !isControlled && isOpen && !isHoverInteractionKind,
            }),
            ref,
            ...((targetEventHandlers as unknown) as T),
        };

        let target: JSX.Element | undefined;

        if (renderTarget !== undefined) {
            target = renderTarget({
                ...targetProps,
                // if the consumer renders a tooltip target, it's their responsibility to disable that tooltip
                // when *this* popover is open
                isOpen,
                tabIndex: targetTabIndex,
            });
        } else {
            const childTarget = Utils.ensureElement(React.Children.toArray(children)[0])!;

            if (childTarget === undefined) {
                return null;
            }

            const targetModifierClasses = {
                // this class is mainly useful for Blueprint <Button> targets; we should only apply it for
                // uncontrolled popovers when they are opened by a user interaction
                [CoreClasses.ACTIVE]: isOpen && !isControlled && !isHoverInteractionKind,
                // similarly, this class is mainly useful for targets like <Button>, <InputGroup>, etc.
                [CoreClasses.FILL]: fill,
            };
            const clonedTarget: JSX.Element = React.cloneElement(childTarget, {
                className: classNames(childTarget.props.className, targetModifierClasses),
                // force disable single Tooltip2 child when popover is open
                disabled: isOpen && Utils.isElementOfType(childTarget, Tooltip2) ? true : childTarget.props.disabled,
                tabIndex: childTarget.props.tabIndex ?? targetTabIndex,
            });
            const wrappedTarget = React.createElement(targetTagName!, targetProps, clonedTarget);
            target = wrappedTarget;
        }

        return <ResizeSensor onResize={this.reposition}>{target}</ResizeSensor>;
    };

    private renderPopover = (popperProps: PopperChildrenProps) => {
        const { interactionKind, usePortal } = this.props;
        const { isOpen } = this.state;

        // compute an appropriate transform origin so the scale animation points towards target
        const transformOrigin = getTransformOrigin(
            popperProps.placement,
            this.isArrowEnabled() ? (popperProps.arrowProps.style as any) : undefined,
        );

        // need to update our reference to this function on every render as it will change.
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

        const basePlacement = getBasePlacement(popperProps.placement);
        const popoverClasses = classNames(
            Classes.POPOVER2,
            {
                [CoreClasses.DARK]: this.props.inheritDarkTheme && this.state.hasDarkParent,
                [CoreClasses.MINIMAL]: this.props.minimal,
                [Classes.POPOVER2_CAPTURING_DISMISS]: this.props.captureDismiss,
            },
            `${Classes.POPOVER2_CONTENT_PLACEMENT}-${basePlacement}`,
            this.props.popoverClassName,
        );

        return (
            <Overlay
                autoFocus={this.props.autoFocus}
                backdropClassName={Classes.POPOVER2_BACKDROP}
                backdropProps={this.props.backdropProps}
                canEscapeKeyClose={this.props.canEscapeKeyClose}
                canOutsideClickClose={this.props.interactionKind === Popover2InteractionKind.CLICK}
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
                portalClassName={this.props.portalClassName}
                portalContainer={this.props.portalContainer}
            >
                <div className={Classes.POPOVER2_TRANSITION_CONTAINER} ref={popperProps.ref} style={popperProps.style}>
                    <ResizeSensor onResize={this.reposition}>
                        <div
                            className={popoverClasses}
                            style={{ transformOrigin }}
                            ref={this.popoverRef}
                            {...popoverHandlers}
                        >
                            {this.isArrowEnabled() && (
                                <Popover2Arrow arrowProps={popperProps.arrowProps} placement={popperProps.placement} />
                            )}
                            <div className={Classes.POPOVER2_CONTENT}>{this.props.content}</div>
                        </div>
                    </ResizeSensor>
                </div>
            </Overlay>
        );
    };

    private computePopperModifiers(): StrictModifier[] {
        const { modifiers } = this.props;
        return [
            {
                enabled: this.isArrowEnabled(),
                name: "arrow",
                ...modifiers?.arrow,
            },
            {
                name: "computeStyles",
                ...modifiers?.computeStyles,
                options: {
                    adaptive: true,
                    // We disable the built-in gpuAcceleration so that
                    // Popper.js will return us easy to interpolate values
                    // (top, left instead of transform: translate3d)
                    // We'll then use these values to generate the needed
                    // css transform values blended with the react-spring values
                    gpuAcceleration: false,
                    ...modifiers?.computeStyles?.options,
                },
            },
            {
                enabled: this.isArrowEnabled(),
                name: "offset",
                ...modifiers?.offset,
                options: {
                    offset: [0, POPOVER_ARROW_SVG_SIZE / 2],
                    ...modifiers?.offset?.options,
                },
            },
            {
                name: "flip",
                ...modifiers?.flip,
                options: {
                    boundary: this.props.boundary,
                    rootBoundary: this.props.rootBoundary,
                    ...modifiers?.flip?.options,
                },
            },
            {
                name: "preventOverflow",
                ...modifiers?.preventOverflow,
                options: {
                    boundary: this.props.boundary,
                    rootBoundary: this.props.rootBoundary,
                    ...modifiers?.preventOverflow?.options,
                },
            },
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
        const shouldDismiss = dismissElement?.classList.contains(Classes.POPOVER2_DISMISS);

        // dismiss selectors from the "V1" version of Popover in the core pacakge
        // we expect these to be rendered by MenuItem, which at this point has no knowledge of Popover2
        // this can be removed once Popover2 is merged into core in v4.0
        const dismissElementV1 = eventTarget.closest(
            `.${CoreClasses.POPOVER_DISMISS}, .${CoreClasses.POPOVER_DISMISS_OVERRIDE}`,
        );
        const shouldDismissV1 = dismissElementV1?.classList.contains(CoreClasses.POPOVER_DISMISS);

        const isDisabled = eventTarget.closest(`:disabled, .${CoreClasses.DISABLED}`) != null;
        if ((shouldDismiss || shouldDismissV1) && !isDisabled && (!isEventPopoverCapturing || isEventFromSelf)) {
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

    // a wrapper around setState({ isOpen }) that will call props.onInteraction instead when in controlled mode.
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
            const hasDarkParent =
                this.targetElement != null && this.targetElement.closest(`.${CoreClasses.DARK}`) != null;
            this.setState({ hasDarkParent });
        }
    }

    private isElementInPopover(element: Element) {
        return this.popoverElement != null && this.popoverElement.contains(element);
    }
}

function noop() {
    // no-op
}
