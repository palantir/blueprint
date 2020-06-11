/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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
import { DISPLAYNAME_PREFIX, IActionProps, IIntentProps, ILinkProps, IProps, MaybeElement } from "../../common/props";
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
    icon?: IconName | MaybeElement;

    /** Message to display in the body of the toast. */
    message: React.ReactNode;

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

@polyfill
export class Toast extends AbstractPureComponent2<IToastProps> {
    public static defaultProps: IToastProps = {
        className: "",
        message: "",
        timeout: 5000,
    };

    public static displayName = `${DISPLAYNAME_PREFIX}.Toast`;

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
        if (prevProps.timeout !== this.props.timeout) {
            if (this.props.timeout > 0) {
                this.startTimeout();
            } else {
                this.clearTimeouts();
            }
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
        this.clearTimeouts();
        safeInvoke(this.props.onDismiss, didTimeoutExpire);
    }

    private startTimeout = () => {
        this.clearTimeouts();
        if (this.props.timeout > 0) {
            this.setTimeout(() => this.triggerDismiss(true), this.props.timeout);
        }
    };
}
