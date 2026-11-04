/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

export type Version = "original" | "existing" | "semantic";
export type Scheme = "light" | "dark";

export const VERSIONS: Record<Version, string> = {
    existing: "Existing tokens + dark roles",
    original: "Original Sass",
    semantic: "Semantic API",
};

export interface ColorNote {
    after: string;
    before: string;
    changed: boolean;
    label: string;
}

export function getColorNotes(
    scheme: Scheme,
    version: Version,
    vertical: boolean,
    selectedDisabled: boolean,
): ColorNote[] {
    const dark = scheme === "dark";
    const semantic = version === "semantic";
    const selected = dark ? "Blue5" : "Blue2";
    const strong = dark ? "Blue5" : "Blue1";
    const indicator = vertical ? "Blue3 · 20%" : selected;
    const note = (label: string, before: string, after = before): ColorNote => ({
        after,
        before,
        changed: before !== after,
        label,
    });
    if (selectedDisabled) {
        return [
            note(
                "Selected + disabled text / icon",
                `${selected} · 100%`,
                semantic ? `${strong} · 50%` : `${selected} · 100%`,
            ),
            note(vertical ? "Selection fill" : "Underline", indicator),
        ];
    }
    return [
        note("Selected text / icon", selected, semantic ? strong : selected),
        note(vertical ? "Selection fill" : "Underline", indicator),
        note("Hover text / icon", selected),
        note(
            "Disabled text / icon",
            dark ? "Gray4 · 60%" : "Gray1 · 60%",
            semantic ? `${dark ? "Gray4" : "Gray1"} · 50%` : undefined,
        ),
    ];
}
