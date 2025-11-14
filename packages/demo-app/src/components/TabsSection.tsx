/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { useState } from "react";

import { Classes, H5, type IconName, Section, SectionCard, Tab, type TabId, Tabs } from "@blueprintjs/core";
import { Box, Flex } from "@blueprintjs/labs";

interface TabsSectionProps {
    selectedIcon: IconName;
}

export function TabsSection({ selectedIcon }: TabsSectionProps) {
    const [basicTabId, setBasicTabId] = useState<TabId>("tab1");
    const [sizeTabId, setSizeTabId] = useState<TabId>("medium1");
    const [verticalTabId, setVerticalTabId] = useState<TabId>("vtab1");
    const [mixedTabId, setMixedTabId] = useState<TabId>("mixed1");
    const [tagTabId, setTagTabId] = useState<TabId>("tag1");
    const [stateTabId, setStateTabId] = useState<TabId>("state1");

    return (
        <Section title="Tabs" collapsible={true}>
            <SectionCard>
                <Flex flexDirection="column" gap={4} marginTop={4}>
                    {/* Basic Tabs with Icons */}
                    <Box>
                        <H5>Basic Tabs with Icons</H5>
                        <Tabs id="basic-tabs" onChange={setBasicTabId} selectedTabId={basicTabId}>
                            <Tab
                                icon={selectedIcon}
                                id="tab1"
                                panel={<div className={Classes.RUNNING_TEXT}>Content for Home tab</div>}
                                title="Home"
                            />
                            <Tab
                                icon={selectedIcon}
                                id="tab2"
                                panel={<div className={Classes.RUNNING_TEXT}>Content for Files tab</div>}
                                title="Files"
                            />
                            <Tab
                                icon={selectedIcon}
                                id="tab3"
                                panel={<div className={Classes.RUNNING_TEXT}>Content for Settings tab</div>}
                                title="Settings"
                            />
                        </Tabs>
                    </Box>

                    {/* Tab Sizes */}
                    <Box>
                        <H5>Tab Sizes</H5>
                        <Flex flexDirection="column" gap={3}>
                            <div>
                                <p className={Classes.TEXT_MUTED} style={{ marginBottom: "8px" }}>
                                    Medium (default):
                                </p>
                                <Tabs id="medium-tabs" onChange={setSizeTabId} selectedTabId={sizeTabId}>
                                    <Tab
                                        icon={selectedIcon}
                                        id="medium1"
                                        panel={<div className={Classes.RUNNING_TEXT}>Medium tab content</div>}
                                        title="Dashboard"
                                    />
                                    <Tab
                                        icon={selectedIcon}
                                        id="medium2"
                                        panel={<div className={Classes.RUNNING_TEXT}>Medium tab content</div>}
                                        title="Analytics"
                                    />
                                </Tabs>
                            </div>
                            <div>
                                <p className={Classes.TEXT_MUTED} style={{ marginBottom: "8px" }}>
                                    Large:
                                </p>
                                <Tabs id="large-tabs" size="large">
                                    <Tab
                                        icon={selectedIcon}
                                        id="large1"
                                        panel={<div className={Classes.RUNNING_TEXT}>Large tab content</div>}
                                        title="Dashboard"
                                    />
                                    <Tab
                                        icon={selectedIcon}
                                        id="large2"
                                        panel={<div className={Classes.RUNNING_TEXT}>Large tab content</div>}
                                        title="Analytics"
                                    />
                                </Tabs>
                            </div>
                        </Flex>
                    </Box>

                    {/* Vertical Tabs */}
                    <Box>
                        <H5>Vertical Tabs</H5>
                        <Tabs
                            id="vertical-tabs"
                            onChange={setVerticalTabId}
                            selectedTabId={verticalTabId}
                            vertical={true}
                        >
                            <Tab
                                icon={selectedIcon}
                                id="vtab1"
                                panel={<div className={Classes.RUNNING_TEXT}>Vertical tab content for Overview</div>}
                                title="Overview"
                            />
                            <Tab
                                icon={selectedIcon}
                                id="vtab2"
                                panel={<div className={Classes.RUNNING_TEXT}>Vertical tab content for Details</div>}
                                title="Details"
                            />
                            <Tab
                                icon={selectedIcon}
                                id="vtab3"
                                panel={<div className={Classes.RUNNING_TEXT}>Vertical tab content for History</div>}
                                title="History"
                            />
                        </Tabs>
                    </Box>

                    {/* Mixed Icon Tabs */}
                    <Box>
                        <H5>Mixed Icon Usage</H5>
                        <Tabs id="mixed-tabs" onChange={setMixedTabId} selectedTabId={mixedTabId}>
                            <Tab
                                icon={selectedIcon}
                                id="mixed1"
                                panel={<div className={Classes.RUNNING_TEXT}>Your selected icon</div>}
                                title="Custom"
                            />
                            <Tab
                                icon="home"
                                id="mixed2"
                                panel={<div className={Classes.RUNNING_TEXT}>Home icon</div>}
                                title="Home"
                            />
                            <Tab
                                icon="folder-open"
                                id="mixed3"
                                panel={<div className={Classes.RUNNING_TEXT}>Folder icon</div>}
                                title="Files"
                            />
                            <Tab
                                id="mixed4"
                                panel={<div className={Classes.RUNNING_TEXT}>No icon</div>}
                                title="Plain"
                            />
                        </Tabs>
                    </Box>

                    {/* Tabs with Tag Content */}
                    <Box>
                        <H5>Tabs with Badges</H5>
                        <Tabs id="tag-tabs" onChange={setTagTabId} selectedTabId={tagTabId}>
                            <Tab
                                icon={selectedIcon}
                                id="tag1"
                                panel={<div className={Classes.RUNNING_TEXT}>Messages content</div>}
                                tagContent={5}
                                title="Messages"
                            />
                            <Tab
                                icon={selectedIcon}
                                id="tag2"
                                panel={<div className={Classes.RUNNING_TEXT}>Notifications content</div>}
                                tagContent={12}
                                title="Notifications"
                            />
                            <Tab
                                icon={selectedIcon}
                                id="tag3"
                                panel={<div className={Classes.RUNNING_TEXT}>Tasks content</div>}
                                tagContent="New"
                                title="Tasks"
                            />
                        </Tabs>
                    </Box>

                    {/* Tab States */}
                    <Box>
                        <H5>Tab States</H5>
                        <Tabs id="state-tabs" onChange={setStateTabId} selectedTabId={stateTabId}>
                            <Tab
                                icon={selectedIcon}
                                id="state1"
                                panel={<div className={Classes.RUNNING_TEXT}>Active tab content</div>}
                                title="Active"
                            />
                            <Tab
                                icon={selectedIcon}
                                id="state2"
                                panel={<div className={Classes.RUNNING_TEXT}>Normal tab content</div>}
                                title="Normal"
                            />
                            <Tab disabled={true} icon={selectedIcon} id="state3" title="Disabled" />
                        </Tabs>
                    </Box>

                    {/* Real-World Example */}
                    <Box>
                        <H5>Real-World Example</H5>
                        <Tabs id="real-world-tabs">
                            <Tab
                                icon="dashboard"
                                id="rw1"
                                panel={
                                    <div className={Classes.RUNNING_TEXT}>
                                        <p>
                                            Welcome to your dashboard. Here you can see an overview of your account
                                            activity.
                                        </p>
                                    </div>
                                }
                                title="Dashboard"
                            />
                            <Tab
                                icon={selectedIcon}
                                id="rw2"
                                panel={
                                    <div className={Classes.RUNNING_TEXT}>
                                        <p>View and manage your projects. Create new projects or edit existing ones.</p>
                                    </div>
                                }
                                title="Projects"
                            />
                            <Tab
                                icon="chart"
                                id="rw3"
                                panel={
                                    <div className={Classes.RUNNING_TEXT}>
                                        <p>Analyze your data with comprehensive charts and reports.</p>
                                    </div>
                                }
                                tagContent={3}
                                title="Analytics"
                            />
                            <Tab
                                icon="cog"
                                id="rw4"
                                panel={
                                    <div className={Classes.RUNNING_TEXT}>
                                        <p>Configure your account settings and preferences.</p>
                                    </div>
                                }
                                title="Settings"
                            />
                        </Tabs>
                    </Box>
                </Flex>
            </SectionCard>
        </Section>
    );
}
