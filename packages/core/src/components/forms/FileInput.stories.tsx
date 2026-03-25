/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { Size } from "../../common";

import { FileInput } from "./fileInput";

const meta: Meta<typeof FileInput> = {
    title: "Core/Form/Inputs/FileInput",
    component: FileInput,
    decorators: [
        Story => (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    width: "100%",
                    minWidth: "400px",
                }}
            >
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        text: "Choose file...",
        buttonText: "Browse",
        disabled: false,
        fill: false,
        hasSelection: false,
        size: "medium",
    },
    argTypes: {
        text: {
            control: "text",
        },
        buttonText: {
            control: "text",
        },
        size: {
            control: "select",
            options: Object.values(Size),
        },
        disabled: {
            control: "boolean",
        },
        fill: {
            control: "boolean",
        },
        hasSelection: {
            control: "boolean",
        },
        onInputChange: { action: "inputChanged" },
        // deprecated props
        large: { table: { disable: true } },
        small: { table: { disable: true } },
    },
} satisfies Meta<typeof FileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic file input with default styling.
 */
export const Default: Story = {};

/**
 * Use the `size` prop to adjust the file input dimensions.
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
            {Object.values(Size).map(size => (
                <FileInput
                    key={size}
                    {...args}
                    size={size}
                    text={`${size.charAt(0).toUpperCase() + size.slice(1)} size`}
                />
            ))}
        </div>
    ),
};

/**
 * FileInput supports `disabled` state and `hasSelection` visual state.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        disabled: { table: { disable: true } },
        hasSelection: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
            <FileInput {...args} text="Choose file..." />
            <FileInput {...args} hasSelection={true} text="document.pdf" />
            <FileInput {...args} disabled={true} text="Disabled..." />
        </div>
    ),
};

/**
 * Use the `fill` prop to make the file input expand to the full width of its container.
 */
export const FillExample: Story = {
    name: "Fill",
    argTypes: {
        fill: { table: { disable: true } },
    },
    decorators: [
        Story => (
            <div style={{ width: "400px" }}>
                <Story />
            </div>
        ),
    ],
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
            <FileInput {...args} fill={true} text="Full Width" />
            <FileInput {...args} fill={false} text="Auto Width" />
        </div>
    ),
};

/**
 * Customize the button text with the `buttonText` prop.
 */
export const ButtonTextExample: Story = {
    name: "Button Text",
    argTypes: {
        buttonText: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
            <FileInput {...args} buttonText="Browse" text="Default button text..." />
            <FileInput {...args} buttonText="Upload" text="Custom button text..." />
            <FileInput {...args} buttonText="Select" text="Another button text..." />
        </div>
    ),
};

/**
 * Interactive playground with file selection handling.
 */
export const Playground: Story = {
    render: function Render(args) {
        const [fileName, setFileName] = useState<string | null>(null);

        const handleInputChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                setFileName(file?.name ?? null);
                args.onInputChange?.(e);
            },
            [args],
        );

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: "400px" }}>
                <FileInput
                    buttonText={args.buttonText}
                    disabled={args.disabled}
                    fill={args.fill}
                    hasSelection={fileName != null}
                    onInputChange={handleInputChange}
                    size={args.size}
                    text={fileName ?? "Choose file..."}
                />
                {fileName != null && <div style={{ fontSize: 12, opacity: 0.6 }}>Selected: {fileName}</div>}
            </div>
        );
    },
    args: {
        buttonText: "Browse",
    },
};
