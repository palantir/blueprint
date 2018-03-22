/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { AbstractPureComponent, Classes, Intent, IProps } from "../../common";
import {
    ALERT_WARN_CANCEL_ESCAPE_KEY,
    ALERT_WARN_CANCEL_OUTSIDE_CLICK,
    ALERT_WARN_CANCEL_PROPS,
} from "../../common/errors";
import { safeInvoke } from "../../common/utils";
import { Button } from "../button/buttons";
import { Dialog } from "../dialog/dialog";
import { Icon, IconName } from "../icon/icon";

export interface IAlertProps extends IProps {
    /**
     * Whether pressing <kbd class="pt-key">escape</kbd> when focused on the Alert should cancel the alert.
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
    icon?: IconName | JSX.Element;

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

export class Alert extends AbstractPureComponent<IAlertProps, {}> {
    public static defaultProps: IAlertProps = {
        canEscapeKeyCancel: false,
        canOutsideClickCancel: false,
        confirmButtonText: "OK",
        isOpen: false,
    };

    public static displayName = "Blueprint2.Alert";

    public render() {
        const { children, className, icon, intent, cancelButtonText, confirmButtonText } = this.props;
        return (
            <Dialog
                className={classNames(Classes.ALERT, className)}
                canEscapeKeyClose={this.props.canEscapeKeyCancel}
                canOutsideClickClose={this.props.canOutsideClickCancel}
                isOpen={this.props.isOpen}
                onClose={this.handleCancel}
                style={this.props.style}
                transitionDuration={this.props.transitionDuration}
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
