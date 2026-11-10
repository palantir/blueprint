/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alignment } from "../../common";
import { Button } from "../button/buttons";

import { Navbar } from "./navbar";
import { NavbarDivider } from "./navbarDivider";
import { NavbarGroup } from "./navbarGroup";
import { NavbarHeading } from "./navbarHeading";

type NavbarStoryArgs = React.ComponentProps<typeof Navbar> & {
    align: NonNullable<React.ComponentProps<typeof NavbarGroup>["align"]>;
};

const meta: Meta<NavbarStoryArgs> = {
    title: "Core/Navbar",
    component: Navbar,
    subcomponents: { NavbarGroup },
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
    args: {
        fixedToTop: false,
        align: Alignment.START,
    },
    argTypes: {
        fixedToTop: { control: "boolean", table: { category: "Navbar" } },
        align: {
            control: "select",
            options: Object.values(Alignment).filter(option => option !== "center"),
            description: "`NavbarGroup` alignment",
            table: { category: "NavbarGroup" },
        },
    },
} satisfies Meta<NavbarStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    argTypes: {
        align: { table: { disable: true } },
    },
    render: args => (
        <Navbar {...args}>
            <NavbarGroup align={Alignment.START}>
                <NavbarHeading>Blueprint</NavbarHeading>
                <NavbarDivider />
                <Button variant="minimal" icon="home" text="Home" />
                <Button variant="minimal" icon="document" text="Files" />
            </NavbarGroup>
            <NavbarGroup align={Alignment.END}>
                <Button variant="minimal" icon="notifications" />
                <Button variant="minimal" icon="cog" />
            </NavbarGroup>
        </Navbar>
    ),
};

export const FixedToTop: Story = {
    args: {
        fixedToTop: true,
    },
    argTypes: {
        align: { table: { disable: true } },
        fixedToTop: { table: { disable: true } },
    },
    render: args => (
        <Navbar {...args}>
            <NavbarGroup align={Alignment.START}>
                <NavbarHeading>Blueprint</NavbarHeading>
                <NavbarDivider />
                <Button variant="minimal" icon="home" text="Home" />
                <Button variant="minimal" icon="document" text="Files" />
            </NavbarGroup>
            <NavbarGroup align={Alignment.END}>
                <Button variant="minimal" icon="notifications" />
                <Button variant="minimal" icon="cog" />
            </NavbarGroup>
        </Navbar>
    ),
};

export const AlignEnd: Story = {
    argTypes: {
        align: { table: { disable: true } },
    },
    render: ({ align, ...args }) => (
        <Navbar {...args}>
            <NavbarGroup align={Alignment.END}>
                <NavbarHeading>Blueprint</NavbarHeading>
                <NavbarDivider />
                <Button variant="minimal" icon="home" text="Home" />
                <Button variant="minimal" icon="document" text="Files" />
            </NavbarGroup>
        </Navbar>
    ),
};

export const Playground: Story = {
    render: ({ align, ...args }) => (
        <Navbar {...args}>
            <NavbarGroup align={align}>
                <NavbarHeading>Blueprint</NavbarHeading>
                <NavbarDivider />
                <Button variant="minimal" icon="home" text="Home" />
                <Button variant="minimal" icon="document" text="Files" />
            </NavbarGroup>
        </Navbar>
    ),
};
