/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as React from "react";

import { AbstractPureComponent, Classes, Intent, IProps } from "../../common";
import { ALERT_WARN_CANCEL_PROPS } from "../../common/errors";
import { Button } from "../button/buttons";
import { Dialog } from "../dialog/dialog";
import { Icon, IconName } from "../icon/icon";

export interface IAlertProps extends IProps {
    /**
     * The text for the cancel button.
     */
    cancelButtonText?: string;

    /**
     * The text for the confirm (right-most) button.
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
     * Handler invoked when the cancel button is clicked.
     */
    onCancel?(e: React.MouseEvent<HTMLButtonElement>): void;

    /**
     * Handler invoked when the confirm button is clicked.
     */
    onConfirm(e: React.MouseEvent<HTMLButtonElement>): void;
}

export class Alert extends AbstractPureComponent<IAlertProps, {}> {
    public static defaultProps: IAlertProps = {
        confirmButtonText: "OK",
        isOpen: false,
        onConfirm: null,
    };

    public static displayName = "Blueprint2.Alert";

    public render() {
        const { children, className, icon, intent, isOpen, confirmButtonText, onConfirm, style } = this.props;
        return (
            <Dialog className={classNames(Classes.ALERT, className)} isOpen={isOpen} style={style}>
                <div className={Classes.ALERT_BODY}>
                    <Icon icon={icon} iconSize={40} intent={intent} />
                    <div className={Classes.ALERT_CONTENTS}>{children}</div>
                </div>
                <div className={Classes.ALERT_FOOTER}>
                    <Button intent={intent} text={confirmButtonText} onClick={onConfirm} />
                    {this.maybeRenderSecondaryAction()}
                </div>
            </Dialog>
        );
    }

    protected validateProps(props: IAlertProps) {
        if (
            (props.cancelButtonText != null && props.onCancel == null) ||
            (props.cancelButtonText == null && props.onCancel != null)
        ) {
            console.warn(ALERT_WARN_CANCEL_PROPS);
        }
    }

    private maybeRenderSecondaryAction() {
        if (this.props.cancelButtonText != null) {
            return <Button text={this.props.cancelButtonText} onClick={this.props.onCancel} />;
        }
        return undefined;
    }
}
