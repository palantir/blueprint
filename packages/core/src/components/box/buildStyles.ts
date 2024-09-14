/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

/* tslint:disable:object-literal-sort-keys */

import {
    type AlignContent,
    type AlignItems,
    type AlignSelf,
    type Bottom,
    type Color,
    ColorMap,
    type Display,
    type Flex,
    type FlexDirection,
    type FlexWrap,
    type Gap,
    type Height,
    type JustifyContent,
    type JustifyItems,
    type JustifySelf,
    type Left,
    type Margin,
    type Padding,
    type Position,
    type Right,
    type Top,
    type Width,
} from "./boxProps";

function appendValue<T>(prefix: string) {
    return (value: T) => `${prefix}-${value}`;
}

function mapping<T extends string | number | symbol>(styleMap: Record<T, string>) {
    return (value: T) => styleMap[value];
}

function identity<T>(value: T) {
    return value;
}

const bgColorMap: Record<string, string> = Object.fromEntries(
    Object.values(ColorMap).map(color => [color, `bg-${color}`]),
);
const bg = mapping<Color>(bgColorMap);

const gap = appendValue<Gap>("gap");

const margin = appendValue<Margin>("margin");
const marginX = appendValue<Margin>("margin-x");
const marginY = appendValue<Margin>("margin-y");
const marginStart = appendValue<Margin>("margin-start");
const marginEnd = appendValue<Margin>("margin-end");
const marginTop = appendValue<Margin>("margin-top");
const marginRight = appendValue<Margin>("margin-right");
const marginBottom = appendValue<Margin>("margin-bottom");
const marginLeft = appendValue<Margin>("margin-left");

const padding = appendValue<Padding>("padding");
const paddingX = appendValue<Padding>("padding-x");
const paddingY = appendValue<Padding>("padding-y");
const paddingStart = appendValue<Padding>("padding-start");
const paddingEnd = appendValue<Padding>("padding-end");
const paddingTop = appendValue<Padding>("padding-top");
const paddingRight = appendValue<Padding>("padding-right");
const paddingBottom = appendValue<Padding>("padding-bottom");
const paddingLeft = appendValue<Padding>("padding-left");

const width = mapping<Width>({
    25: "width-25",
    50: "width-50",
    75: "width-75",
    100: "width-100",
    auto: "width-auto",
});

const height = mapping<Height>({
    25: "height-25",
    50: "height-50",
    75: "height-75",
    100: "height-100",
    auto: "height-auto",
});

const top = appendValue<Top>("top");
const right = appendValue<Right>("right");
const bottom = appendValue<Bottom>("bottom");
const left = appendValue<Left>("left");

const alignContent = mapping<AlignContent>({
    start: "content-start",
    end: "content-end",
    center: "content-center",
    between: "content-between",
    around: "content-around",
    evenly: "content-evenly",
    normal: "content-normal",
    baseline: "content-baseline",
    stretch: "content-stretch",
});

const alignItems = mapping<AlignItems>({
    start: "items-start",
    end: "items-end",
    center: "items-center",
    baseline: "items-baseline",
    stretch: "items-stretch",
});

const alignSelf = mapping<AlignSelf>({
    auto: "self-auto",
    start: "self-start",
    end: "self-end",
    center: "self-center",
    baseline: "self-baseline",
    stretch: "self-stretch",
});

const display = mapping<Display>({
    block: "block",
    "inline-block": "inline-block",
    inline: "inline",
    flex: "flex",
    "inline-flex": "inline-flex",
    grid: "grid",
    "inline-grid": "inline-grid",
    table: "table",
    "inline-table": "inline-table",
    "table-row-group": "table-row-group",
    "table-header-group": "table-header-group",
    "table-footer-group": "table-footer-group",
    "table-row": "table-row",
    "table-cell": "table-cell",
    "table-column": "table-column",
    "table-column-group": "table-column-group",
    "table-caption": "table-caption",
    "list-item": "list-item",
    contents: "contents",
    none: "none",
});

const flex = mapping<Flex>({
    "1": "flex-1",
    auto: "flex-auto",
    initial: "flex-initial",
    none: "flex-none",
});

const flexDirection = mapping<FlexDirection>({
    row: "flex-row",
    "row-reverse": "flex-row-reverse",
    column: "flex-column",
    "column-reverse": "flex-column-reverse",
});

const flexWrap = mapping<FlexWrap>({
    nowrap: "flex-nowrap",
    wrap: "flex-wrap",
    "wrap-reverse": "flex-wrap-reverse",
});

const justifyContent = mapping<JustifyContent>({
    start: "justify-start",
    end: "justify-end",
    center: "justify-center",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
    normal: "justify-normal",
    stretch: "justify-stretch",
});

const justifyItems = mapping<JustifyItems>({
    start: "justify-items-start",
    end: "justify-items-end",
    center: "justify-items-center",
    stretch: "justify-items-stretch",
});

const justifySelf = mapping<JustifySelf>({
    auto: "justify-self-auto",
    start: "justify-self-start",
    end: "justify-self-end",
    center: "justify-self-center",
    stretch: "justify-self-stretch",
});

const position = mapping<Position>({
    static: "static",
    relative: "relative",
    absolute: "absolute",
    fixed: "fixed",
    sticky: "sticky",
});

const styles: Record<string, (value: any) => string> = {
    color: identity,
    bg,

    gap,

    m: margin,
    mx: marginX,
    my: marginY,
    ms: marginStart,
    me: marginEnd,
    mt: marginTop,
    mr: marginRight,
    mb: marginBottom,
    ml: marginLeft,

    p: padding,
    px: paddingX,
    py: paddingY,
    ps: paddingStart,
    pe: paddingEnd,
    pt: paddingTop,
    pr: paddingRight,
    pb: paddingBottom,
    pl: paddingLeft,

    w: width,
    h: height,

    top,
    right,
    bottom,
    left,

    alignContent,
    alignItems,
    alignSelf,
    display,
    flex,
    flexDirection,
    flexWrap,
    justifyContent,
    justifyItems,
    justifySelf,
    position,
};

export function buildStyles<T extends Record<string, any>>(props: T) {
    const classNames = new Set<string>();
    const passThroughProps: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(props)) {
        if (Object.prototype.hasOwnProperty.call(styles, key)) {
            const className = styles[key]?.(value);
            if (className != null) {
                classNames.add(className);
            }
        } else {
            passThroughProps[key] = value;
        }
    }

    return { generatedClassNames: Array.from(classNames), passThroughProps };
}
