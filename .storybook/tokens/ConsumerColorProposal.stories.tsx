/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

/**
 * @module ConsumerColorProposal.stories
 * @layer Application
 * Makes the anchored-color proposal reviewable before changing shared theme generation.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root Culori devDependency.
import { wcagContrast } from "culori";
// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root React devDependency.
import { type CSSProperties, useCallback, useState } from "react";

import { Button, Callout, Code, H4, HTMLTable } from "@blueprintjs/core";
import { Flex } from "@blueprintjs/labs";

import { generateConsumerColors } from "./generateConsumerColors";

interface ConsumerColorArgs {
    seed: string;
    surface: string;
}

// -- Story --------------------------------------------------------------------

const meta = {
    title: "Theming/Consumer color proposal",
    args: { seed: "#7961db", surface: "#ffffff" },
    argTypes: {
        seed: { control: "text", description: "Exact button rest color: opaque #RGB or #RRGGBB." },
        surface: { control: "text", description: "Opaque surrounding surface, used for boundary and text checks." },
    },
    parameters: { layout: "padded" },
    render: args => <ConsumerColorPreview key={`${args.seed}|${args.surface}`} {...args} />,
} satisfies Meta<ConsumerColorArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const BlueGray: Story = { args: { seed: "#5f6b7c" } };
export const White: Story = { args: { seed: "#ffffff" } };
export const Black: Story = { args: { seed: "#000000" } };
export const PaleCream: Story = { args: { seed: "#f8f4e8" } };
export const DarkGray: Story = { args: { seed: "#222222", surface: "#252a31" } };
export const SaturatedYellow: Story = { args: { seed: "#ffff00" } };
export const DarkSurface: Story = { args: { surface: "#252a31" } };

// -- Preview ------------------------------------------------------------------

function ConsumerColorPreview({ seed, surface }: ConsumerColorArgs) {
    const [isSelected, setIsSelected] = useState(false);
    const handleSelection = useCallback(() => setIsSelected(selected => !selected), []);
    const colors = generateConsumerColors(seed, { surface });
    if (colors.status !== "generated") {
        return (
            <Callout intent="danger" title="Choose a supported color">
                {colors.reason}
            </Callout>
        );
    }
    const { solid, audit, ramp } = colors;
    const surfaceForeground =
        wcagContrast(surface, "#ffffff") >= wcagContrast(surface, "#000000") ? "#ffffff" : "#000000";
    const buttonTokens: CSSProperties & Record<`--${string}`, string> = {
        "--bp-intent-primary-active": solid.selected,
        "--bp-intent-primary-foreground": solid.foreground,
        "--bp-intent-primary-hover": solid.hover,
        "--bp-intent-primary-rest": solid.rest,
        // Keep the returned boundary independent of Blueprint's shadow and keyboard-focus treatments.
        border: solid.border === null ? undefined : `1px solid ${solid.border}`,
    };
    return (
        <Flex flexDirection="column" gap={4} style={{ maxWidth: 960 }}>
            <div>
                <H4>Keep the chosen color at rest</H4>
                <p>
                    Change seed and surface in Controls. Hover the button, then click to toggle selected. Blueprint
                    calibration is deferred.
                </p>
            </div>
            <Flex flexDirection="column" gap={3} style={{ background: surface, color: surfaceForeground, padding: 20 }}>
                <Flex alignItems="center" flexWrap="wrap" gap={3}>
                    <Button
                        active={isSelected}
                        aria-pressed={isSelected}
                        intent="primary"
                        onClick={handleSelection}
                        style={buttonTokens}
                        text="Select example"
                    />
                    <span>
                        States move {audit.direction}. Label: {solid.foreground.toUpperCase()}.
                    </span>
                </Flex>
                <Flex flexWrap="wrap" gap={3}>
                    {(["rest", "hover", "selected"] as const).map(state => (
                        <div key={state} style={{ flex: "1 1 120px" }}>
                            <div
                                style={{
                                    background: solid[state],
                                    border: `1px solid ${solid.border ?? "transparent"}`,
                                    borderRadius: 3,
                                    color: solid.foreground,
                                    padding: 12,
                                }}
                            >
                                {state === "selected" ? "Selected" : state === "rest" ? "Rest (input)" : "Hover"}
                                {" · "}
                                {solid.stops[state]}
                            </div>
                            <div>{solid[state].toUpperCase()}</div>
                            <div>Label contrast: {audit.textContrast[state].toFixed(2)}:1</div>
                        </div>
                    ))}
                </Flex>
                {solid.border !== null && (
                    <div>
                        Boundary: {solid.border.toUpperCase()} · {audit.boundaryContrast?.toFixed(2)}:1 against this
                        surface
                    </div>
                )}
                <div style={{ color: colors.text }}>Accent text · {audit.textOnSurfaceContrast.toFixed(2)}:1</div>
                <div style={{ background: colors.subtle.background, color: colors.subtle.foreground, padding: 12 }}>
                    Subtle surface and text · {audit.subtleTextContrast.toFixed(2)}:1
                </div>
            </Flex>
            <div>
                <H4>Palette placement</H4>
                <p>
                    Rest, hover, and selected all use entries from this palette. The light and dark ends inherit the
                    input's hue. Pure white, black, and gray inputs use a neutral scale.
                </p>
                <Flex flexWrap="wrap" gap={2}>
                    {ramp.map(stop => (
                        <div key={stop.stop} style={{ flex: "1 1 76px", minWidth: 76 }}>
                            <div
                                aria-label={`${stop.stop}: ${stop.color}`}
                                role="img"
                                style={{
                                    background: stop.color,
                                    border: "1px solid var(--bp-surface-border-color-default)",
                                    borderRadius: 3,
                                    height: 44,
                                }}
                            />
                            <div>
                                {stop.stop}
                                {stop.stop === solid.stops.rest
                                    ? " · Rest"
                                    : stop.stop === solid.stops.hover
                                      ? " · Hover"
                                      : stop.stop === solid.stops.selected
                                        ? " · Selected"
                                        : ""}
                            </div>
                            <Code>{stop.color.toUpperCase()}</Code>
                        </div>
                    ))}
                </Flex>
            </div>
            <details>
                <summary>Calculation and checks</summary>
                <p>
                    Input OKLCH: L {colors.seed.l.toFixed(5)}, C {colors.seed.c.toFixed(5)}, H{" "}
                    {colors.seed.c < 1e-7 ? "neutral" : `${colors.seed.h?.toFixed(2)}°`}.
                </p>
                <p>
                    Start with tinted endpoints at L 0.98 and 0.12. Very light or dark input can occupy an endpoint.
                    Preserve the exact input and its hue; chroma follows C₀ × [0.25 + 0.75 × (1 − t)^0.8], where t is
                    lightness progress toward L 1 or 0. Reduce chroma to fit sRGB, then check the final HEX values.
                </p>
                <p>
                    Search palette index pairs in both directions. If none work, retry with intermediate shades closer
                    to rest. Extend endpoint lightness only when readability needs it; rest stays unchanged. Contrast
                    against the surrounding surface can also require a wider range. Endpoint adjustments:{" "}
                    {audit.endpointRange}. Palette spacing exponent: {audit.paletteSpacingPower}.
                </p>
                <div style={{ overflowX: "auto" }}>
                    <HTMLTable compact={true}>
                        <thead>
                            <tr>
                                <th>Step</th>
                                <th>Fill contrast</th>
                                <th>OKLab distance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Rest → hover</td>
                                <td>{audit.stateContrast.restToHover.toFixed(3)}:1</td>
                                <td>{audit.stateDistance.restToHover.toFixed(5)}</td>
                            </tr>
                            <tr>
                                <td>Hover → selected</td>
                                <td>{audit.stateContrast.hoverToSelected.toFixed(3)}:1</td>
                                <td>{audit.stateDistance.hoverToSelected.toFixed(5)}</td>
                            </tr>
                        </tbody>
                    </HTMLTable>
                </div>
                <p>
                    Every label must meet 4.5:1. Each adjacent fill pair must meet 1.15:1 and 0.04 distance; these two
                    state thresholds are design heuristics, not WCAG rules.
                </p>
            </details>
        </Flex>
    );
}
