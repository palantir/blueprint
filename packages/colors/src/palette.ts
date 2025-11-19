/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Blueprint color palette with light and dark mode support.
 *
 * Individual color families are exported for optimal tree-shaking.
 * Each color family includes a full scale from 100-1000.
 *
 * Dark mode variants only override values that differ from light mode.
 *
 * @packageDocumentation
 */

/* eslint-disable sort-keys */

// Grey color family - Light mode
export const grey = {
    100: "#dfe0e2",
    200: "#c2c6cb",
    300: "#c0c2c5",
    400: "#85898f",
    500: "#696e75",
    600: "#4e535b",
    700: "#353b43",
    800: "#1d232d",
    900: "#080e17",
    1000: "#000105",
} as const;

// Grey color family - Dark mode (only overrides differing values)
export const greyDark = {
    ...grey,
    700: "#30333a",
    800: "#1d2128",
    1000: "#060b13",
} as const;

// Black alpha variants - Light mode
export const black = {
    100: "#00010505",
    200: "#0001051a",
    300: "#00010533",
    400: "#0001054d",
    500: "#00010580",
    600: "#000105cc",
    700: "#000105d9",
    800: "#000105e6",
    900: "#000105f2",
    1000: "#000105ff",
} as const;

// Black alpha variants - Dark mode (only overrides differing values)
export const blackDark = {
    ...black,
    100: "#00010508",
} as const;

// White alpha variants - Light mode
export const white = {
    100: "#ffffff0f",
    200: "#ffffff1a",
    300: "#ffffff33",
    400: "#ffffff4d",
    500: "#ffffff80",
    600: "#ffffffcc",
    700: "#ffffffd9",
    800: "#ffffffe6",
    900: "#fffffff2",
    1000: "#ffffffff",
} as const;

// White alpha variants - Dark mode (only overrides differing values)
export const whiteDark = {
    ...white,
    100: "#ffffff08",
    200: "#ffffff14",
    300: "#ffffff24",
} as const;

// Red color family - Light mode
export const red = {
    100: "#f7dad9",
    200: "#edb5b5",
    300: "#e19191",
    400: "#d36b6f",
    500: "#c2424d",
    600: "#98323a",
    700: "#6f2229",
    800: "#491418",
    900: "#270709",
    1000: "#080101",
} as const;

// Red color family - Dark mode (same as light)
export const redDark = { ...red } as const;

// Blue color family - Light mode
export const blue = {
    100: "#d5e3f8",
    200: "#abc7f0",
    300: "#82ace7",
    400: "#598fdd",
    500: "#2d72d2",
    600: "#2158a4",
    700: "#163f79",
    800: "#0b2850",
    900: "#03122b",
    1000: "#00030a",
} as const;

// Blue color family - Dark mode (same as light)
export const blueDark = { ...blue } as const;

// Green color family - Light mode
export const green = {
    100: "#d4e9d6",
    200: "#aad3ae",
    300: "#7fbc87",
    400: "#51a660",
    500: "#008f37",
    600: "#006f29",
    700: "#00511c",
    800: "#00340f",
    900: "#001a05",
    1000: "#000401",
} as const;

// Green color family - Dark mode (same as light)
export const greenDark = { ...green } as const;

// Indigo color family - Light mode
export const indigo = {
    100: "#dedbf3",
    200: "#bfb8e6",
    300: "#a196d9",
    400: "#8473ca",
    500: "#6a4fba",
    600: "#523c91",
    700: "#3a2a6a",
    800: "#241946",
    900: "#100a25",
    1000: "#020107",
} as const;

// Indigo color family - Dark mode (only overrides differing values)
export const indigoDark = {
    ...indigo,
    1000: "#000301",
} as const;

// Orange color family - Light mode
export const orange = {
    100: "#f5ddd1",
    200: "#e9bba4",
    300: "#dc9977",
    400: "#cd7649",
    500: "#bd5200",
    600: "#943e00",
    700: "#6c2c00",
    800: "#471a00",
    900: "#250a00",
    1000: "#080100",
} as const;

// Orange color family - Dark mode (same as light)
export const orangeDark = { ...orange } as const;

// Turquoise color family - Light mode
export const turquoise = {
    100: "#d5e7e3",
    200: "#aad0c8",
    300: "#7fb8ad",
    400: "#51a193",
    500: "#008a7a",
    600: "#006b5e",
    700: "#004e44",
    800: "#00322b",
    900: "#001814",
    1000: "#000403",
} as const;

// Turquoise color family - Dark mode (same as light)
export const turquoiseDark = { ...turquoise } as const;

// Gold color family - Light mode
export const gold = {
    100: "#ece1d1",
    200: "#d8c3a5",
    300: "#c5a678",
    400: "#b28949",
    500: "#9e6c00",
    600: "#7b5300",
    700: "#5a3b00",
    800: "#3a2500",
    900: "#1e1100",
    1000: "#050200",
} as const;

// Gold color family - Dark mode (same as light)
export const goldDark = { ...gold } as const;

// Internal combined palettes
const paletteBase = {
    grey,
    black,
    white,
    red,
    blue,
    green,
    indigo,
    orange,
    turquoise,
    gold,
} as const;

const paletteDark = {
    greyDark,
    blackDark,
    whiteDark,
    redDark,
    blueDark,
    greenDark,
    indigoDark,
    orangeDark,
    turquoiseDark,
    goldDark,
} as const;

// Type exports
export interface Color {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    1000: string;
}

export type PaletteColor = keyof Color;
export type PaletteColorFamily = keyof typeof paletteBase;
export type PaletteColorValue = (typeof paletteBase)[PaletteColorFamily][PaletteColor];
/**
 * Main Palette export.
 * Provides base, light, and dark variants.
 */
export const palette = {
    base: paletteBase,
    light: paletteBase,
    dark: paletteDark,
} as const;
