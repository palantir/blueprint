/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties, PropsWithChildren } from "react";

import { Intent } from "../../common";
import { H3 } from "../html/html";

import { ButtonGroup } from "./buttonGroup";
import { Button } from "./buttons";

type TokenStyles = CSSProperties & Record<`--bp-${string}`, string>;

const customTokens: TokenStyles = {
    "--bp-intent-primary-active": "rgb(59, 7, 100)",
    "--bp-intent-primary-hover": "rgb(76, 29, 149)",
    "--bp-intent-primary-rest": "rgb(91, 33, 182)",
    "--bp-palette-dark-gray-1": "rgb(46, 16, 101)",
    "--bp-palette-dark-gray-2": "rgb(55, 48, 163)",
    "--bp-palette-dark-gray-3": "rgb(49, 46, 129)",
    "--bp-palette-gray-1": "rgb(109, 40, 217)",
    "--bp-palette-gray-3": "rgb(167, 139, 250)",
    "--bp-palette-gray-4": "rgb(196, 181, 253)",
    "--bp-palette-light-gray-1": "rgb(221, 214, 254)",
    "--bp-palette-light-gray-2": "rgb(233, 213, 255)",
    "--bp-palette-light-gray-4": "rgb(243, 232, 255)",
    "--bp-palette-light-gray-5": "rgb(245, 243, 255)",
    "--bp-surface-border-radius": "10px",
    "--bp-surface-border-width": "2px",
    "--bp-surface-spacing": "6px",
    "--bp-typography-size-body-medium": "15px",
};

const meta = {
    title: "Core/Button/Token theming",
    component: Button,
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExistingTokens: Story = {
    render: () => (
        <main style={{ display: "grid", gap: 24, padding: 24 }}>
            <TokenPanel title="Blueprint defaults">
                <Button text="Default" />
                <Button active={true} text="Active" />
                <Button disabled={true} text="Disabled" />
                <Button text="Minimal" variant="minimal" />
                <Button text="Outlined" variant="outlined" />
                <Button intent={Intent.PRIMARY} text="Primary" />
            </TokenPanel>

            <TokenPanel style={customTokens} title="Foundational token overrides">
                <Button text="Default" />
                <Button disabled={true} text="Disabled" />
                <Button text="Minimal" variant="minimal" />
                <Button text="Outlined" variant="outlined" />
                <Button intent={Intent.PRIMARY} text="Primary" />
                <Button active={true} intent={Intent.PRIMARY} text="Primary active" />
                <ButtonGroup>
                    <Button text="Grouped" />
                    <Button text="Buttons" />
                </ButtonGroup>
            </TokenPanel>
        </main>
    ),
};

interface TokenPanelProps extends PropsWithChildren {
    style?: CSSProperties;
    title: string;
}

function TokenPanel({ children, style, title }: TokenPanelProps) {
    return (
        <section
            style={{
                alignItems: "center",
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                padding: 20,
                ...style,
            }}
        >
            <H3 style={{ flexBasis: "100%", margin: 0 }}>{title}</H3>
            {children}
        </section>
    );
}
