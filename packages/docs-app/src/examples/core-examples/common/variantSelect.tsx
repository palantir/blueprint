/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import * as React from "react";

import { type ButtonVariant, ControlGroup, FormGroup, HTMLSelect } from "@blueprintjs/core";
import { handleValueChange } from "@blueprintjs/docs-theme";

export interface VariantSelectProps {
    label?: React.ReactNode;
    onChange: (variant: ButtonVariant) => void;
    variant: ButtonVariant;
}

interface Option {
    label: string;
    value: ButtonVariant;
}

const options: Option[] = [
    { label: "Solid", value: "solid" },
    { label: "Minimal", value: "minimal" },
    { label: "Outlined", value: "outlined" },
];

export const VariantSelect: React.FC<VariantSelectProps> = ({ label = "Variant", onChange, variant }) => (
    <FormGroup label={label}>
        <ControlGroup>
            <HTMLSelect fill={true} onChange={handleValueChange(onChange)} options={options} value={variant} />
        </ControlGroup>
    </FormGroup>
);
