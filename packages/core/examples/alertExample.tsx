/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { Alert, Button, IToaster, Intent, Toaster } from "../src";
import BaseExample from "./common/baseExample";

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
    private message: JSX.Element = (<div><strong>filename</strong> was moved to Trash</div>);

    public componentWillMount() {
        this.toaster = Toaster.create();
    }

    protected renderExample() {
        return (
            <div>
                <Button onClick={this.handleOpenError} text="Open file error alert" />
                <Alert
                    className={this.props.getTheme()}
                    isOpen={this.state.isOpenError}
                    confirmButtonText="Okay"
                    onConfirm={this.handleCloseError}
                >
                    <p>
                        Couldn't create the file because the containing folder doesn't exist anymore.
                        You will be redirected to your user folder.
                    </p>
                </Alert>
                <Button onClick={this.handleOpen} text="Open file deletion alert" />
                <Alert
                    className={this.props.getTheme()}
                    intent={Intent.PRIMARY}
                    isOpen={this.state.isOpen}
                    confirmButtonText="Move to Trash"
                    cancelButtonText="Cancel"
                    onConfirm={this.handleMoveClose}
                    onCancel={this.handleClose}
                >
                    <p>
                        Are you sure you want to move <b>filename</b> to Trash? You will be able to restore
                        it later, but it will become private to you.
                    </p>
                </Alert>
            </div>
        );
    }

    private handleOpenError = () => this.setState({ isOpenError: true });
    private handleCloseError = () => this.setState({ isOpenError: false });
    private handleOpen = () => this.setState({ isOpen: true });
    private handleMoveClose = () => {
        this.setState({ isOpen: false });
        this.toaster.show({
            className: this.props.getTheme(),
            message: this.message,
        });
    };
    private handleClose = () => this.setState({ isOpen: false });
}
