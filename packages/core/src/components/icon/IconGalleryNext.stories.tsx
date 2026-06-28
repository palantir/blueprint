/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { type Meta, type StoryObj } from "@storybook/react-vite";
import { StoryLabel } from "@storybook-common";
// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook-only; mirrors icons package generator casing
import { pascalCase } from "change-case";
import React, { type ComponentType, type ReactElement, useCallback, useState } from "react";

import * as NextIcons from "@blueprintjs/icons/next";
import { nextIconManifest, type NextIconManifestEntry } from "@blueprintjs/icons/next";
import { Flex } from "@blueprintjs/labs";

import { Card } from "../card/card";

// -----------------------------------------------------------------------------
// Constants & data

const GALLERY_MAX_WIDTH = 1024;
const DISPLAY_ICON_SIZE = 32;

const ICON_GRID_CARD_STYLE: React.CSSProperties = {
    aspectRatio: "1 / 1",
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
        <Flex flexDirection="column" gap={4}>
            <StoryLabel title={`${icons.length} ${variant} icons`} />
            <Flex flexWrap="wrap" gap={2}>
                {icons.map(entry => (
                    <Card key={entry.name} title={entry.name} style={ICON_GRID_CARD_STYLE}>
                        <Flex alignItems="center" justifyContent="center" style={{ height: "100%" }}>
                            {renderNextIcon(entry.name, size, variant)}
                        </Flex>
                    </Card>
                ))}
            </Flex>
        </Flex>
    );
}

function CompareGallery({ icons, size }: { icons: NextIconManifestEntry[]; size: number }) {
    return (
        <Flex flexDirection="column" gap={4}>
            <StoryLabel
                title={`${icons.length} icons with both variants - click a card to swap between outlined and filled`}
            />
            <Flex flexWrap="wrap" gap={2}>
                {icons.map(entry => (
                    <CompareCard key={entry.name} iconName={entry.name} size={size} />
                ))}
            </Flex>
        </Flex>
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
            <Flex alignItems="center" justifyContent="center" style={{ height: "100%" }}>
                {renderNextIcon(iconName, size, showFilled ? "filled" : "outlined")}
            </Flex>
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
