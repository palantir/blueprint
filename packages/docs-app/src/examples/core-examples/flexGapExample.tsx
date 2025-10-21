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

import { Code, Flex, FormGroup, H5, Slider, SpacingRange } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";

import { ExampleBox } from "./common/ExampleBox";

export const FlexGapExample: React.FC<ExampleProps> = props => {
    const [gap, setGap] = useState<SpacingRange>(1);

    const options = (
        <>
            <H5>Props</H5>
            <FormGroup label="Gap" helperText={<Code>{`gap={${gap}}`}</Code>}>
                <Slider
                    max={SpacingRange.length - 1}
                    min={0}
                    onChange={index => setGap(SpacingRange[index])}
                    showTrackFill={false}
                    value={SpacingRange.indexOf(gap)}
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
