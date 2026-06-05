/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import { Code, FormGroup, H5, HTMLSelect, Label, Slider } from "@blueprintjs/core";
import { Example, type ExampleProps, handleValueChange } from "@blueprintjs/docs-theme";
import { Flex, Surface, type SurfaceIntent, type SurfaceKind } from "@blueprintjs/labs";

const KIND_OPTIONS: SurfaceKind[] = ["opaque", "glass", "transparent"];
const INTENT_OPTIONS: SurfaceIntent[] = ["none", "primary", "success", "warning", "danger"];

/**
 * Show the `elevation` scale side by side: one <Surface> per level from `0` up to
 * the selected max. Each step deepens the tonal wash (`1 - (1 - a)^elevation`),
 * all rendered in CSS with no extra DOM nodes.
 */
export const SurfaceStackExample: React.FC<ExampleProps> = props => {
    const [maxElevation, setMaxElevation] = useState<number>(5);
    const [kind, setKind] = useState<SurfaceKind>("opaque");
    const [intent, setIntent] = useState<SurfaceIntent>("primary");

    const options = (
        <>
            <H5>Props</H5>
            <FormGroup label="Kind">
                <HTMLSelect
                    value={kind}
                    options={KIND_OPTIONS}
                    onChange={handleValueChange(setKind)}
                />
            </FormGroup>
            <FormGroup label="Intent">
                <HTMLSelect
                    value={intent}
                    options={INTENT_OPTIONS}
                    onChange={handleValueChange(setIntent)}
                />
            </FormGroup>
            <Label>
                Max elevation: <Code>{maxElevation}</Code>
            </Label>
            <Slider
                labelStepSize={1}
                max={8}
                min={0}
                showTrackFill={false}
                value={maxElevation}
                onChange={setMaxElevation}
            />
        </>
    );

    const levels = Array.from({ length: maxElevation + 1 }, (_, index) => index);

    return (
        <Example options={options} {...props}>
            <Flex
                flexWrap="wrap"
                gap={3}
                justifyContent="center"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(45deg, rgba(45, 114, 210, 0.10) 0 12px, transparent 12px 24px)",
                    borderRadius: 4,
                    padding: 40,
                }}
            >
                {levels.map(level => (
                    <Surface
                        key={level}
                        elevation={level}
                        kind={kind}
                        intent={intent}
                        style={{ padding: 16, width: 120 }}
                    >
                        <Flex justifyContent="center">
                            Elevation&nbsp;<Code>{level}</Code>
                        </Flex>
                    </Surface>
                ))}
            </Flex>
        </Example>
    );
};
