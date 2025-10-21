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
    max: SpacingRange.length - 1,
    min: 0,
    showTrackFill: false,
};

export const BoxMarginExample: React.FC<ExampleProps> = props => {
    const [margin, setMargin] = useState<SpacingRange>(5);
    const [marginX, setMarginX] = useState<SpacingRange>(5);
    const [marginY, setMarginY] = useState<SpacingRange>(5);
    const [marginXStart, setMarginXStart] = useState<SpacingRange>(5);
    const [marginXEnd, setMarginXEnd] = useState<SpacingRange>(5);
    const [marginYStart, setMarginYStart] = useState<SpacingRange>(5);
    const [marginYEnd, setMarginYEnd] = useState<SpacingRange>(5);

    const options = (
        <>
            <H5>Margin (all)</H5>
            <Label>
                Margin: <Code>{margin}</Code>
            </Label>
            <Slider
                {...sliderProps}
                value={SpacingRange.indexOf(margin)}
                onChange={index => setMargin(SpacingRange[index])}
            />
            <Divider />
            <H5>Margin (X / Y)</H5>
            <Label>
                Margin X: <Code>{marginX}</Code>
            </Label>
            <Slider
                {...sliderProps}
                value={SpacingRange.indexOf(marginX)}
                onChange={index => setMarginX(SpacingRange[index])}
            />
            <Label>
                Margin Y: <Code>{marginY}</Code>
            </Label>
            <Slider
                {...sliderProps}
                value={SpacingRange.indexOf(marginY)}
                onChange={index => setMarginY(SpacingRange[index])}
            />
            <Divider />
            <H5>Margin (Start / End)</H5>
            <Label>
                Margin X Start: <Code>{marginXStart}</Code>
            </Label>
            <Slider
                {...sliderProps}
                value={SpacingRange.indexOf(marginXStart)}
                onChange={index => setMarginXStart(SpacingRange[index])}
            />
            <Label>
                Margin X End: <Code>{marginXEnd}</Code>
            </Label>
            <Slider
                {...sliderProps}
                value={SpacingRange.indexOf(marginXEnd)}
                onChange={index => setMarginXEnd(SpacingRange[index])}
            />
            <Label>
                Margin Y Start: <Code>{marginYStart}</Code>
            </Label>
            <Slider
                {...sliderProps}
                value={SpacingRange.indexOf(marginYStart)}
                onChange={index => setMarginYStart(SpacingRange[index])}
            />
            <Label>
                Margin Y End: <Code>{marginYEnd}</Code>
            </Label>
            <Slider
                {...sliderProps}
                value={SpacingRange.indexOf(marginYEnd)}
                onChange={index => setMarginYEnd(SpacingRange[index])}
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
