/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useCallback, useEffect, useState } from "react";

import {
    Button,
    Callout,
    Card,
    Checkbox,
    Classes,
    Code,
    Dialog,
    DialogBody,
    DialogFooter,
    Divider,
    FileInput,
    FormGroup,
    H3,
    H5,
    HTMLSelect,
    InputGroup,
    Menu,
    MenuItem,
    OverlayToaster,
    PopoverNext,
    Slider,
    Tab,
    Tabs,
    Tag,
} from "@blueprintjs/core";
import { DatePicker, TimePicker } from "@blueprintjs/datetime";
import { Box } from "@blueprintjs/labs";
import { type ItemRenderer, Omnibar, Select } from "@blueprintjs/select";
import { Cell, Column, Table } from "@blueprintjs/table";

const SPACING_TOKEN = "--bp-surface-spacing";
const SELECT_ITEMS = ["Alpha", "Bravo", "Charlie", "Delta"];

const filterSelectItem = (query: string, item: string) => item.toLowerCase().includes(query.toLowerCase());

const renderSelectItem: ItemRenderer<string> = (item, { handleClick, handleFocus, modifiers }) => {
    if (!modifiers.matchesPredicate) {
        return null;
    }

    return (
        <MenuItem
            active={modifiers.active}
            disabled={modifiers.disabled}
            key={item}
            onClick={handleClick}
            onFocus={handleFocus}
            roleStructure="listoption"
            text={item}
        />
    );
};

const ignoreSelectedItem = () => undefined;
const renderNameCell = (rowIndex: number) => <Cell>{SELECT_ITEMS[rowIndex]}</Cell>;
const renderDetailsCell = (rowIndex: number) => <Cell truncated={true}>Row {rowIndex + 1} details</Cell>;

interface SpacingStoryArgs {
    spacing: number;
}

const meta = {
    title: "Theming/Spacing",
    parameters: {
        layout: "fullscreen",
    },
    args: {
        spacing: 4,
    },
    argTypes: {
        spacing: {
            control: { max: 12, min: 0, step: 1, type: "range" },
            description: `Value applied to ${SPACING_TOKEN}, in pixels`,
        },
    },
} satisfies Meta<SpacingStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const KitchenSink: Story = {
    render: args => <SpacingKitchenSink {...args} />,
};

function SpacingKitchenSink({ spacing }: SpacingStoryArgs) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isOmnibarOpen, setIsOmnibarOpen] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        const previousValue = root.style.getPropertyValue(SPACING_TOKEN);
        const previousPriority = root.style.getPropertyPriority(SPACING_TOKEN);

        root.style.setProperty(SPACING_TOKEN, `${spacing}px`);

        return () => {
            if (previousValue === "") {
                root.style.removeProperty(SPACING_TOKEN);
            } else {
                root.style.setProperty(SPACING_TOKEN, previousValue, previousPriority);
            }
        };
    }, [spacing]);

    const closeDialog = useCallback(() => setIsDialogOpen(false), []);
    const closeOmnibar = useCallback(() => setIsOmnibarOpen(false), []);
    const openDialog = useCallback(() => setIsDialogOpen(true), []);
    const openOmnibar = useCallback(() => setIsOmnibarOpen(true), []);
    const showToast = useCallback(() => {
        void OverlayToaster.create().then(toaster => {
            toaster.show({ icon: "notifications", message: `Spacing is ${spacing}px` });
        });
    }, [spacing]);

    return (
        <main style={{ margin: "0 auto", maxWidth: 1440, padding: "calc(var(--bp-surface-spacing) * 6)" }}>
            <div style={{ marginBottom: "calc(var(--bp-surface-spacing) * 5)" }}>
                <H3>Spacing kitchen sink</H3>
                <p className={Classes.TEXT_MUTED}>
                    <Code>{SPACING_TOKEN}</Code> is currently <strong>{spacing}px</strong>. The examples use the shared
                    token directly or through component-specific variables.
                </p>
            </div>

            <div
                style={{
                    display: "grid",
                    gap: "calc(var(--bp-surface-spacing) * 5)",
                    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                }}
            >
                <ExampleCard title="Core surfaces and layout">
                    <Callout icon="info-sign" title="Shared surface spacing">
                        Padding and margins in this callout scale with the token.
                    </Callout>
                    <Card>
                        <H5>Nested card</H5>
                        <p>Cards, tags, menus, and buttons exercise common spacing multiples.</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--bp-surface-spacing)" }}>
                            <Button icon="add" text="Create" />
                            <Button intent="primary" text="Save changes" />
                            <Tag icon="tag">Runtime token</Tag>
                        </div>
                    </Card>
                    <Menu>
                        <MenuItem icon="document" text="Document" />
                        <MenuItem icon="folder-close" text="Folder" />
                        <MenuItem icon="settings" text="Settings" />
                    </Menu>
                </ExampleCard>

                <ExampleCard title="Forms and controls">
                    <FormGroup helperText="Helper text also participates in form spacing." label="Project name">
                        <InputGroup leftIcon="search" placeholder="Search projects" />
                    </FormGroup>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "calc(var(--bp-surface-spacing) * 2)" }}>
                        <HTMLSelect options={["Small", "Medium", "Large"]} />
                        <FileInput buttonText="Choose file" text="No file selected" />
                    </div>
                    <Checkbox defaultChecked={true} label="Enable notifications" />
                    <Slider defaultValue={6} labelStepSize={2} max={10} min={0} />
                    <Tabs defaultSelectedTabId="first">
                        <Tab id="first" panel={<p>First tab panel</p>} title="First" />
                        <Tab id="second" panel={<p>Second tab panel</p>} title="Second" />
                    </Tabs>
                </ExampleCard>

                <ExampleCard title="Labs Box utilities">
                    <Box display="flex" flexDirection="column" gap={3} padding={4}>
                        <Callout title="Box padding = 4">
                            This container uses token-backed padding and gap utilities.
                        </Callout>
                        <Box display="flex" gap={2}>
                            <Button fill={true} text="One" />
                            <Button fill={true} text="Two" />
                            <Button fill={true} text="Three" />
                        </Box>
                    </Box>
                </ExampleCard>

                <ExampleCard title="Date and time">
                    <DatePicker defaultValue={new Date(2024, 5, 14)} initialMonth={new Date(2024, 5, 1)} />
                    <Divider />
                    <TimePicker defaultValue={new Date(2024, 5, 14, 9, 30)} />
                </ExampleCard>

                <ExampleCard title="Select and overlays">
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "calc(var(--bp-surface-spacing) * 2)" }}>
                        <Select<string>
                            itemPredicate={filterSelectItem}
                            itemRenderer={renderSelectItem}
                            items={SELECT_ITEMS}
                            onItemSelect={ignoreSelectedItem}
                        >
                            <Button endIcon="caret-down" text="Open Select" />
                        </Select>
                        <PopoverNext
                            content={
                                <Menu>
                                    <MenuItem text="Popover menu item" />
                                </Menu>
                            }
                            placement="right"
                        >
                            <Button text="Open Popover" />
                        </PopoverNext>
                        <Button onClick={openDialog} text="Open Dialog" />
                        <Button onClick={openOmnibar} text="Open Omnibar" />
                        <Button onClick={showToast} text="Show Toast" />
                    </div>
                    <p className={Classes.TEXT_MUTED}>
                        Portal content inherits the token from <Code>document.documentElement</Code>.
                    </p>
                </ExampleCard>

                <ExampleCard title="Table data controls" wide={true}>
                    <div style={{ height: 180 }}>
                        <Table defaultRowHeight={32} numRows={3}>
                            <Column cellRenderer={renderNameCell} name="Name" />
                            <Column cellRenderer={renderDetailsCell} name="Details" />
                        </Table>
                    </div>
                </ExampleCard>
            </div>

            <Dialog isOpen={isDialogOpen} onClose={closeDialog} title="Portal dialog">
                <DialogBody>This dialog uses the root spacing token even though it renders in a portal.</DialogBody>
                <DialogFooter actions={<Button intent="primary" onClick={closeDialog} text="Done" />} />
            </Dialog>

            <Omnibar<string>
                isOpen={isOmnibarOpen}
                itemPredicate={filterSelectItem}
                itemRenderer={renderSelectItem}
                items={SELECT_ITEMS}
                onClose={closeOmnibar}
                onItemSelect={closeOmnibar}
            />
        </main>
    );
}

interface ExampleCardProps {
    children: React.ReactNode;
    title: string;
    wide?: boolean;
}

function ExampleCard({ children, title, wide = false }: ExampleCardProps) {
    return (
        <Card
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "calc(var(--bp-surface-spacing) * 3)",
                gridColumn: wide ? "1 / -1" : undefined,
                minWidth: 0,
            }}
        >
            <H5 style={{ margin: 0 }}>{title}</H5>
            {children}
        </Card>
    );
}
