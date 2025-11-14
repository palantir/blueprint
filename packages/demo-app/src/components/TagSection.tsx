/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

/* eslint-disable react/jsx-no-bind */

import { useCallback, useState } from "react";

import { Button, H5, type IconName, Section, SectionCard, Tag } from "@blueprintjs/core";
import { Box, Flex } from "@blueprintjs/labs";

interface TagSectionProps {
    selectedIcon: IconName;
}

export function TagSection({ selectedIcon }: TagSectionProps) {
    const [tags, setTags] = useState(["Design", "Development", "Research", "Marketing"]);

    const handleRemove = useCallback((tag: string) => () => setTags(tags.filter(t => t !== tag)), [tags]);

    const handleReset = useCallback(() => setTags(["Design", "Development", "Research", "Marketing"]), []);

    return (
        <Section title="Tags" collapsible={true}>
            <SectionCard>
                <Flex flexDirection="column" gap={4} marginTop={4}>
                    {/* Basic Icon Positions */}
                    <Box>
                        <H5>Icon Positions</H5>
                        <Flex alignItems="center" flexWrap="wrap" gap={2} marginTop={2}>
                            <Tag icon={selectedIcon}>Start Icon</Tag>
                            <Tag endIcon={selectedIcon}>End Icon</Tag>
                            <Tag endIcon="arrow-right" icon={selectedIcon}>
                                Both Icons
                            </Tag>
                            <Tag>No Icon</Tag>
                        </Flex>
                    </Box>

                    {/* Sizes */}
                    <Box>
                        <H5>Sizes</H5>
                        <Flex alignItems="center" flexWrap="wrap" gap={2} marginTop={2}>
                            <Tag icon={selectedIcon}>Medium Tag</Tag>
                            <Tag icon={selectedIcon} size="large">
                                Large Tag
                            </Tag>
                        </Flex>
                    </Box>

                    {/* Intents */}
                    <Box>
                        <H5>Intents</H5>
                        <Flex alignItems="center" flexWrap="wrap" gap={2} marginTop={2}>
                            <Tag icon={selectedIcon}>Default</Tag>
                            <Tag icon={selectedIcon} intent="primary">
                                Primary
                            </Tag>
                            <Tag icon={selectedIcon} intent="success">
                                Success
                            </Tag>
                            <Tag icon={selectedIcon} intent="warning">
                                Warning
                            </Tag>
                            <Tag icon={selectedIcon} intent="danger">
                                Danger
                            </Tag>
                        </Flex>
                    </Box>

                    {/* Variants */}
                    <Box>
                        <H5>Variants</H5>
                        <Flex alignItems="center" flexWrap="wrap" gap={2} marginTop={2}>
                            <Tag icon={selectedIcon} intent="primary">
                                Standard
                            </Tag>
                            <Tag icon={selectedIcon} intent="primary" minimal={true}>
                                Minimal
                            </Tag>
                            <Tag icon={selectedIcon} intent="primary" round={true}>
                                Round
                            </Tag>
                            <Tag icon={selectedIcon} intent="primary" minimal={true} round={true}>
                                Minimal + Round
                            </Tag>
                        </Flex>
                    </Box>

                    {/* Interactive Tags */}
                    <Box>
                        <H5>Interactive</H5>
                        <Flex alignItems="center" flexWrap="wrap" gap={2} marginTop={2}>
                            <Tag icon={selectedIcon} intent="primary" interactive={true}>
                                Interactive Tag
                            </Tag>
                            <Tag
                                icon={selectedIcon}
                                intent="success"
                                interactive={true}
                                onClick={() => alert("Tag clicked!")}
                            >
                                Clickable Tag
                            </Tag>
                            <Tag endIcon={selectedIcon} intent="warning" interactive={true} round={true}>
                                Interactive Round
                            </Tag>
                        </Flex>
                    </Box>

                    {/* Removable Tags */}
                    <Box>
                        <H5>Removable Tags</H5>
                        <Flex alignItems="center" flexWrap="wrap" gap={2} marginTop={2}>
                            {tags.map(tag => (
                                <Tag key={tag} icon={selectedIcon} intent="primary" onRemove={handleRemove(tag)}>
                                    {tag}
                                </Tag>
                            ))}
                            <Button icon="refresh" onClick={handleReset} size="small" variant="minimal">
                                Reset
                            </Button>
                        </Flex>
                    </Box>

                    {/* Mixed Examples */}
                    <Box>
                        <H5>Mixed Examples</H5>
                        <Flex alignItems="center" flexWrap="wrap" gap={2} marginTop={2}>
                            <Tag icon={selectedIcon} intent="primary" minimal={true} round={true}>
                                Category
                            </Tag>
                            <Tag endIcon="cross" icon={selectedIcon} intent="danger">
                                Error
                            </Tag>
                            <Tag icon={selectedIcon} interactive={true} minimal={true}>
                                Filter
                            </Tag>
                            <Tag endIcon="chevron-right" icon="folder-close" intent="none" size="large">
                                Project Files
                            </Tag>
                        </Flex>
                    </Box>
                </Flex>
            </SectionCard>
        </Section>
    );
}
