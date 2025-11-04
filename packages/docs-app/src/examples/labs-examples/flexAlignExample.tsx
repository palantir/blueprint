/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import { useState } from "react";

import { FormGroup, H5, HTMLSelect } from "@blueprintjs/core";
import { Example, type ExampleProps, handleValueChange } from "@blueprintjs/docs-theme";
import { type BoxProps, Flex } from "@blueprintjs/labs";

import { ExampleBox } from "./common/ExampleBox";

const ALIGNMENT_OPTIONS = ["start", "end", "center", "baseline", "stretch"];

export const FlexAlignExample: React.FC<ExampleProps> = props => {
    const [alignItems, setAlignItems] = useState<BoxProps["alignItems"]>("start");
    const [justifyContent, setJustifyContent] = useState<BoxProps["justifyContent"]>("center");

    const options = (
        <>
            <H5>Props</H5>
            <FormGroup label="Align Items">
                <HTMLSelect
                    value={alignItems}
                    onChange={handleValueChange(setAlignItems)}
                    options={ALIGNMENT_OPTIONS}
                />
            </FormGroup>
            <FormGroup label="Justify Content">
                <HTMLSelect
                    value={justifyContent}
                    onChange={handleValueChange(setJustifyContent)}
                    options={ALIGNMENT_OPTIONS}
                />
            </FormGroup>
        </>
    );

    return (
        <Example options={options} {...props}>
            <Flex gap={1} alignItems={alignItems} justifyContent={justifyContent} width="100">
                <ExampleBox>1</ExampleBox>
                <ExampleBox size={50}>2</ExampleBox>
                <ExampleBox>3</ExampleBox>
            </Flex>
        </Example>
    );
};
