/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback } from "react";
import { useArgs } from "storybook/preview-api";

import { Flex } from "@blueprintjs/labs";

import { Button } from "../button/buttons";
import { Code, H4 } from "../html/html";

import { Collapse } from "./collapse";

const sampleContent = (
    <div style={{ padding: 12, background: "var(--pt-app-background-color)", border: "1px solid var(--gray3)" }}>
        <p style={{ margin: 0 }}>
            This is an example of collapsible content. It can contain any valid React elements, including paragraphs,
            lists, forms, or other components.
        </p>
    </div>
);

const meta: Meta<typeof Collapse> = {
    title: "Core/Collapse",
    component: Collapse,
    decorators: [
        Story => (
            <Flex flexDirection="column" gap={2} style={{ minWidth: "400px", maxWidth: "500px" }}>
                <Story />
            </Flex>
        ),
    ],
    tags: ["autodocs"],
    args: {
        isOpen: false,
        keepChildrenMounted: false,
        transitionDuration: 200,
    },
    argTypes: {
        isOpen: {
            control: "boolean",
        },
        keepChildrenMounted: {
            control: "boolean",
        },
        transitionDuration: {
            control: "number",
        },
        component: {
            control: "text",
        },
    },
} satisfies Meta<typeof Collapse>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic collapse that reveals and hides content with a smooth sliding animation.
 * Use the `isOpen` control to toggle visibility.
 */
export const Default: Story = {
    args: {
        isOpen: true,
    },
    argTypes: {
        component: { table: { disable: true } },
    },
    render: function RenderDefault(args) {
        const [, updateArgs] = useArgs();
        const handleToggle = useCallback(() => updateArgs({ isOpen: !args.isOpen }), [args.isOpen, updateArgs]);

        return (
            <Flex flexDirection="column" gap={2}>
                <Button text={args.isOpen ? "Hide content" : "Show content"} onClick={handleToggle} />
                <Collapse {...args}>{sampleContent}</Collapse>
            </Flex>
        );
    },
};

/**
 * Interactive playground with all props toggleable via Storybook controls.
 */
export const Playground: Story = {
    args: {
        isOpen: false,
    },
    argTypes: {
        component: { table: { disable: true } },
    },
    render: function RenderPlayground(args) {
        const [, updateArgs] = useArgs();
        const handleToggle = useCallback(() => updateArgs({ isOpen: !args.isOpen }), [args.isOpen, updateArgs]);

        return (
            <Flex flexDirection="column" gap={2} style={{ minWidth: 400 }}>
                <Button text={args.isOpen ? "Collapse" : "Expand"} onClick={handleToggle} icon="exchange" />
                <Collapse {...args}>
                    <div
                        style={{
                            padding: 16,
                            background: "var(--pt-app-background-color)",
                            border: "1px solid var(--gray3)",
                            borderRadius: 4,
                        }}
                    >
                        <H4 style={{ marginTop: 0 }}>Collapsible Content</H4>
                        <p>
                            This content is revealed and hidden with a smooth sliding animation. Toggle the controls in
                            the Storybook panel to adjust the component behavior.
                        </p>
                        <p style={{ marginBottom: 0 }}>
                            Try adjusting <Code>transitionDuration</Code> and <Code>keepChildrenMounted</Code> to see
                            their effects.
                        </p>
                    </div>
                </Collapse>
            </Flex>
        );
    },
};
