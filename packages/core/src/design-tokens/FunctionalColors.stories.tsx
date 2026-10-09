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
                          .filter(([step]) => /^\d+$/.test(step))
                          .toSorted(([left], [right]) => Number(left) - Number(right))
                          .flatMap(([step, token]) =>
                              typeof token === "string"
                                  ? []
                                  : [
                                        {
                                            step,
                                            name: `color.${name}.${step}`,
                                            value: `var(--bp-color-${name}-${step})`,
                                            description: token.$description,
                                            contrast:
                                                "contrast" in scale && Number(step) >= 9 && Number(step) <= 11
                                                    ? `var(--bp-color-${name}-contrast${Number(step) === 9 ? "" : Number(step) === 10 ? "-hover" : "-active"})`
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
                                <strong>Dark-theme values.</strong> Thirteen usage roles for every color family. Grey3–5
                                provide the default Button surface; intent9–11 provide solid states.
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
                                        // CSS references reflect the active theme and any Storybook accent override.
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
        const theme = globals.theme === "dark" ? "dark" : "light";
        const scales = COLOR_SCALES[theme];
        await expect(canvas.getAllByRole("heading", { level: 2 })).toHaveLength(15);
        await expect(canvas.getAllByRole("listitem")).toHaveLength(195);
        await expect(canvas.getByText(theme === "dark" ? "Dark-theme values." : "Light-theme values.")).toBeVisible();

        const legend = within(canvas.getByRole("group", { name: "Scale usage" }));
        for (const range of USAGE_RANGES) {
            await expect(legend.getByText(range.steps)).toBeVisible();
            await expect(legend.getByText(range.label)).toBeVisible();
        }

        for (const scale of scales) {
            const items = within(canvas.getByRole("list", { name: `${scale.label} color scale` })).getAllByRole(
                "listitem",
            );
            await expect(items).toHaveLength(13);
            for (const [index, token] of scale.steps.entries()) {
                const item = items[index];
                await expect(within(item).getByText(token.name)).toBeVisible();
                await expect(within(item).getByText(token.value)).toBeVisible();
                await expect(item.querySelector("div")?.style.backgroundColor).toBe(token.value);
                if (token.contrast !== undefined) {
                    const swatch = within(item).getByText("Aa", { exact: true });
                    await expect(swatch.style.color).toBe(token.contrast);
                }
            }
        }

        const orangeNotes = canvas.getByText("Orange usage notes");
        if (!orangeNotes.closest("details")?.open) {
            await userEvent.click(orangeNotes);
        }
        // The summary is rendered inside its family's usage details.
        const orangeUsage = within(orangeNotes.closest("details")!);
        const orange = scales.find(scale => scale.name === "orange");
        for (const token of orange?.steps.filter(({ step }) => Number(step) >= 11) ?? []) {
            const description = orangeUsage.getByText(token.name).closest("dt")?.nextElementSibling;
            await expect(description).toBeVisible();
            await expect(description).toHaveTextContent(token.description);
        }
    },
};
