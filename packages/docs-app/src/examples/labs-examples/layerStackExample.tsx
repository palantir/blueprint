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
import { Layer, Surface, type SurfaceIntent } from "@blueprintjs/labs";

const INTENT_OPTIONS = ["none", "default", "primary", "success", "warning", "danger"];

/**
 * Render `depth` nested <Layer>s. Each layer paints one tonal wash; nesting
 * composites them, so the innermost content sits on the deepest stack.
 */
function renderLayers(
    depth: number,
    intent: SurfaceIntent | undefined,
    index = 1,
): React.ReactNode {
    const content =
        depth <= 1 ? (
            <div style={{ padding: 16, textAlign: "center" }}>
                Layer <Code>{index}</Code>
            </div>
        ) : (
            renderLayers(depth - 1, intent, index + 1)
        );
    return (
        <Layer intent={intent} index={index} style={{ borderRadius: 4, padding: 16 }}>
            {content}
        </Layer>
    );
}

export const LayerStackExample: React.FC<ExampleProps> = props => {
    const [depth, setDepth] = useState<number>(3);
    const [intent, setIntent] = useState<string>("primary");

    const options = (
        <>
            <H5>Props</H5>
            <FormGroup label="Intent">
                <HTMLSelect
                    value={intent}
                    options={INTENT_OPTIONS}
                    onChange={handleValueChange(setIntent)}
                />
            </FormGroup>
            <Label>
                Stack depth: <Code>{depth}</Code>
            </Label>
            <Slider
                labelStepSize={1}
                max={5}
                min={1}
                showTrackFill={false}
                value={depth}
                onChange={setDepth}
            />
        </>
    );

    return (
        <Example options={options} {...props}>
            <Surface style={{ padding: 16, width: 280 }}>
                {renderLayers(depth, intent === "none" ? undefined : (intent as SurfaceIntent))}
            </Surface>
        </Example>
    );
};
