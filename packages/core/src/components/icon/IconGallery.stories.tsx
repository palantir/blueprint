/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { type Meta, type StoryObj } from "@storybook/react-vite";
// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook-only; mirrors icons package generator casing
import { pascalCase } from "change-case";
import classNames from "classnames";
import React, { type ComponentType, type ReactElement } from "react";

import type { IconName } from "@blueprintjs/icons";
import * as BlueprintIcons from "@blueprintjs/icons";
import { Flex } from "@blueprintjs/labs";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import { Classes } from "../../common";
import { Card } from "../card/card";
import { H4 } from "../html/html";

import { Icon } from "./icon";

// -----------------------------------------------------------------------------
// Constants & data

const GALLERY_MAX_WIDTH = 1024;

const DISPLAY_ICON_SIZE_SMALL = 16;
const DISPLAY_ICON_SIZE_LARGE = 20;

const ICON_FONT_FAMILY_STANDARD = '"blueprint-icons-16", sans-serif';
const ICON_FONT_FAMILY_LARGE = '"blueprint-icons-20", sans-serif';

const ICON_GRID_CARD_STYLE: React.CSSProperties = {
    alignItems: "center",
    aspectRatio: "1 / 1",
    display: "flex",
    justifyContent: "center",
    minWidth: 72,
};

const ICON_NAMES = sortedUniqueIconNames();

// -----------------------------------------------------------------------------
// Storybook meta & stories

const meta = {
    title: "Icons/Icon Gallery",
    decorators: [galleryLayoutDecorator],
    parameters: {
        layout: "centered",
        actions: { disable: true },
        controls: { disable: true },
        interactions: { disable: true },
    },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Static: Story = {
    render: () => <IconGallery renderIcon={renderStaticGalleryIcon} />,
};

export const Dynamic: Story = {
    render: () => <IconGallery renderIcon={renderDynamicGalleryIcon} />,
};

export const CSSIconFont: Story = {
    parameters: {
        chromatic: {
            delay: 250,
        },
    },
    play: async () => {
        if (document.fonts != null) {
            await document.fonts.ready;
        }
    },
    render: () => <IconGallery renderIcon={renderCssFontGalleryIcon} />,
};

// -----------------------------------------------------------------------------
// Layout (Storybook decorator + gallery shell)

function galleryLayoutDecorator(Story: ComponentType) {
    return (
        <div style={{ maxWidth: GALLERY_MAX_WIDTH }}>
            <Story />
        </div>
    );
}

type GalleryRenderIcon = (iconName: IconName, pixelSize: number) => ReactElement;

function IconGallery({ renderIcon }: { renderIcon: GalleryRenderIcon }) {
    return (
        <Flex flexDirection="column" gap={8}>
            <section>
                <H4>Small (16px)</H4>
                <IconGrid pixelSize={DISPLAY_ICON_SIZE_SMALL} renderIcon={renderIcon} />
            </section>
            <section>
                <H4>Large (20px)</H4>
                <IconGrid pixelSize={DISPLAY_ICON_SIZE_LARGE} renderIcon={renderIcon} />
            </section>
        </Flex>
    );
}

function IconGrid({ pixelSize, renderIcon }: { pixelSize: number; renderIcon: GalleryRenderIcon }) {
    return (
        <Flex flexWrap="wrap" gap={2}>
            {ICON_NAMES.map(iconName => (
                <Card key={iconName} title={`${iconName} (${pixelSize}px)`} style={ICON_GRID_CARD_STYLE}>
                    {renderIcon(iconName, pixelSize)}
                </Card>
            ))}
        </Flex>
    );
}

// -----------------------------------------------------------------------------
// Per-mode icon cells

function renderStaticGalleryIcon(iconName: IconName, pixelSize: number) {
    return <StaticIcon iconName={iconName} size={pixelSize} />;
}

function renderDynamicGalleryIcon(iconName: IconName, pixelSize: number) {
    return <Icon icon={iconName} size={pixelSize} />;
}

function renderCssFontGalleryIcon(iconName: IconName, pixelSize: number) {
    return <FontIcon iconName={iconName} size={pixelSize} />;
}

function StaticIcon({ iconName, size }: { iconName: IconName; size: number }) {
    const name = pascalCase(iconName);
    const IconComponent = (BlueprintIcons as unknown as Record<string, ComponentType<{ size?: number }>>)[name];
    if (IconComponent == null) {
        return <span />;
    }
    return <IconComponent size={size} />;
}

function FontIcon({ iconName, size }: { iconName: IconName; size: number }) {
    const sizeClass = size === DISPLAY_ICON_SIZE_SMALL ? Classes.ICON_STANDARD : Classes.ICON_LARGE;
    // `span.#{$ns}-icon:empty` in core forces the 20px face; override so standard uses blueprint-icons-16.
    const fontFamily = sizeClass === Classes.ICON_STANDARD ? ICON_FONT_FAMILY_STANDARD : ICON_FONT_FAMILY_LARGE;
    return (
        <span
            className={classNames(Classes.ICON, sizeClass, Classes.iconClass(iconName))}
            style={{ fontFamily, fontSize: size, height: size, width: size }}
        />
    );
}

// -----------------------------------------------------------------------------
// Data

function sortedUniqueIconNames(): IconName[] {
    return Array.from(new Set(Object.values(BlueprintIcons.IconNames)))
        .filter(name => name !== BlueprintIcons.IconNames.Blank)
        .sort();
}
