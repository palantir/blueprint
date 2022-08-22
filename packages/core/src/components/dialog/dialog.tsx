/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { AbstractPureComponent2, Classes } from "../../common";
import * as Errors from "../../common/errors";
import { DISPLAYNAME_PREFIX, MaybeElement, Props } from "../../common/props";
import { uniqueId } from "../../common/utils";
import { Button } from "../button/buttons";
import { H5 } from "../html/html";
import { Icon, IconName, IconSize } from "../icon/icon";
import { IBackdropProps, Overlay, OverlayableProps } from "../overlay/overlay";

// eslint-disable-next-line deprecation/deprecation
export type DialogProps = IDialogProps;
/** @deprecated use DialogProps */
export interface IDialogProps extends OverlayableProps, IBackdropProps, Props {
    /** Dialog contents. */
    children?: React.ReactNode;

    /**
     * Toggles the visibility of the overlay and its children.
     * This prop is required because the component is controlled.
     */
    isOpen: boolean;

    /**
     * Dialog always has a backdrop so this prop is excluded from the public API.
     *
     * @internal
     */
    hasBackdrop?: boolean;

    /**
     * Name of a Blueprint UI icon (or an icon element) to render in the
     * dialog's header. Note that the header will only be rendered if `title` is
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
     * Ref supplied to the `Classes.DIALOG_CONTAINER` element.
     */
    containerRef?: React.Ref<HTMLDivElement>;

    /**
     * ID of the element that contains title or label text for this dialog.
     *
     * By default, if the `title` prop is supplied, this component will generate
     * a unique ID for the `<H5>` title element and use that ID here.
     */
    "aria-labelledby"?: string;

    /**
     * ID of an element that contains description text inside this dialog.
     */
    "aria-describedby"?: string;
}

export class Dialog extends AbstractPureComponent2<DialogProps> {
    public static defaultProps: DialogProps = {
        canOutsideClickClose: true,
        isOpen: false,
    };

    private titleId: string;

    public static displayName = `${DISPLAYNAME_PREFIX}.Dialog`;

    public constructor(props: DialogProps) {
        super(props);

        const id = uniqueId("bp-dialog");
        this.titleId = `title-${id}`;
    }

    public render() {
        return (
            <Overlay {...this.props} className={Classes.OVERLAY_SCROLL_CONTAINER} hasBackdrop={true}>
                <div className={Classes.DIALOG_CONTAINER} ref={this.props.containerRef}>
                    <div
                        className={classNames(Classes.DIALOG, this.props.className)}
                        role="dialog"
                        aria-labelledby={this.props["aria-labelledby"] || (this.props.title ? this.titleId : undefined)}
                        aria-describedby={this.props["aria-describedby"]}
                        style={this.props.style}
                    >
                        {this.maybeRenderHeader()}
                        {this.props.children}
                    </div>
                </div>
            </Overlay>
        );
    }

    protected validateProps(props: DialogProps) {
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
                    icon={<Icon icon="cross" size={IconSize.STANDARD} />}
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
            <div className={Classes.DIALOG_HEADER}>
                <Icon icon={icon} size={IconSize.STANDARD} aria-hidden={true} tabIndex={-1} />
                <H5 id={this.titleId}>{title}</H5>
                {this.maybeRenderCloseButton()}
            </div>
        );
    }
}
