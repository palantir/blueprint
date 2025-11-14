/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

/* eslint-disable react/jsx-no-bind */

import { useCallback, useState } from "react";

import { Button, CompoundTag, H5, type IconName, Section, SectionCard } from "@blueprintjs/core";
import { Box, Flex } from "@blueprintjs/labs";

interface CompoundTagSectionProps {
    selectedIcon: IconName;
}

export function CompoundTagSection({ selectedIcon }: CompoundTagSectionProps) {
    const [tags, setTags] = useState([
        { key: "User", value: "Alice Johnson" },
        { key: "Status", value: "Active" },
        { key: "Role", value: "Administrator" },
    ]);

    const handleRemove = useCallback((value: string) => () => setTags(tags.filter(t => t.value !== value)), [tags]);

    const handleReset = useCallback(
        () =>
            setTags([
                { key: "User", value: "Alice Johnson" },
                { key: "Status", value: "Active" },
                { key: "Role", value: "Administrator" },
            ]),
        [],
    );

    return (
        <Section title="Compound Tags" collapsible={true}>
            <SectionCard>
                <Flex flexDirection="column" gap={4} marginTop={4}>
                    {/* Basic Icon Positions */}
                    <Box>
                        <H5>Icon Positions</H5>
                        <Flex alignItems="center" flexWrap="wrap" gap={2} marginTop={2}>
                            <CompoundTag icon={selectedIcon} leftContent="Type">
                                Document
                            </CompoundTag>
                            <CompoundTag endIcon={selectedIcon} leftContent="Category">
                                Design
                            </CompoundTag>
                            <CompoundTag endIcon="chevron-right" icon={selectedIcon} leftContent="Project">
                                Blueprint
                            </CompoundTag>
                            <CompoundTag leftContent="Status">Active</CompoundTag>
                        </Flex>
                    </Box>

                    {/* Sizes */}
                    <Box>
                        <H5>Sizes</H5>
                        <Flex alignItems="center" flexWrap="wrap" gap={2} marginTop={2}>
                            <CompoundTag icon={selectedIcon} leftContent="Size">
                                Medium
                            </CompoundTag>
                            <CompoundTag icon={selectedIcon} leftContent="Size" size="large">
                                Large
                            </CompoundTag>
                        </Flex>
                    </Box>

                    {/* Intents */}
                    <Box>
                        <H5>Intents</H5>
                        <Flex alignItems="center" flexWrap="wrap" gap={2} marginTop={2}>
                            <CompoundTag icon={selectedIcon} leftContent="Intent">
                                Default
                            </CompoundTag>
                            <CompoundTag icon={selectedIcon} intent="primary" leftContent="Intent">
                                Primary
                            </CompoundTag>
                            <CompoundTag icon={selectedIcon} intent="success" leftContent="Intent">
                                Success
                            </CompoundTag>
                            <CompoundTag icon={selectedIcon} intent="warning" leftContent="Intent">
                                Warning
                            </CompoundTag>
                            <CompoundTag icon={selectedIcon} intent="danger" leftContent="Intent">
                                Danger
                            </CompoundTag>
                        </Flex>
                    </Box>

                    {/* Variants */}
                    <Box>
                        <H5>Variants</H5>
                        <Flex alignItems="center" flexWrap="wrap" gap={2} marginTop={2}>
                            <CompoundTag icon={selectedIcon} intent="primary" leftContent="Variant">
                                Standard
                            </CompoundTag>
                            <CompoundTag icon={selectedIcon} intent="primary" leftContent="Variant" minimal={true}>
                                Minimal
                            </CompoundTag>
                            <CompoundTag icon={selectedIcon} intent="primary" leftContent="Variant" round={true}>
                                Round
                            </CompoundTag>
                            <CompoundTag
                                icon={selectedIcon}
                                intent="primary"
                                leftContent="Variant"
                                minimal={true}
                                round={true}
                            >
                                Minimal + Round
                            </CompoundTag>
                        </Flex>
                    </Box>

                    {/* Interactive */}
                    <Box>
                        <H5>Interactive</H5>
                        <Flex alignItems="center" flexWrap="wrap" gap={2} marginTop={2}>
                            <CompoundTag icon={selectedIcon} intent="primary" interactive={true} leftContent="Action">
                                Click Me
                            </CompoundTag>
                            <CompoundTag
                                icon={selectedIcon}
                                intent="success"
                                interactive={true}
                                leftContent="Edit"
                                onClick={() => alert("Editing...")}
                            >
                                Value
                            </CompoundTag>
                        </Flex>
                    </Box>

                    {/* Removable */}
                    <Box>
                        <H5>Removable Tags</H5>
                        <Flex alignItems="center" flexWrap="wrap" gap={2} marginTop={2}>
                            {tags.map(tag => (
                                <CompoundTag
                                    key={tag.value}
                                    icon={selectedIcon}
                                    intent="primary"
                                    leftContent={tag.key}
                                    onRemove={handleRemove(tag.value)}
                                >
                                    {tag.value}
                                </CompoundTag>
                            ))}
                            <Button icon="refresh" onClick={handleReset} size="small" variant="minimal">
                                Reset
                            </Button>
                        </Flex>
                    </Box>

                    {/* Real-World Examples */}
                    <Box>
                        <H5>Real-World Examples</H5>
                        <Flex alignItems="center" flexWrap="wrap" gap={2} marginTop={2}>
                            <CompoundTag icon="person" leftContent="Owner">
                                John Smith
                            </CompoundTag>
                            <CompoundTag
                                endIcon="tick-circle"
                                icon={selectedIcon}
                                intent="success"
                                leftContent="Status"
                            >
                                Approved
                            </CompoundTag>
                            <CompoundTag icon="calendar" leftContent="Due Date" minimal={true}>
                                Dec 31, 2025
                            </CompoundTag>
                            <CompoundTag endIcon="chevron-right" icon="globe" intent="primary" leftContent="Region">
                                North America
                            </CompoundTag>
                            <CompoundTag icon={selectedIcon} leftContent="Priority" round={true}>
                                High
                            </CompoundTag>
                        </Flex>
                    </Box>
                </Flex>
            </SectionCard>
        </Section>
    );
}
