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

import { FormGroup, H5, HTMLSelect } from "@blueprintjs/core";
import { Example, type ExampleProps, handleValueChange } from "@blueprintjs/docs-theme";
import { Flex, Surface, type SurfaceIntent, type SurfaceKind } from "@blueprintjs/labs";

const KIND_OPTIONS: SurfaceKind[] = ["opaque", "glass"];
const INTENT_OPTIONS = ["none", "default", "primary", "success", "warning", "danger"];
const SHADOW_OPTIONS = ["0", "1", "2", "3", "4"];

export const SurfaceKindExample: React.FC<ExampleProps> = props => {
    const [kind, setKind] = useState<SurfaceKind>("opaque");
    const [intent, setIntent] = useState<string>("none");
    const [shadow, setShadow] = useState<string>("2");

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
            <FormGroup label="Shadow">
                <HTMLSelect
                    value={shadow}
                    options={SHADOW_OPTIONS}
                    onChange={handleValueChange(setShadow)}
                />
            </FormGroup>
        </>
    );

    return (
        <Example options={options} {...props}>
            {/* A patterned backdrop so the difference between opaque and glass is visible. */}
            <div
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(45deg, rgba(45, 114, 210, 0.25) 0 12px, transparent 12px 24px)",
                    borderRadius: 4,
                    padding: 40,
                }}
            >
                <Surface
                    kind={kind}
                    intent={intent === "none" ? undefined : (intent as SurfaceIntent)}
                    shadow={Number(shadow) as 0 | 1 | 2 | 3 | 4}
                >
                    <Flex alignItems="center" justifyContent="center" padding={4}>
                        {kind === "glass"
                            ? "Glass surface — backdrop blurs through"
                            : "Opaque surface"}
                    </Flex>
                </Surface>
            </div>
        </Example>
    );
};
