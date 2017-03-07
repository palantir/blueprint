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
     */
    content?: JSX.Element | string;

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
     * @deprecated since v1.12.0; use `tetherOptions` instead.
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
     * Whether the popover should open when the target is focused (e.g. via a <kbd>Tab</kdb>-key press).
     * If `true`, the target will receive `tabindex="0"` to make it focusable.
     * Works with Tooltips only; attempting to enable this prop on a generic Popover will throw an error.
     * @default: false
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
     * Whether the popover will try to reposition itself
     * if there isn't room for it in its current position.
     * The popover will try to flip to the opposite side of the target element but
     * will not move to an adjacent side.
     * @default false
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
        content: <span/>,
        defaultIsOpen: false,
        hoverCloseDelay: 300,
        hoverOpenDelay: 150,
        inheritDarkTheme: true,
        inline: false,
        interactionKind: PopoverInteractionKind.CLICK,
        isDisabled: false,
        isModal: false,
        openOnTargetFocus: false,
        popoverClassName: "",
        position: PosUtils.Position.RIGHT,
        rootElementTag: "span",
        tetherOptions: {},
        transitionDuration: 300,
        useSmartArrowPositioning: true,
        useSmartPositioning: false,
    };

    public displayName = "Blueprint.Popover";

    private hasDarkParent = false;
    // a flag that is set to true while we are waiting for the underlying Portal to complete rendering
    private isContentMounting = false;
    private cancelOpenTimeout: () => void;
    private popoverElement: HTMLElement;
    private targetElement: HTMLElement;
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

        let isOpen = props.defaultIsOpen;
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
        let targetProps: React.HTMLProps<HTMLElement>;
        if (this.isHoverInteractionKind()) {
            targetProps = {
                onBlur: this.handleBlur,
                onFocus: this.handleFocus,
                onMouseEnter: this.handleMouseEnter,
                onMouseLeave: this.handleMouseLeave,
            };
        // any one of the CLICK* values
        } else {
            targetProps = {
                onBlur: this.handleBlur,
                onClick: this.handleTargetClick,
                onFocus: this.handleFocus,
            };
        }
        targetProps.className = classNames(Classes.POPOVER_TARGET, {
            [Classes.POPOVER_OPEN]: this.state.isOpen,
        }, className);
        targetProps.ref = this.refHandlers.target;

        const childrenBaseProps = this.shouldOpenOnTargetFocus() ? { tabIndex: 0 } : {};

        let children = this.props.children;
        if (typeof this.props.children === "string") {
            // wrap text in a <span> so that we have a consistent way to interact with the target node(s)
            children = React.DOM.span(childrenBaseProps, this.props.children);
        } else {
            const child = React.Children.only(this.props.children) as React.ReactElement<any>;
            // force disable single Tooltip child when popover is open (BLUEPRINT-552)
            if (this.state.isOpen && child.type === Tooltip) {
                children = React.cloneElement(child, { ...childrenBaseProps, isDisabled: true });
            }
        }

        return React.createElement(this.props.rootElementTag, targetProps, children,
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
                isOpen={this.state.isOpen}
                lazy={this.props.lazy}
                onClose={this.handleOverlayClose}
                transitionDuration={this.props.transitionDuration}
                transitionName={Classes.POPOVER}
            >
                {this.renderPopover()}
            </Overlay>,
        );
    }

    public componentDidMount() {
        this.componentDOMChange();
    }

    public componentWillReceiveProps(nextProps: IPopoverProps) {
        super.componentWillReceiveProps(nextProps);

        if (nextProps.isDisabled && !this.props.isDisabled) {
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
        if (props.isOpen == null && props.onInteraction != null) {
            console.warn(Errors.POPOVER_UNCONTROLLED_ONINTERACTION);
        }

        if (props.isOpen != null && props.isDisabled) {
            throw new Error(Errors.POPOVER_CONTROLLED_DISABLED);
        }

        if (props.isModal && props.interactionKind !== PopoverInteractionKind.CLICK) {
            throw new Error(Errors.POPOVER_MODAL_INTERACTION);
        }

        if (props.isModal && props.inline) {
            throw new Error(Errors.POPOVER_MODAL_INLINE);
        }

        if (props.useSmartPositioning && props.inline) {
            throw new Error(Errors.POPOVER_SMART_POSITIONING_INLINE);
        }

        if (typeof props.children !== "string") {
            try {
                React.Children.only(props.children);
            } catch (e) {
                throw new Error(Errors.POPOVER_ONE_CHILD);
            }

            // Arbitrary popover content is too unpredictable for us to forcibly steal focus from,
            // so enable this prop for Tooltips only.
            if (props.openOnTargetFocus && props.popoverClassName.split(" ").indexOf(Classes.TOOLTIP) < 0) {
                throw new Error(Errors.POPOVER_OPEN_ON_FOCUS_TOOLTIP);
            }
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

    private renderPopover() {
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
                        {this.props.content}
                    </div>
                </div>
            </div>
        );
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
        // if smart positioning is enabled then we must rely CSS classes to put transform origin
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

    private handleFocus = (e?: React.FormEvent<HTMLElement>) => {
        if (!this.shouldOpenOnTargetFocus()) {
            return;
        }
        const fakeClickEvent = e as React.MouseEvent<HTMLElement>;
        if (this.isHoverInteractionKind()) {
            this.handleMouseEnter(fakeClickEvent);
        } else {
            this.handleTargetClick(fakeClickEvent, /* isOpen */ true);
        }
    }

    private handleBlur = (e?: React.FormEvent<HTMLElement>) => {
        if (!this.shouldOpenOnTargetFocus()) {
            return;
        }
        const fakeClickEvent = e as React.MouseEvent<HTMLElement>;
        if (this.isHoverInteractionKind()) {
            this.handleMouseLeave(fakeClickEvent);
        } else {
            this.handleTargetClick(fakeClickEvent, /* isOpen */ false);
        }
    }

    private handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
        // if we're entering the popover, and the mode is set to be HOVER_TARGET_ONLY, we want to manually
        // trigger the mouse leave event, as hovering over the popover shouldn't count.
        if (this.props.inline
            && this.isElementInPopover(e.target as Element)
            && this.props.interactionKind === PopoverInteractionKind.HOVER_TARGET_ONLY) {
            this.handleMouseLeave(e);
        } else if (!this.props.isDisabled) {
            // only begin opening popover when it is enabled
            this.setOpenState(true, e, this.props.hoverOpenDelay);
        }
    }

    private handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
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

    private handleTargetClick = (e: React.MouseEvent<HTMLElement>, isOpen?: boolean) => {
        // ensure click did not originate from within inline popover before closing
        if (!this.props.isDisabled && !this.isElementInPopover(e.target as HTMLElement)) {
            if (isOpen != null) {
                this.setOpenState(isOpen, e);
            } else if (this.props.isOpen == null) {
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
            // the .pt-popover-target span we wrap the children in won't always be as big as its children
            // so instead, we'll position tether based off of its first child.
            // NOTE: use findDOMNode(this) directly because this.targetElement may not exist yet
            const target = findDOMNode(this).childNodes[0];

            // constraints is deprecated but must still be supported through tetherOptions until v2.0
            if (this.props.constraints != null) {
                this.props.tetherOptions.constraints = this.props.constraints;
            }

            const tetherOptions = TetherUtils.createTetherOptions(
                this.popoverElement, target, this.props.position,
                this.props.useSmartPositioning, this.props.tetherOptions,
            );
            if (this.tether == null) {
                this.tether = new Tether(tetherOptions);
            } else {
                this.tether.setOptions(tetherOptions);
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

    private shouldOpenOnTargetFocus() {
        // Overlay's autoFocus prop defaults to `true` when not defined, so we need to check that
        // the prop is explicitly false.
        return this.props.openOnTargetFocus && this.props.autoFocus === false;
    }
}

export const PopoverFactory = React.createFactory(Popover);
