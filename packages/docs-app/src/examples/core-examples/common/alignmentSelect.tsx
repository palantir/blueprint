/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { Alignment, FormGroup, SegmentedControl } from "@blueprintjs/core";

interface AlignmentSelectProps {
    align: Alignment | undefined;
    allowCenter?: boolean;
    label?: string;
    onChange: (align: Alignment) => void;
}

export const AlignmentSelect: React.FC<AlignmentSelectProps> = ({
    align,
    allowCenter = true,
    label = "Align text",
    onChange,
}) => {
    const options = [
        { label: "Left", value: Alignment.LEFT },
        allowCenter && { label: "Center", value: Alignment.CENTER },
        { label: "Right", value: Alignment.RIGHT },
    ].filter(Boolean);

    const handleChange = React.useCallback((value: string) => onChange(value as Alignment), [onChange]);

    return (
        <FormGroup label={label}>
            <SegmentedControl small={true} fill={true} options={options} onValueChange={handleChange} value={align} />
        </FormGroup>
    );
};
AlignmentSelect.defaultProps = {
    align: "center",
};
