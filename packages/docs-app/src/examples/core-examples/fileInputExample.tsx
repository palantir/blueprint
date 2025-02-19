/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import { FileInput, FormGroup, H5, InputGroup, type Size } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";

import { SizeSelect } from "./common/sizeSelect";

export const FileInputExample: React.FC<ExampleProps> = props => {
    const [buttonText, setButtonText] = React.useState("");
    const [size, setSize] = React.useState<Size>("medium");
    const [text, setText] = React.useState(undefined);

    const options = (
        <>
            <H5>Props</H5>
            <FormGroup label="Text">
                <InputGroup onValueChange={setText} placeholder="Choose file..." value={text} />
            </FormGroup>
            <FormGroup label="Button text">
                <InputGroup onValueChange={setButtonText} placeholder="Browse" value={buttonText} />
            </FormGroup>
            <SizeSelect onChange={setSize} size={size} />
        </>
    );

    return (
        <Example options={options} {...props}>
            <FileInput buttonText={buttonText} size={size} text={text} />
        </Example>
    );
};
