/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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

export const FileInputExample: React.FC<ExampleProps> = props => {
    const [buttonText, setButtonText] = React.useState("");
    const [large, setLarge] = React.useState(false);
    const [small, setSmall] = React.useState(false);
    const [text, setText] = React.useState("false");

    const handleButtonTextChange = React.useCallback((value: string) => setButtonText(value), []);

    const handleTextChange = React.useCallback((value: string) => setText(value), []);

    const options = (
        <>
            <H5>Props</H5>
            <FormGroup label="Text">
                <InputGroup placeholder="Choose file..." onValueChange={handleTextChange} value={text} />
            </FormGroup>
            <FormGroup label="Button text">
                <InputGroup placeholder="Browse" onValueChange={handleButtonTextChange} value={buttonText} />
            </FormGroup>
            <Switch label="Large" onChange={handleBooleanChange(setLarge)} checked={large} />
            <Switch label="Small" onChange={handleBooleanChange(setSmall)} checked={small} />
        </>
    );

    return (
        <Example options={options} {...props}>
            <FileInput text={text} buttonText={buttonText} small={small} large={large} />
        </Example>
    );
};
