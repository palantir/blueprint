/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
// eslint-disable-next-line import/no-extraneous-dependencies
import { type CSSProperties, useState } from "react";
import { expect, screen, userEvent, waitFor } from "storybook/test";

import {
    Breadcrumbs,
    Button,
    Card,
    Classes,
    CompoundTag,
    Divider,
    FileInput,
    H4,
    Icon,
    InputGroup,
    PopoverNext,
    Tag,
} from "@blueprintjs/core";
import { DatePicker } from "@blueprintjs/datetime";
import { DatePicker3 } from "@blueprintjs/datetime2";
import { Classes as SelectClasses } from "@blueprintjs/select";
import { FilmSelect } from "@blueprintjs/select/examples";
import { Cell, Column, Table } from "@blueprintjs/table";

import { modes } from "./modes";

type TokenStyle = CSSProperties & Record<`--bp-${string}`, string>;

const GLOBAL_SPACING = "5px";
const LIGHT_BUTTON_BACKGROUND = "rgb(246, 247, 249)";
const SCOPED_BUTTON_BACKGROUND = "rgb(231, 240, 255)";
const SCOPED_BUTTON_ACTIVE_BACKGROUND = "rgb(184, 210, 249)";
const SCOPED_BUTTON_HOVER_BACKGROUND = "rgb(213, 229, 255)";
const SCOPED_DATETIME_BACKGROUND = "rgb(124, 58, 237)";
const SCOPED_ICON_COLOR = "rgb(190, 24, 93)";
const SCOPED_SELECT_MAX_HEIGHT = "180px";
const SCOPED_TABLE_HEADER_BACKGROUND = "rgb(231, 240, 255)";
const globalTokenOverrides = `
:root,
.${Classes.DARK},
[data-bp-color-scheme="light"],
[data-bp-color-scheme="dark"] {
    --bp-spacing: ${GLOBAL_SPACING};
}`;

const sectionStyle: CSSProperties = {
    alignItems: "flex-start",
    border: "1px solid rgba(95, 107, 124, 0.3)",
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: 16,
};

const rowStyle: CSSProperties = {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
};

const scopedTokens: TokenStyle = {
    "--bp-border-radius": "10px",
    "--bp-button-background-color": SCOPED_BUTTON_BACKGROUND,
    "--bp-button-background-color-active": SCOPED_BUTTON_ACTIVE_BACKGROUND,
    "--bp-button-background-color-hover": SCOPED_BUTTON_HOVER_BACKGROUND,
    "--bp-datetime-datepicker-selected-day-background-color": SCOPED_DATETIME_BACKGROUND,
    "--bp-icon-color": SCOPED_ICON_COLOR,
    "--bp-select-popover-max-height": SCOPED_SELECT_MAX_HEIGHT,
    "--bp-table-header-background-color": SCOPED_TABLE_HEADER_BACKGROUND,
};

const fixedDate = new Date(2026, 8, 28);
const breadcrumbItems = [{ text: "Library" }, { text: "Components" }, { text: "Breadcrumbs" }];
const renderTableCell = (rowIndex: number) => <Cell>{`Row ${rowIndex + 1}`}</Cell>;

function CoreSamples({ prefix }: { prefix: string }) {
    return (
        <div style={rowStyle}>
            <Button data-testid={`${prefix}-button`} icon="style" text="Button" />
            <Button data-testid={`${prefix}-disabled-button`} disabled={true} text="Disabled" />
            <InputGroup data-testid={`${prefix}-input`} aria-label="Example input" defaultValue="Input" />
            <FileInput data-testid={`${prefix}-file-input`} buttonText="Browse" text="Choose file" />
            <Tag icon="tag">Tag</Tag>
            <CompoundTag leftContent="Key">Value</CompoundTag>
            <Icon aria-label="Clean" data-testid={`${prefix}-icon`} icon="clean" size={20} />
            <Card compact={true}>Card</Card>
            <Divider data-testid={`${prefix}-divider`} />
            <div data-testid={`${prefix}-breadcrumbs`}>
                <Breadcrumbs items={breadcrumbItems} minVisibleItems={breadcrumbItems.length} />
            </div>
        </div>
    );
}

function PackageSamples() {
    return (
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(2, minmax(300px, 1fr))" }}>
            <div data-testid="datetime-sample">
                <H4>DateTime</H4>
                <DatePicker defaultValue={fixedDate} />
            </div>
            <div data-testid="datetime2-sample">
                <H4>DateTime2 (shared token-only source)</H4>
                {/* eslint-disable-next-line @blueprintjs/no-deprecated-components */}
                <DatePicker3 defaultValue={fixedDate} />
            </div>
            <div data-testid="select-sample">
                <H4>Select</H4>
                <FilmSelect popoverProps={{ isOpen: true, usePortal: false }} />
            </div>
            <div data-testid="table-sample">
                <H4>Table</H4>
                <div style={{ height: 150, width: 320 }}>
                    <Table numRows={3}>
                        <Column name="Value" cellRenderer={renderTableCell} />
                    </Table>
                </div>
            </div>
        </div>
    );
}

function ScopedPortalSample() {
    const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);

    return (
        <div data-testid="portal-scope" style={{ ...sectionStyle, ...scopedTokens }}>
            <strong>Scoped portal container</strong>
            <div ref={setPortalContainer} data-testid="portal-container" />
            {portalContainer === null ? null : (
                <PopoverNext
                    content={<Button data-testid="portal-button" text="Themed portal content" />}
                    isOpen={true}
                    placement="right"
                    portalContainer={portalContainer}
                >
                    <Button text="Portal target" />
                </PopoverNext>
            )}
        </div>
    );
}

function ThemingKitchenSink() {
    return (
        <>
            <style>{globalTokenOverrides}</style>
            <main
                data-bp-color-scheme="light"
                data-testid="story-root"
                style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 900, padding: 20 }}
            >
                <section data-testid="global-scope" style={sectionStyle}>
                    <strong>Global theme-boundary override (5px spacing)</strong>
                    <CoreSamples prefix="global" />
                </section>

                <section data-testid="scoped-scope" style={{ ...sectionStyle, ...scopedTokens }}>
                    <strong>Canonical scoped overrides</strong>
                    <CoreSamples prefix="scoped" />
                    <PackageSamples />
                </section>

                <section data-bp-color-scheme="light" data-testid="light-to-dark-light" style={sectionStyle}>
                    <strong>Explicit light with nested dark</strong>
                    <CoreSamples prefix="light-to-dark-light" />
                    <div data-bp-color-scheme="dark" data-testid="light-to-dark-dark" style={sectionStyle}>
                        <CoreSamples prefix="light-to-dark-dark" />
                    </div>
                </section>

                <section data-bp-color-scheme="dark" data-testid="dark-to-light-dark" style={sectionStyle}>
                    <strong>Explicit dark with nested light</strong>
                    <CoreSamples prefix="dark-to-light-dark" />
                    <div data-bp-color-scheme="light" data-testid="dark-to-light-light" style={sectionStyle}>
                        <CoreSamples prefix="dark-to-light-light" />
                    </div>
                </section>

                <section
                    className={Classes.DARK}
                    data-bp-color-scheme="light"
                    data-testid="legacy-light-boundary"
                    style={{ ...sectionStyle, "--bp-surface-border-radius": "14px" } as TokenStyle}
                >
                    <strong>Legacy dark class overridden by an explicit light boundary</strong>
                    <CoreSamples prefix="legacy-light" />
                </section>

                <ScopedPortalSample />
            </main>
        </>
    );
}

const meta = {
    title: "Theming/CSS variable kitchen sink",
    component: ThemingKitchenSink,
    parameters: {
        chromatic: { modes: { light: modes.light } },
        layout: "fullscreen",
    },
} satisfies Meta<typeof ThemingKitchenSink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ParityAndScoping: Story = {
    play: async ({ canvas, step }) => {
        await step("global and scoped canonical values apply", async () => {
            const storyRoot = canvas.getByTestId("story-root");
            const globalButton = canvas.getByTestId("global-button");
            const globalDivider = canvas.getByTestId("global-divider");
            const scopedButton = canvas.getByTestId("scoped-button");

            expect(getComputedStyle(document.documentElement).getPropertyValue("--bp-spacing")).toBe(GLOBAL_SPACING);
            expect(getComputedStyle(storyRoot).getPropertyValue("--bp-spacing")).toBe(GLOBAL_SPACING);
            expect(getComputedStyle(globalButton).backgroundColor).toBe(LIGHT_BUTTON_BACKGROUND);
            expect(getComputedStyle(globalDivider).marginTop).toBe(GLOBAL_SPACING);
            expect(getComputedStyle(scopedButton).backgroundColor).toBe(SCOPED_BUTTON_BACKGROUND);
            expect(getComputedStyle(scopedButton).borderRadius).toBe("10px");
        });

        await step("Core, Icons, DateTime, DateTime2, Select, and Table consume scoped values", async () => {
            const scopedIcon = canvas.getByTestId("scoped-icon");
            const datetimeSample = canvas.getByTestId("datetime-sample");
            const datetime2Sample = canvas.getByTestId("datetime2-sample");
            const selectSample = canvas.getByTestId("select-sample");
            const tableSample = canvas.getByTestId("table-sample");

            expect(scopedIcon.querySelector("svg")).not.toBeNull();
            expect(getComputedStyle(scopedIcon).color).toBe(SCOPED_ICON_COLOR);

            await waitFor(() => {
                const datetimeSelectedDay = datetimeSample.querySelector<HTMLElement>(".rdp-day_selected");
                const datetime2SelectedDay = datetime2Sample.querySelector<HTMLElement>(".rdp-day_selected");
                const selectMenu = selectSample.querySelector<HTMLElement>(
                    `.${SelectClasses.SELECT_POPOVER} .${Classes.MENU}`,
                );
                const tableHeaders = tableSample.querySelector<HTMLElement>(
                    `.${Classes.getClassNamespace()}-table-column-headers`,
                );

                expect(datetimeSelectedDay).not.toBeNull();
                expect(datetime2SelectedDay).not.toBeNull();
                expect(selectMenu).not.toBeNull();
                expect(tableHeaders).not.toBeNull();
                expect(getComputedStyle(datetimeSelectedDay!).backgroundColor).toBe(SCOPED_DATETIME_BACKGROUND);
                expect(getComputedStyle(datetime2SelectedDay!).backgroundColor).toBe(SCOPED_DATETIME_BACKGROUND);
                expect(getComputedStyle(selectMenu!).maxHeight).toBe(SCOPED_SELECT_MAX_HEIGHT);
                expect(getComputedStyle(tableHeaders!).backgroundColor).toBe(SCOPED_TABLE_HEADER_BACKGROUND);
            });
        });

        await step("Breadcrumb SVG masks inherit the scoped icon color", async () => {
            const breadcrumbs = canvas.getByTestId("scoped-breadcrumbs");
            const separator = breadcrumbs.querySelector(`.${Classes.BREADCRUMBS} > li`);

            expect(separator).not.toBeNull();
            const separatorStyle = getComputedStyle(separator!, "::after");
            expect(separatorStyle.backgroundColor).toBe(SCOPED_ICON_COLOR);
            expect(separatorStyle.getPropertyValue("mask-image")).toContain("data:image/svg+xml");
            expect(separatorStyle.getPropertyValue("mask-position")).toBe("50% 50%");
            expect(separatorStyle.getPropertyValue("mask-repeat")).toBe("no-repeat");
            expect(separatorStyle.getPropertyValue("mask-size")).toBe("contain");
        });

        await step("interaction and disabled states retain distinct computed styles", async () => {
            const scopedButton = canvas.getByTestId("scoped-button");
            const disabledButton = canvas.getByTestId("scoped-disabled-button");
            const input = canvas.getByTestId("scoped-input");
            const restBackground = getComputedStyle(scopedButton).backgroundColor;
            const restInputShadow = getComputedStyle(input).boxShadow;

            await userEvent.hover(scopedButton);
            await waitFor(() =>
                expect(getComputedStyle(scopedButton).backgroundColor).toBe(SCOPED_BUTTON_HOVER_BACKGROUND),
            );
            await userEvent.unhover(scopedButton);

            scopedButton.classList.add(Classes.ACTIVE);
            expect(getComputedStyle(scopedButton).backgroundColor).toBe(SCOPED_BUTTON_ACTIVE_BACKGROUND);
            scopedButton.classList.remove(Classes.ACTIVE);

            input.focus();
            await waitFor(() => expect(getComputedStyle(input).boxShadow).not.toBe(restInputShadow));

            expect(getComputedStyle(disabledButton).backgroundColor).not.toBe(restBackground);
            expect(getComputedStyle(disabledButton).cursor).toBe("not-allowed");
        });

        await step("pseudo-element values remain available through the tokenized styles", async () => {
            const fileInput = canvas.getByTestId("scoped-file-input");
            const fileInputText = fileInput.querySelector(`.${Classes.FILE_UPLOAD_INPUT}`);

            expect(fileInputText).not.toBeNull();
            expect(getComputedStyle(fileInputText!, "::after").content).toContain("Browse");
        });

        await step("explicit nested light and dark themes work in both directions", async () => {
            const globalButton = canvas.getByTestId("global-button");
            const lightToDarkLightButton = canvas.getByTestId("light-to-dark-light-button");
            const lightToDarkDarkButton = canvas.getByTestId("light-to-dark-dark-button");
            const darkToLightDarkButton = canvas.getByTestId("dark-to-light-dark-button");
            const darkToLightLightButton = canvas.getByTestId("dark-to-light-light-button");
            const legacyLightButton = canvas.getByTestId("legacy-light-button");
            const globalScope = canvas.getByTestId("global-scope");
            const lightToDarkLight = canvas.getByTestId("light-to-dark-light");
            const lightToDarkDark = canvas.getByTestId("light-to-dark-dark");
            const darkToLightDark = canvas.getByTestId("dark-to-light-dark");
            const darkToLightLight = canvas.getByTestId("dark-to-light-light");
            const legacyLightBoundary = canvas.getByTestId("legacy-light-boundary");

            expect(getComputedStyle(lightToDarkLightButton).backgroundColor).toBe(
                getComputedStyle(globalButton).backgroundColor,
            );
            expect(getComputedStyle(lightToDarkDarkButton).backgroundColor).not.toBe(
                getComputedStyle(globalButton).backgroundColor,
            );
            expect(getComputedStyle(darkToLightDarkButton).backgroundColor).not.toBe(
                getComputedStyle(globalButton).backgroundColor,
            );
            expect(getComputedStyle(darkToLightLightButton).backgroundColor).toBe(
                getComputedStyle(globalButton).backgroundColor,
            );
            expect(getComputedStyle(legacyLightButton).backgroundColor).toBe(
                getComputedStyle(globalButton).backgroundColor,
            );
            expect(getComputedStyle(legacyLightButton).borderRadius).toBe("14px");
            expect(getComputedStyle(lightToDarkLight).color).toBe(getComputedStyle(globalScope).color);
            expect(getComputedStyle(lightToDarkDark).color).not.toBe(getComputedStyle(globalScope).color);
            expect(getComputedStyle(darkToLightDark).color).not.toBe(getComputedStyle(globalScope).color);
            expect(getComputedStyle(darkToLightLight).color).toBe(getComputedStyle(globalScope).color);
            expect(getComputedStyle(legacyLightBoundary).color).toBe(getComputedStyle(globalScope).color);
            expect(getComputedStyle(lightToDarkLight).colorScheme).toBe("light");
            expect(getComputedStyle(lightToDarkDark).colorScheme).toBe("dark");
            expect(getComputedStyle(darkToLightDark).colorScheme).toBe("dark");
            expect(getComputedStyle(darkToLightLight).colorScheme).toBe("light");
            expect(getComputedStyle(legacyLightBoundary).colorScheme).toBe("light");
            expect(getComputedStyle(lightToDarkDark).getPropertyValue("--bp-spacing")).toBe(GLOBAL_SPACING);
            expect(getComputedStyle(darkToLightLight).getPropertyValue("--bp-spacing")).toBe(GLOBAL_SPACING);
        });

        await step("a scoped portal container carries canonical values across the portal", async () => {
            const portalContainer = canvas.getByTestId("portal-container");
            const portalButton = await screen.findByTestId("portal-button");

            expect(portalContainer.contains(portalButton)).toBe(true);
            expect(getComputedStyle(portalButton).backgroundColor).toBe(SCOPED_BUTTON_BACKGROUND);
        });
    },
};
