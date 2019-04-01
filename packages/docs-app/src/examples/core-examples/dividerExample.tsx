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

import * as React from "react";

import { Button, ButtonGroup, Divider, H5, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";

export interface IDividerExampleState {
    vertical: boolean;
}

export class DividerExample extends React.PureComponent<IExampleProps, IDividerExampleState> {
    public state: IDividerExampleState = { vertical: false };

    private handleVerticalChange = handleBooleanChange(vertical => this.setState({ vertical }));

    public render() {
        const { vertical } = this.state;
        const options = (
            <>
                <H5>Example props</H5>
                <Switch checked={vertical} label="Vertical" onChange={this.handleVerticalChange} />
            </>
        );
        return (
            <Example options={options} {...this.props}>
                <ButtonGroup minimal={true} vertical={vertical}>
                    <Button text="File" />
                    <Button text="Edit" />
                    <Divider />
                    <Button text="Create" />
                    <Button text="Delete" />
                    <Divider />
                    <Button icon="add" />
                    <Button icon="remove" />
                </ButtonGroup>
            </Example>
        );
    }
}
