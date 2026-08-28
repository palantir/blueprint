/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";
import { expect, within } from "storybook/test";

import { Flex } from "@blueprintjs/labs";

import { H1, H2, H3, H4, H5, H6 } from "./html";

const headingLevels = [
    { Component: H1, label: "H1" },
    { Component: H2, label: "H2" },
    { Component: H3, label: "H3" },
    { Component: H4, label: "H4" },
    { Component: H5, label: "H5" },
    { Component: H6, label: "H6" },
] as const;

const renderHeadingTokenComparison = ({ className, label }: { className: string; label: string }) => (
    <section aria-label={label} className={className}>
        <StoryLabel title={label} />
        {headingLevels.map(({ Component, label: headingLabel }) => (
            <Component key={headingLabel}>{headingLabel}: Coronavirus (COVID-19) guidance</Component>
        ))}
    </section>
);

const meta = {
    title: "Core/HTML elements",
    component: H1,
    decorators: [storybookLayoutDecorator],
} satisfies Meta<typeof H1>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Compares Blueprint headings using the BP6 baseline, BP7 defaults, and NHS Digital public-token overrides. */
export const TokenCompatibility: Story = {
    name: "BP6 baseline → BP7 defaults → NHS public-token theme",
    parameters: {
        layout: "padded",
    },
    render: () => (
        <Flex alignItems="flex-start" flexWrap="wrap" gap={6}>
            {renderHeadingTokenComparison({
                label: "BP6 baseline",
                className: "token-compatibility-heading-column token-compatibility-baseline",
            })}
            {renderHeadingTokenComparison({
                label: "BP7 defaults: new typography",
                className: "bp-next token-compatibility-heading-column token-compatibility-bp7-defaults",
            })}
            {renderHeadingTokenComparison({
                label: "NHS public-token theme",
                className: "bp-next token-compatibility-heading-column token-compatibility-nhsd-theme",
            })}
        </Flex>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const baselineRegion = canvas.getByRole("region", { name: "BP6 baseline" });
        const defaultRegion = canvas.getByRole("region", { name: /BP7 defaults:/ });
        const nhsdRegion = canvas.getByRole("region", { name: "NHS public-token theme" });
        const baselineHeadings = within(baselineRegion).getAllByRole("heading");
        const defaultHeadings = within(defaultRegion).getAllByRole("heading");
        const nhsdHeadings = within(nhsdRegion).getAllByRole("heading");
        const isNhsMobileScale = window.matchMedia("(max-width: 63.999rem)").matches;
        const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);

        await expect(baselineHeadings.map(heading => getComputedStyle(heading).fontSize)).toEqual([
            "36px",
            "28px",
            "22px",
            "18px",
            "16px",
            "14px",
        ]);
        await expect(defaultHeadings.map(heading => getComputedStyle(heading).fontSize)).toEqual([
            "48px",
            "28px",
            "24px",
            "20px",
            "16px",
            "14px",
        ]);
        await expect(nhsdHeadings.map(heading => getComputedStyle(heading).fontSize)).toEqual(
            isNhsMobileScale
                ? ["36px", "30px", "26px", "22px", "18px", "16px"]
                : ["48px", "36px", "30px", "26px", "22px", "18px"],
        );

        await expect(defaultHeadings.every(heading => getComputedStyle(heading).fontFamily.includes("Inter"))).toBe(
            true,
        );
        await expect(nhsdHeadings.every(heading => getComputedStyle(heading).fontFamily.includes("Frutiger W01"))).toBe(
            true,
        );
        await expect(defaultHeadings.every(heading => getComputedStyle(heading).fontWeight === "500")).toBe(true);
        await expect(nhsdHeadings.every(heading => getComputedStyle(heading).fontWeight === "600")).toBe(true);

        await expect(defaultHeadings.map(heading => getComputedStyle(heading).lineHeight)).toEqual(
            baselineHeadings.map(heading => getComputedStyle(heading).lineHeight),
        );
        await expect(defaultHeadings.map(heading => getComputedStyle(heading).letterSpacing)).toEqual(
            baselineHeadings.map(heading => getComputedStyle(heading).letterSpacing),
        );
        await expect(defaultHeadings.map(heading => getComputedStyle(heading).marginBlockEnd)).toEqual(
            baselineHeadings.map(heading => getComputedStyle(heading).marginBlockEnd),
        );
        await expect(
            nhsdHeadings.map(heading => {
                const styles = getComputedStyle(heading);
                return Number((Number.parseFloat(styles.lineHeight) / Number.parseFloat(styles.fontSize)).toFixed(4));
            }),
        ).toEqual(
            isNhsMobileScale
                ? [1.1665, 1.1337, 1.1927, 1.2275, 1.3125, 1.3125]
                : [1.2, 1.1667, 1.2005, 1.1927, 1.3125, 1.3125],
        );
        await expect(
            nhsdHeadings.map(heading =>
                Number((Number.parseFloat(getComputedStyle(heading).letterSpacing) / rootFontSize).toFixed(5)),
            ),
        ).toEqual(
            isNhsMobileScale
                ? [-0.0277, -0.01666, -0.01666, -0.01666, -0.01666, -0.01666]
                : [-0.125, -0.063, -0.063, -0.0277, -0.0277, -0.0277],
        );
        await expect(nhsdHeadings.map(heading => getComputedStyle(heading).marginBlockEnd)).toEqual(
            Array.from({ length: headingLevels.length }, () => (isNhsMobileScale ? "15px" : "20px")),
        );
    },
};
