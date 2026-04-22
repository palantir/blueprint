/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";
import { useCallback } from "react";
import { useArgs } from "storybook/preview-api";

import { Flex } from "@blueprintjs/labs";

import { Intent } from "../../common";

import { Slider } from "./slider";

const meta: Meta<typeof Slider> = {
    title: "Core/Slider",
    component: Slider,
    decorators: [storybookLayoutDecorator],
    tags: ["autodocs"],
    args: {
        min: 0,
        max: 10,
        stepSize: 1,
        labelStepSize: 1,
        value: 5,
        disabled: false,
        vertical: false,
        showTrackFill: true,
        intent: Intent.PRIMARY,
    },
    argTypes: {
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        min: {
            control: { type: "range", min: -100, max: 0, step: 1 },
        },
        max: {
            control: { type: "range", min: 1, max: 100, step: 1 },
        },
        stepSize: {
            control: { type: "range", min: 1, max: 10, step: 1 },
        },
        labelStepSize: {
            control: { type: "range", min: 1, max: 10, step: 1 },
        },
        value: {
            control: { type: "range", min: 0, max: 10, step: 1 },
        },
        disabled: {
            control: "boolean",
        },
        vertical: {
            control: "boolean",
        },
        showTrackFill: {
            control: "boolean",
        },
        labelRenderer: {
            control: "boolean",
        },
        onChange: { action: "changed" },
        onRelease: { action: "released" },
    },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic slider with default styling.
 */
export const Default: Story = {
    args: {
        value: 5,
    },
    render: function Render(args) {
        const [_, updateArgs] = useArgs();
        const handleChange = useCallback((newValue: number) => updateArgs({ value: newValue }), [updateArgs]);

        return (
            <Slider
                {...args}
                onChange={handleChange}
                onRelease={handleChange}
                handleHtmlProps={{ "aria-label": "Slider" }}
            />
        );
    },
};

/**
 * Use the `intent` prop to apply a semantic color to the slider track fill.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: function RenderIntent(args) {
        const [_, updateArgs] = useArgs();
        const handleChange = useCallback((newValue: number) => updateArgs({ value: newValue }), [updateArgs]);

        return (
            <Flex flexDirection="column" gap={6} style={{ width: "100%" }}>
                {Object.values(Intent).map(intent => (
                    <Flex key={intent} flexDirection="column" gap={1}>
                        <StoryLabel title={intent} />
                        <Slider
                            {...args}
                            intent={intent}
                            onChange={handleChange}
                            onRelease={handleChange}
                            handleHtmlProps={{ "aria-label": `${intent} intent slider` }}
                        />
                    </Flex>
                ))}
            </Flex>
        );
    },
};

/**
 * Use the `disabled` and `vertical` props to control slider state and orientation.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        disabled: { table: { disable: true } },
        vertical: { table: { disable: true } },
    },
    render: function RenderState(args) {
        const [_, updateArgs] = useArgs();
        const handleChange = useCallback((newValue: number) => updateArgs({ value: newValue }), [updateArgs]);

        return (
            <Flex flexDirection="column" gap={6} style={{ width: "100%" }}>
                <Flex flexDirection="column" gap={1}>
                    <StoryLabel title="Default" />
                    <Slider
                        {...args}
                        disabled={false}
                        onChange={handleChange}
                        onRelease={handleChange}
                        handleHtmlProps={{ "aria-label": "Default state slider" }}
                    />
                </Flex>
                <Flex flexDirection="column" gap={1}>
                    <StoryLabel title="Disabled" />
                    <Slider
                        {...args}
                        disabled={true}
                        onChange={handleChange}
                        onRelease={handleChange}
                        handleHtmlProps={{ "aria-label": "Disabled slider" }}
                    />
                </Flex>
                <Flex flexDirection="column" gap={1}>
                    <StoryLabel title="Vertical" />
                    <Slider
                        {...args}
                        vertical={true}
                        onChange={handleChange}
                        onRelease={handleChange}
                        handleHtmlProps={{ "aria-label": "Vertical slider" }}
                    />
                </Flex>
            </Flex>
        );
    },
};

/**
 * Interactive playground with full state management.
 */
export const Playground: Story = {
    render: function Render(args) {
        const [_, updateArgs] = useArgs();
        const handleChange = useCallback((newValue: number) => updateArgs({ value: newValue }), [updateArgs]);

        return (
            <Slider
                {...args}
                onChange={handleChange}
                onRelease={handleChange}
                handleHtmlProps={{ "aria-label": "Playground slider" }}
            />
        );
    },
    args: {
        value: 5,
    },
};
