/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import * as React from "react";

import { FormGroup, SegmentedControl, type Size } from "@blueprintjs/core";

export interface SizeSelectProps {
    label?: string;
    onChange: (size: Size) => void;
    size: Size;
}

interface Option {
    label: string;
    value: Size;
}

const options: Option[] = [
    { label: "Small", value: "small" },
    { label: "Medium", value: "medium" },
    { label: "Large", value: "large" },
];

export const SizeSelect: React.FC<SizeSelectProps> = ({ label = "Size", onChange, size }) => {
    const handleChange = React.useCallback((value: string) => onChange(value as Size), [onChange]);
    return (
        <FormGroup label={label}>
            <SegmentedControl fill={true} onValueChange={handleChange} options={options} size="small" value={size} />
        </FormGroup>
    );
};
