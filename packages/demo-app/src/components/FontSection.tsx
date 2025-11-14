/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { FormGroup, Section, SectionCard } from "@blueprintjs/core";
import { Box } from "@blueprintjs/labs";

import { FontFamilySelect } from "./FontFamilySelect";
import { FontWeightSelect } from "./FontWeightSelect";

interface FontSectionProps {
    fontFamily: string | undefined;
    fontWeight: number;
    onFontFamilyChange: (family: string | undefined) => void;
    onFontWeightChange: (weight: number) => void;
}

export const FontSection = ({ fontFamily, fontWeight, onFontFamilyChange, onFontWeightChange }: FontSectionProps) => {
    return (
        <Section collapsible={true} title="Font">
            <SectionCard>
                <FormGroup label="Font Family">
                    <FontFamilySelect value={fontFamily} onChange={onFontFamilyChange} />
                </FormGroup>
                <Box asChild={true} marginBottom={0}>
                    <FormGroup label="Font Weight">
                        <FontWeightSelect value={fontWeight} onChange={onFontWeightChange} />
                    </FormGroup>
                </Box>
            </SectionCard>
        </Section>
    );
};
