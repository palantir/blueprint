/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { expect, userEvent, within } from "storybook/test";

import { H1, H2 } from "../components/html/html";

import palette from "./tokens/base/palette.tokens.json";
import darkPalette from "./tokens/themes/dark/palette.dark.tokens.json";

const getColorScales = (colors: typeof palette.color | typeof darkPalette.color) =>
    Object.entries(colors).flatMap(([name, scale]) =>
        name.startsWith("$") || typeof scale === "string" || "$value" in scale
            ? []
            : [
                  {
                      name,
                      label: name.charAt(0).toUpperCase() + name.slice(1),
                      steps: Object.entries(scale)
                          .filter(([step]) => !step.startsWith("$") && step !== "contrast")
                          .toSorted(([left], [right]) => Number(left) - Number(right))
                          .flatMap(([step, token]) =>
                              typeof token === "string"
                                  ? []
                                  : [
                                        {
                                            step,
                                            name: `color.${name}.${step}`,
                                            value: token.$value,
                                            description: token.$description,
                                            contrast:
                                                "contrast" in scale && Number(step) >= 9 && Number(step) <= 11
                                                    ? `var(--bp-color-${name}-contrast)`
                                                    : undefined,
                                        },
                                    ],
                          ),
                  },
              ],
    );

const COLOR_SCALES = {
    light: getColorScales(palette.color),
    dark: getColorScales(darkPalette.color),
};

const USAGE_RANGES = [
    { steps: "1–2", label: "Backgrounds", columns: 2 },
    { steps: "3–5", label: "Component states", columns: 3 },
    { steps: "6–8", label: "Borders", columns: 3 },
    { steps: "9–11", label: "Solid states", columns: 3 },
    { steps: "12–13", label: "Foregrounds", columns: 2 },
];

const STYLES = {
    page: {
        backgroundColor: palette.color.white.$value,
        color: palette.color.black.$value,
        minBlockSize: "100vh",
        padding: "clamp(16px, 3vw, 40px)",
    },
    content: {
        marginInline: "auto",
        maxInlineSize: 1440,
        minInlineSize: 0,
    },
    heading: {
        color: "inherit",
        fontSize: 28,
        fontWeight: 600,
        letterSpacing: "-0.025em",
        margin: 0,
    },
    introduction: {
        lineHeight: 1.6,
        marginBlock: "12px 24px",
        maxInlineSize: "72ch",
    },
    scroll: {
        overflowX: "auto",
    },
    scales: {
        minInlineSize: 960,
    },
    grid: {
        display: "grid",
        gap: 8,
        gridTemplateColumns: "repeat(13, minmax(0, 1fr))",
        listStyle: "none",
        margin: 0,
        padding: 0,
    },
    legend: {
        borderBlockEnd: `1px solid ${palette.palette["light-gray"]["2"].$value}`,
        fontSize: 12,
        paddingBlockEnd: 16,
    },
    range: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
    },
    scale: {
        borderBlockEnd: `1px solid ${palette.palette["light-gray"]["2"].$value}`,
        paddingBlock: 24,
    },
    scaleHeading: {
        color: "inherit",
        fontSize: 16,
        fontWeight: 600,
        marginBlock: "0 12px",
    },
    swatch: {
        aspectRatio: "4 / 3",
        borderRadius: 4,
        boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.06)",
        display: "grid",
        fontSize: "1.25em",
        fontWeight: 600,
        placeItems: "center",
    },
    token: {
        display: "block",
        fontFamily: "monospace",
        fontSize: 11,
        lineHeight: 1.5,
        marginBlockStart: 8,
        overflowWrap: "normal",
    },
    value: {
        display: "block",
        fontSize: 11,
        lineHeight: 1.5,
        marginBlockStart: 4,
        overflowWrap: "normal",
    },
    notes: {
        fontSize: 12,
        lineHeight: 1.6,
        marginBlockStart: 16,
    },
    summary: {
        cursor: "pointer",
        inlineSize: "fit-content",
    },
    descriptions: {
        display: "grid",
        gap: "8px 16px",
        gridTemplateColumns: "max-content minmax(0, 1fr)",
        marginBlock: "12px 0",
    },
    description: {
        margin: 0,
    },
    descriptionEntry: {
        display: "contents",
    },
    descriptionToken: {
        fontFamily: "monospace",
    },
} satisfies Record<string, CSSProperties>;

const PAGE_STYLES = {
    light: STYLES.page,
    dark: {
        ...STYLES.page,
        backgroundColor: palette.color.black.$value,
        color: palette.palette["light-gray"]["5"].$value,
    },
};

function FunctionalColors({ theme = "light" }: { theme?: keyof typeof COLOR_SCALES }) {
    const borderBlockEndColor =
        theme === "dark" ? palette.palette["dark-gray"]["3"].$value : palette.palette["light-gray"]["2"].$value;
    return (
        <main style={PAGE_STYLES[theme]}>
            <div style={STYLES.content}>
                <header>
                    <H1 style={STYLES.heading}>Functional colors</H1>
                    <p style={STYLES.introduction}>
                        {theme === "dark" ? (
                            <>
                                <strong>Dark-theme values.</strong> Button rest, hover, and active backgrounds: grey3–5
                                and intent9–11. Other dark steps and families are not mapped yet.
                            </>
                        ) : (
                            <>
                                <strong>Light-theme values.</strong> Thirteen steps organized by usage, not lightness.
                                Some steps share a color to preserve existing component treatments. Translucent colors
                                are shown on white.
                            </>
                        )}
                    </p>
                </header>
                {/* Keyboard users need to focus the scroll region to reach every column on narrow screens. */}
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
                <div aria-label="Functional color scales" role="region" style={STYLES.scroll} tabIndex={0}>
                    <div style={STYLES.scales}>
                        <div
                            aria-label="Scale usage"
                            role="group"
                            style={{ ...STYLES.grid, ...STYLES.legend, borderBlockEndColor }}
                        >
                            {USAGE_RANGES.map(range => (
                                <div key={range.steps} style={{ ...STYLES.range, gridColumn: `span ${range.columns}` }}>
                                    <strong>{range.steps}</strong>
                                    <span>{range.label}</span>
                                </div>
                            ))}
                        </div>
                        {COLOR_SCALES[theme].map(scale => (
                            <section
                                aria-labelledby={`scale-${scale.name}`}
                                key={scale.name}
                                style={{ ...STYLES.scale, borderBlockEndColor }}
                            >
                                <H2 id={`scale-${scale.name}`} style={STYLES.scaleHeading}>
                                    {scale.label}
                                </H2>
                                <ol aria-label={`${scale.label} color scale`} style={STYLES.grid}>
                                    {scale.steps.map(token => (
                                        // Dark mappings are sparse; each token stays under its numbered usage column.
                                        <li key={token.name} style={{ gridColumn: token.step }}>
                                            <div
                                                aria-hidden="true"
                                                style={{
                                                    ...STYLES.swatch,
                                                    backgroundColor: token.value,
                                                    color: token.contrast,
                                                }}
                                            >
                                                {token.contrast != null ? "Aa" : null}
                                            </div>
                                            <span style={STYLES.token}>
                                                color.
                                                <wbr />
                                                {scale.name}.<wbr />
                                                {token.step}
                                            </span>
                                            <samp style={STYLES.value}>{renderColorValue(token.value)}</samp>
                                        </li>
                                    ))}
                                </ol>
                                <details style={STYLES.notes}>
                                    <summary style={STYLES.summary}>{scale.label} usage notes</summary>
                                    <dl style={STYLES.descriptions}>
                                        {scale.steps.map(token => (
                                            <div key={token.name} style={STYLES.descriptionEntry}>
                                                <dt>
                                                    <span style={STYLES.descriptionToken}>{token.name}</span>
                                                </dt>
                                                <dd style={STYLES.description}>{token.description}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </details>
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

function renderColorValue(value: string) {
    const parenthesis = value.indexOf("(");
    if (parenthesis === -1) {
        return value;
    }
    return (
        <>
            {value.slice(0, parenthesis + 1)}
            <wbr />
            {value.slice(parenthesis + 1)}
        </>
    );
}

const meta = {
    title: "Design Tokens/Functional Colors",
    component: FunctionalColors,
    render: (_args, { globals }) => <FunctionalColors theme={globals.theme === "dark" ? "dark" : "light"} />,
    parameters: {
        layout: "fullscreen",
        actions: { disable: true },
        controls: { disable: true },
    },
} satisfies Meta<typeof FunctionalColors>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvasElement, globals }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getAllByText("Aa", { exact: true })).toHaveLength(12);
        for (const family of ["blue", "green", "orange", "red"]) {
            const label = family.charAt(0).toUpperCase() + family.slice(1);
            const items = within(canvas.getByRole("list", { name: `${label} color scale` })).getAllByRole("listitem");
            const foreground = family === "orange" ? palette.palette.black.$value : palette.palette.white.$value;
            for (let state = 0; state < 3; state++) {
                const item = items[globals.theme === "dark" ? state : state + 8];
                await expect(within(item).getByText("Aa", { exact: true })).toHaveStyle({ color: foreground });
            }
        }

        if (globals.theme === "dark") {
            await expect(canvas.getAllByRole("heading", { level: 2 })).toHaveLength(5);
            await expect(canvas.getAllByRole("listitem")).toHaveLength(15);
            await expect(canvas.getByText("Dark-theme values.")).toBeVisible();
            await expect(canvas.getByText(/Other dark steps and families are not mapped yet/)).toBeVisible();

            for (const family of ["grey", "blue", "green", "orange", "red"] as const) {
                const label = family.charAt(0).toUpperCase() + family.slice(1);
                const items = within(canvas.getByRole("list", { name: `${label} color scale` })).getAllByRole(
                    "listitem",
                );
                await expect(items).toHaveLength(3);
                for (const [index, [step, token]] of Object.entries(darkPalette.color[family])
                    .filter(([s]) => s !== "contrast")
                    .entries()) {
                    await expect(within(items[index]).getByText(`color.${family}.${step}`)).toBeVisible();
                    await expect(within(items[index]).getByText(token.$value)).toBeVisible();
                    await expect(items[index]).toHaveStyle({ gridColumn: step });
                }
            }

            const darkOrangeNotes = canvas.getByText("Orange usage notes");
            if (!darkOrangeNotes.closest("details")?.open) {
                await userEvent.click(darkOrangeNotes);
            }
            await expect(canvas.getByText(darkPalette.color.orange["11"].$description)).toBeVisible();
            return;
        }

        await expect(canvas.getAllByRole("heading", { level: 2 })).toHaveLength(15);
        await expect(canvas.getAllByRole("listitem")).toHaveLength(195);
        await expect(canvas.getByText("Light-theme values.")).toBeVisible();

        const legend = within(canvas.getByRole("group", { name: "Scale usage" }));
        for (const [range, usage] of [
            ["1–2", "Backgrounds"],
            ["3–5", "Component states"],
            ["6–8", "Borders"],
            ["9–11", "Solid states"],
            ["12–13", "Foregrounds"],
        ]) {
            await expect(legend.getByText(range)).toBeVisible();
            await expect(legend.getByText(usage)).toBeVisible();
        }

        for (const scale of COLOR_SCALES.light) {
            const items = within(canvas.getByRole("list", { name: `${scale.label} color scale` })).getAllByRole(
                "listitem",
            );
            await expect(items).toHaveLength(13);
            await expect(items.map(item => within(item).getByText(/^color\.\w+\.\d+$/).textContent)).toEqual(
                Array.from({ length: 13 }, (_, index) => `color.${scale.name}.${index + 1}`),
            );
        }

        const grey = within(canvas.getByRole("list", { name: "Grey color scale" }));
        await expect(grey.getByText("color.grey.1")).toBeVisible();
        await expect(grey.getByText(palette.color.grey["1"].$value)).toBeVisible();
        await expect(grey.getByText(palette.color.grey["2"].$value)).toBeVisible();
        await expect(
            within(grey.getAllByRole("listitem")[10]).getByText(palette.palette["dark-gray"]["4"].$value),
        ).toBeVisible();

        const blue = within(canvas.getByRole("list", { name: "Blue color scale" }));
        await expect(blue.getByText("color.blue.9")).toBeVisible();
        await expect(blue.getByText(palette.color.blue["9"].$value)).toBeVisible();
        await expect(
            within(blue.getAllByRole("listitem")[10]).getByText(palette.palette.blue["1"].$value),
        ).toBeVisible();

        const orange = within(canvas.getByRole("list", { name: "Orange color scale" }));
        await expect(
            within(orange.getAllByRole("listitem")[8]).getByText(palette.palette.orange["5"].$value),
        ).toBeVisible();
        await expect(palette.color.orange["11"].$value).not.toBe(palette.palette.orange["3"].$value);
        await expect(
            within(orange.getAllByRole("listitem")[10]).getByText(palette.color.orange["11"].$value),
        ).toBeVisible();
        await expect(
            within(orange.getAllByRole("listitem")[11]).getByText(palette.palette.orange["2"].$value),
        ).toBeVisible();
        await expect(
            within(orange.getAllByRole("listitem")[12]).getByText(palette.palette.orange["1"].$value),
        ).toBeVisible();
        const orangeNotes = canvas.getByText("Orange usage notes");
        if (!orangeNotes.closest("details")?.open) {
            await userEvent.click(orangeNotes);
        }
        await expect(canvas.getByText(palette.color.orange["11"].$description)).toBeVisible();
        await expect(palette.color.orange["11"].$description).toMatch(/active/i);
        for (const step of ["12", "13"] as const) {
            await expect(canvas.getByText(palette.color.orange[step].$description)).toBeVisible();
            await expect(palette.color.orange[step].$description).toMatch(/foreground/i);
        }

        const sepia = within(canvas.getByRole("list", { name: "Sepia color scale" }));
        await expect(sepia.getByText("color.sepia.13")).toBeVisible();
        await expect(
            within(sepia.getAllByRole("listitem")[12]).getByText(palette.color.sepia["13"].$value),
        ).toBeVisible();
    },
};
