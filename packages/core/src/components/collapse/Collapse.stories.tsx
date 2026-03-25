/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { useCallback, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button/buttons";
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
    title: "Core/Components/Collapse",
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
 * By default, Collapse unmounts its children when closed. Use `keepChildrenMounted` to preserve
 * child component state while hidden. This is useful when children have internal state that should
 * not be lost when collapsing.
 */
export const KeepChildrenMounted: Story = {
    name: "Keep Children Mounted",
    argTypes: {
        keepChildrenMounted: { table: { disable: true } },
    },
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(false);
        const handleToggle = useCallback(() => setIsOpen(prev => !prev), []);

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                    <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>
                        keepChildrenMounted = false (default)
                    </div>
                    <Button text={isOpen ? "Collapse" : "Expand"} onClick={handleToggle} />
                    <Collapse {...args} isOpen={isOpen} keepChildrenMounted={false}>
                        <div
                            style={{
                                padding: 12,
                                marginTop: 8,
                                background: "var(--pt-app-background-color)",
                                border: "1px solid var(--gray3)",
                            }}
                        >
                            <p style={{ margin: 0 }}>Children are unmounted when closed.</p>
                        </div>
                    </Collapse>
                </div>
                <div>
                    <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>keepChildrenMounted = true</div>
                    <Button text={isOpen ? "Collapse" : "Expand"} onClick={handleToggle} />
                    <Collapse {...args} isOpen={isOpen} keepChildrenMounted={true}>
                        <div
                            style={{
                                padding: 12,
                                marginTop: 8,
                                background: "var(--pt-app-background-color)",
                                border: "1px solid var(--gray3)",
                            }}
                        >
                            <p style={{ margin: 0 }}>Children remain mounted when closed (hidden but preserved).</p>
                        </div>
                    </Collapse>
                </div>
            </div>
        );
    },
};

/**
 * The `transitionDuration` prop controls the length of the open/close animation in milliseconds.
 * This must match the CSS transition duration if overridden.
 */
export const TransitionDuration: Story = {
    name: "Transition Duration",
    argTypes: {
        transitionDuration: { table: { disable: true } },
    },
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(false);
        const handleToggle = useCallback(() => setIsOpen(prev => !prev), []);

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[100, 200, 500, 1000].map(duration => (
                    <div key={duration}>
                        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>{duration}ms</div>
                        <Collapse {...args} isOpen={isOpen} transitionDuration={duration}>
                            <div
                                style={{
                                    padding: 12,
                                    background: "var(--pt-app-background-color)",
                                    border: "1px solid var(--gray3)",
                                }}
                            >
                                <p style={{ margin: 0 }}>Transition duration: {duration}ms</p>
                            </div>
                        </Collapse>
                    </div>
                ))}
                <Button text={isOpen ? "Collapse all" : "Expand all"} onClick={handleToggle} />
            </div>
        );
    },
};

/**
 * Collapse can wrap multiple sections to create an accordion-like pattern.
 */
export const MultipleSections: Story = {
    name: "Multiple Sections",
    render: function Render(args) {
        const [openSection, setOpenSection] = useState<number | null>(null);
        const handleToggle = useCallback(
            (index: number) => setOpenSection(prev => (prev === index ? null : index)),
            [],
        );

        const sections = ["Section A", "Section B", "Section C"];

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {sections.map((label, index) => (
                    <div key={label}>
                        <Button
                            text={label}
                            icon={openSection === index ? "chevron-down" : "chevron-right"}
                            fill={true}
                            onClick={() => handleToggle(index)}
                            variant="minimal"
                            alignText="left"
                        />
                        <Collapse {...args} isOpen={openSection === index}>
                            <div
                                style={{
                                    padding: 12,
                                    background: "var(--pt-app-background-color)",
                                    border: "1px solid var(--gray3)",
                                    borderTop: "none",
                                }}
                            >
                                <p style={{ margin: 0 }}>Content for {label}. Only one section is open at a time.</p>
                            </div>
                        </Collapse>
                    </div>
                ))}
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
                        <h4 style={{ marginTop: 0 }}>Collapsible Content</h4>
                        <p>
                            This content is revealed and hidden with a smooth sliding animation. Toggle the controls in
                            the Storybook panel to adjust the component behavior.
                        </p>
                        <p style={{ marginBottom: 0 }}>
                            Try adjusting <code>transitionDuration</code> and <code>keepChildrenMounted</code> to see
                            their effects.
                        </p>
                    </div>
                </Collapse>
            </div>
        );
    },
};
