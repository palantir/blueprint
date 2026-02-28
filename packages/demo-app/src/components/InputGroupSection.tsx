/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

/* eslint-disable react/jsx-no-bind */

import { useCallback, useState } from "react";

import {
    Button,
    H5,
    Icon,
    type IconName,
    InputGroup,
    type MaybeElement,
    Section,
    SectionCard,
    Tag,
} from "@blueprintjs/core";
import { Box, Flex } from "@blueprintjs/labs";

interface InputGroupSectionProps {
    selectedIcon: IconName | MaybeElement;
}

export function InputGroupSection({ selectedIcon }: InputGroupSectionProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [filterValue, setFilterValue] = useState("");

    const handleTogglePassword = useCallback(() => setShowPassword(prev => !prev), []);

    return (
        <Section title="Input Groups" collapsible={true}>
            <SectionCard>
                <Flex flexDirection="column" gap={4} marginTop={4}>
                    {/* Basic Left Icon */}
                    <Box>
                        <H5>Left Icon</H5>
                        <Flex flexDirection="column" gap={2} marginTop={2}>
                            <InputGroup leftIcon={selectedIcon} placeholder="Input with left icon..." />
                            <InputGroup leftIcon="search" placeholder="Search..." />
                            <InputGroup leftIcon="envelope" placeholder="Enter your email..." type="email" />
                        </Flex>
                    </Box>

                    {/* Sizes */}
                    <Box>
                        <H5>Sizes</H5>
                        <Flex flexDirection="column" gap={2} marginTop={2}>
                            <InputGroup leftIcon={selectedIcon} placeholder="Small input" size="small" />
                            <InputGroup leftIcon={selectedIcon} placeholder="Medium input (default)" />
                            <InputGroup leftIcon={selectedIcon} placeholder="Large input" size="large" />
                        </Flex>
                    </Box>

                    {/* Intents */}
                    <Box>
                        <H5>Intents</H5>
                        <Flex flexDirection="column" gap={2} marginTop={2}>
                            <InputGroup intent="none" leftIcon={selectedIcon} placeholder="Default" />
                            <InputGroup intent="primary" leftIcon={selectedIcon} placeholder="Primary" />
                            <InputGroup intent="success" leftIcon={selectedIcon} placeholder="Success" />
                            <InputGroup intent="warning" leftIcon={selectedIcon} placeholder="Warning" />
                            <InputGroup intent="danger" leftIcon={selectedIcon} placeholder="Danger" />
                        </Flex>
                    </Box>

                    {/* With Right Element */}
                    <Box>
                        <H5>With Right Element</H5>
                        <Flex flexDirection="column" gap={2} marginTop={2}>
                            <InputGroup
                                leftIcon={selectedIcon}
                                placeholder="Search..."
                                rightElement={<Button icon="arrow-right" intent="primary" variant="minimal" />}
                            />
                            <InputGroup
                                leftIcon={selectedIcon}
                                onChange={e => setFilterValue(e.target.value)}
                                placeholder="Filter..."
                                rightElement={<Tag minimal={true}>{filterValue.length}</Tag>}
                                value={filterValue}
                            />
                            <InputGroup
                                leftIcon={selectedIcon}
                                placeholder="Password..."
                                rightElement={
                                    <Button
                                        icon={showPassword ? "unlock" : "lock"}
                                        intent="warning"
                                        onClick={handleTogglePassword}
                                        variant="minimal"
                                    />
                                }
                                type={showPassword ? "text" : "password"}
                            />
                        </Flex>
                    </Box>

                    {/* Variants */}
                    <Box>
                        <H5>Variants</H5>
                        <Flex flexDirection="column" gap={2} marginTop={2}>
                            <InputGroup leftIcon={selectedIcon} placeholder="Standard" />
                            <InputGroup leftIcon={selectedIcon} placeholder="Round input" round={true} />
                            <InputGroup disabled={true} leftIcon={selectedIcon} placeholder="Disabled input" />
                            <InputGroup leftIcon={selectedIcon} placeholder="Read-only input" readOnly={true} />
                        </Flex>
                    </Box>

                    {/* Custom Left Element */}
                    <Box>
                        <H5>Custom Left Element</H5>
                        <Flex flexDirection="column" gap={2} marginTop={2}>
                            <InputGroup leftElement={<Tag minimal={true}>https://</Tag>} placeholder="example.com" />
                            <InputGroup leftElement={<Icon icon={selectedIcon} />} placeholder="With Icon element" />
                            <InputGroup leftElement={<Tag minimal={true}>$</Tag>} placeholder="0.00" type="number" />
                        </Flex>
                    </Box>

                    {/* Real-World Examples */}
                    <Box>
                        <H5>Real-World Examples</H5>
                        <Flex flexDirection="column" gap={2} marginTop={2}>
                            <InputGroup
                                leftIcon="search"
                                placeholder="Search documents..."
                                rightElement={<Button icon="filter" variant="minimal" />}
                            />
                            <InputGroup
                                intent="success"
                                leftIcon={selectedIcon}
                                placeholder="Username"
                                rightElement={<Icon icon="tick-circle" intent="success" />}
                            />
                            <InputGroup
                                leftElement={<Tag minimal={true}>To:</Tag>}
                                placeholder="recipient@example.com"
                                rightElement={<Button intent="primary" text="Send" />}
                                type="email"
                            />
                        </Flex>
                    </Box>
                </Flex>
            </SectionCard>
        </Section>
    );
}
