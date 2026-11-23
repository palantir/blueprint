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

import { consumerColorPolicy, generateConsumerColors } from "./generateConsumerColors";

interface ConsumerColorArgs {
    seed: string;
    surface: string;
}

// Final HEX examples from Greg's proposal p. 6 and Ryan's recipe pp. 10–11.
const referenceRows = [
    { name: "Greg · blue", rest: "#2d72d2", hover: "#215db0", selected: "#184a90", distances: "0.076 / 0.072" },
    { name: "Ryan · orange", rest: "#bd5200", hover: "#9e3600", selected: undefined, distances: "0.091 / —" },
].flatMap(reference => {
    const generated = generateConsumerColors(reference.rest);
    return [
        reference,
        ...(generated.status === "generated"
            ? [
                  {
                      ...generated.solid,
                      name: `Our generator · ${reference.rest.toUpperCase()}`,
                      distances: `${generated.audit.stateDistance.restToHover.toFixed(3)} / ${generated.audit.stateDistance.hoverToSelected.toFixed(3)}`,
                  },
              ]
            : []),
    ];
});

// -- Story --------------------------------------------------------------------

const meta: Meta<ConsumerColorArgs> = {
    title: "Theming/Consumer color proposal",
    args: { seed: "#7961db", surface: "#ffffff" },
    argTypes: {
        seed: { control: "text", description: "Exact button rest color: opaque #RGB or #RRGGBB." },
        surface: { control: "text", description: "Opaque surrounding surface, used for boundary and text checks." },
    },
    parameters: { layout: "padded" },
    render: (args, context) => (
        <ConsumerColorPreview
            key={`${args.seed}|${args.surface}|${context.globals.theme}`}
            {...args}
            mode={context.globals.theme === "dark" ? "dark" : "light"}
        />
    ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const BlueGray: Story = { args: { seed: "#5f6b7c" } };
export const White: Story = { args: { seed: "#ffffff" } };
export const Black: Story = { args: { seed: "#000000" } };
export const PaleCream: Story = { args: { seed: "#f8f4e8" } };
export const DarkGray: Story = { args: { seed: "#222222", surface: "#252a31" }, globals: { theme: "dark" } };
export const SaturatedYellow: Story = { args: { seed: "#ffff00" } };
export const SaturatedGreen: Story = { args: { seed: "#00ff00" } };
export const SaturatedCyan: Story = { args: { seed: "#00ffff" } };
export const DarkSurface: Story = { args: { surface: "#252a31" }, globals: { theme: "dark" } };

// -- Preview ------------------------------------------------------------------

function ConsumerColorPreview({ seed, surface, mode }: ConsumerColorArgs & { mode: "light" | "dark" }) {
    const [isSelected, setIsSelected] = useState(false);
    const handleSelection = useCallback(() => setIsSelected(selected => !selected), []);
    const colors = generateConsumerColors(seed, { mode, surface });
    if (colors.status !== "generated") {
        return (
            <Callout intent="danger" title="Choose a supported color">
                {colors.reason}
            </Callout>
        );
    }
    const { solid, audit, ramp, template } = colors;
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
                <H4>Shared template, exact rest</H4>
                <p>
                    Change seed and surface in Controls; use the theme toolbar for light/dark behavior. Hover the
                    button, then click to toggle selected. The exact input stays at rest.
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
                        {mode === "dark" ? "Dark" : "Light"} mode · Hover {audit.directions.hover}, selected{" "}
                        {audit.directions.selected} than rest. Label: {solid.foreground.toUpperCase()}.
                    </span>
                </Flex>
                {audit.directionException && (
                    <div>
                        Direction exception: the preferred pattern could not meet the palette and readability checks
                        with one unchanged label color.
                    </div>
                )}
                {!audit.usesAdjacentStates && (
                    <div>
                        State spacing exception: adjacent shades did not pass after refining the ramp, so this example
                        skips entries in the palette.
                    </div>
                )}
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
                    The template gives every position a lightness target and a chroma profile. Your input replaces one
                    shade, with the correction fading toward the endpoints. Pale-background limits still apply. Rest,
                    hover, and selected all use the completed palette.
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
                <summary>Template and final ramp</summary>
                <p>
                    The template is the starting point, before fitting rest or checking states. Its target lightness is
                    shared across hues; final shades can move. Color difference measures the change from the previous
                    final shade. Smaller means a subtler change, not a lower contrast requirement.
                </p>
                <div style={{ overflowX: "auto" }}>
                    <HTMLTable compact={true}>
                        <thead>
                            <tr>
                                <th>Stop</th>
                                <th>Target L</th>
                                <th>Template</th>
                                <th>Final</th>
                                <th>Color difference</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ramp.map((stop, index) => (
                                <tr key={stop.stop}>
                                    <td>
                                        {stop.stop}
                                        {stop.isAnchor ? " · Rest" : ""}
                                    </td>
                                    <td>{consumerColorPolicy.templateLightness[index]}</td>
                                    {[template[index].color, stop.color].map((color, column) => (
                                        <td key={column}>
                                            <div
                                                style={{
                                                    background: color,
                                                    color:
                                                        wcagContrast(color, "#ffffff") >= 4.5 ? "#ffffff" : "#000000",
                                                    padding: 12,
                                                }}
                                            >
                                                {color.toUpperCase()}
                                            </div>
                                        </td>
                                    ))}
                                    <td>{index === 0 ? "—" : audit.rampDistances[index - 1].toFixed(3)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </HTMLTable>
                </div>
                <p>
                    Largest final gap: {Math.max(...audit.rampDistances).toFixed(3)}. Template deviation:{" "}
                    {audit.templateDeviation.toFixed(3)}. Spacing deviation: {audit.spacingError.toFixed(3)}. Lower
                    deviations mean closer to the template; they are design measurements, not accessibility scores.
                </p>
            </details>
            <details>
                <summary>Compare with Greg and Ryan</summary>
                <p>
                    Same starting colors, shown beside the final HEX examples in their PDFs. Distance combines
                    lightness, chroma, and hue; smaller means a gentler step. These examples guide spacing, without
                    copying a whole palette or dark-mode mapping. The two numbers mean rest → hover and hover →
                    selected. Ryan's selected HEX is not quoted here.
                </p>
                <div style={{ overflowX: "auto" }}>
                    <HTMLTable compact={true}>
                        <thead>
                            <tr>
                                <th>Example</th>
                                <th>Rest</th>
                                <th>Hover</th>
                                <th>Selected / active</th>
                                <th>State color differences</th>
                            </tr>
                        </thead>
                        <tbody>
                            {referenceRows.map(row => (
                                <tr key={row.name}>
                                    <td>{row.name}</td>
                                    {(["rest", "hover", "selected"] as const).map(state => {
                                        const color = row[state];
                                        return (
                                            <td key={state}>
                                                {color === undefined ? (
                                                    "—"
                                                ) : (
                                                    <div
                                                        style={{
                                                            background: color,
                                                            color:
                                                                wcagContrast(color, "#ffffff") >= 4.5
                                                                    ? "#ffffff"
                                                                    : "#000000",
                                                            padding: 12,
                                                        }}
                                                    >
                                                        {color.toUpperCase()}
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                    <td>{row.distances}</td>
                                </tr>
                            ))}
                        </tbody>
                    </HTMLTable>
                </div>
            </details>
            <details>
                <summary>Calculation and checks</summary>
                <p>
                    Input OKLCH: L {colors.seed.l.toFixed(5)}, C {colors.seed.c.toFixed(5)}, H{" "}
                    {colors.seed.c < 1e-7 ? "neutral" : `${colors.seed.h?.toFixed(2)}°`}.
                </p>
                <p>
                    Build a shared template with L targets 0.98, 0.94, 0.86, 0.76, 0.66, 0.56, 0.46, 0.35, 0.23, and
                    0.12. Chroma follows the shared profile multiplied by the input's chroma; hue comes from the input.
                    Try the nearest template color that accepts the input's chroma and background role.
                </p>
                <p>
                    Lock rest exactly. For each other shade: L = sampled template L + (input L − template anchor L) × w,
                    and C = sampled template C + (input C − template anchor C) × w. Influence w = (1 − t)^p is 1 at rest
                    and 0 at an endpoint. Higher p keeps the correction more local; limit its slope when a large move
                    would reverse the ramp. Apply pale-background limits, preserve hue, then reduce chroma to fit sRGB.
                </p>
                <p>
                    Light mode prefers darker hover and selected, reversing for very dark inputs (L ≤ 0.30). Dark mode
                    prefers hover lighter than rest and selected darker than rest. Try adjacent shades across the
                    supported ramp refinements before allowing skips. Try a direction exception only when the preferred
                    pattern cannot pass. Direction and adjacency take priority over the numeric score.
                </p>
                <p>
                    Within each priority, score template deviation + spacing deviation + twice the state-distance error.
                    Opposite directions measure both changes from rest; same-direction states measure selected from
                    hover. Endpoint attempt: {audit.endpointRange + 1}. Density: {audit.paletteSpacingBias}. Locality:{" "}
                    {audit.anchorLocality}. White, black, and gray inputs stay neutral. Very light or dark inputs may
                    require wider endpoints for readable text.
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
                                <td>{audit.selectedReference === "rest" ? "Rest → selected" : "Hover → selected"}</td>
                                <td>
                                    {(audit.selectedReference === "rest"
                                        ? audit.stateContrast.restToSelected
                                        : audit.stateContrast.hoverToSelected
                                    ).toFixed(3)}
                                    :1
                                </td>
                                <td>
                                    {(audit.selectedReference === "rest"
                                        ? audit.stateDistance.restToSelected
                                        : audit.stateDistance.hoverToSelected
                                    ).toFixed(5)}
                                </td>
                            </tr>
                        </tbody>
                    </HTMLTable>
                </div>
                <p>
                    Every label must meet 4.5:1. Each measured step above stays between{" "}
                    {consumerColorPolicy.stateContrast.min}:1 and {consumerColorPolicy.stateContrast.max}:1 fill
                    contrast, with OKLab distance of at least {consumerColorPolicy.stateDistance.min} and normally at
                    most {consumerColorPolicy.stateDistance.max}. Near black, a stronger target and wider allowance make
                    states easier to see; nearby palette shades can spread apart. Text readability still takes priority.
                    State thresholds are design choices, not WCAG rules. Ten shades covering pale tints, soft states,
                    and dark text require uneven spacing.
                </p>
            </details>
        </Flex>
    );
}
