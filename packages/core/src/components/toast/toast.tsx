/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IActionProps, IIntentProps, IProps } from "../../common/props";
import { safeInvoke } from "../../common/utils";
import { Button } from "../button/buttons";

export interface IToastProps extends IProps, IIntentProps {
    /**
     * Action to display in a minimal button. The toast is dismissed automatically when the
     * user clicks the action button. Note that the `intent` prop is ignored (the action button
     * cannot have its own intent color that might conflict with the toast's intent). Omit this
     * prop to omit the action button.
     */
    action?: IActionProps;

    /** Name of icon to appear before message. Specify only the part of the name after `pt-icon-`. */
    iconName?: string;

    /** Message to display in the body of the toast. */
    message: string | JSX.Element;

    /**
     * Callback invoked when the toast is dismissed, either by the user or by the timeout.
     * The value of the argument indicates whether the toast was closed because the timeout expired.
     */
    onDismiss?: (didTimeoutExpire: boolean) => void;

    /**
     * Milliseconds to wait before automatically dismissing toast.
     * Providing a value <= 0 will disable the timeout (this is discouraged).
     * @default 5000
     */
    timeout?: number;
}

@PureRender
export class Toast extends React.Component<IToastProps, {}> {
    public static defaultProps: IToastProps = {
        className: "",
        message: "",
        timeout: 5000,
    };

    public displayName = "Blueprint.Toast";

    private timeoutId: number;

    public render(): JSX.Element {
        const { className, intent, message } = this.props;
        return (
            <div
                className={classNames(Classes.TOAST, Classes.intentClass(intent), className)}
                onBlur={this.startTimeout}
                onFocus={this.clearTimeout}
                onMouseEnter={this.clearTimeout}
                onMouseLeave={this.startTimeout}
            >
                {this.maybeRenderIcon()}
                <span className={Classes.TOAST_MESSAGE}>{message}</span>
                <div className={classNames(Classes.BUTTON_GROUP, Classes.MINIMAL)}>
                    {this.maybeRenderActionButton()}
                    <Button iconName="cross" onClick={this.handleCloseClick} />
                </div>
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
            this.clearTimeout();
        }
    }

    public componentWillUnmount() {
        this.clearTimeout();
    }

    private maybeRenderActionButton() {
        const { action } = this.props;
        return action == null ? undefined : <Button {...action} intent={null} onClick={this.handleActionClick} />;
    }

    private maybeRenderIcon() {
        const { iconName } = this.props;
        if (iconName == null) {
            return undefined;
        } else {
            return <span className={classNames(Classes.ICON_STANDARD, Classes.iconClass(iconName))} />;
        }
    }

    private handleActionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        safeInvoke(this.props.action.onClick, e);
        this.triggerDismiss(false);
    };

    private handleCloseClick = () => this.triggerDismiss(false);

    private triggerDismiss(didTimeoutExpire: boolean) {
        safeInvoke(this.props.onDismiss, didTimeoutExpire);
        this.clearTimeout();
    }

    private startTimeout = () => {
        if (this.props.timeout > 0) {
            this.timeoutId = setTimeout(() => this.triggerDismiss(true), this.props.timeout);
        }
    }

    private clearTimeout = () => {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
    }
}

export var ToastFactory = React.createFactory(Toast);
