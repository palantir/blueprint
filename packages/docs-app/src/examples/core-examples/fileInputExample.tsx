/*
 * Copyright 2019 Palantir Technologies, Inc. All rights reserved.
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

import { FileInput, FormGroup, H5, InputGroup, Switch } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

interface FileInputExampleState {
    buttonText?: string;
    text?: string;
    large?: boolean;
    small?: boolean;
}

export class FileInputExample extends React.PureComponent<ExampleProps, FileInputExampleState> {
    public state: FileInputExampleState = {
        large: false,
        small: false,
    };

    public render() {
        const { text, buttonText, small, large } = this.state;

        return (
            <Example options={this.renderOptions()} {...this.props}>
                <FileInput text={text} buttonText={buttonText} small={small} large={large} />
            </Example>
        );
    }

    private renderOptions = () => {
        const { text, buttonText, small, large } = this.state;

        return (
            <>
                <H5>Props</H5>
                <FormGroup label="Text">
                    <InputGroup placeholder="Choose file..." onValueChange={this.handleTextChange} value={text} />
                </FormGroup>
                <FormGroup label="Button text">
                    <InputGroup placeholder="Browse" onValueChange={this.handleButtonTextChange} value={buttonText} />
                </FormGroup>
                <Switch label="Large" onChange={this.handleLargeChange} checked={large} />
                <Switch label="Small" onChange={this.handleSmallChange} checked={small} />
            </>
        );
    };

    private handleTextChange = (text: string) => this.setState({ text });

    private handleButtonTextChange = (buttonText: string) => this.setState({ buttonText });

    private handleSmallChange = handleBooleanChange(small => this.setState({ small, ...(small && { large: false }) }));

    private handleLargeChange = handleBooleanChange(large => this.setState({ large, ...(large && { small: false }) }));
}
