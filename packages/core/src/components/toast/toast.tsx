/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { AbstractPureComponent } from "../../common/abstractPureComponent";
import * as Classes from "../../common/classes";
import { IActionProps, IIntentProps, ILinkProps, IProps } from "../../common/props";
import { safeInvoke } from "../../common/utils";
import { ButtonGroup } from "../button/buttonGroup";
import { AnchorButton, Button } from "../button/buttons";
import { Icon, IconName } from "../icon/icon";

export interface IToastProps extends IProps, IIntentProps {
    /**
     * Action rendered as a minimal `AnchorButton`. The toast is dismissed automatically when the
     * user clicks the action button. Note that the `intent` prop is ignored (the action button
     * cannot have its own intent color that might conflict with the toast's intent). Omit this
     * prop to omit the action button.
     */
    action?: IActionProps & ILinkProps;

    /** Name of a Blueprint UI icon (or an icon element) to render before the message. */
    icon?: IconName | JSX.Element;

    /** Message to display in the body of the toast. */
    message: string | JSX.Element;

    /**
     * Callback invoked when the toast is dismissed, either by the user or by the timeout.
     * The value of the argument indicates whether the toast was closed because the timeout expired.
     */
    onDismiss?: (didTimeoutExpire: boolean) => void;

    /**
     * Milliseconds to wait before automatically dismissing toast.
     * Providing a value less than or equal to 0 will disable the timeout (this is discouraged).
     * @default 5000
     */
    timeout?: number;
}

export class Toast extends AbstractPureComponent<IToastProps, {}> {
    public static defaultProps: IToastProps = {
        className: "",
        message: "",
        timeout: 5000,
    };

    public static displayName = "Blueprint2.Toast";

    public render(): JSX.Element {
        const { className, icon, intent, message } = this.props;
        return (
            <div
                className={classNames(Classes.TOAST, Classes.intentClass(intent), className)}
                onBlur={this.startTimeout}
                onFocus={this.clearTimeouts}
                onMouseEnter={this.clearTimeouts}
                onMouseLeave={this.startTimeout}
                tabIndex={0}
            >
                <Icon icon={icon} />
                <span className={Classes.TOAST_MESSAGE}>{message}</span>
                <ButtonGroup minimal={true}>
                    {this.maybeRenderActionButton()}
                    <Button icon="cross" onClick={this.handleCloseClick} />
                </ButtonGroup>
            </div>
        );
    }

    public componentDidMount() {
        this.startTimeout();
    }

    public componentDidUpdate(prevProps: IToastProps) {
        if (prevProps.timeout <= 0 && this.props.timeout > 0) {
            this.startTimeout();
        } else if (prevProps.timeout > 0 && this.props.timeout <= 0) {
            this.clearTimeouts();
        }
    }

    public componentWillUnmount() {
        this.clearTimeouts();
    }

    private maybeRenderActionButton() {
        const { action } = this.props;
        if (action == null) {
            return undefined;
        } else {
            return <AnchorButton {...action} intent={undefined} onClick={this.handleActionClick} />;
        }
    }

    private handleActionClick = (e: React.MouseEvent<HTMLElement>) => {
        safeInvoke(this.props.action.onClick, e);
        this.triggerDismiss(false);
    };

    private handleCloseClick = () => this.triggerDismiss(false);

    private triggerDismiss(didTimeoutExpire: boolean) {
        safeInvoke(this.props.onDismiss, didTimeoutExpire);
        this.clearTimeouts();
    }

    private startTimeout = () => {
        if (this.props.timeout > 0) {
            this.setTimeout(() => this.triggerDismiss(true), this.props.timeout);
        }
    };
}
