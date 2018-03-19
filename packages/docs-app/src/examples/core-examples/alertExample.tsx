/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Alert, Button, Intent, IToaster, Switch, Toaster } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs-theme";

export interface IAlertExampleState {
    canEscapeKeyCancel: boolean;
    canOutsideClickCancel: boolean;
    isOpen: boolean;
    isOpenError: boolean;
}

export class AlertExample extends BaseExample<{}> {
    public state: IAlertExampleState = {
        canEscapeKeyCancel: false,
        canOutsideClickCancel: false,
        isOpen: false,
        isOpenError: false,
    };

    private toaster: IToaster;

    private handleEscapeKeyChange = handleBooleanChange(canEscapeKeyCancel => this.setState({ canEscapeKeyCancel }));
    private handleOutsideClickChange = handleBooleanChange(click => this.setState({ canOutsideClickCancel: click }));

    protected renderExample() {
        const { isOpen, isOpenError, ...switchProps } = this.state;
        return (
            <div>
                <Button onClick={this.handleErrorOpen} text="Open file error alert" />
                <Alert
                    {...switchProps}
                    className={this.props.themeName}
                    confirmButtonText="Okay"
                    isOpen={isOpenError}
                    onClose={this.handleErrorClose}
                >
                    <p>
                        Couldn't create the file because the containing folder doesn't exist anymore. You will be
                        redirected to your user folder.
                    </p>
                </Alert>
                <Button onClick={this.handleMoveOpen} text="Open file deletion alert" />
                <Alert
                    {...switchProps}
                    className={this.props.themeName}
                    cancelButtonText="Cancel"
                    confirmButtonText="Move to Trash"
                    icon="trash"
                    intent={Intent.DANGER}
                    isOpen={isOpen}
                    onCancel={this.handleMoveCancel}
                    onConfirm={this.handleMoveConfirm}
                >
                    <p>
                        Are you sure you want to move <b>filename</b> to Trash? You will be able to restore it later,
                        but it will become private to you.
                    </p>
                </Alert>
                <Toaster ref={ref => (this.toaster = ref)} />
            </div>
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    checked={this.state.canEscapeKeyCancel}
                    key="escape"
                    label="Can escape key cancel"
                    onChange={this.handleEscapeKeyChange}
                />,
                <Switch
                    checked={this.state.canOutsideClickCancel}
                    key="click"
                    label="Can outside click cancel"
                    onChange={this.handleOutsideClickChange}
                />,
            ],
        ];
    }

    private handleErrorOpen = () => this.setState({ isOpenError: true });
    private handleErrorClose = () => this.setState({ isOpenError: false });

    private handleMoveOpen = () => this.setState({ isOpen: true });
    private handleMoveConfirm = () => {
        this.setState({ isOpen: false });
        this.toaster.show({ className: this.props.themeName, message: TOAST_MESSAGE });
    };
    private handleMoveCancel = () => this.setState({ isOpen: false });
}

const TOAST_MESSAGE = (
    <div>
        <strong>filename</strong> was moved to Trash
    </div>
);
