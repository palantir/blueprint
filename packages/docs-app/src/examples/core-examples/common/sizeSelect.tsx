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

export const SizeSelect: React.FC<SizeSelectProps> = ({ label = "Size", onChange, size }) => (
    <FormGroup label={label}>
        <SegmentedControl<Size> fill={true} onValueChange={onChange} options={options} size="small" value={size} />
    </FormGroup>
);
