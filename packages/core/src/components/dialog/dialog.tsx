/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as React from "react";

import { AbstractComponent } from "../../common/abstractComponent";
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
     * Name of the icon (the part after `pt-icon-`) to appear in the dialog's header.
     * Note that the header will only be rendered if `title` is provided.
     */
    iconName?: IconName;

    /**
     * Whether to show the close button in the dialog's header.
     * Note that the header will only be rendered if `title` is provided.
     * @default true
     */
    isCloseButtonShown?: boolean;

    /**
     * CSS styles to apply to the dialog.
     * @default {}
     */
    style?: React.CSSProperties;

    /**
     * Title of the dialog.
     * If provided, a `.pt-dialog-header` element will be rendered inside the dialog
     * before any children elements.
     * In the next major version, this prop will be required.
     */
    title?: string | JSX.Element;

    /**
     * Name of the transition for internal `CSSTransitionGroup`.
     * Providing your own name here will require defining new CSS transition properties.
     */
    transitionName?: string;
}

export class Dialog extends AbstractComponent<IDialogProps, {}> {
    public static defaultProps: IDialogProps = {
        canOutsideClickClose: true,
        isOpen: false,
    };

    public static displayName = "Blueprint.Dialog";

    public render() {
        return (
            <Overlay {...this.props} className={Classes.OVERLAY_SCROLL_CONTAINER} hasBackdrop={true}>
                <div className={Classes.DIALOG_CONTAINER} onMouseDown={this.handleContainerMouseDown}>
                    <div className={classNames(Classes.DIALOG, this.props.className)} style={this.props.style}>
                        {this.maybeRenderHeader()}
                        {this.props.children}
                    </div>
                </div>
            </Overlay>
        );
    }

    protected validateProps(props: IDialogProps) {
        if (props.title == null) {
            if (props.iconName != null) {
                console.warn(Errors.DIALOG_WARN_NO_HEADER_ICON);
            }
            if (props.isCloseButtonShown != null) {
                console.warn(Errors.DIALOG_WARN_NO_HEADER_CLOSE_BUTTON);
            }
        }
    }

    private maybeRenderCloseButton() {
        // for now, show close button if prop is undefined or null
        // this gives us a behavior as if the default value were `true`
        if (this.props.isCloseButtonShown !== false) {
            const classes = classNames(Classes.DIALOG_CLOSE_BUTTON, Classes.iconClass("small-cross"));
            return <button aria-label="Close" className={classes} onClick={this.props.onClose} />;
        } else {
            return undefined;
        }
    }

    private maybeRenderHeader() {
        const { iconName, title } = this.props;
        if (title == null) {
            return undefined;
        }
        return (
            <div className={Classes.DIALOG_HEADER}>
                <Icon iconName={iconName} iconSize={20} />
                <h5>{title}</h5>
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
}

export const DialogFactory = React.createFactory(Dialog);
