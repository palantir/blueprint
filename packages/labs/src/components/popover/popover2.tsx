/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";
import { Arrow, Manager, Popper, Target } from "react-popper";

import {
    AbstractComponent,
    Classes,
    IOverlayableProps,
    IProps,
    Overlay,
    PopoverInteractionKind,
    Tooltip,
    Utils,
} from "@blueprintjs/core";

// a subset of Popper.Placement values that only indicates the side, not the edge
type Side = "top" | "right" | "bottom" | "left";

const SVG_SHADOW_PATH = "M8.11 6.302c1.015-.936 1.887-2.922 1.887-4.297v26c0-1.378" +
    "-.868-3.357-1.888-4.297L.925 17.09c-1.237-1.14-1.233-3.034 0-4.17L8.11 6.302z";
const SVG_ARROW_PATH = "M8.787 7.036c1.22-1.125 2.21-3.376 2.21-5.03V0v30-2.005" +
    "c0-1.654-.983-3.9-2.21-5.03l-7.183-6.616c-.81-.746-.802-1.96 0-2.7l7.183-6.614z";

export interface IPopover2Props extends IOverlayableProps, IProps {
    arrow?: boolean;

    /** HTML props for the backdrop element. Can be combined with `backdropClassName`. */
    backdropProps?: React.HTMLProps<HTMLDivElement>;

    /**
     * The content displayed inside the popover.
     * This can instead be provided as the second `children` element (first is `target`).
     */
    content?: string | JSX.Element;

    /**
     * Initial opened state when uncontrolled.
     * @default false
     */
    defaultIsOpen?: boolean;

    /**
     * The amount of time in milliseconds the popover should remain open after the
     * user hovers off the trigger. The timer is canceled if the user mouses over the
     * target before it expires. This option only applies when `interactionKind` is `HOVER` or
     * `HOVER_TARGET_ONLY`.
     * @default 300
     */
    hoverCloseDelay?: number;

    /**
     * The amount of time in milliseconds the popover should wait before opening after the the
     * user hovers over the trigger. The timer is canceled if the user mouses away from the
     * target before it expires. This option only applies when `interactionKind` is `HOVER` or
     * `HOVER_TARGET_ONLY`.
     * @default 150
     */
    hoverOpenDelay?: number;

    /**
     * Whether a non-inline popover should automatically inherit the dark theme from its parent.
     * @default true
     */
    inheritDarkTheme?: boolean;

    /**
     * The kind of interaction that triggers the display of the popover.
     * @default PopoverInteractionKind.CLICK
     */
    interactionKind?: PopoverInteractionKind;

    /**
     * Prevents the popover from appearing when `true`.
     * @default false
     */
    isDisabled?: boolean;

    /**
     * Enables an invisible overlay beneath the popover that captures clicks and prevents
     * interaction with the rest of the document until the popover is closed.
     * This prop is only available when `interactionKind` is `PopoverInteractionKind.CLICK`.
     * When modal popovers are opened, they become focused.
     * @default false
     */
    isModal?: boolean;

    /**
     * Whether the popover is visible. Passing this prop puts the popover in
     * controlled mode, where the only way to change visibility is by updating this property.
     * @default undefined
     */
    isOpen?: boolean;

    /**
     * Popper modifier options, passed directly to internal Popper instance.
     * See https://popper.js.org/popper-documentation.html#modifiers for complete details.
     */
    modifiers?: Popper.Modifiers;

    /**
     * Callback invoked in controlled mode when the popover open state *would* change due to
     * user interaction based on the value of `interactionKind`.
     */
    onInteraction?: (nextOpenState: boolean) => void;

    /**
     * Whether the popover should open when its target is focused.
     * If `true`, target will render with `tabindex="0"` to make it focusable via keyboard navigation.
     * This prop is only available when `interactionKind` is `HOVER` or `HOVER_TARGET_ONLY`.
     * @default true
     */
    openOnTargetFocus?: boolean;

    /**
     * A space-delimited string of class names that are applied to the popover (but not the target).
     */
    popoverClassName?: string;

    /**
     * Callback invoked when the popover opens after it is added to the DOM.
     */
    popoverDidOpen?: () => void;

    /**
     * Callback invoked when a popover begins to close.
     */
    popoverWillClose?: () => void;

    /**
     * Callback invoked before the popover opens.
     */
    popoverWillOpen?: () => void;

    /**
     * Space-delimited string of class names applied to the
     * portal that holds the popover if `inline = false`.
     */
    portalClassName?: string;

    /**
     * The position (relative to the target) at which the popover should appear.
     * @default Popper.Placement.right
     */
    placement?: Popper.Placement;

    /**
     * The name of the HTML tag to use when rendering the popover target wrapper element (`.pt-popover-target`).
     * @default "span"
     */
    rootElementTag?: string;

    /**
     * The target element to which the popover content is attached.
     * This can instead be provided as the first `children` element.
     */
    target?: string | JSX.Element;
}

export interface IPopover2State {
    arrowRotation?: string;
    transformOrigin?: string;
    isOpen?: boolean;
}

@PureRender
export class Popover2 extends AbstractComponent<IPopover2Props, IPopover2State> {
    public static defaultProps: IPopover2Props = {
        arrow: true,
        className: "",
        defaultIsOpen: false,
        hoverCloseDelay: 300,
        hoverOpenDelay: 150,
        inheritDarkTheme: true,
        inline: false,
        interactionKind: PopoverInteractionKind.CLICK,
        isDisabled: false,
        isModal: false,
        openOnTargetFocus: true,
        popoverClassName: "",
        rootElementTag: "span",
        transitionDuration: 300,
    };

    public static displayName = "Blueprint.Popover";

    /**
     * DOM element that contains the popover.
     * When `inline={false}`, this element will be portaled outside the usual DOM flow,
     * so this reference can be very useful for testing.
     */
    public popoverElement: HTMLElement;
    /** DOM element that contains the target. */
    public targetElement: HTMLElement;

    private hasDarkParent = false;
    // a flag that is set to true while we are waiting for the underlying Portal to complete rendering
    private isContentMounting = false;
    private cancelOpenTimeout: () => void;

    private refHandlers = {
        popover: (ref: HTMLDivElement) => this.popoverElement = ref,
        target: (ref: HTMLElement) => this.targetElement = ref,
    };

    public constructor(props?: IPopover2Props, context?: any) {
        super(props, context);

        let isOpen = props.defaultIsOpen && !props.isDisabled;
        if (props.isOpen != null) {
            isOpen = props.isOpen;
        }

        this.state = {
            isOpen,
        };
    }

    public render() {
        const { className } = this.props;
        const { isOpen } = this.state;

        let targetProps: React.HTMLAttributes<HTMLElement>;
        if (this.isHoverInteractionKind()) {
            targetProps = {
                onBlur: this.handleTargetBlur,
                onFocus: this.handleTargetFocus,
                onMouseEnter: this.handleMouseEnter,
                onMouseLeave: this.handleMouseLeave,
            };
        // any one of the CLICK* values
        } else {
            targetProps = {
                onClick: this.handleTargetClick,
            };
        }
        targetProps.className = classNames(Classes.POPOVER_TARGET, {
            [Classes.POPOVER_OPEN]: isOpen,
        }, className);

        const children = this.understandChildren();
        const targetTabIndex = this.props.openOnTargetFocus && this.isHoverInteractionKind() ? 0 : undefined;
        const target = React.cloneElement(children.target,
            // force disable single Tooltip child when popover is open (BLUEPRINT-552)
            (isOpen && children.target.type === Tooltip)
                ? { isDisabled: true, tabIndex: targetTabIndex }
                : { tabIndex: targetTabIndex },
        );

        const isContentEmpty = (children.content == null);
        if (isContentEmpty && !this.props.isDisabled && isOpen !== false && !Utils.isNodeEnv("production")) {
            console.warn("[Blueprint] Disabling <Popover> with empty/whitespace content...");
        }

        return (
            <Manager tag={this.props.rootElementTag}>
                <Target {...targetProps} innerRef={this.refHandlers.target}>{target}</Target>
                <Overlay
                    autoFocus={this.props.autoFocus}
                    backdropClassName={Classes.POPOVER_BACKDROP}
                    backdropProps={this.props.backdropProps}
                    canEscapeKeyClose={this.props.canEscapeKeyClose}
                    canOutsideClickClose={this.props.interactionKind === PopoverInteractionKind.CLICK}
                    className={this.props.portalClassName}
                    didOpen={this.handleContentMount}
                    enforceFocus={this.props.enforceFocus}
                    hasBackdrop={this.props.isModal}
                    inline={this.props.inline}
                    isOpen={isOpen && !isContentEmpty}
                    lazy={false}
                    onClose={this.handleOverlayClose}
                    portalClassName="pt-popover-portal"
                    transitionDuration={this.props.transitionDuration}
                    transitionName={Classes.POPOVER}
                >
                    {this.renderPopper(children.content)}
                </Overlay>
            </Manager>
        );
    }

    public componentDidMount() {
        this.componentDOMChange();
    }

    public componentWillReceiveProps(nextProps: IPopover2Props) {
        super.componentWillReceiveProps(nextProps);

        if (nextProps.isOpen == null && nextProps.isDisabled && !this.props.isDisabled) {
            // ok to use setOpenState here because isDisabled and isOpen are mutex.
            this.setOpenState(false);
        } else if (nextProps.isOpen !== this.props.isOpen) {
            // propagate isOpen prop directly to state, circumventing onInteraction callback
            // (which would be invoked if this went through setOpenState)
            this.setState({ isOpen: nextProps.isOpen});
        }
    }

    public componentWillUpdate(_: IPopover2Props, nextState: IPopover2State) {
        if (!this.state.isOpen && nextState.isOpen) {
            this.isContentMounting = true;
            Utils.safeInvoke(this.props.popoverWillOpen);
        } else if (this.state.isOpen && !nextState.isOpen) {
            Utils.safeInvoke(this.props.popoverWillClose);
        }
    }

    public componentDidUpdate() {
        this.componentDOMChange();
    }

    public componentWillUnmount() {
        super.componentWillUnmount();
    }

    private componentDOMChange() {
        if (!this.props.inline) {
            this.hasDarkParent = this.targetElement.closest(`.${Classes.DARK}`) != null;
        }
    }

    private renderPopper(content: JSX.Element) {
        console.log("render", this.state);
        const { inline, interactionKind } = this.props;
        const popoverHandlers: React.HTMLAttributes<HTMLDivElement> = {
            // always check popover clicks for dismiss class
            onClick: this.handlePopoverClick,
        };
        if ((interactionKind === PopoverInteractionKind.HOVER)
            || (inline && interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY)) {
            popoverHandlers.onMouseEnter = this.handleMouseEnter;
            popoverHandlers.onMouseLeave = this.handleMouseLeave;
        }

        const popoverClasses = classNames(Classes.POPOVER, {
            [Classes.DARK]: this.props.inheritDarkTheme && this.hasDarkParent && !inline,
        }, this.props.popoverClassName);

        const isArrowEnabled = this.props.arrow
            && (this.props.modifiers.arrow == null || this.props.modifiers.arrow.enabled);
        const modifiers: Popper.Modifiers = {
            ...this.props.modifiers,
            arrowOffset: {
                enabled: isArrowEnabled,
                fn: this.arrowOffsetModifier,
                order: 510, // arrow is 500
            },
            updatePopoverState: {
                enabled: true,
                fn: this.updatePopoverState,
                order: 900,
            },
        };

        return (
            <Popper
                className={Classes.TRANSITION_CONTAINER}
                placement={this.props.placement}
                modifiers={modifiers}
            >
                <div
                    className={popoverClasses}
                    ref={this.refHandlers.popover}
                    style={{ transformOrigin: this.state.transformOrigin }}
                    {...popoverHandlers}
                >
                    {isArrowEnabled ? this.renderArrow() : undefined}
                    <div className={Classes.POPOVER_CONTENT}>
                        {content}
                    </div>
                </div>
            </Popper>
        );
    }

    private renderArrow() {
        return (
            <Arrow className={Classes.POPOVER_ARROW}>
                <svg viewBox="0 0 30 30" style={{ transform: this.state.arrowRotation }}>
                    <path className={Classes.POPOVER_ARROW + "-border"} d={SVG_SHADOW_PATH} />
                    <path className={Classes.POPOVER_ARROW + "-fill"} d={SVG_ARROW_PATH} />
                </svg>
            </Arrow>
        );
    }

    // content and target can be specified as props or as children.
    // this method normalizes the two approaches, preferring child over prop.
    private understandChildren() {
        const { children, content: contentProp, target: targetProp } = this.props;
        // #validateProps asserts that 1 <= children.length <= 2 so content is optional
        const [targetChild, contentChild] = React.Children.toArray(children);
        return {
            content: ensureElement(contentChild == null ? contentProp : contentChild),
            target: ensureElement(targetChild == null ? targetProp : targetChild),
        };
    }

    private handleContentMount = () => {
        if (Utils.isFunction(this.props.popoverDidOpen) && this.isContentMounting) {
            this.props.popoverDidOpen();
            this.isContentMounting = false;
        }
    }

    private handleTargetFocus = (e?: React.FormEvent<HTMLElement>) => {
        if (this.props.openOnTargetFocus && this.isHoverInteractionKind()) {
            this.handleMouseEnter(e);
        }
    }

    private handleTargetBlur = (e?: React.FormEvent<HTMLElement>) => {
        if (this.props.openOnTargetFocus && this.isHoverInteractionKind()) {
            // if the next element to receive focus is within the popover, we'll want to leave the
            // popover open. we must do this check *after* the next element focuses, so we use a
            // timeout of 0 to flush the rest of the event queue before proceeding.
            this.setTimeout(() => {
                if (!this.isElementInPopover(document.activeElement)) {
                    this.handleMouseLeave(e);
                }
            }, 0);
        }
    }

    private handleMouseEnter = (e: React.SyntheticEvent<HTMLElement>) => {
        // if we're entering the popover, and the mode is set to be HOVER_TARGET_ONLY, we want to manually
        // trigger the mouse leave event, as hovering over the popover shouldn't count.
        if (this.props.inline
            && this.isElementInPopover(e.target as Element)
            && this.props.interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY
            && !this.props.openOnTargetFocus) {
            this.handleMouseLeave(e);
        } else if (!this.props.isDisabled) {
            // only begin opening popover when it is enabled
            this.setOpenState(true, e, this.props.hoverOpenDelay);
        }
    }

    private handleMouseLeave = (e: React.SyntheticEvent<HTMLElement>) => {
        // user-configurable closing delay is helpful when moving mouse from target to popover
        this.setOpenState(false, e, this.props.hoverCloseDelay);
    }

    private handlePopoverClick = (e: React.MouseEvent<HTMLElement>) => {
        const eventTarget = e.target as HTMLElement;
        const shouldDismiss = eventTarget.closest(`.${Classes.POPOVER_DISMISS}`) != null;
        const overrideDismiss = eventTarget.closest(`.${Classes.POPOVER_DISMISS_OVERRIDE}`) != null;
        if (shouldDismiss && !overrideDismiss) {
            this.setOpenState(false, e);
        }
    }

    private handleOverlayClose = (e: React.SyntheticEvent<HTMLElement>) => {
        const eventTarget = e.target as HTMLElement;
        // if click was in target, target event listener will handle things, so don't close
        if (!Utils.elementIsOrContains(this.targetElement, eventTarget)
                || e.nativeEvent instanceof KeyboardEvent) {
            this.setOpenState(false, e);
        }
    }

    private handleTargetClick = (e: React.MouseEvent<HTMLElement>) => {
        // ensure click did not originate from within inline popover before closing
        if (!this.props.isDisabled && !this.isElementInPopover(e.target as HTMLElement)) {
            if (this.props.isOpen == null) {
                this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
            } else {
                this.setOpenState(!this.props.isOpen, e);
            }
        }
    }

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
                Utils.safeInvoke(this.props.onInteraction, isOpen);
            }
            if (!isOpen) {
                Utils.safeInvoke(this.props.onClose, e);
            }
        }
    }

    private isElementInPopover(element: Element) {
        return this.popoverElement != null && this.popoverElement.contains(element);
    }

    private isHoverInteractionKind() {
        return this.props.interactionKind === PopoverInteractionKind.HOVER
            || this.props.interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY;
    }

    /** Popper modifier that updates React state (for style properties) based on latest data. */
    private updatePopoverState: Popper.ModifierFn = (data) => {
        // compute popover transform origin based on arrow offset
        const position = getPosition(data.placement);
        const arrowSizeShift = data.arrowElement.clientHeight / 2;
        const { arrow } = data.offsets;
        // can use keyword for dimension without the arrow, to ease computation burden.
        // move origin by half arrow's height to keep it centered.
        const transformOrigin = isVerticalPosition(position)
            ? `${getOppositePosition(position)} ${arrow.top + arrowSizeShift}px`
            : `${arrow.left + arrowSizeShift}px ${getOppositePosition(position)}`;

        // compute arrow rotation transform based on side
        const arrowRotation = `rotate(${getPositionRotation(position)}deg)`;

        // pretty sure it's safe to always set these (and let sCU determine) because they're both strings
        this.setState({ arrowRotation, transformOrigin });
        return data;
    }

    /** Popper modifier that offsets popper and arrow so arrow points out of the correct side */
    private arrowOffsetModifier: Popper.ModifierFn = (data) => {
        if (data.arrowElement == null) {
            return data;
        }
        // our arrows have equal width and height
        const arrowSize = data.arrowElement.clientWidth;
        // this logic borrowed from original Popper arrow modifier itself
        const position = getPosition(data.placement);
        const isVertical = isVerticalPosition(position);
        const len = isVertical ? "width" : "height";
        const offsetSide = isVertical ? "left" : "top";

        const arrowOffsetSize = Math.round(arrowSize / 2 / Math.sqrt(2));
        // offset popover by arrow size, offset arrow in the opposite direction
        if (position === "top" || position === "left") {
            // the "up & back" directions require negative popper offsets
            data.offsets.popper[offsetSide] -= arrowOffsetSize;
            // can only use left/top on arrow so gotta get clever with 100% + X
            data.offsets.arrow[offsetSide] = data.offsets.popper[len] - arrowSize + arrowOffsetSize;
        } else {
            data.offsets.popper[offsetSide] += arrowOffsetSize;
            data.offsets.arrow[offsetSide] = -arrowOffsetSize;
        }

        return data;
    }
}

/**
 * Converts a react child to an element: non-empty strings or numbers are wrapped in `<span>`;
 * empty strings are discarded.
 */
function ensureElement(child: React.ReactChild | undefined) {
    // wrap text in a <span> so children are always elements
    if (typeof child === "string") {
        // cull whitespace strings
        return child.trim().length > 0 ? <span>{child}</span> : undefined;
    } else if (typeof child === "number") {
        return <span>{child}</span>;
    } else {
        return child;
    }
}

//
// Popper Placement Utils
//

function getPosition(placement: Popper.Placement) {
    return placement.split("-")[0] as Popper.Position;
}

function isVerticalPosition(side: Popper.Position) {
    return ["left", "right"].indexOf(side) !== -1;
}

function getOppositePosition(side: Popper.Position) {
    switch (side) {
        case "top": return "bottom";
        case "left": return "right";
        case "bottom": return "top";
        default: return "left";
    }
}

function getPositionRotation(side: Popper.Position) {
    // can only be top/left/bottom/right - auto is resolved internally
    switch (side) {
        case "top": return -90;
        case "left": return 180;
        case "bottom": return 90;
        default: return 0;
    }
}
