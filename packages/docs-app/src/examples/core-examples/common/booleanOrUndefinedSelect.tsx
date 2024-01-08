/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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

export type BooleanOrUndefined = undefined | false | true;

export interface BooleanOrUndefinedSelectProps {
    disabled?: boolean;
    label: string;
    value: BooleanOrUndefined;
    onChange: (size: BooleanOrUndefined) => void;
}

export const BooleanOrUndefinedSelect: React.FC<BooleanOrUndefinedSelectProps> = ({
    disabled,
    label,
    value,
    onChange,
}) => {
    const handleChange = React.useCallback(
        (newValue: string) => onChange(newValue === "undefined" ? undefined : newValue === "true" ? true : false),
        [onChange],
    );

    return (
        <FormGroup label={label}>
            <SegmentedControl
                fill={true}
                options={[
                    { disabled, label: "undefined", value: "undefined" },
                    { disabled, label: "true", value: "true" },
                    { disabled, label: "false", value: "false" },
                ]}
                onValueChange={handleChange}
                small={true}
                value={value === undefined ? "undefined" : value === true ? "true" : "false"}
            />
        </FormGroup>
    );
};
