/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import type * as React from "react";

type SpacingRange = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type SizeRange = 25 | 50 | 75 | 100;

export const ColorMap = {
    // gray scale
    BLACK: "black",

    DARK_GRAY1: "dark-gray-1",
    DARK_GRAY2: "dark-gray-2",
    DARK_GRAY3: "dark-gray-3",
    DARK_GRAY4: "dark-gray-4",
    DARK_GRAY5: "dark-gray-5",

    GRAY1: "gray-1",
    GRAY2: "gray-2",
    GRAY3: "gray-3",
    GRAY4: "gray-4",
    GRAY5: "gray-5",

    LIGHT_GRAY1: "light-gray-1",
    LIGHT_GRAY2: "light-gray-2",
    LIGHT_GRAY3: "light-gray-3",
    LIGHT_GRAY4: "light-gray-4",
    LIGHT_GRAY5: "light-gray-5",

    WHITE: "white",

    // core colors
    BLUE1: "blue-1",
    BLUE2: "blue-2",
    BLUE3: "blue-3",
    BLUE4: "blue-4",
    BLUE5: "blue-5",

    GREEN1: "green-1",
    GREEN2: "green-2",
    GREEN3: "green-3",
    GREEN4: "green-4",
    GREEN5: "green-5",

    ORANGE1: "orange-1",
    ORANGE2: "orange-2",
    ORANGE3: "orange-3",
    ORANGE4: "orange-4",
    ORANGE5: "orange-5",

    RED1: "red-1",
    RED2: "red-2",
    RED3: "red-3",
    RED4: "red-4",
    RED5: "red-5",

    CERULEAN1: "cerulean-1",
    CERULEAN2: "cerulean-2",
    CERULEAN3: "cerulean-3",
    CERULEAN4: "cerulean-4",
    CERULEAN5: "cerulean-5",

    FOREST1: "forest-1",
    FOREST2: "forest-2",
    FOREST3: "forest-3",
    FOREST4: "forest-4",
    FOREST5: "forest-5",

    GOLD1: "gold-1",
    GOLD2: "gold-2",
    GOLD3: "gold-3",
    GOLD4: "gold-4",
    GOLD5: "gold-5",

    INDIGO1: "indigo-1",
    INDIGO2: "indigo-2",
    INDIGO3: "indigo-3",
    INDIGO4: "indigo-4",
    INDIGO5: "indigo-5",

    LIME1: "lime-1",
    LIME2: "lime-2",
    LIME3: "lime-3",
    LIME4: "lime-4",
    LIME5: "lime-5",

    ROSE1: "rose-1",
    ROSE2: "rose-2",
    ROSE3: "rose-3",
    ROSE4: "rose-4",
    ROSE5: "rose-5",

    SEPIA1: "sepia-1",
    SEPIA2: "sepia-2",
    SEPIA3: "sepia-3",
    SEPIA4: "sepia-4",
    SEPIA5: "sepia-5",

    TURQUOISE1: "turquoise-1",
    TURQUOISE2: "turquoise-2",
    TURQUOISE3: "turquoise-3",
    TURQUOISE4: "turquoise-4",
    TURQUOISE5: "turquoise-5",

    VERMILION1: "vermilion-1",
    VERMILION2: "vermilion-2",
    VERMILION3: "vermilion-3",
    VERMILION4: "vermilion-4",
    VERMILION5: "vermilion-5",

    VIOLET1: "violet-1",
    VIOLET2: "violet-2",
    VIOLET3: "violet-3",
    VIOLET4: "violet-4",
    VIOLET5: "violet-5",
} as const;

export type Color = (typeof ColorMap)[keyof typeof ColorMap];

export type Gap = SpacingRange | `${SpacingRange}`;

export type Margin = SpacingRange | `${SpacingRange}` | "auto";

export type Padding = SpacingRange | `${SpacingRange}`;

export type Width = SizeRange | `${SizeRange}` | "auto";

export type Height = SizeRange | `${SizeRange}` | "auto";

export type Top = SpacingRange | `${SpacingRange}`;

export type Right = SpacingRange | `${SpacingRange}`;

export type Bottom = SpacingRange | `${SpacingRange}`;

export type Left = SpacingRange | `${SpacingRange}`;

export type AlignContent =
    | "start"
    | "end"
    | "center"
    | "between"
    | "around"
    | "evenly"
    | "normal"
    | "baseline"
    | "stretch";

export type AlignItems = "start" | "end" | "center" | "baseline" | "stretch";

export type AlignSelf = "auto" | "start" | "end" | "center" | "baseline" | "stretch";

export type Display =
    | "block"
    | "inline-block"
    | "inline"
    | "flex"
    | "inline-flex"
    | "grid"
    | "inline-grid"
    | "table"
    | "inline-table"
    | "table-row-group"
    | "table-header-group"
    | "table-footer-group"
    | "table-row"
    | "table-cell"
    | "table-column"
    | "table-column-group"
    | "table-caption"
    | "list-item"
    | "contents"
    | "none";

export type Flex = 1 | "1" | "auto" | "initial" | "none";

export type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";

export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";

export type JustifyContent = "start" | "end" | "center" | "between" | "around" | "evenly" | "normal" | "stretch";

export type JustifyItems = "start" | "end" | "center" | "stretch";

export type JustifySelf = "auto" | "start" | "end" | "center" | "stretch";

export type Position = "static" | "absolute" | "relative" | "fixed" | "sticky";

export interface BoxOwnProps {
    color?: Color;
    bg?: Color;

    gap?: Gap;

    m?: Margin;
    mt?: Margin;
    mr?: Margin;
    mb?: Margin;
    ml?: Margin;
    mx?: Margin;
    my?: Margin;

    p?: Padding;
    pt?: Padding;
    pr?: Padding;
    pb?: Padding;
    pl?: Padding;
    px?: Padding;
    py?: Padding;

    w?: Width;
    h?: Height;

    top?: Top;
    right?: Right;
    bottom?: Bottom;
    left?: Left;

    alignContent?: AlignContent;
    alignItems?: AlignItems;
    alignSelf?: AlignSelf;
    display?: Display;
    flex?: Flex;
    flexDirection?: FlexDirection;
    flexWrap?: FlexWrap;
    justifyContent?: JustifyContent;
    justifyItems?: JustifyItems;
    justifySelf?: JustifySelf;
    position?: Position;
}

export type AsProp<T extends React.ElementType> = {
    as?: T;
};

export type BoxProps<T extends React.ElementType = "div"> = BoxOwnProps &
    AsProp<T> &
    Omit<React.ComponentPropsWithoutRef<T>, keyof BoxOwnProps>;
