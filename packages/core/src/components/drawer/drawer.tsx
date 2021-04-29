/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

import classNames from "classnames";
import * as React from "react";
import { polyfill } from "react-lifecycles-compat";

import { AbstractPureComponent2, Classes } from "../../common";
import * as Errors from "../../common/errors";
import { getPositionIgnoreAngles, isPositionHorizontal, Position } from "../../common/position";
import { DISPLAYNAME_PREFIX, Props, MaybeElement } from "../../common/props";
import { Button } from "../button/buttons";
import { H4 } from "../html/html";
import { Icon, IconName, IconSize } from "../icon/icon";
import { IBackdropProps, OverlayableProps, Overlay } from "../overlay/overlay";

export enum DrawerSize {
    SMALL = "360px",
    STANDARD = "50%",
    LARGE = "90%",
}

// eslint-disable-next-line deprecation/deprecation
export type DrawerProps = IDrawerProps;
/** @deprecated use DrawerProps */
export interface IDrawerProps extends OverlayableProps, IBackdropProps, Props {
    /**
     * Name of a Blueprint UI icon (or an icon element) to render in the
     * drawer's header. Note that the header will only be rendered if `title` is
     * provided.
     */
    icon?: IconName | MaybeElement;

    /**
     * Whether to show the close button in the dialog's header.
     * Note that the header will only be rendered if `title` is provided.
     *
     * @default true
     */
    isCloseButtonShown?: boolean;

    /**
     * Toggles the visibility of the overlay and its children.
     * This prop is required because the component is controlled.
     */
    isOpen: boolean;

    /**
     * Position of a drawer. All angled positions will be casted into pure positions
     * (TOP, BOTTOM, LEFT or RIGHT).
     *
     * @default Position.RIGHT
     */
    position?: Position;

    /**
     * Whether the application should return focus to the last active element in the
     * document after this drawer closes.
     *
     * @default true
     */
    shouldReturnFocusOnClose?: boolean;

    /**
     * CSS size of the drawer. This sets `width` if `vertical={false}` (default)
     * and `height` otherwise.
     *
     * Constants are available for common sizes:
     * - `DrawerSize.SMALL = 360px`
     * - `DrawerSize.STANDARD = 50%`
     * - `DrawerSize.LARGE = 90%`
     *
     * @default DrawerSize.STANDARD = "50%"
     */
    size?: number | string;

    /**
     * CSS styles to apply to the dialog.
     *
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
     * It will be ignored if `position` prop is set
     *
     * @default false
     * @deprecated use `position` instead
     */
    vertical?: boolean;
}

@polyfill
export class Drawer extends AbstractPureComponent2<DrawerProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Drawer`;

    public static defaultProps: DrawerProps = {
        canOutsideClickClose: true,
        isOpen: false,
        shouldReturnFocusOnClose: true,
        style: {},
        vertical: false,
    };

    /** @deprecated use DrawerSize.SMALL */
    public static readonly SIZE_SMALL = DrawerSize.SMALL;

    /** @deprecated use DrawerSize.STANDARD */
    public static readonly SIZE_STANDARD = DrawerSize.STANDARD;

    /** @deprecated use DrawerSize.LARGE */
    public static readonly SIZE_LARGE = DrawerSize.LARGE;

    private lastActiveElementBeforeOpened: Element | null | undefined;

    public render() {
        // eslint-disable-next-line deprecation/deprecation
        const { size, style, position, vertical } = this.props;
        const realPosition = position ? getPositionIgnoreAngles(position) : undefined;

        const classes = classNames(
            Classes.DRAWER,
            {
                [Classes.VERTICAL]: !realPosition && vertical,
                [Classes.positionClass(realPosition) ?? ""]: true,
            },
            this.props.className,
        );

        const styleProp =
            size == null
                ? style
                : {
                      ...style,
                      [(realPosition ? isPositionHorizontal(realPosition) : vertical) ? "height" : "width"]: size,
                  };
        return (
            <Overlay
                {...this.props}
                className={Classes.OVERLAY_CONTAINER}
                onOpening={this.handleOpening}
                onClosed={this.handleClosed}
            >
                <div className={classes} style={styleProp}>
                    {this.maybeRenderHeader()}
                    {this.props.children}
                </div>
            </Overlay>
        );
    }

    protected validateProps(props: DrawerProps) {
        if (props.title == null) {
            if (props.icon != null) {
                console.warn(Errors.DIALOG_WARN_NO_HEADER_ICON);
            }
            if (props.isCloseButtonShown != null) {
                console.warn(Errors.DIALOG_WARN_NO_HEADER_CLOSE_BUTTON);
            }
        }
        if (props.position != null) {
            // eslint-disable-next-line deprecation/deprecation
            if (props.vertical) {
                console.warn(Errors.DRAWER_VERTICAL_IS_IGNORED);
            }
            if (props.position !== getPositionIgnoreAngles(props.position)) {
                console.warn(Errors.DRAWER_ANGLE_POSITIONS_ARE_CASTED);
            }
        }
    }

    private maybeRenderCloseButton() {
        // `isCloseButtonShown` can't be defaulted through default props because of props validation
        // so this check actually defaults it to true (fails only if directly set to false)
        if (this.props.isCloseButtonShown !== false) {
            return (
                <Button
                    aria-label="Close"
                    className={Classes.DIALOG_CLOSE_BUTTON}
                    icon={<Icon icon="small-cross" iconSize={IconSize.LARGE} />}
                    minimal={true}
                    onClick={this.props.onClose}
                />
            );
        } else {
            return null;
        }
    }

    private maybeRenderHeader() {
        const { icon, title } = this.props;
        if (title == null) {
            return null;
        }
        return (
            <div className={Classes.DRAWER_HEADER}>
                <Icon icon={icon} iconSize={IconSize.LARGE} />
                <H4>{title}</H4>
                {this.maybeRenderCloseButton()}
            </div>
        );
    }

    private handleOpening = (node: HTMLElement) => {
        this.lastActiveElementBeforeOpened = document.activeElement;
        this.props.onOpening?.(node);
    };

    private handleClosed = (node: HTMLElement) => {
        if (this.props.shouldReturnFocusOnClose && this.lastActiveElementBeforeOpened instanceof HTMLElement) {
            this.lastActiveElementBeforeOpened.focus();
        }
        this.props.onClosed?.(node);
    };
}
