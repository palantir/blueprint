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

import React from "react";

import { FileInput, FormGroup, H5, InputGroup } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";

interface FileInputExampleState {
    buttonText?: string;
    text?: string;
}

export class FileInputExample extends React.PureComponent<ExampleProps, FileInputExampleState> {
    public state: FileInputExampleState = {};

    public render() {
        const { text, buttonText } = this.state;

        return (
            <Example options={this.renderOptions()} {...this.props}>
                <FileInput text={text} buttonText={buttonText} />
            </Example>
        );
    }

    private renderOptions = () => {
        const { text, buttonText } = this.state;

        return (
            <>
                <H5>Props</H5>
                <FormGroup label="Text">
                    <InputGroup placeholder="Choose file..." onChange={this.handleTextChange} value={text} />
                </FormGroup>
                <FormGroup label="Button text">
                    <InputGroup placeholder="Browse" onChange={this.handleButtonTextChange} value={buttonText} />
                </FormGroup>
            </>
        );
    };

    private handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ text: e.target.value });
    };

    private handleButtonTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ buttonText: e.target.value });
    };
}
