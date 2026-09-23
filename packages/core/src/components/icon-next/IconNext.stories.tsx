/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";

import { CircleArrowDownIcon, HouseIcon, PlayFilledIcon, PlayIcon } from "@blueprintjs/icons/next";

import { Intent } from "../../common";
import { Button } from "../button/buttons";

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
