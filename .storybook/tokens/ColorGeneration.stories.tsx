/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Code, H4 } from "@blueprintjs/core";
import { Flex } from "@blueprintjs/labs";

import { generatePalette } from "./generatePalette";
import { TOKEN_FAMILIES, type TokenFamily } from "./generateTokens";

type ColorGenerationArgs = Record<TokenFamily, string | undefined>;

const meta = {
    title: "Theming/Color generation",
    args: {
        default: "#5f6b7c",
        primary: "#2d72d2",
        success: "#238551",
        warning: "#c87619",
        danger: "#cd4246",
    },
    argTypes: Object.fromEntries(
        TOKEN_FAMILIES.map(family => [
            family,
            {
                control: "color",
                description: "An opaque seed color, preserved at palette index 6.",
            },
        ]),
    ),
    render: seeds => (
        <Flex flexDirection="column" gap={4}>
            {TOKEN_FAMILIES.map(family => {
                const palette = generatePalette(seeds[family] ?? "");
                return (
                    <Flex key={family} flexDirection="column" gap={2}>
                        <H4>
                            {family} <Code>{seeds[family]}</Code>
                        </H4>
                        {palette === undefined ? (
                            <p>Choose an opaque seed color.</p>
                        ) : (
                            <Flex gap={2}>
                                {palette.map((color, index) => (
                                    <Flex key={color} alignItems="center" flexDirection="column" gap={2}>
                                        <div
                                            aria-label={`${family} shade ${index}: ${color}`}
                                            role="img"
                                            style={{
                                                backgroundColor: color,
                                                border: "1px solid var(--bp-surface-border-color-default)",
                                                borderRadius: "var(--bp-surface-border-radius)",
                                                height: 48,
                                                width: 64,
                                            }}
                                            title={color}
                                        />
                                        <Code>{index === 6 ? "6 (seed)" : index}</Code>
                                    </Flex>
                                ))}
                            </Flex>
                        )}
                    </Flex>
                );
            })}
        </Flex>
    ),
} satisfies Meta<ColorGenerationArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
