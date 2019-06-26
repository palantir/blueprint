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

import {
    Button,
    Classes,
    H5,
    HTMLSelect,
    Intent,
    IToasterProps,
    IToastProps,
    Label,
    Position,
    ProgressBar,
    Switch,
    Toaster,
    ToasterPosition,
} from "@blueprintjs/core";
import { Example, handleBooleanChange, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";
import { IBlueprintExampleData } from "../../tags/reactExamples";

type IToastDemo = IToastProps & { button: string };

const POSITIONS = [
    Position.TOP_LEFT,
    Position.TOP,
    Position.TOP_RIGHT,
    Position.BOTTOM_LEFT,
    Position.BOTTOM,
    Position.BOTTOM_RIGHT,
];

export class ToastExample extends React.PureComponent<IExampleProps<IBlueprintExampleData>, IToasterProps> {
    public state: IToasterProps = {
        autoFocus: false,
        canEscapeKeyClear: true,
        position: Position.TOP,
    };

    private TOAST_BUILDERS: IToastDemo[] = [
        {
            action: {
                href: "https://www.google.com/search?q=toast&source=lnms&tbm=isch",
                target: "_blank",
                text: <strong>Yum.</strong>,
            },
            button: "Procure toast",
            intent: Intent.PRIMARY,
            message: (
                <>
                    One toast created. <em>Toasty.</em>
                </>
            ),
        },
        {
            action: {
                onClick: () =>
                    this.addToast({
                        icon: "ban-circle",
                        intent: Intent.DANGER,
                        message: "You cannot undo the past.",
                    }),
                text: "Undo",
            },
            button: "Move files",
            icon: "tick",
            intent: Intent.SUCCESS,
            message: "Moved 6 files.",
        },
        {
            action: {
                onClick: () => this.addToast(this.TOAST_BUILDERS[2]),
                text: "Retry",
            },
            button: "Delete root",
            icon: "warning-sign",
            intent: Intent.DANGER,
            message:
                "You do not have permissions to perform this action. \
    Please contact your system administrator to request the appropriate access rights.",
        },
        {
            action: {
                onClick: () => this.addToast({ message: "Isn't parting just the sweetest sorrow?" }),
                text: "Adieu",
            },
            button: "Log out",
            icon: "hand",
            intent: Intent.WARNING,
            message: "Goodbye, old friend.",
        },
    ];

    private toaster: Toaster;
    private refHandlers = {
        toaster: (ref: Toaster) => (this.toaster = ref),
    };
    private progressToastInterval?: number;

    private handlePositionChange = handleStringChange((position: ToasterPosition) => this.setState({ position }));
    private toggleAutoFocus = handleBooleanChange(autoFocus => this.setState({ autoFocus }));
    private toggleEscapeKey = handleBooleanChange(canEscapeKeyClear => this.setState({ canEscapeKeyClear }));

    public render() {
        return (
            <Example options={this.renderOptions()} {...this.props}>
                {this.TOAST_BUILDERS.map(this.renderToastDemo, this)}
                <Button onClick={this.handleProgressToast} text="Upload file" />
                <Toaster {...this.state} ref={this.refHandlers.toaster} />
            </Example>
        );
    }

    protected renderOptions() {
        const { autoFocus, canEscapeKeyClear, position } = this.state;
        return (
            <>
                <H5>Props</H5>
                <Label>
                    Position
                    <HTMLSelect value={position} onChange={this.handlePositionChange} options={POSITIONS} />
                </Label>
                <Switch label="Auto focus" checked={autoFocus} onChange={this.toggleAutoFocus} />
                <Switch label="Can escape key clear" checked={canEscapeKeyClear} onChange={this.toggleEscapeKey} />
            </>
        );
    }

    private renderToastDemo(toast: IToastDemo, index: number) {
        // tslint:disable-next-line:jsx-no-lambda
        return <Button intent={toast.intent} key={index} text={toast.button} onClick={() => this.addToast(toast)} />;
    }

    private renderProgress(amount: number): IToastProps {
        return {
            className: this.props.data.themeName,
            icon: "cloud-upload",
            message: (
                <ProgressBar
                    className={classNames("docs-toast-progress", { [Classes.PROGRESS_NO_STRIPES]: amount >= 100 })}
                    intent={amount < 100 ? Intent.PRIMARY : Intent.SUCCESS}
                    value={amount / 100}
                />
            ),
            onDismiss: (didTimeoutExpire: boolean) => {
                if (!didTimeoutExpire) {
                    // user dismissed toast with click
                    window.clearInterval(this.progressToastInterval);
                }
            },
            timeout: amount < 100 ? 0 : 2000,
        };
    }

    private addToast(toast: IToastProps) {
        toast.className = this.props.data.themeName;
        toast.timeout = 5000;
        this.toaster.show(toast);
    }

    private handleProgressToast = () => {
        let progress = 0;
        const key = this.toaster.show(this.renderProgress(0));
        this.progressToastInterval = window.setInterval(() => {
            if (this.toaster == null || progress > 100) {
                window.clearInterval(this.progressToastInterval);
            } else {
                progress += 10 + Math.random() * 20;
                this.toaster.show(this.renderProgress(progress), key);
            }
        }, 1000);
    };
}
