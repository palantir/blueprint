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

const meta: Meta<typeof Navbar> = {
    title: "Core/Components/Navbar",
    component: Navbar,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
    args: {
        fixedToTop: false,
    },
    argTypes: {
        fixedToTop: { control: "boolean" },
    },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: args => (
        <Navbar {...args}>
            <NavbarGroup align={Alignment.START}>
                <NavbarHeading>Blueprint</NavbarHeading>
                <NavbarDivider />
                <Button variant="minimal" icon="home" text="Home" />
                <Button variant="minimal" icon="document" text="Files" />
            </NavbarGroup>
        </Navbar>
    ),
};

export const WithLeftAndRightGroups: Story = {
    name: "Left & Right Groups",
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

export const WithDividers: Story = {
    name: "With Dividers",
    render: args => (
        <Navbar {...args}>
            <NavbarGroup align={Alignment.START}>
                <NavbarHeading>App</NavbarHeading>
                <NavbarDivider />
                <Button variant="minimal" icon="home" text="Home" />
                <Button variant="minimal" icon="document" text="Files" />
                <NavbarDivider />
                <Button variant="minimal" icon="cog" text="Settings" />
            </NavbarGroup>
        </Navbar>
    ),
};

export const DarkTheme: Story = {
    name: "Dark Theme",
    render: args => (
        <div className="bp6-dark">
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
        </div>
    ),
};

export const Playground: Story = {
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
