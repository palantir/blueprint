/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { AbstractPureComponent } from "../../common/abstractPureComponent";
import * as Classes from "../../common/classes";
import * as Errors from "../../common/errors";
import { IProps } from "../../common/props";
import { safeInvoke } from "../../common/utils";
import { Icon, IconName } from "../icon/icon";
import { IBackdropProps, IOverlayableProps, Overlay } from "../overlay/overlay";

export interface IDialogProps extends IOverlayableProps, IBackdropProps, IProps {
    /**
     * Toggles the visibility of the overlay and its children.
     * This prop is required because the component is controlled.
     */
    isOpen: boolean;

    /**
     * Dialog always has a backdrop so this prop is excluded from the public API.
     * @internal
     */
    hasBackdrop?: boolean;

    /**
     * Name of a Blueprint UI icon (or an icon element) to render in the
     * dialog's header. Note that the header will only be rendered if `title` is
     * provided.
     */
    icon?: IconName | JSX.Element;

    /**
     * Whether to show the close button in the dialog's header.
     * Note that the header will only be rendered if `title` is provided.
     * @default true
     */
    isCloseButtonShown?: boolean;

    /**
     * Whether to allow a user to maximize the dialog to full browser width and height.
     * This will be ignored if `usePortal` is false.
     * If true, a maximize button is shown in the dialog's header (which turns into a minimize button when the dialog is maximized).
     * The header will only be rendered if `title` is provided.
     * @default false
     */
    isMaximizeButtonShown?: boolean;

    /**
     * CSS styles to apply to the dialog.
     * @default {}
     */
    style?: React.CSSProperties;

    /**
     * Title of the dialog. If provided, an element with `Classes.DIALOG_HEADER`
     * will be rendered inside the dialog before any children elements.
     */
    title?: React.ReactNode;

    /**
     * Name of the transition for internal `CSSTransition`. Providing your own
     * name here will require defining new CSS transition properties.
     */
    transitionName?: string;
}

export interface IDialogState {
    /** Whether the dialog is currently maximized to cover the whole viewport. */
    isMaximized?: boolean;
}
export class Dialog extends AbstractPureComponent<IDialogProps, IDialogState> {
    public static defaultProps: IDialogProps = {
        canOutsideClickClose: true,
        isOpen: false,
    };

    public static displayName = "Blueprint2.Dialog";

    public constructor(props?: IDialogProps) {
        super(props);
        this.state = {
            isMaximized: false,
        };
    }

    public render() {
        const classes = classNames(
            Classes.DIALOG,
            {
                [Classes.DIALOG_MAXIMIZED]: this.state.isMaximized,
            },
            this.props.className,
        );

        return (
            <Overlay {...this.props} className={Classes.OVERLAY_SCROLL_CONTAINER} hasBackdrop={true}>
                <div className={Classes.DIALOG_CONTAINER} onMouseDown={this.handleContainerMouseDown}>
                    <div className={classes} style={this.props.style}>
                        {this.maybeRenderHeader()}
                        {this.props.children}
                    </div>
                </div>
            </Overlay>
        );
    }

    public componentDidUpdate(prevProps: IDialogProps) {
        if (!prevProps.isOpen) {
            this.setState({ isMaximized: false });
        }
    }

    protected validateProps(props: IDialogProps) {
        if (props.title == null) {
            if (props.icon != null) {
                console.warn(Errors.DIALOG_WARN_NO_HEADER_ICON);
            }
            if (props.isCloseButtonShown != null) {
                console.warn(Errors.DIALOG_WARN_NO_HEADER_CLOSE_BUTTON);
            }
            if (props.isMaximizeButtonShown) {
                console.warn(Errors.DIALOG_WARN_NO_HEADER_MAXIMIZE_BUTTON);
            }
        }

        if (!props.usePortal) {
            if (props.isMaximizeButtonShown) {
                console.warn(Errors.DIALOG_WARN_NO_HEADER_MAXIMIZE_BUTTON);
            }
        }
    }

    private maybeRenderCloseButton() {
        // show close button if prop is undefined or null
        // this gives us a behavior as if the default value were `true`
        if (this.props.isCloseButtonShown !== false) {
            return (
                <button aria-label="Close" className={Classes.DIALOG_CLOSE_BUTTON} onClick={this.props.onClose}>
                    <Icon icon="small-cross" iconSize={Icon.SIZE_LARGE} />
                </button>
            );
        } else {
            return undefined;
        }
    }

    private maybeRenderMaximizeButton() {
        // show maximize button if prop is true
        // this gives us a behavior as if the default value were `false`
        if (this.props.isMaximizeButtonShown !== false && this.props.usePortal === true) {
            const icon = this.state.isMaximized ? "minimize" : "maximize";
            const title = this.state.isMaximized ? "Minimize" : "Maximize";
            const classes = classNames(Classes.DIALOG_MAX_MIN_BUTTON, {
                [Classes.DIALOG_HAS_BUTTON_ON_THE_RIGHT]: this.props.isCloseButtonShown !== false,
            });
            return (
                <button aria-label={title} className={classes} onClick={this.handleMaximizeButtonMouseDown}>
                    <Icon icon={icon} iconSize={Icon.SIZE_STANDARD} />
                </button>
            );
        } else {
            return undefined;
        }
    }

    private maybeRenderHeader() {
        const { icon, title } = this.props;
        if (title == null) {
            return undefined;
        }
        return (
            <div className={Classes.DIALOG_HEADER}>
                <Icon icon={icon} iconSize={Icon.SIZE_LARGE} />
                <h4 className={Classes.DIALOG_HEADER_TITLE}>{title}</h4>
                {this.maybeRenderMaximizeButton()}
                {this.maybeRenderCloseButton()}
            </div>
        );
    }

    private handleContainerMouseDown = (evt: React.MouseEvent<HTMLDivElement>) => {
        // quick re-implementation of canOutsideClickClose because .pt-dialog-container covers the backdrop
        const isClickOutsideDialog = (evt.target as HTMLElement).closest(`.${Classes.DIALOG}`) == null;
        if (isClickOutsideDialog && this.props.canOutsideClickClose) {
            safeInvoke(this.props.onClose, evt);
        }
    };

    private handleMaximizeButtonMouseDown = (): void => {
        this.setState({
            isMaximized: !this.state.isMaximized,
        });
    };
}
