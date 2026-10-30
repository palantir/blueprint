/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";

import {
    CircleArrowDownIcon,
    getLegacyIconVariant,
    HouseIcon,
    type IconName,
    legacyIconNameToIconNextName,
    LegacyToIconNextNameMap,
    PlayFilledIcon,
    PlayIcon,
} from "@blueprintjs/icons/next";

import { Classes, Intent } from "../../common";
import { Button } from "../button/buttons";
import { Code, H2 } from "../html/html";
import { HTMLTable } from "../html-table/htmlTable";
import { Icon } from "../icon/icon";

import { IconNext } from "./iconNext";

const meta: Meta<typeof IconNext> = {
    title: "Next Icons/IconNext",
    component: IconNext,
    decorators: [storybookLayoutDecorator],
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof IconNext>;

export default meta;
type Story = StoryObj<typeof meta>;

const LEGACY_ICON_NAMES = Object.keys(LegacyToIconNextNameMap) as IconName[];

/**
 * Dynamic string usage — the icon is loaded asynchronously by name.
 */
export const DynamicString: Story = {
    name: "Dynamic String",
    render: () => (
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <IconNext icon="house" size={32} />
            <IconNext icon="circle-arrow-down" size={32} />
            <IconNext icon="star" size={32} />
            <IconNext icon="gear" size={32} />
            <IconNext icon="magnifying-glass" size={32} />
        </div>
    ),
};

/**
 * Preserve the visual appearance of stored legacy icon-name strings while migrating to IconNext.
 */
export const LegacyStringCompatibility: Story = {
    name: "Legacy String Compatibility",
    parameters: {
        layout: "fullscreen",
    },
    render: () => (
        <div style={{ margin: "0 auto", maxWidth: 1280, padding: 24 }}>
            <H2 style={{ marginBottom: 8 }}>Legacy icon string compatibility</H2>
            <p className={Classes.TEXT_MUTED} style={{ marginBottom: 24, marginTop: 0 }}>
                Compare all {LEGACY_ICON_NAMES.length} legacy icon names with their default and appearance-preserving
                IconNext renderings.
            </p>
            <HTMLTable bordered={true} compact={true} striped={true} style={{ tableLayout: "fixed", width: "100%" }}>
                <colgroup>
                    <col style={{ width: "28%" }} />
                    <col style={{ width: "24%" }} />
                    <col style={{ width: "24%" }} />
                    <col style={{ width: "24%" }} />
                </colgroup>
                <thead>
                    <tr>
                        <th
                            style={{
                                backgroundColor: "var(--bp-surface-background-color-default-rest)",
                                position: "sticky",
                                top: 0,
                                zIndex: 1,
                            }}
                        >
                            Legacy name
                        </th>
                        {["Legacy rendering", "Default next rendering", "Appearance-preserving next rendering"].map(
                            columnName => (
                                <th
                                    key={columnName}
                                    style={{
                                        backgroundColor: "var(--bp-surface-background-color-default-rest)",
                                        position: "sticky",
                                        textAlign: "center",
                                        top: 0,
                                        zIndex: 1,
                                    }}
                                >
                                    {columnName}
                                </th>
                            ),
                        )}
                    </tr>
                </thead>
                <tbody>
                    {LEGACY_ICON_NAMES.map(legacyIconName => {
                        const nextIconName = legacyIconNameToIconNextName(legacyIconName);
                        const variant = getLegacyIconVariant(legacyIconName);

                        return (
                            <tr key={legacyIconName}>
                                <td style={{ verticalAlign: "middle" }}>
                                    <Code>{legacyIconName}</Code>
                                </td>
                                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                    <Icon icon={legacyIconName} size={32} />
                                </td>
                                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                    <IconNext icon={nextIconName} size={32} />
                                </td>
                                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                    <IconNext icon={nextIconName} size={32} variant={variant} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </HTMLTable>
        </div>
    ),
};

/**
 * Element passthrough — works the same as current Icon.
 */
export const ElementPassthrough: Story = {
    name: "Element Passthrough",
    render: () => (
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <IconNext icon={<HouseIcon size={32} />} />
            <IconNext icon={<CircleArrowDownIcon size={32} />} />
            <IconNext icon={<PlayIcon size={32} />} />
        </div>
    ),
};

/**
 * Outlined vs filled variant switching.
 */
export const VariantComparison: Story = {
    name: "Variants",
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
                <StoryLabel title="Outlined (default)" />
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <IconNext icon="play" size={32} />
                    <IconNext icon="pause" size={32} />
                    <IconNext icon="speaker-high" size={32} />
                    <IconNext icon="fast-forward" size={32} />
                    <IconNext icon="skip-backward" size={32} />
                </div>
            </div>
            <div>
                <StoryLabel title="Filled" />
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <IconNext icon="play" variant="filled" size={32} />
                    <IconNext icon="pause" variant="filled" size={32} />
                    <IconNext icon="speaker-high" variant="filled" size={32} />
                    <IconNext icon="fast-forward" variant="filled" size={32} />
                    <IconNext icon="skip-backward" variant="filled" size={32} />
                </div>
            </div>
        </div>
    ),
};

/**
 * Filled fallback — requesting "filled" on an icon without a filled variant
 * silently falls back to outlined. A dev-mode console warning is emitted.
 */
export const FilledFallback: Story = {
    name: "Filled Fallback",
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
                <StoryLabel title="Has filled variant (play)" />
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <IconNext icon="play" size={32} />
                    <IconNext icon="play" variant="filled" size={32} />
                </div>
            </div>
            <div>
                <StoryLabel title="No filled variant (anchor) — falls back to outlined" />
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <IconNext icon="anchor" size={32} />
                    <IconNext icon="anchor" variant="filled" size={32} />
                </div>
            </div>
        </div>
    ),
};

/**
 * Side-by-side: dynamic IconNext vs static component.
 */
export const DynamicVsStatic: Story = {
    name: "Dynamic vs Static",
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
                <StoryLabel title="IconNext (dynamic)" />
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <IconNext icon="play" size={32} />
                    <IconNext icon="play" variant="filled" size={32} />
                </div>
            </div>
            <div>
                <StoryLabel title="Static import (same icon)" />
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <PlayIcon size={32} />
                    <PlayFilledIcon size={32} />
                </div>
            </div>
        </div>
    ),
};

/**
 * IconNext used inside Blueprint components via icon prop.
 */
export const InComponents: Story = {
    name: "In Components",
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 8 }}>
                {Object.values(Intent).map(intent => (
                    <Button
                        key={intent}
                        icon={<IconNext icon="bell" />}
                        endIcon={<IconNext icon="play" variant="filled" />}
                        intent={intent}
                        text={intent || "none"}
                    />
                ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
                {Object.values(Intent).map(intent => (
                    <Button
                        key={intent}
                        icon={<IconNext icon="pause" variant="filled" />}
                        intent={intent}
                        text={undefined}
                        aria-label="pause"
                    />
                ))}
            </div>
        </div>
    ),
};
