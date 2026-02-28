/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { Callout, H5, type IconName, type MaybeElement, Section, SectionCard } from "@blueprintjs/core";
import { Box, Flex } from "@blueprintjs/labs";

interface CalloutSectionProps {
    selectedIcon: IconName | MaybeElement;
}

export function CalloutSection({ selectedIcon }: CalloutSectionProps) {
    return (
        <Section title="Callouts" collapsible={true}>
            <SectionCard>
                <Flex flexDirection="column" gap={4} marginTop={4}>
                    {/* Intents */}
                    <Box>
                        <H5>Intents</H5>
                        <Flex flexDirection="column" gap={2} marginTop={2}>
                            <Callout icon={selectedIcon} title="Default Callout">
                                This is a callout with your selected icon and no intent.
                            </Callout>
                            <Callout icon={selectedIcon} intent="primary" title="Primary Callout">
                                This is a primary callout with your selected icon.
                            </Callout>
                            <Callout icon={selectedIcon} intent="success" title="Success Callout">
                                This is a success callout with your selected icon.
                            </Callout>
                            <Callout icon={selectedIcon} intent="warning" title="Warning Callout">
                                This is a warning callout with your selected icon.
                            </Callout>
                            <Callout icon={selectedIcon} intent="danger" title="Danger Callout">
                                This is a danger callout with your selected icon.
                            </Callout>
                        </Flex>
                    </Box>

                    {/* Compact */}
                    <Box>
                        <H5>Compact</H5>
                        <Flex flexDirection="column" gap={2} marginTop={2}>
                            <Callout compact={true} icon={selectedIcon} intent="primary" title="Compact Primary">
                                Compact callout has reduced visual padding.
                            </Callout>
                            <Callout compact={true} icon={selectedIcon} intent="success" title="Compact Success">
                                Compact success callout.
                            </Callout>
                            <Callout compact={true} icon={selectedIcon} intent="warning" title="Compact Warning">
                                Compact warning callout.
                            </Callout>
                        </Flex>
                    </Box>
                </Flex>
            </SectionCard>
        </Section>
    );
}
