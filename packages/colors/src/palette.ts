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
export const Grey = {
    GREY_100: "#dfe0e2",
    GREY_200: "#c2c6cb",
    GREY_300: "#c0c2c5",
    GREY_400: "#85898f",
    GREY_500: "#696e75",
    GREY_600: "#4e535b",
    GREY_700: "#353b43",
    GREY_800: "#1d232d",
    GREY_900: "#080e17",
    GREY_1000: "#000105",
} as const;

// Grey color family - Dark mode (only overrides differing values)
export const GreyDark = {
    ...Grey,
    GREY_700: "#30333a",
    GREY_800: "#1d2128",
    GREY_1000: "#060b13",
} as const;

// Black alpha variants - Light mode
export const Black = {
    BLACK_100: "#00010505",
    BLACK_200: "#0001051a",
    BLACK_300: "#00010533",
    BLACK_400: "#0001054d",
    BLACK_500: "#00010580",
    BLACK_600: "#000105cc",
    BLACK_700: "#000105d9",
    BLACK_800: "#000105e6",
    BLACK_900: "#000105f2",
    BLACK_1000: "#000105ff",
} as const;

// Black alpha variants - Dark mode (only overrides differing values)
export const BlackDark = {
    ...Black,
    BLACK_100: "#00010508",
} as const;

// White alpha variants - Light mode
export const White = {
    WHITE_100: "#ffffff0f",
    WHITE_200: "#ffffff1a",
    WHITE_300: "#ffffff33",
    WHITE_400: "#ffffff4d",
    WHITE_500: "#ffffff80",
    WHITE_600: "#ffffffcc",
    WHITE_700: "#ffffffd9",
    WHITE_800: "#ffffffe6",
    WHITE_900: "#fffffff2",
    WHITE_1000: "#ffffffff",
} as const;

// White alpha variants - Dark mode (only overrides differing values)
export const WhiteDark = {
    ...White,
    WHITE_100: "#ffffff08",
    WHITE_200: "#ffffff14",
    WHITE_300: "#ffffff24",
} as const;

// Red color family - Light mode
export const Red = {
    RED_100: "#f7dad9",
    RED_200: "#edb5b5",
    RED_300: "#e19191",
    RED_400: "#d36b6f",
    RED_500: "#c2424d",
    RED_600: "#98323a",
    RED_700: "#6f2229",
    RED_800: "#491418",
    RED_900: "#270709",
    RED_1000: "#080101",
} as const;

// Red color family - Dark mode (same as light)
export const RedDark = { ...Red } as const;

// Blue color family - Light mode
export const Blue = {
    BLUE_100: "#d5e3f8",
    BLUE_200: "#abc7f0",
    BLUE_300: "#82ace7",
    BLUE_400: "#598fdd",
    BLUE_500: "#2d72d2",
    BLUE_600: "#2158a4",
    BLUE_700: "#163f79",
    BLUE_800: "#0b2850",
    BLUE_900: "#03122b",
    BLUE_1000: "#00030a",
} as const;

// Blue color family - Dark mode (same as light)
export const BlueDark = { ...Blue } as const;

// Green color family - Light mode
export const Green = {
    GREEN_100: "#d4e9d6",
    GREEN_200: "#aad3ae",
    GREEN_300: "#7fbc87",
    GREEN_400: "#51a660",
    GREEN_500: "#008f37",
    GREEN_600: "#006f29",
    GREEN_700: "#00511c",
    GREEN_800: "#00340f",
    GREEN_900: "#001a05",
    GREEN_1000: "#000401",
} as const;

// Green color family - Dark mode (same as light)
export const GreenDark = { ...Green } as const;

// Indigo color family - Light mode
export const Indigo = {
    INDIGO_100: "#dedbf3",
    INDIGO_200: "#bfb8e6",
    INDIGO_300: "#a196d9",
    INDIGO_400: "#8473ca",
    INDIGO_500: "#6a4fba",
    INDIGO_600: "#523c91",
    INDIGO_700: "#3a2a6a",
    INDIGO_800: "#241946",
    INDIGO_900: "#100a25",
    INDIGO_1000: "#020107",
} as const;

// Indigo color family - Dark mode (only overrides differing values)
export const IndigoDark = {
    ...Indigo,
    INDIGO_1000: "#000301",
} as const;

// Orange color family - Light mode
export const Orange = {
    ORANGE_100: "#f5ddd1",
    ORANGE_200: "#e9bba4",
    ORANGE_300: "#dc9977",
    ORANGE_400: "#cd7649",
    ORANGE_500: "#bd5200",
    ORANGE_600: "#943e00",
    ORANGE_700: "#6c2c00",
    ORANGE_800: "#471a00",
    ORANGE_900: "#250a00",
    ORANGE_1000: "#080100",
} as const;

// Orange color family - Dark mode (same as light)
export const OrangeDark = { ...Orange } as const;

// Turquoise color family - Light mode
export const Turquoise = {
    TURQUOISE_100: "#d5e7e3",
    TURQUOISE_200: "#aad0c8",
    TURQUOISE_300: "#7fb8ad",
    TURQUOISE_400: "#51a193",
    TURQUOISE_500: "#008a7a",
    TURQUOISE_600: "#006b5e",
    TURQUOISE_700: "#004e44",
    TURQUOISE_800: "#00322b",
    TURQUOISE_900: "#001814",
    TURQUOISE_1000: "#000403",
} as const;

// Turquoise color family - Dark mode (same as light)
export const TurquoiseDark = { ...Turquoise } as const;

// Gold color family - Light mode
export const Gold = {
    GOLD_100: "#ece1d1",
    GOLD_200: "#d8c3a5",
    GOLD_300: "#c5a678",
    GOLD_400: "#b28949",
    GOLD_500: "#9e6c00",
    GOLD_600: "#7b5300",
    GOLD_700: "#5a3b00",
    GOLD_800: "#3a2500",
    GOLD_900: "#1e1100",
    GOLD_1000: "#050200",
} as const;

// Gold color family - Dark mode (same as light)
export const GoldDark = { ...Gold } as const;

// Type exports following Blueprint conventions
export type Grey = (typeof Grey)[keyof typeof Grey];
export type GreyDark = (typeof GreyDark)[keyof typeof GreyDark];
export type Black = (typeof Black)[keyof typeof Black];
export type BlackDark = (typeof BlackDark)[keyof typeof BlackDark];
export type White = (typeof White)[keyof typeof White];
export type WhiteDark = (typeof WhiteDark)[keyof typeof WhiteDark];
export type Red = (typeof Red)[keyof typeof Red];
export type RedDark = (typeof RedDark)[keyof typeof RedDark];
export type Blue = (typeof Blue)[keyof typeof Blue];
export type BlueDark = (typeof BlueDark)[keyof typeof BlueDark];
export type Green = (typeof Green)[keyof typeof Green];
export type GreenDark = (typeof GreenDark)[keyof typeof GreenDark];
export type Indigo = (typeof Indigo)[keyof typeof Indigo];
export type IndigoDark = (typeof IndigoDark)[keyof typeof IndigoDark];
export type Orange = (typeof Orange)[keyof typeof Orange];
export type OrangeDark = (typeof OrangeDark)[keyof typeof OrangeDark];
export type Turquoise = (typeof Turquoise)[keyof typeof Turquoise];
export type TurquoiseDark = (typeof TurquoiseDark)[keyof typeof TurquoiseDark];
export type Gold = (typeof Gold)[keyof typeof Gold];
export type GoldDark = (typeof GoldDark)[keyof typeof GoldDark];

// Internal combined palettes
const paletteLight = {
    ...Grey,
    ...Black,
    ...White,
    ...Red,
    ...Blue,
    ...Green,
    ...Indigo,
    ...Orange,
    ...Turquoise,
    ...Gold,
} as const;

const paletteDark = {
    ...GreyDark,
    ...BlackDark,
    ...WhiteDark,
    ...RedDark,
    ...BlueDark,
    ...GreenDark,
    ...IndigoDark,
    ...OrangeDark,
    ...TurquoiseDark,
    ...GoldDark,
} as const;

/**
 * Main Palette export for backwards compatibility.
 * Provides BASE, LIGHT, and DARK variants.
 */
export const Palette = {
    BASE: paletteLight,
    LIGHT: paletteLight,
    DARK: paletteDark,
} as const;
