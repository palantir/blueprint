/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { AbstractComponent, Classes, Intent, IProps } from "../../common";
import * as Errors from "../../common/errors";
import { Button } from "../button/buttons";
import { Dialog } from "../dialog/dialog";

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

    /** Name of the icon (the part after `pt-icon-`) to add next to the alert message */
    iconName?: string;

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

export class Alert extends AbstractComponent<IAlertProps, {}> {
    public static defaultProps: IAlertProps = {
        confirmButtonText: "OK",
        isOpen: false,
        onConfirm: null,
    };

    public static displayName = "Blueprint.Alert";

    public render() {
        const { children, className, intent, isOpen, confirmButtonText, onConfirm, style } = this.props;
        return (
            <Dialog className={classNames(Classes.ALERT, className)} isOpen={isOpen} style={style}>
                <div className={Classes.ALERT_BODY}>
                    {this.maybeRenderIcon()}
                    <div className={Classes.ALERT_CONTENTS}>
                        {children}
                    </div>
                </div>
                <div className={Classes.ALERT_FOOTER}>
                    <Button intent={intent} text={confirmButtonText} onClick={onConfirm} />
                    {this.maybeRenderSecondaryAction()}
                </div>
            </Dialog>
        );
    }

    protected validateProps(props: IAlertProps) {
        if (props.cancelButtonText != null && props.onCancel == null ||
            props.cancelButtonText == null && props.onCancel != null ) {
            throw new Error(Errors.ALERT_CANCEL_PROPS);
        }
    }

    private maybeRenderIcon() {
        const { iconName } = this.props;
        if (iconName != null) {
            const iconClass = classNames("pt-icon", Classes.iconClass(iconName));
            return <span className={iconClass} />;
        }
        return undefined;
    }

    private maybeRenderSecondaryAction() {
        if (this.props.cancelButtonText != null) {
            return <Button text={this.props.cancelButtonText} onClick={this.props.onCancel} />;
        }
        return undefined;
    }
}
