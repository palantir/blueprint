/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import * as React from "react";

import { FormGroup, SegmentedControl } from "@blueprintjs/core";

export type Size = "small" | "regular" | "large";

export interface SizeSelectProps {
    label?: string;
    size: Size;
    optionLabels?: [string, string, string];
    onChange: (size: Size) => void;
}

export const SizeSelect: React.FC<SizeSelectProps> = ({ label, size, optionLabels, onChange }) => {
    const handleChange = React.useCallback((value: string) => onChange(value as Size), [onChange]);

    return (
        <FormGroup label={label}>
            <SegmentedControl
                fill={true}
                small={true}
                options={[
                    { label: optionLabels[0], value: "small" },
                    { label: optionLabels[1], value: "regular" },
                    { label: optionLabels[2], value: "large" },
                ]}
                onValueChange={handleChange}
                value={size}
            />
        </FormGroup>
    );
};
SizeSelect.defaultProps = {
    label: "Size",
    optionLabels: ["Small", "Regular", "Large"],
};

export function getSizeProp(size: Size) {
    switch (size) {
        case "large":
            return { large: true };
        case "small":
            return { small: true };
        default:
            // regular is the default
            return {};
    }
}
