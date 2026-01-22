/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Intent } from "../../common";
import { Callout } from "./callout";

const meta: Meta<typeof Callout> = {
    title: "Core/Callout",
    component: Callout,
    argTypes: {
        intent: {
            control: "select",
            options: [undefined, Intent.NONE, Intent.PRIMARY, Intent.SUCCESS, Intent.WARNING, Intent.DANGER],
        },
        icon: {
            control: "text",
            description: "Icon name or null to hide",
        },
        title: {
            control: "text",
        },
        compact: {
            control: "boolean",
        },
        minimal: {
            control: "boolean",
        },
    },
};

export default meta;
type Story = StoryObj<typeof Callout>;

/**
 * Basic Callout with a title and content.
 */
export const Basic: Story = {
    args: {
        title: "Callout Title",
        children: "This is some descriptive content inside the Callout.",
    },
};

/**
 * Callouts with different intents show different colors and default icons.
 */
export const WithIntent: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Callout intent={Intent.PRIMARY}>Primary callout</Callout>
            <Callout intent={Intent.SUCCESS}>Success callout</Callout>
            <Callout intent={Intent.WARNING}>Warning callout</Callout>
            <Callout intent={Intent.DANGER}>Danger callout</Callout>
        </div>
    ),
};

/**
 * A Callout with a custom icon.
 */
export const WithCustomIcon: Story = {
    args: {
        icon: "star",
        title: "Custom Icon",
        children: "This callout uses a custom star icon instead of the default.",
    },
};

/**
 * A Callout without any icon.
 */
export const WithoutIcon: Story = {
    args: {
        icon: null,
        title: "No Icon",
        children: "This callout has no icon displayed.",
    },
};

/**
 * Compact Callout with reduced padding.
 */
export const Compact: Story = {
    args: {
        compact: true,
        intent: Intent.PRIMARY,
        title: "Compact Callout",
        children: "This callout has reduced padding for denser layouts.",
    },
};

/**
 * Minimal Callout without background fill.
 */
export const Minimal: Story = {
    args: {
        minimal: true,
        intent: Intent.WARNING,
        title: "Minimal Callout",
        children: "This callout has a minimal appearance with no background.",
    },
};
