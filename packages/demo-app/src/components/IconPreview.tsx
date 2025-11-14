/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { useState } from "react";

import { Card, Code, Colors, FormGroup, Icon, type IconName, Section, SectionCard } from "@blueprintjs/core";
import { Box, Flex } from "@blueprintjs/labs";

import { ColorPicker } from "./ColorPicker";
import { IconSelect } from "./IconSelect";
import { IconSizeSelect } from "./IconSizeSelect";

interface IconPreviewProps {
    selectedIcon: IconName;
    onIconSelect: (icon: IconName) => void;
}

export const IconPreview = ({ selectedIcon, onIconSelect }: IconPreviewProps) => {
    const [iconSize, setIconSize] = useState(20);
    const [iconColor, setIconColor] = useState<string>(Colors.BLACK);

    return (
        <Section collapsible={true} title="Icon Preview">
            <Flex asChild={true} alignItems="center" gap={8}>
                <SectionCard>
                    <div>
                        <FormGroup label="Select Icon">
                            <IconSelect value={selectedIcon} onIconSelect={onIconSelect} />
                        </FormGroup>
                        <FormGroup label="Icon Size">
                            <IconSizeSelect value={iconSize} onChange={setIconSize} />
                        </FormGroup>
                        <Box asChild={true} marginBottom={0}>
                            <FormGroup label="Icon Color">
                                <ColorPicker value={iconColor} onChange={setIconColor} />
                            </FormGroup>
                        </Box>
                    </div>
                    <Flex
                        asChild={true}
                        alignItems="center"
                        flexDirection="column"
                        gap={4}
                        justifyContent="center"
                        style={{ aspectRatio: "1 / 1", width: "200px" }}
                    >
                        <Card elevation={2}>
                            <Icon icon={selectedIcon} size={iconSize} style={{ color: iconColor }} />
                            <Code>{selectedIcon}</Code>
                        </Card>
                    </Flex>
                </SectionCard>
            </Flex>
        </Section>
    );
};
