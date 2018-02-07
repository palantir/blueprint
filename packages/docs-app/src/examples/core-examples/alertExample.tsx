/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Alert, Button, Intent, IToaster, Toaster } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";

export interface IAlertExampleState {
    isOpen?: boolean;
    isOpenError?: boolean;
}

export class AlertExample extends BaseExample<{}> {
    public state: IAlertExampleState = {
        isOpen: false,
        isOpenError: false,
    };

    private toaster: IToaster;

    protected renderExample() {
        return (
            <div>
                <Button onClick={this.handleOpenError} text="Open file error alert" />
                <Alert
                    className={this.props.themeName}
                    isOpen={this.state.isOpenError}
                    confirmButtonText="Okay"
                    onConfirm={this.handleCloseError}
                >
                    <p>
                        Couldn't create the file because the containing folder doesn't exist anymore. You will be
                        redirected to your user folder.
                    </p>
                </Alert>
                <Button onClick={this.handleOpen} text="Open file deletion alert" />
                <Alert
                    className={this.props.themeName}
                    icon="trash"
                    intent={Intent.PRIMARY}
                    isOpen={this.state.isOpen}
                    confirmButtonText="Move to Trash"
                    cancelButtonText="Cancel"
                    onConfirm={this.handleMoveClose}
                    onCancel={this.handleClose}
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

    private handleOpenError = () => this.setState({ isOpenError: true });
    private handleCloseError = () => this.setState({ isOpenError: false });
    private handleOpen = () => this.setState({ isOpen: true });
    private handleMoveClose = () => {
        this.setState({ isOpen: false });
        this.toaster.show({ className: this.props.themeName, message: TOAST_MESSAGE });
    };
    private handleClose = () => this.setState({ isOpen: false });
}

const TOAST_MESSAGE = (
    <div>
        <strong>filename</strong> was moved to Trash
    </div>
);
