/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";
import * as CSSTransitionGroup from "react-addons-css-transition-group";

import * as Classes from "../../common/classes";
import * as Keys from "../../common/keys";
import { IProps } from "../../common/props";
import { safeInvoke } from "../../common/utils";
import { Portal } from "../portal/portal";

export interface IOverlayableProps {
    /**
     * Whether the overlay should acquire application focus when it first opens.
     * @default true
     */
    autoFocus?: boolean;

    /**
     * Whether pressing the `esc` key should invoke `onClose`.
     * @default true
     */
    canEscapeKeyClose?: boolean;

    /**
     * Whether the overlay should prevent focus from leaving itself. That is, if the user attempts
     * to focus an element outside the overlay and this prop is enabled, then the overlay will
     * immediately bring focus back to itself. If you are nesting overlay components, either disable
     * this prop on the "outermost" overlays or mark the nested ones `inline={true}`.
     * @default true
     */
    enforceFocus?: boolean;

    /**
     * Whether the overlay should be rendered inline or into a new element on `document.body`.
     * This prop essentially determines which element is covered by the backdrop: if `true`,
     * then only its parent is covered; otherwise, the entire application is covered.
     * Set this prop to `true` when this component is used inside an `Overlay` (such as
     * `Dialog` or `Popover`) to ensure that this component is rendered above its parent.
     * @default false
     */
    inline?: boolean;

    /**
     * If `true` and not `inline`, the `Portal` containing the children is created and attached
     * to the DOM when the overlay is opened for the first time; otherwise this happens when the
     * component mounts. Lazy mounting provides noticeable performance improvements if you have lots
     * of overlays at once, such as on each row of a table.
     * @default true
     */
    lazy?: boolean;

    /**
     * Indicates how long (in milliseconds) the overlay's enter/leave transition takes.
     * This is used by React `CSSTransitionGroup` to know when a transition completes and must match
     * the duration of the animation in CSS. Only set this prop if you override Blueprint's default
     * transitions with new transitions of a different length.
     * @default 300
     */
    transitionDuration?: number;

    /**
     * A callback that is invoked when user interaction causes the overlay to close, such as
     * clicking on the overlay or pressing the `esc` key (if enabled).
     * Receives the event from the user's interaction, if there was an event (generally either a
     * mouse or key event). Note that, since this component is controlled by the `isOpen` prop, it
     * will not actually close itself until that prop becomes `false`.
     */
    onClose?(event?: React.SyntheticEvent<HTMLElement>): void;
}

export interface IBackdropProps {
    /** CSS class names to apply to backdrop element. */
    backdropClassName?: string;

    /** HTML props for the backdrop element. */
    backdropProps?: React.HTMLProps<HTMLDivElement>;

    /**
     * Whether clicking outside the overlay element (either on backdrop when present or on document)
     * should invoke `onClose`.
     * @default true
     */
    canOutsideClickClose?: boolean;

    /**
     * Whether a container-spanning backdrop element should be rendered behind the contents.
     * @default true
     */
    hasBackdrop?: boolean;
}

export interface IOverlayProps extends IOverlayableProps, IBackdropProps, IProps {
    /** Lifecycle callback invoked after the overlay opens and is mounted in the DOM. */
    didOpen?: () => any;

    /**
     * Toggles the visibility of the overlay and its children.
     * This prop is required because the component is controlled.
     */
    isOpen: boolean;

    /**
     * Name of the transition for internal `CSSTransitionGroup`.
     * Providing your own name here will require defining new CSS transition properties.
     * @default "pt-overlay"
     */
    transitionName?: string;
}

export interface IOverlayState {
    hasEverOpened?: boolean;
}

@PureRender
export class Overlay extends React.Component<IOverlayProps, IOverlayState> {
    public static displayName = "Blueprint.Overlay";

    public static defaultProps: IOverlayProps = {
        autoFocus: true,
        backdropProps: {},
        canEscapeKeyClose: true,
        canOutsideClickClose: true,
        enforceFocus: true,
        hasBackdrop: true,
        inline: false,
        isOpen: false,
        lazy: true,
        transitionDuration: 300,
        transitionName: "pt-overlay",
    };

    private static openStack: Overlay[] = [];
    private static getLastOpened = () => Overlay.openStack[Overlay.openStack.length - 1];

    // an HTMLElement that contains the backdrop and any children, to query for focus target
    private containerElement: HTMLElement;
    private refHandlers = {
        container: (ref: HTMLDivElement) => this.containerElement = ref,
    };

    public constructor(props?: IOverlayProps, context?: any) {
        super(props, context);
        this.state = { hasEverOpened: props.isOpen };
    }

    public render() {
        // oh snap! no reason to render anything at all if we're being truly lazy
        if (this.props.lazy && !this.state.hasEverOpened) {
            return null;
        }

        const { children, className, inline, isOpen, transitionDuration, transitionName } = this.props;

        // add a special class to each child that will automatically set the appropriate
        // CSS position mode under the hood. also, make the container focusable so we can
        // trap focus inside it (via `enforceFocus`).
        const decoratedChildren = React.Children.map(children, (child: React.ReactElement<any>) => {
            return React.cloneElement(child, {
                className: classNames(child.props.className, Classes.OVERLAY_CONTENT),
                tabIndex: 0,
            });
        });

        const transitionGroup = (
            <CSSTransitionGroup
                transitionAppear={true}
                transitionAppearTimeout={transitionDuration}
                transitionEnterTimeout={transitionDuration}
                transitionLeaveTimeout={transitionDuration}
                transitionName={transitionName}
            >
                {this.maybeRenderBackdrop()}
                {isOpen ? decoratedChildren : null}
            </CSSTransitionGroup>
        );

        const mergedClassName = classNames(Classes.OVERLAY, {
            [Classes.OVERLAY_OPEN]: isOpen,
            [Classes.OVERLAY_INLINE]: inline,
        }, className);

        const elementProps = {
            className: mergedClassName,
            onKeyDown: this.handleKeyDown,
        };

        if (inline) {
            return <span {...elementProps} ref={this.refHandlers.container}>{transitionGroup}</span>;
        } else {
            return (
                <Portal
                    {...elementProps}
                    containerRef={this.refHandlers.container}
                    onChildrenMount={this.handleContentMount}
                >
                    {transitionGroup}
                </Portal>
            );
        }
    }

    public componentDidMount() {
        if (this.props.isOpen) {
            this.overlayWillOpen();
        }
    }

    public componentWillReceiveProps(nextProps: IOverlayProps) {
        this.setState({ hasEverOpened: this.state.hasEverOpened || nextProps.isOpen });
    }

    public componentDidUpdate(prevProps: IOverlayProps) {
        if (prevProps.isOpen && !this.props.isOpen) {
            this.overlayWillClose();
        } else if (!prevProps.isOpen && this.props.isOpen) {
            this.overlayWillOpen();
        }
    }

    public componentWillUnmount() {
        this.overlayWillClose();
    }

    private maybeRenderBackdrop() {
        const { backdropClassName, backdropProps, hasBackdrop, isOpen } = this.props;
        if (hasBackdrop && isOpen) {
            return (
                <div
                    {...backdropProps}
                    className={classNames(Classes.OVERLAY_BACKDROP, backdropClassName, backdropProps.className)}
                    onMouseDown={this.handleBackdropMouseDown}
                    tabIndex={this.props.canOutsideClickClose ? 0 : null}
                />
            );
        } else {
            return undefined;
        }
    }

    private overlayWillClose() {
        document.removeEventListener("focus", this.handleDocumentFocus, /* useCapture */ true);
        document.removeEventListener("mousedown", this.handleDocumentClick);

        document.body.classList.remove(Classes.OVERLAY_OPEN);

        const { openStack } = Overlay;
        const stackIndex = openStack.indexOf(this);
        if (stackIndex !== -1) {
            openStack.splice(stackIndex, 1);
            const lastOpenedOverlay = Overlay.getLastOpened();
            if (openStack.length > 0 && lastOpenedOverlay.props.enforceFocus) {
                document.addEventListener("focus", lastOpenedOverlay.handleDocumentFocus, /* useCapture */ true);
            }
        }
    }

    private overlayWillOpen() {
        const { openStack } = Overlay;
        if (openStack.length > 0) {
            document.removeEventListener("focus", Overlay.getLastOpened().handleDocumentFocus, /* useCapture */ true);
        }
        openStack.push(this);

        if (this.props.canOutsideClickClose && !this.props.hasBackdrop) {
            document.addEventListener("mousedown", this.handleDocumentClick);
        }
        if (this.props.enforceFocus) {
            document.addEventListener("focus", this.handleDocumentFocus, /* useCapture */ true);
        }
        if (this.props.inline) {
            safeInvoke(this.props.didOpen);
            if (this.props.autoFocus) {
                this.bringFocusInsideOverlay();
            }
        } else if (this.props.hasBackdrop) {
            // add a class to the body to prevent scrolling of content below the overlay
            document.body.classList.add(Classes.OVERLAY_OPEN);
        }
    }

    private bringFocusInsideOverlay = () => {
        const { containerElement } = this;

        // container ref may be undefined between component mounting and Portal rendering
        // activeElement may be undefined in some rare cases in IE
        if (containerElement == null || document.activeElement == null || !this.props.isOpen) {
            return;
        }

        const isFocusOutsideModal = !containerElement.contains(document.activeElement);
        if (isFocusOutsideModal) {
            // element marked autofocus has higher priority than the other clowns
            const autofocusElement = containerElement.query("[autofocus]") as HTMLElement;
            const wrapperElement = containerElement.query("[tabindex]") as HTMLElement;
            if (autofocusElement != null) {
                autofocusElement.focus();
            } else if (wrapperElement != null) {
                wrapperElement.focus();
            }
        }
    }

    private handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (this.props.canOutsideClickClose) {
            safeInvoke(this.props.onClose, e);
        }
        safeInvoke(this.props.backdropProps.onMouseDown, e);
    }

    private handleDocumentClick = (e: MouseEvent) => {
        const { isOpen, onClose } = this.props;
        const eventTarget = e.target as HTMLElement;
        const isClickInOverlay = this.containerElement != null
            && this.containerElement.contains(eventTarget);
        if (isOpen && this.props.canOutsideClickClose && !isClickInOverlay) {
            // casting to any because this is a native event
            safeInvoke(onClose, e as any);
        }
    }

    private handleContentMount = () => {
        if (this.props.isOpen) {
            safeInvoke(this.props.didOpen);
        }
        if (this.props.autoFocus) {
            this.bringFocusInsideOverlay();
        }
    }

    private handleDocumentFocus = (e: FocusEvent) => {
        if (this.props.enforceFocus
                && this.containerElement != null
                && !this.containerElement.contains(e.target as HTMLElement)) {
            e.stopImmediatePropagation();
            this.bringFocusInsideOverlay();
        }
    }

    private handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        const { canEscapeKeyClose, onClose } = this.props;
        if (e.which === Keys.ESCAPE && canEscapeKeyClose) {
            safeInvoke(onClose, e);
            // prevent browser-specific escape key behavior (Safari exits fullscreen)
            e.preventDefault();
        }
    }
}

export const OverlayFactory = React.createFactory(Overlay);
