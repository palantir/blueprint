/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Classes } from "../../common";
import { Button } from "../button/buttons";
import { Card } from "../card/card";
import { H5 } from "../html/html";
import { StoryLabel } from "../storybook-components/StoryLabel";

interface SkeletonStoryProps {
    /** Whether the skeleton class is applied */
    skeleton: boolean;
}

const SkeletonDemo: React.FC<SkeletonStoryProps> = ({ skeleton }) => (
    <Card>
        <H5 className={`${Classes.HEADING} ${skeleton ? Classes.SKELETON : ""}`}>
            <span tabIndex={skeleton ? -1 : undefined}>Card heading</span>
        </H5>
        <p className={skeleton ? Classes.SKELETON : ""}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget tortor felis. Fusce dapibus metus in
            dapibus mollis. Quisque eget ex diam.
        </p>
        <Button
            className={skeleton ? Classes.SKELETON : ""}
            icon="add"
            text="Submit"
            aria-busy={true}
            tabIndex={skeleton ? -1 : undefined}
        />
    </Card>
);

const meta: Meta<typeof SkeletonDemo> = {
    title: "Core/Styles/Skeleton",
    component: SkeletonDemo,
    decorators: [
        Story => (
            <div style={{ display: "flex", width: "600px" }}>
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        skeleton: true,
    },
    argTypes: {
        skeleton: {
            control: "boolean",
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A card with the `.bp5-skeleton` class applied to its content elements, showing the default loading state.
 */
export const Default: Story = {
    args: {
        skeleton: true,
    },
};

/**
 * Compare the skeleton loading state with the loaded content side by side.
 */
export const ComparisonExample: Story = {
    name: "Comparison",
    render: () => (
        <div style={{ display: "flex", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <StoryLabel title="Loading" />
                <SkeletonDemo skeleton={true} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <StoryLabel title="Loaded" />
                <SkeletonDemo skeleton={false} />
            </div>
        </div>
    ),
};

/**
 * Interactive playground with all props controlled via Storybook controls.
 */
export const Playground: Story = {
    args: {
        skeleton: false,
    },
};
