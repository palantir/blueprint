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

import {
    Box,
    Code,
    Colors,
    Divider,
    Flex,
    H5,
    Label,
    Slider,
    SpacingRange,
} from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";

const boxStyle: React.CSSProperties = {
    backgroundColor: Colors.GREEN3 + "1A",
    borderColor: Colors.GREEN3,
    borderRadius: 2,
    borderStyle: "dashed",
    borderWidth: 1,
    textAlign: "center",
};

const sliderProps = {
    labelRenderer: false,
    max: SpacingRange.length - 1,
    min: 0,
    showTrackFill: false,
};

export const BoxPaddingExample: React.FC<ExampleProps> = props => {
    const [padding, setPadding] = useState<SpacingRange>(5);
    const [paddingX, setPaddingX] = useState<SpacingRange>(5);
    const [paddingY, setPaddingY] = useState<SpacingRange>(5);
    const [paddingXStart, setPaddingXStart] = useState<SpacingRange>(5);
    const [paddingXEnd, setPaddingXEnd] = useState<SpacingRange>(5);
    const [paddingYStart, setPaddingYStart] = useState<SpacingRange>(5);
    const [paddingYEnd, setPaddingYEnd] = useState<SpacingRange>(5);

    const options = (
        <>
            <H5>Padding (all)</H5>
            <Label>
                Padding: <Code>{padding}</Code>
            </Label>
            <Slider
                {...sliderProps}
                value={SpacingRange.indexOf(padding)}
                onChange={index => setPadding(SpacingRange[index])}
            />
            <Divider />
            <H5>Padding (X / Y)</H5>
            <Label>
                Padding X: <Code>{paddingX}</Code>
            </Label>
            <Slider
                {...sliderProps}
                value={SpacingRange.indexOf(paddingX)}
                onChange={index => setPaddingX(SpacingRange[index])}
            />
            <Label>
                Padding Y: <Code>{paddingY}</Code>
            </Label>
            <Slider
                {...sliderProps}
                value={SpacingRange.indexOf(paddingY)}
                onChange={index => setPaddingY(SpacingRange[index])}
            />
            <Divider />
            <H5>Padding (Start / End)</H5>
            <Label>
                Padding X Start: <Code>{paddingXStart}</Code>
            </Label>
            <Slider
                {...sliderProps}
                value={SpacingRange.indexOf(paddingXStart)}
                onChange={index => setPaddingXStart(SpacingRange[index])}
            />
            <Label>
                Padding X End: <Code>{paddingXEnd}</Code>
            </Label>
            <Slider
                {...sliderProps}
                value={SpacingRange.indexOf(paddingXEnd)}
                onChange={index => setPaddingXEnd(SpacingRange[index])}
            />
            <Label>
                Padding Y Start: <Code>{paddingYStart}</Code>
            </Label>
            <Slider
                {...sliderProps}
                value={SpacingRange.indexOf(paddingYStart)}
                onChange={index => setPaddingYStart(SpacingRange[index])}
            />
            <Label>
                Padding Y End: <Code>{paddingYEnd}</Code>
            </Label>
            <Slider
                {...sliderProps}
                value={SpacingRange.indexOf(paddingYEnd)}
                onChange={index => setPaddingYEnd(SpacingRange[index])}
            />
        </>
    );

    return (
        <Example options={options} {...props}>
            <Flex alignItems="center" flexDirection="column" gap={10}>
                <Box padding={padding} style={boxStyle}>
                    Padding
                </Box>
                <Box paddingX={paddingX} paddingY={paddingY} style={boxStyle}>
                    Padding X / Y
                </Box>
                <Box
                    paddingXStart={paddingXStart}
                    paddingXEnd={paddingXEnd}
                    paddingYStart={paddingYStart}
                    paddingYEnd={paddingYEnd}
                    style={boxStyle}
                >
                    Padding Start / End
                </Box>
            </Flex>
        </Example>
    );
};
