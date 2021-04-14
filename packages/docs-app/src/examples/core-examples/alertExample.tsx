/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import React from "react";

import { Alert, Button, H5, Intent, OverlayToaster, Switch, Toaster } from "@blueprintjs/core";
import { Example, handleBooleanChange, ExampleProps } from "@blueprintjs/docs-theme";

import { BlueprintExampleData } from "../../tags/types";

export interface AlertExampleState {
    canEscapeKeyCancel: boolean;
    canOutsideClickCancel: boolean;
    isLoading: boolean;
    isOpen: boolean;
    isOpenError: boolean;
    willLoad: boolean;
}

export class AlertExample extends React.PureComponent<ExampleProps<BlueprintExampleData>, AlertExampleState> {
    public state: AlertExampleState = {
        canEscapeKeyCancel: false,
        canOutsideClickCancel: false,
        isLoading: false,
        isOpen: false,
        isOpenError: false,
        willLoad: false,
    };

    private toaster: Toaster;

    private handleEscapeKeyChange = handleBooleanChange(canEscapeKeyCancel => this.setState({ canEscapeKeyCancel }));

    private handleOutsideClickChange = handleBooleanChange(click => this.setState({ canOutsideClickCancel: click }));

    private handleWillLoadChange = handleBooleanChange(click => this.setState({ willLoad: click }));

    public render() {
        const { isLoading, isOpen, isOpenError, ...alertProps } = this.state;
        const options = (
            <>
                <H5>Props</H5>
                <Switch
                    checked={this.state.canEscapeKeyCancel}
                    label="Can escape key cancel"
                    onChange={this.handleEscapeKeyChange}
                />
                <Switch
                    checked={this.state.canOutsideClickCancel}
                    label="Can outside click cancel"
                    onChange={this.handleOutsideClickChange}
                />
                <Switch
                    checked={this.state.willLoad}
                    label="Does alert use loading state"
                    onChange={this.handleWillLoadChange}
                />
            </>
        );
        return (
            <Example options={options} {...this.props}>
                <Button onClick={this.handleErrorOpen} text="Open file error alert" />
                <Alert
                    {...alertProps}
                    className={this.props.data.themeName}
                    confirmButtonText="Okay"
                    isOpen={isOpenError}
                    loading={isLoading}
                    onClose={this.handleErrorClose}
                >
                    <p>
                        Couldn't create the file because the containing folder doesn't exist anymore. You will be
                        redirected to your user folder.
                    </p>
                </Alert>

                <Button onClick={this.handleMoveOpen} text="Open file deletion alert" />
                <Alert
                    {...alertProps}
                    className={this.props.data.themeName}
                    cancelButtonText="Cancel"
                    confirmButtonText="Move to Trash"
                    icon="trash"
                    intent={Intent.DANGER}
                    isOpen={isOpen}
                    loading={isLoading}
                    onCancel={this.handleMoveCancel}
                    onConfirm={this.handleMoveConfirm}
                >
                    <p>
                        Are you sure you want to move <b>filename</b> to Trash? You will be able to restore it later,
                        but it will become private to you.
                    </p>
                </Alert>

                <OverlayToaster ref={ref => (this.toaster = ref)} />
            </Example>
        );
    }

    private handleErrorOpen = () => this.setState({ isOpenError: true });

    private handleErrorClose = () => {
        const close = () => this.setState({ isLoading: false, isOpenError: false });
        if (this.state.willLoad) {
            this.setState({ isLoading: true });
            setTimeout(close, 2000);
        } else {
            close();
        }
    };

    private handleMoveOpen = () => this.setState({ isOpen: true });

    private handleMoveConfirm = () => {
        const close = () => {
            this.setState({ isLoading: false, isOpen: false });
            this.toaster.show({ className: this.props.data.themeName, message: TOAST_MESSAGE });
        };
        if (this.state.willLoad) {
            this.setState({ isLoading: true });
            setTimeout(close, 2000);
        } else {
            close();
        }
    };

    private handleMoveCancel = () => this.setState({ isOpen: false });
}

const TOAST_MESSAGE = (
    <div>
        <strong>filename</strong> was moved to Trash
    </div>
);
