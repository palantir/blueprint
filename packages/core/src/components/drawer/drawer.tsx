/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { AbstractPureComponent } from "../../common/abstractPureComponent";
import * as Classes from "../../common/classes";
import * as Errors from "../../common/errors";
import { DISPLAYNAME_PREFIX, IProps } from "../../common/props";
import { Button } from "../button/buttons";
import { H4 } from "../html/html";
import { Icon, IconName } from "../icon/icon";
import { IBackdropProps, IOverlayableProps, Overlay } from "../overlay/overlay";

export interface IDrawerProps extends IOverlayableProps, IBackdropProps, IProps {
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
     * Toggles the visibility of the overlay and its children.
     * This prop is required because the component is controlled.
     */
    isOpen: boolean;

    /** Whether this drawer should use large styles. */
    large?: boolean;

    /** Whether this drawer should use small styles. */
    small?: boolean;

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

    /**
     * Whether the drawer should appear with vertical styling.
     * @default false
     */
    vertical?: boolean;
}

export class Drawer extends AbstractPureComponent<IDrawerProps, {}> {
    public static defaultProps: IDrawerProps = {
        canOutsideClickClose: true,
        isOpen: false,
        large: false,
        small: false,
        vertical: false,
    };

    public static displayName = `${DISPLAYNAME_PREFIX}.Drawer`;

    public render() {
        const classes = classNames(
            Classes.DRAWER,
            {
                [Classes.LARGE]: this.props.large,
                [Classes.SMALL]: this.props.small,
                [Classes.VERTICAL]: this.props.vertical,
            },
            this.props.className,
        );
        // small drawer should not use a backdrop
        return (
            <Overlay
                {...this.props}
                className={Classes.OVERLAY_CONTAINER}
                hasBackdrop={this.props.hasBackdrop || !this.props.small}
            >
                <div className={classes} style={this.props.style}>
                    {this.maybeRenderHeader()}
                    {this.props.children}
                </div>
            </Overlay>
        );
    }

    protected validateProps(props: IDrawerProps) {
        if (props.title == null) {
            if (props.icon != null) {
                console.warn(Errors.DIALOG_WARN_NO_HEADER_ICON);
            }
            if (props.isCloseButtonShown != null) {
                console.warn(Errors.DIALOG_WARN_NO_HEADER_CLOSE_BUTTON);
            }
        }
    }

    private maybeRenderCloseButton() {
        // show close button if prop is undefined or null
        // this gives us a behavior as if the default value were `true`
        if (this.props.isCloseButtonShown !== false) {
            return (
                <Button
                    aria-label="Close"
                    className={Classes.DIALOG_CLOSE_BUTTON}
                    icon={<Icon icon="small-cross" iconSize={Icon.SIZE_LARGE} />}
                    minimal={true}
                    onClick={this.props.onClose}
                />
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
            <div className={Classes.DRAWER_HEADER}>
                <Icon icon={icon} iconSize={Icon.SIZE_LARGE} />
                <H4>{title}</H4>
                {this.maybeRenderCloseButton()}
            </div>
        );
    }
}
