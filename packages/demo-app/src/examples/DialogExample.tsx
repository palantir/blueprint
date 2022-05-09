/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import * as React from "react";

import { Button, Classes, Dialog } from "@blueprintjs/core";

import { ExampleCard } from "./ExampleCard";

export interface DialogExampleProps {
    className?: string;
}

export interface DialogExampleState {
    isOpen: boolean;
}

export class DialogExample extends React.PureComponent<DialogExampleProps, DialogExampleState> {
    public state: DialogExampleState = { isOpen: false };

    private toggleDialog = () => this.setState({ isOpen: !this.state.isOpen });

    public render() {
        return (
            <ExampleCard label="Dialog">
                <Button onClick={this.toggleDialog} text="Show dialog" />
                <Dialog
                    className={this.props.className}
                    isOpen={this.state.isOpen}
                    onClose={this.toggleDialog}
                    icon="info-sign"
                    title="Dialog header"
                >
                    <div className={Classes.DIALOG_BODY}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat
                    </div>
                </Dialog>
            </ExampleCard>
        );
    }
}
