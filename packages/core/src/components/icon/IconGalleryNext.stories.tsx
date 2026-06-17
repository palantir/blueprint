/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { type Meta, type StoryObj } from "@storybook/react-vite";
// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook-only; mirrors icons package generator casing
import { pascalCase } from "change-case";
import React, { type ComponentType, type ReactElement, useCallback, useState } from "react";

import * as NextIcons from "@blueprintjs/icons/next";
import { nextIconManifest, type NextIconManifestEntry } from "@blueprintjs/icons/next";

import { Card } from "../card/card";
import { H6 } from "../html/html";

// -----------------------------------------------------------------------------
// Constants & data

const GALLERY_MAX_WIDTH = 1024;
const DISPLAY_ICON_SIZE = 32;

const ICON_GRID_CARD_STYLE: React.CSSProperties = {
    alignItems: "center",
    aspectRatio: "1 / 1",
    display: "flex",
    justifyContent: "center",
    minWidth: 72,
};

const OUTLINED_ICONS = [...nextIconManifest].sort((a, b) => a.name.localeCompare(b.name));
const FILLED_ICONS = nextIconManifest.filter(e => e.hasFilled).sort((a, b) => a.name.localeCompare(b.name));

// -----------------------------------------------------------------------------
// Storybook meta & stories

const meta = {
    title: "Icons/Next Icon Gallery",
    decorators: [galleryLayoutDecorator],
    argTypes: {
        size: { control: { type: "range", min: 12, max: 64, step: 4 } },
    },
    args: {
        size: DISPLAY_ICON_SIZE,
    },
    parameters: {
        actions: { disable: true },
        controls: { disableSaveFromUI: true },
        interactions: { disable: true },
        layout: "centered",
    },
} satisfies Meta<{ size: number }>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Outlined: Story = {
    render: ({ size }) => <NextIconGallery icons={OUTLINED_ICONS} variant="outlined" size={size} />,
};

export const Filled: Story = {
    render: ({ size }) => <NextIconGallery icons={FILLED_ICONS} variant="filled" size={size} />,
};

export const Compare: Story = {
    render: ({ size }) => <CompareGallery icons={FILLED_ICONS} size={size} />,
};

// -----------------------------------------------------------------------------
// Layout

function galleryLayoutDecorator(Story: ComponentType) {
    return (
        <div style={{ maxWidth: GALLERY_MAX_WIDTH }}>
            <Story />
        </div>
    );
}

function NextIconGallery({
    icons,
    size,
    variant,
}: {
    icons: NextIconManifestEntry[];
    size: number;
    variant: "outlined" | "filled";
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <H6 style={{ opacity: 0.6 }}>
                {icons.length} {variant} icons
            </H6>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {icons.map(entry => (
                    <Card key={entry.name} title={entry.name} style={ICON_GRID_CARD_STYLE}>
                        {renderNextIcon(entry.name, size, variant)}
                    </Card>
                ))}
            </div>
        </div>
    );
}

function CompareGallery({ icons, size }: { icons: NextIconManifestEntry[]; size: number }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <H6 style={{ opacity: 0.6, userSelect: "none" }}>
                {icons.length} icons with both variants - click a card to swap between outlined and filled
            </H6>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {icons.map(entry => (
                    <CompareCard key={entry.name} iconName={entry.name} size={size} />
                ))}
            </div>
        </div>
    );
}

function CompareCard({ iconName, size }: { iconName: string; size: number }) {
    const [showFilled, setShowFilled] = useState(false);
    const handleClick = useCallback(() => setShowFilled(prev => !prev), []);

    return (
        <Card
            title={`${iconName} (${showFilled ? "filled" : "outlined"})`}
            style={ICON_GRID_CARD_STYLE}
            interactive={true}
            onClick={handleClick}
        >
            {renderNextIcon(iconName, size, showFilled ? "filled" : "outlined")}
        </Card>
    );
}

// -----------------------------------------------------------------------------
// Icon rendering

function renderNextIcon(iconName: string, pixelSize: number, variant: "outlined" | "filled"): ReactElement {
    const exportName = variant === "outlined" ? `${pascalCase(iconName)}Icon` : `${pascalCase(iconName)}FilledIcon`;
    const IconComponent = (NextIcons as unknown as Record<string, ComponentType<{ size?: number }>>)[exportName];
    if (IconComponent == null) {
        return <span title={`${exportName} not found`} />;
    }
    return <IconComponent size={pixelSize} />;
}
