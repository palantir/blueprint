/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { Code } from "@blueprintjs/core";


import { Button } from "../button/buttons";
import { H4 } from "../html/html";

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
            <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: "400px" }}>
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: "centered",
    },
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
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(args.isOpen ?? false);
        const handleToggle = useCallback(() => setIsOpen(prev => !prev), []);

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Button text={isOpen ? "Hide content" : "Show content"} onClick={handleToggle} />
                <Collapse {...args} isOpen={isOpen}>
                    {sampleContent}
                </Collapse>
            </div>
        );
    },
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(args.isOpen ?? false);
        const handleToggle = useCallback(() => setIsOpen(prev => !prev), []);

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 400 }}>
                <Button text={isOpen ? "Collapse" : "Expand"} onClick={handleToggle} icon="exchange" />
                <Collapse
                    isOpen={isOpen}
                    keepChildrenMounted={args.keepChildrenMounted}
                    transitionDuration={args.transitionDuration}
                    component={args.component}
                >
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
            </div>
        );
    },
};
