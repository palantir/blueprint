/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import {
    Alignment,
    Breadcrumbs,
    Button,
    ButtonGroup,
    Callout,
    Card,
    CardList,
    Checkbox,
    CompoundTag,
    Dialog,
    DialogBody,
    DialogFooter,
    Divider,
    FormGroup,
    H4,
    HTMLSelect,
    HTMLTable,
    InputGroup,
    Intent,
    Menu,
    MenuDivider,
    MenuItem,
    Navbar,
    NonIdealState,
    NumericInput,
    PopoverNext,
    ProgressBar,
    Radio,
    RadioGroup,
    Section,
    SectionCard,
    SegmentedControl,
    Slider,
    Spinner,
    Switch,
    Tab,
    Tabs,
    Tag,
    TextArea,
    Toast,
    Tooltip,
} from "../index";

const noop = () => undefined;

const INTENTS = [Intent.NONE, Intent.PRIMARY, Intent.SUCCESS, Intent.WARNING, Intent.DANGER];

/**
 * Many components at once, to judge a theme as a whole. Change the Primary, Success, Warning and Danger
 * colors in the Theme panel, and switch light/dark in the toolbar.
 */
function ThemePlayground() {
    const [radio, setRadio] = useState("weekly");
    const [slider, setSlider] = useState(4);
    const [segment, setSegment] = useState("list");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const handleRadioChange = useCallback(
        (event: React.FormEvent<HTMLInputElement>) => setRadio(event.currentTarget.value),
        [],
    );
    const openDialog = useCallback(() => setIsDialogOpen(true), []);
    const closeDialog = useCallback(() => setIsDialogOpen(false), []);

    return (
        <div style={{ background: "var(--bp-background-color-base)", minHeight: "100vh" }}>
            <Navbar>
                <Navbar.Group align={Alignment.START}>
                    <Navbar.Heading>Theme playground</Navbar.Heading>
                    <Navbar.Divider />
                    <Button icon="home" text="Home" variant="minimal" />
                    <Button icon="document" text="Files" variant="minimal" />
                </Navbar.Group>
                <Navbar.Group align={Alignment.END}>
                    <InputGroup leftIcon="search" placeholder="Search..." />
                    <Navbar.Divider />
                    <Button icon="cog" variant="minimal" aria-label="Settings" />
                </Navbar.Group>
            </Navbar>

            <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(3, minmax(0, 1fr))", padding: 16 }}>
                <Card>
                    <Breadcrumbs
                        items={[{ href: "#", text: "Projects" }, { href: "#", text: "Blueprint" }, { text: "Tokens" }]}
                    />
                    <H4>Settings form</H4>
                    <FormGroup label="Project name" labelFor="playground-name" labelInfo="(required)">
                        <InputGroup id="playground-name" placeholder="My project" />
                    </FormGroup>
                    <FormGroup label="Owner" helperText="Helper text with a muted color.">
                        <HTMLSelect options={["Design", "Engineering", "Research"]} fill={true} />
                    </FormGroup>
                    <FormGroup label="Replicas">
                        <NumericInput defaultValue={3} fill={true} />
                    </FormGroup>
                    <FormGroup label="Description">
                        <TextArea fill={true} placeholder="Describe the project" />
                    </FormGroup>
                    <InputGroup intent={Intent.DANGER} defaultValue="Invalid value" />
                    <InputGroup disabled={true} placeholder="Disabled input" style={{ marginTop: 8 }} />
                    <Divider />
                    <Checkbox defaultChecked={true} label="Send notifications" />
                    <Checkbox indeterminate={true} label="Some items selected" />
                    <Switch defaultChecked={true} label="Enable sync" />
                    <RadioGroup inline={true} label="Frequency" onChange={handleRadioChange} selectedValue={radio}>
                        <Radio label="Daily" value="daily" />
                        <Radio label="Weekly" value="weekly" />
                    </RadioGroup>
                    <Slider max={10} min={0} onChange={setSlider} value={slider} />
                    <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                        <Button intent={Intent.PRIMARY} text="Save" />
                        <Button text="Cancel" />
                        <Button disabled={true} text="Disabled" />
                    </div>
                </Card>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <Callout intent={Intent.PRIMARY} title="Primary callout">
                        Soft background with the Primary low-contrast text.
                    </Callout>
                    <Callout intent={Intent.WARNING} title="Warning callout">
                        Check your configuration before continuing.
                    </Callout>
                    <Card>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {INTENTS.map(intent => (
                                <Button intent={intent} key={intent} text={intent} />
                            ))}
                            {INTENTS.map(intent => (
                                <Button intent={intent} key={intent} text={intent} variant="outlined" />
                            ))}
                            {INTENTS.map(intent => (
                                <Button intent={intent} key={intent} text={intent} variant="minimal" />
                            ))}
                        </div>
                        <Divider />
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {INTENTS.map(intent => (
                                <Tag intent={intent} key={intent} onRemove={noop}>
                                    {intent}
                                </Tag>
                            ))}
                            {INTENTS.map(intent => (
                                <Tag intent={intent} key={intent} minimal={true} interactive={true}>
                                    {intent}
                                </Tag>
                            ))}
                            <CompoundTag intent={Intent.PRIMARY} leftContent="Key">
                                Value
                            </CompoundTag>
                        </div>
                        <Divider />
                        <ProgressBar intent={Intent.PRIMARY} value={0.6} />
                        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                            <Spinner size={24} />
                            <Spinner intent={Intent.PRIMARY} size={24} />
                            <Spinner intent={Intent.SUCCESS} size={24} />
                        </div>
                    </Card>
                    <Tabs id="playground-tabs" defaultSelectedTabId="overview">
                        <Tab id="overview" title="Overview" />
                        <Tab id="activity" title="Activity" />
                        <Tab id="settings" title="Settings" />
                        <Tab disabled={true} id="disabled" title="Disabled" />
                    </Tabs>
                    <SegmentedControl
                        onValueChange={setSegment}
                        options={[
                            { label: "List", value: "list" },
                            { label: "Grid", value: "grid" },
                            { label: "Gallery", value: "gallery" },
                        ]}
                        value={segment}
                    />
                    <ButtonGroup>
                        <Button icon="align-left" />
                        <Button active={true} icon="align-center" />
                        <Button icon="align-right" />
                    </ButtonGroup>
                    <Toast intent={Intent.SUCCESS} message="Saved successfully." onDismiss={noop} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <Menu style={{ boxShadow: "var(--bp-shadow-sm)" }}>
                        <MenuItem icon="new-text-box" text="New text box" />
                        <MenuItem active={true} icon="new-object" text="New object (active)" />
                        <MenuItem icon="new-link" label="⌘L" text="New link" />
                        <MenuDivider title="Danger zone" />
                        <MenuItem icon="trash" intent={Intent.DANGER} text="Delete" />
                        <MenuItem disabled={true} icon="lock" text="Disabled item" />
                    </Menu>
                    <Section collapsible={true} title="Section" subtitle="With cards">
                        <SectionCard>Section card content.</SectionCard>
                    </Section>
                    <CardList>
                        <Card interactive={true}>Interactive card in a list</Card>
                        <Card interactive={true} selected={true}>
                            Selected card
                        </Card>
                    </CardList>
                    <HTMLTable compact={true} interactive={true} striped={true}>
                        <thead>
                            <tr>
                                <th>Token</th>
                                <th>Step</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Soft</td>
                                <td>3 / 4 / 5</td>
                            </tr>
                            <tr>
                                <td>Solid</td>
                                <td>9 / 10 / 11</td>
                            </tr>
                            <tr>
                                <td>Text</td>
                                <td>12 / 13</td>
                            </tr>
                        </tbody>
                    </HTMLTable>
                    <div style={{ display: "flex", gap: 8 }}>
                        <PopoverNext
                            content={
                                <Menu>
                                    <MenuItem text="Popover item" />
                                    <MenuItem text="Another item" />
                                </Menu>
                            }
                            placement="bottom-start"
                        >
                            <Button endIcon="caret-down" text="Popover" />
                        </PopoverNext>
                        <Tooltip content="Tooltip on the inverse surface">
                            <Button text="Tooltip" />
                        </Tooltip>
                        <Button intent={Intent.PRIMARY} onClick={openDialog} text="Dialog" />
                    </div>
                    <Card>
                        <NonIdealState description="Nothing matches your filters." icon="search" title="No results" />
                    </Card>
                </div>
            </div>

            <Dialog isOpen={isDialogOpen} onClose={closeDialog} title="Dialog">
                <DialogBody>The body uses the Base layer; the header and footer use the Overlay layer.</DialogBody>
                <DialogFooter
                    actions={
                        <>
                            <Button onClick={closeDialog} text="Cancel" />
                            <Button intent={Intent.PRIMARY} onClick={closeDialog} text="Confirm" />
                        </>
                    }
                />
            </Dialog>
        </div>
    );
}

const meta: Meta<typeof ThemePlayground> = {
    title: "Core/Theme Playground",
    component: ThemePlayground,
    parameters: {
        layout: "fullscreen",
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
