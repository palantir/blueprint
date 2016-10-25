/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as classNames from "classnames";
import * as React from "react";

import { Colors } from "@blueprint/core";

import { ClickToCopy } from "../common/clickToCopy";

function expand(color: string) {
    return [`${color}1`, `${color}2`, `${color}3`, `${color}4`, `${color}5`];
}

function getHexCode(color: string) {
    if (/^#/.test(color)) {
        return color.toUpperCase();
    } else {
        return (Colors as any)[color.toUpperCase().replace(/-/g, "_")];
    }
}

// returns luminance (L in HSL) of given hex color
// @see http://stackoverflow.com/a/12043228/6342931
function getLuminance(hex: string) {
    const rgb = parseInt(hex.substring(1), 16); // convert rrggbb to decimal
    // tslint:disable:no-bitwise
    const red = (rgb >> 16) & 0xff;
    const green = (rgb >> 8) & 0xff;
    const blue = (rgb >> 0) & 0xff;
    // tslint:enable:no-bitwise
    const luma = 0.2126 * red + 0.7152 * green + 0.0722 * blue; // per ITU-R BT.709
    return luma;
}

// luminance value 0..255 below which a color is considered "dark" (needs white text).
// this value was hand-chosen to produce optimal results for every BP color.
const DARK_LUMA_CUTOFF = 111;

// a single swatch of color, name on left & hex on right. click to copy hex.
const ColorSwatch: React.SFC<{ colorName: string, hexCode: string }> = ({ colorName, hexCode }) => {
    const style = {
        backgroundColor: hexCode,
        color: (getLuminance(hexCode) < DARK_LUMA_CUTOFF ? Colors.WHITE : Colors.BLACK),
    };
    return (
        <ClickToCopy className="docs-color-swatch" style={style} value={hexCode}>
            <div className="docs-color-swatch-trigger docs-clipboard-message" data-message={hexCode}>
                <span>@{colorName}</span>
            </div>
        </ClickToCopy>
    );
};

// vertical list of swatches for each color
const ColorPalette: React.SFC<{ colors: string[] }> = ({ colors }) => (
    <div className={classNames("docs-color-palette", { "docs-color-palette-single": colors.length === 1 })}>
        {colors.map((name, i) => <ColorSwatch colorName={name} hexCode={getHexCode(name)} key={i} />)}
    </div>
);

// horizontal list of swatches for each color
// no text in swatch; display all hex codes underneath
export const ColorBar: React.SFC<{ colors: string[] }> = ({ colors }) => {
    const hexString = colors.map(getHexCode).join(", ");
    const jsonString = `[${colors.map((c) => `"${getHexCode(c)}"`).join(", ")}]`;

    const swatches = colors.map((name, i) => (
        <div className="docs-color-swatch" key={i} style={{ backgroundColor: getHexCode(name) }} />
    ));

    return (
        <ClickToCopy value={jsonString}>
            <div className="docs-color-bar">
                <div className="docs-color-bar-swatches">
                    {swatches}
                </div>
                <pre
                    className="docs-color-bar-hexes docs-clipboard-message pt-text-overflow-ellipsis"
                    data-hover-message="Click to copy JSON array of hex colors"
                    data-message={hexString}
                />
            </div>
        </ClickToCopy>
    );
};

// a group of ColorPalettes, arranged by default in two columns
function createPaletteBook(palettes: string[][], className?: string): React.SFC<{}> {
    return () => (
        <section className={classNames("docs-color-book", className)}>
            {palettes.map((palette, index) => <ColorPalette colors={palette} key={index} />)}
        </section>
    );
}

export const GrayscalePalette = createPaletteBook([
    ["black"],
    ["white"],
    expand("dark-gray"),
    expand("gray"),
    expand("light-gray"),
], "docs-color-book-grayscale");

export const CoreColorsPalette = createPaletteBook([
    expand("blue"),
    expand("green"),
    expand("orange"),
    expand("red"),
]);

export const ExtendedColorsPalette = createPaletteBook([
    expand("vermilion"),
    expand("rose"),
    expand("violet"),
    expand("indigo"),
    expand("cobalt"),
    expand("turquoise"),
    expand("forest"),
    expand("lime"),
    expand("gold"),
    expand("sepia"),
]);
