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

import { Code, Colors, Divider, H5, Label, Slider } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";
import { Box, type BoxProps, Flex } from "@blueprintjs/labs";

const SPACING_VALUES: Array<BoxProps["margin"]> = [0, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const boxStyle: React.CSSProperties = {
    backgroundColor: Colors.ORANGE3 + "1A",
    borderColor: Colors.ORANGE3,
    borderRadius: 2,
    borderStyle: "dashed",
    borderWidth: 1,
};

const innerBoxStyle: React.CSSProperties = {
    ...boxStyle,
    backgroundColor: Colors.ORANGE3,
    borderStyle: "none",
    color: Colors.WHITE,
    textAlign: "center",
};

const sliderProps = {
    labelRenderer: false,
    max: SPACING_VALUES.length - 1,
    min: 0,
    showTrackFill: false,
};

export const BoxMarginExample: React.FC<ExampleProps> = props => {
    const [margin, setMargin] = useState<BoxProps["margin"]>(5);
    const [marginX, setMarginX] = useState<BoxProps["margin"]>(5);
    const [marginY, setMarginY] = useState<BoxProps["margin"]>(5);
    const [marginXStart, setMarginXStart] = useState<BoxProps["margin"]>(5);
    const [marginXEnd, setMarginXEnd] = useState<BoxProps["margin"]>(5);
    const [marginYStart, setMarginYStart] = useState<BoxProps["margin"]>(5);
    const [marginYEnd, setMarginYEnd] = useState<BoxProps["margin"]>(5);

    const options = (
        <>
            <H5>Margin (all)</H5>
            <Label>
                Margin: <Code>{margin}</Code>
            </Label>
            <Slider
                {...sliderProps}
                value={SPACING_VALUES.indexOf(margin)}
                onChange={index => setMargin(SPACING_VALUES[index])}
            />
            <Divider />
            <H5>Margin (X / Y)</H5>
            <Label>
                Margin X: <Code>{marginX}</Code>
            </Label>
            <Slider
                {...sliderProps}
                value={SPACING_VALUES.indexOf(marginX)}
                onChange={index => setMarginX(SPACING_VALUES[index])}
            />
            <Label>
                Margin Y: <Code>{marginY}</Code>
            </Label>
            <Slider
                {...sliderProps}
                value={SPACING_VALUES.indexOf(marginY)}
                onChange={index => setMarginY(SPACING_VALUES[index])}
            />
            <Divider />
            <H5>Margin (Start / End)</H5>
            <Label>
                Margin X Start: <Code>{marginXStart}</Code>
            </Label>
            <Slider
                {...sliderProps}
                value={SPACING_VALUES.indexOf(marginXStart)}
                onChange={index => setMarginXStart(SPACING_VALUES[index])}
            />
            <Label>
                Margin X End: <Code>{marginXEnd}</Code>
            </Label>
            <Slider
                {...sliderProps}
                value={SPACING_VALUES.indexOf(marginXEnd)}
                onChange={index => setMarginXEnd(SPACING_VALUES[index])}
            />
            <Label>
                Margin Y Start: <Code>{marginYStart}</Code>
            </Label>
            <Slider
                {...sliderProps}
                value={SPACING_VALUES.indexOf(marginYStart)}
                onChange={index => setMarginYStart(SPACING_VALUES[index])}
            />
            <Label>
                Margin Y End: <Code>{marginYEnd}</Code>
            </Label>
            <Slider
                {...sliderProps}
                value={SPACING_VALUES.indexOf(marginYEnd)}
                onChange={index => setMarginYEnd(SPACING_VALUES[index])}
            />
        </>
    );

    return (
        <Example options={options} {...props}>
            <Flex alignItems="center" flexDirection="column" gap={10}>
                <Box style={boxStyle}>
                    <Box margin={margin} padding={1} style={innerBoxStyle}>
                        Margin
                    </Box>
                </Box>

                <Box style={boxStyle}>
                    <Box marginX={marginX} marginY={marginY} padding={1} style={innerBoxStyle}>
                        Margin X / Y
                    </Box>
                </Box>
                <Box style={boxStyle}>
                    <Box
                        marginXStart={marginXStart}
                        marginXEnd={marginXEnd}
                        marginYStart={marginYStart}
                        marginYEnd={marginYEnd}
                        padding={1}
                        style={innerBoxStyle}
                    >
                        Margin Start / End
                    </Box>
                </Box>
            </Flex>
        </Example>
    );
};
