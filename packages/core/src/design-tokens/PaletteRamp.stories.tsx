/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryContext, StoryObj } from "@storybook/react-vite";
import { useEffect, useMemo, useState } from "react";

import { Colors } from "@blueprintjs/colors";
import { Flex } from "@blueprintjs/labs";

import { Classes, Intent } from "../common";
import { Callout } from "../components/callout/callout";
import { Code, H4, H5 } from "../components/html/html";
import { HTMLTable } from "../components/html-table/htmlTable";

import {
    contrastRatio,
    DEFAULT_RAMP_CONFIG,
    formatOklch,
    generatePaletteRamps,
    GRAY_FAMILIES,
    GRAY_RAMP_FAMILY,
    LEGACY_SHADES,
    type LegacyColor,
    legacyPaletteFromConstants,
    type PaletteRamp,
    type PaletteRampConfig,
    RAMP_STEPS,
    type RampStep,
    type RampSwatch,
    targetLightness,
} from "./paletteRamp";

// -----------------------------------------------------------------------------
// Data

const LEGACY_PALETTE = legacyPaletteFromConstants(Colors);

const DEFAULT_RAMPS = generatePaletteRamps(LEGACY_PALETTE);

/** Smallest lightness difference between adjacent steps that reads as a distinct step. */
const MIN_STEP_LIGHTNESS_DIFFERENCE = 0.02;

const rampTokenName = (family: string, step: RampStep) => `--bp-palette-${family}-${step}`;

const legacyTokenName = ({ family, shade }: LegacyColor) => `--bp-palette-${family}-${shade}`;

const legacyLabel = ({ family, shade }: LegacyColor) => `${family}${shade}`;

/** White or black text, whichever contrasts more with the swatch. */
const inkFor = (hex: string) =>
    contrastRatio(hex, Colors.WHITE) >= contrastRatio(hex, Colors.BLACK) ? Colors.WHITE : Colors.BLACK;

const swatchAt = (ramp: PaletteRamp, step: RampStep) => ramp.swatches.find(swatch => swatch.step === step);

/** The swatch whose color represents the family in charts (its 500 step). */
const seriesColor = (ramp: PaletteRamp) => swatchAt(ramp, 500)?.hex ?? ramp.swatches[0].hex;

// -----------------------------------------------------------------------------
// Layout constants

const SWATCH_WIDTH = 84;
const SWATCH_HEIGHT = 52;
const ROW_LABEL_WIDTH = 88;

const MONO: React.CSSProperties = { fontFamily: "var(--bp-typography-family-mono, monospace)", fontSize: 11 };

const MUTED: React.CSSProperties = { color: "var(--bp-typography-color-muted)" };

const SWATCH_BASE: React.CSSProperties = {
    borderRadius: 4,
    boxShadow: "inset 0 0 0 1px var(--bp-surface-border-color-default)",
    display: "flex",
    flexDirection: "column",
    fontSize: 12,
    height: SWATCH_HEIGHT,
    justifyContent: "space-between",
    padding: "4px 6px",
    whiteSpace: "nowrap",
    width: SWATCH_WIDTH,
};

const EMPTY_CELL: React.CSSProperties = {
    ...SWATCH_BASE,
    ...MUTED,
    alignItems: "center",
    border: "1px dashed var(--bp-surface-border-color-default)",
    boxShadow: "none",
    justifyContent: "center",
};

// -----------------------------------------------------------------------------
// Swatches & ramp grid

interface SwatchProps {
    /** CSS background. Pass a token `var()` to show what ships in blueprint.css. */
    background: string;
    /** Hex the generator expects at this position; also picks the label ink. */
    hex: string;
    title: string;
    badge?: string;
}

function Swatch({ background, badge, hex, title }: SwatchProps) {
    return (
        <div style={{ ...SWATCH_BASE, background, color: inkFor(hex) }} title={title}>
            <Flex justifyContent="space-between" gap={1}>
                <strong>{title}</strong>
                {badge !== undefined && <span style={{ fontSize: 11, opacity: 0.85 }}>{badge}</span>}
            </Flex>
            <span style={MONO}>{hex}</span>
        </div>
    );
}

function RowLabel({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ alignSelf: "center", width: ROW_LABEL_WIDTH }} className={Classes.TEXT_OVERFLOW_ELLIPSIS}>
            {children}
        </div>
    );
}

function StepHeader() {
    return (
        <Flex gap={1} style={MUTED}>
            <div style={{ width: ROW_LABEL_WIDTH }} />
            {RAMP_STEPS.map(step => (
                <div key={step} style={{ textAlign: "center", width: SWATCH_WIDTH }}>
                    {step}
                </div>
            ))}
        </Flex>
    );
}

interface RampRowsProps {
    ramp: PaletteRamp;
    /** Render swatches from the shipped CSS tokens (`var(--bp-palette-*)`) rather than generator hex. */
    useTokens: boolean;
}

/** The new ramp, with the BP6 colors it reuses aligned underneath their steps. */
function RampRows({ ramp, useTokens }: RampRowsProps) {
    return (
        <Flex flexDirection="column" gap={1}>
            <Flex gap={1}>
                <RowLabel>
                    <strong>{ramp.family}</strong>
                </RowLabel>
                {ramp.swatches.map(swatch => (
                    <Swatch
                        key={swatch.step}
                        background={useTokens ? `var(${rampTokenName(ramp.family, swatch.step)})` : swatch.hex}
                        badge={swatch.source === undefined ? undefined : "BP6"}
                        hex={swatch.hex}
                        title={String(swatch.step)}
                    />
                ))}
            </Flex>
            <Flex gap={1}>
                <RowLabel>
                    <span style={MUTED}>BP6</span>
                </RowLabel>
                {ramp.swatches.map(swatch =>
                    swatch.source === undefined ? (
                        <div key={swatch.step} style={EMPTY_CELL}>
                            new
                        </div>
                    ) : (
                        <Swatch
                            key={swatch.step}
                            background={useTokens ? `var(${legacyTokenName(swatch.source)})` : swatch.source.hex}
                            hex={swatch.source.hex}
                            title={legacyLabel(swatch.source)}
                        />
                    ),
                )}
            </Flex>
        </Flex>
    );
}

function RampGrid({ ramps, useTokens }: { ramps: readonly PaletteRamp[]; useTokens: boolean }) {
    return (
        <Flex flexDirection="column" gap={4}>
            <StepHeader />
            {ramps.map(ramp => (
                <RampRows key={ramp.family} ramp={ramp} useTokens={useTokens} />
            ))}
        </Flex>
    );
}

/**
 * Compares the ramp tokens in the loaded blueprint.css against the generator, so a stale
 * build (or a token-panel override) is called out instead of silently shown.
 */
function useMismatchedTokens(ramps: readonly PaletteRamp[]) {
    const [mismatched, setMismatched] = useState<string[]>([]);
    useEffect(() => {
        const rootStyle = getComputedStyle(document.documentElement);
        setMismatched(
            ramps.flatMap(ramp =>
                ramp.swatches
                    .map(swatch => ({ name: rampTokenName(ramp.family, swatch.step), swatch }))
                    .filter(({ name, swatch }) => rootStyle.getPropertyValue(name).trim().toLowerCase() !== swatch.hex)
                    .map(({ name }) => name),
            ),
        );
    }, [ramps]);
    return mismatched;
}

function StaleTokensCallout({ ramps }: { ramps: readonly PaletteRamp[] }) {
    const mismatched = useMismatchedTokens(ramps);
    if (mismatched.length === 0) {
        return null;
    }
    return (
        <Callout intent={Intent.WARNING} title="blueprint.css doesn't match the generator">
            {mismatched.length} ramp tokens are missing or differ (first: <Code>{mismatched[0]}</Code>). Rebuild the CSS
            with <Code>pnpm compile</Code> in <Code>packages/core</Code>, or regenerate the tokens with{" "}
            <Code>pnpm build:palette-ramp</Code>.
        </Callout>
    );
}

function Intro({ children }: { children: React.ReactNode }) {
    return <p style={{ maxWidth: 760 }}>{children}</p>;
}

// -----------------------------------------------------------------------------
// Grays

/** The ramp step closest in lightness to a BP6 color. */
const nearestSwatch = (ramp: PaletteRamp, color: LegacyColor): RampSwatch =>
    ramp.swatches.reduce((best, swatch) =>
        Math.abs(swatch.oklch.l - color.oklch.l) < Math.abs(best.oklch.l - color.oklch.l) ? swatch : best,
    );

/** Every BP6 gray in lightness order, with the ramp step it became (or the closest one). */
function LegacyGrayTable({ ramp }: { ramp: PaletteRamp }) {
    return (
        <HTMLTable compact={true} striped={true}>
            <thead>
                <tr>
                    <th>BP6 gray</th>
                    <th>OKLCH</th>
                    <th>New token</th>
                </tr>
            </thead>
            <tbody>
                {ramp.legacy.map(color => {
                    const nearest = nearestSwatch(ramp, color);
                    return (
                        <tr key={legacyLabel(color)}>
                            <td>
                                <Flex alignItems="center" gap={2}>
                                    <span
                                        style={{
                                            ...SWATCH_BASE,
                                            background: `var(${legacyTokenName(color)})`,
                                            height: 20,
                                            padding: 0,
                                            width: 32,
                                        }}
                                    />
                                    <Code>${legacyLabel(color)}</Code>
                                    <span style={{ ...MONO, ...MUTED }}>{color.hex}</span>
                                </Flex>
                            </td>
                            <td style={MONO}>{formatOklch(color.oklch)}</td>
                            <td>
                                {color.step === undefined ? (
                                    <span style={MUTED}>
                                        Not in the ramp · nearest{" "}
                                        <Code>{rampTokenName(ramp.family, nearest.step)}</Code> (ΔL{" "}
                                        {Math.abs(nearest.oklch.l - color.oklch.l).toFixed(3)})
                                    </span>
                                ) : (
                                    <Code>{rampTokenName(ramp.family, color.step)}</Code>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </HTMLTable>
    );
}

// -----------------------------------------------------------------------------
// Lightness chart (small multiples: one family per chart)

const CHART_WIDTH = 232;
const CHART_HEIGHT = 140;
const CHART_MARGIN = { bottom: 20, left: 30, right: 10, top: 8 };
const LIGHTNESS_DOMAIN: readonly [number, number] = [0.2, 1];
const LIGHTNESS_TICKS = [0.25, 0.5, 0.75, 1];
const STEP_TICKS: readonly RampStep[] = [100, 300, 500, 700, 900];
const MARKER_RADIUS = 4;
/** Extra hover area on each side of the plot, so the first and last steps are easy to reach. */
const HOVER_PADDING = 12;

const plotWidth = CHART_WIDTH - CHART_MARGIN.left - CHART_MARGIN.right;
const plotHeight = CHART_HEIGHT - CHART_MARGIN.top - CHART_MARGIN.bottom;

const xForStep = (step: number) =>
    CHART_MARGIN.left + ((step - RAMP_STEPS[0]) / (RAMP_STEPS[RAMP_STEPS.length - 1] - RAMP_STEPS[0])) * plotWidth;

const yForLightness = (l: number) =>
    CHART_MARGIN.top + (1 - (l - LIGHTNESS_DOMAIN[0]) / (LIGHTNESS_DOMAIN[1] - LIGHTNESS_DOMAIN[0])) * plotHeight;

const nearestStep = (x: number): RampStep =>
    RAMP_STEPS.reduce((best, step) => (Math.abs(xForStep(step) - x) < Math.abs(xForStep(best) - x) ? step : best));

interface LightnessChartProps {
    ramp: PaletteRamp;
    config: PaletteRampConfig;
    /** Page background, used for the ring around markers. */
    surface: string;
}

function LightnessChart({ config, ramp, surface }: LightnessChartProps) {
    const [hoveredStep, setHoveredStep] = useState<RampStep | undefined>(undefined);
    const color = seriesColor(ramp);
    const hovered = hoveredStep === undefined ? undefined : swatchAt(ramp, hoveredStep);
    const path = ramp.swatches
        .map((swatch, i) => `${i === 0 ? "M" : "L"}${xForStep(swatch.step)},${yForLightness(swatch.oklch.l)}`)
        .join(" ");

    const handlePointerMove = (event: React.PointerEvent<SVGRectElement>) => {
        const bounds = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
        if (bounds !== undefined) {
            setHoveredStep(nearestStep(event.clientX - bounds.left));
        }
    };
    const handlePointerLeave = () => setHoveredStep(undefined);

    return (
        <Flex flexDirection="column" gap={1}>
            <H5 style={{ margin: 0 }}>{ramp.family}</H5>
            <div style={{ ...MONO, ...MUTED, minHeight: 16 }}>
                {hovered === undefined
                    ? `${ramp.swatches.filter(swatch => swatch.source !== undefined).length} BP6 colors · hover for values`
                    : `${hovered.step} · ${hovered.hex} · L ${hovered.oklch.l.toFixed(3)} · ${
                          hovered.source === undefined ? "generated" : legacyLabel(hovered.source)
                      }`}
            </div>
            <svg
                width={CHART_WIDTH}
                height={CHART_HEIGHT}
                role="img"
                aria-label={`OKLCH lightness of the ${ramp.family} ramp from step 100 to 900`}
            >
                {LIGHTNESS_TICKS.map(tick => (
                    <g key={tick}>
                        <line
                            x1={CHART_MARGIN.left}
                            x2={CHART_WIDTH - CHART_MARGIN.right}
                            y1={yForLightness(tick)}
                            y2={yForLightness(tick)}
                            stroke="var(--bp-surface-border-color-default)"
                            strokeWidth={1}
                        />
                        <text
                            x={CHART_MARGIN.left - 4}
                            y={yForLightness(tick)}
                            dominantBaseline="middle"
                            textAnchor="end"
                            fill="var(--bp-typography-color-muted)"
                            fontSize={10}
                        >
                            {tick.toFixed(2)}
                        </text>
                    </g>
                ))}
                {STEP_TICKS.map(step => (
                    <text
                        key={step}
                        x={xForStep(step)}
                        y={CHART_HEIGHT - 4}
                        textAnchor="middle"
                        fill="var(--bp-typography-color-muted)"
                        fontSize={10}
                    >
                        {step}
                    </text>
                ))}
                <line
                    x1={xForStep(RAMP_STEPS[0])}
                    x2={xForStep(RAMP_STEPS[RAMP_STEPS.length - 1])}
                    y1={yForLightness(targetLightness(RAMP_STEPS[0], config))}
                    y2={yForLightness(targetLightness(RAMP_STEPS[RAMP_STEPS.length - 1], config))}
                    stroke="var(--bp-typography-color-muted)"
                    strokeOpacity={0.6}
                    strokeWidth={1}
                />
                {hovered !== undefined && (
                    <line
                        x1={xForStep(hovered.step)}
                        x2={xForStep(hovered.step)}
                        y1={CHART_MARGIN.top}
                        y2={CHART_HEIGHT - CHART_MARGIN.bottom}
                        stroke="var(--bp-typography-color-muted)"
                        strokeWidth={1}
                    />
                )}
                <path
                    d={path}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {ramp.swatches.map(swatch => (
                    <circle
                        key={swatch.step}
                        cx={xForStep(swatch.step)}
                        cy={yForLightness(swatch.oklch.l)}
                        r={swatch.step === hoveredStep ? MARKER_RADIUS + 1 : MARKER_RADIUS}
                        fill={swatch.source === undefined ? surface : color}
                        stroke={swatch.source === undefined ? color : surface}
                        strokeWidth={2}
                    />
                ))}
                <rect
                    x={CHART_MARGIN.left - HOVER_PADDING}
                    y={0}
                    width={plotWidth + HOVER_PADDING * 2}
                    height={CHART_HEIGHT}
                    fill="transparent"
                    onPointerMove={handlePointerMove}
                    onPointerLeave={handlePointerLeave}
                />
            </svg>
        </Flex>
    );
}

function ChartLegend({ surface }: { surface: string }) {
    const ink = "var(--bp-typography-color-muted)";
    return (
        <Flex gap={4} alignItems="center" style={MUTED}>
            <Flex gap={1} alignItems="center">
                <svg width={20} height={10} aria-hidden={true}>
                    <line x1={0} x2={20} y1={5} y2={5} stroke={ink} strokeWidth={2} strokeLinecap="round" />
                </svg>
                Ramp, in the family's 500 color
            </Flex>
            <Flex gap={1} alignItems="center">
                <svg width={20} height={10} aria-hidden={true}>
                    <line x1={0} x2={20} y1={5} y2={5} stroke={ink} strokeOpacity={0.6} strokeWidth={1} />
                </svg>
                Target lightness
            </Flex>
            <Flex gap={1} alignItems="center">
                <svg width={12} height={12} aria-hidden={true}>
                    <circle cx={6} cy={6} r={MARKER_RADIUS} fill={ink} stroke={surface} strokeWidth={2} />
                </svg>
                BP6 color
            </Flex>
            <Flex gap={1} alignItems="center">
                <svg width={12} height={12} aria-hidden={true}>
                    <circle cx={6} cy={6} r={MARKER_RADIUS} fill={surface} stroke={ink} strokeWidth={2} />
                </svg>
                Generated
            </Flex>
        </Flex>
    );
}

const surfaceFor = (context: StoryContext) => (context.globals.theme === "dark" ? Colors.BLACK : Colors.WHITE);

// -----------------------------------------------------------------------------
// Migration map

interface MigrationRow {
    /** BP6 family the row's colors come from, e.g. `"light-gray"`. */
    legacyFamily: string;
    ramp: PaletteRamp;
}

/** One row per BP6 family: where each of its shades landed in the new ramp. */
function MigrationTable({ rows, showGenerated }: { rows: readonly MigrationRow[]; showGenerated: boolean }) {
    const shades = [...LEGACY_SHADES].reverse();
    return (
        <HTMLTable compact={true} striped={true}>
            <thead>
                <tr>
                    <th>BP6 family</th>
                    {shades.map(shade => (
                        <th key={shade}>Shade {shade}</th>
                    ))}
                    {showGenerated && <th>Generated steps</th>}
                </tr>
            </thead>
            <tbody>
                {rows.map(({ legacyFamily, ramp }) => (
                    <tr key={legacyFamily}>
                        <td>
                            <strong>{legacyFamily}</strong>
                        </td>
                        {shades.map(shade => {
                            const color = ramp.legacy.find(c => c.family === legacyFamily && c.shade === shade);
                            return (
                                <td key={shade}>
                                    {color?.step === undefined ? (
                                        <span style={MUTED}>—</span>
                                    ) : (
                                        <Code>{`${ramp.family}-${color.step}`}</Code>
                                    )}
                                </td>
                            );
                        })}
                        {showGenerated && (
                            <td style={MUTED}>
                                {ramp.swatches
                                    .filter(swatch => swatch.source === undefined)
                                    .map(swatch => swatch.step)
                                    .join(", ")}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </HTMLTable>
    );
}

// -----------------------------------------------------------------------------
// Playground

/** Invariant violations for a generated ramp set, as human-readable messages. */
const findViolations = (ramps: readonly PaletteRamp[]) =>
    ramps.flatMap(ramp =>
        ramp.swatches.slice(1).flatMap((swatch, index) => {
            const lighter = ramp.swatches[index];
            const difference = lighter.oklch.l - swatch.oklch.l;
            return difference < MIN_STEP_LIGHTNESS_DIFFERENCE
                ? [`${ramp.family}-${lighter.step} → ${swatch.step}: ΔL ${difference.toFixed(3)}`]
                : [];
        }),
    );

function RampPlayground({ grayTolerance, lightnessBottom, lightnessTop, shadeTaper, tintTaper }: PaletteRampConfig) {
    const ramps = useMemo(
        () =>
            generatePaletteRamps(LEGACY_PALETTE, {
                grayTolerance,
                lightnessBottom,
                lightnessTop,
                shadeTaper,
                tintTaper,
            }),
        [grayTolerance, lightnessBottom, lightnessTop, shadeTaper, tintTaper],
    );
    const violations = findViolations(ramps);
    return (
        <Flex flexDirection="column" gap={4}>
            <Intro>
                Ramps generated live from the controls. Swatches use the generator's hex values, not blueprint.css. Copy
                settings you like into <Code>DEFAULT_RAMP_CONFIG</Code> in <Code>paletteRamp.ts</Code>, then run{" "}
                <Code>pnpm build:palette-ramp</Code>.
            </Intro>
            {violations.length > 0 && (
                <Callout intent={Intent.WARNING} title="Adjacent steps are too close in lightness">
                    {violations.join("; ")}
                </Callout>
            )}
            <RampGrid ramps={ramps} useTokens={false} />
        </Flex>
    );
}

// -----------------------------------------------------------------------------
// Storybook meta & stories

const meta = {
    title: "Theming/Palette Ramp",
    parameters: {
        layout: "padded",
        actions: { disable: true },
        controls: { disable: true },
        interactions: { disable: true },
    },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Every BP6 color family expanded to 100–900, with the BP6 colors each ramp reuses aligned
 * under their new steps. Swatches render the `--bp-palette-*` tokens from blueprint.css.
 */
export const Overview: Story = {
    render: () => (
        <Flex flexDirection="column" gap={4}>
            <Intro>
                Each BP6 color is reused verbatim at the step whose target lightness it matches best, so the same step
                looks about equally light in every family. The other steps (marked <em>new</em>) are generated in OKLCH.
                Step 100 is the lightest, the reverse of BP6, where 1 is the darkest.
            </Intro>
            <StaleTokensCallout ramps={DEFAULT_RAMPS} />
            <RampGrid ramps={DEFAULT_RAMPS} useTokens={true} />
        </Flex>
    ),
};

/**
 * The 15 BP6 grays fold into one even `gray` ramp. A BP6 gray is reused only where it sits within
 * one just-noticeable lightness difference of a step's target; the rest keep only their BP6 names.
 */
export const Grays: Story = {
    render: () => {
        const gray = DEFAULT_RAMPS.find(ramp => ramp.family === GRAY_RAMP_FAMILY);
        if (gray === undefined) {
            return <span />;
        }
        return (
            <Flex flexDirection="column" gap={4}>
                <Intro>
                    BP6 has three gray scales (light-gray, gray, dark-gray). The new <Code>gray</Code> ramp follows the
                    same lightness curve as the colors. It reuses a BP6 gray where one is within ΔL{" "}
                    {DEFAULT_RAMP_CONFIG.grayTolerance} of a step's target lightness, and generates the rest.
                </Intro>
                <StaleTokensCallout ramps={[gray]} />
                <Flex flexDirection="column" gap={4}>
                    <StepHeader />
                    <RampRows ramp={gray} useTokens={true} />
                </Flex>
                <H4>Every BP6 gray</H4>
                <LegacyGrayTable ramp={gray} />
            </Flex>
        );
    },
};

/**
 * OKLCH lightness of each ramp against the shared target curve. BP6 colors that sit off the curve
 * bend the generated steps around them, so every ramp stays smooth and ordered.
 */
export const LightnessCurve: Story = {
    name: "Lightness Curve",
    render: (_args, context) => {
        const surface = surfaceFor(context);
        return (
            <Flex flexDirection="column" gap={4}>
                <ChartLegend surface={surface} />
                <Flex flexWrap="wrap" gap={6}>
                    {DEFAULT_RAMPS.map(ramp => (
                        <LightnessChart key={ramp.family} config={DEFAULT_RAMP_CONFIG} ramp={ramp} surface={surface} />
                    ))}
                </Flex>
            </Flex>
        );
    },
};

/**
 * Where each BP6 color landed, for porting: `--bp-palette-{family}-{shade}` becomes
 * `--bp-palette-{family}-{step}`. The step for a given shade differs between families.
 */
export const MigrationMap: Story = {
    name: "Migration Map",
    render: () => {
        const chromaticRows = DEFAULT_RAMPS.filter(ramp => ramp.family !== GRAY_RAMP_FAMILY).map(ramp => ({
            legacyFamily: ramp.family,
            ramp,
        }));
        const gray = DEFAULT_RAMPS.find(ramp => ramp.family === GRAY_RAMP_FAMILY);
        const grayRows = gray === undefined ? [] : GRAY_FAMILIES.map(legacyFamily => ({ legacyFamily, ramp: gray }));
        const generatedGraySteps = gray?.swatches
            .filter(swatch => swatch.source === undefined)
            .map(swatch => swatch.step);
        return (
            <Flex flexDirection="column" gap={4}>
                <Intro>
                    Read across a row to port a family. For example, <Code>blue3</Code> becomes <Code>blue-500</Code>,
                    but <Code>gold3</Code> becomes <Code>gold-400</Code>.
                </Intro>
                <MigrationTable rows={chromaticRows} showGenerated={true} />
                <H4>Grays</H4>
                <Intro>
                    All three BP6 gray scales map into the single <Code>gray</Code> ramp. A dash means the BP6 gray has
                    no step of its own; the Grays story lists the nearest step for each. Generated gray steps:{" "}
                    {generatedGraySteps?.join(", ")}.
                </Intro>
                <MigrationTable rows={grayRows} showGenerated={false} />
            </Flex>
        );
    },
};

/**
 * Tune the generator live. Changes here don't touch blueprint.css; they show what the ramps
 * would look like with different settings.
 */
export const Playground: StoryObj<typeof RampPlayground> = {
    args: { ...DEFAULT_RAMP_CONFIG },
    argTypes: {
        lightnessTop: { control: { max: 0.99, min: 0.85, step: 0.005, type: "range" } },
        lightnessBottom: { control: { max: 0.4, min: 0.15, step: 0.005, type: "range" } },
        grayTolerance: { control: { max: 0.04, min: 0, step: 0.0025, type: "range" } },
        tintTaper: { control: { max: 1.5, min: 0, step: 0.05, type: "range" } },
        shadeTaper: { control: { max: 1.5, min: 0, step: 0.05, type: "range" } },
    },
    parameters: { controls: { disable: false } },
    render: args => <RampPlayground {...args} />,
};
