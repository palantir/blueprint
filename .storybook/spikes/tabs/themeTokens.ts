/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { TokenEditor } from "../../tokens/tokens";

const color = (defaultCssValue: string): TokenEditor => ({
    control: {},
    defaultCssValue,
    toControlValue: value => value,
    toCssValue: value => value,
    type: "color",
});

/** Experimental roles appear only while reviewing the Tabs spike. */
export function getTabsTokenEditors(dark: boolean): Record<`--${string}`, TokenEditor> {
    // Keep the existing-token proposal before the semantic proposal in the panel.
    /* eslint-disable sort-keys */
    return {
        "--bp-typography-color-link": color(dark ? "#8abbff" : "#215db0"),
        "--bp-typography-color-muted-disabled": color(dark ? "#abb3bf99" : "#5f6b7c99"),
        "--bp-surface-background-color-primary-selected": color("#2d72d233"),
        "--bp-text-normal": color(dark ? "#f6f7f9" : "#1c2127"),
        "--bp-text-muted": color(dark ? "#abb3bf" : "#5f6b7c"),
        "--bp-primary-text-normal": color(dark ? "#8abbff" : "#215db0"),
        "--bp-primary-text-strong": color(dark ? "#8abbff" : "#184a90"),
        "--bp-primary-background-solid-rest": color("#2d72d2"),
        "--bp-primary-background-alpha-overlay-selected": color("#2d72d233"),
        "--bp-opacity-disabled": {
            control: { max: 1, min: 0, step: 0.05 },
            defaultCssValue: "0.5",
            toControlValue: value => Number.parseFloat(value),
            toCssValue: value => String(value),
            type: "range",
        },
    };
    /* eslint-enable sort-keys */
}
