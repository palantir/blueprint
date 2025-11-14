/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { Button, H5, type IconName, Section, SectionCard } from "@blueprintjs/core";
import { Box, Flex } from "@blueprintjs/labs";

interface ButtonSectionProps {
    selectedIcon: IconName;
}

export function ButtonSection({ selectedIcon }: ButtonSectionProps) {
    return (
        <Section title="Buttons" collapsible={true}>
            <SectionCard>
                <Flex flexDirection="column" gap={4} marginTop={4}>
                    {/* Size Variations */}
                    <Box>
                        <H5>Sizes</H5>
                        <Flex alignItems="center" gap={2} marginTop={2}>
                            <Button icon={selectedIcon} size="small" text="Small Button" />
                            <Button icon={selectedIcon} text="Medium Button" />
                            <Button icon={selectedIcon} size="large" text="Large Button" />
                        </Flex>
                    </Box>

                    {/* Intent Variations */}
                    <Box>
                        <H5>Intents</H5>
                        <Flex alignItems="center" flexWrap="wrap" gap={2} marginTop={2}>
                            <Button icon={selectedIcon} text="Default" />
                            <Button icon={selectedIcon} intent="primary" text="Primary" />
                            <Button icon={selectedIcon} intent="success" text="Success" />
                            <Button icon={selectedIcon} intent="warning" text="Warning" />
                            <Button icon={selectedIcon} intent="danger" text="Danger" />
                        </Flex>
                    </Box>

                    {/* Variant Variations */}
                    <Box>
                        <H5>Variants</H5>
                        <Flex alignItems="center" flexWrap="wrap" gap={2} marginTop={2}>
                            <Button icon={selectedIcon} intent="primary" text="Solid (Default)" />
                            <Button icon={selectedIcon} intent="primary" text="Outlined" variant="outlined" />
                            <Button icon={selectedIcon} intent="primary" text="Minimal" variant="minimal" />
                        </Flex>
                    </Box>

                    {/* Text Alignment Variations */}
                    <Box>
                        <H5>Text Alignment</H5>
                        <Flex flexDirection="column" gap={2} marginTop={2}>
                            <Button
                                alignText="start"
                                icon={selectedIcon}
                                style={{ width: "200px" }}
                                text="Align Start"
                            />
                            <Button
                                alignText="center"
                                icon={selectedIcon}
                                style={{ width: "200px" }}
                                text="Align Center"
                            />
                            <Button alignText="end" icon={selectedIcon} style={{ width: "200px" }} text="Align End" />
                        </Flex>
                    </Box>

                    {/* State Variations */}
                    <Box>
                        <H5>States</H5>
                        <Flex alignItems="center" flexWrap="wrap" gap={2} marginTop={2}>
                            <Button icon={selectedIcon} text="Normal" />
                            <Button active={true} icon={selectedIcon} text="Active" />
                            <Button disabled={true} icon={selectedIcon} text="Disabled" />
                        </Flex>
                    </Box>

                    {/* Icon Position Variations */}
                    <Box>
                        <H5>Icon Positions</H5>
                        <Flex alignItems="center" flexWrap="wrap" gap={2} marginTop={2}>
                            <Button icon={selectedIcon} />
                            <Button icon={selectedIcon} text="Start Icon" />
                            <Button endIcon={selectedIcon} text="End Icon" />
                            <Button endIcon="arrow-right" icon={selectedIcon} text="Both Icons" />
                            <Button endIcon="chevron-down" icon="folder-open" intent="primary" text="Different Icons" />
                        </Flex>
                    </Box>

                    {/* Mixed Examples */}
                    <Box>
                        <H5>Mixed Examples</H5>
                        <Flex alignItems="center" flexWrap="wrap" gap={2} marginTop={2}>
                            <Button icon={selectedIcon} intent="primary" size="small" text="Save Changes" />
                            <Button endIcon="trash" intent="danger" text="Delete Item" variant="outlined" />
                            <Button icon={selectedIcon} intent="success" size="large" text="Upload File" />
                            <Button endIcon="download" icon="document" text="Download Report" variant="minimal" />
                            <Button
                                endIcon="chevron-right"
                                icon={selectedIcon}
                                intent="primary"
                                size="large"
                                text="Continue"
                            />
                        </Flex>
                    </Box>
                </Flex>
            </SectionCard>
        </Section>
    );
}
