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

const FLEX_DIRECTION_OPTIONS = ["row", "row-reverse", "column", "column-reverse"];

export const FlexDirectionExample: React.FC<ExampleProps> = props => {
    const [flexDirection, setFlexDirection] = useState<BoxProps["flexDirection"]>("row");

    const options = (
        <>
            <H5>Props</H5>
            <FormGroup label="Flex Direction">
                <HTMLSelect
                    value={flexDirection}
                    onChange={handleValueChange(setFlexDirection)}
                    options={FLEX_DIRECTION_OPTIONS}
                />
            </FormGroup>
        </>
    );

    return (
        <Example options={options} {...props}>
            <Flex gap={1} flexDirection={flexDirection} width="100">
                <ExampleBox>1</ExampleBox>
                <ExampleBox>2</ExampleBox>
                <ExampleBox>3</ExampleBox>
            </Flex>
        </Example>
    );
};
