/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Classes } from "../../common";
import { Button } from "../button/buttons";
import { Card } from "../card/card";

interface SkeletonStoryProps {
    /** Whether the skeleton class is applied */
    skeleton: boolean;
}

const SkeletonDemo: React.FC<SkeletonStoryProps> = ({ skeleton }) => (
    <Card>
        <h5 className={`${Classes.HEADING} ${skeleton ? Classes.SKELETON : ""}`}>
            <a href="#" tabIndex={-1}>
                Card heading
            </a>
        </h5>
        <p className={skeleton ? Classes.SKELETON : ""}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget tortor felis. Fusce dapibus metus in
            dapibus mollis. Quisque eget ex diam.
        </p>
        <Button className={skeleton ? Classes.SKELETON : ""} icon="add" text="Submit" tabIndex={-1} />
    </Card>
);

const meta: Meta<typeof SkeletonDemo> = {
    title: "Core/Skeleton",
    component: SkeletonDemo,
    decorators: [
        Story => (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minWidth: "300px" }}>
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
                <span style={{ fontSize: 12, opacity: 0.6 }}>Loading</span>
                <SkeletonDemo skeleton={true} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Loaded</span>
                <SkeletonDemo skeleton={false} />
            </div>
        </div>
    ),
};

/**
 * The skeleton class can be applied to various HTML elements, inheriting their dimensions.
 */
export const VariousElementsExample: Story = {
    name: "Various Elements",
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 300 }}>
            <h3 className={Classes.SKELETON}>Heading element</h3>
            <p className={Classes.SKELETON}>Paragraph element with some placeholder text content.</p>
            <span className={Classes.SKELETON} style={{ display: "inline-block", width: 200, height: 20 }}>
                Inline block element
            </span>
            <Button className={Classes.SKELETON} text="Button element" tabIndex={-1} />
            <input className={Classes.SKELETON} type="text" placeholder="Input element" tabIndex={-1} />
        </div>
    ),
};

/**
 * Multiple skeleton rows simulating a list loading state.
 */
export const ListExample: Story = {
    name: "List",
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 400 }}>
            {Array.from({ length: 5 }, (_, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div
                        className={Classes.SKELETON}
                        style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }}
                    >
                        &nbsp;
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                        <div className={Classes.SKELETON} style={{ height: 16, width: `${70 + ((i * 13) % 30)}%` }}>
                            &nbsp;
                        </div>
                        <div className={Classes.SKELETON} style={{ height: 12, width: `${50 + ((i * 17) % 40)}%` }}>
                            &nbsp;
                        </div>
                    </div>
                </div>
            ))}
        </div>
    ),
};
