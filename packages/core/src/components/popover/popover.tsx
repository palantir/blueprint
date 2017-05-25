/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";
import { findDOMNode } from "react-dom";
import * as Tether from "tether";

import { AbstractComponent } from "../../common/abstractComponent";
import * as Classes from "../../common/classes";
import * as Errors from "../../common/errors";
import * as PosUtils from "../../common/position";
import { IProps } from "../../common/props";
import * as TetherUtils from "../../common/tetherUtils";
import * as Utils from "../../common/utils";
import { IOverlayableProps, Overlay } from "../overlay/overlay";
import { Tooltip } from "../tooltip/tooltip";

import * as Arrows from "./arrows";

const SVG_SHADOW_PATH = "M8.11 6.302c1.015-.936 1.887-2.922 1.887-4.297v26c0-1.378" +
    "-.868-3.357-1.888-4.297L.925 17.09c-1.237-1.14-1.233-3.034 0-4.17L8.11 6.302z";
const SVG_ARROW_PATH = "M8.787 7.036c1.22-1.125 2.21-3.376 2.21-5.03V0v30-2.005" +
    "c0-1.654-.983-3.9-2.21-5.03l-7.183-6.616c-.81-.746-.802-1.96 0-2.7l7.183-6.614z";

const SMART_POSITIONING = {
    attachment: "together",
    to: "scrollParent",
};

export enum PopoverInteractionKind {
    CLICK,
    CLICK_TARGET_ONLY,
    HOVER,
    HOVER_TARGET_ONLY,
}

export interface IPopoverProps extends IOverlayableProps, IProps {
    /** HTML props for the backdrop element. Can be combined with `backdropClassName`. */
    backdropProps?: React.HTMLProps<HTMLDivElement>;

    /**
     * The content displayed inside the popover.
     * This can instead be provided as the second `children` element (first is `target`).
     */
    content?: string | JSX.Element;

    /**
     * The length of a side of the square used to render the arrow.
     * @default 30
     * @internal
     */
    arrowSize?: number;

    /**
     * Constraints for the underlying Tether instance.
     * If defined, this will overwrite `tetherOptions.constraints`.
     * See http://tether.io/#constraints.
     * @deprecated since v1.12.0; use `tetherOptions.constraints` instead.
     */
    constraints?: TetherUtils.ITetherConstraint[];

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
     * @default Blueprint.Common.Position.RIGHT
     */
    position?: PosUtils.Position;

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

    /**
     * Options for the underlying Tether instance.
     * See http://tether.io/#options
     */
    tetherOptions?: Partial<Tether.ITetherOptions>;

    /**
     * Whether the arrow's offset should be computed such that it always points at the center
     * of the target. If false, arrow position is hardcoded via CSS, which expects a 30px target.
     * @default true
     */
    useSmartArrowPositioning?: boolean;

    /**
     * Whether the popover will flip to the opposite side of the target element if there is not
     * enough room in the viewport. This is equivalent to:
     * ```
     * const tetherOptions = {
     *     constraints: [{ attachment: "together", to: "scrollParent" }]
     * };
     * ```
     * @default false
     * @deprecated since v1.15.0; use `tetherOptions.constraints` directly.
     */
    useSmartPositioning?: boolean;
}

export interface IPopoverState {
    isOpen?: boolean;
    ignoreTargetDimensions?: boolean;
    targetHeight?: number;
    targetWidth?: number;
}

@PureRender
export class Popover extends AbstractComponent<IPopoverProps, IPopoverState> {
    public static defaultProps: IPopoverProps = {
        arrowSize: 30,
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
        position: PosUtils.Position.RIGHT,
        rootElementTag: "span",
        transitionDuration: 300,
        useSmartArrowPositioning: true,
        useSmartPositioning: false,
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
    private tether: Tether;

    private refHandlers = {
        popover: (ref: HTMLDivElement) => {
            this.popoverElement = ref;
            this.updateTether();
            this.updateArrowPosition();
        },
        target: (ref: HTMLElement) => {
            this.targetElement = ref;
        },
    };

    public constructor(props?: IPopoverProps, context?: any) {
        super(props, context);

        let isOpen = props.defaultIsOpen && !props.isDisabled;
        if (props.isOpen != null) {
            isOpen = props.isOpen;
        }

        this.state = {
            isOpen,
            ignoreTargetDimensions: false,
            targetHeight: 0,
            targetWidth: 0,
        };
    }

    public render() {
        const { className } = this.props;
        const { isOpen } = this.state;

        let targetProps: React.HTMLProps<HTMLElement>;
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
        targetProps.ref = this.refHandlers.target;

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
            console.warn(Errors.POPOVER_WARN_EMPTY_CONTENT);
        }

        return React.createElement(this.props.rootElementTag, targetProps, target,
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
                lazy={this.props.lazy}
                onClose={this.handleOverlayClose}
                transitionDuration={this.props.transitionDuration}
                transitionName={Classes.POPOVER}
            >
                {this.renderPopover(children.content)}
            </Overlay>,
        );
    }

    public componentDidMount() {
        this.componentDOMChange();
    }

    public componentWillReceiveProps(nextProps: IPopoverProps) {
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

    public componentWillUpdate(_: IPopoverProps, nextState: IPopoverState) {
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
        this.destroyTether();
    }

    protected validateProps(props: IPopoverProps & {children?: React.ReactNode}) {
        if (props.useSmartPositioning || props.constraints != null) {
            console.warn(Errors.POPOVER_WARN_DEPRECATED_CONSTRAINTS);
        }
        if (props.isOpen == null && props.onInteraction != null) {
            console.warn(Errors.POPOVER_WARN_UNCONTROLLED_ONINTERACTION);
        }
        if (props.inline && (props.useSmartPositioning || props.constraints != null || props.tetherOptions != null)) {
            console.warn(Errors.POPOVER_WARN_INLINE_NO_TETHER);
        }
        if (props.isModal && props.inline) {
            console.warn(Errors.POPOVER_WARN_MODAL_INLINE);
        }

        if (props.isModal && props.interactionKind !== PopoverInteractionKind.CLICK) {
            throw new Error(Errors.POPOVER_MODAL_INTERACTION);
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

    private componentDOMChange() {
        if (this.props.useSmartArrowPositioning) {
            this.setState({
                targetHeight: this.targetElement.clientHeight,
                targetWidth: this.targetElement.clientWidth,
            });
        }
        if (!this.props.inline) {
            this.hasDarkParent = this.targetElement.closest(`.${Classes.DARK}`) != null;
            this.updateTether();
        }
    }

    private renderPopover(content: JSX.Element) {
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

        const positionClasses = TetherUtils.getAttachmentClasses(this.props.position).join(" ");
        const containerClasses = classNames(Classes.TRANSITION_CONTAINER, { [positionClasses]: inline });
        const popoverClasses = classNames(Classes.POPOVER, {
            [Classes.DARK]: this.props.inheritDarkTheme && this.hasDarkParent && !inline,
        }, this.props.popoverClassName);

        const styles = this.getArrowPositionStyles();
        const transform = { transformOrigin: this.getPopoverTransformOrigin() };

        return (
            <div className={containerClasses} ref={this.refHandlers.popover} style={styles.container}>
                <div className={popoverClasses} style={transform} {...popoverHandlers}>
                    <div className={Classes.POPOVER_ARROW} style={styles.arrow}>
                        <svg viewBox="0 0 30 30">
                            <path className={Classes.POPOVER_ARROW + "-border"} d={SVG_SHADOW_PATH} />
                            <path className={Classes.POPOVER_ARROW + "-fill"} d={SVG_ARROW_PATH} />
                        </svg>
                    </div>
                    <div className={Classes.POPOVER_CONTENT}>
                        {content}
                    </div>
                </div>
            </div>
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

    private getArrowPositionStyles(): { arrow?: React.CSSProperties, container?: React.CSSProperties } {
        if (this.props.useSmartArrowPositioning) {
            const dimensions = { height: this.state.targetHeight, width: this.state.targetWidth };
            return Arrows.getArrowPositionStyles(this.props.position,
                this.props.arrowSize, this.state.ignoreTargetDimensions, dimensions, this.props.inline);
        } else {
            return {};
        }
    }

    private getPopoverTransformOrigin(): string {
        // if smart positioning is enabled then we must rely on CSS classes to put transform origin
        // on the correct side and cannot override it in JS. (https://github.com/HubSpot/tether/issues/154)
        if (this.props.useSmartArrowPositioning && !this.props.useSmartPositioning) {
            const dimensions = { height: this.state.targetHeight, width: this.state.targetWidth };
            return Arrows.getPopoverTransformOrigin(this.props.position,
                this.props.arrowSize, dimensions);
        } else {
            return undefined;
        }
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
                const { popoverElement } = this;
                if (popoverElement == null || !popoverElement.contains(document.activeElement)) {
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

    private updateArrowPosition() {
        if (this.popoverElement != null) {
            const arrow = this.popoverElement.getElementsByClassName(Classes.POPOVER_ARROW)[0] as HTMLElement;
            const centerWidth = (this.state.targetWidth + arrow.clientWidth) / 2;
            const centerHeight = (this.state.targetHeight + arrow.clientHeight) / 2;

            const ignoreWidth = centerWidth > this.popoverElement.clientWidth
                && PosUtils.isPositionHorizontal(this.props.position);
            const ignoreHeight = centerHeight > this.popoverElement.clientHeight
                && PosUtils.isPositionVertical(this.props.position);

            if (!this.state.ignoreTargetDimensions && (ignoreWidth || ignoreHeight)) {
                this.setState({ignoreTargetDimensions: true});
            } else if (this.state.ignoreTargetDimensions && !ignoreWidth && !ignoreHeight) {
                this.setState({ignoreTargetDimensions: false});
            }
        }
    }

    private updateTether() {
        if (this.state.isOpen && !this.props.inline && this.popoverElement != null) {
            const { constraints, position, tetherOptions = {}, useSmartPositioning } = this.props;

            // the .pt-popover-target span we wrap the children in won't always be as big as its children
            // so instead, we'll position tether based off of its first child.
            // NOTE: use findDOMNode(this) directly because this.targetElement may not exist yet
            const target = findDOMNode(this).childNodes[0];

            // constraints is deprecated but must still be supported through tetherOptions until v2.0
            const options = (constraints == null && !useSmartPositioning)
                ? tetherOptions
                : {
                    ...tetherOptions,
                    constraints: useSmartPositioning ? [SMART_POSITIONING] : constraints,
                };

            const finalTetherOptions =
                TetherUtils.createTetherOptions(this.popoverElement, target, position, options);
            if (this.tether == null) {
                this.tether = new Tether(finalTetherOptions);
            } else {
                this.tether.setOptions(finalTetherOptions);
            }

            // if props.position has just changed, Tether unfortunately positions the popover based
            // on the margins from the previous position. delay a frame for styles to catch up.
            setTimeout(() => this.tether.position());
        } else {
            this.destroyTether();
        }
    }

    private destroyTether() {
        if (this.tether != null) {
            this.tether.destroy();
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

export const PopoverFactory = React.createFactory(Popover);
