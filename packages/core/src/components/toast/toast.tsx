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

/**
 * @fileoverview This component is DEPRECATED, and the code is frozen.
 * All changes & bugfixes should be made to Toast2 instead.
 */

import classNames from "classnames";
import * as React from "react";

import { Cross } from "@blueprintjs/icons";

import { AbstractPureComponent, Classes } from "../../common";
import { DISPLAYNAME_PREFIX } from "../../common/props";
import { ButtonGroup } from "../button/buttonGroup";
import { AnchorButton, Button } from "../button/buttons";
import { Icon } from "../icon/icon";

import type { ToastProps } from "./toastProps";

/**
 * Toast component.
 *
 * @deprecated use `Toast2` instead, which forwards DOM refs and is thus compatible with `Overlay2`.
 * @see https://blueprintjs.com/docs/#core/components/toast
 */
export class Toast extends AbstractPureComponent<ToastProps> {
    public static defaultProps: ToastProps = {
        className: "",
        isCloseButtonShown: true,
        message: "",
        timeout: 5000,
    };

    public static displayName = `${DISPLAYNAME_PREFIX}.Toast`;

    public render(): React.JSX.Element {
        const { className, icon, intent, message, isCloseButtonShown } = this.props;
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
                <span className={Classes.TOAST_MESSAGE} role="alert">
                    {message}
                </span>
                <ButtonGroup variant="minimal">
                    {this.maybeRenderActionButton()}
                    {isCloseButtonShown && (
                        <Button aria-label="Close" icon={<Cross />} onClick={this.handleCloseClick} />
                    )}
                </ButtonGroup>
            </div>
        );
    }

    public componentDidMount() {
        this.startTimeout();
    }

    public componentDidUpdate(prevProps: ToastProps) {
        if (prevProps.timeout !== this.props.timeout) {
            if (this.props.timeout! > 0) {
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
        this.props.action?.onClick?.(e);
        this.triggerDismiss(false);
    };

    private handleCloseClick = () => this.triggerDismiss(false);

    private triggerDismiss(didTimeoutExpire: boolean) {
        this.clearTimeouts();
        this.props.onDismiss?.(didTimeoutExpire);
    }

    private startTimeout = () => {
        this.clearTimeouts();
        if (this.props.timeout! > 0) {
            this.setTimeout(() => this.triggerDismiss(true), this.props.timeout);
        }
    };
}
