/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator } from "@storybook-common";

import { Flex } from "@blueprintjs/labs";

import { type BlueprintTokenMap } from "../../context/blueprintThemeContext";
import { BlueprintThemeProvider } from "../../context/blueprintThemeProvider";
import { Menu } from "../menu/menu";
import { MenuDivider } from "../menu/menuDivider";
import { MenuItem } from "../menu/menuItem";
import { PopoverNext } from "../popover-next/popoverNext";
import { Portal } from "../portal/portal";

import { Button } from "./buttons";

const INITIAL_TOKENS = {
    "--bp-intent-primary-foreground": "white",
    "--bp-surface-border-color-primary":
        "color-mix(in oklch, var(--bp-surface-background-color-primary-rest), white 60%)",
    "--bp-surface-background-color-primary-active":
        "color-mix(in oklch, var(--bp-surface-background-color-primary-rest), black 24%)",
    "--bp-surface-background-color-primary-hover":
        "color-mix(in oklch, var(--bp-surface-background-color-primary-rest), black 12%)",
    "--bp-surface-background-color-primary-rest": "rebeccapurple",
    "--bp-surface-layer-primary-active":
        "color-mix(in oklch, var(--bp-surface-background-color-primary-active) 12%, transparent)",
    "--bp-surface-layer-primary-hover":
        "color-mix(in oklch, var(--bp-surface-background-color-primary-hover) 6%, transparent)",
    "--bp-typography-color-intent-primary":
        "color-mix(in oklch, var(--bp-surface-background-color-primary-rest), black 12%)",
} satisfies BlueprintTokenMap;

function ExampleMenu() {
    return (
        <Menu>
            <MenuItem icon="graph" text="Graph" />
            <MenuItem icon="map" text="Map" />
            <MenuItem icon="th" shouldDismissPopover={false} text="Table" />
            <MenuItem disabled={true} icon="zoom-to-fit" text="Browser" />
            <Button intent="primary" variant="outlined">
                Button
            </Button>
            <MenuItem icon="widget-button" text="Button">
                <Button intent="primary">Internal button</Button>
            </MenuItem>
            <MenuDivider />
            <MenuItem icon="cog" text="Settings..." intent="primary">
                <MenuItem disabled={true} icon="add" text="Add new application" />
                <MenuItem icon="remove" text="Remove application" />
            </MenuItem>
        </Menu>
    );
}

const meta = {
    title: "NextStyles/Core/Button/Button",
    component: BlueprintThemeProvider,
    decorators: [storybookLayoutDecorator],
    args: {
        tokens: INITIAL_TOKENS,
    },
    argTypes: {
        children: { table: { disable: true } },
        tokens: { control: "object" },
    },
} satisfies Meta<typeof BlueprintThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Edit the token map in Storybook controls to compare inline and portal-rendered Buttons. */
export const ThemeProvider: Story = {
    args: {
        tokens: INITIAL_TOKENS,
    },

    render: args => (
        <BlueprintThemeProvider tokens={args.tokens}>
            <Flex flexDirection="column" gap={4}>
                <Flex flexDirection="column" gap={2}>
                    <div>Inline</div>
                    <Button intent="primary" text="Inline Button" />
                </Flex>
                <Flex flexDirection="column" gap={2}>
                    <div>PopoverNext portal</div>
                    <PopoverNext content={<ExampleMenu />} fill={true} placement="bottom">
                        <Button alignText="start" endIcon="caret-down" fill={true} icon="application" text="Open" />
                    </PopoverNext>
                </Flex>
                <Portal>
                    <Button
                        intent="primary"
                        style={{
                            insetBlockEnd: "calc(var(--bp-surface-spacing) * 4)",
                            insetInlineEnd: "calc(var(--bp-surface-spacing) * 4)",
                            position: "fixed",
                        }}
                        text="Button in legacy Portal"
                    />
                </Portal>
            </Flex>
        </BlueprintThemeProvider>
    ),
};
