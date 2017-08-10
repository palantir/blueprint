/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { AbstractComponent } from "../../common/abstractComponent";
import * as Classes from "../../common/classes";
import * as Errors from "../../common/errors";
import { IProps } from "../../common/props";
import { safeInvoke } from "../../common/utils";
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
    iconName?: string;

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
            <Overlay
                {...this.props}
                className={Classes.OVERLAY_SCROLL_CONTAINER}
                hasBackdrop={true}
            >
                <div className={Classes.DIALOG_CONTAINER} onMouseDown={this.handleContainerClick}>
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
        if (this.props.title == null) {
            return undefined;
        }

        let maybeIcon: JSX.Element;
        if (this.props.iconName != null) {
            maybeIcon = <span className={classNames(Classes.ICON_LARGE, Classes.iconClass(this.props.iconName))} />;
        }
        return (
            <div className={Classes.DIALOG_HEADER}>
                {maybeIcon}
                <h5>{this.props.title}</h5>
                {this.maybeRenderCloseButton()}
            </div>
        );
    }

    private handleContainerClick = (evt: React.MouseEvent<HTMLDivElement>) => {
        // quick re-implementation of canOutsideClickClose because .pt-dialog-container covers the backdrop
        if (this.props.canOutsideClickClose && evt.currentTarget.closest(`.${Classes.DIALOG}`) == null) {
            safeInvoke(this.props.onClose, evt);
        }
    }
}

export const DialogFactory = React.createFactory(Dialog);
