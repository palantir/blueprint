/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { FormGroup, Section, SectionCard, Slider } from "@blueprintjs/core";
import { Box, Flex } from "@blueprintjs/labs";

import { FontFamilySelect } from "./FontFamilySelect";
import { FontWeightSelect } from "./FontWeightSelect";

interface FontSectionProps {
    fontFamily: string | undefined;
    fontWeight: number;
    fontSize: number;
    onFontFamilyChange: (family: string | undefined) => void;
    onFontWeightChange: (weight: number) => void;
    onFontSizeChange: (size: number) => void;
}

export const FontSection = ({
    fontFamily,
    fontWeight,
    fontSize,
    onFontFamilyChange,
    onFontWeightChange,
    onFontSizeChange,
}: FontSectionProps) => {
    return (
        <Section collapsible={true} title="Font">
            <Flex asChild={true} gap={4}>
                <SectionCard>
                    <FormGroup label="Font Family">
                        <FontFamilySelect value={fontFamily} onChange={onFontFamilyChange} />
                    </FormGroup>
                    <FormGroup label="Font Weight">
                        <FontWeightSelect value={fontWeight} onChange={onFontWeightChange} />
                    </FormGroup>
                    <Box asChild={true} marginBottom={0} style={{ maxWidth: 200 }}>
                        <FormGroup label="Font Size (%)">
                            <Slider
                                labelRenderer={renderLabel}
                                max={200}
                                min={50}
                                onChange={onFontSizeChange}
                                stepSize={1}
                                value={fontSize}
                                labelValues={[]}
                            />
                        </FormGroup>
                    </Box>
                </SectionCard>
            </Flex>
        </Section>
    );
};

const renderLabel = (value: number) => `${value}%`;
