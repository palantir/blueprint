/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { capitalize } from "lodash";
import * as React from "react";

import { type ButtonVariant, FormGroup } from "@blueprintjs/core";
import { Dropdown } from "@blueprintjs/select";

export interface VariantSelectProps {
    label?: React.ReactNode;
    onChange: (variant: ButtonVariant) => void;
    variant: ButtonVariant;
}

/* eslint-disable sort-keys */
const VARIANTS_RECORD: Record<ButtonVariant, true> = {
    solid: true,
    minimal: true,
    outlined: true,
};

const VARIANTS = Object.keys(VARIANTS_RECORD) as ButtonVariant[];

export const VariantSelect: React.FC<VariantSelectProps> = ({ label = "Variant", onChange, variant }) => (
    <FormGroup label={label}>
        <Dropdown<ButtonVariant>
            fill={true}
            itemLabel={capitalize}
            items={VARIANTS}
            onItemSelect={onChange}
            selectedItem={variant}
        />
    </FormGroup>
);
