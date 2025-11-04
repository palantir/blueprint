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

import { Code, FormGroup, H5, Slider } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";
import { type BoxProps, Flex } from "@blueprintjs/labs";

import { ExampleBox } from "./common/ExampleBox";

const SPACING_VALUES: Array<BoxProps["gap"]> = [0, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const FlexGapExample: React.FC<ExampleProps> = props => {
    const [gap, setGap] = useState<BoxProps["gap"]>(1);

    const options = (
        <>
            <H5>Props</H5>
            <FormGroup label="Gap" helperText={<Code>{`gap={${gap}}`}</Code>}>
                <Slider
                    max={SPACING_VALUES.length - 1}
                    min={0}
                    onChange={index => setGap(SPACING_VALUES[index])}
                    showTrackFill={false}
                    value={SPACING_VALUES.indexOf(gap)}
                    labelRenderer={false}
                />
            </FormGroup>
        </>
    );

    return (
        <Example options={options} {...props}>
            <Flex gap={gap}>
                <ExampleBox>1</ExampleBox>
                <ExampleBox>2</ExampleBox>
                <ExampleBox>3</ExampleBox>
            </Flex>
        </Example>
    );
};
