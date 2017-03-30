/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import {
    Button,
    Classes,
    Intent,
    IToasterProps,
    IToastProps,
    Position,
    ProgressBar,
    Switch,
    Toaster,
} from "@blueprintjs/core";
import { BaseExample, handleBooleanChange, handleNumberChange } from "@blueprintjs/docs";

type IToastDemo = IToastProps & { button: string };

export class ToastExample extends BaseExample<IToasterProps> {
    public state: IToasterProps = {
        autoFocus: false,
        canEscapeKeyClear: true,
        position: Position.TOP,
    };

    private TOAST_BUILDERS: IToastDemo[] = [{
        action: {
            href: "https://www.google.com/search?q=toast&source=lnms&tbm=isch",
            target: "_blank",
            text: "Yum",
        },
        button: "Procure toast",
        intent: Intent.PRIMARY,
        message: <span>One toast created. <em>Toasty.</em></span>,
    }, {
        action: {
            onClick: () => this.addToast({
                iconName: "ban-circle",
                intent: Intent.DANGER,
                message: "You cannot undo the past.",
            }),
            text: "Undo",
        },
        button: "Move files",
        iconName: "tick",
        intent: Intent.SUCCESS,
        message: "Moved 6 files.",
    }, {
        action: {
            onClick: () => this.addToast(this.TOAST_BUILDERS[2]),
            text: "Retry",
        },
        button: "Delete root",
        iconName: "warning-sign",
        intent: Intent.DANGER,
        message: "You do not have permissions to perform this action. \
    Please contact your system administrator to request the appropriate access rights.",
    }, {
        action: {
            onClick: () => this.addToast({ message: "Isn't parting just the sweetest sorrow?" }),
            text: "Adieu",
        },
        button: "Log out",
        iconName: "hand",
        intent: Intent.WARNING,
        message: "Goodbye, old friend.",
    }];

    private toaster: Toaster;
    private refHandlers = {
        toaster: (ref: Toaster) => this.toaster = ref,
    };

    private handlePositionChange = handleNumberChange((position) => this.setState({ position }));
    private toggleAutoFocus = handleBooleanChange((autoFocus) => this.setState({ autoFocus }));
    private toggleEscapeKey = handleBooleanChange((canEscapeKeyClear) => this.setState({ canEscapeKeyClear }));

    protected renderExample() {
        return (
            <div>
                {this.TOAST_BUILDERS.map(this.renderToastDemo, this)}
                <Button onClick={this.handleProgressToast} text="Upload file" />
                <Toaster {...this.state} ref={this.refHandlers.toaster} />
            </div>
        );
    }

    protected renderOptions() {
        return [
            [
                <label className={Classes.LABEL} key="position">
                    Toast position
                    <div className={Classes.SELECT}>
                        <select value={this.state.position.toString()} onChange={this.handlePositionChange}>
                            <option value={Position.TOP_LEFT.toString()}>Top left</option>
                            <option value={Position.TOP.toString()}>Top center</option>
                            <option value={Position.TOP_RIGHT.toString()}>Top right</option>
                            <option value={Position.BOTTOM_LEFT.toString()}>Bottom left</option>
                            <option value={Position.BOTTOM.toString()}>Bottom center</option>
                            <option value={Position.BOTTOM_RIGHT.toString()}>Bottom right</option>
                        </select>
                    </div>
                </label>,
                <Switch
                    checked={this.state.autoFocus}
                    label="Auto focus"
                    key="autofocus"
                    onChange={this.toggleAutoFocus}
                />,
                <Switch
                    checked={this.state.canEscapeKeyClear}
                    label="Can escape key clear"
                    key="escapekey"
                    onChange={this.toggleEscapeKey}
                />,
            ],
        ];
    }

    private renderToastDemo(toast: IToastDemo, index: number) {
        // tslint:disable-next-line:jsx-no-lambda
        return <Button intent={toast.intent} key={index} text={toast.button} onClick={() => this.addToast(toast)} />;
    }

    private renderProgress(amount: number): IToastProps {
        return {
            className: this.props.getTheme(),
            iconName: "cloud-upload",
            message: (
                <ProgressBar
                    className={classNames("docs-toast-progress", { "pt-no-stripes": amount >= 100 })}
                    intent={amount < 100 ? Intent.PRIMARY : Intent.SUCCESS}
                    value={amount / 100}
                />
            ),
            timeout: amount < 100 ? 0 : 2000,
        };
    }

    private addToast(toast: IToastProps) {
        toast.className = this.props.getTheme();
        toast.timeout = 5000;
        this.toaster.show(toast);
    }

    private handleProgressToast = () => {
        let progress = 0;
        const key = this.toaster.show(this.renderProgress(0));
        const interval = setInterval(() => {
            if (this.toaster == null || progress > 100) {
                clearInterval(interval);
            } else {
                progress += 10 + Math.random() * 20;
                this.toaster.update(key, this.renderProgress(progress));
            }
        }, 1000);
    }
}
