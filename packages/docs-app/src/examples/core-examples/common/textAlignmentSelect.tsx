/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import * as React from "react";

import { FormGroup, SegmentedControl, TextAlignment } from "@blueprintjs/core";

const options = [
    { label: "Start", value: TextAlignment.START },
    { label: "Center", value: TextAlignment.CENTER },
    { label: "End", value: TextAlignment.END },
];

interface AlignmentSelectProps {
    align: TextAlignment;
    label?: string;
    onChange: (align: TextAlignment) => void;
}

export const TextAlignmentSelect: React.FC<AlignmentSelectProps> = ({ align, label = "Align text", onChange }) => {
    const handleChange = React.useCallback((value: string) => onChange(value as TextAlignment), [onChange]);
    return (
        <FormGroup label={label}>
            <SegmentedControl fill={true} options={options} onValueChange={handleChange} size="small" value={align} />
        </FormGroup>
    );
};
