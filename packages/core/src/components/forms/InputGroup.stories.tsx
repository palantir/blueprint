/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button/buttons";
import { Intent } from "../../common/intent";
import { InputGroup } from "./inputGroup";

const meta = {
    title: "Core/InputGroup",
    component: InputGroup,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        placeholder: "Placeholder text",
        type: "text",
        size: "medium",
        round: false,
        disabled: false,
    },
    argTypes: {
        intent: {
            control: "select",
            options: [Intent.PRIMARY, Intent.SUCCESS, Intent.WARNING, Intent.DANGER, undefined],
        },
        size: {
            control: "select",
            options: ["small", "medium", "large"],
        },
    },
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic text input.
 */
export const Default: Story = {
    decorators: [
        Story => (
            <div style={{ width: 280 }}>
                <Story />
            </div>
        ),
    ],
};

/**
 * With left icon.
 */
export const WithLeftIcon: Story = {
    args: {
        leftIcon: "search",
        placeholder: "Search...",
    },
    decorators: [
        Story => (
            <div style={{ width: 280 }}>
                <Story />
            </div>
        ),
    ],
};

/**
 * With right element (e.g. button).
 */
export const WithRightElement: Story = {
    args: {
        placeholder: "Enter value",
        rightElement: <Button variant="minimal" icon="arrow-right" aria-label="Submit" />,
    },
    decorators: [
        Story => (
            <div style={{ width: 280 }}>
                <Story />
            </div>
        ),
    ],
};

/**
 * Password input.
 */
export const Password: Story = {
    args: {
        type: "password",
        placeholder: "Password",
    },
    decorators: [
        Story => (
            <div style={{ width: 280 }}>
                <Story />
            </div>
        ),
    ],
};

/**
 * With intent (e.g. validation state).
 */
export const WithIntent: Story = {
    args: {
        placeholder: "Error state",
        intent: Intent.DANGER,
    },
    decorators: [
        Story => (
            <div style={{ width: 280 }}>
                <Story />
            </div>
        ),
    ],
};

/**
 * Disabled input.
 */
export const Disabled: Story = {
    args: {
        disabled: true,
        placeholder: "Disabled",
    },
    decorators: [
        Story => (
            <div style={{ width: 280 }}>
                <Story />
            </div>
        ),
    ],
};

/**
 * Size variants.
 */
export const Sizes: Story = {
    render: () => (
        <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 12 }}>
            <InputGroup size="small" placeholder="Small" />
            <InputGroup size="medium" placeholder="Medium" />
            <InputGroup size="large" placeholder="Large" />
        </div>
    ),
};
