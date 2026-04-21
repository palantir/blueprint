/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoryLabel } from "@storybook-common";

import { Flex } from "@blueprintjs/labs";

import { Classes } from "../../common";
import { Button } from "../button/buttons";
import { Card } from "../card/card";
import { H5 } from "../html/html";

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
            <Flex style={{ width: "600px" }}>
                <Story />
            </Flex>
        ),
    ],
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
        <Flex gap={6}>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Loading" />
                <SkeletonDemo skeleton={true} />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Loaded" />
                <SkeletonDemo skeleton={false} />
            </Flex>
        </Flex>
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
