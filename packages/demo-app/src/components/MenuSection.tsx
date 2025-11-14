/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { Classes, H5, Icon, type IconName, Menu, MenuDivider, MenuItem, Section, SectionCard } from "@blueprintjs/core";
import { Box, Flex } from "@blueprintjs/labs";

interface MenuSectionProps {
    selectedIcon: IconName;
}

export function MenuSection({ selectedIcon }: MenuSectionProps) {
    return (
        <Section title="Menus" collapsible={true}>
            <SectionCard>
                <Flex flexDirection="column" gap={4} marginTop={4}>
                    {/* Basic Menu Items */}
                    <Box style={{ maxWidth: 240 }}>
                        <H5>Basic Menu with Icons</H5>
                        <Menu className={Classes.ELEVATION_1}>
                            <MenuItem icon={selectedIcon} text="New File" />
                            <MenuItem icon={selectedIcon} text="Open File" />
                            <MenuItem icon={selectedIcon} text="Save" />
                            <MenuDivider />
                            <MenuItem icon={selectedIcon} text="Export" />
                        </Menu>
                    </Box>

                    {/* Menu Sizes */}
                    <Box style={{ maxWidth: 240 }}>
                        <H5>Menu Sizes</H5>
                        <Flex gap={2} alignItems="start">
                            <Menu className={Classes.ELEVATION_1} size="small">
                                <MenuItem icon={selectedIcon} text="Small Item 1" />
                                <MenuItem icon={selectedIcon} text="Small Item 2" />
                            </Menu>
                            <Menu className={Classes.ELEVATION_1}>
                                <MenuItem icon={selectedIcon} text="Medium Item 1" />
                                <MenuItem icon={selectedIcon} text="Medium Item 2" />
                            </Menu>
                            <Menu className={Classes.ELEVATION_1} size="large">
                                <MenuItem icon={selectedIcon} text="Large Item 1" />
                                <MenuItem icon={selectedIcon} text="Large Item 2" />
                            </Menu>
                        </Flex>
                    </Box>

                    {/* Mixed Icons */}
                    <Box style={{ maxWidth: 240 }}>
                        <H5>Mixed Icon Usage</H5>
                        <Menu className={Classes.ELEVATION_1}>
                            <MenuItem icon={selectedIcon} text="Your Icon" />
                            <MenuItem icon="document" text="Documents" />
                            <MenuItem icon="folder-open" text="Open Folder" />
                            <MenuItem text="No Icon" />
                            <MenuDivider />
                            <MenuItem icon="cog" text="Settings" />
                        </Menu>
                    </Box>

                    {/* Menu Structure */}
                    <Box style={{ maxWidth: 240 }}>
                        <H5>Menu Structure with Dividers</H5>
                        <Menu className={Classes.ELEVATION_1}>
                            <MenuDivider title="File" />
                            <MenuItem icon={selectedIcon} text="New" />
                            <MenuItem icon={selectedIcon} text="Open" />
                            <MenuItem icon={selectedIcon} text="Save" />
                            <MenuDivider title="Edit" />
                            <MenuItem icon="cut" text="Cut" />
                            <MenuItem icon="duplicate" text="Copy" />
                            <MenuItem icon="clipboard" text="Paste" />
                        </Menu>
                    </Box>

                    {/* Menu Item States */}
                    <Box style={{ maxWidth: 240 }}>
                        <H5>Item States</H5>
                        <Menu className={Classes.ELEVATION_1}>
                            <MenuItem icon={selectedIcon} text="Normal Item" />
                            <MenuItem active={true} icon={selectedIcon} text="Active Item" />
                            <MenuItem disabled={true} icon={selectedIcon} text="Disabled Item" />
                            <MenuDivider />
                            <MenuItem icon={selectedIcon} intent="primary" text="Primary" />
                            <MenuItem icon={selectedIcon} intent="success" text="Success" />
                            <MenuItem icon={selectedIcon} intent="warning" text="Warning" />
                            <MenuItem icon={selectedIcon} intent="danger" text="Danger" />
                        </Menu>
                    </Box>

                    {/* Nested Submenus */}
                    <Box style={{ maxWidth: 240 }}>
                        <H5>Nested Submenus with Icons</H5>
                        <Menu className={Classes.ELEVATION_1}>
                            <MenuItem icon={selectedIcon} text="Top Level Item" />
                            <MenuItem icon="folder-close" text="Files">
                                <MenuItem icon={selectedIcon} text="Recent Files" />
                                <MenuItem icon="document" text="All Documents" />
                                <MenuItem icon="media" text="Images" />
                            </MenuItem>
                            <MenuItem icon="style" text="Formatting">
                                <MenuItem icon="bold" text="Bold" />
                                <MenuItem icon="italic" text="Italic" />
                                <MenuItem icon="underline" text="Underline" />
                            </MenuItem>
                            <MenuItem icon={selectedIcon} text="Another Top Item" />
                        </Menu>
                    </Box>

                    {/* Menu with Label Elements */}
                    <Box style={{ maxWidth: 240 }}>
                        <H5>Menu Items with Labels</H5>
                        <Menu className={Classes.ELEVATION_1}>
                            <MenuItem icon={selectedIcon} label="⌘N" text="New" />
                            <MenuItem icon={selectedIcon} label="⌘O" text="Open" />
                            <MenuItem icon={selectedIcon} label="⌘S" text="Save" />
                            <MenuDivider />
                            <MenuItem icon={selectedIcon} labelElement={<Icon icon="share" />} text="Share" />
                            <MenuItem
                                icon={selectedIcon}
                                labelElement={<Icon icon="star" intent="warning" />}
                                text="Favorite"
                            />
                        </Menu>
                    </Box>

                    {/* Real-World Example */}
                    <Box style={{ maxWidth: 240 }}>
                        <H5>Real-World Example</H5>
                        <Menu className={Classes.ELEVATION_1}>
                            <MenuDivider title="Account" />
                            <MenuItem icon="user" text="Profile" />
                            <MenuItem icon={selectedIcon} text="Settings" />
                            <MenuItem icon="notifications" text="Notifications" />
                            <MenuDivider title="Actions" />
                            <MenuItem icon="upload" intent="primary" text="Upload Files" />
                            <MenuItem icon="share" text="Share" />
                            <MenuItem icon="download" text="Download" />
                            <MenuDivider />
                            <MenuItem icon="log-out" intent="danger" text="Sign Out" />
                        </Menu>
                    </Box>
                </Flex>
            </SectionCard>
        </Section>
    );
}
