/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook is configured from the workspace root.
import { type CSSProperties, type PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";

import {
    Breadcrumbs,
    Button,
    ButtonGroup,
    Callout,
    Card,
    CardList,
    Checkbox,
    Classes,
    Code,
    CompoundTag,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogStep,
    EditableText,
    FileInput,
    H2,
    H3,
    HTMLSelect,
    InputGroup,
    Menu,
    MenuItem,
    MultistepDialog,
    OverlayToaster,
    Popover,
    Pre,
    SegmentedControl,
    Slider,
    Tab,
    Tabs,
    Tag,
} from "@blueprintjs/core";
import { DatePicker, TimePicker } from "@blueprintjs/datetime";
import { type ItemRenderer, Omnibar } from "@blueprintjs/select";
import { Cell, Column, Table, TruncatedFormat, TruncatedPopoverMode } from "@blueprintjs/table";

const BORDER_RADIUS_PROPERTY = "--bp-surface-border-radius";
const FIXED_DATE = new Date(2026, 8, 22);
const OMNIBAR_ITEMS = ["Border radius", "Color", "Spacing", "Typography"];

const renderOmnibarItem: ItemRenderer<string> = (item, { handleClick, modifiers, ref }) => (
    <MenuItem active={modifiers.active} key={item} onClick={handleClick} ref={ref} text={item} />
);

function filterOmnibarItem(query: string, item: string) {
    return item.toLowerCase().includes(query.toLowerCase());
}

function renderTableCell(rowIndex: number) {
    return (
        <Cell>
            <TruncatedFormat showPopover={TruncatedPopoverMode.ALWAYS}>
                {"Row " + (rowIndex + 1) + ": a long value with a rounded popover target"}
            </TruncatedFormat>
        </Cell>
    );
}

interface ThemingStoryArgs {
    borderRadius: number;
}

const meta: Meta<ThemingStoryArgs> = {
    title: "Theming/Border Radius",
    parameters: {
        layout: "fullscreen",
    },
    args: {
        borderRadius: 4,
    },
    argTypes: {
        borderRadius: {
            control: { type: "range", min: 0, max: 24, step: 1 },
            description: "Pixel value injected into " + BORDER_RADIUS_PROPERTY,
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const KitchenSink: Story = {
    render: args => <BorderRadiusKitchenSink {...args} />,
};

export const ButtonOverride: Story = {
    name: "Button",
    argTypes: {
        borderRadius: {
            control: {
                labels: {
                    0: "Square (0px)",
                    2: "2px",
                    4: "4px (current)",
                    8: "8px",
                    16: "16px",
                },
                type: "select",
            },
            description: "Pixel value applied only to the Button",
            options: [0, 2, 4, 8, 16],
        },
    },
    render: args => <BorderRadiusButtonOverride {...args} />,
};

function BorderRadiusButtonOverride({ borderRadius }: ThemingStoryArgs) {
    const borderRadiusCssValue = `${borderRadius}px`;
    const buttonStyle = {
        [BORDER_RADIUS_PROPERTY]: borderRadiusCssValue,
    } as CSSProperties;

    return (
        <main style={PAGE_STYLE}>
            <header style={HEADER_STYLE}>
                <div>
                    <H2 style={{ margin: 0 }}>Button border radius override</H2>
                    <p style={{ marginBottom: 0 }}>
                        The custom property is set on the button, so the surrounding card keeps the shared 4px radius.
                    </p>
                </div>
                <Code>{BORDER_RADIUS_PROPERTY + ": " + borderRadiusCssValue}</Code>
            </header>

            <Card style={BUTTON_EXAMPLE_CARD_STYLE}>
                <H3 style={{ marginTop: 0 }}>Card with a component-level override</H3>
                <p>The card continues to use the default surface radius while only the button changes.</p>
                <Button intent="primary" style={buttonStyle} text={`${borderRadiusCssValue} button`} />
                <Pre style={{ marginBottom: 0 }}>
                    {`.custom-button {\n  ${BORDER_RADIUS_PROPERTY}: ${borderRadiusCssValue};\n}`}
                </Pre>
            </Card>
        </main>
    );
}

function BorderRadiusKitchenSink({ borderRadius }: ThemingStoryArgs) {
    const borderRadiusCssValue = `${borderRadius}px`;
    const [date, setDate] = useState(FIXED_DATE);
    const [openOverlay, setOpenOverlay] = useState<"dialog" | "multistep" | "omnibar">();
    const [sliderValue, setSliderValue] = useState(5);
    const toasterRef = useRef<OverlayToaster>(null);

    useEffect(() => {
        const rootStyle = document.documentElement.style;
        const previousValue = rootStyle.getPropertyValue(BORDER_RADIUS_PROPERTY);
        const previousPriority = rootStyle.getPropertyPriority(BORDER_RADIUS_PROPERTY);

        rootStyle.setProperty(BORDER_RADIUS_PROPERTY, borderRadiusCssValue);

        return () => {
            if (previousValue === "") {
                rootStyle.removeProperty(BORDER_RADIUS_PROPERTY);
            } else {
                rootStyle.setProperty(BORDER_RADIUS_PROPERTY, previousValue, previousPriority);
            }
        };
    }, [borderRadiusCssValue]);

    const handleCloseOverlay = useCallback(() => setOpenOverlay(undefined), []);
    const handleOpenDialog = useCallback(() => setOpenOverlay("dialog"), []);
    const handleOpenMultistepDialog = useCallback(() => setOpenOverlay("multistep"), []);
    const handleOpenOmnibar = useCallback(() => setOpenOverlay("omnibar"), []);
    const handleDateChange = useCallback((selectedDate: Date | null) => {
        if (selectedDate != null) {
            setDate(selectedDate);
        }
    }, []);
    const handleShowToast = useCallback(
        () => toasterRef.current?.show({ message: "Runtime border-radius override" }),
        [],
    );

    return (
        <main style={PAGE_STYLE}>
            <header style={HEADER_STYLE}>
                <div>
                    <H2 style={{ margin: 0 }}>Border radius kitchen sink</H2>
                    <p style={{ marginBottom: 0 }}>Shared surfaces from Core, DateTime, Select, and Table.</p>
                </div>
                <Code>{":root { " + BORDER_RADIUS_PROPERTY + ": " + borderRadiusCssValue + "; }"}</Code>
            </header>

            <div style={SECTION_GRID_STYLE}>
                <KitchenSinkSection title="Core surfaces and typography">
                    <div style={ROW_STYLE}>
                        <Button text="Button" intent="primary" />
                        <ButtonGroup>
                            <Button icon="align-left" aria-label="Align left" />
                            <Button icon="align-center" aria-label="Align center" />
                            <Button icon="align-right" aria-label="Align right" />
                        </ButtonGroup>
                        <Tag>Tag</Tag>
                        <CompoundTag leftContent="Theme">Radius</CompoundTag>
                    </div>
                    <Callout title="Callout">The common radius should follow the live value.</Callout>
                    <CardList bordered={true} style={{ maxWidth: 360 }}>
                        <Card>Card list item</Card>
                        <Card interactive={true}>Interactive item</Card>
                    </CardList>
                    <div style={{ maxWidth: 220 }}>
                        <Breadcrumbs
                            items={[
                                { text: "Home" },
                                { text: "Design system" },
                                { text: "Themes" },
                                { text: "Border radius" },
                            ]}
                            minVisibleItems={1}
                        />
                    </div>
                    <Menu style={{ maxWidth: 260 }}>
                        <MenuItem icon="style" text="Default menu item" />
                        <MenuItem active={true} icon="tick" text="Active menu item" />
                    </Menu>
                    <div style={ROW_STYLE}>
                        <Code>inline code</Code>
                        <span className={Classes.KEY}>⌘ K</span>
                    </div>
                    <Pre style={{ margin: 0 }}>--bp-surface-border-radius: {borderRadiusCssValue};</Pre>
                </KitchenSinkSection>

                <KitchenSinkSection title="Forms and controls">
                    <InputGroup leftIcon="search" placeholder="Input group" />
                    <FileInput buttonText="Browse" fill={true} text="Choose a file…" />
                    <HTMLSelect fill={true} options={["HTML select", "Second option"]} />
                    <div style={ROW_STYLE}>
                        <Checkbox defaultChecked={true} label="Checkbox" />
                        <SegmentedControl
                            defaultValue="list"
                            options={[
                                { label: "List", value: "list" },
                                { label: "Grid", value: "grid" },
                            ]}
                        />
                    </div>
                    <Slider value={sliderValue} max={10} labelStepSize={5} onChange={setSliderValue} />
                    <EditableText defaultValue="Editable text" />
                    <Tabs id="theming-kitchen-sink-tabs" vertical={true}>
                        <Tab id="surface" title="Surface" panel={<p>Surface tokens</p>} />
                        <Tab id="type" title="Typography" panel={<p>Typography tokens</p>} />
                    </Tabs>
                </KitchenSinkSection>

                <KitchenSinkSection title="Date and data">
                    <div style={DATE_GRID_STYLE}>
                        <div>
                            <H3>DatePicker</H3>
                            <DatePicker onChange={handleDateChange} value={date} />
                        </div>
                    </div>
                    <TimePicker value={date} onChange={setDate} />
                    <div style={{ height: 160 }}>
                        <Table numRows={2} columnWidths={[320]}>
                            <Column name="Theming surface" cellRenderer={renderTableCell} />
                        </Table>
                    </div>
                </KitchenSinkSection>

                <KitchenSinkSection title="Portal-based overlays">
                    <p style={{ marginTop: 0 }}>
                        These launchers verify that the root-level override reaches content rendered outside this page.
                    </p>
                    <div style={ROW_STYLE}>
                        {/* eslint-disable-next-line @blueprintjs/no-deprecated-components, @typescript-eslint/no-deprecated -- the legacy Popover surface remains in the migration scope */}
                        <Popover
                            content={
                                <Menu>
                                    <MenuItem icon="edit" text="Edit theme" />
                                    <MenuItem icon="trash" intent="danger" text="Delete theme" />
                                </Menu>
                            }
                        >
                            <Button endIcon="caret-down" text="Popover" />
                        </Popover>
                        <Button text="Dialog" onClick={handleOpenDialog} />
                        <Button text="Multistep dialog" onClick={handleOpenMultistepDialog} />
                        <Button text="Omnibar" onClick={handleOpenOmnibar} />
                        <Button text="Toast" onClick={handleShowToast} />
                    </div>
                </KitchenSinkSection>
            </div>

            <Dialog isOpen={openOverlay === "dialog"} onClose={handleCloseOverlay} title="Theme preview">
                <DialogBody>The dialog inherits the root custom property.</DialogBody>
                <DialogFooter actions={<Button text="Close" onClick={handleCloseOverlay} />} />
            </Dialog>

            <MultistepDialog
                finalButtonProps={{ text: "Done", onClick: handleCloseOverlay }}
                isOpen={openOverlay === "multistep"}
                onClose={handleCloseOverlay}
                title="Theme setup"
            >
                <DialogStep id="radius" panel={<DialogBody>Choose a surface radius.</DialogBody>} title="Radius" />
                <DialogStep id="review" panel={<DialogBody>Review the theme.</DialogBody>} title="Review" />
            </MultistepDialog>

            <Omnibar
                isOpen={openOverlay === "omnibar"}
                itemPredicate={filterOmnibarItem}
                itemRenderer={renderOmnibarItem}
                items={OMNIBAR_ITEMS}
                noResults={<MenuItem disabled={true} text="No results" />}
                onClose={handleCloseOverlay}
                onItemSelect={handleCloseOverlay}
            />

            <OverlayToaster ref={toasterRef} />
        </main>
    );
}

function KitchenSinkSection({ children, title }: PropsWithChildren<{ title: string }>) {
    return (
        <Card style={SECTION_STYLE}>
            <H3 style={{ marginTop: 0 }}>{title}</H3>
            <div style={SECTION_CONTENT_STYLE}>{children}</div>
        </Card>
    );
}

const PAGE_STYLE: CSSProperties = {
    background: "var(--bp-surface-background-color-default-rest)",
    color: "var(--bp-typography-color-default-rest)",
    minHeight: "100vh",
    padding: 32,
};

const HEADER_STYLE: CSSProperties = {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
    marginBottom: 24,
};

const SECTION_GRID_STYLE: CSSProperties = {
    display: "grid",
    gap: 20,
    gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
};

const SECTION_STYLE: CSSProperties = {
    minWidth: 0,
};

const BUTTON_EXAMPLE_CARD_STYLE: CSSProperties = {
    maxWidth: 520,
};

const SECTION_CONTENT_STYLE: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 16,
};

const ROW_STYLE: CSSProperties = {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
};

const DATE_GRID_STYLE: CSSProperties = {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
};
