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
import { polyfill } from "react-lifecycles-compat";

import { AbstractPureComponent2, Classes, DISPLAYNAME_PREFIX, Intent, IProps, MaybeElement } from "../../common";
import {
    ALERT_WARN_CANCEL_ESCAPE_KEY,
    ALERT_WARN_CANCEL_OUTSIDE_CLICK,
    ALERT_WARN_CANCEL_PROPS,
} from "../../common/errors";
import { safeInvoke } from "../../common/utils";
import { Button } from "../button/buttons";
import { Dialog } from "../dialog/dialog";
import { Icon, IconName } from "../icon/icon";
import { IOverlayLifecycleProps } from "../overlay/overlay";

export interface IAlertProps extends IOverlayLifecycleProps, IProps {
    /**
     * Whether pressing <kbd>escape</kbd> when focused on the Alert should cancel the alert.
     * If this prop is enabled, then either `onCancel` or `onClose` must also be defined.
     * @default false
     */
    canEscapeKeyCancel?: boolean;

    /**
     * Whether clicking outside the Alert should cancel the alert.
     * If this prop is enabled, then either `onCancel` or `onClose` must also be defined.
     * @default false
     */
    canOutsideClickCancel?: boolean;

    /**
     * The text for the cancel button.
     * If this prop is defined, then either `onCancel` or `onClose` must also be defined.
     */
    cancelButtonText?: string;

    /**
     * The text for the confirm (right-most) button.
     * This button will always appear, and uses the value of the `intent` prop below.
     * @default "OK"
     */
    confirmButtonText?: string;

    /** Name of a Blueprint UI icon (or an icon element) to display on the left side. */
    icon?: IconName | MaybeElement;

    /**
     * The intent to be applied to the confirm (right-most) button.
     */
    intent?: Intent;

    /**
     * Toggles the visibility of the alert.
     * This prop is required because the component is controlled.
     */
    isOpen: boolean;

    /**
     * CSS styles to apply to the alert.
     */
    style?: React.CSSProperties;

    /**
     * Indicates how long (in milliseconds) the overlay's enter/leave transition takes.
     * This is used by React `CSSTransition` to know when a transition completes and must match
     * the duration of the animation in CSS. Only set this prop if you override Blueprint's default
     * transitions with new transitions of a different length.
     * @default 300
     */
    transitionDuration?: number;

    /**
     * The container element into which the overlay renders its contents, when `usePortal` is `true`.
     * This prop is ignored if `usePortal` is `false`.
     * @default document.body
     */
    portalContainer?: HTMLElement;

    /**
     * Handler invoked when the alert is canceled. Alerts can be **canceled** in the following ways:
     * - clicking the cancel button (if `cancelButtonText` is defined)
     * - pressing the escape key (if `canEscapeKeyCancel` is enabled)
     * - clicking on the overlay backdrop (if `canOutsideClickCancel` is enabled)
     *
     * If any of the `cancel` props are defined, then either `onCancel` or `onClose` must be defined.
     */
    onCancel?(evt?: React.SyntheticEvent<HTMLElement>): void;

    /**
     * Handler invoked when the confirm button is clicked. Alerts can be **confirmed** in the following ways:
     * - clicking the confirm button
     * - focusing on the confirm button and pressing `enter` or `space`
     */
    onConfirm?(evt?: React.SyntheticEvent<HTMLElement>): void;

    /**
     * Handler invoked when the Alert is confirmed or canceled; see `onConfirm` and `onCancel` for more details.
     * First argument is `true` if confirmed, `false` otherwise.
     * This is an alternative to defining separate `onConfirm` and `onCancel` handlers.
     */
    onClose?(confirmed: boolean, evt?: React.SyntheticEvent<HTMLElement>): void;
}

@polyfill
export class Alert extends AbstractPureComponent2<IAlertProps, {}> {
    public static defaultProps: IAlertProps = {
        canEscapeKeyCancel: false,
        canOutsideClickCancel: false,
        confirmButtonText: "OK",
        isOpen: false,
    };

    public static displayName = `${DISPLAYNAME_PREFIX}.Alert`;

    public render() {
        const {
            canEscapeKeyCancel,
            canOutsideClickCancel,
            children,
            className,
            icon,
            intent,
            cancelButtonText,
            confirmButtonText,
            onClose,
            ...overlayProps
        } = this.props;
        return (
            <Dialog
                {...overlayProps}
                className={classNames(Classes.ALERT, className)}
                canEscapeKeyClose={canEscapeKeyCancel}
                canOutsideClickClose={canOutsideClickCancel}
                onClose={this.handleCancel}
                portalContainer={this.props.portalContainer}
            >
                <div className={Classes.ALERT_BODY}>
                    <Icon icon={icon} iconSize={40} intent={intent} />
                    <div className={Classes.ALERT_CONTENTS}>{children}</div>
                </div>
                <div className={Classes.ALERT_FOOTER}>
                    <Button intent={intent} text={confirmButtonText} onClick={this.handleConfirm} />
                    {cancelButtonText && <Button text={cancelButtonText} onClick={this.handleCancel} />}
                </div>
            </Dialog>
        );
    }

    protected validateProps(props: IAlertProps) {
        if (props.onClose == null && (props.cancelButtonText == null) !== (props.onCancel == null)) {
            console.warn(ALERT_WARN_CANCEL_PROPS);
        }

        const hasCancelHandler = props.onCancel != null || props.onClose != null;
        if (props.canEscapeKeyCancel && !hasCancelHandler) {
            console.warn(ALERT_WARN_CANCEL_ESCAPE_KEY);
        }
        if (props.canOutsideClickCancel && !hasCancelHandler) {
            console.warn(ALERT_WARN_CANCEL_OUTSIDE_CLICK);
        }
    }

    private handleCancel = (evt: React.SyntheticEvent<HTMLElement>) => this.internalHandleCallbacks(false, evt);
    private handleConfirm = (evt: React.SyntheticEvent<HTMLElement>) => this.internalHandleCallbacks(true, evt);

    private internalHandleCallbacks(confirmed: boolean, evt?: React.SyntheticEvent<HTMLElement>) {
        const { onCancel, onClose, onConfirm } = this.props;
        safeInvoke(confirmed ? onConfirm : onCancel, evt);
        safeInvoke(onClose, confirmed, evt);
    }
}
